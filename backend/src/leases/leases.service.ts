import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeasesService {
  constructor(private prisma: PrismaService) {}

  async requestLease(propertyId: string, nriId: string, data: any) {
    const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
    if (!property || property.ownerId !== nriId) {
      throw new ForbiddenException('You do not own this property');
    }

    return this.prisma.lease.create({
      data: {
        propertyId,
        nriId,
        expectedRent: data.expectedRent,
        specialConditions: data.specialConditions,
      }
    });
  }

  async recordPayment(leaseId: string, amount: number, rmId: string, userRoles: string[]) {
    if (!userRoles.includes('RELATIONSHIP_MANAGER') && !userRoles.includes('ADMIN')) {
      throw new ForbiddenException('Only RM or Admin can record lease payments');
    }

    return this.prisma.leasePayment.create({
      data: {
        leaseId,
        amount,
        date: new Date(),
      }
    });
  }
  async findAll(userId: string, roles: string[]) {
    if (roles.includes('ADMIN') || roles.includes('RELATIONSHIP_MANAGER')) {
      return this.prisma.lease.findMany({
        include: { property: { include: { images: true } }, payments: true },
        orderBy: { id: 'desc' },
      });
    }
    return this.prisma.lease.findMany({
      where: { nriId: userId },
      include: { property: { include: { images: true } }, payments: true },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.lease.findUnique({
      where: { id },
      include: { property: { include: { images: true } }, payments: true },
    });
  }

  async updateStatus(id: string, status: any, rmId: string, userRoles: string[]) {
    if (!userRoles.includes('RELATIONSHIP_MANAGER') && !userRoles.includes('ADMIN')) {
      throw new ForbiddenException('Only RM or Admin can update lease status');
    }
    return this.prisma.lease.update({
      where: { id },
      data: { status },
    });
  }
}
