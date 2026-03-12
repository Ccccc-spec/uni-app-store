import { reactive } from 'vue'
import { orderApi } from '@/api/order.js'

export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPED: 'shipped',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: '待付款',
  [ORDER_STATUS.PAID]: '待发货',
  [ORDER_STATUS.SHIPPED]: '待收货',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消'
}

const state = reactive({
  list: [],
  total: 0,
  page: 1,
  pageSize: 10
})

export const order = {
  get list() {
    return state.list
  },

  get total() {
    return state.total
  },

  async load(params = {}) {
    try {
      const res = await orderApi.list({
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        status: params.status || undefined,
      })
      state.list = res.items || []
      state.total = res.total || 0
      state.page = res.page || 1
      return res
    } catch (e) {
      // 未登录时忽略
      return { items: [], total: 0 }
    }
  },

  async getById(id) {
    return await orderApi.detail(id)
  },

  async create(addressId, items, remark) {
    return await orderApi.create({
      addressId,
      items: items.map(i => ({ productId: i.productId || i.product?.id, quantity: i.quantity })),
      remark,
    })
  },

  // mock 微信支付：暂时直接调后端 mock_pay
  async pay(orderId) {
    return await orderApi.pay(orderId)
  },

  async cancel(orderId) {
    return await orderApi.cancel(orderId)
  },

  async confirm(orderId) {
    return await orderApi.confirm(orderId)
  }
}
