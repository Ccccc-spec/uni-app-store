import { Table, Typography, Tag, Select, Space } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ordersService } from '../../services/orders'
import type { Order } from '../../types'

const STATUS_COLORS: Record<Order['status'], string> = {
  pending: 'gold',
  paid: 'blue',
  shipped: 'cyan',
  completed: 'green',
  cancelled: 'red',
}

const STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: '待付款', value: 'pending' },
  { label: '待发货', value: 'paid' },
  { label: '待收货', value: 'shipped' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' },
]

export default function Orders() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['orders', page, status],
    queryFn: () => ordersService.list({ page, pageSize: 10, status: status || undefined }) as unknown as Promise<{
      items: Order[]
      total: number
    }>,
  })

  const columns = [
    { title: 'Order No', dataIndex: 'orderNo', key: 'orderNo' },
    { title: 'User', dataIndex: ['user', 'nickname'], key: 'user' },
    { title: 'Total', dataIndex: 'totalAmount', key: 'totalAmount', render: (v: string) => `¥${v}` },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v: Order['status']) => <Tag color={STATUS_COLORS[v]}>{v}</Tag>,
    },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', render: (v: string) => new Date(v).toLocaleDateString() },
  ]

  return (
    <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>Orders</Typography.Title>
        <Space>
          <Select
            value={status}
            options={STATUS_OPTIONS}
            onChange={setStatus}
            style={{ width: 160 }}
          />
        </Space>
      </div>
      <Table
        rowKey="id"
        loading={isLoading}
        columns={columns}
        dataSource={data?.items}
        pagination={{
          current: page,
          total: data?.total,
          pageSize: 10,
          onChange: setPage,
        }}
      />
    </div>
  )
}
