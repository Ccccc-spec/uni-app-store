import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartApi } from '@/api/cart.js'
import { getToken } from '@/utils/request.js'

interface CartItem {
  id: string
  productId: string
  quantity: number
  product?: {
    id: string
    name: string
    price: string | number
    images?: string[]
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const checkoutItems = ref<CartItem[]>([])

  const totalCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => {
      const price = Number(item.product?.price || 0)
      return sum + price * item.quantity
    }, 0)
  )

  async function load() {
    if (!getToken()) return
    try {
      const data = await cartApi.list()
      items.value = data || []
    } catch {
      // ignore
    }
  }

  async function add(productId: string, quantity = 1) {
    try {
      await cartApi.add(productId, quantity)
      await load()
      uni.showToast({ title: '已加入购物车', icon: 'success' })
    } catch {
      // error already shown by request util
    }
  }

  async function remove(cartItemId: string) {
    try {
      await cartApi.remove(cartItemId)
      const index = items.value.findIndex((item) => item.id === cartItemId)
      if (index > -1) items.value.splice(index, 1)
    } catch {
      // ignore
    }
  }

  async function updateQuantity(cartItemId: string, quantity: number) {
    if (quantity <= 0) return remove(cartItemId)
    try {
      await cartApi.update(cartItemId, quantity)
      const item = items.value.find((i) => i.id === cartItemId)
      if (item) item.quantity = quantity
    } catch {
      // ignore
    }
  }

  async function clear() {
    try {
      await cartApi.clear()
      items.value.splice(0, items.value.length)
    } catch {
      // ignore
    }
  }

  function setCheckout(selectedItems: CartItem[]) {
    checkoutItems.value = selectedItems ? [...selectedItems] : []
  }

  function clearCheckout() {
    checkoutItems.value = []
  }

  return {
    items, checkoutItems, totalCount, totalPrice,
    load, add, remove, updateQuantity, clear, setCheckout, clearCheckout,
  }
})
