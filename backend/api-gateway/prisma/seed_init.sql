-- 小店商城初始化数据
-- 在 Navicat 中直接执行即可

-- 1. 分类数据
INSERT INTO categories (id, name, icon, sort_order) VALUES
  (1, '入门服务器', '🖥️', 1),
  (2, '企业服务器', '🏢', 2),
  (3, '高性能计算', '⚡', 3),
  (4, '存储服务器', '💾', 4),
  (5, '配件周边', '🔧', 5)
ON CONFLICT (id) DO NOTHING;

-- 重置序列
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- 2. 商品数据
INSERT INTO products (id, category_id, name, subtitle, description, specs, price, original_price, image_url, images, sales_count, stock, is_on_sale, tags, created_at, updated_at) VALUES
(1, 1, 'MiniServe S1 入门版', '小微企业首选，即插即用的本地部署方案',
 '适合 10 人以下团队的轻量级本地服务器。搭载 Intel i5 处理器，16GB DDR5 内存，512GB NVMe SSD。预装 Docker 环境，支持一键部署常用办公套件。静音设计，桌面即可摆放。',
 '{"cpu":"Intel i5-13400","ram":"16GB DDR5","storage":"512GB NVMe SSD","network":"2.5GbE x2","power":"150W","size":"200x200x50mm"}',
 3999, 4999, 'https://picsum.photos/seed/server1/400/400',
 ARRAY['https://picsum.photos/seed/server1a/800/800','https://picsum.photos/seed/server1b/800/800'],
 1256, 100, true, ARRAY['推荐','入门首选'], NOW(), NOW()),

(2, 1, 'MiniServe S2 标准版', '中小团队的全能型本地服务器',
 '适合 10-30 人团队使用。Intel i7 处理器，32GB DDR5 内存，1TB NVMe SSD。支持 RAID 1 镜像备份，双网口负载均衡。预装管理面板，Web 可视化运维。',
 '{"cpu":"Intel i7-13700","ram":"32GB DDR5","storage":"1TB NVMe SSD x2 (RAID1)","network":"2.5GbE x2","power":"250W","size":"300x250x80mm"}',
 7999, 9499, 'https://picsum.photos/seed/server2/400/400',
 ARRAY['https://picsum.photos/seed/server2a/800/800','https://picsum.photos/seed/server2b/800/800'],
 892, 60, true, ARRAY['热销'], NOW(), NOW()),

(3, 2, 'ProServe E1 企业版', '50 人团队协作，企业级稳定性保障',
 'Intel Xeon E-2388G 处理器，64GB ECC DDR5 内存，2TB NVMe SSD RAID5。支持 IPMI 远程管理，7x24 小时稳定运行。适配 ERP、OA、CRM 等企业应用部署。',
 '{"cpu":"Intel Xeon E-2388G","ram":"64GB ECC DDR5","storage":"2TB NVMe SSD (RAID5)","network":"10GbE x2","power":"500W 冗余","size":"1U 机架式"}',
 15999, 18999, 'https://picsum.photos/seed/server3/400/400',
 ARRAY['https://picsum.photos/seed/server3a/800/800','https://picsum.photos/seed/server3b/800/800'],
 423, 30, true, ARRAY['企业首选'], NOW(), NOW()),

(4, 2, 'ProServe E2 集群版', '百人级企业，高可用双机热备方案',
 '双路 Intel Xeon Silver 4310 处理器，128GB ECC DDR5 内存，4TB NVMe SSD RAID10。支持虚拟化集群部署、双机热备故障自动切换。含 3 年上门维保。',
 '{"cpu":"Intel Xeon Silver 4310 x2","ram":"128GB ECC DDR5","storage":"4TB NVMe SSD (RAID10)","network":"10GbE x4","power":"800W 冗余双电源","size":"2U 机架式"}',
 35999, 42000, 'https://picsum.photos/seed/server4/400/400',
 ARRAY['https://picsum.photos/seed/server4a/800/800','https://picsum.photos/seed/server4b/800/800'],
 187, 15, true, ARRAY['高可用'], NOW(), NOW()),

(5, 3, 'PowerServe G1 GPU 计算服务器', '本地 AI 推理与训练，数据不出内网',
 '搭载 NVIDIA RTX 4090 GPU，Intel i9-13900K 处理器，64GB DDR5 内存，2TB NVMe SSD。针对本地 AI 大模型推理优化，支持 LLM 本地部署、图像识别、数据分析等场景。',
 '{"cpu":"Intel i9-13900K","gpu":"NVIDIA RTX 4090 24GB","ram":"64GB DDR5","storage":"2TB NVMe SSD","network":"10GbE x2","power":"1000W","size":"塔式"}',
 29999, 35000, 'https://picsum.photos/seed/server5/400/400',
 ARRAY['https://picsum.photos/seed/server5a/800/800','https://picsum.photos/seed/server5b/800/800'],
 534, 20, true, ARRAY['推荐','AI 专用'], NOW(), NOW()),

(6, 3, 'PowerServe G2 多卡训练服务器', '4 卡 GPU 并行，企业级 AI 训练平台',
 '4x NVIDIA A100 80GB GPU，双路 AMD EPYC 9354 处理器，512GB DDR5 内存，8TB NVMe SSD。支持分布式训练，内置高速 NVLink 互联。适合大规模模型训练和推理。',
 '{"cpu":"AMD EPYC 9354 x2","gpu":"NVIDIA A100 80GB x4","ram":"512GB DDR5","storage":"8TB NVMe SSD","network":"100GbE x2","power":"3000W 冗余","size":"4U 机架式"}',
 199999, 239999, 'https://picsum.photos/seed/server6/400/400',
 ARRAY['https://picsum.photos/seed/server6a/800/800','https://picsum.photos/seed/server6b/800/800'],
 56, 5, true, ARRAY['旗舰'], NOW(), NOW()),

(7, 4, 'DataVault NAS-4 网络存储', '企业数据安全存储，自动备份方案',
 '4 盘位 NAS 存储服务器，最大支持 64TB。Intel Celeron J4125 处理器，8GB DDR4 内存。支持 RAID 0/1/5/6/10，预装文件管理系统，支持多端同步访问。',
 '{"cpu":"Intel Celeron J4125","ram":"8GB DDR4","storage":"4 盘位 (最大 64TB)","network":"2.5GbE x2","power":"120W","size":"桌面式"}',
 2999, 3599, 'https://picsum.photos/seed/server7/400/400',
 ARRAY['https://picsum.photos/seed/server7a/800/800','https://picsum.photos/seed/server7b/800/800'],
 2103, 80, true, ARRAY['热销'], NOW(), NOW()),

(8, 4, 'DataVault NAS-8 企业级存储', '8 盘位大容量，企业级数据中心方案',
 '8 盘位企业级 NAS，最大 128TB。Intel Xeon D-1541 处理器，32GB ECC 内存。支持 10GbE 高速传输，SSD 缓存加速，适合影视后期、设计团队大文件协作。',
 '{"cpu":"Intel Xeon D-1541","ram":"32GB ECC DDR4","storage":"8 盘位 (最大 128TB)","network":"10GbE x2","power":"300W","size":"桌面式/可上架"}',
 8999, 10999, 'https://picsum.photos/seed/server8/400/400',
 ARRAY['https://picsum.photos/seed/server8a/800/800','https://picsum.photos/seed/server8b/800/800'],
 678, 25, true, ARRAY[]::text[], NOW(), NOW()),

(9, 5, 'UPS 不间断电源 1500VA', '服务器断电保护，数据安全保障',
 '在线式 UPS 不间断电源，1500VA/900W。纯正弦波输出，自动切换时间 < 3ms。内置电池可续航 15 分钟（满载），支持串口远程监控。',
 '{"capacity":"1500VA / 900W","battery":"内置铅酸电池","switchTime":"<3ms","runtime":"15min (满载)","interface":"USB + RS232"}',
 899, 1099, 'https://picsum.photos/seed/ups1/400/400',
 ARRAY['https://picsum.photos/seed/ups1a/800/800'],
 3456, 200, true, ARRAY['热销'], NOW(), NOW()),

(10, 5, '企业级千兆交换机 24 口', '全千兆端口，VLAN 管理，即插即用',
 '24 口全千兆管理型交换机，4 个 SFP+ 万兆上联口。支持 VLAN、QoS、链路聚合。无风扇静音设计，适合办公室和小型机房部署。',
 '{"ports":"24x GbE + 4x 10G SFP+","switching":"128Gbps","forwarding":"95Mpps","features":"VLAN, QoS, LACP","power":"30W"}',
 699, 899, 'https://picsum.photos/seed/switch1/400/400',
 ARRAY['https://picsum.photos/seed/switch1a/800/800'],
 4521, 150, true, ARRAY['推荐'], NOW(), NOW())

ON CONFLICT (id) DO NOTHING;

-- 重置序列
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));

-- 3. 测试用户 (密码: 123456, bcrypt hash)
INSERT INTO users (phone, password_hash, nickname, created_at, updated_at) VALUES
  ('13800138000', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36PQm2Pro0Y9VFqOvXB7NWO', '测试用户', NOW(), NOW())
ON CONFLICT (phone) DO NOTHING;

-- 4. 测试用户地址
INSERT INTO addresses (user_id, name, phone, province, city, district, detail, is_default, created_at)
SELECT u.id, '张三', '13800138000', '广东省', '深圳市', '南山区', '科技园南路 88 号', true, NOW()
FROM users u WHERE u.phone = '13800138000'
AND NOT EXISTS (SELECT 1 FROM addresses WHERE user_id = u.id AND name = '张三');

INSERT INTO addresses (user_id, name, phone, province, city, district, detail, is_default, created_at)
SELECT u.id, '李四', '13900139000', '北京市', '北京市', '海淀区', '中关村大街 1 号', false, NOW()
FROM users u WHERE u.phone = '13800138000'
AND NOT EXISTS (SELECT 1 FROM addresses WHERE user_id = u.id AND name = '李四');

-- 完成
-- 测试账号: 13800138000 / 123456
