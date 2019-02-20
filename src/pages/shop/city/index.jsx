import Taro, { Component } from '@tarojs/taro'
import { View, Button, ScrollView, Text } from '@tarojs/components'
import { AtList, AtListItem, AtSearchBar, AtIcon  } from "taro-ui"
import {connect} from "@tarojs/redux"
import Letter from "../../../components/letterSlider/index"
import noList from '../../../components/noList/index'
import './index.styl'
import api from '../../../api/shop'

let time = null
@connect(() => ({}))
class Index extends Component {
  config = {
    navigationBarTitleText: '城市选择',
    enablePullDownRefresh: false
  }
  constructor(props){
    super(props)
    this.state = {
      cityList: [],
      value: '',
      positionTag: '',
      letterActive: '',
      searchShow: false,
      searchList: [],
      historyList: [],
      letterList: []
    }
  }
  componentWillMount () {
    // this.getCityList()
  }

  componentDidMount () {
  }

  componentWillUnmount () { }

  componentDidShow () {
    this.getCityList()
  }

  componentDidHide () { }
  // 获取城市列表
  getCityList(){
    let that = this
    Taro.getLocation({
      type: 'wgs84',
      success (res) {
        const location = res.longitude+','+res.latitude
        api.getCity({location: location}).then(data => {
          const historyList = data.data.history || []
          for (var item in data.data) {
            if(item === 'history' || data.data[item].length === 0){
              delete data.data[item]
            }
          }
          let letterList = Object.keys(data.data)
          that.setState({
            positionTag: false,
            cityList: data.data,
            historyList,
            letterList
          })
        })
      },
      fail(){
        that.setState({
          positionTag: true
        })
      }
    })
  }

  scrollCityList = () => {
      // 列表滚动
  }
  // 点击字母
  getLetter = (val) =>{
    this.setState({
      letterActive: val
    })
  }
  // 搜索输入
  onChange(value){
    value = value.trim()
    clearTimeout(time)
    this.setState({
      value: value
    })
    time = setTimeout(() => {
      if (this.state.value!='') {
        this.Search()
      }else {
        this.setState({
          searchShow: false
        })
      }
    }, 500)
  }
  // 搜索
  Search() {
    const {value} = this.state
    api.getCity({name: value, group: false, }).then(res => {
      this.setState({
        searchShow: true,
        searchList: res.data.regions
      })
    })
  }
  onActionClick(){
    this.setState({
      searchShow: false,
      value: ''
    })
  }

  cityClick(val){
    this.props.dispatch({
      type: 'shopList/selectCity',
      cityCode: val.code
    })
    Taro.switchTab({
      url: '/pages/shop/list/index'
    })
  }

  render () {
    const { cityList, historyList,letterList } = this.state
    const watchingCity = this.$router.params.cityName
    return (
      <View>
        <View hidden={!this.state.positionTag}>
          <Button openType='openSetting'>授权位置</Button>
        </View>
        <View className='city-main'  hidden={this.state.positionTag}>
            <AtSearchBar
              className='search'
              actionName='取消'
              value={this.state.value}
              onChange={this.onChange.bind(this)}
              onActionClick={this.onActionClick.bind(this)}
              onConfirm={this.Search}
              placeholder='请输入城市名称'
            >
            </AtSearchBar>
            <View className='searchList' hidden={!this.state.searchShow}>
              {this.state.searchList && this.state.searchList.length > 0 && <AtList>
                {
                  this.state.searchList.map((items, index) => (
                    <AtListItem key={index} title={items.name} onClick={this.cityClick.bind(this, items)} />
                  ))
                }

              </AtList>}
              {
                !this.state.searchList || this.state.searchList.length === 0 && <noList errPage='暂无相关内容' image='noOrder' />
              }
            </View>
            <ScrollView
              hidden={this.state.searchShow}
              className='scroll'
              scrollY
              scrollTop='0'
              scrollIntoView={this.state.letterActive}
              enableBackToTop
              onScroll={this.scrollCityList}
            >
              <View className='city-history' id='city'>
                <View className='watchingCity'>
                  <Text>您正在看：{watchingCity || '杭州'}</Text>
                </View>
                {
                  historyList && historyList.length > 0 && <View className='historyCity' >
                  <Text className='historyCity-title'>定位/最近访问</Text>
                  <View className='historyCity-list'>
                    {historyList.map((hisItem, index)=> (
                      <View className='hisCityItem' key={index} onClick={this.cityClick.bind(this, hisItem)}>
                        {
                          index===0 &&
                          <AtIcon
                            value='map-pin'
                            size='15'
                            color='#E56D17'
                          >
                          </AtIcon>
                        }
                        {' '+hisItem.name}
                      </View>
                    ))}
                  </View>
                </View>
                }
              </View>
              {cityList.map((items, key) => (
                key!= 'history' && items.length > 0 && <View id={key}><AtList>
                  <View className={'letter-top '+'letter'+key} key={key} >{key}</View>
                  {items.map((cityItem, index) => (
                    <AtListItem
                      key={index}
                      title={cityItem.name}
                      onClick={this.cityClick.bind(this, cityItem)}
                    >
                    </AtListItem>
                  ))}
                </AtList>
                </View>
              ))}
              <Letter
                onPutLetter={this.getLetter}
                title='区县定位'
                color='#E56D17'
                letterList={letterList}
              >
              </Letter>
            </ScrollView>
        </View>
      </View>
    )
  }
}
export default Index
