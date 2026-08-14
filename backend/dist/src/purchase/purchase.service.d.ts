import { PrismaService } from '../prisma/prisma.service';
export declare class PurchaseService {
    private prisma;
    constructor(prisma: PrismaService);
    submitPurchaseDecision(propertyId: string, decision: boolean, userId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.PurchaseStatus;
        rmId: string;
        propertyId: string;
        nriId: string;
        caId: string | null;
    } | {
        message: string;
    }>;
    assignCA(purchaseId: string, caId: string, rmId: string, userRoles: string[]): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.PurchaseStatus;
        rmId: string;
        propertyId: string;
        nriId: string;
        caId: string | null;
    }>;
    submitCAFindings(purchaseId: string, caId: string, findings: string): Promise<{
        id: string;
        findings: string | null;
        caId: string;
        purchaseId: string;
    }>;
}
