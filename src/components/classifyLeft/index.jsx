import Taro, {Component} from '@tarojs/taro'
import {View, Image, Text,} from '@tarojs/components'
import {AtSearchBar} from 'taro-ui'
import './index.styl'
import api from '../../api/historySearch/historySearch'

export default class classify extends Component {

  config = {
    navigationBarTitleText: '搜索'
  }

  constructor(props) {
    super(props)
  }
  render() {
    const {typeName,level} = this.props
    return (
      <View className={level?'level1 classify-level' : 'classify-level'} >
        <View className='classify-style classify-style-color'></View>
        <View className='classify-font'>{typeName}</View>
      </View>
    )
  }
}
