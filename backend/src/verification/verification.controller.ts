import { Controller, Post, Patch, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('request')
  requestVerification(@Body() body: { propertyId: string }, @Req() req: any) {
    return this.verificationService.requestVerification(body.propertyId, req.user.id);
  }

  @Patch('item/:itemId')
  finalizeItem(@Param('itemId') itemId: string, @Body() body: any, @Req() req: any) {
    return this.verificationService.finalizeVerificationItem(itemId, body, req.user.id, req.user.roles);
  }

  @Get('property/:propertyId')
  getByProperty(@Param('propertyId') propertyId: string) {
    return this.verificationService.getVerificationStatus(propertyId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.verificationService.findAll(req.user.id, req.user.roles);
  }
}
