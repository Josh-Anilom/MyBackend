import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('product')
export class ProductController {
  constructor(private productServices: ProductService) {}


  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.productServices.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.productServices.findById(+id);
  }

  @Post()
  async create(
    @Body()
    body: {
      product_name: string;
      product_category: string;
      product_price: number;
      stock_quantity: number;
      manufacturer_id?: number;
    },
  ) {
    return this.productServices.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      product_name?: string;
      product_category?: string;
      product_price?: number;
      stock_quantity?: number;
      manufacturer_id?: number;
    },
  ) {
    return this.productServices.update(+id, body);
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productServices.delete(+id);
  }
}