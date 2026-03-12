import { Table, Typography, Button, Tag, Space, Input, message } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { productsService } from '../../services/products'
import type { Product } from '../../types'

export default function Products() {
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, keyword],
    queryFn: () => productsService.list({ page, pageSize: 10, keyword }) as unknown as Promise<{
      items: Product[]
      total: number
    }>,
  })

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (v: string) => `¥${v}` },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (v: boolean) => <Tag color={v ? 'green' : 'red'}>{v ? 'Active' : 'Inactive'}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Product) => (
        <Space>
          <Button size="small" onClick={() => message.info(`Edit ${record.id}`)}>Edit</Button>
          <Button size="small" danger onClick={() => message.info(`Delete ${record.id}`)}>Delete</Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>Products</Typography.Title>
        <Space>
          <Input
            placeholder="Search products..."
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 200 }}
          />
          <Button type="primary" icon={<PlusOutlined />}>Add Product</Button>
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
