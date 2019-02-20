import Taro, { Component } from '@tarojs/taro'
import { View, Input, Text, Image } from '@tarojs/components'
import './index.styl'
import md5 from '../../utils/encrypt/JQuery.md5'
import rsa from '../../utils/encrypt/sign'
import api from './../../api/login/index'
import {loginImg} from '../../imgs/index'

export default class Login extends Component {
  config = {
    navigationBarTitleText: '登录'
  }
  constructor (props) {
    super(props)
    this.state = {
      // 回跳Url
      countdown: 60,
      getCodeText: '获取验证码',
      token: '',
      mobile: '',
      sms: '',
      callBackUrl:'',
    }
  }
  componentWillMount () {

  }

  componentDidMount () { }

  componentWillUnmount () {

  }

  componentDidShow () {
    const callBackUrl = Taro.getStorageSync('callBackUrl')
    if(callBackUrl){
      this.setState({
        callBackUrl
      },()=>{
        Taro.setStorageSync('callBackUrl','')
      })
    }
  }

  componentDidHide () { }

  getNowFormatDate() { //yyyyMMddHH时间格式
    var date = new Date()
    var month = date.getMonth() + 1
    var strDate = date.getDate()
    var hour = date.getHours()
    if (month >= 1 && month <= 9) {
      month = "0" + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate
    }
    if (hour >= 0 && hour <= 9) {
      hour = "0" + hour
    }
    var currentdate = date.getFullYear() + "" + month + "" + strDate + "" + hour
    return currentdate;
  }

  // 倒计时
  setTime() {
    let {countdown} = this.state
    clearTimeout()
    if (countdown === 0) {
      this.setState({
        getCodeText: '获取验证码',
        countdown: 60,
      })
    } else {
      countdown--
      this.setState({
        getCodeText: "重新发送(" + countdown + ")",
        countdown: countdown,
      })
      setTimeout(() => {
        this.setTime()
      }, 1000)
    }
  }

  //获取验证码
  getSmsCode() {
    const {mobile,getCodeText} = this.state
    if(getCodeText !== '获取验证码'){
      return false
    }else if(mobile === ''||!/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|)+\d{8})$/.test(mobile.trim())){
      Taro.showToast({
        icon: 'none',
        title: '请输入正确手机号'
      })
      return false
    } else {
      Taro.getSystemInfo({
        success: (res) => {
          let str = res.model + res.system + res.brand + res.version //机型+系统版本+品牌+微信版本
          let deviceid = md5.hex_md5(str).toUpperCase() //设备号Id
          let rcode = this.getNowFormatDate() //当前时间
          let signStr = deviceid + mobile + rcode
          let sign = rsa.doSign(signStr)
          let param = {
            deviceid: deviceid,
            mobile: mobile,
            platform: 'MINI',
            type: 'sysLogin',
            memberType: 'personal',
            sign: sign
          }
          api.getSms(param).then(res => {
            this.setTime()
            Taro.showToast({
              title: '验证码已发送',
              icon: 'none'
            })
            this.setState({
              token: res.data.token
            })
          })
        }
      })

    }
  }

  mobileChange(e){
    this.setState({
      mobile: e.detail.value
    })
  }
  smsChange(e){
    this.setState({
      sms: e.detail.value
    })
  }

  login(){
    const {mobile, sms ,token,callBackUrl} = this.state
    if(mobile === ''||!/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|)+\d{8})$/.test(mobile.trim())){
      Taro.showToast({
        icon: 'none',
        title: '请输入正确手机号'
      })
      return false
    } else if(sms===''){
      Taro.showToast({
        icon: 'none',
        title: '请输入验证码'
      })
      return false
    }else {
      Taro.login({
        success: res => {
          const jsCode = res.code
          api.login({jsCode, mobile,platform: 'MINI',loginType: '4',checkCode: sms, token}).then( data => {
            const {sessionId,memberId} = data.data
            Taro.setStorageSync('sessionId', sessionId)
            Taro.setStorageSync('memberId', memberId)
            callBackUrl ? Taro.redirectTo({url:callBackUrl}): Taro.navigateBack()
          })
        }
      })
    }
  }

  render () {
    const {getCodeText, sms, mobile} = this.state
    return (
      <View className='login-main'>
        <View className='top-img'>
            <Image src={loginImg} />
        </View>
        <View className='login-input'>
          <Input placeholderStyle='color: #BEBEBE' className='inputLogin' onInput={this.mobileChange} type='number' placeholder='请输入手机号' maxLength='11' />
        </View>
        <View className='login-input'>
          <Input placeholderStyle='color: #BEBEBE' className='inputLogin' onInput={this.smsChange} type='number' placeholder='请输入验证码' />
          <Text onClick={this.getSmsCode}>{getCodeText}</Text>
        </View>
        <View className='login-btn' style={sms.length >= 6 && mobile.length>=11 ? 'background-color: #FF7900' : ''} onClick={this.login}>登 录</View>
      </View>
    )
  }
}
