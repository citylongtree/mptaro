import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView} from "@tarojs/components"
import { AtSearchBar } from 'taro-ui'
import {connect} from "@tarojs/redux"
import History from '../../../components/historySearch/index'
import ShopGoodsItem from '../goodsItem/index'
import "./index.styl"
import api from "../../../api/shopSearchGoods";
import AddShopCar from '../../../components/addShopCar/index'
import noList from '../../../components/noList/index'

let time = null
@connect(()=>({}))
class shopGoodsSearch extends Component{

  config = {
    navigationBarTitleText: '搜索商品',
  }

  constructor(props) {
    super(props)
    this.state = {
      showHistory: true,
      shopId: '',
      goodsList: [],
      page: 1,
      totalPage: 1,
      keyword: ''
    }
  }

  componentWillMount() {
    const {shopId} = this.$router.params
    this.setState({
      shopId
    })
  }
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.setState({
      showHistory: false,
      page: 1,
    },() =>{
      this.getGoodsList()
    })
  }
  /**
   * 页面相关事件处理函数--监听用户上拉动作
   */
  upLoadData() {
    this.loadMore()
  }
  getGoodsList(){
    const { page,  keyword } = this.state
    let { shopId } = this.state
    if(shopId===null===null||shopId===undefined||shopId===''){
      shopId = this.$router.params.shopId
    }
    let { goodsList } = this.state
    api.shopSearchGoodsList({keyword, shopId, page}).then(res => {
      if (page > 1) {
        goodsList = goodsList.concat(res.items)
      }else {
        goodsList = res.items
      }
      this.setState({
        goodsList,
        totalPage: res.totalPage
      })
    })
    Taro.stopPullDownRefresh()
  }
  loadMore() {
    const { page, totalPage} = this.state
    if(page < totalPage){
      const newPage = page + 1
      this.setState({
        page: newPage
      },() => {
        this.getGoodsList()
      })
    } else{
      Taro.showToast({
        icon:'none',
        title:'没有更多了'
      })
    }
  }
  // 显示历史
  showHistory(){
    this.setState({
      showHistory: true,
    })
  }
  // 输入的value
  onChange(val){
    val = val.replace(/\s*/g,'')
    clearTimeout(time)
    if(val === ''){
      this.setState({
        showHistory: true,
        keyword: ''
      })
    } else{
      time = setTimeout(() => {
        this.setState({
          showHistory: false,
          page: 1,
          keyword: val
        },() =>{
          this.getGoodsList()
          api.addHistory({history: val, }).then(res=>{
          })
        })
      }, 500)
    }
  }
  // 点击历史记录
  getHistory(val){
    this.setState({
      showHistory: false,
      page: 1,
      keyword: val.keyword
    },() =>{
      this.getGoodsList()
    })
  }
  // 取消搜索
  onActionClick() {
    this.setState({
      showHistory: true,
      keyword: ''
    })
    Taro.navigateBack()
  }

  // 加入购物车
  addShopCar(goodsData) {
    const {shopId} = this.state
    const goodsId = goodsData.goodsId || goodsData.id
    const goodsNo = goodsData.goodsNo
    this.props.dispatch({
      type:'shopCar/getDetail',
      goodsId,shopId,goodsNo,from:'add'
    })
  }

  render(){
    const {shopId} = this.state
    return (
      <View className='searchMain'>
        <View className='search'>
          <AtSearchBar
            actionName='取消'
            placeholder=''
            focus
            showActionButton
            value={this.state.keyword}
            onChange={this.onChange.bind(this)}
            onActionClick={this.onActionClick.bind(this)}
          />
        </View>
        <View className={this.state.showHistory?'history-box':'history-box hidden'}>
          {
            this.state.showHistory && <History
              type='GOODS'
              onBtnHistory={this.getHistory}
            >
            </History>
          }
        </View>
        <ScrollView
          className={this.state.showHistory?'goodsList hidden':'goodsList'}
          scrollY
          lowerThreshold
          enableBackToTop
          onScrollToUpper={this.onPullDownRefresh}
          onScrollToLower={this.upLoadData}
        >
          {
            this.state.goodsList.length > 0 && this.state.goodsList.map((items, index) => (
              <View className='goodsItem' key={index}>
                <ShopGoodsItem type='search' shopId={shopId} onAddShopCar={this.addShopCar.bind(this, items)} goodsData={items}></ShopGoodsItem>
              </View>
            ))
          }
          {
            !this.state.goodsList || this.state.goodsList.length === 0 && <noList errPage='暂无相关商品' image='noGoods'  />
          }
        </ScrollView>
        <AddShopCar />
      </View>
    )
  }
}
export default shopGoodsSearch
