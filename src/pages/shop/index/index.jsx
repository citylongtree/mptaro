import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image, Text, Button  } from '@tarojs/components'
import { AtIcon,AtActivityIndicator} from "taro-ui"
import {connect} from "@tarojs/redux"
import goodsItem from '../../../components/goodsItem/index'
import titleTop from '../../home/titleTop/index'
import share from '../../../components/share/index'
import './index.styl'
import {iconShare, iconLogo, iconHome} from '../../../imgs/index'
import api from '../../../api/shop'
import util from "../../../utils/util";
import Ticket from "../../goodsDetail/ticket/index"

let time = null
@connect(() => ({}))
class Index extends Component {
  config = {
    navigationBarTitleText: '门店首页',
    enablePullDownRefresh: false
  }
  constructor(){
    super()
    this.state = {
      shopName: '',
      detail: null,
      shopPicUrl: [],
      recommendGoods: [],
      shopGoods: [],
      scrollTag: false,
      cancelShareTag: false,
      shareImgTag: false,
      source: false,
      canSaveImg: true,
      shareImgUrl:'',
      shopId:'',
      shareImageLoad:false
    }
  }
  componentWillMount () {

  }

  componentDidMount () {

  }

  componentWillUnmount () { }

  componentDidShow () {
    const {source} = this.$router.params
    const shopId = this.getShopId()
    if(source && source==='APP'){
      this.setState({
        source: true
      })
    }
    this.getShareFriendImg(shopId,'first')
    api.shopDetail({shopId: shopId}).then(res=>{
      this.setState({
        shopName: res.data.shopName,
        detail: res.data,
        shopPicUrl: res.data.shopPicUrl,
        recommendGoods: res.data.recommendGoods,
        shopGoods: res.data.shopGoods
      })
      Taro.setNavigationBarTitle({
        title: res.data.shopName || '门店首页'
      })
    })
    this.onRageReList()
    this.getSaveImgPromise()
  }
  componentDidHide () {

  }
  getShopId(){
    const {shopId,scene} = this.$router.params
    this.setState({
      shopId:shopId || parseInt(scene.split('D')[1])
    })
    return shopId || parseInt(scene.split('D')[1])
  }
  getShareFriendImg(shopId,type){
    api.shopShare({shopId}).then(res=>{
      if(type!=='first'){
        this.setState({
          shareImgTag: true
        })
      }
      this.setState({
        shareImgUrl: res.data,
        shareImageLoad:true
      })
    }).catch(()=>{
      this.setState({
        shareImageLoad:true
      })
      if(type!=='first'){
        Taro.showToast({
          icon: 'none',
          title: '图片生成失败，请重新尝试'
        })
        this.setState({
          shareImgTag: false
        })
      }
    })
  }
  onShareAppMessage = (res) => {
    const {shopName,shopPicUrl} = this.state
    const shopId = this.getShopId()
    return {
      title: shopName,
      path: '/pages/shop/index/index?shopId='+shopId,
      imageUrl: shopPicUrl[0].detailUrl||''
    }
  }
  onPageScroll = () => {
    clearTimeout(time)
    this.setState({
      scrollTag: true
    })
    time = setTimeout(() => {
      this.setState({
        scrollTag: false
      })
    },200)
  }

  // 查看详情
  goDetail(goodsId, goodsNo){
    const shopId = this.getShopId()
    util.jumpUrl(`/pages/goodsDetail/index?goodsId=${goodsId}&shopId=${shopId}&goodsNo=${goodsNo}`)
  }

  bMapTransQQMap(lng, lat) {
    let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    let x = lng - 0.0065;
    let y = lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    let lngs = z * Math.cos(theta);
    let lats = z * Math.sin(theta);
    return {longitude: lngs, latitude: lats}
  }
  // 地图导航
  goShop(){
    const {shopAddress, latitude, longitude} = this.state.detail
    const res = this.bMapTransQQMap(longitude,latitude)
    Taro.openLocation({
      latitude: res.latitude,
      longitude: res.longitude,
      name: shopAddress,
      scale: 18
    })
  }
  // 跳转商品搜索
  goSearch(){
    const shopId = this.getShopId()
    util.jumpUrl(`/pages/shop/goodsSearch/index?shopId=${shopId}`)
  }
  // 打电话
  callShop() {
    const {shopMobile} = this.state.detail
    Taro.makePhoneCall({
      phoneNumber: shopMobile
    })
  }
  // 显示分享
  showShare (){
    this.setState({
      cancelShareTag: true
    })
  }
  // 分享到朋友圈关闭按钮
  hideShare(){
    this.setState({
      cancelShareTag: false
    })
  }
  // 回首页
  goHome() {
    Taro.switchTab({
      url: '/pages/home/index'
    })
  }
  // 分享朋友圈
  shareFriendsImg(shopId){
    if(this.state.shareImgUrl===''||this.state.shareImgUrl===null||this.state.shareImgUrl===undefined){
      this.getShareFriendImg(shopId,'normal')
    }else {
      this.setState({
        shareImgTag: true
      })
    }
  }
  // 门店商品列表
  goShopGoodsList() {
    const shopId = this.getShopId()
    util.jumpUrl(`/pages/shop/goodsList/index?shopId=${shopId}`)
  }

  launchAppError(e){
    console.log(e)
  }
  onRageReList(){
    const shopId = this.getShopId()
    this.props.dispatch({
      type:'ticket/getReceiveList',
      shopId
    })
  }
  hideShareImg(e){
    e.stopPropagation()
    this.setState({
      shareImgTag: false
    })
  }
  stopEvent(e){
    e.stopPropagation()
  }
  getSaveImgPromise(){
    let that = this
    Taro.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {
        that.setState({
          canSaveImg: true
        })
        // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
      },
      fail(){
        that.setState({
          canSaveImg: false
        })
      }
    })
  }
  saveImg(url, e){
    e.stopPropagation()
    Taro.downloadFile({
      url: url,
      success: (pathInfo) => {
        // pathInfo.path 这是下载成的缓存链接，模拟器marker有时不支持http开头，真机不影响，得去掉http:/
        const cachePath = pathInfo.tempFilePath
        Taro.saveImageToPhotosAlbum({
          filePath: cachePath,
          success(res) {
            Taro.showToast({
              icon: 'none',
              title: '保存成功'
            })
          },
          fail(){
            Taro.showToast({
              icon: 'none',
              title: '保存失败'
            })
          }
        })
      }
    })
  }

  render () {
    const {shopPicUrl, shopName, detail,  shopGoods, recommendGoods,shareImgTag,source,canSaveImg,shareImgUrl,shopId,shareImageLoad} = this.state
    return (
      <View className='shop-detail'>
        <View className='header'>
          <View className='search' onClick={this.goSearch}>
            <AtIcon
              value='search'
              size='20'
              color='#adadad'
            >
            </AtIcon>
            <Text>请输入商品名称</Text>
          </View>
          <Swiper
            className='shop-image'
            indicatorColor='#999'
            indicatorActiveColor='#333'
            circular
            indicatorDots={shopPicUrl.length > 1}
            autoplay
          >
            {shopPicUrl.map((item, index) => (
              <SwiperItem key={index}>
                <View className='demo-text-1' style='width: 100%; height: 100%'>
                  <Image
                    src={item.detailUrl}
                    mode='aspectFill'
                    style='display: block; width: 100%;'
                  >
                  </Image>
                </View>
              </SwiperItem>
            ))}
          </Swiper>
        </View>
        <View className='center'>
          <View className='shop-address line'>
            <View className='address' onClick={this.goShop}>
              <Text className='shopName'>{shopName}</Text>
              <Text className='shopAddress'>{detail.shopAddress}</Text>
            </View>
            <View className='navigation' onClick={this.goShop}>导航</View>
          </View>
          <View className='shop-goods line'>
            {shopGoods.map((item, index) => (
              <View key={index} className='shopGoods' onClick={this.goDetail.bind(this, item.goodsId, item.goodsNo)}>
                <Image
                  src={item.detailUrl}
                  mode='aspectFill'
                >
                </Image>
                <Text className='shopGoods-name'>{'￥'+item.goodsPrice}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className='coupon line'>
          <Ticket />
        </View>
        <View className='recommended' hidden={recommendGoods.length===0}>
          <View className='recommended-title'>
            <titleTop
              title='本店推荐'
              onTitleClick={this.goShopGoodsList}
            >
            </titleTop>
          </View>
          <View className='recommendGoods-list'>
            {recommendGoods.length>0 && recommendGoods.map((item, index) => (
              <goodsItem
                style={index !== 0 && index !== 1 && 'margin-top: 10px'}
                bgColor='#f7f7f7'
                key={index}
                goodsId={item.goodsId}
                src={item.detailUrl}
                goodsName={item.goodsName}
                goodsPrice={item.goodsPrice}
                shopId={shopId}
                goodsNo={item.goodsNo}
              >
              </goodsItem>
            ))}
          </View>
        </View>
        {/*底部选购、联系商家*/}
        <View className='button-content' hidden={this.state.scrollTag} >
          <View className='callShop' hidden={this.state.scrollTag} onClick={this.callShop}>联系商家</View>
          <View className='buy' hidden={this.state.scrollTag} onClick={this.goShopGoodsList}>立即选购</View>
        </View>
        {/*右侧分享去App*/}
        <View className='right-share' style={this.state.scrollTag?'display:none':''}>
          <View className='share' onClick={this.showShare}>
            <Image
              className='right-img'
              src={iconShare}
            >
            </Image>
            <Text className='right-text'>分享</Text>
          </View>
          <Button openType='launchApp' appParameter={JSON.stringify({shopId: shopId,viewName: 'door_detail'})} style={source ? '' : 'display: none'} className='goAppBtn' plain onError={this.launchAppError}>
            <View className='goApp' >
              <Image
                className='right-img'
                src={iconLogo}
              >
              </Image>
              <Text className='right-text'>去App</Text>
            </View>
          </Button>

          <View className='goHome' onClick={this.goHome}>
            <Image
              className='right-img'
              src={iconHome}
            >
            </Image>
            <Text className='right-text'>首页</Text>
          </View>
        </View>
        <share
          isShow={this.state.cancelShareTag}
          onHideSare={this.hideShare}
          onShareImg={this.shareFriendsImg.bind(this,shopId)}
        >
        </share>
        {
          shareImgTag &&
          <View className='share-box' onClick={this.hideShareImg}>
            <View className='share-box-center'>
              <View className='share-box-top'onClick={this.stopEvent}>
                <Text className='share-box-top-text'>分享到朋友圈</Text>
                <AtIcon onClick={this.hideShareImg} value='close-circle' size='20' color='#666666' />
              </View>
              <View className='share-box-center-img' onClick={this.stopEvent}>
                {
                  shareImageLoad ?  <Image  className='shareImg' src={shareImgUrl} /> : <AtActivityIndicator mode='center' color='#FF7700' />
                }

              </View>
              <View className='share-box-bottom'>
                {
                  canSaveImg && <Button className='share-box-bottom-btn' onClick={this.saveImg.bind(this, shareImgUrl)}>保存图片</Button>
                }
                {
                  !canSaveImg && <Button openType='openSetting' onClick={this.getSaveImgPromise.bind(this)} className='share-box-bottom-btn'>保存图片</Button>
                }
                <Text className='share-box-bottom-text'>保存图片到手机相册，然后分享到朋友圈</Text>
              </View>
            </View>
          </View>
        }
      </View>
    )
  }
}
export default Index
