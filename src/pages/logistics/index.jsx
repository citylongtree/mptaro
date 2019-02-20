import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTimeline} from 'taro-ui'
import  api  from "../../api/order/order.js"
import './index.styl'

export default class Logistics extends Component {

  config = {
    navigationBarTitleText: '物流信息'
  }
  constructor (props) {
    super(props)
    this.state = {
      receivingAddress: '',
      shipperName: '',
      logisticCode: '',
      list: [],
    }
  }
  componentWillMount () {
    const {orderType,orderNo}= this.$router.params
    console.log(orderType)
    Taro.setStorageSync('orderType',orderType)
    api.logisticsInfo({orderNo:orderNo})
    .then(res=>{
      this.setState({
        receivingAddress: res.data.receivingAddress,
        shipperName: res.data.shipperName,
        logisticCode: res.data.logisticCode,
        list: res.data.traces
      })
    })
  }

  componentDidMount () {}

  componentWillUnmount () {}

  componentDidShow () {}

  componentDidHide () {
  }
  render () {
    const {receivingAddress, shipperName, logisticCode} = this.state
    const {list} = this.state
    list.forEach(function(item){
      item.icon = 'map-pin'
      // if(index === 0)item.color = 'yellow'
      item.title = item.acceptStation
      item.content = item.acceptTime.split()
      delete item.acceptTime
      delete item.acceptStation
      console.log(item)
      return item
  })
    return (
      <View className='orderIndex'>
        <View className='logisticsTop'>
          <View className='address'><Text>收货地址：</Text><Text style='word-wrap:break-word'>{receivingAddress}</Text></View>
          <View className='way'><Text>物流方式：</Text><Text>{shipperName}</Text></View>
          <View className='orderNumber'><Text>物流单号：</Text><Text>{logisticCode}</Text></View>
        </View>
        <View className='logisticsMain'>
        <View className='trace'>订单跟踪</View>
        <View className='step'>
        <AtTimeline items={list}></AtTimeline>
        </View>
        </View>
       
      </View>
    )
  }
}

