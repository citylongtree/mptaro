import ajax from '../ajax'
import url from '../url'

export default {
  list(param){
    return ajax.post({
      data:param,
      url:url.searchGoods.list
    })
  },
  add(param){
    return ajax.post({
      data:param,
      url:url.searchGoods.add
    })
  },
}
