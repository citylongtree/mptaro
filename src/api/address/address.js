import ajax from '../ajax'
import url from '../url'

export default {
  findByParent(param){
    return ajax.noLoading({
      data:param,
      url:url.address.findByParent
    })
  },
  delete(param){
    return ajax.post({
      data:param,
      url:url.address.delete
    },true)
  },
  list(param){
    return ajax.post({
      data:param,
      url:url.address.list
    })
  },
  add(param){
    return ajax.post({
      data:param,
      url:url.address.add
    })
  },
  modify(param){
    return ajax.post({
      data:param,
      url:url.address.modify
    })
  },
}
