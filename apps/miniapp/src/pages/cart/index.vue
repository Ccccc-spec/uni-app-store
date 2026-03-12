<template>
  <view class="container">
    <!-- 购物车列表 -->
    <view v-if="cart.items.length > 0">
      <view class="cart-item" v-for="item in cart.items" :key="item.id">
        <image
          class="item-image"
          :src="item.product?.imageUrl"
          mode="aspectFill"
          @tap="goDetail(item.product?.id)"
        />
        <view class="item-info">
          <text class="item-name">{{ item.product?.name }}</text>
          <text class="item-price">¥{{ Number(item.product?.price).toFixed(2) }}</text>
          <view class="quantity-control">
            <view class="qty-btn" @tap="decrease(item.id, item.quantity)">
              <uni-icons type="minus" size="16" color="#333" />
            </view>
            <text class="qty-num">{{ item.quantity }}</text>
            <view class="qty-btn" @tap="increase(item.id, item.quantity)">
              <uni-icons type="plus" size="16" color="#333" />
            </view>
          </view>
        </view>
        <view class="delete-btn" @tap="remove(item.id)">
          <uni-icons type="trash" size="20" color="#999" />
        </view>
      </view>
    </view>

    <!-- 空购物车 -->
    <view v-else class="empty-cart">
      <uni-icons type="cart" size="60" color="#ccc" />
      <text class="empty-text">购物车是空的</text>
      <view class="go-shop-btn" @tap="goHome">
        <text>去逛逛</text>
      </view>
    </view>

    <!-- 底部结算栏 -->
    <view class="bottom-bar" v-if="cart.items.length > 0">
      <view class="total-info">
        <text class="total-label">合计：</text>
        <text class="total-price">¥{{ cart.totalPrice.toFixed(2) }}</text>
      </view>
      <view class="checkout-btn" @tap="checkout">
        <text>结算({{ cart.totalCount }})</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { cart } from '@/store/cart.js'
import { auth } from '@/store/auth.js'

onShow(() => {
  if (auth.isLoggedIn) cart.load()
})

function decrease(cartItemId, currentQty) {
  cart.updateQuantity(cartItemId, currentQty - 1)
}

function increase(cartItemId, currentQty) {
  cart.updateQuantity(cartItemId, currentQty + 1)
}

function remove(cartItemId) {
  uni.showModal({
    title: '提示',
    content: '确定要删除该商品吗？',
    success(res) {
      if (res.confirm) {
        cart.remove(cartItemId)
      }
    }
  })
}

function checkout() {
  if (!auth.checkAuth()) return
  cart.setCheckout(cart.items)
  uni.navigateTo({ url: '/pages/order/confirm' })
}

function goDetail(id) {
  uni.navigateTo({ url: `/pages/detail/index?id=${id}` })
}

function goHome() {
  uni.switchTab({ url: '/pages/home/index' })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.cart-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 24rpx;
  margin-bottom: 2rpx;
}

.item-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: 12rpx;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 28rpx;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-price {
  font-size: 30rpx;
  color: #ff6b35;
  font-weight: bold;
  margin-top: 12rpx;
}

.quantity-control {
  display: flex;
  align-items: center;
  margin-top: 16rpx;
}

.qty-btn {
  width: 52rpx;
  height: 52rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-num {
  min-width: 60rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333;
}

.delete-btn {
  padding: 12rpx 20rpx;
  margin-left: 16rpx;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
}

.empty-text {
  font-size: 30rpx;
  color: #999;
  margin-top: 24rpx;
}

.go-shop-btn {
  margin-top: 40rpx;
  padding: 16rpx 60rpx;
  background-color: #ff6b35;
  border-radius: 40rpx;
}

.go-shop-btn text {
  color: #fff;
  font-size: 28rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.total-info {
  display: flex;
  align-items: baseline;
}

.total-label {
  font-size: 28rpx;
  color: #333;
}

.total-price {
  font-size: 36rpx;
  color: #ff6b35;
  font-weight: bold;
}

.checkout-btn {
  background-color: #ff6b35;
  padding: 16rpx 48rpx;
  border-radius: 40rpx;
}

.checkout-btn text {
  color: #fff;
  font-size: 28rpx;
  font-weight: bold;
}
</style>
