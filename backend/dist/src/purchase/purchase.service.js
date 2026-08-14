"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PurchaseService = class PurchaseService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitPurchaseDecision(propertyId, decision, userId) {
        const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
        if (!property || property.ownerId !== userId) {
            throw new common_1.ForbiddenException('Cannot make purchase decision for this property');
        }
        if (!decision) {
            return { message: 'Decision recorded: Do not proceed.' };
        }
        return this.prisma.purchaseProcessing.create({
            data: {
                propertyId,
                nriId: userId,
                rmId: property.rmId || '',
                status: client_1.PurchaseStatus.DECISION_PENDING,
            }
        });
    }
    async assignCA(purchaseId, caId, rmId, userRoles) {
        if (!userRoles.includes('RELATIONSHIP_MANAGER') && !userRoles.includes('ADMIN')) {
            throw new common_1.ForbiddenException('Only RM can assign CA');
        }
        return this.prisma.purchaseProcessing.update({
            where: { id: purchaseId },
            data: {
                caId,
                status: client_1.PurchaseStatus.CA_ASSIGNED,
            }
        });
    }
    async submitCAFindings(purchaseId, caId, findings) {
        const purchase = await this.prisma.purchaseProcessing.findUnique({ where: { id: purchaseId } });
        if (!purchase || purchase.caId !== caId) {
            throw new common_1.ForbiddenException('Not authorized for this CA task');
        }
        await this.prisma.purchaseProcessing.update({
            where: { id: purchaseId },
            data: { status: client_1.PurchaseStatus.CA_REVIEW }
        });
        return this.prisma.cAFinding.create({
            data: {
                purchaseId,
                caId,
                findings,
            }
        });
    }
};
exports.PurchaseService = PurchaseService;
exports.PurchaseService = PurchaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PurchaseService);
//# sourceMappingURL=purchase.service.js.map