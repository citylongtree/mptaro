import Taro, {Component} from '@tarojs/taro'
import {View, Image, Text,ScrollView} from '@tarojs/components'
import {connect} from "@tarojs/redux"
import {Swiper, SwiperItem} from 'taro-ui'
import {focusPhone, homeSearch, focusPhone1, homeSearch1} from './../../imgs/index'
import titleTop from './titleTop/index' // 模块分类标题
import goodsItem from './../../components/goodsItem/index' // 商品
import CarBtn from "../../components/carCnt/carBtn";
import api from '../../api/home/home'
import './index.styl'
import {util,pinyin} from "../../utils";
import HgCurtain from "../../components/curtain/index";

let time = null

@connect(({searchGoods}) => ({
  ...searchGoods
}))

class Index extends Component {
  config = {
    navigationBarTitleText: '首页',
    enablePullDownRefresh: false
  }


  constructor(props) {
    super(props)
    this.state = {
      showSearch: false,
      carShow: true,
      focusList: [],
      classifyList: [],
      brandList: [],
      List: [],
    }
  }

  componentWillMount() {
    this.init()
  }

  init() {
    // 轮播图
    api.focusPic(
      {
        platform: 'MINI'
      }
    ).then(
      res => {
        this.setState({focusList: res.items})
      }
    )
    // 分类
    api.level(
      {
        platform: 'MINI'
      }
    ).then(
      res => {
        this.setState({classifyList: res.items})
      }
    )
    // 品牌
    api.brandHome(
      {
        platform: 'MINI'
      }
    ).then(
      res => {
        let brandList = res.items.splice(0, 15)
        this.setState({brandList})
      }
    )
    // 分类数据
    api.recommend(
      {
        platform: 'MINI'
      }
    ).then(
      res => {
        this.setState({List: res.items})
        Taro.stopPullDownRefresh()
      }
    )
  }

  // 打电话
  callShop() {
    Taro.makePhoneCall({
      phoneNumber: '4006885286'
    })
  }

  // 点击搜索
  btnSearch() {
    util.jumpUrl(`/pages/searchGoods/index?type=home`)
    this.props.dispatch({
      type: 'searchGoods/saveList',
      jumpPage:'search',
      history:true,
      statePage:false,
      showActionButton:true
    })
  }

  // 搜索滚动
  onScroll(e) {
    clearTimeout(time)
    this.setState({
      showSearch: e.detail.scrollTop > 40 ? true : false,
      carShow: false
    })
    time = setTimeout(() => {
      this.setState({
        carShow: true
      })
    }, 200)
  }

// 点击轮播图
  foucsSwiper(item) {
    const type = {
      1: 'firstcategoryId',
      2: 'secondCategoryId',
      3: 'thirdCategoryId',
    }
    const swiperList = {
      0: '',
      1: `/pages/goodsDetail/index${item.turnUrl}`,
      2: `/pages/home/web?turnUrl=${item.turnUrl}`,
      3: '',
      4: `/pages/shop/index/index?shopId=${item.shopId}`,
      5: `/pages/home/brand?brandId=${item.brandId}`,
      6: `/pages/searchGoods/index?${type[item.goodsTypeLevel]}=${item.goodsTypeId}`,
    }
    if (item.turnType == '1' ) {
      const index = item.turnUrl.lastIndexOf('?')
      item.turnUrl = item.turnUrl.substr(index)
      util.jumpUrl(`/pages/goodsDetail/index${item.turnUrl}`)
    }
    if (item.turnType == '2' && item.turnUrl  ) {
      util.jumpUrl(swiperList[item.turnType])
    }
    if (item.turnType == '4' && item.shopId ) {
      util.jumpUrl(swiperList[item.turnType])
    }
    if (item.turnType == '5' && type[item.goodsTypeLevel] && item.goodsTypeId ) {
      this.props.dispatch({
        type: 'searchGoods/currentPage',
        objKeys:type[item.goodsTypeLevel],
        updateData:item.goodsTypeId,
        history:false,
        statePage:false,
        showActionButton:false
      })
    }
    if (item.turnType == '6' && item.brandId ) {
      util.jumpUrl(swiperList[item.turnType])
    }
  }

  // 点击分类进入分类列表
  classify(val) {
    Taro.setStorageSync('firstcategoryId', val);
    Taro.switchTab({
      url: `/pages/category/index`
    })
  }

  // 点击品牌更多
  btnBrandAll() {
    util.jumpUrl(`/pages/home/brand`)
  }

  // 点击分类更多
  btnLevelOne(val, levelName) {
    util.jumpUrl(`/pages/searchGoods/index?firstcategoryId=${val}`)
    this.props.dispatch({
      type: 'searchGoods/currentPage',
      objKeys:'firstcategoryId',
      updateData:val,
      levelToUpperCase:pinyin.getCamelChars(levelName).slice(0, 1).toUpperCase(),
      statePage:false,
      jumpPage:'btnData',
      history:false,
      showActionButton:false
    })
  }

  btnBrand(val, brandName) {
    util.jumpUrl(`/pages/searchGoods/index?brandId=${val}&brandName=${brandName}`)
    this.props.dispatch({
      type: 'searchGoods/currentPage',
      objKeys:'brandId',
      updateData:val,
      jumpPage:'btnData',
      brandToUpperCase:pinyin.getCamelChars(brandName).slice(0, 1).toUpperCase(),
      statePage:false,
      history:false,
      showActionButton:false
    })
  }

  onScrollToUpper(){
    this.init()
  }

  render() {
    const {focusList, classifyList, brandList, List, showSearch, carShow} = this.state
    return (
      <ScrollView
        className='home'
        scrollY
        onScroll={this.onScroll}
        onScrollToUpper={this.onScrollToUpper}
      >
        <Swiper
          className='focusPic-swiper'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          circular
          indicatorDots
          autoplay
        >
          {
            focusList && focusList.length > 0 && focusList.map(item => (
              <SwiperItem key={item.picId} onClick={this.foucsSwiper.bind(this, item)}>
                <Image src={item.focusImgUrl} className='focusPic-img'/>
              </SwiperItem>
            ))
          }
        </Swiper>
        <View className={showSearch ? 'search ngcWrite' : 'search'}>
          <View className='focus-pos'>
            <Image src={showSearch ? focusPhone1 : focusPhone} className='focus-img' onClick={this.callShop}/>
            <View className={showSearch ? 'focus-search1 focus-search' : 'focus-search'} onClick={this.btnSearch}>
              <Image src={showSearch ? homeSearch1 : homeSearch} className='focus-img'/>
              <Text className='focus-search-font'>请输入商品名称</Text>
            </View>
          </View>
        </View>
        <View className='classify flex-items'>
          {
            classifyList && classifyList.length > 0 && classifyList.map(item => (
              <View className='classify-box' key={item.typeId} onClick={this.classify.bind(this, item.typeId)}>
                <Image src={item.typeImgUrl} className='classify-img'/>
                <View className='classify-font'>{item.typeName}</View>
              </View>
            ))
          }
        </View>
        <titleTop
          title='品牌推荐'
          onTitleClick={this.btnBrandAll}
        >
        </titleTop>
        <View className='brand flex-items'>
          {
            brandList && brandList.length > 0 && brandList.map(item => (
              <Image
                key={item.brandId}
                src={item.picUrl}
                className='brand-img'
                onClick={this.btnBrand.bind(this, item.brandId, item.brandName)}
              />
            ))
          }
        </View>
        <View>
          {
            List && List.length > 0 && List.length > 0 && List.map(items => (
              <View key={items.typeId}>
                {items.goodsInfo.length > 0
                && <titleTop
                  title={items.typeName}
                  onTitleClick={this.btnLevelOne.bind(this, items.typeId, items.typeName)}
                >
                </titleTop>}
                <View className='home-goods flex-items'>
                  {
                    items.goodsInfo && items.goodsInfo.length > 0 && items.goodsInfo.map(item => (
                      <goodsItem
                        style='margin:5px 0'
                        bgColor='#fff'
                        borderRadius
                        key={item.shopId}
                        goodsId={item.goodsId}
                        src={item.picUrl}
                        goodsName={item.goodsName}
                        goodsPrice={item.price}
                        goodsNo={item.goodsNo}
                        shopId={item.shopId}
                      >
                      </goodsItem>
                    ))
                  }
                </View>
              </View>
            ))
          }
        </View>
        {
          carShow && <CarBtn bottom='10px' />
        }
        <HgCurtain />
      </ScrollView>


    )
  }
}
export default Index
