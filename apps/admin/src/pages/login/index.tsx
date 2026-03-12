import { Form, Input, Button, Card, Typography, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import http from '../../services/http'
import type { AuthTokens, LoginCredentials } from '../../types'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  async function onFinish(values: LoginCredentials) {
    try {
      const res = await http.post<AuthTokens>('/auth/login', values) as unknown as AuthTokens
      login(res.user, res.accessToken)
      navigate('/dashboard')
    } catch {
      message.error('Login failed. Check your credentials.')
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <Typography.Title level={3} style={{ textAlign: 'center' }}>
          Uni Store Admin
        </Typography.Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  )
}
