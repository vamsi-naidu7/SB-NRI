import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: any): Promise<({
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
    findAll(): Promise<({
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
    })[]>;
}
