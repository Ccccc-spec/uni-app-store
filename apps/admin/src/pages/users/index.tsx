import { Table, Typography, Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import http from '../../services/http'
import type { User } from '../../types'

export default function Users() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['users', page],
    queryFn: () => http.get('/users', { params: { page, pageSize: 10 } }) as unknown as Promise<{
      items: User[]
      total: number
    }>,
  })

  const columns = [
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Nickname', dataIndex: 'nickname', key: 'nickname' },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (v: string) => <Tag color={v === 'ADMIN' ? 'purple' : 'default'}>{v}</Tag>,
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => new Date(v).toLocaleDateString(),
    },
  ]

  return (
    <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
      <Typography.Title level={4}>Users</Typography.Title>
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
