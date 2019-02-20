import Taro, {Component} from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
import {carList} from './../../imgs'
import './index.styl'

export default class HgRadio extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    handleChange(){
      this.props.onChange(!this.props.value)
    }

    render() {
        const {value} = this.props
        return (
            <View className='hg-radio' onClick={this.handleChange.bind(this)}>

              {
                value ?(<Image src={carList.check} className='img' />) :( <View className='radio' />)
              }
            </View>
        )
    }
}
