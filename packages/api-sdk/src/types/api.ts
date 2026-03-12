export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  user: import('./models').User
}
