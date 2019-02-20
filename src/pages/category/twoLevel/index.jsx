import Taro, {Component} from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
import {connect} from "@tarojs/redux"
import './index.styl'
import {right} from './../../../imgs/index'
import {pinyin} from "../../../utils";

@connect(({searchGoods}) => ({
  ...searchGoods
}))

class Index extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {

  }
  // 点击二级
  twoLevel(val){
    const {oneName} = this.props
    this.props.onBtnTwoLevel(val)
    this.props.dispatch({
      type: 'searchGoods/currentPage',
      levelToUpperCase:oneName ? pinyin.getCamelChars(oneName).slice(0, 1).toUpperCase() : '',
      statePage:false,
      history:false,
      showActionButton:false
    })
  }

  // 点击三级
  threeLevel(val){
    const {oneName} = this.props
    this.props.onBtnThreeLevel(val)
    this.props.dispatch({
      type: 'searchGoods/currentPage',
      levelToUpperCase:oneName ? pinyin.getCamelChars(oneName).slice(0, 1).toUpperCase() : '',
      statePage:false,
      history:false,
      showActionButton:false
    })
  }

  render() {
    const {twoLevelInfo} = this.props
    return (
      <View className='two-level'>
        {
          twoLevelInfo && twoLevelInfo.length > 0 && twoLevelInfo.map((item) => (
            <View className='two-level-content'  key={item.id}>
              {item.onThreeLevels.length > 0 &&
              <View
                className='two-level-box'
              >
                <View className='two-level-top' onClick={this.twoLevel.bind(this,item.id)}>
                  <View>{item.twoName}</View>
                  <Image src={right} className='two-level-right'></Image>
                </View>
                <View className='two-level-bottom'>
                  {
                    item.onThreeLevels && item.onThreeLevels.length > 0 && item.onThreeLevels.map((ite, index) => (
                      <View
                        key={index}
                        className='three-level'
                        onClick={this.threeLevel.bind(this,ite.id)}
                      >
                        <View className='three-level-box'>
                          <Image src={ite.picUrl} className='three-level-img'></Image>
                        </View>
                        <View className='threeName text-ellipsis1'>{ite.threeName}</View>
                      </View>
                    ))
                  }
                </View>
              </View>
              }
            </View>
          ))
        }
      </View>
    )
  }
}
export default Index
