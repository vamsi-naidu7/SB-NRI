import { PrismaService } from '../prisma/prisma.service';
import { RoleName } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        email: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
        role: RoleName;
        phone?: string;
    }): Promise<{
        roles: ({
            role: {
                id: string;
                name: import("@prisma/client").$Enums.RoleName;
                description: string | null;
            };
        } & {
            roleId: string;
            userId: string;
        })[];
    } & {
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
    }>;
    findByEmail(email: string): Promise<({
        roles: ({
            role: {
                id: string;
                name: import("@prisma/client").$Enums.RoleName;
                description: string | null;
            };
        } & {
            roleId: string;
            userId: string;
        })[];
    } & {
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
    }) | null>;
    findById(id: string): Promise<({
        roles: ({
            role: {
                id: string;
                name: import("@prisma/client").$Enums.RoleName;
                description: string | null;
            };
        } & {
            roleId: string;
            userId: string;
        })[];
    } & {
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
    }) | null>;
    updateRefreshToken(userId: string, refreshToken: string | null): Promise<void>;
}
