import http from './http'
import type { Order, PaginatedResponse } from '../types'

export const ordersService = {
  list(params?: { page?: number; pageSize?: number; status?: string }) {
    return http.get<PaginatedResponse<Order>>('/orders', { params })
  },

  getById(id: string) {
    return http.get<Order>(`/orders/${id}`)
  },

  updateStatus(id: string, status: Order['status']) {
    return http.patch<Order>(`/orders/${id}/status`, { status })
  },
}
