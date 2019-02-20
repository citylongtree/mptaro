export default {
  /**
   * 门店模块
   * */
  shop: {
    detail: '/api/v4/merchant/detail',
    list: '/api/v4/merchant/list.json',
    classify: '/api/v4/brandManage/brandLevels', // 店内分类品牌
    addHistory:'/api/v4/goods/history/add',
    shopShare: '/api/v4/shop/createMiNiCode'
  },
  /**
   * 城市有关
   * */
  city: {
    list: '/api/v4/region/browser/city' // 字母分组(可不分)，搜索地区
  },
  /**
   * 优惠券
   * */
  coupon: {
    list: '/api/v4/coupon/receiveList' // 门店优惠券

  },
  /**
   * 商品
   */
  goods:{
    detail: '/api/v4/goods/detail', // 商品详情
    receiveList:'/api/v4/coupon/receiveList', // 规格
    contactMember:'/api/v4/memberId/contactMember', // 店铺
    add:'/api/v4/cart/add',
    receive: '/api/v4/coupon/receive',
    modify:'/api/v4/cart/modify',
    totalCnt:'/api/v4/cart/appMember/totalCnt',
  },
  /**
   * 订单
   * */
  order:{
    historyList: '/api/v4/search/history/list', // 搜索记录
    historyRemove: '/api/v4/search/history/remove', // 删除搜索记录
    list: '/api/v4/order/list', // 订单列表
    orderDetail: '/api/v4/order/detail', //订单详情
    logisticsInfo: '/api/v4/order/logisticsInfo', // 物流信息
    deleted: '/api/v4/order/deleted', // 删除订单
    receipt: '/api/v4/order/receipt', // 确认收货
    cance: '/api/v4/order/cancel', // 取消订单
    refunds: '/api/v4/order/refunds', // 退款退货
    refundsMoney: '/api/v4/order/refundsMoney', // 退款金额
    refundsList: '/api/v4/order/refundsList', // 退款，售后列表
    refundsDetail: '/api/v4/order/refundsDetail',// 退款详情
    pre: '/api/v4/pay/pre' //预支付
  },
  /**
   * 首页
   */
  home:{
    focusPic: '/api/v4/index/focusPic', // 首页轮播图
    level: '/api/v4/index/level', // 首页分类
    brand: '/api/v4/brands', // 首页品牌列表
    recommend: '/api/v4/index/recommend', // 首页为您推荐
    brandHome: '/api/v4/home/brands', // 首页为您推荐
  },
  /**
   * 搜索历史纪录
   */
  historySearch:{
    list:'/api/v4/search/history/list', // 搜索历史记录
    remove: '/api/v4/search/history/remove', // 删除历史记录
  },
  /**
   * s搜索 品牌 分类
   */
  searchGoods:{
    list:'/api/v4/goods/list', // 搜索列表
    allLevel:'/api/v4/goods/allLevel', // 分类
    linkLevel:'/api/v4/brand/linkLevel', // 连动
    shopGoodsList: '/api/v4/shopGoods/goodsList',
    add: '/api/v4/goods/history/add', // 添加历史记录
  },
  // 下单相关接口
  writeOrder: {
    freight: '/api/v4/order/freightInfo', // 运费
    coupon: '/api/v4/coupon/member/placeOrder', // 优惠券-红包
    save: '/api/v4/order/save', // 保存订单
    address: '/api/v4/member/address/list', // 收货地址或联系人
    getPayMoney: '/api/v4/order/getPayMoney', // 支付金额
  },
  shopCar:{
    pickUpType:'/api/v4/order/pickUpType/list',
    getList:'/api/v4/cart/list',
    delete:'/api/v4/cart/delete',
    recommended:'/api/v4/goods/recommended'
  },
  /**
   * 卡劵
   */
  card:{
    list: '/api/v4/coupon/member/list', //我的卡券包
    info: '/api/v4/coupon/member/info' //详情
  },
  my:{
    idx:':/api/v4/member/idx',

  },
  /**
   * 登录
   */
  login: {
    login: '/api/v4/member/mini/sysLogin',
    getSms: '/api/v4/member/send_valid_code'
  },
  /**
   * 地址
   */
  address: {
    findByParent: '/api/v4/region/findByParent',
    list: '/api/v4/member/address/list',
    add: '/api/v4/member/address/add',
    modify: '/api/v4/member/address/modify',
    delete: '/api/v4/member/address/delete'
  }
}
