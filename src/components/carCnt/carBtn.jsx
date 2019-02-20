import Taro, {Component} from '@tarojs/taro'
import {Image, View} from '@tarojs/components'
import {carList} from './../../imgs/index'
import {util} from '../../utils'
import './carBtn.styl'
import CarCnt from "./index";

export default class CarBtn extends Component {
    config = {
        navigationBarTitleText: '首页'
    }
    constructor(props) {
        super(props)
        this.state = {
          isLogin:util.isLogin(),
        }
    }
    componentDidShow(){
      this.setState({
        isLogin:util.isLogin()
      })
    }
    handleGoShopCar(){
      util.jumpUrl('/pages/carList/index')
    }
    render() {
        const {bottom} = this.props
        const {isLogin} = this.state
        return (
          <View className='carCnt' onClick={this.handleGoShopCar.bind(this)} style={{bottom:bottom ? bottom : ''}}>
            <Image src={carList.car} className='img' />
            {
              isLogin&&(
                  <CarCnt className='cnt' />
              )
            }
          </View>
        )
    }
}
