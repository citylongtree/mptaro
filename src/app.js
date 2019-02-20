import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { Provider } from '@tarojs/redux'
import Index from './pages/index/index'
import dva from './store/dva'
import models from './store/models'
import './app.styl'
import './styles/index.styl'
import './styles/rewrite.styl'

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();
class App extends Component {

  config = {
    pages: [
      'pages/home/index',
      'pages/shop/list/index',
      'pages/home/web',
      'pages/my/address/index',
      'pages/my/address/editAddress',
      'pages/my/set/index',
      'pages/carList/index',
      'pages/paySuccess/index',
      'pages/my/index',
      'pages/searchGoods/index',
      'pages/category/index',
      'pages/login/index',
      'pages/goodsDetail/index',
      'pages/card/card',
      'pages/order/index/index',
      'pages/card/cardDetail',
      'pages/shop/goodsList/index',
      'pages/writeOrder/index',
      'pages/order/afterSale/index',
      'pages/order/afterSale/detail',
      'pages/order/refund/refund',
      'pages/order/refund/exchange',
      'pages/order/detail/detail',
      'pages/logistics/index',
      'pages/shop/goodsSearch/index',
      'pages/home/brand',
      'pages/shop/city/index',
      'pages/shop/index/index',
    ],
    permission: {
      "scope.userLocation": {
        "desc": "您的位置信息将用于获取附近的门店、商品信息"
      }
    },
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      enablePullDownRefresh: true
    },
    tabBar: {
      color: '#343434',
      selectedColor: '#FF7700',
      borderStyle: '#EFEFEF',
      backgroundColor: '#fff',
      list: [
        {
          pagePath: 'pages/home/index',
          iconPath: './imgs/tabBar/home-normal.png',
          selectedIconPath: './imgs/tabBar/home-Active.png',
          text: '首 页'
        },
        {
          pagePath: 'pages/category/index',
          iconPath: './imgs/tabBar/classify-normal.png',
          selectedIconPath: './imgs/tabBar/classify-active.png',
          text: '分 类'
        },
        {
          pagePath: 'pages/shop/list/index',
          iconPath: './imgs/tabBar/shop-normal.png',
          selectedIconPath: './imgs/tabBar/shop-active.png',
          text: '门 店'
        },
        {
          pagePath: 'pages/my/index',
          iconPath: './imgs/tabBar/my-normal.png',
          selectedIconPath: './imgs/tabBar/my-active.png',
          text: '我 的'
        }
      ]
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
