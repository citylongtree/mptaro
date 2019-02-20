import ajax from '../ajax'
import url from '../url'

export default {
  list(param){
    return ajax.post({
      data:param,
      url:url.searchGoods.list
    })
  },
  allLevel(param){
    return ajax.post({
      data:param,
      url:url.searchGoods.allLevel
    })
  },
  linkLevel(param){
    return ajax.post({
      data:param,
      url:url.searchGoods.linkLevel
    })
  },
}
