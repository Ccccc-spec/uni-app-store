import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcrypt'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // 1. 创建分类
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, name: '入门服务器', icon: '🖥️', sortOrder: 1 },
    }),
    prisma.category.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, name: '企业服务器', icon: '🏢', sortOrder: 2 },
    }),
    prisma.category.upsert({
      where: { id: 3 },
      update: {},
      create: { id: 3, name: '高性能计算', icon: '⚡', sortOrder: 3 },
    }),
    prisma.category.upsert({
      where: { id: 4 },
      update: {},
      create: { id: 4, name: '存储服务器', icon: '💾', sortOrder: 4 },
    }),
    prisma.category.upsert({
      where: { id: 5 },
      update: {},
      create: { id: 5, name: '配件周边', icon: '🔧', sortOrder: 5 },
    }),
  ])
  console.log(`Created ${categories.length} categories`)

  // 2. 创建商品 - 本地部署服务器
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        categoryId: 1,
        name: 'MiniServe S1 入门版',
        subtitle: '小微企业首选，即插即用的本地部署方案',
        description: '适合 10 人以下团队的轻量级本地服务器。搭载 Intel i5 处理器，16GB DDR5 内存，512GB NVMe SSD。预装 Docker 环境，支持一键部署常用办公套件。静音设计，桌面即可摆放。',
        specs: { cpu: 'Intel i5-13400', ram: '16GB DDR5', storage: '512GB NVMe SSD', network: '2.5GbE x2', power: '150W', size: '200x200x50mm' },
        price: 3999,
        originalPrice: 4999,
        imageUrl: 'https://picsum.photos/seed/server1/400/400',
        images: ['https://picsum.photos/seed/server1a/800/800', 'https://picsum.photos/seed/server1b/800/800'],
        salesCount: 1256,
        stock: 100,
        tags: ['推荐', '入门首选'],
      },
    }),
    prisma.product.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        categoryId: 1,
        name: 'MiniServe S2 标准版',
        subtitle: '中小团队的全能型本地服务器',
        description: '适合 10-30 人团队使用。Intel i7 处理器，32GB DDR5 内存，1TB NVMe SSD。支持 RAID 1 镜像备份，双网口负载均衡。预装管理面板，Web 可视化运维。',
        specs: { cpu: 'Intel i7-13700', ram: '32GB DDR5', storage: '1TB NVMe SSD x2 (RAID1)', network: '2.5GbE x2', power: '250W', size: '300x250x80mm' },
        price: 7999,
        originalPrice: 9499,
        imageUrl: 'https://picsum.photos/seed/server2/400/400',
        images: ['https://picsum.photos/seed/server2a/800/800', 'https://picsum.photos/seed/server2b/800/800'],
        salesCount: 892,
        stock: 60,
        tags: ['热销'],
      },
    }),
    prisma.product.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        categoryId: 2,
        name: 'ProServe E1 企业版',
        subtitle: '50 人团队协作，企业级稳定性保障',
        description: 'Intel Xeon E-2388G 处理器，64GB ECC DDR5 内存，2TB NVMe SSD RAID5。支持 IPMI 远程管理，7x24 小时稳定运行。适配 ERP、OA、CRM 等企业应用部署。',
        specs: { cpu: 'Intel Xeon E-2388G', ram: '64GB ECC DDR5', storage: '2TB NVMe SSD (RAID5)', network: '10GbE x2', power: '500W 冗余', size: '1U 机架式' },
        price: 15999,
        originalPrice: 18999,
        imageUrl: 'https://picsum.photos/seed/server3/400/400',
        images: ['https://picsum.photos/seed/server3a/800/800', 'https://picsum.photos/seed/server3b/800/800'],
        salesCount: 423,
        stock: 30,
        tags: ['企业首选'],
      },
    }),
    prisma.product.upsert({
      where: { id: 4 },
      update: {},
      create: {
        id: 4,
        categoryId: 2,
        name: 'ProServe E2 集群版',
        subtitle: '百人级企业，高可用双机热备方案',
        description: '双路 Intel Xeon Silver 4310 处理器，128GB ECC DDR5 内存，4TB NVMe SSD RAID10。支持虚拟化集群部署、双机热备故障自动切换。含 3 年上门维保。',
        specs: { cpu: 'Intel Xeon Silver 4310 x2', ram: '128GB ECC DDR5', storage: '4TB NVMe SSD (RAID10)', network: '10GbE x4', power: '800W 冗余双电源', size: '2U 机架式' },
        price: 35999,
        originalPrice: 42000,
        imageUrl: 'https://picsum.photos/seed/server4/400/400',
        images: ['https://picsum.photos/seed/server4a/800/800', 'https://picsum.photos/seed/server4b/800/800'],
        salesCount: 187,
        stock: 15,
        tags: ['高可用'],
      },
    }),
    prisma.product.upsert({
      where: { id: 5 },
      update: {},
      create: {
        id: 5,
        categoryId: 3,
        name: 'PowerServe G1 GPU 计算服务器',
        subtitle: '本地 AI 推理与训练，数据不出内网',
        description: '搭载 NVIDIA RTX 4090 GPU，Intel i9-13900K 处理器，64GB DDR5 内存，2TB NVMe SSD。针对本地 AI 大模型推理优化，支持 LLM 本地部署、图像识别、数据分析等场景。',
        specs: { cpu: 'Intel i9-13900K', gpu: 'NVIDIA RTX 4090 24GB', ram: '64GB DDR5', storage: '2TB NVMe SSD', network: '10GbE x2', power: '1000W', size: '塔式' },
        price: 29999,
        originalPrice: 35000,
        imageUrl: 'https://picsum.photos/seed/server5/400/400',
        images: ['https://picsum.photos/seed/server5a/800/800', 'https://picsum.photos/seed/server5b/800/800'],
        salesCount: 534,
        stock: 20,
        tags: ['推荐', 'AI 专用'],
      },
    }),
    prisma.product.upsert({
      where: { id: 6 },
      update: {},
      create: {
        id: 6,
        categoryId: 3,
        name: 'PowerServe G2 多卡训练服务器',
        subtitle: '4 卡 GPU 并行，企业级 AI 训练平台',
        description: '4x NVIDIA A100 80GB GPU，双路 AMD EPYC 9354 处理器，512GB DDR5 内存，8TB NVMe SSD。支持分布式训练，内置高速 NVLink 互联。适合大规模模型训练和推理。',
        specs: { cpu: 'AMD EPYC 9354 x2', gpu: 'NVIDIA A100 80GB x4', ram: '512GB DDR5', storage: '8TB NVMe SSD', network: '100GbE x2', power: '3000W 冗余', size: '4U 机架式' },
        price: 199999,
        originalPrice: 239999,
        imageUrl: 'https://picsum.photos/seed/server6/400/400',
        images: ['https://picsum.photos/seed/server6a/800/800', 'https://picsum.photos/seed/server6b/800/800'],
        salesCount: 56,
        stock: 5,
        tags: ['旗舰'],
      },
    }),
    prisma.product.upsert({
      where: { id: 7 },
      update: {},
      create: {
        id: 7,
        categoryId: 4,
        name: 'DataVault NAS-4 网络存储',
        subtitle: '企业数据安全存储，自动备份方案',
        description: '4 盘位 NAS 存储服务器，最大支持 64TB。Intel Celeron J4125 处理器，8GB DDR4 内存。支持 RAID 0/1/5/6/10，预装文件管理系统，支持多端同步访问。',
        specs: { cpu: 'Intel Celeron J4125', ram: '8GB DDR4', storage: '4 盘位 (最大 64TB)', network: '2.5GbE x2', power: '120W', size: '桌面式' },
        price: 2999,
        originalPrice: 3599,
        imageUrl: 'https://picsum.photos/seed/server7/400/400',
        images: ['https://picsum.photos/seed/server7a/800/800', 'https://picsum.photos/seed/server7b/800/800'],
        salesCount: 2103,
        stock: 80,
        tags: ['热销'],
      },
    }),
    prisma.product.upsert({
      where: { id: 8 },
      update: {},
      create: {
        id: 8,
        categoryId: 4,
        name: 'DataVault NAS-8 企业级存储',
        subtitle: '8 盘位大容量，企业级数据中心方案',
        description: '8 盘位企业级 NAS，最大 128TB。Intel Xeon D-1541 处理器，32GB ECC 内存。支持 10GbE 高速传输，SSD 缓存加速，适合影视后期、设计团队大文件协作。',
        specs: { cpu: 'Intel Xeon D-1541', ram: '32GB ECC DDR4', storage: '8 盘位 (最大 128TB)', network: '10GbE x2', power: '300W', size: '桌面式/可上架' },
        price: 8999,
        originalPrice: 10999,
        imageUrl: 'https://picsum.photos/seed/server8/400/400',
        images: ['https://picsum.photos/seed/server8a/800/800', 'https://picsum.photos/seed/server8b/800/800'],
        salesCount: 678,
        stock: 25,
        tags: [],
      },
    }),
    prisma.product.upsert({
      where: { id: 9 },
      update: {},
      create: {
        id: 9,
        categoryId: 5,
        name: 'UPS 不间断电源 1500VA',
        subtitle: '服务器断电保护，数据安全保障',
        description: '在线式 UPS 不间断电源，1500VA/900W。纯正弦波输出，自动切换时间 < 3ms。内置电池可续航 15 分钟（满载），支持串口远程监控。',
        specs: { capacity: '1500VA / 900W', battery: '内置铅酸电池', switchTime: '<3ms', runtime: '15min (满载)', interface: 'USB + RS232' },
        price: 899,
        originalPrice: 1099,
        imageUrl: 'https://picsum.photos/seed/ups1/400/400',
        images: ['https://picsum.photos/seed/ups1a/800/800'],
        salesCount: 3456,
        stock: 200,
        tags: ['热销'],
      },
    }),
    prisma.product.upsert({
      where: { id: 10 },
      update: {},
      create: {
        id: 10,
        categoryId: 5,
        name: '企业级千兆交换机 24 口',
        subtitle: '全千兆端口，VLAN 管理，即插即用',
        description: '24 口全千兆管理型交换机，4 个 SFP+ 万兆上联口。支持 VLAN、QoS、链路聚合。无风扇静音设计，适合办公室和小型机房部署。',
        specs: { ports: '24x GbE + 4x 10G SFP+', switching: '128Gbps', forwarding: '95Mpps', features: 'VLAN, QoS, LACP', power: '30W' },
        price: 699,
        originalPrice: 899,
        imageUrl: 'https://picsum.photos/seed/switch1/400/400',
        images: ['https://picsum.photos/seed/switch1a/800/800'],
        salesCount: 4521,
        stock: 150,
        tags: ['推荐'],
      },
    }),
  ])
  console.log(`Created ${products.length} products`)

  // 3. 创建测试用户 (密码: 123456)
  const passwordHash = await bcrypt.hash('123456', 10)
  const user = await prisma.user.upsert({
    where: { phone: '13800138000' },
    update: {},
    create: {
      phone: '13800138000',
      passwordHash,
      nickname: '测试用户',
    },
  })
  console.log(`Created test user: ${user.phone} / 123456`)

  // 4. 创建测试用户地址
  const existingAddr = await prisma.address.findFirst({ where: { userId: user.id } })
  if (!existingAddr) {
    await prisma.address.createMany({
      data: [
        {
          userId: user.id,
          name: '张三',
          phone: '13800138000',
          province: '广东省',
          city: '深圳市',
          district: '南山区',
          detail: '科技园南路 88 号',
          isDefault: true,
        },
        {
          userId: user.id,
          name: '李四',
          phone: '13900139000',
          province: '北京市',
          city: '北京市',
          district: '海淀区',
          detail: '中关村大街 1 号',
          isDefault: false,
        },
      ],
    })
    console.log('Created test addresses')
  }

  console.log('Seed completed!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
