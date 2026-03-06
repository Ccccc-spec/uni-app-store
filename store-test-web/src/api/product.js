import { get } from '@/utils/request.js'

export const productApi = {
  list: (params) => get('/products', params),
  featured: () => get('/products/featured'),
  categories: () => get('/products/categories'),
  detail: (id) => get(`/products/${id}`),
}
