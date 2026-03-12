import { reactive } from 'vue'
import { addressApi } from '@/api/address.js'

const state = reactive({
  list: [],
  selectedId: null // 用于订单确认页选择地址
})

export const address = {
  get list() {
    return state.list
  },

  get selectedId() {
    return state.selectedId
  },

  set selectedId(id) {
    state.selectedId = id
  },

  async load() {
    try {
      const data = await addressApi.list()
      state.list = data || []
    } catch (e) {
      // 未登录时忽略
    }
  },

  getDefault() {
    return state.list.find(a => a.isDefault) || state.list[0] || null
  },

  getById(id) {
    return state.list.find(a => a.id === id) || null
  },

  getSelected() {
    if (state.selectedId) {
      return this.getById(state.selectedId)
    }
    return this.getDefault()
  },

  async add(addr) {
    const newAddr = await addressApi.create(addr)
    state.list.push(newAddr)
    return newAddr
  },

  async update(id, addr) {
    const updated = await addressApi.update(id, addr)
    const index = state.list.findIndex(a => a.id === id)
    if (index > -1) state.list[index] = updated
    return updated
  },

  async remove(id) {
    await addressApi.remove(id)
    const index = state.list.findIndex(a => a.id === id)
    if (index > -1) state.list.splice(index, 1)
  },

  async setDefault(id) {
    await addressApi.setDefault(id)
    state.list.forEach(a => { a.isDefault = a.id === id })
  }
}
