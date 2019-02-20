import Taro, {Component} from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import {View} from '@tarojs/components'
import HgInputNumber from '../numberInput/index'
import './goodsCnt.styl'

@connect(({ shopCar }) => ({
  goodsCnt:shopCar.goodsCnt
}))
class GoodsCnt extends Component {
      constructor(props) {
          super(props)
          this.state = {}
      }
     handleNumberChange(goodsCnt){
        this.props.dispatch({
          type:'shopCar/save',
          goodsCnt
        })
     }
    render() {
        const {goodsCnt} = this.props
        return (
            <View className='goods-cnt'>
              <HgInputNumber
                min={1}
                step={1}
                max={99999999999999999999999999999999999999}
                width={85}
                value={goodsCnt}
                onChange={this.handleNumberChange.bind(this)}
              />
            </View>
        )
    }
}
export default GoodsCnt
