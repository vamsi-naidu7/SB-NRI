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
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DocumentsService = class DocumentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async uploadDocument(data, userId) {
        return this.prisma.propertyDocument.create({
            data: {
                ...data,
                uploadedById: userId,
            }
        });
    }
    async grantAccess(documentId, professionalId, rmId, userRoles) {
        if (!userRoles.includes('RELATIONSHIP_MANAGER') && !userRoles.includes('ADMIN')) {
            throw new common_1.ForbiddenException('Only RM or Admin can grant access');
        }
        const doc = await this.prisma.propertyDocument.findUnique({ where: { id: documentId } });
        if (!doc)
            throw new common_1.NotFoundException('Document not found');
        const assignment = await this.prisma.verificationAssignment.findFirst({
            where: { propertyId: doc.propertyId, professionalId: professionalId }
        });
        if (!assignment && !userRoles.includes('ADMIN')) {
        }
        return this.prisma.documentAccess.create({
            data: {
                documentId,
                userId: professionalId,
                grantedById: rmId,
                accessType: 'READ',
            }
        });
    }
    async revokeAccess(accessId, rmId, userRoles) {
        if (!userRoles.includes('RELATIONSHIP_MANAGER') && !userRoles.includes('ADMIN')) {
            throw new common_1.ForbiddenException('Only RM or Admin can revoke access');
        }
        return this.prisma.documentAccess.update({
            where: { id: accessId },
            data: {
                status: client_1.AccessStatus.REVOKED,
                revokedAt: new Date(),
            }
        });
    }
    async getDocumentUrl(documentId, user) {
        const doc = await this.prisma.propertyDocument.findUnique({
            where: { id: documentId },
            include: { property: true }
        });
        if (!doc)
            throw new common_1.NotFoundException('Document not found');
        let hasAccess = false;
        if (user.roles.includes('ADMIN') || user.roles.includes('RELATIONSHIP_MANAGER')) {
            hasAccess = true;
        }
        else if (user.roles.includes('NRI') && doc.property.ownerId === user.id) {
            hasAccess = true;
        }
        else {
            const access = await this.prisma.documentAccess.findFirst({
                where: {
                    documentId,
                    userId: user.id,
                    status: client_1.AccessStatus.ACTIVE
                }
            });
            if (access)
                hasAccess = true;
        }
        if (!hasAccess)
            throw new common_1.ForbiddenException('You do not have access to this document');
        return { url: `https://storage.nriestatekare.com/signed/${doc.storageKey}?expires=3600` };
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map