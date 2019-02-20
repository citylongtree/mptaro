import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button} from '@tarojs/components'
import { AtInput, AtActionSheet} from 'taro-ui'
import { util } from "../../../utils"
import HgImg from '../../../components/hgImg/index'
import { SingleSelect } from '../../../components/select/select'
import api from '../../../api/order/order.js'

import './refund.styl'

export default class Refund extends Component {
    config = {
        navigationBarTitleText: '申请退换',
        enablePullDownRefresh: false
      }
    constructor (props) {
        super(props)
        this.state = {
            orderId:'',
            detail:{},
            cause: '',
            cause2: '',
            info: '',
            select:false,
            select1:false,
            returnType:''
        }
    }
    handleChange (value) {
        this.setState({
            info:value
        })
    }
    changeSelect(){
        this.setState({
            select : true,
            select1 : false
        })
    }
    changeSelects(){
        this.setState({
            select : false,
            select1 : true
        })
    }
    canCal(event){
        console.log(event)
        this.setState({
        })
    }
    changeHandler(e){
        if(e == '仅退款'){
            this.setState({
                returnType:1,
                cause1 : e,
                select : false,
                select1 : false
            })
        }else if(e == '退货退款'){
            this.setState({
                returnType:2,
                cause1 : e,
                select : false,
                select1 : false
            })
        }else{
            {
                this.setState({
                    cause : e,
                    select : false,
                    select1 : false
                })
            }
        }

    }
    postRefund(){
        if(!util.isNotNullString(this.state.cause1)){
          util.showToast('请选择服务类型')
          return
        }
        if(!util.isNotNullString(this.state.cause)){
          util.showToast('请选择退款原因')
          return
        }
        let data={
            orderId:this.state.orderId,
            shopSkuId:this.state.detail.shopSkuId,
            refundMoney:this.state.detail.refundMoney,
            platform:'MINI',
            returnType:this.state.returnType,
            returnReason:this.state.cause,
            returnInstruction:this.state.info
        }
        api.refunds(data).then(()=>{
          util.showToast('申请成功')
          Taro.navigateBack()
        })
    }
    goToGoods(goodsId,goodsNo,shopId){
        Taro.navigateTo({url:`/pages/goodsDetail/index?shopId=${shopId}&goodsId=${goodsId}&goodsNo=${goodsNo}`})
    }
    componentWillMount(){
        const {orderId,shopSkuId} = this.$router.params
        this.setState({
            orderId:orderId
        })
        api.refundsMoney({orderId:orderId,shopSkuId:shopSkuId}).then(res=>{
            this.setState({
                detail: res.data
            })
        })
    }
    render(){
        const {select, cause1, cause, detail} = this.state
        return (
            <View className='refundPage'>
                <View className='listBox'>
                    <View className='orderMain' key={detail.goodsId} onClick={this.goToGoods.bind(this,detail.goodsId,detail.goodsNo,detail.shopId)}>
                            <View className='orderMainLeft'>
                                <HgImg className='pic' src={detail.picUrl}/>
                            </View>
                            <View className='orderMainRight'>
                                <View className='orderMainRightT'>
                                    <View className='orderName'>{detail.goodsName}</View>
                                </View>
                                <View  className='orderMainRightD'>
                                    <View className='orderCnt'>
                                        <Text>规格: {detail.shopSkuValue==='0'?'无':detail.shopSkuValue}</Text>
                                    </View>
                                    <View className='orderMoney'>
                                        <View className='Money'>¥{detail.goodsPrice}</View>
                                        <View className='Number'>x{detail.goodsCnt}</View>
                                    </View>
                                </View>
                            </View>
                        </View>
                </View>
                <View className='menu'>
                    <View className='menu1' onClick={this.changeSelects.bind(this)}>
                        <View className='cause'>服务类型</View>
                        {
                            cause1?(<View className='select'>{cause1}</View>):(<View className='select'>请选择 &nbsp; &gt;</View>)
                        }
                    </View>
                    <View className='menu1' onClick={this.changeSelect.bind(this)}>
                        <View className='cause'>退款原因</View>
                        {
                            cause?(<View className='select'>{cause}</View>):(<View className='select'>请选择 &nbsp; &gt;</View>)
                        }
                    </View>
                    <View className='menu2'>
                        <View className='money'>退款金额：<Text className='price'>￥{detail.refundMoney}</Text></View>
                        <View className='freight'>(包含运费￥{detail.freight})</View>
                    </View>
                    <View className='menu3'>
                        <AtInput name='valiue' title='退款说明：' type='text' placeholder='选填' value={this.state.info} onChange={this.handleChange.bind(this)} />
                    </View>
                </View>
                <View className='submit'>
                    <Button onClick={this.postRefund.bind(this)}>提交</Button>
                </View>
                <View className='pop-up'>
                <AtActionSheet isOpened={select} cancelText='关闭' title='退款原因'>
                    <SingleSelect onHandleChange={this.changeHandler} type={'reasonData2'}></SingleSelect>
                </AtActionSheet>
                <AtActionSheet isOpened={select1} cancelText='关闭' title='服务类型'>
                    <SingleSelect onHandleChange={this.changeHandler} type={'serveData'}></SingleSelect>
                </AtActionSheet>
                </View>
            </View>
        )
    }
}
