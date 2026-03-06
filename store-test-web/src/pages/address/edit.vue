<template>
  <view class="edit-page">
    <view class="form-card">
      <view class="form-item">
        <text class="label">收货人</text>
        <input class="input" placeholder="请输入收货人姓名" v-model="form.name" />
      </view>
      <view class="form-item">
        <text class="label">手机号</text>
        <input class="input" type="number" maxlength="11" placeholder="请输入手机号" v-model="form.phone" />
      </view>
      <view class="form-item">
        <text class="label">所在地区</text>
        <view class="region-row">
          <input class="input region-input" placeholder="省" v-model="form.province" />
          <input class="input region-input" placeholder="市" v-model="form.city" />
          <input class="input region-input" placeholder="区" v-model="form.district" />
        </view>
      </view>
      <view class="form-item">
        <text class="label">详细地址</text>
        <textarea class="textarea" placeholder="请输入详细地址" v-model="form.detail" maxlength="255" />
      </view>
      <view class="form-item switch-item">
        <text class="label">设为默认</text>
        <switch :checked="form.isDefault" @change="form.isDefault = $event.detail.value" color="#ff6b35" />
      </view>
    </view>

    <view class="btn-save" @tap="handleSave">
      <text class="btn-text">保 存</text>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { address } from '@/store/address.js'

const editId = ref(null)
const form = reactive({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false,
})

onLoad((query) => {
  if (query.id) {
    editId.value = Number(query.id)
    const addr = address.getById(editId.value)
    if (addr) {
      Object.assign(form, {
        name: addr.name,
        phone: addr.phone,
        province: addr.province,
        city: addr.city,
        district: addr.district,
        detail: addr.detail,
        isDefault: addr.isDefault,
      })
    }
    uni.setNavigationBarTitle({ title: '编辑地址' })
  } else {
    uni.setNavigationBarTitle({ title: '新增地址' })
  }
})

function validate() {
  if (!form.name.trim()) {
    uni.showToast({ title: '请输入收货人', icon: 'none' }); return false
  }
  if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' }); return false
  }
  if (!form.province.trim() || !form.city.trim() || !form.district.trim()) {
    uni.showToast({ title: '请填写完整地区', icon: 'none' }); return false
  }
  if (!form.detail.trim()) {
    uni.showToast({ title: '请输入详细地址', icon: 'none' }); return false
  }
  return true
}

async function handleSave() {
  if (!validate()) return
  try {
    if (editId.value) {
      await address.update(editId.value, { ...form })
    } else {
      await address.add({ ...form })
    }
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 500)
  } catch (e) {
    // error shown by request util
  }
}
</script>

<style scoped>
.edit-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 16rpx;
}

.form-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 8rpx 24rpx;
}

.form-item {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.form-item:last-child {
  border-bottom: none;
}

.label {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 12rpx;
  display: block;
}

.input {
  width: 100%;
  height: 72rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #333;
}

.region-row {
  display: flex;
  gap: 12rpx;
}

.region-input {
  flex: 1;
}

.textarea {
  width: 100%;
  height: 160rpx;
  background: #f8f8f8;
  border-radius: 8rpx;
  padding: 16rpx 20rpx;
  font-size: 28rpx;
  color: #333;
}

.switch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.switch-item .label {
  margin-bottom: 0;
}

.btn-save {
  margin-top: 40rpx;
  height: 88rpx;
  background: linear-gradient(135deg, #ff6b35, #ff9a5c);
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #fff;
  letter-spacing: 4rpx;
}
</style>
