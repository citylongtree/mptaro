import api from './../../api/goods/detail'
import {hybird,util}from "../../utils";

export default {
  namespace: 'ticket',
  state: {
    // 优惠券列表
    receiveList: [],
     // 店铺Id
    shopId:'',
    // 下弹出显示
    showTicket:false,
    // 不是第一次进入
    notFirst: false,
  },
  effects: {
    * getReceiveList(_, {call, put}) {
      const {shopId,notFirst} = _
      if(notFirst){
        yield put({type:'save',notFirst:false})
      }else {
        yield put({
          type:'save',shopId,
          showTicket:false,
          receiveList:''
        })
      }
      const {res} = yield hybird.getLocation()
      if (res) {
        const {latitude, longitude} = res
        const param = {
          shopId,
          role: 'personal',
          latitude,
          longitude
        }
        const {items} = yield call(api.receiveList, param)
        yield put({type: 'save', receiveList: items})
      }
    },
    * getTicket(_, {call, put, select}) {
      const {id} = _
      const {shopId} = yield select(state => state.ticket);
      const param = {
        id,
        role:'personal'
      }
      const {message} = yield call(api.receive, param)
      yield put({type:'save',showTicket:false})
      util.showToast(message)
      yield put({type: 'getReceiveList',shopId,notFirst:true})
    },
  },
  reducers: {
    save(state, nextState) {
      return {...state, ...nextState}
    }
  }
}
