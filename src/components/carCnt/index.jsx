import Taro, {Component} from '@tarojs/taro'
import {connect} from "@tarojs/redux";
import {Text,View} from '@tarojs/components'
import {util} from '../../utils'
import './index.styl'

@connect(({shopCar}) => ({
  carCnt:shopCar.carCnt
}))

class CarCnt extends Component {
    static options = {
      addGlobalClass: true
    }
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    getCarCnt(){
      const {carCnt} = this.props
      if(util.isLogin()&&!util.isNotNullString(carCnt)){
        this.props.dispatch({
          type:'shopCar/getCarCnt',
        }).then(()=>{
          this.getCarCnt()
        })
      }
    }
    componentDidShow() {
      if(util.isLogin()){
        this.props.dispatch({
          type:'shopCar/getCarCnt',
        }).then(()=>{
          this.getCarCnt()
        })
      }
    }
    render() {
      const {carCnt,className} = this.props
        return (
          <View className={className} hidden={!carCnt}>
            <Text>
              {carCnt < 10 ? carCnt : '9+'}
            </Text>
          </View>
        )
    }
}
export default CarCnt
