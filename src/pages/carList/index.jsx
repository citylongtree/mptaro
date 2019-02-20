import Taro, {Component} from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import {View,Image,Text} from '@tarojs/components'
import { AtSwipeAction} from "taro-ui"
import api from './../../api/goods/shopCar'
import {carList,right} from './../../imgs'
import HgRadio from "../../components/radio/index";
import AddShopCar from "../../components/addShopCar/index";
import TitleTop from '../home/titleTop/index'
import goodItem from '../../components/goodsItem/index'
import HgInputNumber from '../../components/numberInput/index'
import {util,filter} from './../../utils'
import tool from './tool'
import './index.styl'

let delFlag = false

@connect(() => ({
}))
class Index extends Component {
    config = {
        navigationBarTitleText: '购物车'
    }
    constructor(props) {
        super(props)
        this.state = {
          // 购物车列表
          list:[],
          // 猜你喜欢列表
          recommended:'',
          // 加载是否完成
          isLoad:false,
          haveOpen:false
        }
    }
    componentWillMount() {
      this.getRecommended()
    }
    componentDidShow(){
      this.getCarList()
    }
    onOpen(carId){
        let {list} = this.state
        list.map(shop=>{
          shop.cartListGoods.map(item=>{
              item.isClose = item.cartId!==carId
          })
        })
        this.setState({
          list,
          haveOpen:true
        })
    }
    onClose(){
      this.setState({
        haveOpen:false
      })
    }
  /**
   * 点击其他地方关闭滑块
   */
  setClose(){
      let {list,haveOpen} = this.state
      if(!haveOpen || delFlag){return}
      list.map(shop=>{
        shop.cartListGoods.map(item=>{
          item.isClose = true
        })
      })
      this.setState({
        list,
        haveOpen:false
      })
    }
  /**
   * 获取猜你喜欢列表
   */
  getRecommended(){
      api.recommended().then(res=>{
        this.setState({
          recommended:res.items
        })
        this.setState({})
      })
    }

  /**
   * 获取购物车列表
   */
  getCarList(){
     tool.getCarList().then(list=>{
         this.setState({
           list: list,
           isLoad:true
         })
         Taro.stopPullDownRefresh()
       })
    }
  /**
   * 计算商品总价格
   */
  getSum(){
      const list =  this.state.list
      list.map(item=>{
        const sum = item.cartListGoods.
        filter(goods=>goods.checked).
        reduce((prev,curr)=>{
            prev.price = ( prev.price + (curr.goodsPrice * curr.cnt))
            prev.cnt = ( prev.cnt + curr.cnt)
            return prev
        },{price:0, cnt:0})
        item.sumPrice = sum.price || 0
        item.sumCnt = sum.cnt || 0
        return item
      })
     this.setState({
       list
     })
    }

  /**
   * 选择店铺触发事件
   * @param shopId 商品Id
   * @param value 选中或未选中的值
   */
    handleSelectShop(shopId,value){
      const list =  this.state.list
      tool.setShopCheck(list,shopId,value)
      this.setState({list},()=>{
        this.getSum()
      })
    }

  /**
   * 选择商品触发事件
   * @param cartId 购物车Id
   * @param value 选中或未选中的值
   */
    handleSelectGoods(cartId,value){
      const list =  this.state.list
      tool.setGoodsCheck(list,cartId,value)
      this.setState({list},()=>{
        this.getSum()
      })
    }
  /**
   * 删除购物车中的商品
   * @param cartIds 购物车Id
   */
  handleDel(cartIds){
      delFlag = true
      const list =  this.state.list
      const resList = list.filter(item=>{
        item.cartListGoods = item.cartListGoods.filter(goods=>(goods.cartId !== cartIds))
        return item.cartListGoods.length > 0
      })
      this.setState({list:resList},()=>{
        delFlag = false
        this.getSum()
      })
      tool.del(cartIds).then(
        res=>{
          this.props.dispatch({type:'shopCar/save',carCnt:res})
        }
      )
    }
  /**
   * 编辑多规格商品
   * @param goods 选中的商品对象
   */
  handleEdit(goods){
      const {haveOpen} = this.state
      if(haveOpen){return}
      const {skuValueList,selectSku,cnt,cartId} = goods
      this.props.dispatch({
        type:'shopCar/preEdit',
        selectSku,
        goodsCnt:cnt,
        cartId,
        goodsDetail:{
          skuValueList,
        }
      })
    }
  onEditSuccess(flag){
    if(flag){
      this.getCarList()
    }
  }
  /**
   * 改变商品数量
   * @param goods 选中的商品对象
   * @param value 数字输入框中的值
   */
    handleNumberChange(goods,value){
      const list = this.state.list
      tool.setCnt(list,goods,value)
      this.setState({list},()=>{
        this.getSum()
      })
    }
  /**
   * 点击结算按钮触发结算功能
   * @param shopId 店铺Id
   */
  handlePay(shopId){
      const list = this.state.list
      if(!tool.getPayParam(list,shopId)){
        util.showToast('您还没有选择宝贝哦')
        return
      }
      this.props.dispatch({
        type:'carList/getBuy',
        ...tool.getPayParam(list,shopId)
      })
    }

  /**
   * 跳转到门店
   * @param shopId 门店Id
   */
  handleGoShop(shopId){
      util.jumpUrl(`/pages/shop/index/index?shopId=${shopId}`)
    }

  /**
   * 跳转到商品详情页
   * @param goods 点击的商品对象
   */
  goGoodsDetail(goods){
      const {goodsId,goodsNo,shopId} = goods
      util.jumpUrl(`/pages/goodsDetail/index?shopId=${shopId}&goodsId=${goodsId}&goodsNo=${goodsNo}`)
  }
  /**
   * 上拉加载
   */
  onPullDownRefresh(){
      this.getCarList()
    }
    render() {
        const {list,isLoad,recommended} = this.state
        return (
          <View  onClick={this.setClose.bind(this)} className='wrapper'>
            {
              isLoad&&list.length>0&&(<View className='carList'>
                {
                  list.map((item,index)=>(
                    <View  className='carList-item' key={item.shopId}>
                      <View className='carList-item-title'>
                        <HgRadio value={item.checked} onChange={this.handleSelectShop.bind(this,item.shopId)} />
                        <Image src={carList.shop} className='img' onClick={this.handleGoShop.bind(this,item.shopId)} />
                        <View className='name text-ellipsis1' onClick={this.handleGoShop.bind(this,item.shopId)}>
                          {item.shopName}
                        </View>
                        <Image src={right} className='right' onClick={this.handleGoShop.bind(this,item.shopId)} />
                      </View>
                      <View className='carList-item-content'>
                        {
                          item.cartListGoods.length>0&&item.cartListGoods.map((goods,goodsIndex)=>(
                            <AtSwipeAction
                              autoClose
                              key={goods.cartId}
                              isClose={goods.isClose}
                              onOpened={this.onOpen.bind(this,goods.cartId)}
                              onClosed={this.onClose.bind(this)}
                              onClick={this.handleDel.bind(this,goods.cartId,index,goodsIndex)}
                              options={[
                                {
                                  text: '删除',
                                  style: {
                                    backgroundColor: '#FF4949',
                                  },
                                }
                              ]}
                            >
                              <View className='carList-item-goods'>
                                <View className={['goodsItem', goodsIndex === 0 && 'top',goodsIndex === item.cartListGoods.length -1 && 'bottom']}>
                                  <View className='goodsItem-check'>
                                    <HgRadio value={goods.checked} onChange={this.handleSelectGoods.bind(this,goods.cartId)} />
                                  </View>
                                  <View className='goodsItem-info'>
                                    <View className='goodsItem-info-img' onClick={this.goGoodsDetail.bind(this,goods)}>
                                      <Image src={goods.selectSku.skuGoodsPicUrl} className='img' />
                                    </View>
                                    <View className='goodsItem-info-detail'>
                                      <View className='goodsItem-info-detail-goodsName text-ellipsis2' onClick={this.goGoodsDetail.bind(this,goods)}>
                                        {goods.goodsName}
                                      </View>
                                      {
                                        goods.skuValueList.length > 1 &&(
                                          <View className='goodsItem-info-detail-sku ' onClick={this.handleEdit.bind(this,goods)}>
                                            <View className='text text-ellipsis1'>{goods.specName}</View>
                                            <Image src={carList.iconDown} className='img' />
                                          </View>
                                        )
                                      }
                                      <View className='goodsItem-info-detail-price'>
                                        {filter.currency(goods.goodsPrice)}
                                      </View>
                                      <View className='goodsItem-info-detail-cunt'>
                                        <HgInputNumber value={goods.cnt}
                                          min={1}
                                          max={goods.skuValueCnt}
                                          width={85}
                                          step={1}
                                          maxMessage='商品库存不足'
                                          onChange={this.handleNumberChange.bind(this,goods)}
                                        />
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </AtSwipeAction>
                          ))
                        }
                      </View>
                      <View className='carList-item-balance' >
                        <Text>合计:</Text>
                        <Text className='sum'>{filter.currency(item.sumPrice)}</Text>
                        <View className='btn' onClick={this.handlePay.bind(this,item.shopId)}>
                          结算
                        </View>
                      </View>
                    </View>
                  ))
                }
                <AddShopCar onEditSuccess={this.onEditSuccess.bind(this)} />
              </View>)
            }
            {
              isLoad&&list.length === 0&&(
              <View className='carList-no'>
                <View className='message'>
                <Image src={carList.noCarList} className='img' />
                <View className='text'>购物车没有商品哦，快去加购吧~</View>
                </View>
                <View className='goods'>
                  <TitleTop title='猜你想买' hideRight />
                  <View className='items flex-items'>
                    {
                      recommended.map(item=>(
                        <goodItem
                          borderRadius
                          src={item.goodsPicUrl[0].detailUrl}
                          goodsName={item.goodsName}
                          goodsPrice={item.skuValueList[0].price}
                          goodsId={item.goodsId}
                          shopId={item.shopId}
                          goodsNo={item.goodsNo}
                          key={item.goodsId}
                        />
                      ))
                    }
                  </View>
                </View>
              </View>
              )
            }
          </View>
        )
    }
}
export default Index
