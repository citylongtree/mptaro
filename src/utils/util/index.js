import Taro from '@tarojs/taro'

const PAGE_LEVEL_LIMIT = 10
const LOGN_LIST = ['/pages/carList/index','/pages/order/index/index','/pages/card/card','/pages/order/afterSale/index','/pages/my/address/index']

export default {
  jumpUrl(url, options = {}) {
    if(!this.isLogin()&&LOGN_LIST.includes(url.split('?')[0])){
        Taro.setStorageSync('callBackUrl',url)
        url = '/pages/login/index'
    }
    const pages = Taro.getCurrentPages()
    let method = options.method || 'navigateTo'
    if (url && typeof url === 'string') {
      if (method === 'navigateTo' && pages.length >= PAGE_LEVEL_LIMIT - 3) {
        method = 'redirectTo'
      }

      if (method === 'navigateToByForce') {
        method = 'navigateTo'
      }

      if (method === 'navigateTo' && pages.length === PAGE_LEVEL_LIMIT) {
        method = 'redirectTo'
      }
      Taro[method]({
        url
      })
    }
  },
  showToast(title){
    Taro.showToast({
      icon:'none',
      title
    })
  },
  isLogin(){
    return this.isNotNullString(Taro.getStorageSync('sessionId'))
  },
  justGoLogin(){
    if(!this.isLogin()){
      this.jumpUrl('/pages/login/index')
    }
    return this.isLogin()
  },
  isNotNullString(string) {
    const nullList = ['', 'null', null, undefined, 'undefined']
    return !nullList.includes(string)
  }
}
