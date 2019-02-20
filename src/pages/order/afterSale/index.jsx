import Taro, { Component } from '@tarojs/taro'
import {View, Image, Text, ScrollView} from '@tarojs/components'
import {AtSearchBar, AtIcon} from 'taro-ui'
import History from '../../../components/historySearch/index'
import api from '../../../api/order/order.js'
import noOrder from '../../../imgs/icons/noOrder.png'
import { util } from "../../../utils"
import HgImg from '../../../components/hgImg/index'
import './index.styl'

let time = null
export default class refund extends Component {
    config = {
      navigationBarTitleText: '退款/售后'
    }
    constructor (props) {
        super(props)
        this.state = {
           nowPage:'',
           placeholder:'搜索全部订单',
           orderName:'',
           value:'',
           pageState:1,
           page:1,
           data:{},
           showHistory: false,
        }
    }
    // 跳转搜索
  showHistory = () =>{
    Taro.setNavigationBarTitle({
      title: '搜索订单'
    })
    this.setState({
        placeholder:'',
        pageState:2,
        showHistory: true,
    })
  }
  onActionClick(){
    Taro.setNavigationBarTitle({
      title: '退款/售后'
    })
    this.setState({
      pageState: 1,
      placeholder:'搜索全部订单',
      orderName:''
    })
    this.getList(this.state.page)
  }
  onPullDownRefresh(){
    this.getList(1)
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
              api.refundsList({page:this.state.page,name: this.state.orderName,}).then(res=>{
                  this.setState({
                      data:res.items,
                      pageState: 1,
                  })
              })
          })
        }, 500)
      }
  }
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
            api.refundsList({page:this.state.page,name: this.state.orderName,}).then(res=>{
                this.setState({
                    data:res.items,
                    pageState: 1,
                })
            })
        })
      }, 500)
    }
  }
    // 去门店
    goShop = (shopId) =>{
        Taro.navigateTo({url:`/pages/shop/index/index?shopId=${shopId}`})
    }
    // 去详情
    goToDetail(refundsId){
        Taro.navigateTo({
            url: `detail?refundsId=${refundsId}`
          })
    }
    getList(value){
        api.refundsList({page:value}).then(res=>{
            this.setState({
                data:res.items,
                nowPage:res.totalPage,
            })
            Taro.stopPullDownRefresh()
        })
    }
    componentWillMount(){
        // 接受列表
        this.getList(this.state.page)
    }
    handleScrollLower(){
        let{page,nowPage}  = this.state
            if(page===nowPage + 1){
                util.showToast('没有更多数据了')
            }else{
                api.refundsList({page:page}).then(res=>{
                    let list = this.state.data.concat(res.items)
                    this.setState({
                        data:list
                    })
                    this.setState({
                        page: this.state.page+1
                    })
                    Taro.stopPullDownRefresh()
                })
            }
    }
    render(){
        const {data,pageState,placeholder} = this.state
        return(
            <View className='refundList'>
                <View className='search-header'>
                <View className='search-value' style='flex: 1'>
                    <AtSearchBar
                    className='search'
                    actionName='取消'
                    value={this.state.orderName}
                    onChange={this.change.bind(this)}
                    onActionClick={this.onActionClick.bind(this)}
                    onFocus={this.showHistory}
                    placeholder={placeholder}
                    >
                    </AtSearchBar>
                </View>
                </View>
                {
                    pageState===1?(
                    <ScrollView scrollY className='scroll-view' onScrollToLower={this.handleScrollLower.bind(this)}>
                    <View>
                        {data.length>0&&data.map(item=>(
                        <View className='refundListBox' key={item.goodsId} >
                            <View className='Top'>
                            <View className='shopName' onClick={this.goShop.bind(this, item.shopId)}>
                    <View className='shopNameLeft'>{item.shopName}</View>
                    <View style='float:left;margin-top:8px;margin-left:-2px'><AtIcon value='chevron-right' color='#A1A1A1' className='icon' size='16'/></View>
                </View>
                                <Text className='orderState'>{item.goodsStatus==='refunds'?'退款中':item.goodsStatus==='success'?'退款成功':'退款失败'}</Text>
                            </View>
                            <View className='orderMain' style='background:#F8F8F8' onClick={this.goToDetail.bind(this, item.refundsId)}>
                                <View className='orderMainLeft'>
                                    <HgImg className='pic' src={item.picUrl}/>
                                </View>
                                <View className='orderMainRight'>
                                    <View className='orderMainRightT'>
                                        <View className='orderName'>{item.goodsName}</View>
                                    </View>
                                    <View  className='orderMainRightD'>
                                        <View className='orderCnt'>
                                            <Text>{item.shopSkuValue}</Text>
                                        </View>
                                        <View className='orderMoney'>
                                            <View className='Money'>¥{item.goodsPrice}</View>
                                            <View className='Number'>x{item.goodsCnt}</View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        
                        ))}
                        {
            data.length === 0&&(
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
                        
                        
                        </ScrollView>
                        ):(<View className={!this.state.showHistory?'history-box hidden':'history-box'}>
          {
            
            this.state.showHistory && <History
              type='REFUND'
              onBtnHistory={this.getHistory}
            >
            </History>
          }
        </View>)
                }
                
                
            </View>
        )
    }
}
// refund.defaultProps={
//     data:{}
// }
