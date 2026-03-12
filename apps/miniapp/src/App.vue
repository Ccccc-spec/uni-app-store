<script>
import { auth } from '@/store/auth.js'
import { cart } from '@/store/cart.js'

export default {
  onLaunch: function () {
    console.log('App Launch')
    auth.loadFromStorage()
    if (auth.isLoggedIn) {
      cart.load()
    }
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
page {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', sans-serif;
  font-size: 28rpx;
  color: #fff;
  background-color: #000;
}

view, text {
  box-sizing: border-box;
}

image {
  display: block;
}
</style>
