import { post, get, put } from '@/utils/request.js'

export const authApi = {
  login: (phone, password) => post('/auth/login', { phone, password }),
  register: (phone, password, nickname) => post('/auth/register', { phone, password, nickname }),
  refresh: (refreshToken) => post('/auth/refresh', { refreshToken }),
  getProfile: () => get('/auth/profile'),
  updateProfile: (data) => put('/auth/profile', data),
}
