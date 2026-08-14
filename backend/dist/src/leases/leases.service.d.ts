import { PrismaService } from '../prisma/prisma.service';
export declare class LeasesService {
    private prisma;
    constructor(prisma: PrismaService);
    requestLease(propertyId: string, nriId: string, data: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.LeaseStatus;
        propertyId: string;
        nriId: string;
        startDate: Date | null;
        endDate: Date | null;
        expectedRent: import("@prisma/client-runtime-utils").Decimal | null;
        specialConditions: string | null;
    }>;
    recordPayment(leaseId: string, amount: number, rmId: string, userRoles: string[]): Promise<{
        id: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        date: Date;
        leaseId: string;
    }>;
    findAll(userId: string, roles: string[]): Promise<({
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
    updateStatus(id: string, status: any, rmId: string, userRoles: string[]): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.LeaseStatus;
        propertyId: string;
        nriId: string;
        startDate: Date | null;
        endDate: Date | null;
        expectedRent: import("@prisma/client-runtime-utils").Decimal | null;
        specialConditions: string | null;
    }>;
}
