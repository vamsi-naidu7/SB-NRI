import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PurchaseStatus } from '@prisma/client';

@Injectable()
export class PurchaseService {
  constructor(private prisma: PrismaService) {}

  async submitPurchaseDecision(propertyId: string, decision: boolean, userId: string) {
    const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
    if (!property || property.ownerId !== userId) {
      throw new ForbiddenException('Cannot make purchase decision for this property');
    }

    if (!decision) {
      return { message: 'Decision recorded: Do not proceed.' };
    }

    return this.prisma.purchaseProcessing.create({
      data: {
        propertyId,
        nriId: userId,
        rmId: property.rmId || '', // In reality, an RM should already be assigned
        status: PurchaseStatus.DECISION_PENDING,
      }
    });
  }

  async assignCA(purchaseId: string, caId: string, rmId: string, userRoles: string[]) {
    if (!userRoles.includes('RELATIONSHIP_MANAGER') && !userRoles.includes('ADMIN')) {
      throw new ForbiddenException('Only RM can assign CA');
    }

    return this.prisma.purchaseProcessing.update({
      where: { id: purchaseId },
      data: {
        caId,
        status: PurchaseStatus.CA_ASSIGNED,
      }
    });
  }

  async submitCAFindings(purchaseId: string, caId: string, findings: string) {
    const purchase = await this.prisma.purchaseProcessing.findUnique({ where: { id: purchaseId } });
    if (!purchase || purchase.caId !== caId) {
      throw new ForbiddenException('Not authorized for this CA task');
    }

    await this.prisma.purchaseProcessing.update({
      where: { id: purchaseId },
      data: { status: PurchaseStatus.CA_REVIEW }
    });

    return this.prisma.cAFinding.create({
      data: {
        purchaseId,
        caId,
        findings,
      }
    });
  }
}
