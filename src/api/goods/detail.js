import ajax from '../ajax'
import url from '../url'

export default {
  detail(param){
    return ajax.post({
      data:param,
      url:url.goods.detail
    })
  },
  catchDetail(param){
    return ajax.post({
      data:param,
      url:url.goods.detail
    },true)
  },
  receiveList(param){
    return ajax.noLoading({
      data:param,
      url:url.goods.receiveList
    })
  },
  contactMember(param){
    return ajax.noLoading({
      data:param,
      url:url.goods.contactMember
    })
  },
  add(param){
    return ajax.post({
      data:param,
      url:url.goods.add
    },true)
  },
  receive(param){
    return ajax.post({
      data:param,
      url:url.goods.receive
    })
  },
  modify(param){
    return ajax.post({
      data:param,
      url:url.goods.modify
    },true)
  },
  totalCnt(param){
    return ajax.noLoading({
      data:param,
      url:url.goods.totalCnt
    })
  }
}
