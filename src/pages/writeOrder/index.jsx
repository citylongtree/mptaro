import Taro, { Component } from '@tarojs/taro'
import {connect} from "@tarojs/redux";
import { View, Image, Text, Input  } from '@tarojs/components'
import { AtList, AtListItem, AtIcon } from "taro-ui"
import HgPicker from '../../components/picker/index'
import {iconWechat} from '../../imgs'
import {iconEdit} from '../../imgs/shop'
import { filter } from '../../utils'
import api from '../../api/writeOrder/writeOrder'
import util from "../../utils/util"
import './index.styl'

@connect(({writeOrder})=>({
  ...writeOrder
}))
class Index extends Component {
  config = {
    navigationBarTitleText: '填写订单',
    enablePullDownRefresh: false
  }
  constructor(props){
    super(props)
    this.state = {
      tackNameTag: false,
      mobileTag: false,
      pickerList: [],
      pickerActiveId: '',
      pickerShowTag: false,
      pickerTitle: '',
      pickerType: ''
    }
  }
  componentWillMount () {
    if(this.$router.params.haveAddress===undefined||this.$router.params.haveAddress===null||this.$router.params.haveAddress===''){
      this.props.dispatch({
        type: 'writeOrder/pageOnload'
      })
    }
  }
  selectAddress(){
    util.jumpUrl('/pages/my/address/index?type=order&fromType=write')
  }
  changeInput(label, e) {
    const {goStore} = this.props
    const contact = Object.assign({}, goStore, {[label]: e.detail.value.trim()})
    this.props.dispatch({
      type: 'writeOrder/save',
      goStore: contact
    })
  }

  inputFocus(val) {
    this.setState({
      [val]: true
    })
  }

  inputBlur(val) {
    this.setState({
      [val]: false
    })
  }

  closePicker(){
    this.setState({
      pickerShowTag: false
    })
  }

  showCoupon(coupon){
    this.props.dispatch({
      type: 'writeOrder/getCoupon',
      couponType: coupon
    }).then(() => {
        const {redBagList, couponList, couponType, redPacketType} = this.props
        if (coupon==='REDPACKET' && redBagList.length > 0){
          this.setState({
            pickerList: redBagList,
            pickerActiveId: redPacketType ? redPacketType.id : '',
            pickerShowTag: true,
            pickerTitle: '红包列表',
            pickerType: 'REDPACKET'
          })
        }else if(coupon==='COUPON' && couponList.length > 0){
          this.setState({
            pickerList: couponList,
            pickerActiveId: couponType ? couponType.id : '',
            pickerShowTag: true,
            pickerTitle: '优惠券列表',
            pickerType: 'COUPON'
          })
        }
      }
    )

  }

  selectItem(items) {
    this.setState({
      pickerActiveId: items.id,
      pickerShowTag: false
    })
    const {pickerType} = this.state
    if (pickerType === 'COUPON'){
      this.props.dispatch({
        type: 'writeOrder/setCoupon',
        title: 'couponType',
        items: items
      })
    }else if (pickerType === 'REDPACKET') {
      this.props.dispatch({
        type: 'writeOrder/setCoupon',
        title: 'redPacketType',
        items: items
      })
    } else if (pickerType === 'deliverType') {
      this.props.dispatch({
        type: 'writeOrder/save',
        deliverType: items
      })
      this.props.dispatch({
        type: 'writeOrder/setPickUp',
        setPick: items.value
      })
    }
  }
  showPickUpType(){
    const { pickUpType, deliverType } = this.props
    if(pickUpType.length>1){
      pickUpType.forEach((item) => {
        item.describe = item.name
        item.id = item.value
      })
      this.setState({
        pickerList: pickUpType,
        pickerActiveId: deliverType.value,
        pickerShowTag: true,
        pickerTitle: '取货方式',
        pickerType: 'deliverType'
      })
    }else {
      Taro.showToast({
        icon:'none',
        title: `本店仅支持${deliverType.name}`
      })
    }
  }
  payData(){
    const { deliverType, buyerMessage, shopId, goodsInfo, goStore, couponType, redPacketType, payMoney ,express,goShopState } = this.props
    const couponId = couponType ? couponType.id : 0
    const redPacketId = redPacketType ? redPacketType.id : ''
    let payData = {
      platform: 'MINI',
      payPath: 2,
      redPacketId,
    }
    const items = [{
      shopId,
      goodsInfo,
      deliverType: deliverType.deliverType,
      buyerMessage,
      payMoney,
      couponId,
    }]
    payData.items = items
    if (deliverType.value === 'TOSHOPPICUP') {
        payData.mobile = goStore.mobile
        payData.takeName = goStore.takeName
        payData.addressId = goStore.addressId || ''
    }else {
      payData.addressId = express.addressId
      payData.provinceName = express.provinceName
      payData.address = express.provinceName+express.cityName+express.countryName+express.address
    }
    api.save(payData).then(res => {
      api.pre({orderNo: res.data.orderNO, type: 'WECHAT', payType: 'buy'}).then(pre=>{
        Taro.requestPayment({
          'timeStamp':pre.data.sdkParams.timeStamp,
          'nonceStr': pre.data.sdkParams.nonceStr,
          'package': pre.data.sdkParams.package,
          'signType':'MD5',
          'paySign':pre.data.sdkParams.paySign,
          'success':(data)=>{
            if(data.errMsg==='requestPayment:ok'){
              Taro.redirectTo({
                url: '/pages/paySuccess/index'
              })
            }
          },
          'fail':(fail)=>{
            if(fail.errMsg==='requestPayment:fail cancel'){
              Taro.redirectTo({
                url: '/pages/order/index/index?orderStatus=unpay'
              })
            }
          }
        })
      })
    })
  }
  // 提交订单
  payTest(){
    const { deliverType, goStore, express } = this.props
    if (deliverType.value === 'TOSHOPPICUP'){
      if(goStore.takeName===''){
        Taro.showToast({
          icon: 'none',
          title: '请设置取货人'
        })
        return false
      }else if(goStore.mobile===''){
        Taro.showToast({
          icon: 'none',
          title: '请设置联系电话'
        })
        return false
      }else {
        this.payData()
      }
    }else {
      if (express===''){
        Taro.showToast({
          icon: 'none',
          title: '请选择收货地址'
        })
        return false
      }else {
        this.payData()
      }
    }
  }

  onPullDownRefresh() {
    Taro.stopPullDownRefresh()
  }
  // 留言同步
  leaveWord(e){
    this.props.dispatch({
      type: 'writeOrder/save',
      buyerMessage: e.detail.value
    })
  }

  render () {
    const { pickUpType, deliverType, goodsInfo, shopName, sumCnt, freight, goStore, couponType, redPacketType, payMoney ,express, buyerMessage } = this.props
    return (
      <View className='writeOrder'>
        <View className='main'>
          <View className='pickUp'>
            <AtList>
              <AtListItem
                className='typeLi'
                title='取货方式'
                extraText={deliverType.name}
                arrow={pickUpType.length===1?false:'right'}
                onClick={this.showPickUpType}
              />
            </AtList>
            {
              deliverType.value === 'COURIER' &&
              <View className='express'>
                {
                  express === '' &&
                  <View className='selectAddress' onClick={this.selectAddress} >
                    <Text className='selectAddress-title'>收货地址</Text>
                    <View  className='selectAddress-right'><Text className='selectAddress-right'>请设置收货地址</Text><AtIcon className='rightIcon' value='chevron-right' size='24' color='#c7c7cc' /></View>
                  </View>
                }
                {
                  express !== '' &&
                  <View className='addressMessage'  onClick={this.selectAddress}>
                    <View className='addressMessage-top'>
                      <Text className='userName text-ellipsis1'>收货人：{express.receiverName}</Text>
                      <Text>{express.receiverMobile}</Text>
                    </View>
                    <View className='addressMessage-bottom'>
                      <Text className='addressMessage-address text-ellipsis2'>收货地址：{express.provinceName+express.cityName+express.countryName+express.address}</Text><AtIcon className='rightIcon' value='chevron-right' size='24' color='#c7c7cc' />
                    </View>
                  </View>
                }
              </View>
            }
            {
              deliverType.value === 'TOSHOPPICUP' &&
              <View className='goShop'>
                <View className='goShop-input line'>
                  <Text className='goShop-input-label'>取货人</Text>
                  <Input className='goShop-input-content'maxLength={30} type='text' onBlur={this.inputBlur.bind(this, 'tackNameTag')} onFocus={this.inputFocus.bind(this, 'tackNameTag')}  focus={this.state.tackNameTag} placeholder='请输入姓名' onInput={this.changeInput.bind(this, 'takeName')}  placeholderStyle='color: #999898'  value={goStore.takeName} />
                  {!this.state.tackNameTag && <Image className='icon-edit' src={iconEdit} onClick={this.inputFocus.bind(this, 'tackNameTag')} />}
                </View>
                <View className='goShop-input'>
                  <Text className='goShop-input-label'>联系电话</Text>
                  <Input className='goShop-input-content' type='number' maxLength={14} onBlur={this.inputBlur.bind(this, 'mobileTag')} onFocus={this.inputFocus.bind(this, 'mobileTag')} focus={this.state.mobileTag} placeholder='请输入手机号码' onInput={this.changeInput.bind(this, 'mobile')} placeholderStyle='color: #999898' value={goStore.mobile} />
                  {!this.state.mobileTag && <Image className='icon-edit' src={iconEdit} onClick={this.inputFocus.bind(this, 'mobileTag')} />}
                </View>
              </View>
            }

          </View>
          <View className='goods-list'>
            <Text className='shopName text-ellipsis1'>{shopName}</Text>
            {
              goodsInfo.map((items, index) =>(
                <View className='goods-item line' key={index} >
                  <View className='goods-item-img'>
                    <Image src={items.picture} />
                  </View>
                  <View className='goods-item-desc'>
                    <View className='goods-item-goodsName text-ellipsis2'>{items.title}</View>
                    <Text className='goods-item-goodsSku'>{items.skuName || ''}</Text>
                    <View className='goods-desc-bottom'>
                      <Text className='goods-item-price'>￥{items.price}</Text>
                      <Text className='goods-item-goodsCnt'>×{items.goodsCnt}</Text>
                    </View>
                  </View>
                </View>
              ))
            }
          </View>
          <View className='main-bottom'>
            <View className='main-bottom-list line'>
              <Text className='left-label'>买家留言</Text>
              <Input className='remark' type='text' value={buyerMessage} onInput={this.leaveWord} placeholder='填写留言' placeholderStyle='color:#999898' />
            </View>
            {
              deliverType.value === 'COURIER' && <View className='main-bottom-list line'>
                <Text className='left-label'>运费</Text>
                <Text className='main-bottom-list-right' style='color: #ED6C00'>￥{freight}</Text>
              </View>
            }
            <View className='main-bottom-list marginBottom' onClick={this.showCoupon.bind(this, 'COUPON')}>
              <Text className='left-label'>优惠券</Text>
              <View>
                <Text className='main-bottom-list-right'>{couponType!==null && couponType.id!==0 ? couponType.couponMoney+'元优惠券' : '选择优惠券'}</Text>
                {couponType ===null && <AtIcon className='rightIcon' value='chevron-right' size='24' color='#c7c7cc' />}
              </View>
            </View>
            <View className='main-bottom-list line' onClick={this.showCoupon.bind(this, 'REDPACKET')}>
              <Text className='left-label'>红包</Text>
              <View>
                <Text className='main-bottom-list-right'>{redPacketType!==null && redPacketType.id!==0 ? redPacketType.couponMoney+'元红包' : '选择红包'}</Text>
                {redPacketType===null && <AtIcon className='rightIcon' value='chevron-right' size='24' color='#c7c7cc' />}
              </View>
            </View>
            <View className='main-bottom-list'>
              <Text className='left-label'>支付方式</Text>
              <View className='main-bottom-list-right'><View className='iconWeiXin'><Image src={iconWechat} /></View><Text>微信支付</Text></View>
            </View>
          </View>
        </View>
        <View className='placeOrder'>
          <View className='count-cnt'>共<Text style='color: #FE7200'>{sumCnt}</Text>&nbsp;件&nbsp;&nbsp;&nbsp;&nbsp;总计:<Text className='payMoney'>{filter.currency(payMoney)}</Text></View>
          <Text className='place-btn' onClick={this.payTest}>提交订单</Text>
        </View>
        <HgPicker PickerType={this.state.pickerType} title={this.state.pickerTitle} onClose={this.closePicker} showTag={this.state.pickerShowTag} onSelect={this.selectItem.bind(this)}  activeId={this.state.pickerActiveId} list={this.state.pickerList} />
      </View>
    )
  }
}
export default Index
