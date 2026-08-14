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
exports.AssignmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AssignmentsService = class AssignmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assignProfessional(data, rmId, userRoles) {
        if (!userRoles.includes('RELATIONSHIP_MANAGER') && !userRoles.includes('ADMIN')) {
            throw new common_1.ForbiddenException('Only RM can assign professionals');
        }
        return this.prisma.verificationAssignment.create({
            data: {
                propertyId: data.propertyId,
                professionalId: data.professionalId,
                rmId,
                role: data.role,
            }
        });
    }
    async submitFindings(assignmentId, data, professionalId) {
        const assignment = await this.prisma.verificationAssignment.findUnique({ where: { id: assignmentId } });
        if (!assignment || assignment.professionalId !== professionalId) {
            throw new common_1.ForbiddenException('Not assigned to this task');
        }
        await this.prisma.verificationAssignment.update({
            where: { id: assignmentId },
            data: { status: client_1.AssignmentStatus.SUBMITTED }
        });
        return this.prisma.professionalFinding.create({
            data: {
                assignmentId,
                findings: data.findings,
                issues: data.issues,
                recommendations: data.recommendations,
            }
        });
    }
    async getAssignment(assignmentId, user) {
        const assignment = await this.prisma.verificationAssignment.findUnique({
            where: { id: assignmentId },
            include: { findings: true }
        });
        if (!assignment)
            throw new common_1.NotFoundException('Assignment not found');
        if (user.roles.includes('ADMIN') || user.roles.includes('RELATIONSHIP_MANAGER') || assignment.professionalId === user.id) {
            return assignment;
        }
        throw new common_1.ForbiddenException('Access denied');
    }
};
exports.AssignmentsService = AssignmentsService;
exports.AssignmentsService = AssignmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssignmentsService);
//# sourceMappingURL=assignments.service.js.map