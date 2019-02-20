import ajax from '../ajax'
import url from '../url'

export default {
  focusPic(param){
    return ajax.post({
      data:param,
      url:url.home.focusPic
    })
  },
  level(param){
    return ajax.post({
      data:param,
      url:url.home.level
    })
  },
  brand(param){
    return ajax.post({
      data:param,
      url:url.home.brand
    })
  },
  recommend(param){
    return ajax.post({
      data:param,
      url:url.home.recommend
    })
  },
  brandHome(param){
    return ajax.post({
      data:param,
      url:url.home.brandHome
    })
  }
}
