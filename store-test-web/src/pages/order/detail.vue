<template>
  <view class="detail-page" v-if="orderData">
    <!-- 状态栏 -->
    <view class="status-bar">
      <uni-icons :type="statusIconName(orderData.status)" size="28" color="#fff" />
      <text class="status-text">{{ statusLabel(orderData.status) }}</text>
    </view>

    <!-- 收货地址 -->
    <view class="address-section">
      <uni-icons type="location" size="20" color="#ff6b35" />
      <view class="address-info">
        <view class="address-header">
          <text class="addr-name">{{ orderData.addressSnapshot?.name }}</text>
          <text class="addr-phone">{{ orderData.addressSnapshot?.phone }}</text>
        </view>
        <text class="addr-detail">{{ fullAddress }}</text>
      </view>
    </view>

    <!-- 商品信息 -->
    <view class="goods-section">
      <view v-for="item in orderData.items" :key="item.id" class="goods-item">
        <image class="goods-img" :src="item.productSnapshot?.imageUrl" mode="aspectFill" />
        <view class="goods-info">
          <text class="goods-name">{{ item.productSnapshot?.name }}</text>
          <view class="goods-bottom">
            <text class="goods-price">¥{{ Number(item.price).toFixed(2) }}</text>
            <text class="goods-qty">x{{ item.quantity }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 金额信息 -->
    <view class="amount-section">
      <view class="amount-row">
        <text class="amount-label">商品合计</text>
        <text class="amount-value">¥{{ Number(orderData.totalAmount).toFixed(2) }}</text>
      </view>
      <view class="amount-row">
        <text class="amount-label">运费</text>
        <text class="amount-value">免运费</text>
      </view>
      <view class="amount-row total">
        <text class="amount-label">实付款</text>
        <text class="amount-value total-price">¥{{ Number(orderData.totalAmount).toFixed(2) }}</text>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="info-section">
      <view class="info-row">
        <text class="info-label">订单编号</text>
        <text class="info-value" @tap="copyOrderNo">{{ orderData.orderNo }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">创建时间</text>
        <text class="info-value">{{ formatTime(orderData.createdAt) }}</text>
      </view>
      <view v-if="orderData.paidAt" class="info-row">
        <text class="info-label">支付时间</text>
        <text class="info-value">{{ formatTime(orderData.paidAt) }}</text>
      </view>
      <view v-if="orderData.shippedAt" class="info-row">
        <text class="info-label">发货时间</text>
        <text class="info-value">{{ formatTime(orderData.shippedAt) }}</text>
      </view>
      <view v-if="orderData.completedAt" class="info-row">
        <text class="info-label">完成时间</text>
        <text class="info-value">{{ formatTime(orderData.completedAt) }}</text>
      </view>
      <view v-if="orderData.remark" class="info-row">
        <text class="info-label">备注</text>
        <text class="info-value">{{ orderData.remark }}</text>
      </view>
    </view>

    <!-- 底部操作 -->
    <view v-if="orderData.status === 'pending' || orderData.status === 'shipped'" class="bottom-bar">
      <text v-if="orderData.status === 'pending'" class="action-btn outline" @tap="handleCancel">Cancel</text>
      <text v-if="orderData.status === 'pending'" class="action-btn primary" @tap="handlePay">Pay Now</text>
      <text v-if="orderData.status === 'shipped'" class="action-btn primary" @tap="handleConfirm">Confirm</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { order, STATUS_LABELS } from '@/store/order.js'

const orderData = ref(null)

onLoad(async (query) => {
  if (query.id) {
    orderData.value = await order.getById(query.id)
  }
})

const fullAddress = computed(() => {
  const a = orderData.value?.addressSnapshot
  if (!a) return ''
  return `${a.province} ${a.city} ${a.district} ${a.detail}`
})

function statusLabel(status) {
  return STATUS_LABELS[status] || status
}

function statusIconName(status) {
  const map = { pending: 'wallet', paid: 'box', shipped: 'car', completed: 'star', cancelled: 'close' }
  return map[status] || 'list'
}

function formatTime(str) {
  if (!str) return ''
  const d = new Date(str)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function copyOrderNo() {
  uni.setClipboardData({ data: orderData.value.orderNo })
}

function handlePay() {
  uni.showModal({
    title: 'WeChat Pay',
    content: `Amount: ¥${Number(orderData.value.totalAmount).toFixed(2)}`,
    confirmText: 'Pay Now',
    success: async (res) => {
      if (res.confirm) {
        try {
          const updated = await order.pay(orderData.value.id)
          orderData.value = updated
          uni.showToast({ title: '支付成功', icon: 'success' })
        } catch (e) {}
      }
    }
  })
}

function handleCancel() {
  uni.showModal({
    title: 'Cancel Order',
    content: 'Are you sure?',
    success: async (res) => {
      if (res.confirm) {
        const updated = await order.cancel(orderData.value.id)
        orderData.value = updated
        uni.showToast({ title: '已取消', icon: 'success' })
      }
    }
  })
}

function handleConfirm() {
  uni.showModal({
    title: 'Confirm Receipt',
    content: 'Have you received the goods?',
    success: async (res) => {
      if (res.confirm) {
        const updated = await order.confirm(orderData.value.id)
        orderData.value = updated
        uni.showToast({ title: '已确认收货', icon: 'success' })
      }
    }
  })
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 140rpx;
}

.status-bar {
  background: linear-gradient(135deg, #ff6b35, #ff9a5c);
  padding: 40rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.status-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
}

.address-section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  gap: 16rpx;
  align-items: flex-start;
}

.address-info {
  flex: 1;
}

.address-header {
  display: flex;
  gap: 16rpx;
  margin-bottom: 8rpx;
}

.addr-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.addr-phone {
  font-size: 28rpx;
  color: #666;
}

.addr-detail {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.goods-section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.goods-item {
  display: flex;
  gap: 16rpx;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.goods-item:last-child {
  border-bottom: none;
}

.goods-img {
  width: 140rpx;
  height: 140rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
}

.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.goods-name {
  font-size: 28rpx;
  color: #333;
}

.goods-bottom {
  display: flex;
  justify-content: space-between;
}

.goods-price {
  font-size: 28rpx;
  font-weight: 600;
  color: #ff6b35;
}

.goods-qty {
  font-size: 26rpx;
  color: #999;
}

.amount-section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.amount-row {
  display: flex;
  justify-content: space-between;
  padding: 8rpx 0;
}

.amount-row.total {
  padding-top: 16rpx;
  border-top: 1rpx solid #f5f5f5;
}

.amount-label {
  font-size: 26rpx;
  color: #666;
}

.amount-value {
  font-size: 26rpx;
  color: #333;
}

.total-price {
  font-size: 32rpx;
  font-weight: 700;
  color: #ff6b35;
}

.info-section {
  background: #fff;
  padding: 24rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0;
}

.info-label {
  font-size: 26rpx;
  color: #999;
}

.info-value {
  font-size: 26rpx;
  color: #333;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100rpx;
  padding-bottom: env(safe-area-inset-bottom);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 24rpx;
  gap: 16rpx;
  border-top: 1rpx solid #eee;
}

.action-btn {
  font-size: 26rpx;
  padding: 12rpx 36rpx;
  border-radius: 32rpx;
}

.action-btn.outline {
  color: #999;
  border: 1rpx solid #ddd;
}

.action-btn.primary {
  color: #fff;
  background: linear-gradient(135deg, #ff6b35, #ff9a5c);
}
</style>
