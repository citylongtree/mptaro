import ajax from '../ajax'
import url from '../url'

export default {
  /**
   *  获取运费
   */
  getFreight(param){
    return ajax.payload({
      data: param,
      url: url.writeOrder.freight
    })
  },
  /**
   *  下单
   */
  save(param){
    return ajax.payload({
      data: param,
      url: url.writeOrder.save
    })
  },
  /**
   *  预支付
   */
  pre(param){
    return ajax.post({
      data: param,
      url: url.order.pre
    })
  },
  /**
   *  获取收货地址或联系人
   */
  getAddress(param){
    return ajax.post({
      data: param,
      url: url.writeOrder.address
    })
  },
  /**
   *  获取优惠券红包
   */
  getCoupon(param){
    return ajax.post({
      data: param,
      url: url.writeOrder.coupon
    })
  },
  /**
   *  获取实付款金额
   */
  getPayMoney(param){
    return ajax.payload({
      data: param,
      url: url.writeOrder.getPayMoney
    })
  },
}
