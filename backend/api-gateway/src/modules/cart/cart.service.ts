import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async add(userId: number, productId: number, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('商品不存在');
    }

    return this.prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity: { increment: quantity } },
      create: { userId, productId, quantity },
      include: { product: true },
    });
  }

  async update(userId: number, id: number, quantity: number) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id, userId },
    });
    if (!item) {
      throw new NotFoundException('购物车项不存在');
    }

    return this.prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    });
  }

  async remove(userId: number, id: number) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id, userId },
    });
    if (!item) {
      throw new NotFoundException('购物车项不存在');
    }

    return this.prisma.cartItem.delete({ where: { id } });
  }

  async clear(userId: number) {
    return this.prisma.cartItem.deleteMany({ where: { userId } });
  }
}
