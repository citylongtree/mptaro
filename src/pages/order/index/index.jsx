import Taro, { Component } from '@tarojs/taro'
import { View,ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtModal, AtSearchBar, AtToast, AtActionSheet}  from 'taro-ui'
import { util } from "../../../utils"
import {OrderTypeList} from '../../../components/order/orderTypeList.jsx'
import { SingleSelect } from '../../../components/select/select'
import History from '../../../components/historySearch/index'
import api from '../../../api/order/order.js'
import './index.styl'

let time = null
export default class Index extends Component {
  config = {
    navigationBarTitleText: '我的订单',
    enablePullDownRefresh: false
  }
  constructor (props) {
    super(props)
    this.state = {
      inputText:'搜索全部订单',
      pageState:1,
      page:1,
      current: 0,
      orderType: '',
      del: false,
      sure: false,
      orderId:'',
      text:'',
      hint:false,
      selectBox:false,
      reason:'',
      platform:'MINI',
      list:[],
      list1:[],
      nowPage:'',
      showHistory: false,
      orderName:'',
      isLoad:false,
      isScroll:false
    }
  }
  //  转换type
  handleClick (value) {
    this.setState({
      current: value
    })
    switch(value){
      case 0:
      value ="all"
      break
      case 1:
      value ="unpay"
      break
      case 2:
      value ="undeliver"
      break
      case 3:
      value ="unreceipt"
      break
      case 4:
      value ="complete"
      break
    }
    this.setState({
      orderType: value
    })
    this.getDataItems(value,1)
  }
  // 删除订单
  handleConfirm(){
    api.deleted({orderId:this.state.orderId}).then(res=>{
      if(res.success===true){
        this.setState({
          del : false,
          orderType : 'all',
        })
        this.getDataItems('all', 1)
        util.showToast('删除成功')
      }
    })
  }
  // 确认收货
  handleConfirms(){
    api.receipt({orderId:this.state.orderId}).then(res=>{
      if(res.success===true){
        this.setState({
          sure : false,
          orderType : 'all',
        })
      }
    })
  }
  //跳转搜索
  showHistory = () =>{
    Taro.setNavigationBarTitle({
      title: '搜索订单'
    })
    this.setState({
      inputText:'',
      pageState:2,
      showHistory: true,
    })
  }
  // 取消删除
  handleCancel(){
    this.setState({
      del : false,
      sure : false
    })
  }
  // 弹出model框
  get = (v, orderId) =>{
   if(v==='del'){
     this.setState({
       del:true,
       orderId : orderId,
     })
   }else if(v==='sure'){
     this.setState({
       sure:true,
       orderId : orderId,
     })
   }else if(v==='cancel'){
     this.setState({
       selectBox:true,
       orderId : orderId,
     })
   }else if(v==='pre'){
     this.gopre(orderId)
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
  changeHandler(v){
    this.setState({
        reason : v,
    })
  }
  //取消订单
  postReasons(){
    this.setState({
      selectBox:false,
    })
  }
  postReason(){
    this.setState({
      selectBox:false,
    })
    this.setState({
      selectBox:false,
    })
    api.cance({reason:this.state.reason,platform:this.state.platform,orderId:this.state.orderId}).then(res=>{
      if(res.success===true){
        this.getDataItems(this.state.orderType, 1)
        util.showToast('取消成功')
      }
    })
  }
  // 请求数据
  getDataItems=(value, page)=>{
    this.setState({
      page: 1,
      list:[],
      isLoad:false
    })
    this.setState({
      orderStatus: value
    })
    api.list({orderStatus:value, page: page,}).then(
      res => {
        this.setState({
          list: res.items,
          nowPage:res.totalPage,
          page:2,
          isLoad:true
        })
      })
  }
  handleScrollLowers(){
    api.list({orderStatus:this.state.orderStatus, page: 1,}).then(
      res => {
        this.setState({
          list: res.items,
          nowPage:res.totalPage,
          page:2,
          isLoad:true
        })
      })
    }
  handleScrollLower(){
    let{orderStatus,page,nowPage}  = this.state
            if(page===nowPage + 1){
                util.showToast('没有更多数据了')
            }else{
                api.list({orderStatus:orderStatus,page:page}).then(res=>{
                        let list = this.state.list.concat(res.items)
                        this.setState({
                            list: list,
                        })
                        this.setState({
                            page: this.state.page+1
                        })
                })
            }
  }
  componentDidShow () {
    if(this.$router.params){
      let {orderStatus} = this.$router.params
      const orderType = Taro.getStorageSync('orderType')
      const relType = orderType || orderStatus
      let value = ''
        switch(relType){
          case 'all':
          value = 0
          break
          case 'unpay':
          value = 1
          break
          case 'undeliver':
          value = 2
          break
          case 'unreceipt':
          value = 3
          break
          case 'complete':
          value = 4
          break
        }
      this.handleClick(value)
      Taro.setStorageSync('orderType','')
      }
    }
    // 取消搜索
    onActionClick(){
      Taro.setNavigationBarTitle({
        title: '我的订单'
      })
      this.setState({
        pageState: 1,
        inputText:'搜索全部订单',
        orderName:''
      })
      this.getDataItems(this.state.orderStatus,1)
    }
    getHistory(val){
      clearTimeout(time)
      this.setState({
         orderName: val.keyword
      })
      if(val === ''){
          this.setState({
            orderName: val.keyword
          })
        } else{
          time = setTimeout(() => {
            this.setState({
              orderName: val.keyword,
              showHistory: false,
            },() =>{
                api.list({orderStatus:'all', page: 1, name:this.state.orderName}).then(res=>{
                    this.setState({
                        pageState:3,
                        list:res.items,
                        nowPage:res.totalPage,
                        page:2
                    })
                })
            })
          }, 500)
        }
    }
    // 搜索订单
    change(val){
    val = val.replace(/\s*/g,'')
      clearTimeout(time)
      if(val === ''){
        this.setState({
          orderName: val
        })
      } else{
        time = setTimeout(() => {
          this.setState({
            orderName: val,
            showHistory: false,
          },() =>{
            api.list({orderStatus:this.state.orderStatus, page: 1, name:this.state.orderName}).then(
              res => {
                this.setState({
                  pageState:3,
                  list: res.items,
                  nowPage:res.totalPage,
                  page:2
                })
              })
          })
        }, 500)
      }
    }
  componentDidMount () {
    api.list({orderStatus:this.state.orderStatus, page: 1,}).then(
      res => {
        this.setState({
          list: res.items,
        })
      }
    )
  }
  componentWillReceiveProps () {
  }
  componentWillUnmount () {
  }
  componentDidHide () { }
  render () {
    const tabList = [{ title: '全部' }, { title: '待付款' }, { title: '待发货' }, { title: '待收货' }, { title: '已完成' }]
    const { selectBox, inputText, pageState, del, sure, text, hint, list, isLoad, orderType} = this.state
    return (
      <View className='order'>
      <View className='search-header'>
          <View className='search-value' style='flex: 1'>
            <AtSearchBar
              className='search'
              actionName='取消'
              onChange={this.change.bind(this)}
              value={this.state.orderName}
              onActionClick={this.onActionClick.bind(this)}
              onFocus={this.showHistory}
              placeholder={inputText}
            >
            </AtSearchBar>
          </View>
        </View>
        {pageState===1?(<AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
         {
           tabList.map((item,index)=>(
             <AtTabsPane current={this.state.current} index={index} key={index}>
               <ScrollView scrollY className='scroll-view' onScrollToLower={this.handleScrollLower.bind(this)} onScrollToUpper={this.handleScrollLowers.bind(this)} upperThreshold={170}>
                 <View className='orderListMain'>
                   <OrderTypeList list={list} index={index} isLoad={isLoad} current={this.state.current} onHandleChange={this.get.bind(this)} orderType={orderType}></OrderTypeList>
                 </View>
               </ScrollView>
             </AtTabsPane>
           ))
         }
      </AtTabs>):pageState===2?(<View className={!this.state.showHistory?'history-box hidden':'history-box'}>
          {

            this.state.showHistory && <History
              type='CORDER'
              onBtnHistory={this.getHistory}
            >
            </History>
          }
        </View>):pageState===3?(<ScrollView scrollY className='scroll-view2' onScrollToLower={this.handleScrollLower.bind(this)} onScrollToUpper={this.handleScrollLowers.bind(this)} upperThreshold={170}>
                 <View className='orderListMain2'>
                   <OrderTypeList list={list} isLoad={isLoad} onHandleChange={this.get.bind(this)}></OrderTypeList>
                 </View>
               </ScrollView>):''}
      <AtModal  isOpened={del} cancelText='取消' confirmText='确认' onClose={this.handleClose} onCancel={this.handleCancel.bind(this)} onConfirm={this.handleConfirm.bind(this, 'del')} content='确定删除该订单吗' />
      <AtToast  isOpened={hint} text={text} onClose={this.changeHint}></AtToast>
      <AtModal  isOpened={sure} cancelText='取消' confirmText='确认' onClose={this.handleClose} onCancel={this.handleCancel.bind(this)} onConfirm={this.handleConfirms.bind(this, 'sure')} content='确定收到货了吗' />

      <AtActionSheet isOpened={selectBox} cancelText='确定' onCancel={this.postReason.bind(this)} onClose={this.postReasons.bind(this)} >
          <SingleSelect onHandleChange={this.changeHandler} type={'cancelData'}></SingleSelect>
      </AtActionSheet>
      </View>
    )
  }
}

