import Taro, {Component} from '@tarojs/taro'
import {View, Image, Text, ScrollView} from '@tarojs/components'
import {connect} from "@tarojs/redux"
import {AtIcon} from "taro-ui"
import {drop, drop1} from "../../../imgs/index";
import './index.styl'
import api from './../../../api/catetory/catetory'
import sortArr from "../../../utils/sortArr"
import Letter from "../../../components/letterSlider/index"

@connect(({searchGoods}) => ({
  ...searchGoods
}))

class TabClassify extends Component {
  constructor(props) {
    super(props)
    this.state = {
      List: [
        {
          title: '默认排序',
          state: 'distance'
        },
        {
          title: '销量最高',
          state: 'sale'
        },
        {
          title: '价格从低到高',
          state: 'minprice'
        },
        {
          title: '价格从高到低',
          state: 'maxprice'
        },
      ],
      // 分类左侧， 右侧
      classifyOneList: [],
      classifyRight: [],
      // 一级分类选中
      // 当前选中的Tab 分类|| 品牌||排序
      TabActive: '',
      // 字母
      letterList: [],
      // 品牌
      brandList: [],
      // 字母点击
      letterActive: '',
      levelActive: '',
      showClassNoneTag: false,
      showBrandNoneTag: false
    }
  }

  componentWillMount() {
    const { brandToUpperCase, levelToUpperCase} = this.props
    this.setState({
      letterActive: brandToUpperCase,
      levelActive: 'L'+levelToUpperCase
    })
  }

  getClassify(params,tab) {
    const { firstcategoryId } = this.props.searchGoods
    const param = params === null ? null : params
    api.linkLevel(param).then(res => {
      if(tab==='brand'){
        if (res.data.unSellHot && res.data.unSellHot.length > 0 && res.data.sellHot && res.data.sellHot.length > 0) {
          let unSellHot = res.data.unSellHot
          let obj = sortArr.sortArr(unSellHot)
          let data = {
            title: '热销',
            items: res.data.sellHot
          }
          obj.brandList.unshift(data)
          obj.letterList.unshift('热销')
          this.setState({
            letterList: obj.letterList,
            brandList: obj.brandList,

            showBrandNoneTag: false
          })
        }else if(res.data.unSellHot && res.data.unSellHot.length > 0){
          let unSellHot = res.data.unSellHot
          let obj = sortArr.sortArr(unSellHot)
          this.setState({
            letterList: obj.letterList.length>1?obj.letterList:[],
            brandList: obj.brandList,
            showBrandNoneTag: false
          })
        }else if(res.data.sellHot && res.data.sellHot.length > 0){
          let brandList = []
          let data = {
            title: '热销',
            items: res.data.sellHot
          }
          brandList.unshift(data)
          this.setState({
            letterList: [],
            brandList: brandList,
            showBrandNoneTag: false
          })
        }else {
          this.setState({
            letterList: [],
            brandList: [],
            showBrandNoneTag: true
          })
        }
      }else {
        // 分类数据
        if (res.data.levels && res.data.levels.length > 0) {
          res.data.levels.forEach(items => {
            items.threeList = []
            if (items.onTwoLevels && items.onTwoLevels.length > 0) {
              items.onTwoLevels.forEach(item => {
                items.threeList = items.threeList.concat(item.onThreeLevels)
              })
            } else {
              items.onTwoLevels = []
            }
          })
          if (firstcategoryId === null || firstcategoryId === undefined || firstcategoryId === '') {
              this.props.dispatch({
                type: 'searchGoods/currentPage',
                objKeys: 'firstcategoryId',
                updateData: '',
                statePage: false,
                showActionButton:false
              })
              this.setState({
                classifyOneList: res.data.levels,
                showClassNoneTag: true
              }, () => {
                this.showThreeClassify(res.data.levels[0].id, 'none','defaultLevel')
              })
          } else {
            this.setState({
              classifyOneList: res.data.levels,
              showClassNoneTag: true
            }, () => {
              this.showThreeClassify(firstcategoryId, 'none','')
            })
          }
        }else {
          this.setState({
            classifyOneList: [],
            showClassNoneTag: true
          })
        }
      }
    })
  }

  componentDidShow() {

  }

  clickTab(tab) {
    const {TabActive} = this.state
    const { thirdCategoryId, firstcategoryId,secondCategoryId} = this.props.searchGoods
    let { brandId } = this.props.searchGoods
    if (TabActive === tab) {
      this.setState({
        TabActive: ''
      })
      this.props.onScrollTag(true)
    } else if (tab === 'classify') {
      if(brandId===undefined||brandId ===null){
        brandId = ''
      }
      this.getClassify({brandId: brandId},tab)
      this.setState({
        TabActive: tab
      })
      this.props.onScrollTag(false)
    } else if (tab === 'brand') {
      let level = ''
      if (thirdCategoryId !== '') {
        level = thirdCategoryId
      } else if (secondCategoryId !== '') {
        level = secondCategoryId
      }else if (firstcategoryId !== '') {
        level = firstcategoryId
      }
      if(level === undefined || level === null){
        level = ''
      }
      this.getClassify({level: level},tab)
      this.setState({
        TabActive: tab
      })
      this.props.onScrollTag(false)
    } else {
      this.props.onScrollTag(false)
      this.setState({
        TabActive: tab
      })
    }
  }

  // 显示三级分类
  showThreeClassify = (id, click, defaultLevel, e) => {
    if (click === 'click') {
      e.stopPropagation()
    }
    const {classifyOneList} = this.state
    classifyOneList.forEach(item => {
      if (item.id == id ) {
        if(defaultLevel !== 'defaultLevel'){
          this.props.dispatch({
            type: 'searchGoods/currentPage',
            objKeys: 'firstcategoryId',
            updateData: id,
            statePage: false,
            showActionButton:false
          })
        }
        this.setState({
          levelActive: 'L'+id,
          classifyRight: item.threeList
        })
      }
    })
  }

  // 排序点击
  clickSort(sortVal) {
    this.setState({
      TabActive: ''
    })
    this.props.dispatch({
      type: 'searchGoods/currentPage',
      objKeys: 'sort',
      updateData: sortVal,
      statePage: true,
      showActionButton:false
    })
    this.props.onScrollTag(true)
  }

  // 三级分类选中
  clickThreeClassify(id, e) {
    e.stopPropagation()
    this.setState({
      TabActive: ''
    })
    this.props.dispatch({
      type: 'searchGoods/currentPage',
      objKeys: 'thirdCategoryId',
      updateData: id,
      secondCategoryId:true,
      statePage: true,
      showActionButton:false
    })
    this.props.onScrollTag(true)
  }

  btnBrand(id, e) {
    e.stopPropagation()
    this.setState({
      TabActive: ''
    })
    this.props.dispatch({
      type: 'searchGoods/currentPage',
      objKeys: 'brandId',
      updateData: id,
      secondCategoryId:true,
      statePage: true,
      showActionButton:false
    })
    this.props.onScrollTag(true)
  }

  hideAlert(e) {
    this.setState({
      TabActive: ''
    })
    this.props.onScrollTag(true)
    e.preventDefault()
  }

  // 点击字母
  getLetter = (val) => {
    this.setState({
      letterActive: val==='热销'?'hot':val
    })
  }

  render() {
    const {List, classifyOneList, TabActive, classifyRight,  brandList, letterList, letterActive,  showClassNoneTag, showBrandNoneTag,levelActive} = this.state
    const {firstcategoryId, sort, thirdCategoryId, brandId} = this.props.searchGoods
    return (
      <View className='TabClassify'>
        <View className='classify tabItem' onClick={this.clickTab.bind(this, 'classify')}>
          <Text style={TabActive === 'classify' ? 'color: #FF872E' : ''}>分类&nbsp;</Text>
          <Image className='tabItem-icon' src={TabActive === 'classify' ? drop1 : drop} />
        </View>
        <View className='brand tabItem' onClick={this.clickTab.bind(this, 'brand')}>
          <Text style={TabActive === 'brand' ? 'color: #FF872E' : ''}>品牌&nbsp;</Text>
          <Image className='tabItem-icon' src={TabActive === 'brand' ? drop1 : drop} />
        </View>
        <View className='sort tabItem' onClick={this.clickTab.bind(this, 'sort')}>
          <Text style={TabActive === 'sort' ? 'color: #FF872E' : ''}>排序&nbsp;</Text>
          <Image className='tabItem-icon' src={TabActive === 'sort' ? drop1 : drop} />
        </View>
        {
          TabActive !== '' &&
          <View className='tabClass-box' onClick={this.hideAlert}>
            {/*------------------------------------------显示分类--------------------------------------*/}
            {
              TabActive === 'classify' &&
              <View className='alert-content classify-content'>
                {classifyOneList && classifyOneList.length > 0 && <ScrollView className='classify-left' scrollY enableBackToTop scrollIntoView={levelActive} >
                  {
                    classifyOneList.map((classifyItem, index) => (
                      <View key={index} id={index>7?'L'+classifyItem.id :''} className={firstcategoryId == classifyItem.id ? 'classify-left-item classify-left-active' : 'classify-left-item'} onClick={this.showThreeClassify.bind(this, classifyItem.id, 'click','')}>{classifyItem.oneName}</View>
                    ))
                  }
                </ScrollView>}
                {classifyRight && classifyRight.length > 0 && <ScrollView scrollY enableBackToTop className='classify-right' onClick={this.hideAlert}>
                  {
                    classifyRight.map((rightItem, index) => (
                      <Text style={thirdCategoryId === rightItem.id ? 'color: #FF872E' : ''} className='classify-right-item text-ellipsis1' key={index} onClick={this.clickThreeClassify.bind(this, rightItem.id)}>{rightItem.threeName}</Text>
                    ))
                  }
                </ScrollView>}
                {!classifyOneList || classifyOneList.length < 1 && showClassNoneTag &&
                <View onClick={this.hideAlert} className='modalShow'>/(ㄒoㄒ)/~~暂无数据~~</View>}
              </View>
            }
            {/*--------------------------显示品牌-------------------------*/}
            {
              TabActive === 'brand' &&
              <View className='alert-content brand-content'>
                {brandList.length === 0 && showBrandNoneTag && <View onClick={this.hideAlert} className='modalShow'>/(ㄒoㄒ)/~~暂无品牌~~</View>}
                {
                  brandList.length > 0 &&
                  <View>
                    <ScrollView
                      className='brand-list-content'
                      scrollY
                      enableBackToTop
                      scrollIntoView={letterActive}
                    >
                      {
                        brandList.map(ite => (
                          <View key={ite.title} className='brand-list-box1'>
                            {
                              ite.items && ite.items.length > 0 && ite.items.map((item,index) => (
                                <View
                                  className='brand-list-box'
                                  id={ite.title==='热销'?'hot':ite.title}
                                  key={item.brandId}
                                  onClick={this.btnBrand.bind(this, item.brandId)}
                                >
                                  <Text className='brand-list-left'>{index==0 ? ite.title : ''}</Text>
                                  <View className='brand-list-imgbox'>
                                    <Image src={item.picUrl} className='brand-list-img' />
                                  </View>
                                  <Text style={brandId == item.brandId ? 'color: #FF872E' : ''}>{item.brandName}</Text>
                                </View>
                              ))
                            }
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
                }
              </View>
            }
            {/*------------------显示排序---------------------*/}
            {
              TabActive === 'sort' &&
              <View className='alert-content sort-content'>
                {
                  List.map((sortItem, index) => (
                    <View key={index} className={index !== 0 ? 'sort-Item line' : 'sort-Item'} onClick={this.clickSort.bind(this, sortItem.state)}>
                      <Text>{sortItem.title}</Text>
                      {sort === sortItem.state && <AtIcon value='check' size='18' color='#FF7200'></AtIcon>}
                    </View>
                  ))
                }
              </View>
            }
          </View>
        }
      </View>
    )
  }
}
TabClassify.defaultProps={
  firstcategoryId: ''
}

export default TabClassify
