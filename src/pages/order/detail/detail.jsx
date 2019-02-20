import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button} from '@tarojs/components'
import {AtList, AtListItem, AtActionSheet, AtModal, AtToast, AtIcon} from 'taro-ui'
import { util } from "../../../utils"
import { SingleSelect } from '../../../components/select/select'
import api from '../../../api/order/order.js'
import HgImg from '../../../components/hgImg/index'
import getDict from '../../../utils/dict/index.js'
import './detail.styl'

export default class Detail extends Component {
    config = {
        navigationBarTitleText: '订单详情'
      }
    constructor (props) {
    super(props)
    this.state = {
        detail: {},
        btnBox: false,
        del: false,
        sure: false,
        orderId:'',
        text:'',
        hint:false,
        reason:'',
        platform:'MINI',
        }
    }
    gopre(orderNo){
        let data={
            orderNo:orderNo,
            type:'WECHAT',
            payType:'buy'
        }
        api.pre(data).then(res=>{
            Taro.requestPayment({
                'timeStamp':res.data.sdkParams.timeStamp,
                'nonceStr': res.data.sdkParams.nonceStr,
                'package': res.data.sdkParams.package,
                'signType':'MD5',
                'paySign':res.data.sdkParams.paySign
            }).then(()=>{
              this.getDataItems(this.state.orderType,1)
            })
        })
    }
    // 弹出模态框
    onBtn(e){
        if(e==='del'){
            this.setState({
                del: true
            })
        }else if(e==='sure'){
            this.setState({
                sure: true
            })
        }
    }
    // 删除订单
    handleConfirm(){
        api.deleted({orderId:this.state.detail.orderId}).then(res=>{
        if(res.success===true){
            this.setState({
            del : false,
            })
            Taro.navigateBack()
            }
        })
    }
    // 取消删除
    handleCancel(){
        this.setState({
            del : false,
            sure : false
        })
    }
    // 确认收货
    handleConfirms(){
        api.receipt({orderId:this.state.detail.orderId}).then(res=>{
        if(res.success===true){
            this.setState({
            sure : false,
            })
            api.orderDetail({orderId:this.state.detail.orderId}).then(res=>{
                this.setState({
                    detail: res.data
                })
            }
            )
        }
        })
    }
    // 取消收货
    btnCancel = () => {
        this.setState({
            btnBox: true
        })
    }
    // 取消理由
    changeHandler(e){
        this.setState({
            reason : e,
        })
    }
    postReasons(){
        this.setState({
         btnBox:false,
        })
    }
    // 发送取消
    postReason(){
        this.setState({
         btnBox:false,
        })
        api.cance({reason:this.state.reason,platform:this.state.platform,orderId:this.state.detail.orderId}).then(res=>{
            if(res.success===true){
                api.orderDetail({orderId:this.state.detail.orderId}).then(res=>{
                    this.setState({
                        detail: res.data
                    })
                }
                )
                util.showToast('取消成功')
              }
            })
    }
    // 跳转门店
    goShop = (shopId) =>{
        Taro.navigateTo({url:`/pages/shop/index/index?shopId=${shopId}`})
    }
    // 跳转商品
    goToGoods(goodsId,goodsNo,shopId){
        Taro.navigateTo({url:`/pages/goodsDetail/index?shopId=${shopId}&goodsId=${goodsId}&goodsNo=${goodsNo}`})
    }
    // 跳转退款
    goRefund(orderId, shopSkuId, e){
        e.stopPropagation()
        Taro.navigateTo({url: `../refund/refund?orderId=${orderId}&shopSkuId=${shopSkuId}`})
    }
    goRefundDetail(refundsId,e){
        e.stopPropagation()
        Taro.navigateTo({url: `../afterSale/detail?refundsId=${refundsId}`})
    }
    // 跳转退货
    goExchange(orderId, shopSkuId, e){
        console.log(orderId)
        console.log(shopSkuId)
        e.stopPropagation()
        Taro.navigateTo({url: `../refund/exchange?orderId=${orderId}&shopSkuId=${shopSkuId}`})
    }
    // 跳转物流
    goLogistics(){
        Taro.navigateTo({url: `../../logistics/index?orderNo=${this.state.detail.orderNo}`})
    }
    onPullDownRefresh(){
        this.getDataItems(this.state.orderType,1)
    }
    getDetail(value){
        api.orderDetail({orderId:value}).then(res=>{
            this.setState({
                detail: res.data
            })
        }
        )
        Taro.stopPullDownRefresh()
    }
    componentDidShow () {
        const {orderId,orderType} = this.$router.params
        Taro.setStorageSync('orderType',orderType)
        this.setState({
            orderId:orderId
        })
        this.getDetail(orderId)
    }
    onPullDownRefresh(){
        this.getDetail(this.state.orderId)
    }
    render() {
        const {detail, btnBox, del, sure, text, hint} = this.state
        return (
            <View className='orderDetail'>
                <View className='textDetail clear'>
                    <View className='firstLine, special'>
                    <View className='orderNum, TextStyle'>订单号：</View><View className='orderTime'>{detail.orderNo}</View>
                    <View className='orderStata'>{getDict.getDetailstatus(detail.status)}</View>
                    </View>
                    <View className='twoLine, special'>
                    <View className='orderTime, TextStyle'>下单时间：</View><View className='orderTime'>{detail.placeTime}</View>
                    </View>
                    <View className='twoLine, special1'>
                    <View className='orderTime, TextStyle'>取货方式：</View><View className='orderTime'>{detail.deliverType===1?'快递到家':'到店取货'}</View>
                    <View className='orderStata' onClick={this.goLogistics.bind(this)}>{detail.deliverType===1&&detail.status!=='undeliver'&&detail.status!=='unpay'&&detail.status!=='closure'&&detail.status!=='refund'?<View>查看物流<AtIcon value='chevron-right' color='#FF5000' className='icon' size='16' style="margin-left:-2px;"/></View>:''}</View>
                    </View>
                    <View className='twoLine, special1'>
                    <View className='orderTime, TextStyle'>{detail.deliverType===1?'收货人：':'取货人：'}</View><View className='orderTime, dizhi'>{detail.receiverName}</View>
                    </View>
                    <View className='twoLine, special1'>
                    <View className='orderTime, TextStyle'>联系电话：</View><View className='orderTime, dizhi'>{detail.receiverMobile}</View>
                    </View>
                    {detail.deliverType===1?
                            <View className='twoLine, special1'>
                            <View className='orderTime, TextStyle'>收货地址:</View><View className='orderTime, dizhi'>{detail.receiveAddress?detail.receiveAddress:'无'}</View>
                            </View>:''
                    }
                    <View className='twoLine, lastLine, special1'>
                    <View className='orderTime, TextStyle'>买家留言：</View><View className='orderTime, dizhi'>{detail.buyerMessage?detail.buyerMessage:'无'}</View>
                    </View>
                    {
                        detail.reason?(<View className='twoLine, lastLine, special1'>
                        <View className='orderTime, TextStyle'>取消原因：</View><View className='orderTime, dizhi'>{detail.reason}</View>
                        </View>):''
                    }
                </View>
                <View className='detailOrderList'>
                    <View className='listBox'>
                        <View className='Top'>
                        <View className='shopName' onClick={this.goShop.bind(this, detail.shopId)}>
                    <View className='shopNameLeft'>{detail.shopName}</View>
                    <View style='float:left;margin-top:8px;margin-left:-2px'><AtIcon value='chevron-right' color='#A1A1A1' className='icon' size='16'/></View>
                </View>
                            <Text className='orderType'></Text>
                        </View>
                        {detail.goodsList.map(items=>(
                            <View className='orderMain' key={items.goodsId} onClick={this.goToGoods.bind(this,items.goodsId,items.goodsNo,detail.shopId)}>
                            <View className='orderMainLeft'>
                                <HgImg className='pic' src={items.picUrl} />
                            </View>
                        <View className='orderMainRight'>
                            <View className='orderMainRightT'>
                                <View className='orderName'>{items.goodsName}</View>
                                <View className='orderMoney'>
                                    <View className='Money'>￥{items.goodsPrice}</View>
                                    <View className='Number'>x{items.goodsCnt}</View>
                                </View>

                            </View>
                            <View  className='orderMainRightD'>
                            <Text>规格: {items.shopSkuValue?items.shopSkuValue:'无'}</Text>
                                {
                                   detail.status==='undeliver'?
                                   (<View>{items.goodsStatus==='refunds'?
                                   (<Button className='refunding' onClick={this.goRefundDetail.bind(this, items.refundsId)}>退款中</Button>)
                                   :items.goodsStatus==='success'?
                                   (<Button className='refunding' onClick={this.goRefundDetail.bind(this, items.refundsId)}>退款成功</Button>)
                                   :(<Button className='refunding' onClick={this.goRefund.bind(this, detail.orderId, items.shopSkuId)}>退款</Button>)
                                }</View>)
                                   :
                                   (detail.status==='refund' || detail.status==='unreceipt' || detail.status==='closure'?(<View>{items.goodsStatus==='refunds'?
                                   (<Button className='refunding' onClick={this.goRefundDetail.bind(this, items.refundsId)}>退款中</Button>)
                                   :items.goodsStatus==='success'?
                                   (<Button className='refunding' onClick={this.goRefundDetail.bind(this, items.refundsId)}>退款成功</Button>)
                                   :items.goodsStatus==='normal'?(<Button className='refunding' onClick={this.goExchange.bind(this, detail.orderId, items.shopSkuId)}>退换</Button>):''
                                }</View>):'')
                                }
                            </View>
                        </View>
                    </View>
                          ))}
              </View>
              <View className='costList'>
                  <AtList hasBorder={false}>
                    <AtListItem title='商品总额' extraText={'￥'+detail.totalGoodsMoney} hasBorder={false} />
                    {detail.payPath?(<AtListItem title='支付方式' extraText={detail.payPath===1?'支付宝':'微信'} hasBorder={false}/>) : ''}
                    {detail.deliverType===1?<AtListItem title='运费' extraText={'￥'+detail.expressMoney?'￥'+detail.expressMoney:'￥0.00'} hasBorder={false} />:''}
                    <AtListItem title='优惠券抵用' extraText={detail.couponMoney?'￥'+detail.couponMoney:'￥0.00'} hasBorder={false} />
                    <AtListItem title='红包抵用' extraText={detail.redPacketMoney?'￥'+detail.redPacketMoney:'￥0.00'} hasBorder={false} />
                    <AtListItem title={detail.status!=='unpay'&&detail.closeType!=='USERCLOSE'?'实付款':'需付款'} extraText={'￥'+detail.payMoney} hasBorder={false} />
                  </AtList>
                  {detail.status =='unpay'?(<View className='buttonGroup'>
                    <Button className='btnOne allBtn' onClick={this.btnCancel.bind(this)}>取消订单</Button>
                    <Button className='btnTwo allBtn' onClick={this.gopre.bind(this, detail.orderNo)}>立即付款</Button>
                  </View>):''}
                  {detail.status =='unreceipt'?(<View className='buttonGroup'>
                    <Button className='btnTwo allBtn aloneBtn' onClick={this.onBtn.bind(this, 'sure')}>确认收货</Button>
                  </View>):''}
                  {detail.status =='closure'?(<View className='buttonGroup '>
                    <Button className='btnTwo allBtn aloneBtn' onClick={this.onBtn.bind(this, 'del')}>删除订单</Button>
                  </View>):''}
              </View>
                </View>
            <AtActionSheet isOpened={btnBox} cancelText='确定'onCancel={this.postReason.bind(this)} onClose={this.postReasons.bind(this)} >
                <SingleSelect onHandleChange={this.changeHandler} type='cancelData'></SingleSelect>
            </AtActionSheet>
            <AtModal  isOpened={del} cancelText='取消' confirmText='确认' onClose={this.handleClose} onCancel={this.handleCancel.bind(this)} onConfirm={this.handleConfirm.bind(this, 'del')} content='确定删除该订单吗' />
            <AtToast  isOpened={hint} text={text} onClose={this.changeHint}></AtToast>
            <AtModal  isOpened={sure} cancelText='取消' confirmText='确认' onClose={this.handleClose} onCancel={this.handleCancel.bind(this)} onConfirm={this.handleConfirms.bind(this, 'sure')} content='确定收到货了吗' />
            </View>
        )
    }
}
