import http from './http'
import type { Product, PaginatedResponse } from '../types'

export const productsService = {
  list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return http.get<PaginatedResponse<Product>>('/products', { params })
  },

  getById(id: string) {
    return http.get<Product>(`/products/${id}`)
  },

  create(data: Omit<Product, 'id' | 'createdAt'>) {
    return http.post<Product>('/products', data)
  },

  update(id: string, data: Partial<Product>) {
    return http.patch<Product>(`/products/${id}`, data)
  },

  remove(id: string) {
    return http.delete(`/products/${id}`)
  },
}
