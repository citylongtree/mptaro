import api from './../../api/goods/shopCar'
import {util} from './../../utils/index'

export default {
  namespace:'carList',
  state:{
    goodsInfo:'',
    pickUpType:[],
    shopId:'',
    shopName:'',
    sumPrice:0,
    sumCnt:0,
  },
  effects:{
    *getBuy(_, {put, call}){
      const {goodsInfo,shopId,shopName,sumPrice,sumCnt} = _
      const {items}= yield call(api.pickUpType,{items:[{shopId}]})
      yield put({
        type:'save',
        goodsInfo:[goodsInfo],
        pickUpType:items[0].pickUpList,
        shopId,
        shopName,
        sumPrice,
        sumCnt
      })
      util.jumpUrl('/pages/writeOrder/index')
    }
  },
  reducers:{
    save(state,nextState){
      return {...state,...nextState}
    }
  }
}
