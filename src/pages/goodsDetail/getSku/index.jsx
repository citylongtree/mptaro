import Taro, {Component} from '@tarojs/taro'
import {connect} from "@tarojs/redux";
import {Text, View} from '@tarojs/components'
import {AtIcon} from "taro-ui";

@connect(({ shopCar }) => ({
  selectSku:shopCar.selectSku,
  skuValueList:shopCar.goodsDetail.skuValueList
}))
class GetSku extends Component {
  static options = {
    addGlobalClass: true
  }
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  handleShowShopCar(){
    this.props.dispatch({
      type:'shopCar/save',
      isShowPop:true,
      from:'sku'
    })
  }
  render() {
    const {selectSku,skuValueList} = this.props
    return (
      <View>
        {
          skuValueList.length>1&&(
            <View className='goods-handle-choose clear' onClick={this.handleShowShopCar.bind(this)}>
            {
              selectSku.supSkuValue ? (<Text>已选： {selectSku.supSkuValue}</Text>):(<Text>请选择规格</Text>)
            }
            <AtIcon value='chevron-right' color='#A1A1A1' className='icon' />
          </View>
          )
        }
      </View>
    )
  }
}
export default GetSku
