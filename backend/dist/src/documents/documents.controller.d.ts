import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    upload(data: any, req: any): Promise<{
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
    grantAccess(documentId: string, professionalId: string, req: any): Promise<{
        id: string;
        userId: string;
        status: import("@prisma/client").$Enums.AccessStatus;
        grantedById: string;
        accessType: string;
        grantedAt: Date;
        revokedAt: Date | null;
        documentId: string;
    }>;
    revokeAccess(accessId: string, req: any): Promise<{
        id: string;
        userId: string;
        status: import("@prisma/client").$Enums.AccessStatus;
        grantedById: string;
        accessType: string;
        grantedAt: Date;
        revokedAt: Date | null;
        documentId: string;
    }>;
    getUrl(documentId: string, req: any): Promise<{
        url: string;
    }>;
}
