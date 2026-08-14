import { PrismaService } from '../prisma/prisma.service';
import { RoleName } from '@prisma/client';
export declare class AssignmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    assignProfessional(data: {
        propertyId: string;
        professionalId: string;
        role: RoleName;
    }, rmId: string, userRoles: string[]): Promise<{
        role: import("@prisma/client").$Enums.RoleName;
        id: string;
        status: import("@prisma/client").$Enums.AssignmentStatus;
        rmId: string;
        propertyId: string;
        professionalId: string;
    }>;
    submitFindings(assignmentId: string, data: {
        findings?: string;
        issues?: string;
        recommendations?: string;
    }, professionalId: string): Promise<{
        id: string;
        findings: string | null;
        issues: string | null;
        recommendations: string | null;
        assignmentId: string;
    }>;
    getAssignment(assignmentId: string, user: {
        id: string;
        roles: string[];
    }): Promise<{
        findings: {
            id: string;
            findings: string | null;
            issues: string | null;
            recommendations: string | null;
            assignmentId: string;
        }[];
    } & {
        role: import("@prisma/client").$Enums.RoleName;
        id: string;
        status: import("@prisma/client").$Enums.AssignmentStatus;
        rmId: string;
        propertyId: string;
        professionalId: string;
    }>;
}
