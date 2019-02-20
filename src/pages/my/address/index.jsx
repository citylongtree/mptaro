import Taro, {Component} from '@tarojs/taro'
import {connect} from "@tarojs/redux"
import {View, Image, Text} from '@tarojs/components'
import {AtSwipeAction, AtModal, AtModalContent, AtModalAction, Button} from "taro-ui"
import './index.styl'
import {carList, edit, right, aaimg} from './../../../imgs'
import api from './../../../api/address/address'
import {util} from "../../../utils"

@connect(({writeOrder})=>({
  ...writeOrder
}))
class My extends Component {
  config = {
    navigationBarTitleText: '收货地址',
    enablePullDownRefresh: false
  }

  constructor(props) {
    super(props)
    this.state = {
      addressList: [],
      showModal: false,
      addressId: '',
      state:'',
      type: 'my',
      autoClose: true,
    }
  }

  componentWillMount() {
    const {type} = this.$router.params
    this.setState({type})
  }
  componentDidShow(){
    this.init()
  }
  init(type) {
    const {fromType} = this.$router.params
    api.list().then((res) => {
      if (res.items.length == 0) {
        this.setState({
          state:'first'
        })
        if(type === 'noLoad' && fromType === 'write'){
          this.props.dispatch({
            type: 'writeOrder/setAddress',
            item: '',
            jumpType: false
          })
        }
      }else{
        this.setState({
          state:'two'
        })
      }
      this.setState({
        addressList: res.items
      })
    })
  }

  addAddress() {
      util.jumpUrl(`/pages/my/address/editAddress?type=add&&state=${this.state.state}`)
  }

  editAddress(item) {
    Taro.setStorageSync('addressInfo', item)
    util.jumpUrl('/pages/my/address/editAddress?type=edit&&state=two')
  }

// 点击侧滑删除
  onClickDel(addressId) {
    this.setState({
      showModal: true,
      addressId
    })
  }

  // 点击模态框取消
  onCancel() {
    this.setState({
      showModal: false,
    })
  }

  // 点击模态框确定删除
  onConfirm() {
    const {express} = this.props
    api.delete({addressId: this.state.addressId}).then(() => {
      if(express && express.addressId==this.state.addressId){
        this.props.dispatch({
          type: 'writeOrder/setAddress',
          item:'',
          jumpType: false
        })
      }
      this.init('noLoad')
    }).catch((error) => {
      Taro.showModal({
        content: error.message,
        showCancel: false
      })
    })
    this.setState({
      showModal: false,
    })
  }

  // 下单选择收货地址
  btnAddress(item) {
    if (this.state.type == 'order') {
      this.props.onAddAddress(item)
      this.props.dispatch({
        type: 'writeOrder/setAddress',
        item,
        jumpType: true
      })
    }
  }

  /**
   * 点击其他地方关闭滑块
   */
  setClose(){
    let {addressList} = this.state
    addressList.map(item=>{
        item.isClose = true
    })
    this.setState({
      addressList,
    })
  }

  onOpen(addressId){
    let {addressList} = this.state
    addressList.map(item=>{
        item.isClose = item.addressId!==addressId
    })
    this.setState({
      addressList,
    })
  }

  render() {
    const {addressList, showModal, type, autoClose} = this.state
    return (
      <View className='address' onClick={this.setClose.bind(this)}>
        {
          addressList && addressList.length > 0 && addressList.map(item => (
            <View key={item.addressId}>
              <AtSwipeAction
                className='address-list'
                onClick={this.onClickDel.bind(this, item.addressId)}
                autoClose={autoClose}
                isClose={item.isClose}
                onOpened={this.onOpen.bind(this,item.addressId)}
                onClosed={this.onClose.bind(this)}
                options={[
                  {
                    text: '删除',
                    style: {
                      backgroundColor: '#FF7900'
                    }
                  },
                ]}
              >
                <View className='address-box'>
                  <View className='address-img' onClick={this.btnAddress.bind(this, item)}>
                    <Image src={item.defaultFlag == 1 && type == 'order' ? carList.check : ''} className='address-image'/>
                  </View>
                  <View className='address-box1' onClick={this.btnAddress.bind(this, item)}>
                    <View className='address-font-top'>
                      <Text className='address-font-left text-ellipsis1'>{item.receiverName}</Text>
                      <Text className='address-font-ccc  text-ellipsis1'>{item.receiverMobile}</Text>
                    </View>
                    <View className='address-font-bottom text-ellipsis2'>
                      {item.defaultFlag == 1 && <Text className='default'>默认</Text>}
                      <Text className='font-font'>{item.provinceName}</Text>
                      <Text className='font-font'>{item.cityName}</Text>
                      <Text className='font-font'>{item.countryName}</Text>
                      <Text className='font-font'> {item.address}</Text>
                    </View>
                  </View>
                  <View className='address-img1' onClick={this.editAddress.bind(this, item)}>
                    <Image src={edit} className='address-image1'/>
                  </View>
                </View>
              </AtSwipeAction>
            </View>
          ))
        }
        <View className='address-box-bottom' onClick={this.addAddress}>
          <View className='address-img address-img address-add'>
            <Image src={aaimg} className='address-image'/>
            <View className='address-box1'>新增收货地址</View>
          </View>
          <View className='address-img'>
            <Image src={right} className='address-ima'/>
          </View>
        </View>
        {showModal && <AtModal isOpened>
          <View className='delButton'>
            <AtModalContent>确定删除吗</AtModalContent>
          </View>
          <AtModalAction>
            <Button onClick={this.onCancel}>取消</Button>
            <Button onClick={this.onConfirm}>确定</Button>
          </AtModalAction>
        </AtModal>}
      </View>
    )
  }
}
export default My
