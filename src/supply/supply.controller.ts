import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SupplyService } from './supply.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('supply')
export class SupplyController {
  constructor(private supplyService: SupplyService) {}

  
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.supplyService.getAll();
  }

  
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.supplyService.findById(+id);
  }

  
  @Post()
  async create(
    @Body()
    body: {
      supply_name: string;
      country: string;
      region: string;
      city: string;
    },
  ) {
    return this.supplyService.create(body);
  }

  
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      supply_name?: string;
      country?: string;
      region?: string;
      city?: string;
    },
  ) {
    return this.supplyService.update(+id, body);
  }

  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.supplyService.delete(+id);
  }
}