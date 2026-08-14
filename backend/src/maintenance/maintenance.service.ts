import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  async createRequest(propertyId: string, nriId: string, data: any) {
    const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
    if (!property || property.ownerId !== nriId) {
      throw new ForbiddenException('You do not own this property');
    }

    return this.prisma.maintenanceRequest.create({
      data: {
        propertyId,
        nriId,
        description: data.description,
        priority: data.priority || 'NORMAL',
        images: data.images,
        videos: data.videos,
      }
    });
  }

  async updateStatus(requestId: string, status: any, rmId: string, userRoles: string[]) {
    if (!userRoles.includes('RELATIONSHIP_MANAGER') && !userRoles.includes('ADMIN')) {
      throw new ForbiddenException('Only RM or Admin can update status');
    }

    return this.prisma.maintenanceRequest.update({
      where: { id: requestId },
      data: { status }
    });
  }
  async findAll(userId: string, roles: string[]) {
    if (roles.includes('ADMIN') || roles.includes('RELATIONSHIP_MANAGER')) {
      return this.prisma.maintenanceRequest.findMany({
        include: { property: { include: { images: true } } },
        orderBy: { createdAt: 'desc' },
      });
    }
    return this.prisma.maintenanceRequest.findMany({
      where: { nriId: userId },
      include: { property: { include: { images: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.maintenanceRequest.findUnique({
      where: { id },
      include: { property: { include: { images: true } } },
    });
  }
}
