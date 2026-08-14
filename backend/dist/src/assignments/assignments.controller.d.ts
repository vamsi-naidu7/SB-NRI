import { AssignmentsService } from './assignments.service';
export declare class AssignmentsController {
    private readonly assignmentsService;
    constructor(assignmentsService: AssignmentsService);
    assign(body: any, req: any): Promise<{
        role: import("@prisma/client").$Enums.RoleName;
        id: string;
        status: import("@prisma/client").$Enums.AssignmentStatus;
        rmId: string;
        propertyId: string;
        professionalId: string;
    }>;
    submitFindings(id: string, body: any, req: any): Promise<{
        id: string;
        findings: string | null;
        issues: string | null;
        recommendations: string | null;
        assignmentId: string;
    }>;
    getAssignment(id: string, req: any): Promise<{
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
