import Taro, { Component } from '@tarojs/taro'
import {connect} from "@tarojs/redux";
import { View, ScrollView, Text } from '@tarojs/components'
import { AtIcon } from "taro-ui"
import SearchHeader from '../searchShoppingCar/index'
import ShopGoodsItem from '../goodsItem/index'
import './index.styl'
import AddShopCar from "../../../components/addShopCar/index";
import noList from '../../../components/noList/index'


@connect(({shopGoodsList})=>({
  ...shopGoodsList
}))
class shopGoods extends Component {
  config = {
    navigationBarTitleText: '商品列表',
    enablePullDownRefresh: false
  }
  constructor(){
    super()
    this.state = {
      // 购物车数量
      carCnt: 1,
      // 左侧默认选中第一个
      classActiveId: 0,
      // 排序的数据
      sortList: [
        { name: '销量最高', sort: 'matching' },
        { name: '价格从低到高', sort: 'maxprice' },
        { name: '价格从高到低', sort: 'minprice' }
      ],
      // 品牌排序的弹窗盒子
      showClassifyBox: false,
      // 品牌的显示
      showClassifyBrand: false,
      // 排序的显示
      showClassifySort: false,
      // 选中的品牌
      brandActiveId: '',
      // 选中的排序
      sortActiveId: 'matching',
      // 当前选中排序还是品牌
      activeClassItem: ''
    }
  }
  componentWillMount () {
    const { shopId } = this.$router.params
    this.props.dispatch({
      type: 'shopGoodsList/getShopList',
      shopId: shopId
    })
    this.props.dispatch({
      type: 'shopGoodsList/downUpdate',
      shopId: shopId
    })
  }
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    const { shopId } = this.$router.params
    this.props.dispatch({
      type: 'shopGoodsList/getShopList',
      shopId: shopId
    })
    this.props.dispatch({
      type: 'shopGoodsList/downUpdate',
      shopId: shopId
    })
  }
  upLoadData() {
    this.props.dispatch({
      type: 'shopGoodsList/loadMore'
    })
  }

  // 加入购物车
  addShopCar(goodsData) {
    const { shopId } = this.$router.params
    const goodsId = goodsData.goodsId || goodsData.id
    const goodsNo = goodsData.goodsNo
    this.props.dispatch({
      type:'shopCar/getDetail',
      goodsId,shopId,goodsNo,from:'add'
    })
  }

  // 左侧类目点击事件
  showActive(id){
    this.setState({
      classActiveId: id
    })
    this.props.dispatch({
      type: 'shopGoodsList/classifyClick',
      levelId: id
    })
  }
  // 隐藏品牌分类的弹窗
  hideBox() {
    this.setState({
      activeClassItem: '',
      showClassifyBox: false,
      showClassifyBrand: false,
      showClassifySort: false,
    })
  }
  // 品牌和排序的下拉点击
  selectActive(name, val) {

    if(name === 'brandActiveId'){
      if(this.state[name]===val){
        val = ''
      }
      const brandId = val
      this.props.dispatch({
        type: 'shopGoodsList/brandClick',
        brandId
      })
    }else {
      this.props.dispatch({
        type: 'shopGoodsList/sortCLick',
        sort: val
      })
    }
    this.setState({
      [name]: val,
      activeClassItem: '',
      showClassifyBox: false,
      showClassifyBrand: false,
      showClassifySort: false,
    })
  }
  // 品牌排序的切换
  classifyClick(val, classItem) {
    if (val === this.state.activeClassItem ) {
      this.setState({
        activeClassItem: '',
        showClassifyBox: false,
        showClassifyBrand: false,
        showClassifySort: false,
      })

    } else {
      this.setState({
        showClassifyBrand: false,
        showClassifySort: false,
        activeClassItem: val,
        showClassifyBox: true,
        [classItem] : true
      })
    }
  }
  componentWillUnmount(){
    this.props.dispatch({
      type: 'shopGoodsList/reset',
    })
  }

  render () {
    const { classify, brands, goodsList} = this.props
    const { shopId } = this.$router.params
    return (
      <View className='goods-main'>
        <SearchHeader shopId={shopId} searchTypeTag='shopSearch' />
        <View className='goods-classify'>
          <View className='classify-item' onClick={this.classifyClick.bind(this, 'brand', 'showClassifyBrand')} style={this.state.activeClassItem === 'brand'? 'color: #FF7200' : ''}>品牌{<AtIcon value={this.state.activeClassItem === 'brand' ? 'chevron-up' : 'chevron-down'} size='20'></AtIcon>}</View>
          <View className='classify-item' onClick={this.classifyClick.bind(this, 'sort', 'showClassifySort')} style={this.state.activeClassItem === 'sort' ? 'color: #FF7200' : ''}>排序{<AtIcon value={this.state.activeClassItem === 'sort' ? 'chevron-up' : 'chevron-down'} size='20'></AtIcon>}</View>
          {
            this.state.showClassifyBox &&
            <View className='box-style' onClick={this.hideBox}>
              <View className='classify-list'>
                {
                  this.state.showClassifyBrand && brands.map((brandItem, index) => (
                    <View key={index} className='classify-list-item' onClick={this.selectActive.bind(this,'brandActiveId',brandItem.brandId)}><Text>{brandItem.brandName}</Text>{brandItem.brandId === this.state.brandActiveId && <AtIcon value='check' size='18' color='#FF7200'></AtIcon>}</View>
                  ))
                }
                {
                  this.state.showClassifySort && this.state.sortList.map((sortItem, index) => (
                    <View key={index} className='classify-list-item' onClick={this.selectActive.bind(this,'sortActiveId',sortItem.sort)}><Text>{sortItem.name}</Text>{sortItem.sort === this.state.sortActiveId && <AtIcon value='check' size='18' color='#FF7200'></AtIcon>}</View>
                  ))
                }
              </View>
            </View>
          }
        </View>
        <View className='goods-list'>
          <ScrollView
            className='goods-left'
            scrollY={!this.state.showClassifyBox}
          >
            {classify.length>1 && classify.map((classItems, index) => (
              <Text className={classItems.id === this.state.classActiveId ? 'classify-items classify-active' : 'classify-items'} key={index} onClick={this.showActive.bind(this, classItems.id)}>{classItems.id === 0 && <Text className='hot'></Text>}{classItems.oneName}</Text>
            ))}
          </ScrollView>
          <ScrollView
            className='goods-right'
            scrollY={!this.state.showClassifyBox}
            lowerThreshold
            enableBackToTop
            onScrollToLower={this.upLoadData}
          >
            {
              goodsList.map((goodsItems, index)=>(
                <View className='goods-item-box' key={index}>
                  <ShopGoodsItem type='list' shopId={shopId} onAddShopCar={this.addShopCar.bind(this, goodsItems)} goodsData={goodsItems}></ShopGoodsItem>
                </View>
              ))
            }
            {
              !goodsList || goodsList.length === 0 && <noList errPage='暂无相关商品' image='noGoods'  />
            }
          </ScrollView>
        </View>
        <AddShopCar />
      </View>
    )
  }
}
export default shopGoods
