import Taro from "@tarojs/taro";
import util from '../util/index'

export default {
   getLocation(){
     if(Taro.getEnv()!=='WEB'){
       return new Promise((resolve)=>{
         Taro.getLocation({type: 'gcj02',altitude: true}).then(res=>{
           const {latitude, longitude} = res
           let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
           let x = longitude;
           let y = latitude;
           let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
           let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
           let lngs = z * Math.cos(theta) + 0.0065;
           let lats = z * Math.sin(theta) + 0.006;
           resolve({
             res: {longitude:lngs,latitude: lats}
           })
         }).catch(()=>{
           util.showToast('获取定位失败')
           resolve({res:false})
         })
       })

     }else {
       return new Promise(() =>{
         // TODO  H5 调用定位
       } )
     }
  }
}


