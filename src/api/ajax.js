import Ajax from './request'

export default {
  /**
   * post 请求
   * @param {*}  url 和 data
   * @param {*} error 是否要自定义处理异常
   */
  post(opts,error) {
    let config = {
      method: 'post',
      payload: false,
      noLoading: false
    }
    return Ajax(opts,error,config)
  },
  /**
   * get 请求
   */
  get(opts,error){
    let config = {
      method: 'get',
      payload: false,
      noLoading: false
    }
    return Ajax(opts,error,config)
  },
   /**
   * JSON格式上传参数
   */
  payload(opts,error){
    let config = {
      method: 'post',
      payload: true,
      noLoading: false
    }
    return Ajax(opts,error,config)
  },
  /**
   * 不需要loading 动画
   */
  noLoading(opts,error){
    let config = {
      method: 'post',
      payload: false,
      noLoading: true
    }
    return Ajax(opts,error,config)
  }
}
