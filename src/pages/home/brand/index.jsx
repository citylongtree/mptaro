import Taro, {Component} from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
import './index.styl'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  constructor(props) {
    super(props)
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


  render() {
    const { brandList } = this.props
    return (
      <View className='brand flex-items'>
        {
          brandList.map(item=>(
              <Image  key={item.brandId} src={item.picUrl} className='brand-img' />
          ))
        }
      </View>
    )
  }
}
