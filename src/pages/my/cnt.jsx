import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {util} from '../../utils'
import './cnt.styl'

export default class MyCnt extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        const {cnt} = this.props
        return (
            <View >
              {
                util.isLogin()&&cnt&&(
                  <View className='my-cnt'>
                    {
                      cnt < 10 ? cnt : '9+'
                    }
                  </View>
                )
              }
            </View>
        )
    }
}
