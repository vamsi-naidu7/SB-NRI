import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { RoleName } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: { email: string; passwordHash: string; firstName: string; lastName: string; role: RoleName; phone?: string }) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    let role = await this.prisma.role.findUnique({ where: { name: data.role } });
    if (!role) {
      role = await this.prisma.role.create({ data: { name: data.role } });
    }

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        roles: {
          create: {
            roleId: role.id
          }
        }
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: { include: { role: true } }
      }
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: { include: { role: true } }
      }
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    if (refreshToken) {
      refreshToken = await argon2.hash(refreshToken);
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
  async findAll() {
    return this.prisma.user.findMany({
      include: { roles: { include: { role: true } } },
    });
  }
}
