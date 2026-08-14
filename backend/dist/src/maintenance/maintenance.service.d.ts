import { PrismaService } from '../prisma/prisma.service';
export declare class MaintenanceService {
    private prisma;
    constructor(prisma: PrismaService);
    createRequest(propertyId: string, nriId: string, data: any): Promise<{
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
    updateStatus(requestId: string, status: any, rmId: string, userRoles: string[]): Promise<{
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
}
