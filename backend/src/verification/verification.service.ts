import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerificationStatus } from '@prisma/client';

@Injectable()
export class VerificationService {
  constructor(private prisma: PrismaService) {}

  async requestVerification(propertyId: string, userId: string) {
    const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');
    
    // Auto-select template based on property type
    const template = await this.prisma.verificationTemplate.findFirst({
      where: { propertyType: property.type },
      include: { categories: { include: { items: true } } }
    });

    if (!template) throw new NotFoundException('No verification template found for this property type');

    const request = await this.prisma.verificationRequest.create({
      data: {
        propertyId,
        requestedById: userId,
        status: VerificationStatus.REQUESTED,
        checklists: {
          create: template.categories.map(category => ({
            propertyId,
            items: {
              create: category.items.map(item => ({
                name: item.name,
              }))
            }
          }))
        }
      }
    });

    return request;
  }

  async finalizeVerificationItem(itemId: string, data: any, rmId: string, roles: string[]) {
    if (!roles.includes('RELATIONSHIP_MANAGER') && !roles.includes('ADMIN')) {
      throw new ForbiddenException('Only RM can finalize items');
    }

    return this.prisma.verificationChecklistItem.update({
      where: { id: itemId },
      data: {
        status: data.status,
        result: data.result,
        issue: data.issue,
        rmComment: data.rmComment,
        recommendation: data.recommendation,
        completedAt: new Date(),
      }
    });
  }

  async getVerificationStatus(propertyId: string) {
    // Only return the sanitized/finalized customer-facing data
    return this.prisma.verificationRequest.findFirst({
      where: { propertyId },
      include: {
        checklists: {
          include: {
            items: {
              select: {
                id: true,
                name: true,
                status: true,
                result: true,
                issue: true,
                rmComment: true,
                recommendation: true,
                completedAt: true,
              }
            }
          }
        }
      }
    });
  }
  async findAll(userId: string, roles: string[]) {
    if (roles.includes('ADMIN') || roles.includes('RELATIONSHIP_MANAGER')) {
      return this.prisma.verificationRequest.findMany({
        include: {
          property: { include: { images: true } },
          checklists: { include: { items: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }
    return this.prisma.verificationRequest.findMany({
      where: { requestedById: userId },
      include: {
        property: { include: { images: true } },
        checklists: { include: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
