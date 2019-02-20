import Taro, {Component} from '@tarojs/taro'
import {connect} from '@tarojs/redux'
import {Image, RichText, Swiper, SwiperItem, Text, View, Button} from '@tarojs/components'
import {AtIcon} from 'taro-ui'
import {iconMessage, iconShop,iconShareGoods} from './../../imgs/index'
import api from '../../api/goods/detail'
import './index.styl'
import AddShopCar from "../../components/addShopCar/index";
import GoodsCnt from "../../components/addShopCar/goodsCnt";
import GetTicket from "./getTicket/index";
import HgImg from '../../components/hgImg/index'
import {util}from "../../utils";
import GetSku from "./getSku/index";
import Ticket from "./ticket/index";
import CarBtn from "../../components/carCnt/carBtn";


@connect(() => ({}))
class Index extends Component {
  config = {
    navigationBarTitleText: '商品详情'
  }
  constructor (props) {
    super(props)
    this.state = {
      // 是否加载完成
      isLoad:false,
      // 商品详情对象
      detail: {},
      // 商品详情富文本
      detailInfo: '',
      // 联系我们对象
      contactMember:'',
      // 商品轮播图集合
      goodsPicUrl: [],
      ticketLoad:false
    }
  }
    componentDidShow(){
      this.init()
      this.setReceiveList()
    }
    init(){
      this.getDetail().then(data=>{
        this.props.dispatch({
          type:'shopCar/save',
          goodsDetail:data
        })
        this.getContactMember(data.shopId)
        Taro.stopPullDownRefresh()
      })

    }
  /**
   * 获取商品详情
   */
    getDetail(){
      return new Promise(resolve => {
        api.catchDetail({...this.$router.params}).then(res=>{
          this.setDetail(res.data)
          resolve(res.data)
        }).catch(error=>{
          Taro.showModal({
            // title: '温馨提示',
            content: error.message,
            showCancel: false,
            success:()=>{
              Taro.switchTab({
                url: '/pages/home/index',
              })
            }
          })
        })
      })
    }

  /**
   * 除去富文本行内样式
    */
   replaceStyle(html){
    return html.replace(/([a-z]+)="[\s\S]+?"/ig,(a,b)=>{
      if(b === 'style'){
        return ''
      }
      return a
    })
  }
  /**
   * 设置商品详情
   */
    setDetail(data){
      let result = this.replaceStyle(data.detail)
      const regex = new RegExp('<img', 'gi');
      result = result.replace(regex, `<img style="max-width: 100%;display: block;margin:0"`);
      this.setState({
        detail: data,
        goodsPicUrl:data.goodsPicUrl,
        detailInfo:result,
        isLoad:true
      })
    }
    setReceiveList(){
      const {shopId} = this.$router.params
      this.props.dispatch({
        type:'ticket/getReceiveList',
        shopId
      }).then(()=>{
        this.setState({ticketLoad:true})
      })
    }
    getContactMember(shopId){
      api.contactMember({shopId,type:1}).then(
        res=>{
          this.setState({
            contactMember:res.data
          })
        }
      )
    }
    handlePreShopCar(){
      this.props.dispatch({
         type:'shopCar/preAddToShopCar',
         from:'add'
      })
    }
    handlePreBuy(){
      this.props.dispatch({
        type:'shopCar/preAddToShopCar',
        from:'buy'
      })
    }
    onPullDownRefresh(){
      this.init()
    }
    goToShopIndex(){
      util.jumpUrl(`/pages/shop/index/index?shopId=${this.state.detail.shopId}`)
    }
    onCall(){
      Taro.makePhoneCall(
        {
          phoneNumber:this.state.contactMember.mobile
        }
      )
    }
  onShareAppMessage(){
    const {goodsPicUrl,detail} = this.state
    const {shopId,goodsId,goodsNo} = this.$router.params
    return {
      title:detail.goodsName || '商品详情',
      path: `/pages/goodsDetail/index?shopId=${shopId}&goodsId=${goodsId}&goodsNo=${goodsNo}`,
      imageUrl:goodsPicUrl[0]||''
    }
  }
    render () {
      const {detail,detailInfo,goodsPicUrl,contactMember,isLoad,ticketLoad} = this.state
      return (
        <View>
          {
            isLoad&&(
              <View className='goods-detail'>
                <Swiper
                  className='test-h'
                  indicatorColor='#999'
                  indicatorActiveColor='#333'
                  circular
                  indicatorDots={goodsPicUrl.length>1}
                  autoplay
                >
                  {
                    goodsPicUrl.map(item=>(
                      <SwiperItem key={item.detailUrl}>
                        <View className='item-img'>
                          <HgImg src={item.detailUrl} className='item-img' />
                        </View>
                      </SwiperItem>
                    ))
                  }
                </Swiper>
                {
                  detail.minPrice === detail.maxPrice ? (
                    <View className='goods-price'>
                      ￥{detail.minPrice || detail.maxPrice || detail.equalPrice}
                    </View>
                  ):(
                    <View className='goods-price'>
                      ￥{detail.minPrice} -￥{detail.maxPrice}
                    </View>
                  )
                }
                <View className='goods-info'>
                  <View className='goods-info-name'>{detail.goodsName}</View>
                  <View className='goods-info-saleCnt'>销量：{detail.saleCnt || 0}笔</View>
                  <View className='goods-info-share' >
                    <Button openType='share' plain className='goods-info-share-btn'>
                      <Image src={iconShareGoods} className='img'  />
                    </Button>
                    <View className='text'>分享赚</View>
                    <View className='money'>最高￥{detail.bonus}</View>
                  </View>
                </View>
                <View className='goods-handle'>
                  {ticketLoad&& <GetTicket />}
                  <View className='goods-handle-add'>
                    <Text className='text'>数量：</Text>
                    <GoodsCnt />
                  </View>
                  <GetSku />
                </View>
                <View className='shop-info'>
                  <View className='shop-info-img'>
                    <Image src={detail.shopPicUrl || 'https://m.hanguda.com/img/headPic.png'} className='img' />
                  </View>
                  <View className='shop-info-name'>
                    <View className='name'>{contactMember.memberNick}</View>
                    {/*<View className='rel'><Image src={iconRel} className='img' />汉固达认证</View>*/}
                  </View>
                  <View className='shop-info-go' onClick={this.goToShopIndex.bind(this)}>
                    <Text>进店逛逛</Text>
                    <AtIcon value='chevron-right' color='#A1A1A1' className='icon' />
                  </View>
                </View>
                <View className='ticket-info'>
                  {ticketLoad&& <Ticket />}
                </View>
                <View className='detail-info'>
                  <View className='detail-info-title'>商品详情</View>
                  <RichText nodes={detailInfo} />
                </View>
                <View className='bottom-handles clear'>
                  <View className='icon-text fl' onClick={this.goToShopIndex.bind(this)}>
                    <Image src={iconShop} className='img' />
                    <View>进店</View>
                  </View>
                  <View className='icon-text fl' onClick={this.onCall.bind(this)}>
                    <Image src={iconMessage} className='img' />
                    <View>客服</View>
                  </View>
                  <View className='fl btn'>
                    <Text className='btn-left' onClick={this.handlePreShopCar.bind(this)}>加入购物车</Text>
                    <Text className='btn-right' onClick={this.handlePreBuy.bind(this)}>立即购买</Text>
                  </View>
                </View>
                <CarBtn />
                <AddShopCar />
              </View>
            )
          }
        </View>
      )
    }
  }
export default Index
