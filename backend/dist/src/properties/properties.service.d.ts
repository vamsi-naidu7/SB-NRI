import { PrismaService } from '../prisma/prisma.service';
export declare class PropertiesService {
    private prisma;
    constructor(prisma: PrismaService);
    createProperty(data: any, user: {
        id: string;
        roles: string[];
    }): Promise<{
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
    }>;
    findAll(filters: any): Promise<{
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
    }[]>;
    findOne(id: string, user: {
        id: string;
        roles: string[];
    }): Promise<{
        owner: {
            id: string;
            email: string;
            passwordHash: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            isActive: boolean;
            refreshToken: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        agent: {
            id: string;
            email: string;
            passwordHash: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            isActive: boolean;
            refreshToken: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        rm: {
            id: string;
            email: string;
            passwordHash: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            isActive: boolean;
            refreshToken: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
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
    }>;
}
