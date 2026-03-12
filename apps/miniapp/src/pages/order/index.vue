<template>
  <view class="order-page">
    <!-- Tab 筛选 -->
    <scroll-view scroll-x class="tabs-scroll">
      <view class="tabs">
        <text
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab', activeTab === tab.key && 'active']"
          @tap="switchTab(tab.key)"
        >{{ tab.label }}</text>
      </view>
    </scroll-view>

    <!-- 订单列表 -->
    <view v-if="orders.length === 0" class="empty">
      <uni-icons type="list" size="60" color="#ccc" />
      <text class="empty-text">暂无订单</text>
    </view>

    <view v-for="item in orders" :key="item.id" class="order-card" @tap="goDetail(item.id)">
      <view class="card-header">
        <text class="order-no">{{ item.orderNo }}</text>
        <text class="order-status" :style="{ color: statusColor(item.status) }">{{ statusLabel(item.status) }}</text>
      </view>

      <view class="card-goods">
        <view v-for="gi in item.items" :key="gi.id" class="goods-row">
          <image class="goods-img" :src="gi.productSnapshot?.imageUrl" mode="aspectFill" />
          <view class="goods-info">
            <text class="goods-name">{{ gi.productSnapshot?.name }}</text>
            <view class="goods-meta">
              <text class="goods-price">¥{{ Number(gi.price).toFixed(2) }}</text>
              <text class="goods-qty">x{{ gi.quantity }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="card-footer">
        <text class="total-text">{{ item.items.length }} items  ¥<text class="total-price">{{ Number(item.totalAmount).toFixed(2) }}</text></text>
        <view class="actions">
          <text v-if="item.status === 'pending'" class="action-btn outline" @tap.stop="handleCancel(item.id)">Cancel</text>
          <text v-if="item.status === 'pending'" class="action-btn primary" @tap.stop="handlePay(item)">Pay</text>
          <text v-if="item.status === 'shipped'" class="action-btn primary" @tap.stop="handleConfirm(item.id)">Confirm</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import { order, STATUS_LABELS, ORDER_STATUS } from '@/store/order.js'

const tabs = [
  { key: '', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'paid', label: 'Shipped' },
  { key: 'shipped', label: 'Delivery' },
  { key: 'completed', label: 'Done' },
]

const activeTab = ref('')
const orders = ref([])

onLoad((query) => {
  if (query.tab) activeTab.value = query.tab
})

onShow(async () => {
  await loadOrders()
})

async function loadOrders() {
  const res = await order.load({ status: activeTab.value || undefined })
  orders.value = res.items || []
}

function switchTab(key) {
  activeTab.value = key
  loadOrders()
}

function statusLabel(status) {
  return STATUS_LABELS[status] || status
}

function statusColor(status) {
  const map = {
    pending: '#ff6b35',
    paid: '#1890ff',
    shipped: '#52c41a',
    completed: '#999',
    cancelled: '#999',
  }
  return map[status] || '#333'
}

function goDetail(id) {
  uni.navigateTo({ url: `/pages/order/detail?id=${id}` })
}

function handlePay(item) {
  uni.showModal({
    title: 'WeChat Pay',
    content: `Amount: ¥${Number(item.totalAmount).toFixed(2)}`,
    confirmText: 'Pay Now',
    success: async (res) => {
      if (res.confirm) {
        try {
          await order.pay(item.id)
          uni.showToast({ title: '支付成功', icon: 'success' })
          await loadOrders()
        } catch (e) {}
      }
    }
  })
}

function handleCancel(id) {
  uni.showModal({
    title: 'Cancel Order',
    content: 'Are you sure?',
    success: async (res) => {
      if (res.confirm) {
        await order.cancel(id)
        uni.showToast({ title: '已取消', icon: 'success' })
        await loadOrders()
      }
    }
  })
}

function handleConfirm(id) {
  uni.showModal({
    title: 'Confirm Receipt',
    content: 'Have you received the goods?',
    success: async (res) => {
      if (res.confirm) {
        await order.confirm(id)
        uni.showToast({ title: '已确认收货', icon: 'success' })
        await loadOrders()
      }
    }
  })
}
</script>

<style scoped>
.order-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.tabs-scroll {
  white-space: nowrap;
  background: #fff;
}

.tabs {
  display: flex;
  padding: 0 16rpx;
}

.tab {
  padding: 24rpx 24rpx;
  font-size: 28rpx;
  color: #666;
  flex-shrink: 0;
}

.tab.active {
  color: #ff6b35;
  font-weight: 600;
  border-bottom: 4rpx solid #ff6b35;
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

.order-card {
  background: #fff;
  margin: 16rpx;
  border-radius: 16rpx;
  padding: 24rpx;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.order-no {
  font-size: 24rpx;
  color: #999;
}

.order-status {
  font-size: 26rpx;
  font-weight: 600;
}

.card-goods {
  padding: 16rpx 0;
}

.goods-row {
  display: flex;
  gap: 16rpx;
  padding: 8rpx 0;
}

.goods-img {
  width: 120rpx;
  height: 120rpx;
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
  font-size: 26rpx;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods-meta {
  display: flex;
  justify-content: space-between;
}

.goods-price {
  font-size: 26rpx;
  color: #ff6b35;
}

.goods-qty {
  font-size: 24rpx;
  color: #999;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16rpx;
  border-top: 1rpx solid #f5f5f5;
}

.total-text {
  font-size: 24rpx;
  color: #666;
}

.total-price {
  color: #ff6b35;
  font-weight: 600;
  font-size: 28rpx;
}

.actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  font-size: 24rpx;
  padding: 8rpx 24rpx;
  border-radius: 28rpx;
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
