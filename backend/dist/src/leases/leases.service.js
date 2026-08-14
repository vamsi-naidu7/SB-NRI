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
exports.LeasesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LeasesService = class LeasesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async requestLease(propertyId, nriId, data) {
        const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
        if (!property || property.ownerId !== nriId) {
            throw new common_1.ForbiddenException('You do not own this property');
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
    async recordPayment(leaseId, amount, rmId, userRoles) {
        if (!userRoles.includes('RELATIONSHIP_MANAGER') && !userRoles.includes('ADMIN')) {
            throw new common_1.ForbiddenException('Only RM or Admin can record lease payments');
        }
        return this.prisma.leasePayment.create({
            data: {
                leaseId,
                amount,
                date: new Date(),
            }
        });
    }
};
exports.LeasesService = LeasesService;
exports.LeasesService = LeasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeasesService);
//# sourceMappingURL=leases.service.js.map