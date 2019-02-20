import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import './index.styl'

export default class set extends Component {
  config = {
    navigationBarTitleText: '设置',
    enablePullDownRefresh: false
  }

  constructor(props) {
    super(props)
  }
  exit() {
    Taro.clearStorageSync()
    Taro.switchTab({
      url: '/pages/my/index'
    })
  }
  render() {
    return (
      <View className='Set'>
        <View className='exit-btn' onClick={this.exit}>退出登录</View>
      </View>
    )
  }
}
