import { PurchaseService } from './purchase.service';
export declare class PurchaseController {
    private readonly purchaseService;
    constructor(purchaseService: PurchaseService);
    submitDecision(body: {
        propertyId: string;
        decision: boolean;
    }, req: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.PurchaseStatus;
        rmId: string;
        propertyId: string;
        nriId: string;
        caId: string | null;
    } | {
        message: string;
    }>;
    assignCA(id: string, body: {
        caId: string;
    }, req: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.PurchaseStatus;
        rmId: string;
        propertyId: string;
        nriId: string;
        caId: string | null;
    }>;
    submitCAFindings(id: string, body: {
        findings: string;
    }, req: any): Promise<{
        id: string;
        findings: string | null;
        caId: string;
        purchaseId: string;
    }>;
}
