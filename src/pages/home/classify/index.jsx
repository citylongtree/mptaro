import Taro, {Component} from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
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


  render() {
    const { classifyList } = this.props
    return (
      <View className='classify flex-items'>
        {
          classifyList.map(item => (
            <View className='classify-box' key={item.typeId}>
              <Image src={item.typeImgUrl} className='classify-img' />
              <View className='classify-font'>{item.typeName}</View>
            </View>
          ))
        }
      </View>
    )
  }
}
