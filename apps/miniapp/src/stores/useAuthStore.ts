import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth.js'
import { setTokens, clearTokens } from '@/utils/request.js'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const user = ref<{ id: string; phone: string; nickname: string; avatarUrl?: string } | null>(null)

  const isAuthenticated = computed(() => isLoggedIn.value)

  function loadFromStorage() {
    const token = uni.getStorageSync('accessToken')
    const storedUser = uni.getStorageSync('userInfo')
    if (token && storedUser) {
      isLoggedIn.value = true
      user.value = storedUser
    }
  }

  async function login(phone: string, password: string): Promise<boolean> {
    try {
      const res = await authApi.login(phone, password)
      setTokens(res.accessToken, res.refreshToken)
      isLoggedIn.value = true
      user.value = res.user
      uni.setStorageSync('userInfo', res.user)
      uni.showToast({ title: '登录成功', icon: 'success' })
      return true
    } catch {
      return false
    }
  }

  async function register(phone: string, password: string, nickname: string): Promise<boolean> {
    try {
      const res = await authApi.register(phone, password, nickname)
      setTokens(res.accessToken, res.refreshToken)
      isLoggedIn.value = true
      user.value = res.user
      uni.setStorageSync('userInfo', res.user)
      uni.showToast({ title: '注册成功', icon: 'success' })
      return true
    } catch {
      return false
    }
  }

  function logout() {
    isLoggedIn.value = false
    user.value = null
    clearTokens()
    uni.removeStorageSync('userInfo')
  }

  function checkAuth(): boolean {
    if (!isLoggedIn.value) {
      uni.navigateTo({ url: '/pages/login/index' })
      return false
    }
    return true
  }

  return { isLoggedIn, user, isAuthenticated, loadFromStorage, login, register, logout, checkAuth }
})
