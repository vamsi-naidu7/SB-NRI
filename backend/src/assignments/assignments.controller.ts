import { Controller, Post, Patch, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  assign(@Body() body: any, @Req() req: any) {
    return this.assignmentsService.assignProfessional(body, req.user.id, req.user.roles);
  }

  @Patch(':id/findings')
  submitFindings(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.assignmentsService.submitFindings(id, body, req.user.id);
  }

  @Get(':id')
  getAssignment(@Param('id') id: string, @Req() req: any) {
    return this.assignmentsService.getAssignment(id, req.user);
  }
}
