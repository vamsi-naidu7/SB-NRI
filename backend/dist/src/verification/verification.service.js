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
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let VerificationService = class VerificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async requestVerification(propertyId, userId) {
        const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
        if (!property)
            throw new common_1.NotFoundException('Property not found');
        const template = await this.prisma.verificationTemplate.findFirst({
            where: { propertyType: property.type },
            include: { categories: { include: { items: true } } }
        });
        if (!template)
            throw new common_1.NotFoundException('No verification template found for this property type');
        const request = await this.prisma.verificationRequest.create({
            data: {
                propertyId,
                requestedById: userId,
                status: client_1.VerificationStatus.REQUESTED,
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
    async finalizeVerificationItem(itemId, data, rmId, roles) {
        if (!roles.includes('RELATIONSHIP_MANAGER') && !roles.includes('ADMIN')) {
            throw new common_1.ForbiddenException('Only RM can finalize items');
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
    async getVerificationStatus(propertyId) {
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
};
exports.VerificationService = VerificationService;
exports.VerificationService = VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VerificationService);
//# sourceMappingURL=verification.service.js.map