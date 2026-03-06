import { get, post, put, del } from '@/utils/request.js'

export const cartApi = {
  list: () => get('/cart'),
  add: (productId, quantity = 1) => post('/cart', { productId, quantity }),
  update: (id, quantity) => put(`/cart/${id}`, { quantity }),
  remove: (id) => del(`/cart/${id}`),
  clear: () => del('/cart'),
}
