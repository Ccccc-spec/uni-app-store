export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface User {
  id: string
  phone: string
  nickname: string
  avatarUrl?: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: string
  stock: number
  images: string[]
  categoryId: string
  isActive: boolean
  createdAt: string
}

export interface Order {
  id: string
  orderNo: string
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
  totalAmount: string
  userId: string
  user?: User
  items: OrderItem[]
  createdAt: string
}

export interface OrderItem {
  id: string
  productId: string
  product?: Product
  quantity: number
  price: string
}

export interface LoginCredentials {
  phone: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  user: User
}
