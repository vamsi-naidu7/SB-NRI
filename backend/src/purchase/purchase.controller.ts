import { Controller, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post('decision')
  submitDecision(@Body() body: { propertyId: string; decision: boolean }, @Req() req: any) {
    return this.purchaseService.submitPurchaseDecision(body.propertyId, body.decision, req.user.id);
  }

  @Post(':id/assign-ca')
  assignCA(@Param('id') id: string, @Body() body: { caId: string }, @Req() req: any) {
    return this.purchaseService.assignCA(id, body.caId, req.user.id, req.user.roles);
  }

  @Post(':id/ca-findings')
  submitCAFindings(@Param('id') id: string, @Body() body: { findings: string }, @Req() req: any) {
    return this.purchaseService.submitCAFindings(id, req.user.id, body.findings);
  }
}
