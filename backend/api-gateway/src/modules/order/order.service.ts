import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { QueryOrderDto } from './dto/query-order.dto.js';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  private generateOrderNo(): string {
    const now = new Date();
    const ts = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD${ts}${rand}`;
  }

  async create(userId: number, dto: CreateOrderDto) {
    const address = await this.prisma.address.findFirst({
      where: { id: dto.addressId, userId },
    });
    if (!address) {
      throw new NotFoundException('收货地址不存在');
    }

    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isOnSale: true },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('部分商品不存在或已下架');
    }

    const productMap = new Map(products.map((p: any) => [p.id, p]));

    for (const item of dto.items) {
      const product = productMap.get(item.productId)! as any;
      if (product.stock < item.quantity) {
        throw new BadRequestException(`商品"${product.name}"库存不足`);
      }
    }

    return this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItems = dto.items.map((item) => {
        const product = productMap.get(item.productId)! as any;
        const subtotal = Number(product.price) * item.quantity;
        totalAmount += subtotal;
        return {
          productId: product.id,
          productSnapshot: {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            imageUrl: product.imageUrl,
            specs: product.specs,
          },
          quantity: item.quantity,
          price: product.price,
          subtotal,
        };
      });

      const order = await tx.order.create({
        data: {
          orderNo: this.generateOrderNo(),
          userId,
          addressSnapshot: {
            name: address.name,
            phone: address.phone,
            province: address.province,
            city: address.city,
            district: address.district,
            detail: address.detail,
          },
          totalAmount,
          remark: dto.remark || '',
          items: { create: orderItems },
        },
        include: { items: true },
      });

      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            salesCount: { increment: item.quantity },
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: { userId, productId: { in: productIds } },
      });

      return order;
    });
  }

  async findAll(userId: number, query: QueryOrderDto) {
    const { page = 1, pageSize = 10, status } = query;
    const where: any = { userId };
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { items: true },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(userId: number, id: number) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('订单不存在');
    return order;
  }

  async cancel(userId: number, id: number) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
    });
    if (!order) throw new NotFoundException('订单不存在');
    if (order.status !== 'pending') {
      throw new BadRequestException('只能取消待付款订单');
    }

    return this.prisma.$transaction(async (tx) => {
      const items = await tx.orderItem.findMany({ where: { orderId: id } });
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
            salesCount: { decrement: item.quantity },
          },
        });
      }

      return tx.order.update({
        where: { id },
        data: { status: 'cancelled' },
        include: { items: true },
      });
    });
  }

  async pay(userId: number, id: number) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
    });
    if (!order) throw new NotFoundException('订单不存在');
    if (order.status !== 'pending') {
      throw new BadRequestException('订单状态不允许支付');
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: 'paid',
        paymentMethod: 'mock_pay',
        paidAt: new Date(),
      },
      include: { items: true },
    });
  }

  async confirm(userId: number, id: number) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
    });
    if (!order) throw new NotFoundException('订单不存在');
    if (order.status !== 'shipped') {
      throw new BadRequestException('订单状态不允许确认收货');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: 'completed', completedAt: new Date() },
      include: { items: true },
    });
  }
}
