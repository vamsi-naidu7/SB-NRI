import { Controller, Get, Post, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  create(@Body() createPropertyDto: any, @Req() req: any) {
    return this.propertiesService.createProperty(createPropertyDto, req.user as any);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.propertiesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.propertiesService.findOne(id, req.user as any);
  }
}
