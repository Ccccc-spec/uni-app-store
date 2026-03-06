import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { QueryProductDto } from './dto/query-product.dto.js';
import { Prisma } from '../../../generated/prisma/client.js';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryProductDto) {
    const { page = 1, pageSize = 10, category, keyword, sort } = query;

    const where: Prisma.ProductWhereInput = {
      isOnSale: true,
    };

    if (category) {
      where.categoryId = category;
    }

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
        { subtitle: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'sales_desc':
        orderBy = { salesCount: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { category: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) {
      throw new NotFoundException('商品不存在');
    }
    return product;
  }

  async findFeatured() {
    return this.prisma.product.findMany({
      where: { isOnSale: true, tags: { has: '推荐' } },
      take: 6,
      orderBy: { salesCount: 'desc' },
      include: { category: true },
    });
  }

  async findCategories() {
    return this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }
}
