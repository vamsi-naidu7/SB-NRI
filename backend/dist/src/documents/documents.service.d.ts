import { PrismaService } from '../prisma/prisma.service';
export declare class DocumentsService {
    private prisma;
    constructor(prisma: PrismaService);
    uploadDocument(data: {
        propertyId: string;
        documentType: string;
        originalFileName: string;
        storageKey: string;
        mimeType: string;
        fileSize: number;
    }, userId: string): Promise<{
        id: string;
        createdAt: Date;
        propertyId: string;
        uploadedById: string;
        documentType: string;
        originalFileName: string;
        storageKey: string;
        mimeType: string;
        fileSize: number;
    }>;
    grantAccess(documentId: string, professionalId: string, rmId: string, userRoles: string[]): Promise<{
        id: string;
        userId: string;
        status: import("@prisma/client").$Enums.AccessStatus;
        grantedById: string;
        accessType: string;
        grantedAt: Date;
        revokedAt: Date | null;
        documentId: string;
    }>;
    revokeAccess(accessId: string, rmId: string, userRoles: string[]): Promise<{
        id: string;
        userId: string;
        status: import("@prisma/client").$Enums.AccessStatus;
        grantedById: string;
        accessType: string;
        grantedAt: Date;
        revokedAt: Date | null;
        documentId: string;
    }>;
    getDocumentUrl(documentId: string, user: {
        id: string;
        roles: string[];
    }): Promise<{
        url: string;
    }>;
}
