import Taro, {Component} from '@tarojs/taro'
import {View, Image, RichText} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import {shaoCar, position, TesChart} from './../../../imgs/index'
import './index.styl'
import util from '../../../utils/util/index'

@connect(()=>({}))
class Index extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {

  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  // 点击进去门店
  btnShop(val,e) {
    e.stopPropagation()
    util.jumpUrl(`/pages/shop/index/index?shopId=${val}`)
    this.props.dispatch({
      type: 'searchGoods/saveList',
      scrollList:false,
      showActionButton:false
    })
  }

  // 加入购物车
  addShopCar(e) {
    e.stopPropagation()
    const {goodsId,shopId,goodsNo} = this.props
    this.props.dispatch({
      type:'shopCar/getDetail',
      goodsId,shopId,goodsNo,from:'add'
    })
  }

  // 点击进入详情
  btnDetail() {
    const {goodsId,shopId,goodsNo} = this.props
    util.jumpUrl(`/pages/goodsDetail/index?shopId=${shopId}&&goodsId=${goodsId}&&goodsNo=${goodsNo}`)
    this.props.dispatch({
      type: 'searchGoods/saveList',
      scrollList:false,
      showActionButton:false
    })
  }

  render() {
    const {distance, src, goodsName, shopName,  goodsPrice, shopId} = this.props
    return (
      <View className='goods-list'  onClick={this.btnDetail.bind(this)} >
        <Image src={src} className='goods-img' />
        <View className='goods-box'>
          <View className='text-ellipsis2 goods-box-font goods-name'><RichText nodes={goodsName} /></View>
          <View className='goods-content-left'>
            <View>
              <View className='goods-content-price common-font'>￥ {goodsPrice}</View>
              <View className='goods-content-font'><Image src={position?position :TesChart} className='goods-img1' />{distance}</View>
            </View>
            <View className='goods-img2' onClick={this.addShopCar.bind(this)}>
              <Image src={shaoCar} />
            </View>
          </View>
          <View className='goods-content-right' onClick={this.btnShop.bind(this, shopId)}>
            <View className='goods-content-font2 text-ellipsis1 goods-content-shopName'>{shopName}</View>
            <View className='goods-content-font1 common-font goods-content-btn'>进店&gt; </View>
          </View>
        </View>
      </View>
    )
  }
}
export default Index
