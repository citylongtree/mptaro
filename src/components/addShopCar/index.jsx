import Taro, {Component} from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import {View, Image, Text, ScrollView} from '@tarojs/components'
import HgdPop from  './../pop/index'
import GoodsCnt from "./goodsCnt";
import './index.styl'

@connect(({ shopCar }) => ({
  ...shopCar
}))
class AddShopCar extends Component {
    static options = {
      addGlobalClass: true
    }
    constructor (props) {
      super(props)
      this.state = {
      }
    }
    componentWillMount() {
      this.props.dispatch({
        type:'shopCar/reset'
      })
    }
    handleClose(){
      this.props.dispatch({
        type:'shopCar/save',
        isShowPop:false
      })
    }
    handleSkuSelect(item){
      this.props.dispatch({
        type:'shopCar/save',
        selectSku:item
      })
    }
    handleAddToShopCar(){
      this.props.dispatch({
        type:'shopCar/addToShop'
      })
    }
    handleBuy(){
      this.props.dispatch({
        type:'shopCar/buy',
      })
    }
    handleEdit(){
      this.props.dispatch({
        type:'shopCar/edit',
      }).then(()=>{
        this.props.onEditSuccess(this.props.editSuccess)
      })
    }
    render() {
        const {goodsDetail,selectSku,isShowPop,from} = this.props
        return (
            <View className='addShopCar'>
              <HgdPop
                isOpened={isShowPop}
                title='这是个标题'
                onClose={this.handleClose.bind(this)}
              >
                <View className='content'>
                  <View className='top-info'>
                    <View className='top-info-img'>
                      <Image src={selectSku.skuGoodsPicUrl || goodsDetail.goodsPicUrl[0].detailUrl} className='top-info-img-url' />
                    </View>
                    <View className='top-info-pName'>
                      <View className='name'>
                        {selectSku.supSkuValue ? (<Text>已选： {selectSku.supSkuValue}</Text>):(<Text>请选择规格</Text>)}
                      </View>
                      {
                        selectSku.price ? (<View  className='price'>
                          <Text>
                            ￥{selectSku.price}
                          </Text>
                        </View>):(
                          <View  className='price'>
                            {
                              goodsDetail.minPrice === goodsDetail.maxPrice ? (
                                <Text>
                                  ￥{goodsDetail.minPrice || goodsDetail.maxPrice || goodsDetail.equalPrice}
                                </Text>
                              ):(
                                <Text>
                                  ￥{goodsDetail.minPrice}-￥{goodsDetail.maxPrice}
                                </Text>
                              )
                            }
                          </View>
                        )
                      }
                    </View>
                  </View>
                  <View className='sku-title'>
                    规格
                  </View>
                  <View className='sku-list'>
                    <ScrollView className='sku-list-scroll-view' scrollY>
                      {
                        goodsDetail.skuValueList.map(item=>(
                          <View className={['sku-list-item',item.shopGoodsSkuId === selectSku.shopGoodsSkuId ? 'active' : '']} key={item.shopGoodsSkuId} onClick={this.handleSkuSelect.bind(this,item)}>{item.supSkuValue}</View>
                        ))
                      }
                    </ScrollView>
                  </View>
                  <View className='goodCnt clear'>
                    <Text className='goodCnt-text'>购买数量</Text>
                    <View className='cnt fr'>
                      <GoodsCnt />
                    </View>
                  </View>
                  <View className='btn'>
                    {
                      from === 'add' &&(<View className='btn-sure' onClick={this.handleAddToShopCar.bind(this)} >确定</View>)
                    }
                    {
                      from === 'buy'&&(<View className='btn-sure' onClick={this.handleBuy.bind(this)} >确定</View>)
                    }
                    {
                      from === 'edit'&&(<View className='btn-sure' onClick={this.handleEdit.bind(this)} >确定</View>)
                    }
                    {
                      from ==='sku'&&(
                      <View className='btn-group'>
                        <View className='add' onClick={this.handleAddToShopCar.bind(this)}>加入购物车</View>
                        <View className='buy' onClick={this.handleBuy.bind(this)} >立即购买</View>
                      </View>)
                    }
                  </View>
                </View>
              </HgdPop>
            </View>
        )
    }
}
export default AddShopCar
