import ajax from '../ajax'
import url from '../url'

export default {
  /**
   * 商品列表的 分类及品牌
   * */
  shopClassify(param){
    return ajax.post({
      data: param,
      url: url.shop.classify
    })
  },
  /**
   * 商品列表
   */
  shopGoodsList(param){
    return ajax.post({
      data: param,
      url: url.searchGoods.shopGoodsList
    })
  },
  /**
   * 搜索商品列表
   */
  shopSearchGoodsList(param){
    return ajax.post({
      data: param,
      url: url.searchGoods.list
    })
  },
  /**
   * 购物车数量
   */
  getCarCnt(param){
    return ajax.noLoading({
      data: param,
      url: url.goods.totalCnt
    })
  },
  /**
   * 购物车数量
   */
  addHistory(param){
    return ajax.noLoading({
      data: param,
      url: url.shop.addHistory
    })
  }

}
