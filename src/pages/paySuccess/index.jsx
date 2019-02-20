import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import './index.styl'
import TitleTop from '../home/titleTop/index'
import goodItem from '../../components/goodsItem/index'
import api from '../../api/goods/shopCar'
import { paySuccess } from '../../imgs/index'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '支付成功',
    enablePullDownRefresh: false
  }
  constructor(props){
    super(props)
    this.state = {
      recommended: ''
    }
  }
  componentWillMount () {
    this.getRecommended()
  }

  componentDidMount () {
  }

  componentWillUnmount () {

  }

  componentDidShow () {

  }
  /**
   * 获取猜你喜欢列表
   */
  getRecommended(){
    api.recommended().then(res=>{
      this.setState({
        recommended:res.items
      })
    })
  }

  componentDidHide () { }

  render () {
    const {recommended} = this.state
    return (
      <View className='paySuccess'>
        <View className='header'>
          <Image className='paySuccess-img' src={paySuccess} />
          <Text className='paySuccess-title'>支付成功</Text>
        </View>
        <TitleTop title='猜你想买' hideRight />
        <View className='goodsList clear'>
          {
            recommended.map((item,index)=>(
              <goodItem
                style={index !== 0 && index !== 1 && 'margin-top: 10px'}
                borderRadius
                src={item.goodsPicUrl[0].detailUrl}
                goodsName={item.goodsName}
                goodsPrice={item.skuValueList[0].price}
                goodsId={item.goodsId}
                shopId={item.shopId}
                goodsNo={item.goodsNo}
                key={item.goodsId}
                bgColor='#fff'
              />
            ))
          }
        </View>
      </View>
    )
  }
}

