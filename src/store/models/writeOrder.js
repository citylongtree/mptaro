import Taro from '@tarojs/taro'
import api from '../../api/writeOrder/writeOrder'
import util from "../../utils/util/index"

const initState ={
  buyerMessage: '',
  couponType: null,
  redPacketType: null,
  redBagList: [],
  couponList: [],
  express: ''
}
export default {
  namespace: 'writeOrder',
  state: {
    pickUpType:[], // 取货方式列表
    goodsInfo: [],
    shopName: '',
    shopId: '',
    sumCnt: '',  // 商品总数
    sumPrice: '', // 商品总价
    payMoney: 0,
    freight: 0, // 运费
    redBagList: [], // 红包券列表
    couponList: [], // 优惠券列表
    deliverType: '', // 取货方式
    // 到店联系信息
    goStore:{
      mobile: '',
      takeName: '',
      addressId: ''
    },
    buyerMessage: '',
    couponType:null, // 选择的优惠券
    redPacketType:null, // 选择的红包
    // 快递到家的信息
    express: '',
    goShopState: 'first',
  },
  effects: {
    // 下单页面初始
    *pageOnload(_, {put, select}){
      yield put({
        type: 'reset'
      })
      const { pickUpType, goodsInfo, shopName, sumCnt, sumPrice, shopId } = yield select(state => state.carList)
      yield put({
        type: 'save',
        pickUpType,
        goodsInfo: goodsInfo[0],
        shopName,
        sumCnt,
        sumPrice,
        shopId
      })
      if (pickUpType.length === 2){
        const deliver = pickUpType[0].value === 'TOSHOPPICUP'? pickUpType[0] : pickUpType[1]
        yield put({
          type: 'save',
          deliverType: deliver
        })
        yield put({
          type: 'getAddress',
          receiverWay: 'TOSHOPPICUP'
        })
      }else {
        const deliver = pickUpType[0]
        yield put({
          type: 'save',
          deliverType: deliver
        })
        yield put({
          type: 'getAddress',
          receiverWay: pickUpType[0].value
        })
      }
      yield put({
        type: 'firstRed',
        couponType: 'REDPACKET'
      })

    },
    // 运费
    *getFreight(_, {put, call, select}) {
      const {goodsInfo, express, shopId} = yield select(state => state.writeOrder)
      let arr = []
      const param = Object.assign({},{goodsInfo, shopId })
      arr[0] = param
      const {items} = yield call(api.getFreight, {provinceName: express.provinceName, items: arr})
      yield put({
        type: 'save',
        freight: items[0].freight,
      })
      yield put({
        type: 'countPayMoney'
      })
    },
    // 地址
    *getAddress(_, {put, call, select }) {
      const {receiverWay} = _
      const {goStore,express} = yield select(state => state.writeOrder)
      if (receiverWay === 'TOSHOPPICUP'){
        const {items} = yield call(api.getAddress, {receiverWay:'TOSHOPKICKUP'})
        if (items.length>0){
          const goShop = Object.assign({}, goStore,{mobile: items[0].receiverMobile, takeName: items[0].receiverName, addressId: items[0].addressId})
          yield put({
            type: 'save',
            goStore: goShop,
            goShopState: 'more'
          })
        }else {
          const goShop = Object.assign({}, goStore,{mobile:'', takeName: '',addressId: ''})
          yield put({
            type: 'save',
            goStore: goShop,
            goShopState: 'first'
          })
        }
        yield put({
          type: 'save',
          freight: 0,
        })
        yield put({
          type: 'countPayMoney'
        })
      } else {
        const {items} = yield call(api.getAddress, {receiverWay: 'FEDEXHOME'})
        if (items.length>0) {
          if(express===''){
            yield put({
              type: 'save',
              express: items[0]
            })
          }
          yield put({
            type: 'getFreight',
          })
        }else {
          yield put({
            type: 'save',
            freight: 0,
            express: ''
          })
          yield put({
            type: 'countPayMoney'
          })
        }
      }
    },
    // 计算总价
    *countPayMoney(_, {put, select}){
      const { freight, sumPrice, redPacketType, couponType } = yield select(state => state.writeOrder)
      const redPacket = redPacketType ? redPacketType.couponMoney : 0
      const coupon = couponType ? couponType.couponMoney : 0
      const payMoney = sumPrice + freight - redPacket - coupon
      yield put({
        type: 'save',
        payMoney: payMoney.toFixed(2)
      })
    },
    // 首次获取优惠券
    *firstRed(_, {put, call, select}){
      const {couponType} = _
      const { freight, sumPrice, goodsInfo} = yield select(state => state.writeOrder)
      let goodsIds = ''
      goodsInfo.map((item) => {
        goodsIds += item.goodsId + ','
      })
      goodsIds = goodsIds.substr(0,goodsIds.length-1)
      const paymoney = sumPrice + freight
      if (couponType === 'REDPACKET'){
        const {items}  = yield call(api.getCoupon,{couponType, role: 'personal', price: paymoney, goodsIds})
        if(items.length > 0){
          yield put({
            type: 'save',
            redPacketType: items[0]
          })
        }
      }
      yield put({
        type: 'countPayMoney'
      })
    },
    // 优惠券红包
    *getCoupon(_, {put, call, select}) {
      const {couponType} = _
      const { freight, sumPrice, goodsInfo, shopId } = yield select(state => state.writeOrder)
      let goodsIds = ''
      goodsInfo.map((item) => {
        goodsIds += item.goodsId + ','
      })
      goodsIds = goodsIds.substr(0,goodsIds.length-1)
      const paymoney = sumPrice + freight
      if (couponType === 'REDPACKET'){
        const {items}  = yield call(api.getCoupon,{couponType, role: 'personal', price: paymoney, goodsIds})
        const arr = [{id: 0, describe: '不使用红包',couponMoney: 0}]
        if(items.length > 0){
          yield put({
            type: 'save',
            redBagList: arr.concat(items)
          })
        }else {
          Taro.showToast({
            icon: 'none',
            title: '暂无可用红包'
          })
        }
      } else {
        const {items} = yield call(api.getCoupon,{ couponType, role: 'personal', price: sumPrice, goodsIds, shopId })
        const arr = [{id: 0, describe: '不使用优惠券',couponMoney: 0}]
        if(items.length > 0){
          yield put({
            type: 'save',
            couponList: arr.concat(items)
          })
        }else {
          Taro.showToast({
            icon: 'none',
            title: '暂无可用优惠券'
          })
        }
      }
    },
    // 设置优惠券
    *setCoupon(_, {put}){
      const {title, items} = _
      yield put({
        type: 'save',
        [title]: items
      })
      yield put({
        type: 'countPayMoney'
      })
    },
    *setPickUp(_, {put}){
      const {setPick} = _
      if(setPick === 'TOSHOPPICUP'){
        yield put({
          type: 'save',
          freight: 0,
        })
        yield put({
          type: 'countPayMoney'
        })
      }else {
        yield put({
          type: 'getAddress',
          receiverWay: 'FEDEXHOME'
        })
        yield put({
          type: 'countPayMoney'
        })
      }
    },
    *setAddress(_,{put}){
      const {item,jumpType} = _
      yield put({
        type: 'save',
        express: item
      })
      if(item!==''){
        yield put({
          type: 'getFreight'
        })
      }else {
        yield put({
          type: 'save',
          freight: 0,
        })
        yield put({
          type: 'countPayMoney'
        })
      }
      if(jumpType){
        util.jumpUrl('/pages/writeOrder/index?haveAddress=true')
      }
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
