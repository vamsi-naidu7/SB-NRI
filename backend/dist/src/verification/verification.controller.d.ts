import { VerificationService } from './verification.service';
export declare class VerificationController {
    private readonly verificationService;
    constructor(verificationService: VerificationService);
    requestVerification(body: {
        propertyId: string;
    }, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.VerificationStatus;
        rmId: string | null;
        propertyId: string;
        requestedById: string;
    }>;
    finalizeItem(itemId: string, body: any, req: any): Promise<{
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
    getByProperty(propertyId: string): Promise<({
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
    findAll(req: any): Promise<({
        property: {
            images: {
                url: string;
                id: string;
                propertyId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            type: import("@prisma/client").$Enums.PropertyType;
            source: import("@prisma/client").$Enums.PropertySource;
            status: import("@prisma/client").$Enums.PropertyStatus;
            price: import("@prisma/client-runtime-utils").Decimal | null;
            address: string;
            coordinates: string | null;
            area: import("@prisma/client-runtime-utils").Decimal | null;
            bedrooms: number | null;
            bathrooms: number | null;
            ownerDetails: string | null;
            sellerDetails: string | null;
            ownerId: string | null;
            agentId: string | null;
            rmId: string | null;
        };
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
                checklistId: string;
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
    })[]>;
}
