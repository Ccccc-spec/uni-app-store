import { defineStore } from 'pinia'
import { ref } from 'vue'
import { orderApi } from '@/api/order.js'

export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPED: 'shipped',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export const STATUS_LABELS: Record<string, string> = {
  [ORDER_STATUS.PENDING]: '待付款',
  [ORDER_STATUS.PAID]: '待发货',
  [ORDER_STATUS.SHIPPED]: '待收货',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消',
}

interface OrderItem {
  productId: string
  quantity: number
  product?: { id: string; name: string; price: string | number }
}

interface Order {
  id: string
  status: string
  totalAmount: string | number
  items: OrderItem[]
  createdAt: string
}

export const useOrderStore = defineStore('order', () => {
  const list = ref<Order[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)

  async function load(params: { page?: number; pageSize?: number; status?: string } = {}) {
    try {
      const res = await orderApi.list({
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        status: params.status || undefined,
      })
      list.value = res.items || []
      total.value = res.total || 0
      page.value = res.page || 1
      return res
    } catch {
      return { items: [], total: 0 }
    }
  }

  async function getById(id: string) {
    return await orderApi.detail(id)
  }

  async function create(addressId: string, items: OrderItem[], remark?: string) {
    return await orderApi.create({
      addressId,
      items: items.map((i) => ({ productId: i.productId || i.product?.id, quantity: i.quantity })),
      remark,
    })
  }

  async function pay(orderId: string) {
    return await orderApi.pay(orderId)
  }

  async function cancel(orderId: string) {
    return await orderApi.cancel(orderId)
  }

  async function confirm(orderId: string) {
    return await orderApi.confirm(orderId)
  }

  return { list, total, page, pageSize, load, getById, create, pay, cancel, confirm }
})
