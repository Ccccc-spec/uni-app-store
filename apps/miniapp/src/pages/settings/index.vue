<template>
  <view class="settings-page">
    <view class="menu-card">
      <view class="menu-item" @tap="clearCache">
        <text class="menu-label">清除缓存</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @tap="showAbout">
        <text class="menu-label">关于小店商城</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item">
        <text class="menu-label">当前版本</text>
        <text class="menu-value">V1.0.0</text>
      </view>
    </view>

    <view v-if="auth.isLoggedIn" class="btn-logout" @tap="handleLogout">
      <text class="logout-text">退出登录</text>
    </view>
  </view>
</template>

<script setup>
import { auth } from '@/store/auth.js'

function clearCache() {
  uni.showModal({
    title: '提示',
    content: '确定清除缓存？',
    success(res) {
      if (res.confirm) {
        try {
          uni.clearStorageSync()
          // 重新加载登录状态
          auth.loadFromStorage()
          uni.showToast({ title: '清除成功', icon: 'success' })
        } catch (e) {
          uni.showToast({ title: '清除失败', icon: 'none' })
        }
      }
    }
  })
}

function showAbout() {
  uni.showModal({
    title: '小店商城',
    content: '本地部署服务器销售平台\n版本：V1.0.0\n专注本地部署，安全可控',
    showCancel: false,
  })
}

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定退出登录？',
    success(res) {
      if (res.confirm) {
        auth.logout()
        uni.showToast({ title: '已退出', icon: 'success' })
        setTimeout(() => uni.switchTab({ url: '/pages/home/index' }), 500)
      }
    }
  })
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 16rpx;
}

.menu-card {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-label {
  font-size: 28rpx;
  color: #333;
}

.menu-value {
  font-size: 26rpx;
  color: #999;
}

.menu-arrow {
  font-size: 32rpx;
  color: #ccc;
}

.btn-logout {
  margin-top: 60rpx;
  height: 88rpx;
  background: #fff;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-text {
  font-size: 30rpx;
  color: #ff4d4f;
}
</style>
