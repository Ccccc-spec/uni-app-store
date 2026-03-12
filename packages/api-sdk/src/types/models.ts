export interface User {
  id: string
  phone: string
  nickname: string
  avatarUrl?: string
  role: 'USER' | 'ADMIN'
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  description?: string
  parentId?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: string
  stock: number
  images: string[]
  categoryId: string
  category?: Category
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  product?: Product
  quantity: number
  createdAt: Date
}

export interface Order {
  id: string
  orderNo: string
  userId: string
  user?: User
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
  totalAmount: string
  addressId: string
  remark?: string
  items: OrderItem[]
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product?: Product
  quantity: number
  price: string
}

export interface ChatSession {
  id: string
  userId: string
  agentType: string
  createdAt: Date
  messages: ChatMessage[]
}

export interface ChatMessage {
  id: string
  sessionId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}
