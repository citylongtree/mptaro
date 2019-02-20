import Taro, {Component} from '@tarojs/taro'
import {View, ScrollView} from '@tarojs/components'
import {connect} from "@tarojs/redux"
import {AtSearchBar} from 'taro-ui'
import goodsListAll from './goodsList/index'
import modal from './TabClassify/index' // 分类
import historySearch from './../../components/historySearch/index' // 商品
import './index.styl'
import AddShopCar from "../../components/addShopCar/index";
import noList from "../../components/noList/index";
import api from "../../api/searchGoods/searchGoods";

let time = null

@connect(({searchGoods}) => ({
  ...searchGoods
}))

class Index extends Component {
  config = {
    navigationBarTitleText: '搜索商品',
    disableScroll: true
  }

  constructor(props) {
    super(props)
    this.state={
      scrollY:true
    }
  }

  componentDidShow() {
    const {scrollList, history} = this.props
    if (scrollList && !history ) {
      this.init()
    }
  }

  init() {
    this.props.dispatch({
      type: 'searchGoods/getSearch',
    })
  }

  // 用户下拉
  onPullDownRefresh() {
    const {searchGoods} = this.props
    if(searchGoods.location){
      this.props.dispatch({
        type: 'searchGoods/dropRefresh',
      })
    }
    Taro.stopPullDownRefresh()
  }

  // 用户上拉
  scrollList() {
    this.props.dispatch({
      type: 'searchGoods/initList',
    })
  }

  // 子传父的值(历史记录)
  btnHistory(val) {
    this.props.dispatch({
      type: 'searchGoods/currentPage',
      objKeys: 'keyword',
      updateData: val.keyword,
      history: false,
      statePage: true,
      showActionButton:false
    })
  }

  // 点击取消
  onActionClick() {
    Taro.navigateBack()
  }

  onScrollTag(scrollY){
    this.setState({
      scrollY
    })
  }

  // 搜索
  onChange(val) {
    clearTimeout(time)
    const jumpPage = this.props.jumpPage
    if (val === '') {
      if (jumpPage == 'search') {
        this.props.dispatch({
          type: 'searchGoods/saveList',
          history: true,
        })
      } else {
        this.props.dispatch({
          type: 'searchGoods/saveList',
          history: false,
        })
      }
      this.props.dispatch({
        type: 'searchGoods/currentPage',
        objKeys: 'keyword',
        updateData: '',
        statePage: true,
        showActionButton:false
      })
    } else {
      time = setTimeout(() => {
        this.props.dispatch({
          type: 'searchGoods/currentPage',
          objKeys: 'keyword',
          updateData: val.replace(/\s*/g,''),
          history:false,
          statePage: true,
          showActionButton:false
        })
      }, 500)
    }
  }

// 卸载页面
  componentWillUnmount() {
    const {searchGoods} = this.props
    const search = {}
    search.sort = 'distance'
    search.page = 1
    search.location = searchGoods.location
    search.secondCategoryId = ''
    search.firstcategoryId = ''
    search.thirdCategoryId = ''
    search.keyword = ''
    search.brandId = ''
    this.props.dispatch({
      type: 'searchGoods/emptyData',
      history: false,
      searchGoods: search,
      statePage: false,
      scrollList:true,
      levelToUpperCase:'',
      brandToUpperCase:'',
      showActionButton:false,
      secondCategoryId:false,
      jumpPage:''
    })
  }

  onConfirm() {
    this.props.dispatch({
      type: 'searchGoods/saveList',
      history: false,
      showActionButton:false
    })
    api.add({history: this.props.searchGoods.keyword}).then(() => {})
  }

  clearHistory() {
    this.props.dispatch({
      type: 'searchGoods/saveList',
      history: true,
      showActionButton:false
    })
  }

  render() {
    const {goodsList, showNoGoods, showNoLocation, history,searchGoods,scrollY,showActionButton,jumpPage} = this.props
    return (
      <View className='search-goods'>
        <View className='search-goods-box'>
          { jumpPage == 'search' && // 搜索的时候
            <AtSearchBar
              className='search-btn'
              actionName='取消'
              placeholder=''
              focus
              showActionButton={showActionButton}
              onConfirm={this.onConfirm.bind(this)}
              value={searchGoods.keyword}
              onChange={this.onChange.bind(this)}
              onActionClick={this.onActionClick.bind(this)}
            />
          }
          {jumpPage != 'search' &&
            <AtSearchBar
              className='search-btn'
              actionName='取消'
              placeholder=''
              focus={jumpPage == 'search'}
              showActionButton={showActionButton}
              onConfirm={this.onConfirm.bind(this)}
              value={searchGoods.keyword}
              onChange={this.onChange.bind(this)}
              onActionClick={this.onActionClick.bind(this)}
            />
          }
        </View>
        {history
          ? <View className='search-goods-box1'>
            <historySearch
              type='GOODS'
              onBtnHistory={this.btnHistory}
              onBtnHistoryDel={this.clearHistory}
            >
            </historySearch>
          </View>
          : <View className='search-goods-box1'>
            <View className='search-goods-btnTop'>
              <modal
                onScrollTag={this.onScrollTag}
              >
              </modal>
            </View>
            <ScrollView
              className='search-goods-btnBottom'
              scrollY={scrollY}
              enableBackToTop
              onScrollToLower={this.scrollList}
            >
              <View className='goods-items'>
                {
                  !showNoGoods && goodsList && goodsList.length > 0 && goodsList.map(item => (
                    <goodsListAll
                      borderRadius
                      key={item.shopId}
                      goodsId={item.id}
                      src={item.pictureUrl}
                      goodsName={item.title}
                      goodsPrice={item.price}
                      goodsNo={item.goodsNo}
                      shopId={item.shopId}
                      shopName={item.shopName}
                      distance={item.distance.text}
                    >
                    </goodsListAll>
                  ))
                }
              </View>
              {
                showNoGoods &&
                <View className='noOrder'>
                  <noList
                    image='noGoods'
                    errPage='暂无商品'
                  >
                  </noList>
                </View>
              }
              {
                showNoLocation &&
                <View>
                  <noList
                    image='noLocation'
                  >
                  </noList>
                </View>
              }
            </ScrollView>
          </View>
        }
        <AddShopCar />
      </View>
    )
  }
}
export default Index
