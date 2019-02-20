import ajax from '../ajax'
import url from '../url'

export default {
  list(param){
    return ajax.post({
      data:param,
      url:url. historySearch.list
    })
  },
  remove(param){
    return ajax.post({
      data:param,
      url:url. historySearch.remove
    })
  },
}
