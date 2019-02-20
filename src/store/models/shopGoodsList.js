import Taro from '@tarojs/taro'
import api from "../../api/shopSearchGoods/index"

const initState = {
  sort: 'matching',
  page: 1,
  shopId: '',
  levelId: 0,
  brandId: 0,
  goodsList: [],
  brands: [],
  classify: [
    {
      oneName: '热销',
      id: 0
    }
  ],
}
export default {
  namespace: 'shopGoodsList',
  state: {
    brands: [],
    classify: [
      {
        oneName: '热销',
        id: 0
      }
    ],
    carCnt: 0,
    goodsList: [],
    levelId: 0,
    brandId: 0,
    sort: 'matching',
    page: 1,
    totalPage: 0,
    shopId: ''
  },
  effects: {
    *getShopList(_, { call, put, select }) {
      const {shopId} = _
      const { data } = yield call(api.shopClassify, {shopId})
      let {classify,brands} = yield select(state => state.shopGoodsList)
      classify = [{
        oneName: '热销',
        id: 0
      }]
      brands = [{
        brandName: '全部',
        brandId: 0
      }]
      yield put({
        type: 'save',
        classify: classify.concat(data.levels),
        brands: brands.concat(data.brands)
      })
    },
    *getGoodsList(_, { call, put, select }){
      const {levelId, brandId, sort, page, shopId } = yield select(state => state.shopGoodsList)
      let { goodsList } = yield select(state => state.shopGoodsList)
      const { items, totalPage} = yield call(api.shopGoodsList, {levelId, brandId, sort, page, shopId})
      if (page > 1) {
        goodsList = goodsList.concat(items)
      }else {
        goodsList = items
      }
      yield put({
        type: 'save',
        goodsList,
        totalPage
      })
      Taro.stopPullDownRefresh()
    },
    *downUpdate(_,{ put }) {
      const {shopId} = _
      yield put({
        type: 'save',
        shopId
      })
      yield put({
        type: 'getGoodsList',
      })
    },
    *getCarCnt(_, { call, put }){
      const {data} = yield call(api.getCarCnt)
      yield put({
        type: 'save',
        carCnt: data || 0
      })
    },
    *classifyClick(_,{put}){
      const { levelId } = _
      yield put({
        type: 'save',
        levelId,
        page: 1
      })
      yield put({
        type: 'getGoodsList'
      })
    },
    *brandClick(_,{put}) {
      const { brandId } = _
      yield put({
        type: 'save',
        brandId,
        page: 1
      })
      yield put({
        type: 'getGoodsList'
      })
    },
    *sortCLick(_,{put}) {
      const { sort } = _
      yield put({
        type: 'save',
        sort,
        page: 1
      })
      yield put({
        type: 'getGoodsList'
      })
    },
    *loadMore(_, { put, select }){
      const { page, totalPage} = yield select(state => state.shopGoodsList)
      if(page < totalPage){
        const newPage = page + 1
        yield put({
          type: 'save',
          page: newPage
        })
        yield put({type: 'getGoodsList'})
      } else{
        Taro.showToast({
          icon:'none',
          title:'没有更多了'
        })
      }
    }
  },
  reducers: {
    save(state,nextState){
      return {...state,...nextState}
    },
    reset(state){
      return {...state, ...initState}
    },
  },
}
