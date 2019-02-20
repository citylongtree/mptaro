import Taro from '@tarojs/taro'
import api from '../../api/goods/detail'
import {util} from '../../utils'

const initState = {
  isShowPop:false,
  from:'',
  goodsCnt:1,
  selectSku:'',
  editSuccess:false,
  carId:''
}

export default {
  namespace:'shopCar',
  state:{
    // 是否显示规格选择弹窗
    isShowPop:false,
    // 选中的sku对象
    selectSku:'',
    // 商品数量
    goodsCnt:1,
    // 触发场景
    from:'',
    // 购物车数量
    carCnt:'',
    // 是否编辑成功
    editSuccess:false,
    // 商品详情对象
    goodsDetail:{}
  },
  effects: {
    /**
     * 商品列表加入购物车
     * @param _ actions
     */
    *getDetail(_, { call, put }){
      if(!util.justGoLogin()){return}
      yield put({type:'reset'})
      const{shopId,goodsId,goodsNo,from} = _
      // 列表页加入购物车获取商品详情
      const {data} = yield call( api.detail,{shopId,goodsId,goodsNo})
      // 存储商品详情
      yield put(
        {
          type:'save',
          selectSku:'',
          skuValueCnt:'',
          from:from,
          goodsDetail:data
        }
      )
      yield put({type: 'preAddToShopCar',from})
    },
    /**
     * 预加入购物车
     */
    *preAddToShopCar(_, { put, select}){
      if(!util.justGoLogin()){return}
      const {goodsDetail,selectSku} = yield select(state => state.shopCar);
      const {from} = _
      yield put({type:'save',from})
      // 如果商品的skuValueList的length大于一表示多规格，且没选中规格
      if(goodsDetail.skuValueList.length>1&&!selectSku){
        yield put({type:'save',isShowPop:true})
      }else{
        if(!selectSku){
          yield put({type:'save',selectSku:goodsDetail.skuValueList[0]})
        }
        if(from === 'buy' ){
          yield put({type:'buy'})
        }else {
          yield put({type:'addToShop'})
        }
      }
    },
    /**
     * 加入购物车
     */
    *addToShop(_, {put, call, select}){
      if(!util.justGoLogin()){return}
      const {goodsDetail,selectSku,goodsCnt} = yield select(state => state.shopCar);
      let param = {
        shopId:goodsDetail.shopId,
        goodsId:goodsDetail.goodsId,
        goodsCnt,
      }
      if(selectSku){
        param['shopGoodsSkuId']= selectSku.shopGoodsSkuId
        param['specName']= selectSku.supSkuValue
        try {
          const {success} = yield call( api.add,param)
          if(success){
              yield put({type:'save',isShowPop:false,goodsCnt:1})
              Taro.showToast({
                icon:'none',
                title:'添加成功'
              })
              yield put({type:'getCarCnt'})
          }
        }catch (e) {
          util.showToast('商品库存不足')
        }
      }else {
        Taro.showToast({
          icon:'none',
          title:'请选择规格'
        })
      }
    },
    /**
     *直接购买
     */
    *buy(_, {put, select}){
      if(!util.justGoLogin()){return}
      const {goodsDetail,selectSku,goodsCnt} = yield select(state => state.shopCar);
      const {shopId,goodsId,goodsName,shopName} = goodsDetail
      let goodsInfo = {
        goodsId,
        goodsCnt,
        title:goodsName
      }
      if(selectSku){
        const {shopGoodsSkuId,supSkuValue,skuGoodsPicUrl,skuValueCnt,price} = selectSku
        goodsInfo['shopSkuId']= shopGoodsSkuId
        goodsInfo['skuName']= supSkuValue
        goodsInfo['picture'] = skuGoodsPicUrl
        goodsInfo['stock'] = skuValueCnt
        goodsInfo['price'] = price
        yield put(
          {
            type:'carList/getBuy',
            goodsInfo:[goodsInfo],
            shopId,
            shopName,
            sumPrice:(goodsCnt * price),
            sumCnt:goodsCnt
          })
        yield put({type:'save',isShowPop:false})
      }else {
        Taro.showToast({
          icon:'none',
          title:'请选择规格'
        })
      }
    },
    /**
     * 购物车列表多规格编辑
     */
    *preEdit(_, {put}){
      const {goodsDetail,selectSku,goodsCnt,cartId,skuValueCnt} = _
      yield put({
        type:'save',
        goodsDetail,
        selectSku,
        skuValueCnt,
        cartId,
        goodsCnt,
        from:'edit',
        editSuccess:false
      })
      yield put({type:'save',isShowPop:true})
    },
    *edit(_, {put,call,select}){
      const {selectSku,goodsCnt,cartId} = yield select(state => state.shopCar);
      const {shopGoodsSkuId} = selectSku
      try {
       const {success} = yield call(api.modify,{
          shopGoodsSkuId,
          cartId,
          cnt:goodsCnt
        })
        if(success === true){
          yield put({type:'save',isShowPop:false,editSuccess:true})
        }
      }catch (e) {
        util.showToast('商品库存不足')
      }
    },
    *getCarCnt(_, {put,call}){
      const {data} = yield call(api.totalCnt)
      yield put({type:'save',carCnt:data})
    }
  },
  reducers: {
    reset(state){
      return {...state, ...initState}
    },
    save(state,nextState){
      return {...state,...nextState}
    }
  },
}
