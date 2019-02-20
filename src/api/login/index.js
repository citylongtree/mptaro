import ajax from '../ajax'
import url from '../url'

export default {
  login(param){
    return ajax.post({
      data: param,
      url: url.login.login
    })
  },
  getSms(param){
    return ajax.post({
      data: param,
      url: url.login.getSms
    })
  }
}
