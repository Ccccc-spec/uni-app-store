import { reactive } from 'vue'
import { cartApi } from '@/api/cart.js'
import { getToken } from '@/utils/request.js'

const state = reactive({
  items: [], // API 返回的 { id, productId, quantity, product }
  checkoutItems: []
})

export const cart = {
  get items() {
    return state.items
  },

  get totalCount() {
    return state.items.reduce((sum, item) => sum + item.quantity, 0)
  },

  get totalPrice() {
    return state.items.reduce((sum, item) => {
      const price = Number(item.product?.price || 0)
      return sum + price * item.quantity
    }, 0)
  },

  async load() {
    if (!getToken()) return
    try {
      const data = await cartApi.list()
      state.items = data || []
    } catch (e) {
      // ignore
    }
  },

  async add(productId, quantity = 1) {
    try {
      await cartApi.add(productId, quantity)
      await this.load()
      uni.showToast({ title: '已加入购物车', icon: 'success' })
    } catch (e) {
      // error already shown by request util
    }
  },

  async remove(cartItemId) {
    try {
      await cartApi.remove(cartItemId)
      const index = state.items.findIndex(item => item.id === cartItemId)
      if (index > -1) state.items.splice(index, 1)
    } catch (e) {
      // ignore
    }
  },

  async updateQuantity(cartItemId, quantity) {
    if (quantity <= 0) {
      return this.remove(cartItemId)
    }
    try {
      await cartApi.update(cartItemId, quantity)
      const item = state.items.find(item => item.id === cartItemId)
      if (item) item.quantity = quantity
    } catch (e) {
      // ignore
    }
  },

  async clear() {
    try {
      await cartApi.clear()
      state.items.splice(0, state.items.length)
    } catch (e) {
      // ignore
    }
  },

  get checkoutItems() {
    return state.checkoutItems
  },

  setCheckout(items) {
    state.checkoutItems = items ? [...items] : []
  },

  clearCheckout() {
    state.checkoutItems = []
  }
}
