import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service.js';
import { AddCartDto } from './dto/add-cart.dto.js';
import { UpdateCartDto } from './dto/update-cart.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  findAll(@CurrentUser('id') userId: number) {
    return this.cartService.findAll(userId);
  }

  @Post()
  add(@CurrentUser('id') userId: number, @Body() dto: AddCartDto) {
    return this.cartService.add(userId, dto.productId, dto.quantity);
  }

  @Put(':id')
  update(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartDto,
  ) {
    return this.cartService.update(userId, id, dto.quantity);
  }

  @Delete(':id')
  remove(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.cartService.remove(userId, id);
  }

  @Delete()
  clear(@CurrentUser('id') userId: number) {
    return this.cartService.clear(userId);
  }
}
