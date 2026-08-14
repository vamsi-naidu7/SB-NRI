import { Controller, Post, Patch, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.maintenanceService.createRequest(body.propertyId, req.user.id, body);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }, @Req() req: any) {
    return this.maintenanceService.updateStatus(id, body.status, req.user.id, req.user.roles);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.maintenanceService.findAll(req.user.id, req.user.roles);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maintenanceService.findOne(id);
  }
}
