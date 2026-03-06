<template>
  <view class="login-page">
    <view class="brand">
      <uni-icons type="shop" size="40" color="#ff6b35" />
      <text class="brand-name">MINI STORE</text>
      <text class="brand-slogan">Local Deploy · Secure · Private</text>
    </view>

    <view class="form-card">
      <view class="tabs">
        <text :class="['tab', mode === 'login' && 'active']" @tap="mode = 'login'">Login</text>
        <text :class="['tab', mode === 'register' && 'active']" @tap="mode = 'register'">Register</text>
      </view>

      <view class="form">
        <view class="input-group">
          <text class="input-label">Phone</text>
          <input
            class="input"
            type="number"
            maxlength="11"
            placeholder="Enter phone number"
            placeholder-class="placeholder"
            v-model="phone"
          />
        </view>

        <view class="input-group">
          <text class="input-label">Password</text>
          <input
            class="input"
            :password="true"
            maxlength="20"
            placeholder="6-20 characters"
            placeholder-class="placeholder"
            v-model="password"
          />
        </view>

        <view v-if="mode === 'register'" class="input-group">
          <text class="input-label">Nickname</text>
          <input
            class="input"
            maxlength="50"
            placeholder="Optional"
            placeholder-class="placeholder"
            v-model="nickname"
          />
        </view>

        <view class="btn-submit" @tap="handleSubmit">
          <text class="btn-text">{{ mode === 'login' ? 'Sign In' : 'Sign Up' }}</text>
        </view>
      </view>

      <view class="footer">
        <text class="footer-text" @tap="uni.switchTab({ url: '/pages/home/index' })">
          Browse as guest
        </text>
        <uni-icons type="forward" size="14" color="rgba(255,255,255,0.4)" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '@/store/auth.js'
import { cart } from '@/store/cart.js'

const mode = ref('login')
const phone = ref('')
const password = ref('')
const nickname = ref('')

function validate() {
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return false
  }
  if (password.value.length < 6 || password.value.length > 20) {
    uni.showToast({ title: '密码长度 6-20 位', icon: 'none' })
    return false
  }
  return true
}

async function handleSubmit() {
  if (!validate()) return

  let success = false
  if (mode.value === 'login') {
    success = await auth.login(phone.value, password.value)
  } else {
    success = await auth.register(phone.value, password.value, nickname.value || undefined)
  }

  if (success) {
    await cart.load()
    setTimeout(() => {
      uni.switchTab({ url: '/pages/my/index' })
    }, 500)
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 48rpx 60rpx;
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
}

.brand-name {
  font-size: 56rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: 8rpx;
  margin-top: 20rpx;
}

.brand-slogan {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 16rpx;
  letter-spacing: 4rpx;
}

.form-card {
  width: 100%;
}

.tabs {
  display: flex;
  gap: 48rpx;
  margin-bottom: 48rpx;
}

.tab {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.4);
  padding-bottom: 12rpx;
}

.tab.active {
  color: #fff;
  font-weight: 600;
  border-bottom: 4rpx solid #ff6b35;
}

.input-group {
  margin-bottom: 36rpx;
}

.input-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 12rpx;
  display: block;
}

.input {
  width: 100%;
  height: 88rpx;
  background: rgba(255, 255, 255, 0.08);
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: #fff;
}

.placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.btn-submit {
  margin-top: 48rpx;
  height: 88rpx;
  background: linear-gradient(135deg, #ff6b35, #ff9a5c);
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
  letter-spacing: 4rpx;
}

.footer {
  margin-top: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.footer-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.4);
}
</style>
