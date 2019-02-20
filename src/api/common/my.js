import ajax from '../ajax'
import url from '../url'

export default {
    idx(){
      return ajax.post({
        url:url.my.idx
      })
    },
    totalCnt(){
        return ajax.noLoading({
          url: '/api/v4/cart/appMember/totalCnt'
        })
    }
}
