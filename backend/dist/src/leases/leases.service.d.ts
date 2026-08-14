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
}
