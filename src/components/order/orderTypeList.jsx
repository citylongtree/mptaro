import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button,} from '@tarojs/components'
import {AtIcon} from "taro-ui";
import './orderTypeList.styl'
import getDict from '../../utils/dict/index.js'
import noOrder from '../../imgs/icons/noOrder.png'
import HgImg from '../hgImg/index'


export default class OrderTypeList extends Component {
    constructor (props) {
        super(props)
        this.state = {
          light: false,
        }
    }
    //去物流
    goLogistics(orderNo){
      const {orderType} = this.props
      console.log(orderType)
      Taro.navigateTo({url: `/pages/logistics/index?orderNo=${orderNo}&orderType=${orderType}`})
    }
    //去详情
    goto = (orderId) =>{
      const {orderType} = this.props
      Taro.navigateTo({
        url: `/pages/order/detail/detail?orderId=${orderId}&orderType=${orderType}`
      })
    }
    //去门店
    goShop = (shopId) =>{
      Taro.navigateTo({url:`/pages/shop/index/index?shopId=${shopId}`})
    }
    // 按钮传参
    onBtn(e, orderId){
          this.props.onHandleChange(e, orderId)
    }
    componentWillMount () {}
    componentDidMount () {}
    componentWillUnmount () {}
    componentDidShow () {}
    componentDidHide () {}
    render () {
    let {list,isLoad,orderType} = this.props
      return (
          <View className='list'>
          {list.length>0&&isLoad&&list.map(item=>(
              <View className='listBox' key={item.orderId}>
                <View className='Top'>
                <View className='shopName' onClick={this.goShop.bind(this, item.shopId)}>
                    <View className='shopNameLeft'>{item.shopName}</View>
                    <View style='float:left;margin-top:8px;margin-left:-2px'><AtIcon value='chevron-right' color='#A1A1A1' className='icon' size='16'/></View>
                </View>
                    <Text className='orderType'>{getDict.getOrderType(item.orderStatus)}</Text>
                </View>
                {item.goodsInfo.map(goodsInfo=>(
                    <View className='orderMain' key={goodsInfo.goodsId} onClick={this.goto.bind(this, item.orderId)}>
                    <View className='orderMainLeft'>
                        <HgImg className='pic' src={goodsInfo.picUrl} cusStyle='height:77px;width:77px;padding: 7px 12px 8px 12px' />
                    </View>
                    <View className='orderMainRight'>
                        <View className='orderMainRightT'>
                            <View className='orderName'>{goodsInfo.goodsName}</View>
                            <View className='orderMoney'>
                                <View className='Money'>￥{goodsInfo.goodsPrice}</View>
                                <View className='Number'>x{goodsInfo.goodsCnt}</View>
                            </View>
                        </View>
                        <View  className='orderMainRightD'>
                            <Text>{goodsInfo.shopSkuValue}</Text>
                            {
                             item.orderStatus==='refund'||item.orderStatus==='closure'?(<Text style='float:right;margin-right:10px;color:#FF7915;margin-top:10px'>{goodsInfo.goodsStatus==='refunds'?'退款中':goodsInfo.goodsStatus==='success'?'退款成功':''}</Text>):''
                            }

                        </View>
                    </View>
                </View>
                ))}
                <View className='btn1'>
                    {
                        item.orderStatus==='unpay'?(<Text className='account'>共{item.totalGoods}件   需付款：￥{item.payPrice}</Text>):(<Text className='account'>共{item.totalGoods}件   实付款：￥{item.payPrice}</Text>)
                    }
                </View>
                {
                    item.orderStatus==='undeliver' || item.orderStatus ==='refund' || item.orderStatus ==='complete'&&item.deliverType===2 ?(''):(<View className='btn'>
                    <View className='btnGroup'>
                        <View className='action'>
                        {item.orderStatus==='unpay'?(<View className='btnBox'><Button className='btns, btnL' onClick={this.onBtn.bind(this, 'pre', item.orderNo)}>立即付款</Button><Button className='btns, btnR' onClick={this.onBtn.bind(this, 'cancel', item.orderId)}>取消订单</Button></View>):''}
                        {item.orderStatus==='unreceipt'?(<View className='btnBox'>{item.deliverType===1?<Button className='btns, btnL' onClick={this.goLogistics.bind(this, item.orderNo, orderType)} >查看物流</Button>:''}<Button className='btns, btnR' onClick={this.onBtn.bind(this, 'sure', item.orderId)}>确认收货</Button></View>):''}
                        {item.orderStatus==='complete'&&item.deliverType===1?<Button className='btns' onClick={this.goLogistics.bind(this, item.orderNo, orderType)} >查看物流</Button>:''}
                        {item.orderStatus==='closure'?<Button className='btns' onClick={this.onBtn.bind(this, 'del', item.orderId)}>删除订单</Button>:''}
                        </View>
                        <View className='action'>
                        </View>
                    </View>
                </View>)
                }
                
              </View>
          ))}
          {
            list.length === 0&&isLoad&&(
              <View className='noOrderPic'>
              <View className='center'>
              <Image src={noOrder} className='orderPic'>
                </Image>
                <View className='title'>暂无订单</View>
              </View>
              </View>
            )
          }
          </View>
      )
    }
  }
  OrderTypeList.defaultProps={
    list:[]
}
