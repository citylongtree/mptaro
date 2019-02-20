import Taro from '@tarojs/taro'
import api from './../../api/goods/shopCar'
import carCnt from '../../api/goods/detail'

export default {
  getCarList(){
    return new Promise(resolve => {
      api.getList().then(res=>{
        const list = res.items.map(shop => {
          shop.checked = false
          shop.sumPrice = 0
          shop.cartListGoods.map(item=>{
            item.selectSku  = item.skuValueList.filter(fil=>(fil.shopGoodsSkuId === item.shopGoodsSkuId))[0]
            item.checked = false
            item.isClose = false
          })
          return shop
        })
        resolve(list)
      })
    })
  },
  setShopCheck(list,shopId,value){
    list.map(item=>{
      if(item.shopId === shopId){
        item.cartListGoods.map(goods=>{
          goods.checked = value
        })
        item.checked = value
      }
    })
    return list
  },
  setGoodsCheck(list,cartId,value){
    list.map(item=>{
      item.cartListGoods.map(goods=>{
        if(goods.cartId === cartId){
          goods.checked = value
        }
      })
      item.checked = item.cartListGoods.filter(fil=>(fil.checked)).length === item.cartListGoods.length
    })
  },
  del(cartId){
    return new Promise(resolve => {
      api.delete(
        {
          cartIds:cartId,
          sessionId:Taro.getStorageSync('sessionId'),
          platform:'MINI'
        }
      ).then(()=>{
        return carCnt.totalCnt()
      }).then(res=>{
        resolve(res.data)
      })
    })
  },
  setCnt(list,goods,value){
    const {shopGoodsSkuId,cartId,skuValueCnt} = goods
    if(value <=skuValueCnt && value>=1){
      api.modify({
        sessionId:Taro.getStorageSync('sessionId'),
        platform:'MINI',
        shopGoodsSkuId,
        cnt:value,
        cartId
      })
    }
    list.map(item=>{
      item.cartListGoods.map(good=>{
        if(cartId === good.cartId){
          good.cnt = value
        }
      })
      return item
    })
  },
  getPayParam(list,id){
    const selectShop = list.filter(item=>(item.shopId === id))[0]
    const {shopId,shopName,sumPrice,sumCnt} = selectShop
    const goodsInfo = selectShop.cartListGoods.
    filter(item=>(item.checked)).
    map(item=>{
      const {cnt,goodsId,goodsPrice,goodsPicUrl,shopGoodsSkuId,specName,goodsName} = item
      return {
        goodsCnt:cnt,
        goodsId,
        picture:goodsPicUrl[0].detailUrl,
        price:goodsPrice,
        shopSkuId:shopGoodsSkuId,
        skuName:specName,
        title:goodsName
      }
    })
    if(goodsInfo.length === 0) {
      return false
    }else {
      return {
        shopId,
        shopName,
        goodsInfo,
        sumPrice,
        sumCnt
      }
    }
  }
}
