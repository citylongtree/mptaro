import Taro from '@tarojs/taro'
import api from "../../api/shop"
import until from '../../utils/hybird/index'

export default {
  namespace: 'shopList',
  state: {
    showNoLocation: false,
    shopData: [],
    totalPage: '',
    param: {
      cityCode: '',
      longitude: '',
      latitude: '',
      page: 1,
      sort: '',
      platform: 'MINI'
    },
    showListTag: false
  },
  effects: {
    *upData(_,{ put, call,select }){
      const { sort, shopName} = _
      const { param } = yield select(state => state.shopList)
      let params = null
      if(param.longitude === null || param.latitude === null || param.longitude === undefined || param.latitude === undefined || param.longitude==='' || param.latitude === ''){
        const {res} = yield call(until.getLocation)
        if(res){
          yield put({
            type: 'save',
            showNoLocation: false
          })
         const {longitude, latitude} = res
          if(shopName===null||shopName===undefined){
            params = Object.assign({}, param,{ longitude, latitude, sort})
          }else {
            params = Object.assign({}, param,{ longitude, latitude, sort, shopName})
          }
          yield put({
            type: 'save',
            param: params
          })
          yield put({type: 'downRefresh'})
        }else {
          yield put({
            type: 'save',
            showNoLocation: true
          })
        }
      }else {
        if(shopName===null||shopName===undefined){
          params = Object.assign({}, param,{ sort})
        }else {
          params = Object.assign({}, param,{ sort, shopName})
        }
        yield put({
          type: 'save',
          param: params
        })
        yield put({type: 'downRefresh'})
      }
    },
    *selectCity(_, {put,select}){
      const {cityCode} = _
      const { param } = yield select(state => state.shopList)
      const params = Object.assign({}, param,{ cityCode})
      yield put({
        type: 'save',
        param: params
      })
    },
      /**
       *  下拉刷新
       */
    *downRefresh(_, { put, select }){
      const { param } = yield select(state => state.shopList)
        const params = Object.assign({},param,{page:1})
      yield put({
        type: 'save',
        param: params
      })
      yield put({type: 'getShopList'})
    },
    /**
     * 上拉加载
     */
    *upLoad(_, { put, select}){
      const { param, totalPage} = yield select(state => state.shopList)
      const { page } = param
      if(page < totalPage){
        const newPage = page + 1
        const params = Object.assign({}, param,{page: newPage})
        yield put({
          type: 'save',
          param: params
        })
        yield put({type: 'getShopList'})
      } else{
        Taro.showToast({
          icon:'none',
          title:'没有更多了'
        })
      }
    },
    *getShopList(_, { call, put, select }) {
      const { param } = yield select(state => state.shopList)
      let { shopData } = yield select(state => state.shopList)
      const { items, totalPage } = yield call(api.shopList, param)
      if (param.page > 1) {
        shopData = shopData.concat(items)
      }else {
        shopData = items
      }
      yield put({
        type: 'save',
        shopData: shopData,
        totalPage: totalPage,
        showListTag: true
      })
      Taro.stopPullDownRefresh()
    }
  },
  reducers: {
    save(state,nextState){
      return {...state,...nextState}
    }
  },
}
