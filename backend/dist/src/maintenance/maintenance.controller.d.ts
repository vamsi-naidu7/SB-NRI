import { MaintenanceService } from './maintenance.service';
export declare class MaintenanceController {
    private readonly maintenanceService;
    constructor(maintenanceService: MaintenanceService);
    create(body: any, req: any): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        status: import("@prisma/client").$Enums.MaintenanceStatus;
        images: string | null;
        videos: string | null;
        propertyId: string;
        nriId: string;
        priority: string;
        assignedRMId: string | null;
    }>;
    updateStatus(id: string, body: {
        status: string;
    }, req: any): Promise<{
        id: string;
        createdAt: Date;
        description: string;
        status: import("@prisma/client").$Enums.MaintenanceStatus;
        images: string | null;
        videos: string | null;
        propertyId: string;
        nriId: string;
        priority: string;
        assignedRMId: string | null;
    }>;
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
    } & {
        id: string;
        createdAt: Date;
        description: string;
        status: import("@prisma/client").$Enums.MaintenanceStatus;
        images: string | null;
        videos: string | null;
        propertyId: string;
        nriId: string;
        priority: string;
        assignedRMId: string | null;
    })[]>;
    findOne(id: string): Promise<({
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
    } & {
        id: string;
        createdAt: Date;
        description: string;
        status: import("@prisma/client").$Enums.MaintenanceStatus;
        images: string | null;
        videos: string | null;
        propertyId: string;
        nriId: string;
        priority: string;
        assignedRMId: string | null;
    }) | null>;
}
