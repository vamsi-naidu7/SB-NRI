import { LeasesService } from './leases.service';
export declare class LeasesController {
    private readonly leasesService;
    constructor(leasesService: LeasesService);
    create(body: any, req: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.LeaseStatus;
        propertyId: string;
        nriId: string;
        startDate: Date | null;
        endDate: Date | null;
        expectedRent: import("@prisma/client-runtime-utils").Decimal | null;
        specialConditions: string | null;
    }>;
    recordPayment(id: string, body: {
        amount: number;
    }, req: any): Promise<{
        id: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        leaseId: string;
    }>;
    updateStatus(id: string, body: {
        status: string;
    }, req: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.LeaseStatus;
        propertyId: string;
        nriId: string;
        startDate: Date | null;
        endDate: Date | null;
        expectedRent: import("@prisma/client-runtime-utils").Decimal | null;
        specialConditions: string | null;
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
        payments: {
            id: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            date: Date;
            leaseId: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.LeaseStatus;
        propertyId: string;
        nriId: string;
        startDate: Date | null;
        endDate: Date | null;
        expectedRent: import("@prisma/client-runtime-utils").Decimal | null;
        specialConditions: string | null;
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
        payments: {
            id: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            date: Date;
            leaseId: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.LeaseStatus;
        propertyId: string;
        nriId: string;
        startDate: Date | null;
        endDate: Date | null;
        expectedRent: import("@prisma/client-runtime-utils").Decimal | null;
        specialConditions: string | null;
    }) | null>;
}
