import { reactive } from 'vue'
import { authApi } from '@/api/auth.js'
import { setTokens, clearTokens } from '@/utils/request.js'

const state = reactive({
  isLoggedIn: false,
  user: null // { id, phone, nickname, avatarUrl }
})

export const auth = {
  get isLoggedIn() {
    return state.isLoggedIn
  },

  get user() {
    return state.user
  },

  loadFromStorage() {
    const token = uni.getStorageSync('accessToken')
    const user = uni.getStorageSync('userInfo')
    if (token && user) {
      state.isLoggedIn = true
      state.user = user
    }
  },

  async login(phone, password) {
    try {
      const res = await authApi.login(phone, password)
      setTokens(res.accessToken, res.refreshToken)
      state.isLoggedIn = true
      state.user = res.user
      uni.setStorageSync('userInfo', res.user)
      uni.showToast({ title: '登录成功', icon: 'success' })
      return true
    } catch (e) {
      return false
    }
  },

  async register(phone, password, nickname) {
    try {
      const res = await authApi.register(phone, password, nickname)
      setTokens(res.accessToken, res.refreshToken)
      state.isLoggedIn = true
      state.user = res.user
      uni.setStorageSync('userInfo', res.user)
      uni.showToast({ title: '注册成功', icon: 'success' })
      return true
    } catch (e) {
      return false
    }
  },

  logout() {
    state.isLoggedIn = false
    state.user = null
    clearTokens()
    uni.removeStorageSync('userInfo')
  },

  checkAuth() {
    if (!state.isLoggedIn) {
      uni.navigateTo({ url: '/pages/login/index' })
      return false
    }
    return true
  }
}
