import { PrismaService } from '../prisma/prisma.service';
export declare class VerificationService {
    private prisma;
    constructor(prisma: PrismaService);
    requestVerification(propertyId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.VerificationStatus;
        rmId: string | null;
        propertyId: string;
        requestedById: string;
    }>;
    finalizeVerificationItem(itemId: string, data: any, rmId: string, roles: string[]): Promise<{
        id: string;
        name: string;
        result: string | null;
        status: import("@prisma/client").$Enums.ChecklistItemStatus;
        issue: string | null;
        rmComment: string | null;
        recommendation: string | null;
        completedAt: Date | null;
        checklistId: string;
    }>;
    getVerificationStatus(propertyId: string): Promise<({
        checklists: ({
            items: {
                id: string;
                name: string;
                result: string | null;
                status: import("@prisma/client").$Enums.ChecklistItemStatus;
                issue: string | null;
                rmComment: string | null;
                recommendation: string | null;
                completedAt: Date | null;
            }[];
        } & {
            id: string;
            propertyId: string;
            requestId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.VerificationStatus;
        rmId: string | null;
        propertyId: string;
        requestedById: string;
    }) | null>;
}
