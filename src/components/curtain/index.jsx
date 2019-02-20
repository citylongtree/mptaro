import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.styl'

export default class HgCurtain extends Component {
  constructor(props){
    super(props)
    this.state = {
      isShow:false,

    }
  }
  componentDidShow() {
    if(!Taro.getStorageSync('InTime')){
      Taro.setStorageSync('InTime','first')
    }else if(Taro.getStorageSync('InTime') === 'first'){
      Taro.setStorageSync('InTime','second')
    }else if(Taro.getStorageSync('InTime') === 'second'){
      this.setState({
        isShow:true
      })
      Taro.setStorageSync('InTime','Never')
    }
  }
  setClose(){
    this.setState({
      isShow:false
    })
  }
  render () {
    const {isShow} = this.state
    return (
      <View>
        {
          isShow&&<View className='hg-curtain' onClick={this.setClose.bind(this)}>
            <Image className='hg-curtain-img' src='https://www.hanguda.com/mnt/tosend/mp/mpIndex.png' />
          </View>
        }
      </View>
    )
  }
}
