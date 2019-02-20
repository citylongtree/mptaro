import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.styl'

let t = null
export default class letter extends Component {
  constructor(props){
    super(props)
    this.state = { tipsName: '', tipsTag: true}
  }
  letterClick = (val,e) => {
    e.stopPropagation()
    clearTimeout(t)
    this.setState({
      tipsName: val!=='city'?val:'',
      tipsTag: val==='city',
    })
    t = setTimeout(() => {
      if(val!=='city'){
        this.setState({
          tipsTag: true,
        })
      }
    }, 1500)
    this.props.onPutLetter(val)
  }
  render () {
    const { title, letterList, color } = this.props
    return (
      <View className='letter-slider' style={'color:'+color}>
        {title && <Text onClick={this.letterClick.bind(this, 'city')}>{title}</Text>}
        {letterList.map((item) => (
          item!= 'history' &&<Text key={item} onClick={this.letterClick.bind(this, item)}>{item}</Text>
        ))}
        <View hidden={this.state.tipsTag} className='center-tips'>{this.state.tipsName}</View>
      </View>
    )
  }
}
