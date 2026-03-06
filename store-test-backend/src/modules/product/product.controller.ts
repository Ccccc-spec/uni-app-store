import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service.js';
import { QueryProductDto } from './dto/query-product.dto.js';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productService.findAll(query);
  }

  @Get('featured')
  findFeatured() {
    return this.productService.findFeatured();
  }

  @Get('categories')
  findCategories() {
    return this.productService.findCategories();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }
}
