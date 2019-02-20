import ajax from '../ajax'
import url from '../url'

export default {
  pickUpType(param){
    return ajax.payload({
      data:param,
      url:url.shopCar.pickUpType
    })
  },
  getList(param){
    return ajax.post({
      data:param,
      url:url.shopCar.getList
    })
  },
  delete(param){
    return ajax.noLoading({
      data:param,
      url:url.shopCar.delete
    })
  },
  modify(param){
    return ajax.noLoading(
      {
        data:param,
        url:url.goods.modify
      }
    )
  },
  recommended(param){
    return ajax.noLoading(
      {
        data:param,
        url:url.shopCar.recommended
      }
    )
  }
}
