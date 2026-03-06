<template>
  <view class="container">
    <!-- 用户信息 -->
    <view class="user-section" @tap="handleUserTap">
      <view class="avatar">
        <text class="avatar-text">{{ auth.isLoggedIn ? (auth.user?.nickname?.[0] || 'S') : 'S' }}</text>
      </view>
      <view class="user-info">
        <text class="username">{{ auth.isLoggedIn ? auth.user?.nickname : 'Sign In' }}</text>
        <text class="user-desc">{{ auth.isLoggedIn ? auth.user?.phone : 'Sign in for full access' }}</text>
      </view>
    </view>

    <!-- 订单区域 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">Orders</text>
        <view class="section-more" @tap="goOrders('')">
          <text class="section-more-text">All Orders</text>
          <uni-icons type="forward" size="14" color="#999" />
        </view>
      </view>
      <view class="order-grid">
        <view class="order-item" @tap="goOrders('pending')">
          <uni-icons type="wallet" size="26" color="#ff6b35" />
          <text class="order-text">待付款</text>
        </view>
        <view class="order-item" @tap="goOrders('paid')">
          <uni-icons type="box" size="26" color="#1890ff" />
          <text class="order-text">待发货</text>
        </view>
        <view class="order-item" @tap="goOrders('shipped')">
          <uni-icons type="car" size="26" color="#52c41a" />
          <text class="order-text">待收货</text>
        </view>
        <view class="order-item" @tap="goOrders('completed')">
          <uni-icons type="star" size="26" color="#faad14" />
          <text class="order-text">已完成</text>
        </view>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="section">
      <view class="menu-item" v-for="item in menuList" :key="item.text" @tap="handleMenuTap(item)">
        <uni-icons :type="item.icon" size="22" color="#666" />
        <text class="menu-text">{{ item.text }}</text>
        <uni-icons type="forward" size="14" color="#ccc" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { auth } from '@/store/auth.js'

const menuList = [
  { icon: 'location', text: 'Address', url: '/pages/address/index' },
  { icon: 'heart', text: 'Favorites', url: '' },
  { icon: 'gift', text: 'Coupons', url: '' },
  { icon: 'chat', text: 'Support', url: '' },
  { icon: 'gear', text: 'Settings', url: '/pages/settings/index' }
]

function handleUserTap() {
  if (!auth.isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
  }
}

function goOrders(tab) {
  if (!auth.checkAuth()) return
  const url = tab ? `/pages/order/index?tab=${tab}` : '/pages/order/index'
  uni.navigateTo({ url })
}

function handleMenuTap(item) {
  if (item.url) {
    if (item.url === '/pages/address/index' && !auth.checkAuth()) return
    uni.navigateTo({ url: item.url })
  } else {
    uni.showToast({ title: 'Coming soon', icon: 'none' })
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.user-section {
  display: flex;
  align-items: center;
  padding: 60rpx 30rpx 40rpx;
  background: linear-gradient(135deg, #ff6b35, #ff9a5c);
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background-color: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.avatar-text {
  font-size: 48rpx;
  color: #fff;
  font-weight: bold;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 36rpx;
  color: #fff;
  font-weight: bold;
}

.user-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8rpx;
}

.section {
  background-color: #fff;
  margin-top: 16rpx;
  border-radius: 16rpx;
  margin-left: 16rpx;
  margin-right: 16rpx;
  overflow: hidden;
}

.section-header {
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
}

.section-more {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.section-more-text {
  font-size: 24rpx;
  color: #999;
}

.order-grid {
  display: flex;
  padding: 30rpx 0;
}

.order-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.order-text {
  font-size: 24rpx;
  color: #666;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
  gap: 20rpx;
}

.menu-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}
</style>
