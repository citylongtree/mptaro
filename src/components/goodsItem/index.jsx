import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.styl'
import {util} from './../../utils'
import HgImg from "../hgImg/index";

export default class goodItem extends Component {
  constructor(props){
    super(props)
    this.state={}
  }
  /**
   * @param goodsId
   * @param shopId
   * 跳转商品详情
   */
  goDetail(goodsId, shopId, goodsNo){
    util.jumpUrl( '/pages/goodsDetail/index?goodsId='+goodsId+'&shopId='+shopId+'&goodsNo='+goodsNo)
  }
  render () {
    /**
     * @param borderRadius: 是否存在圆角
     * @param src 图片url
     * @param bgColor 文字的背景
     * */
    const {borderRadius, goodsName, goodsPrice, goodsId, shopId, bgColor, goodsNo,src} = this.props
    return (
      <View className={borderRadius?'borderRadius goods-Item':'goods-Item'} onClick={this.goDetail.bind(this, goodsId, shopId, goodsNo)}>
        <View className='goods-img'>
          <HgImg
            src={src}
          >
          </HgImg>
        </View>
        <View className='goods-bottom' style={bgColor && 'background-color:'+ bgColor || '#f7f7f7'}>
          <Text className='goods-name'>{goodsName || '--'}</Text>
          <Text className='goods-price'>{'￥'+goodsPrice}</Text>
        </View>
      </View>
    )
  }
}
