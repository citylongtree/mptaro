import ajax from './ajax'
import url from './url'

export default {
  /**
   * 城市列表
   * */
  getCity(param) {
    return ajax.post({
      data: param,
      url: url.city.list
    })
  },
  /**
   * 门店首页
   * */
  shopDetail(param){
    return ajax.post({
      data: param,
      url: url.shop.detail
    })
  },
  /**
   * 门店优惠券列表
   * */
  shopCoupon(param){
    return ajax.post({
      data: param,
      url: url.coupon.list
    })
  },
  /**
   * 门店列表
   * */
  shopList(param){
    return ajax.post({
      data: param,
      url: url.shop.list
    })
  },
  /**
   * 优惠券
   * */
  receiveList(param){
    return ajax.noLoading({
      data:param,
      url:url.goods.receiveList
    })
  },
  /**
   * 优惠券
   * */
  shopShare(param){
    return ajax.noLoading({
      data:param,
      url:url.shop.shopShare
    },true)
  },
}
