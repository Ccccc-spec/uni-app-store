<template>
  <view class="container">
    <!-- 顶部品牌栏 -->
    <view class="brand-header">
      <text class="brand-name">MINI STORE</text>
    </view>

    <!-- 全屏沉浸式轮播 - 主打商品 -->
    <swiper
      class="hero-swiper"
      :indicator-dots="true"
      indicator-color="rgba(255,255,255,0.4)"
      indicator-active-color="#FFFFFF"
      :autoplay="true"
      :interval="4000"
      :circular="true"
    >
      <swiper-item v-for="item in featuredProducts" :key="item.id" @tap="goDetail(item.id)">
        <view class="hero-slide">
          <image class="hero-image" :src="item.imageUrl" mode="aspectFill" />
          <view class="hero-overlay" />
          <view class="hero-content">
            <text class="hero-tag">{{ item.tags?.[0] || 'Featured' }}</text>
            <text class="hero-title">{{ item.name }}</text>
            <text class="hero-subtitle">{{ item.subtitle }}</text>
            <view class="hero-price-row">
              <text class="hero-price">¥{{ Number(item.price).toFixed(0) }}</text>
              <text class="hero-price-note">起</text>
            </view>
            <view class="hero-cta">
              <text>了解更多</text>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <!-- 品类导航 -->
    <view class="nav-section">
      <view class="nav-grid">
        <view
          class="nav-item"
          v-for="nav in categories"
          :key="nav.id"
          @tap="filterCategory(nav.id)"
        >
          <view :class="['nav-icon-wrap', activeCategoryId === nav.id && 'nav-active']">
            <uni-icons :type="getCategoryIcon(nav.name)" size="22" color="#fff" />
          </view>
          <text class="nav-label">{{ nav.name }}</text>
        </view>
      </view>
    </view>

    <!-- 精选商品标题 -->
    <view class="section-header">
      <view class="section-line" />
      <text class="section-title">PRODUCTS</text>
      <view class="section-line" />
    </view>

    <!-- 商品卡片列表 - 大图风格 -->
    <view class="product-list">
      <view
        class="product-card-large"
        v-for="item in productList"
        :key="item.id"
        @tap="goDetail(item.id)"
      >
        <image class="card-image" :src="item.imageUrl" mode="aspectFill" />
        <view class="card-overlay" />
        <view class="card-content">
          <text class="card-category">{{ item.category?.name }}</text>
          <text class="card-name">{{ item.name }}</text>
          <text class="card-desc">{{ item.subtitle || item.description }}</text>
          <view class="card-bottom">
            <view class="card-price-wrap">
              <text class="card-price">¥{{ Number(item.price).toFixed(0) }}</text>
              <text v-if="item.originalPrice" class="card-original">¥{{ Number(item.originalPrice).toFixed(0) }}</text>
            </view>
            <view class="card-btn">
              <text>选购</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部品牌 slogan -->
    <view class="footer">
      <view class="footer-line" />
      <text class="footer-slogan">MINI STORE</text>
      <text class="footer-sub">Local Deploy · Secure · Private</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { productApi } from '@/api/product.js'

const featuredProducts = ref([])
const categories = ref([])
const productList = ref([])
const activeCategoryId = ref(null)

const categoryIconMap = {
  'NAS': 'cloud',
  '服务器': 'server',
  '存储': 'folder',
  '迷你主机': 'monitor',
  '配件': 'gear',
}

function getCategoryIcon(name) {
  return categoryIconMap[name] || 'list'
}

onLoad(async () => {
  await Promise.all([
    loadFeatured(),
    loadCategories(),
    loadProducts(),
  ])
})

async function loadFeatured() {
  try {
    featuredProducts.value = await productApi.featured()
  } catch (e) {}
}

async function loadCategories() {
  try {
    categories.value = await productApi.categories()
  } catch (e) {}
}

async function loadProducts(categoryId) {
  try {
    const params = { pageSize: 20 }
    if (categoryId) params.category = categoryId
    const res = await productApi.list(params)
    productList.value = res.items || []
  } catch (e) {}
}

function filterCategory(id) {
  if (activeCategoryId.value === id) {
    activeCategoryId.value = null
    loadProducts()
  } else {
    activeCategoryId.value = id
    loadProducts(id)
  }
}

function goDetail(id) {
  uni.navigateTo({ url: `/pages/detail/index?id=${id}` })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #000;
}

/* 品牌顶栏 */
.brand-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  padding: 80rpx 0 20rpx;
  text-align: center;
  background: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%);
}

.brand-name {
  font-size: 34rpx;
  color: #fff;
  letter-spacing: 12rpx;
  font-weight: 300;
}

/* 沉浸轮播 */
.hero-swiper {
  width: 750rpx;
  height: 960rpx;
}

.hero-slide {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-image {
  width: 100%;
  height: 100%;
}

.hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%);
}

.hero-content {
  position: absolute;
  bottom: 80rpx;
  left: 48rpx;
  right: 48rpx;
}

.hero-tag {
  display: inline-block;
  font-size: 22rpx;
  color: #000;
  background-color: #fff;
  padding: 6rpx 20rpx;
  border-radius: 4rpx;
  letter-spacing: 2rpx;
  font-weight: 600;
  margin-bottom: 20rpx;
}

.hero-title {
  display: block;
  font-size: 52rpx;
  color: #fff;
  font-weight: 700;
  letter-spacing: 4rpx;
  margin-bottom: 12rpx;
}

.hero-subtitle {
  display: block;
  font-size: 28rpx;
  color: rgba(255,255,255,0.7);
  letter-spacing: 4rpx;
  margin-bottom: 24rpx;
}

.hero-price-row {
  display: flex;
  align-items: baseline;
  margin-bottom: 32rpx;
}

.hero-price {
  font-size: 48rpx;
  color: #fff;
  font-weight: 300;
}

.hero-price-note {
  font-size: 24rpx;
  color: rgba(255,255,255,0.6);
  margin-left: 8rpx;
}

.hero-cta {
  display: inline-block;
  border: 1rpx solid rgba(255,255,255,0.6);
  padding: 16rpx 48rpx;
  border-radius: 6rpx;
}

.hero-cta text {
  font-size: 26rpx;
  color: #fff;
  letter-spacing: 4rpx;
}

/* 品类导航 */
.nav-section {
  padding: 40rpx 24rpx;
  background-color: #111;
}

.nav-grid {
  display: flex;
  justify-content: space-around;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-icon-wrap {
  width: 96rpx;
  height: 96rpx;
  border-radius: 48rpx;
  background-color: rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.nav-icon-wrap.nav-active {
  background-color: rgba(255, 107, 53, 0.3);
  border: 1rpx solid #ff6b35;
}

.nav-label {
  font-size: 22rpx;
  color: rgba(255,255,255,0.7);
  letter-spacing: 2rpx;
}

/* 精选标题 */
.section-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48rpx 60rpx 32rpx;
  background-color: #000;
}

.section-line {
  flex: 1;
  height: 1rpx;
  background-color: rgba(255,255,255,0.15);
}

.section-title {
  font-size: 28rpx;
  color: rgba(255,255,255,0.6);
  letter-spacing: 8rpx;
  margin: 0 32rpx;
}

/* 大图商品卡片 */
.product-list {
  padding: 0 24rpx;
  background-color: #000;
}

.product-card-large {
  position: relative;
  width: 100%;
  height: 520rpx;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
}

.card-image {
  width: 100%;
  height: 100%;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.75) 100%);
}

.card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32rpx;
}

.card-category {
  font-size: 20rpx;
  color: rgba(255,255,255,0.5);
  letter-spacing: 4rpx;
  text-transform: uppercase;
}

.card-name {
  display: block;
  font-size: 36rpx;
  color: #fff;
  font-weight: 600;
  margin-top: 8rpx;
  letter-spacing: 2rpx;
}

.card-desc {
  display: block;
  font-size: 24rpx;
  color: rgba(255,255,255,0.6);
  margin-top: 8rpx;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20rpx;
}

.card-price-wrap {
  display: flex;
  align-items: baseline;
}

.card-price {
  font-size: 36rpx;
  color: #fff;
  font-weight: 300;
}

.card-original {
  font-size: 22rpx;
  color: rgba(255,255,255,0.4);
  text-decoration: line-through;
  margin-left: 12rpx;
}

.card-btn {
  border: 1rpx solid rgba(255,255,255,0.5);
  padding: 10rpx 36rpx;
  border-radius: 4rpx;
}

.card-btn text {
  font-size: 24rpx;
  color: #fff;
  letter-spacing: 4rpx;
}

/* 底部品牌 */
.footer {
  padding: 60rpx 0 80rpx;
  text-align: center;
  background-color: #000;
}

.footer-line {
  width: 80rpx;
  height: 1rpx;
  background-color: rgba(255,255,255,0.2);
  margin: 0 auto 32rpx;
}

.footer-slogan {
  display: block;
  font-size: 24rpx;
  color: rgba(255,255,255,0.4);
  letter-spacing: 8rpx;
}

.footer-sub {
  display: block;
  font-size: 20rpx;
  color: rgba(255,255,255,0.25);
  letter-spacing: 4rpx;
  margin-top: 12rpx;
}
</style>
