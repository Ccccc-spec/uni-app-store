import { defineStore } from 'pinia'
import { ref } from 'vue'
import { addressApi } from '@/api/address.js'

interface Address {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: boolean
}

export const useAddressStore = defineStore('address', () => {
  const list = ref<Address[]>([])
  const selectedId = ref<string | null>(null)

  async function load() {
    try {
      const data = await addressApi.list()
      list.value = data || []
    } catch {
      // 未登录时忽略
    }
  }

  function getDefault(): Address | null {
    return list.value.find((a) => a.isDefault) || list.value[0] || null
  }

  function getById(id: string): Address | null {
    return list.value.find((a) => a.id === id) || null
  }

  function getSelected(): Address | null {
    if (selectedId.value) return getById(selectedId.value)
    return getDefault()
  }

  async function add(addr: Omit<Address, 'id'>) {
    const newAddr = await addressApi.create(addr)
    list.value.push(newAddr)
    return newAddr
  }

  async function update(id: string, addr: Partial<Address>) {
    const updated = await addressApi.update(id, addr)
    const index = list.value.findIndex((a) => a.id === id)
    if (index > -1) list.value[index] = updated
    return updated
  }

  async function remove(id: string) {
    await addressApi.remove(id)
    const index = list.value.findIndex((a) => a.id === id)
    if (index > -1) list.value.splice(index, 1)
  }

  async function setDefault(id: string) {
    await addressApi.setDefault(id)
    list.value.forEach((a) => { a.isDefault = a.id === id })
  }

  return {
    list, selectedId,
    load, getDefault, getById, getSelected, add, update, remove, setDefault,
  }
})
