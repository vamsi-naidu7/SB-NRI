import { Controller, Post, Patch, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { LeasesService } from './leases.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/leases')
export class LeasesController {
  constructor(private readonly leasesService: LeasesService) {}

  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.leasesService.requestLease(body.propertyId, req.user.id, body);
  }

  @Post(':id/payment')
  recordPayment(@Param('id') id: string, @Body() body: { amount: number }, @Req() req: any) {
    return this.leasesService.recordPayment(id, body.amount, req.user.id, req.user.roles);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }, @Req() req: any) {
    return this.leasesService.updateStatus(id, body.status, req.user.id, req.user.roles);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.leasesService.findAll(req.user.id, req.user.roles);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leasesService.findOne(id);
  }
}
