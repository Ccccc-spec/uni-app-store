<template>
  <view class="container" v-if="product">
    <!-- 商品图片 -->
    <image class="product-image" :src="product.imageUrl" mode="aspectFill" />

    <!-- 价格区域 -->
    <view class="price-section">
      <view class="price-row">
        <text class="price">¥{{ Number(product.price).toFixed(2) }}</text>
        <text v-if="product.originalPrice" class="original-price">¥{{ Number(product.originalPrice).toFixed(2) }}</text>
        <view v-if="product.originalPrice" class="discount-tag">
          <text>{{ discount }}折</text>
        </view>
      </view>
      <text class="sales">已售 {{ product.salesCount }} 件</text>
    </view>

    <!-- 商品信息 -->
    <view class="info-section">
      <text class="product-name">{{ product.name }}</text>
      <text class="product-subtitle" v-if="product.subtitle">{{ product.subtitle }}</text>
      <text class="product-desc">{{ product.description }}</text>
    </view>

    <!-- 规格参数 -->
    <view class="specs-section" v-if="product.specs && Object.keys(product.specs).length > 0">
      <text class="specs-title">规格参数</text>
      <view class="specs-list">
        <view class="specs-item" v-for="(val, key) in product.specs" :key="key">
          <text class="specs-key">{{ key }}</text>
          <text class="specs-val">{{ val }}</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bottom-btn home-btn" @tap="goHome">
        <uni-icons type="home" size="22" color="#666" />
        <text class="btn-text">Home</text>
      </view>
      <view class="bottom-btn cart-btn" @tap="goCart">
        <uni-icons type="cart" size="22" color="#666" />
        <text class="btn-text">Cart</text>
        <view class="badge" v-if="cart.totalCount > 0">
          <text>{{ cart.totalCount }}</text>
        </view>
      </view>
      <view class="add-cart-btn" @tap="addToCart">
        <text>加入购物车</text>
      </view>
      <view class="buy-btn" @tap="buyNow">
        <text>立即购买</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { cart } from '@/store/cart.js'
import { auth } from '@/store/auth.js'
import { productApi } from '@/api/product.js'
import { onLoad } from '@dcloudio/uni-app'

const product = ref(null)

const discount = computed(() => {
  if (!product.value || !product.value.originalPrice) return ''
  return ((Number(product.value.price) / Number(product.value.originalPrice)) * 10).toFixed(1)
})

onLoad(async (options) => {
  const id = Number(options.id)
  try {
    product.value = await productApi.detail(id)
  } catch (e) {}
})

async function addToCart() {
  if (!auth.checkAuth()) return
  if (product.value) {
    await cart.add(product.value.id)
  }
}

function buyNow() {
  if (!auth.checkAuth()) return
  if (product.value) {
    cart.setCheckout([{ product: product.value, quantity: 1 }])
    uni.navigateTo({ url: '/pages/order/confirm' })
  }
}

function goHome() {
  uni.switchTab({ url: '/pages/home/index' })
}

function goCart() {
  uni.switchTab({ url: '/pages/cart/index' })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.product-image {
  width: 750rpx;
  height: 750rpx;
}

.price-section {
  background-color: #fff;
  padding: 24rpx 30rpx;
}

.price-row {
  display: flex;
  align-items: center;
}

.price {
  font-size: 44rpx;
  color: #ff6b35;
  font-weight: bold;
  margin-right: 16rpx;
}

.original-price {
  font-size: 28rpx;
  color: #999;
  text-decoration: line-through;
  margin-right: 16rpx;
}

.discount-tag {
  background-color: #fff0e8;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.discount-tag text {
  color: #ff6b35;
  font-size: 22rpx;
}

.sales {
  font-size: 24rpx;
  color: #999;
  margin-top: 12rpx;
}

.info-section {
  background-color: #fff;
  margin-top: 16rpx;
  padding: 24rpx 30rpx;
}

.product-name {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  line-height: 1.5;
}

.product-subtitle {
  display: block;
  font-size: 26rpx;
  color: #ff6b35;
  margin-top: 8rpx;
}

.product-desc {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-top: 16rpx;
  line-height: 1.6;
}

.specs-section {
  background-color: #fff;
  margin-top: 16rpx;
  padding: 24rpx 30rpx;
}

.specs-title {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.specs-item {
  display: flex;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.specs-item:last-child {
  border-bottom: none;
}

.specs-key {
  width: 180rpx;
  font-size: 26rpx;
  color: #999;
  flex-shrink: 0;
}

.specs-val {
  font-size: 26rpx;
  color: #333;
  flex: 1;
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
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 100;
}

.bottom-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120rpx;
  position: relative;
}

.btn-text {
  font-size: 20rpx;
  color: #666;
  margin-top: 2rpx;
}

.badge {
  position: absolute;
  top: 4rpx;
  right: 16rpx;
  background-color: #ff6b35;
  border-radius: 20rpx;
  min-width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
}

.badge text {
  color: #fff;
  font-size: 20rpx;
}

.add-cart-btn {
  flex: 1;
  height: 80rpx;
  background-color: #ffa54f;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40rpx 0 0 40rpx;
  margin-left: 16rpx;
}

.add-cart-btn text {
  color: #fff;
  font-size: 28rpx;
  font-weight: bold;
}

.buy-btn {
  flex: 1;
  height: 80rpx;
  background-color: #ff6b35;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 40rpx 40rpx 0;
  margin-right: 16rpx;
}

.buy-btn text {
  color: #fff;
  font-size: 28rpx;
  font-weight: bold;
}
</style>
