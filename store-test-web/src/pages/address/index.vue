<template>
  <view class="address-page">
    <view v-if="addressList.length === 0" class="empty">
      <uni-icons type="location" size="60" color="#ccc" />
      <text class="empty-text">暂无收货地址</text>
    </view>

    <view v-for="item in addressList" :key="item.id" class="address-card" @tap="selectAddress(item)">
      <view class="card-main">
        <view class="card-header">
          <text class="name">{{ item.name }}</text>
          <text class="phone">{{ item.phone }}</text>
          <text v-if="item.isDefault" class="default-tag">Default</text>
        </view>
        <view class="card-detail">
          <text class="detail-text">{{ item.province }} {{ item.city }} {{ item.district }} {{ item.detail }}</text>
        </view>
      </view>
      <view class="card-actions">
        <text v-if="!item.isDefault" class="action" @tap.stop="handleSetDefault(item.id)">Set Default</text>
        <text class="action" @tap.stop="goEdit(item.id)">Edit</text>
        <text class="action danger" @tap.stop="handleDelete(item.id)">Delete</text>
      </view>
    </view>

    <view class="bottom-bar">
      <view class="btn-add" @tap="goEdit()">
        <uni-icons type="plus" size="18" color="#fff" />
        <text class="btn-text">Add Address</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import { address } from '@/store/address.js'

const selectMode = ref(false)

onLoad((query) => {
  if (query.select === '1') selectMode.value = true
})

onShow(() => {
  address.load()
})

const addressList = computed(() => address.list)

function selectAddress(item) {
  if (selectMode.value) {
    address.selectedId = item.id
    uni.navigateBack()
  }
}

function goEdit(id) {
  const url = id ? `/pages/address/edit?id=${id}` : '/pages/address/edit'
  uni.navigateTo({ url })
}

async function handleSetDefault(id) {
  await address.setDefault(id)
  uni.showToast({ title: '设置成功', icon: 'success' })
}

function handleDelete(id) {
  uni.showModal({
    title: '提示',
    content: '确定删除该地址吗？',
    success: async (res) => {
      if (res.confirm) {
        await address.remove(id)
        uni.showToast({ title: '已删除', icon: 'success' })
      }
    }
  })
}
</script>

<style scoped>
.address-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 16rpx 16rpx 140rpx;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-top: 20rpx;
}

.address-card {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  padding: 24rpx;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.phone {
  font-size: 28rpx;
  color: #666;
}

.default-tag {
  font-size: 20rpx;
  color: #ff6b35;
  border: 1rpx solid #ff6b35;
  border-radius: 4rpx;
  padding: 2rpx 8rpx;
}

.detail-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 32rpx;
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #f0f0f0;
}

.action {
  font-size: 24rpx;
  color: #666;
}

.action.danger {
  color: #ff4d4f;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: #fff;
}

.btn-add {
  height: 88rpx;
  background: linear-gradient(135deg, #ff6b35, #ff9a5c);
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.btn-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #fff;
}
</style>
