<template>
  <view class="search-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrap">
        <uni-icons type="search" size="18" color="#999" />
        <input
          class="search-input"
          type="text"
          placeholder="Search products..."
          placeholder-class="placeholder"
          v-model="keyword"
          confirm-type="search"
          @confirm="doSearch"
        />
        <uni-icons v-if="keyword" type="clear" size="18" color="#999" @tap="clearSearch" />
      </view>
    </view>

    <!-- 热门搜索 -->
    <view v-if="!keyword && !searched" class="hot-section">
      <text class="hot-title">Popular</text>
      <view class="hot-tags">
        <text class="hot-tag" v-for="tag in hotTags" :key="tag" @tap="tapHotTag(tag)">{{ tag }}</text>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view v-if="searched" class="result-section">
      <view v-if="products.length === 0" class="empty">
        <uni-icons type="search" size="60" color="#ccc" />
        <text class="empty-text">No results found</text>
      </view>
      <view v-else class="product-grid">
        <view
          class="product-card"
          v-for="item in products"
          :key="item.id"
          @tap="goDetail(item.id)"
        >
          <image class="product-img" :src="item.imageUrl" mode="aspectFill" />
          <view class="product-info">
            <text class="product-name">{{ item.name }}</text>
            <text class="product-price">¥{{ Number(item.price).toFixed(0) }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { productApi } from '@/api/product.js'

const keyword = ref('')
const products = ref([])
const searched = ref(false)
const hotTags = ['NAS', 'Server', 'Storage', 'Mini PC', 'Rack']

async function doSearch() {
  if (!keyword.value.trim()) return
  searched.value = true
  try {
    const res = await productApi.list({ keyword: keyword.value, pageSize: 50 })
    products.value = res.items || []
  } catch (e) {
    products.value = []
  }
}

function clearSearch() {
  keyword.value = ''
  products.value = []
  searched.value = false
}

function tapHotTag(tag) {
  keyword.value = tag
  doSearch()
}

function goDetail(id) {
  uni.navigateTo({ url: `/pages/detail/index?id=${id}` })
}
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.search-bar {
  padding: 16rpx 24rpx;
  background: #fff;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 40rpx;
  padding: 0 24rpx;
  height: 72rpx;
  gap: 12rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.placeholder {
  color: #999;
}

.hot-section {
  padding: 32rpx 24rpx;
}

.hot-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 20rpx;
  display: block;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.hot-tag {
  font-size: 26rpx;
  color: #666;
  background: #fff;
  padding: 12rpx 28rpx;
  border-radius: 28rpx;
}

.result-section {
  padding: 16rpx;
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

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.product-card {
  width: calc(50% - 8rpx);
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}

.product-img {
  width: 100%;
  height: 340rpx;
}

.product-info {
  padding: 16rpx;
}

.product-name {
  font-size: 26rpx;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.product-price {
  display: block;
  font-size: 30rpx;
  color: #ff6b35;
  font-weight: 600;
  margin-top: 8rpx;
}
</style>
