const BASE_URL = 'http://localhost:3000/api'

function getToken() {
  return uni.getStorageSync('accessToken') || ''
}

function setTokens(accessToken, refreshToken) {
  uni.setStorageSync('accessToken', accessToken)
  if (refreshToken) uni.setStorageSync('refreshToken', refreshToken)
}

function clearTokens() {
  uni.removeStorageSync('accessToken')
  uni.removeStorageSync('refreshToken')
}

function request(options) {
  const { url, method = 'GET', data, header = {} } = options

  const token = getToken()
  if (token) {
    header['Authorization'] = `Bearer ${token}`
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header,
      },
      success(res) {
        const { statusCode, data: body } = res

        if (statusCode === 401) {
          clearTokens()
          uni.showToast({ title: '请重新登录', icon: 'none' })
          uni.navigateTo({ url: '/pages/login/index' })
          reject(new Error('Unauthorized'))
          return
        }

        if (statusCode >= 200 && statusCode < 300) {
          // 后端统一响应格式 { code: 0, data, message }
          if (body && body.code === 0) {
            resolve(body.data)
          } else if (body && body.code !== undefined) {
            uni.showToast({ title: body.message || '请求失败', icon: 'none' })
            reject(new Error(body.message))
          } else {
            resolve(body)
          }
        } else {
          const msg = body?.message || `请求失败 (${statusCode})`
          uni.showToast({ title: msg, icon: 'none' })
          reject(new Error(msg))
        }
      },
      fail(err) {
        uni.showToast({ title: '网络请求失败', icon: 'none' })
        reject(err)
      },
    })
  })
}

export const get = (url, data) => request({ url, method: 'GET', data })
export const post = (url, data) => request({ url, method: 'POST', data })
export const put = (url, data) => request({ url, method: 'PUT', data })
export const del = (url, data) => request({ url, method: 'DELETE', data })

export { setTokens, clearTokens, getToken }
