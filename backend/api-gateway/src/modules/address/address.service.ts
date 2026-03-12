import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateAddressDto } from './dto/create-address.dto.js';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async create(userId: number, dto: CreateAddressDto) {
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: { userId, ...dto },
    });
  }

  async update(userId: number, id: number, dto: Partial<CreateAddressDto>) {
    const addr = await this.prisma.address.findFirst({
      where: { id, userId },
    });
    if (!addr) throw new NotFoundException('地址不存在');

    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({ where: { id }, data: dto });
  }

  async remove(userId: number, id: number) {
    const addr = await this.prisma.address.findFirst({
      where: { id, userId },
    });
    if (!addr) throw new NotFoundException('地址不存在');

    return this.prisma.address.delete({ where: { id } });
  }

  async setDefault(userId: number, id: number) {
    const addr = await this.prisma.address.findFirst({
      where: { id, userId },
    });
    if (!addr) throw new NotFoundException('地址不存在');

    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    return this.prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });
  }
}
