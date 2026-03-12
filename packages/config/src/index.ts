export const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.VITE_API_BASE_URL) ||
  'http://localhost:3000/api'

export const AGENT_SERVICE_URL =
  (typeof process !== 'undefined' && process.env?.AGENT_SERVICE_URL) ||
  'http://localhost:8000'

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: '待付款',
  paid: '已付款',
  shipped: '已发货',
  completed: '已完成',
  cancelled: '已取消',
}

export const PAGE_SIZE_DEFAULT = 10
export const PAGE_SIZE_OPTIONS = [10, 20, 50]
