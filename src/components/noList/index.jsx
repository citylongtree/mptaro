import Taro, { Component } from '@tarojs/taro'
import { View,  Image, Text, Button } from '@tarojs/components'
import './index.styl'
import {noGoods, noOrder,noLocation} from './../../imgs/index'


export default class goodItem extends Component {
  constructor(props){
    super(props)
  }
  render () {
    const obj={noGoods,noOrder,noLocation}
    const {errPage,image} = this.props // 是否显示
    return (
      <View className='search-nohistory'>
        <Image className='search-nohistory-img' src={obj[image]} />
        {image!=='noLocation' && <View className='tips'>{errPage}</View>}
        {
          image==='noLocation' &&
          <View className='openView'>
            <Text className='openText'>定位服务未开启，</Text>
            <Text className='openText'> 请在系统设置中开启“汉固达”的定位服务</Text>
            <Button openType='openSetting' className='openLocation'>去开启</Button>
          </View>
        }
      </View>
    )
  }
}
