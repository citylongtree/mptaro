import Taro, {Component} from '@tarojs/taro'
import {View, WebView} from '@tarojs/components'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  constructor(props) {
    super(props)
    this.state={
      turnUrl:''
    }
  }

  componentWillMount() {
    this.setState({
      turnUrl:this.$router.params.turnUrl
    })
  }
  render() {
    const {turnUrl} = this.state
    return (
        <WebView src={turnUrl}></WebView>
    )
  }
}
