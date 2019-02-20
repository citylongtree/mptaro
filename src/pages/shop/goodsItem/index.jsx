import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image } from '@tarojs/components'
import './index.styl'
import util from "../../../utils/util";

export default class goodsItem extends Component {
  constructor(props){
    super(props)
  }
  componentWillMount () {
  }
  addShopCar(e){
    e.stopPropagation()
    this.props.onAddShopCar()
  }
  goDetail(goodsData,e){
    e.preventDefault()
    const goodsId = goodsData.goodsId || goodsData.id
    const goodsNo = goodsData.goodsNo || ''
    const shopId = this.props.shopId
    util.jumpUrl(`/pages/goodsDetail/index?goodsId=${goodsId}&shopId=${shopId}&goodsNo=${goodsNo}`)
  }

  render () {
    const { goodsData, type } = this.props
    return (
      <View className='goodsItem' onClick={this.goDetail.bind(this, goodsData)}>
        <View className='goodsItem-left'>
          <Image className={type==='search' ? 'search-item-img' : 'list-item-img'} src={goodsData.picUrl||goodsData.pictureUrl} />
        </View>
        <View className={type==='search' ? 'goodsItem-right search-right': 'goodsItem-right list-right'}>
          <Text className='goodsTitle text-ellipsis2'>{goodsData.goodsName||goodsData.title}</Text>
          <Text className='goodsCnt'>已售出{goodsData.sales}件</Text>
          <View className='goodsItem-right-bottom'>
            <Text className='goodsPrice'>￥{goodsData.goodsPrice||goodsData.price}</Text>
            <View className='addShopCar' onClick={this.addShopCar.bind(this)}>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
