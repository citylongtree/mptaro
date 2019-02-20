import Taro, { Component } from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import api from '../../../api/order/order.js'
import HgImg from '../../../components/hgImg/index'
import './detail.styl'


export default class refund extends Component {
    config = {
      navigationBarTitleText: '退款详情'
    }
    constructor (props) {
        super(props)
        this.state = {
            data:{},
        }
    }
    componentWillMount(){
        let {refundsId} = this.$router.params
        let data={
            refundsId:refundsId,
            type:1
        }
        api.refundsDetail(data).then(res=>{
            this.setState({
                data:res.data
            })
        })
    }
    goToGoods(goodsId,shopId){
        Taro.navigateTo({url:`/pages/goodsDetail/index?shopId=${shopId}&goodsId=${goodsId}`})
    }
    render(){
        const {data} = this.state
        console.log(data)
        return(
            <View className='refundDetail'>
                <View className='refundDetail-text'>
                    <View className='refundState'>{data.goodsStatus==='refunds'?'退款审核中':'退款成功'}</View>
                    <View className='applicationDate, group'>申请时间：{data.applyTime}</View>
                    {data.returnTime?(<View className='refundTime, group'>退款到账时间：{data.returnTime}</View>):''}
                    <View className='refundMoney, group'>退款金额：<Text className='only'>¥{data.returnMoney}</Text></View>
                    {data.goodsStatus==='refunds'?'':(<View className='refundWhere, group'>退款路径：{data.returnPath==='1'?'支付宝':data.returnPath==='2'?'微信':data.returnPath==='3'?'白条':''}</View>)}
                    <View className='refundCause, group'>退款原因：{data.returnReason}</View>
                    <View className='refundMark, group'>退款说明：{data.returnInstruction}</View>
                </View>
                <View className='refundDetail-Main'>
                    <View className='orderMain' style='background:#F8F8F8' onClick={this.goToGoods.bind(this,data.goodsId,data.shopId)}>
                        <View className='orderMainLeft'>
                            <HgImg className='pic' src={data.picUrl}/>
                        </View>
                        <View className='orderMainRight'>
                            <View className='orderMainRightT'>
                                <View className='orderName'>{data.goodsName}</View>
                            </View>
                            <View  className='orderMainRightD'>
                                <View className='orderCnt'>
                                    <Text>{data.shopSkuValue}</Text>
                                </View>
                                <View className='orderMoney'>
                                    <View className='Money'>¥{data.goodsPrice}</View>
                                    <View className='Number'>x{data.goodsCnt}</View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}