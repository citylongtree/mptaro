/**
 * ajax封装
 */
import Taro from '@tarojs/taro'

const baseUrl = Taro.getEnv() === 'WEB' ? '' : 'https://api.hanguda.com'
// const baseUrl = Taro.getEnv() === 'WEB' ? '' : 'http://pmobile.hanguda.com'
// const baseUrl = Taro.getEnv() === 'WEB' ? '' : 'http://tweixin.hanguda.com'
//const baseUrl = Taro.getEnv() === 'WEB' ? '' : 'http://192.168.1.174:9090'
// const baseUrl = Taro.getEnv() === 'WEB' ? '' : 'http://192.168.1.130:9090'
let options = {
  title:'加载中'
}
export default function Ajax(opts,error,config) {
  const {data, url} = opts
  if(!config.noLoading){
    Taro.showLoading(options)
  }
  return new Promise((resolve, reject)=>{
    Taro.request({
      url: baseUrl + url,
      method: config.method || 'post',
      data: data,
      header:{
        sessionId: Taro.getStorageSync('sessionId'),
        platform: 'MINI',
        'Content-Type': config.payload ? 'application/json; charset=utf-8' : 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(req=>{
      const res = req.data
      if(res.success === true){
        resolve(res)
      } else if(res.code === '1001'){
        Taro.navigateTo({
          url: '/pages/login/index',
        })
      } else if(res.code === '1003'){
        Taro.showModal({
          // title: '温馨提示',
          content: res.message,
          showCancel: false,
          success:()=>{
            Taro.navigateTo({
              url: '/pages/login/index',
            })
          }
        })
      }else if(error){
        reject(res)
      }else {
        Taro.showModal({
          // title: '温馨提示',
          content: res.message,
          showCancel: false
        })
      }
      if(!config.noLoading){
        Taro.hideLoading()
      }
    }).catch(()=>{
      if(!config.noLoading){
        Taro.hideLoading()
      }
    })
  })
}
