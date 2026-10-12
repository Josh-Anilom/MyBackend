import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ManufacturerService } from './manufacturer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('manufacturer')
export class ManufacturerController {
  constructor(private manufacturerService: ManufacturerService) {}


  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.manufacturerService.getAll();
  }


  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.manufacturerService.findById(+id);
  }

  @Post()
  async create(
    @Body()
    body: {
      manufacturer_name: string;
      code_id: string;
      country: string;
      region: string;
      city: string;
      supply_id?: number;
    },
  ) {
    return this.manufacturerService.create(body);
  }


  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      manufacturer_name?: string;
      code_id?: string;
      country?: string;
      region?: string;
      city?: string;
      supply_id?: number;
    },
  ) {
    return this.manufacturerService.update(+id, body);
  }

  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.manufacturerService.delete(+id);
  }
}