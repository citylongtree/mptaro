import Taro, { Component } from '@tarojs/taro'
import {connect} from "@tarojs/redux"
import {Text, View, Image, ScrollView} from "@tarojs/components"
import {AtIcon, AtTabBar, AtSearchBar} from 'taro-ui'
import './index.styl'
import History from '../../../components/historySearch/index'
import { imgDefault } from '../../../imgs/index'
import util from "../../../utils/util"
import noList from '../../../components/noList/index'

let time = null
@connect(({shopList}) => ({
  ...shopList
}))
class List extends Component{
  config = {
    navigationBarTitleText: '门店',
    enablePullDownRefresh: false
  }
  constructor(props) {
    super(props)
    this.state = {
      tabList: [
        { title: '距离最近', sort: 'distance'},
        { title: '销量最高', sort: 'sale'},
        { title: '商品最多', sort: 'score'}
      ],
      current: 0,
      showHistory: false,
      showHeadCity: false,
      placeholderText: '请输入门店名称'
    }
  }

  componentWillMount() {

  }

  componentDidShow() {
    this.props.dispatch({
      type: 'shopList/upData',
      sort: 'distance',
    })
    this.setState({
      current: 0
    })
  }
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.props.dispatch({
      type: 'shopList/downRefresh'
    })
  }
  /**
   * 页面相关事件处理函数--监听用户上拉动作
   */
  upLoadData() {
    // Do something when page reach bottom.
    this.props.dispatch({
      type: 'shopList/upLoad'
    })
  }
  handleClick(val){
    const { tabList, shopName } = this.state
    this.setState({
      current: val
    })
    this.props.dispatch({
      type: 'shopList/upData',
      sort: tabList[val].sort,
      shopName: shopName || ''
    })
  }
  // 选择城市
  selectCity() {
    const { cityName } = this.props.shopData[0]
    util.jumpUrl(`/pages/shop/city/index?cityName=${cityName}`)
  }
  // 进店
  goShop(shopId) {
    util.jumpUrl(`/pages/shop/index/index?shopId=${shopId}`)
  }
  // 显示历史
  showHistory(){
    Taro.setNavigationBarTitle({
      title: '搜索门店'
    })
    this.setState({
      showHistory: true,
      showHeadCity: true,
      placeholderText: ''
    })
  }
  showPlaceholder(){
    this.setState({
      placeholderText: '请输入门店名称'
    })
  }
  // 输入的value
  change(val){
    val = val.replace(/\s*/g,'')
    clearTimeout(time)
    if(val === ''){
      this.setState({
        shopName: val
      })
    } else{
      time = setTimeout(() => {
        this.setState({
          shopName: val,
          showHistory: false,
          current: 0
        },() =>{
          this.props.dispatch({
            type: 'shopList/upData',
            sort: 'distance',
            shopName: val
          })
        })
      }, 500)
    }
  }
  // 搜索
  searchShop(){
    const { shopName } = this.state
    this.props.dispatch({
      type: 'shopList/upData',
      sort: 'distance',
      shopName: shopName
    })
    this.setState({
      showHistory: false,
      current: 0
    })
  }
  // 点击历史记录
  getHistory(val){
    this.props.dispatch({
      type: 'shopList/upData',
      sort: 'distance',
      shopName: val.keyword
    })
    this.setState({
      current: 0,
      showHistory: false,
      shopName: val.keyword
    })
  }
  // 取消搜索
  onActionClick() {
    Taro.setNavigationBarTitle({
      title: '门店'
    })
    this.props.dispatch({
      type: 'shopList/upData',
      sort: 'distance',
      shopName: ''
    })
    this.setState({
      current: 0,
      shopName: '',
      showHistory: false,
      showHeadCity: false,
      placeholderText: '请输入门店名称'
    })
  }

  render(){
    const {shopData,showListTag,showNoLocation} = this.props
    const {placeholderText} = this.state
    return (
      <View className='shop'>
        <View className='search-header'>
          <View className={this.state.showHeadCity?'select-city hidden':'select-city'} onClick={this.selectCity.bind(this)}>
            <AtIcon
              value='map-pin'
              size='16'
              color='#343434'
            >
            </AtIcon>
            <Text className='cityName'>{ shopData[0].cityName || '杭州市' }</Text>
            <AtIcon
              value='chevron-down'
              size='16'
              color='#343434'
            >
            </AtIcon>
          </View>
          <View className='search-value' style='flex: 1'>
            <AtSearchBar
              className='search'
              actionName='取消'
              value={this.state.shopName}
              onChange={this.change.bind(this)}
              onActionClick={this.onActionClick.bind(this)}
              onConfirm={this.searchShop.bind(this)}
              onFocus={this.showHistory}
              onBlur={this.showPlaceholder}
              showActionButton={this.state.showHeadCity}
              placeholder={placeholderText}
            >
            </AtSearchBar>
          </View>
        </View>
        <View className={this.state.showHistory?'sort-tab hidden':'sort-tab'}>
          <AtTabBar
            color='#838383'
            selectedColor='#FF7915'
            tabList={this.state.tabList}
            onClick={this.handleClick.bind(this)}
            current={this.state.current}
          >
          </AtTabBar>
        </View>
        <View className={!this.state.showHistory?'history-box hidden':'history-box'}>
          {
            this.state.showHistory && <History
              type='CHASHOP'
              onBtnHistory={this.getHistory}
            >
            </History>
          }
        </View>
        <View className={showListTag?'':'hidden'}>
          {
            !shopData || shopData.length < 1 && !this.state.showHistory && <noList errPage='未搜索到门店，请确认当前定位城市是否与您想要查找的门店所在城市一致' image='noOrder' />
          }
        </View>
        <View>
          {
            showNoLocation && <noList image='noLocation' />
          }
        </View>
        <ScrollView
          className={this.state.showHistory?'shopList hidden':'shopList'}
          scrollY
          lowerThreshold
          enableBackToTop
          onScrollToLower={this.upLoadData}
          upperThreshold={70}
          onScrollToUpper={this.onPullDownRefresh}
        >
          {shopData.map((items, index) => (
            <View key={index} className='shopLi' onClick={this.goShop.bind(this, items.shopId)}>
                <View className='shopImg'>
                  <Image
                    src={items.shopPicUrl[0].detailUrl || imgDefault}
                    mode='aspectFill'
                    style='display: block; width: 100%;height: 100%'
                  >
                  </Image>
                </View>
                <View className='shopDesc'>
                  <Text className='shop-name text-ellipsis2'>{items.shopName}</Text>
                  <Text className='shop-address text-ellipsis1'>{items.shopAddress}</Text>
                </View>
                <View className='distance'>
                  <Text className='goShop'>进店</Text>
                  <View className='distanceText'>
                    <AtIcon
                      value='map-pin'
                      size='15'
                      color='#838383'
                    >
                    </AtIcon>
                    {items.distanceText.replace('公里', 'km').replace('米', 'm')}
                  </View>
                </View>
            </View>
          ))}
        </ScrollView>
      </View>
    )
  }
}
export default List
