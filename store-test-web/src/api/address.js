import { get, post, put, del } from '@/utils/request.js'

export const addressApi = {
  list: () => get('/addresses'),
  create: (data) => post('/addresses', data),
  update: (id, data) => put(`/addresses/${id}`, data),
  remove: (id) => del(`/addresses/${id}`),
  setDefault: (id) => put(`/addresses/${id}/default`),
}
