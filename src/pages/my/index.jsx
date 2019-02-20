import Taro, {Component} from '@tarojs/taro'
import {View,Image} from '@tarojs/components'
import {connect} from "@tarojs/redux";
import {my} from '../../imgs'
import MyCnt from './cnt'
import './index.styl'
import api from './../../api/common/my'

import {util} from '../../utils'


@connect(({shopCar}) => ({
  carCnt:shopCar.carCnt
}))

class My extends Component {
    config = {
        navigationBarTitleText: '我的',
        enablePullDownRefresh: false
    }

    constructor(props) {
        super(props)
        this.state = {
          info:{},
          isLogin:util.isLogin(),
          order:[
            {
              icon:'paying',
              key:'paying',
              text:'待付款',
              jumpUrl:'/pages/order/index/index?orderStatus=unpay'
            },
            {
              icon:'shipping',
              key:'shipping',
              text:'待发货',
              jumpUrl:'/pages/order/index/index?orderStatus=undeliver'
            },
            {
              icon:'receipting',
              key:'receipting',
              text:'待收货',
              jumpUrl:'/pages/order/index/index?orderStatus=unreceipt'
            },
            {
              icon:'saleReturn',
              key:'saleReturn',
              text:'退款/售后',
              jumpUrl:'/pages/order/afterSale/index'
            }
          ],
          tool:[
            {
              icon:'ticket',
              text:'我的卡券包',
              jumpUrl:'/pages/card/card'
            },
            {
              icon:'address',
              text:'收货地址管理',
              jumpUrl:'/pages/my/address/index?type=add'
            },
            {
              icon:'shopCar',
              text:'我的购物车',
              key:'carCnt',
              jumpUrl:'/pages/carList/index'
            },
          ]
        }
    }
    componentDidShow() {
        this.init()
    }
    init(){
      if(util.isLogin()){
        api.idx().then(res=>{
          this.setState({
            info:res.data,
            isLogin:true
          })
          // Taro.stopPullDownRefresh()
        })
        this.props.dispatch({
          type:'shopCar/getCarCnt',
        })
      }else {
        this.setState({
          isLogin:util.isLogin(),
          info:''
        })
      }
    }
     handleGo(url){
       util.jumpUrl(url)
     }
    // /**
    //  * 上拉加载
    //  */
    // onPullDownRefresh(){
    //   this.init()
    // }
    render() {
        const {info,order,tool,isLogin} = this.state
        const {carCnt} = this.props
        return (
            <View className='my'>
              <View className='my-header'>
                <View className='my-header-url'>
                  <Image className='img' src={info.headerProfile || 'https://m.hanguda.com/img/headPic.png'}  onClick={this.handleGo.bind(this,isLogin ?'/pages/my/set/index':'/pages/login/index')} />
                </View>
                {
                  info.nickName ?(<View className='handle' onClick={this.handleGo.bind(this,'/pages/my/set/index')}>{info.nickName} &gt;</View>)
                    :(<View className='handle' onClick={this.handleGo.bind(this,'/pages/login/index')}>登录/注册</View>)
                }
              </View>
              <View className='my-info'>
                <View className='my-info-title' onClick={this.handleGo.bind(this,'/pages/order/index/index?orderStatus=all')}>
                  <View>我的订单</View> <View className='left'>查看全部 &gt;</View>
                </View>
                <View className='line' />
                <View className='my-info-handles'>
                  {
                    order.map(item=>(
                      <View className='item' key={item.icon} onClick={this.handleGo.bind(this,item.jumpUrl)}>
                        <View className='icon'>
                          <Image src={my[item.icon]} className='img' />
                          {
                            item.key&&isLogin&& <MyCnt cnt={info[item.key]} />
                          }
                        </View>
                        <View className='text'>{item.text}</View>
                      </View>
                    ))
                  }
                </View>
              </View>
              <View className='my-info'>
                <View className='my-info-title'>
                  <View>必备工具</View>
                </View>
                <View className='line' />
                <View className='my-info-handles'>
                  {
                    tool.map(item=>(
                      <View className='item'  key={item.icon} onClick={this.handleGo.bind(this,item.jumpUrl)}>
                        <View className='icon'>
                          <Image src={my[item.icon]} className='img' />
                          {
                            item.key&&isLogin&& <MyCnt cnt={carCnt} />
                          }
                        </View>
                        <View className='text'>{item.text}</View>
                      </View>
                    ))
                  }
                </View>
              </View>
            </View>
        )
    }
}

export default My
