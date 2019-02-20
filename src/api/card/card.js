import ajax from '../ajax'
import url from '../url'

export default {
  list(param){
    return ajax.post({
      data:param,
      url:url.card.list
    })
  },
  info(param){
    return ajax.post({
      data:param,
      url:url.card.info
    })
  },
}
