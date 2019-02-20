import Taro, {Component} from '@tarojs/taro'
import {Image} from '@tarojs/components'
import './index.styl'

export default class HgImg extends Component {
    static options = {
      addGlobalClass: true
    }
    constructor(props) {
        super(props)
        this.state = {
          url: ''
        }
    }
    componentWillReceiveProps(nextProps){
      if(this.state.url){return}
      this.setState({
        url:nextProps.src
      })
    }
    Load(){
      this.setState({
        url:'https://m.hanguda.com/img/headPic.png'
      })
    }
    render() {
        const {src,className,cusStyle} = this.props
        const {url} = this.state
        return (
            <Image
              src={url || src || 'https://m.hanguda.com/img/headPic.png'}
              className={className}
              onError={this.Load.bind(this)}
              mode='aspectFit'
              style={cusStyle}
            />
        )
    }
}
