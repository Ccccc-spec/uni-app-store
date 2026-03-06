import { get, post, put } from '@/utils/request.js'

export const orderApi = {
  create: (data) => post('/orders', data),
  list: (params) => get('/orders', params),
  detail: (id) => get(`/orders/${id}`),
  pay: (id) => post(`/orders/${id}/pay`),
  cancel: (id) => put(`/orders/${id}/cancel`),
  confirm: (id) => put(`/orders/${id}/confirm`),
}
