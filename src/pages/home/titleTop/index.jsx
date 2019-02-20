import Taro, {Component} from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'
import {focusClick, focusRight, focusleft} from './../../../imgs/index'
import './index.styl'

export default class classify extends Component {

  constructor(props) {
    super(props)
    // this.state = {
    //   list: []
    // }
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  titleClick() {
    this.props.onTitleClick()
  }

  render() {
    const {title,hideRight} = this.props
    return (
      <View className='title-top flex-items'  onClick={this.titleClick}>
        <View className='title-box'>
          <Image src={focusleft} className='title-img' />
          <Text className='title-font'> {title} </Text>
          <Image src={focusRight} className='title-img' />
        </View>
        <View className={['title-box-right',hideRight ? 'hidden' : '']}>
          <Text className='title-fontS'>更多</Text>
          <Image src={focusClick} className='title-imgS' />
        </View>
      </View>
    )
  }
}
