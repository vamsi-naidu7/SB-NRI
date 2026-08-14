import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssignmentStatus, RoleName } from '@prisma/client';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async assignProfessional(data: { propertyId: string, professionalId: string, role: RoleName }, rmId: string, userRoles: string[]) {
    if (!userRoles.includes('RELATIONSHIP_MANAGER') && !userRoles.includes('ADMIN')) {
      throw new ForbiddenException('Only RM can assign professionals');
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

  async submitFindings(assignmentId: string, data: { findings?: string, issues?: string, recommendations?: string }, professionalId: string) {
    const assignment = await this.prisma.verificationAssignment.findUnique({ where: { id: assignmentId } });
    if (!assignment || assignment.professionalId !== professionalId) {
      throw new ForbiddenException('Not assigned to this task');
    }

    await this.prisma.verificationAssignment.update({
      where: { id: assignmentId },
      data: { status: AssignmentStatus.SUBMITTED }
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

  async getAssignment(assignmentId: string, user: { id: string, roles: string[] }) {
    const assignment = await this.prisma.verificationAssignment.findUnique({
      where: { id: assignmentId },
      include: { findings: true }
    });

    if (!assignment) throw new NotFoundException('Assignment not found');

    if (user.roles.includes('ADMIN') || user.roles.includes('RELATIONSHIP_MANAGER') || assignment.professionalId === user.id) {
      return assignment;
    }
    
    throw new ForbiddenException('Access denied');
  }
}
