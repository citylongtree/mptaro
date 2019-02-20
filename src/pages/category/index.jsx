import Taro, {Component} from '@tarojs/taro'
import {View, Image, ScrollView} from '@tarojs/components'
import {connect} from "@tarojs/redux"
import twoLevel from './twoLevel/index' // 分类
import classifyLeft from './../../components/classifyLeft/index' // 商品
import {util,pinyin} from "../../utils";
import api from '../../api/catetory/catetory'
import './index.styl'
import SearchHeader from '../shop/searchShoppingCar/index'

@connect(({searchGoods}) => ({
  ...searchGoods
}))

class Index extends Component {
  config = {
    navigationBarTitleText: '分类',
    enablePullDownRefresh: false,
    disableScroll: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      classifyList: [],
      firstcategoryId: ''
    }
  }

  componentWillMount() {

  }

  componentDidShow() {
    this.initData()
  }

  initData() {
    api.allLevel().then(
      res => {
        let firstcategoryId = Taro.getStorageSync('firstcategoryId')
        this.setState({
          firstcategoryId: firstcategoryId ? firstcategoryId : res.items[0].id,
          classifyList: res.items,
        })
      }
    )
  }

  // 点击分类
  handleClick(firstcategoryId) {
    this.setState({firstcategoryId});
    Taro.setStorageSync('firstcategoryId', this.state.firstcategoryId);
  }

  // 点击图片跳转一级
  oneLevel(val,levelToUpperCase) {
    util.jumpUrl(`/pages/searchGoods/index?firstcategoryId=${val}&type=level`)
    Taro.setStorageSync('firstcategoryId', this.state.firstcategoryId);
    this.props.dispatch({
      type: 'searchGoods/currentPage',
      objKeys:'firstcategoryId',
      updateData:val,
      levelToUpperCase:pinyin.getCamelChars(levelToUpperCase).slice(0, 1).toUpperCase(),
      statePage:false,
      jumpPage:'btnData',
      history:false,
      showActionButton:false
    })
  }

  // 点击二级
  BtnTwoLevel(val) {
    util.jumpUrl(`/pages/searchGoods/index?secondCategoryId=${val}&type=level`)
    this.props.dispatch({
      type: 'searchGoods/currentPage',
      objKeys:'secondCategoryId',
      updateData:val,
      statePage:false,
      jumpPage:'btnData',
      firstLevelId:this.state.firstcategoryId,
      history:false,
      showActionButton:false
    })
  }

  // 点击三级
  BtnThreeLevel(val) {
    util.jumpUrl(`/pages/searchGoods/index?thirdCategoryId=${val}&type=level`)
    this.props.dispatch({
      type: 'searchGoods/currentPage',
      objKeys:'thirdCategoryId',
      updateData:val,
      jumpPage:'btnData',
      firstLevelId:this.state.firstcategoryId,
      statePage:false,
      history:false,
      showActionButton:false
    })
  }

  render() {
    const {classifyList, firstcategoryId} = this.state
    return (
      <View className='catetory-page'>
        <View className='goodsSearch'>
          <SearchHeader searchTypeTag='goodsSearch' />
        </View>
        <View className='catetory'>
          <ScrollView
            className='classify-box'
            scrollY
            enableBackToTop
            scrollIntoView={'L'+firstcategoryId}
          >
            {
              classifyList && classifyList.length > 0 && classifyList.map((item, idx) => (
                <View
                  key={idx}
                  onClick={this.handleClick.bind(this, item.id)}
                  id={idx>7?'L'+item.id:''}
                >
                  <classifyLeft
                    typeName={item.oneName}
                    typeId={item.id}
                    level={firstcategoryId == item.id ? true : false}
                  >
                  </classifyLeft>
                </View>
              ))
            }
          </ScrollView>
          <ScrollView
            className='catetory-right'
            scrollY
            enableBackToTop
          >
            {
              classifyList && classifyList.length > 0 && classifyList.map((item, idx) => (
                <View key={idx}>
                  {
                    firstcategoryId == item.id &&
                    <View>
                      <Image
                        className='category-img'
                        src={item.picUrl}
                        onClick={this.oneLevel.bind(this, item.id,item.oneName)}
                      >
                      </Image>
                      <twoLevel
                        twoLevelInfo={item.onTwoLevels}
                        oneName={item.oneName}
                        levelId={item.id}
                        onBtnTwoLevel={this.BtnTwoLevel}
                        onBtnThreeLevel={this.BtnThreeLevel}
                      >
                      </twoLevel>
                    </View>
                  }
                </View>
              ))
            }
          </ScrollView>
        </View>

      </View>
    )
  }
}
export default Index
