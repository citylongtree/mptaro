import Taro, { Component } from '@tarojs/taro'
import { View,Text, ScrollView } from '@tarojs/components'
import api from '../../api/card/card'
import './detail.styl'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '红包详情'
  }
  constructor (props) {
    super(props)
    this.state = {
      detail: {},
      notes:[],
    }
  }
  componentWillMount () {
    const id = this.$router.params.id
    api.info({id}).then(res=>{
      const detail = res.data
      this.getNotes(res.data)
      this.setState({
        detail
      })
    })
  }
  goShop = (shopId) =>{
    if(this.$router.params.type === 'red'){
      Taro.switchTab({url:'/pages/home/index'})
    }else{
      Taro.navigateTo({url:`/pages/shop/index/index?shopId=${shopId}`})
    }
  }
  setNullString(str){
    const nullList = ['', 'null', null, undefined, 'undefined']
    return nullList.includes(str) ? '♀' : str
  }
  getNotes(detail){
    const text = this.$router.params.type === 'red' ? '红包' : '优惠券'
    if(this.$router.params.type != 'red'){
      Taro.setNavigationBarTitle({
        title: '优惠券详情'
      })
    }   
    const  notes = [
      `订单商品总额满${this.setNullString(detail.limitMoney )}元时可用`,
      `限购买${this.setNullString(detail.typeIdNames)}分类下的商品时始用`,
      `限购买{${this.setNullString(detail.brandNames)}品牌下的商品时使用`,
      `下单后在“${text}”中手动选择`,
      `${text}每次只能使用一个`,
      `使用${text}的订单若发生全额退款或交易关闭，${text}退回，可在“我的-卡券包”查看”`,
      `${text}使用不设找零，逾期不可用`
    ].filter(item=>(item.indexOf('♀') === -1))
    this.setState({
      notes
    })
  }
  render () {
    const {detail,notes} = this.state
    return (
      <View className='card'>
        <View className='card-top'>
          <View className='card-top-title'>{detail.describe}</View>
          <View className='card-top-money'>
              <Text className='text'>
                {detail.couponMoney}
              </Text>
            </View>
          <View className='card-top-limit'>（满{detail.limitMoney}元可用）</View>
          <View className='card-top-time'>{detail.startTime}-{detail.endTime}</View>
        </View>
        <View className='card-info'>
          <View className='card-info-message'>
            <Text className='text'>使用须知</Text>
            <View className='after' />
          </View>
          <View className='card-info-notes'>
            <ScrollView className='card-info-scroll-view' scrollY>
              {
                notes.map((item,index)=>(
                  <View className='card-info-notes-item' key={index}>
                    {index + 1}. {item}
                  </View>
                ))
              }
            </ScrollView>
          </View>
          {
            detail.state==='USABLE'?(<View className='card-info-btn' onClick={this.goShop.bind(this, detail.shopId)}>立即使用</View>):detail.state==='USED'?(<View className='card-info-btn'>已使用</View>):(<View className='card-info-btn'>已过期</View>)
          }
        </View>
      </View>
    )
  }
}



