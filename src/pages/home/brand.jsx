import Taro, {Component} from '@tarojs/taro'
import {View, Image, Text, ScrollView} from '@tarojs/components'
import {connect} from "@tarojs/redux"
import Letter from "./../../components/letterSlider/index"
import './brand.styl'
import api from '../../api/home/home'
import {pinyin, util,sort} from "../../utils";

@connect(({searchGoods}) => ({
  ...searchGoods
}))


class Index extends Component {
  config = {
    navigationBarTitleText: '品牌列表'
  }

  constructor(props) {
    super(props)
    this.state = {
      brandList:[],
      letterList: [],
      sellHout: [],
      letterActive: ''
    }
  }

  componentWillMount() {
    this.initData()
  }

  initData() {
    // 品牌
    api.brand().then(
      res => {
        let unSellHot = res.data.unSellHot
        let sellHot = res.data.sellHot
        let obj = sort.sortArr(unSellHot)
        if(sellHot.length>0){
          obj.letterList.unshift('热销')
        }
        this.setState({
          letterList: obj.letterList,
          brandList: obj.brandList,
          sellHout: sellHot
        })
      }
    )
  }

  // 点击字母
  getLetter = (val) => {
    this.setState({
      letterActive: val=='热销'?'hot':val
    })
  }

  scrollCityList = () => {
    // 列表滚动
  }

  handleClick(val,brandName) {
    util.jumpUrl( `/pages/searchGoods/index?brandId=${val}`)
    this.props.dispatch({
      type: 'searchGoods/currentPage',
      objKeys:'brandId',
      updateData:val,
      jumpPage:'btnData',
      brandToUpperCase:pinyin.getCamelChars(brandName).slice(0, 1).toUpperCase(),
      history:false,
      showActionButton:false
    })
  }
  render() {
    const {letterList, brandList, sellHout} = this.state
    return (
      <View className='brand-list'>
        <ScrollView
          className='brand-list-content'
          scrollY
          enableBackToTop
          scrollIntoView={this.state.letterActive}
          onScroll={this.scrollCityList}
        >
          <View
            className='brand-list-hot'
            id='hot'
          >
            <View className='brand-list-top'>
              <View className='brand-list-left'></View>
              <View>热销品牌</View>
            </View>
            <View className='brand-list-box'>
              {
                sellHout && sellHout.length > 0 && sellHout.map((item) => (
                  <View
                    className='brand-list-imgbox'
                    key={item.brandId}
                    onClick={this.handleClick.bind(this, item.brandId,item.brandName)}
                  >
                    <Image src={item.picUrl} className='brand-list-img'></Image>
                  </View>
                ))
              }
            </View>
          </View>
          {
            brandList && brandList.length > 0 && brandList.map((item, index) => (
              <View className='brand-list-boxTop' id={item.title} key={index}>
                <View className='brand-list-boxleft'>{item.title}</View>
                <View className='brand-list-boxB'>
                  {
                    item.items && item.items.length > 0 &&  item.items.map((ite) => (
                      <View className=' brand-list-imgbox1' key={ite.brandId} onClick={this.handleClick.bind(this, ite.brandId,ite.brandName)}>
                        <View className='brand-list-imgbox marginR-25'>
                          <Image src={ite.picUrl} className='brand-list-img'></Image>
                          {/*<Image src={focusPhone} className='brand-list-img'></Image>*/}
                        </View>
                        <Text>{ite.brandName}</Text>
                      </View>
                    ))
                  }
                </View>
              </View>
            ))
          }
        </ScrollView>
        <Letter
          onPutLetter={this.getLetter}
          color='#212121'
          letterList={letterList}
        >
        </Letter>
      </View>
    )
  }
}
export default Index
