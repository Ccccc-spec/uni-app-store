<template>
  <view class="confirm-page">
    <!-- 收货地址 -->
    <view class="address-section" @tap="chooseAddress">
      <view v-if="currentAddress" class="address-info">
        <view class="address-header">
          <text class="addr-name">{{ currentAddress.name }}</text>
          <text class="addr-phone">{{ currentAddress.phone }}</text>
        </view>
        <text class="addr-detail">{{ currentAddress.province }} {{ currentAddress.city }} {{ currentAddress.district }} {{ currentAddress.detail }}</text>
      </view>
      <view v-else class="address-empty">
        <text class="empty-text">请选择收货地址</text>
      </view>
      <uni-icons type="forward" size="18" color="#ccc" />
    </view>

    <!-- 商品列表 -->
    <view class="goods-section">
      <text class="section-title">商品信息</text>
      <view v-for="item in checkoutItems" :key="item.id || item.product?.id" class="goods-item">
        <image class="goods-img" :src="item.product?.imageUrl" mode="aspectFill" />
        <view class="goods-info">
          <text class="goods-name">{{ item.product?.name }}</text>
          <view class="goods-bottom">
            <text class="goods-price">¥{{ Number(item.product?.price).toFixed(2) }}</text>
            <text class="goods-qty">x{{ item.quantity }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 备注 -->
    <view class="remark-section">
      <text class="remark-label">订单备注</text>
      <input class="remark-input" placeholder="选填，可备注特殊需求" v-model="remark" />
    </view>

    <!-- 金额汇总 -->
    <view class="summary-section">
      <view class="summary-row">
        <text class="summary-label">商品合计</text>
        <text class="summary-value">¥{{ totalPrice.toFixed(2) }}</text>
      </view>
      <view class="summary-row">
        <text class="summary-label">运费</text>
        <text class="summary-value">免运费</text>
      </view>
    </view>

    <!-- 底部栏 -->
    <view class="bottom-bar">
      <view class="total-wrap">
        <text class="total-label">合计：</text>
        <text class="total-price">¥{{ totalPrice.toFixed(2) }}</text>
      </view>
      <view class="btn-submit" @tap="handleSubmit">
        <text class="btn-text">提交订单</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { cart } from '@/store/cart.js'
import { address } from '@/store/address.js'
import { order } from '@/store/order.js'

const remark = ref('')
const submitting = ref(false)

const checkoutItems = computed(() => cart.checkoutItems)

const totalPrice = computed(() =>
  checkoutItems.value.reduce((sum, item) => sum + Number(item.product?.price || 0) * item.quantity, 0)
)

const currentAddress = computed(() => address.getSelected())

onShow(() => {
  if (address.list.length === 0) address.load()
})

function chooseAddress() {
  uni.navigateTo({ url: '/pages/address/index?select=1' })
}

async function handleSubmit() {
  if (submitting.value) return
  if (!currentAddress.value) {
    uni.showToast({ title: '请选择收货地址', icon: 'none' })
    return
  }
  if (checkoutItems.value.length === 0) {
    uni.showToast({ title: '没有待结算商品', icon: 'none' })
    return
  }

  submitting.value = true
  try {
    const newOrder = await order.create(
      currentAddress.value.id,
      checkoutItems.value,
      remark.value
    )

    cart.clearCheckout()
    await mockWechatPay(newOrder)
  } catch (e) {
    submitting.value = false
  }
}

async function mockWechatPay(orderData) {
  uni.showModal({
    title: 'WeChat Pay',
    content: `Amount: ¥${Number(orderData.totalAmount).toFixed(2)}`,
    confirmText: 'Pay Now',
    success: async (res) => {
      if (res.confirm) {
        try {
          await order.pay(orderData.id)
          await cart.load()
          uni.showToast({ title: '支付成功', icon: 'success' })
          setTimeout(() => {
            uni.redirectTo({ url: `/pages/order/detail?id=${orderData.id}` })
          }, 500)
        } catch (e) {
          uni.showToast({ title: '支付失败', icon: 'none' })
        }
      } else {
        uni.showToast({ title: '订单已创建，请尽快支付', icon: 'none' })
        setTimeout(() => {
          uni.redirectTo({ url: '/pages/order/index' })
        }, 500)
      }
      submitting.value = false
    }
  })
}
</script>

<style scoped>
.confirm-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 140rpx;
}

.address-section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
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
  font-size: 30rpx;
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

.address-empty {
  flex: 1;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.goods-section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.goods-item {
  display: flex;
  gap: 16rpx;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.goods-item:last-child {
  border-bottom: none;
}

.goods-img {
  width: 160rpx;
  height: 160rpx;
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
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.remark-section {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.remark-label {
  font-size: 28rpx;
  color: #333;
  flex-shrink: 0;
}

.remark-input {
  flex: 1;
  font-size: 26rpx;
  color: #333;
  text-align: right;
}

.summary-section {
  background: #fff;
  padding: 24rpx;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8rpx 0;
}

.summary-label {
  font-size: 26rpx;
  color: #666;
}

.summary-value {
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
  justify-content: space-between;
  padding: 0 24rpx;
  border-top: 1rpx solid #eee;
}

.total-wrap {
  display: flex;
  align-items: baseline;
}

.total-label {
  font-size: 26rpx;
  color: #333;
}

.total-price {
  font-size: 36rpx;
  font-weight: 700;
  color: #ff6b35;
}

.btn-submit {
  height: 72rpx;
  padding: 0 48rpx;
  background: linear-gradient(135deg, #ff6b35, #ff9a5c);
  border-radius: 36rpx;
  display: flex;
  align-items: center;
}

.btn-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #fff;
}
</style>
