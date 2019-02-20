import Taro from '@tarojs/taro'
import api from './../../api/catetory/catetory'
import until from '../../utils/hybird/index'

export default {
  namespace: 'searchGoods',
  state: {
    searchGoods: {
      keyword: '',
      firstcategoryId: '',
      secondCategoryId: '',
      thirdCategoryId: '',
      brandId: '',
      sort: 'distance',
      location: '',
      page: 1,
    },// 搜索的条件
    totalPage: 0,
    jumpPage: 'btnData', // 是区分搜索进入还是其他
    objKeys: '', // 要更改searchGoods对象   key
    updateData: '', // 要更改searchGoods对象   key的值
    showNoGoods: true, // 商品否显示
    history: false, // 历史是否显示
    showNoLocation: false, // 定位是否显示
    scrollList: true, // 是否需要监听滚动
    showActionButton: false, // 是否需要显示取消的按钮
    levelToUpperCase: '', // 分类大写字母
    brandToUpperCase: '', // 品牌大写字母
    secondCategoryId: false, // 将二级置空
    firstLevelId: '', // 一级id
    goodsList: [],//数据渲染
  },
  effects: {
    /**
     * 获取数据
     * @param _ actions
     */
    * getSearch(action, {call, put, select}) {
      let search = null
      const {searchGoods, objKeys, updateData, history} = yield select(state => state.searchGoods)
      if(objKeys){
        search = Object.assign({}, searchGoods, {[objKeys]: updateData})
      }else{
        search = searchGoods
      }
      if (searchGoods.location === '' || searchGoods.location === null || searchGoods.location === undefined) {
        const {res} = yield call(until.getLocation)
        if (res) {
          const {longitude, latitude} = res
          search.location = `${longitude},${latitude}`
          yield put({
            type: 'saveList',
            showNoLocation: false,
            showNoGoods: false,
            searchGoods: search,
            history: history ? history : false
          })
          yield put({type: 'getList'})
        } else {
          yield put({
            type: 'saveList',
            showNoGoods: false,
            showNoLocation: true,
            history: history ? history : false
          })
        }
      } else {
        yield put({
          type: 'saveList',
          history: history ? history : false,
          showNoGoods: false,
          searchGoods: search
        })
        yield put({type: 'getList'})
      }
    },
    /**
     *  上拉加载渲染数据
     */
    * initList(action, {call, put, select}) {
      const {goodsList, searchGoods, totalPage} = yield select(state => state.searchGoods)
      let page = searchGoods.page
      page++;
      if (page > totalPage) {
        Taro.showToast({
          icon: 'none',
          title: '没有更多了'
        })
      } else {
        searchGoods.page = page
        const {items} = yield call(api.list, searchGoods)
        yield put({
          type: 'saveList',
          searchGoods,
          showNoGoods: false,
          goodsList: goodsList.concat(items)
        })
      }
      Taro.stopPullDownRefresh()
    },
    /**
     *  page=1渲染数据
     */
    * getList(action, {call, put, select}) {
      const {searchGoods} = yield select(state => state.searchGoods)
      const {items, totalPage} = yield call(api.list, searchGoods)
      if (items.length > 0 && items) {
        searchGoods.page = 1
        yield put({
          type: 'saveList',
          searchGoods,
          totalPage,
          showNoGoods: false,
          goodsList: items
        })
      } else {
        yield put({
          type: 'saveList',
          showNoGoods: true,
          goodsList: []
        })
      }
      Taro.stopPullDownRefresh()
    },
    /**
     *  下拉数据
     */
    * dropRefresh(action, {put}) {
      yield put({type: 'getList'})
    },
    /**
     *  默认改变searchGoods的数据
     */
    * defaultData(action, {put, select}) {
      const {searchGoods, objKeys, updateData} = yield select(state => state.searchGoods)
      let search = null
      search = Object.assign({}, searchGoods, {[objKeys]: updateData})
      if (objKeys == 'thirdCategoryId') {
        search.firstcategoryId = ''
        search.secondCategoryId = ''
      }
      yield put({
        type: 'saveList',
        searchGoods: search,
        history: false,
      })
    },
    /**
     *  当前页面操作  品牌 排序 分类 跳转
     *  statePage 区分是否渲染列表
     *  objKeys  对象的key
     *  updateData  对象key 的值
     */
    * currentPage(action, {put, select}) {
      const {objKeys, updateData, statePage, history, levelToUpperCase, brandToUpperCase,jumpPage,firstLevelId,secondCategoryId} = action
      const {searchGoods} = yield select(state => state.searchGoods)
      const jumpPageaaa = yield select(state => state.searchGoods.jumpPage)
      let search = null
      search = Object.assign({}, searchGoods, {[objKeys]: updateData})
      if(secondCategoryId){
        search.secondCategoryId = ''
      }
      const historyaaa = yield select(state => state.searchGoods.history)
        search.firstcategoryId = firstLevelId ? firstLevelId : search.firstcategoryId
      yield put({
        type: 'saveList',
        searchGoods: search,
        levelToUpperCase: levelToUpperCase ? levelToUpperCase : '',
        brandToUpperCase: brandToUpperCase ? brandToUpperCase : '',
        jumpPage:jumpPage !=undefined ? jumpPage : jumpPageaaa,
        history: history !=undefined ? history : historyaaa,
        secondCategoryId: secondCategoryId ? secondCategoryId : 'false',
      })
      if (statePage) {
        if(search.location === '' || search.location === null || search.location === undefined){
          yield put({type: 'getSearch',})
        }else{
          yield put({type: 'getList',})
        }
      }
    },
    /**
     *  页面卸载置空数据
     */
    * emptyData(action, {put}) {
      const {searchGoods, history, statePage, scrollList} = action
      yield put({
        type: 'saveList',
        showNoGoods: true,
        searchGoods, history, statePage, scrollList,
        goodsList: [],
      })
    },
  },
  reducers: {
    saveList(state, nextState) {
      return {...state, ...nextState}
    },
  },
}
