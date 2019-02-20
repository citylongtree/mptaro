import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import {connect} from "@tarojs/redux"
import { AtIcon } from "taro-ui"
import {util} from './../../../utils'
import './index.styl'
import { shoppingCar } from '../../../imgs/shop'
import CarCnt from "../../../components/carCnt/index"

@connect(({searchGoods}) => ({
  ...searchGoods
}))

class searchShoppingCar extends Component {
  constructor(props){
    super(props)
  }
  componentWillMount () {
  }

  goSearch() {
    const {shopId, searchTypeTag} = this.props
    if (searchTypeTag == 'shopSearch') { // 店内搜索
      util.jumpUrl('/pages/shop/goodsSearch/index?shopId='+shopId)
    }else if(searchTypeTag == 'goodsSearch'){ // 商品搜索
      util.jumpUrl(`/pages/searchGoods/index?type=home`)
      this.props.dispatch({
        type: 'searchGoods/saveList',
        history:true,
        statePage:false,
        jumpPage:'search',
        showActionButton:true
      })
    }
  }

  goShopCar(){
    util.jumpUrl('/pages/carList/index')
  }

  render () {
    return (
      <View className='top-search'>
        <View className='header'>
          <View className='search' onClick={this.goSearch}>
            <AtIcon
              value='search'
              size='20'
              color='#adadad'
            >
            </AtIcon>
            <Text>输入商品名称</Text>
          </View>
          <View className='shoppingCar' onClick={this.goShopCar}>
            {util.isLogin() && <CarCnt className='searchShopPingCarCnt' />}
            <Image
              className='img-style'
              src={shoppingCar}
            >
            </Image>
          </View>
        </View>
      </View>
    )
  }
}
export default searchShoppingCar
