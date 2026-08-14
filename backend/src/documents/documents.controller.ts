import { Controller, Post, Body, Req, UseGuards, Param, Get } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  upload(@Body() data: any, @Req() req: any) {
    return this.documentsService.uploadDocument(data, req.user['id'] || req.user['sub']);
  }

  @Post(':id/grant')
  grantAccess(@Param('id') documentId: string, @Body('professionalId') professionalId: string, @Req() req: any) {
    return this.documentsService.grantAccess(documentId, professionalId, req.user['id'] || req.user['sub'], req.user['roles']);
  }

  @Post('access/:accessId/revoke')
  revokeAccess(@Param('accessId') accessId: string, @Req() req: any) {
    return this.documentsService.revokeAccess(accessId, req.user['id'] || req.user['sub'], req.user['roles']);
  }

  @Get(':id/url')
  getUrl(@Param('id') documentId: string, @Req() req: any) {
    return this.documentsService.getDocumentUrl(documentId, req.user as any);
  }
}
