import Taro, {Component} from '@tarojs/taro'
import {View, Picker, Image} from '@tarojs/components'
import {AtInput, AtSwitch,Textarea} from "taro-ui"
import './index.styl'
import {right} from './../../../imgs'
import api from './../../../api/address/address'
import cityPicker from './../../../components/cityPicker/index'
import {util} from "../../../utils";

let time = null

export default class My extends Component {
  config = {
    navigationBarTitleText: '新增地址',
    enablePullDownRefresh: false
  }

  constructor(props) {
    super(props)
    this.state = {
      showName: 'add',
      showState: 'add',
      placeholder: '请输入收货人',
      placeholder1: '请输入手机号',
      placeholder2: '请输入详细地址',
      addressInfo: {
        receiverWay: 'TOSHOPKICKUP',
        provinceId: '',
        cityId: '',
        countyId: '',
        address: '',
        receiverName: '',
        receiverMobile: '',
        defaultFlag: false
      },
    }
  }

  componentWillMount() {

  }

  componentDidShow(){
    this.init()
  }
  init(){
    let {state, type} = this.$router.params
    let Title = type != 'edit' ? '新增地址' : '编辑地址'
    Taro.setNavigationBarTitle({
      title: Title
    })
    if (type == 'edit' && state == 'two') {
      let address = Taro.getStorageSync('addressInfo')
      address.defaultFlag = address.defaultFlag == 0 ? false : address.defaultFlag == 1 ? true : address.defaultFlag
      this.setState({
        addressInfo:address,
        showName: type,
        showState: type,
        placeholder: '',
        placeholder1: '',
        placeholder2: '',
      })
    }else if(type == 'add') {
      this.setState({
        showName: 'add',
        showState: 'add',
      })
      if(state == 'first'&&type == 'add') {
        let address = this.state.addressInfo
        address.defaultFlag = true
        this.setState({
          addressInfo: address,
        })
      }
    }
  }

  handleChange(value) {
    this.common('receiverName', value)
  }

  handleChangeOne(value) {
      this.common('receiverMobile', value)
  }

  handleChangTwo(e) {
    this.common('address', e.target.value)
  }

  handleChangThree(value) {
    this.common('defaultFlag', value)
  }

  common(val, content) {
    let addressInfo = this.state.addressInfo
    addressInfo[val] = content
    this.setState({
      addressInfo
    })
  }

  saveInfo() {
    const {showState, addressInfo,showName} = this.state
    let address = addressInfo
    if(showName == 'edit') {
      const addressSync = Taro.getStorageSync('addressInfo')
      address.provinceId = addressSync.provinceId
      address.cityId = addressSync.cityId
      address.countryId = addressSync.countyId
      address.countyId = addressSync.countyId
    }
    address.defaultFlag = address.defaultFlag === true ? 1 : address.defaultFlag === false ? 0 : address.defaultFlag
    if (address.receiverName.trim() === '') {
      util.showToast('请设置收货人')
      return
    }
    if (address.receiverMobile === '') {
      util.showToast('请设置联系电话')
      return
    }
    if (address.receiverMobile.length  < 7 ) {
      util.showToast('请输入正确联系方式')
      return
    }
    if (this.state.showName=='add'){
      util.showToast('请选择地区')
      return
    }
    if (address.provinceId === '' || address.cityId === '' || address.countryId === '') {
      util.showToast('请选择地区')
      return
    }
    if (address.address.trim() === '') {
      util.showToast('请输入详细地址')
      return
    }
    if (showState == 'edit') {
      api.modify(address).then(() => {
        util.jumpUrl(`/pages/my/address/index?type=add`)
      })
    } else {
      address.countryId = address.countyId
      api.add(address).then(() => {
        Taro.navigateBack()
      })
    }
  }

  selectId(obj){
    let address = this.state.addressInfo
    address.provinceId = obj.selectProvince
    address.cityId = obj.selectCity
    address.countryId = obj.country
    address.countyId = obj.country
   if(obj.type == 'two'){
      this.setState({
        showName: 'select',
      })
    }
    this.setState({
      addressInfo: address,
    })
  }

  render() {
    const {showName, addressInfo, placeholder, placeholder1, placeholder2} = this.state
    let address = addressInfo
    return (
      <View className='address'>
        <AtInput
          className='edit-address-box'
          name='value1'
          title='收货人'
          type='text'
          maxlength='30'
          border={false}
          placeholder={placeholder}
          value={address.receiverName}
          onChange={this.handleChange.bind(this)}
        />
        <AtInput
          className='edit-address-box'
          name='value1'
          title='联系电话'
          type='number'
          maxlength='14'
          border={false}
          placeholder={placeholder1}
          value={address.receiverMobile}
          onChange={this.handleChangeOne.bind(this)}
        />
        <View className='address-select address-address'>
          <View  className='address-select2'>选择地区</View>
          <View className='address-btnSelect'>
            <cityPicker
              address={address}
              showName={showName}
              onSelectSure={this.selectId.bind(this)}
            >
            </cityPicker>
          </View>
        </View>
        <View className='address-select address-address'>
          <View  className='address-select2'>详细地址</View>
          <View className='address-address-box'>
            <Textarea
              style='background:#fff;width:100%;min-height 100px'
              placeholderClass='picker-style'
              name='value1'
              type='text'
              autoHeight
              count={false}
              maxlength='50'
              placeholder={placeholder2}
              value={address.address}
              onInput={this.handleChangTwo.bind(this)}
            />
          </View>
        </View>
        <View className='switch'>
          <View className='switch1'>设为默认地址</View>
          <AtSwitch
            color='#ED6C00'
            checked={address.defaultFlag}
            onClick={this.handleChangThree.bind(this)}
            onChange={this.handleChangThree.bind(this)}
          />
        </View>
        <View className='btn-save' onClick={this.saveInfo}>保存</View>
      </View>
    )
  }
}
