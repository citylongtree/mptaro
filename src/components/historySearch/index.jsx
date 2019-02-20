import Taro, {Component} from '@tarojs/taro'
import {View, Image, Text,} from '@tarojs/components'
import {deleteImg, noOrder} from './../../imgs/index'
import './index.styl'
import api from '../../api/historySearch/historySearch'
import noList from "../../components/noList/index";

/**
 *GOODS-表示商品搜索历史
 BORDER-B端订单搜索
 CORDER-- C端订单搜索
 REFUND--退款售后搜索
 BREFUND--B端的退款列表搜索,
 PURCHASE--B端门店进货搜索,
 PURCHASEORDER--进货订单搜索,
 PURCHASEREFUND--进货退款搜索,
 CASHIER--收银订单搜索
 */
export default class classify extends Component {

  config = {
    navigationBarTitleText: '搜索'
  }

  constructor(props) {
    super(props)
    this.state = {
      value: '',
      historyList: []
    }
  }

  componentWillMount() {
    this.init()
  }

  init() {
    let {type} = this.props
    api.list(
      {
        platform: 'MINI',
        type: type,
      }
    ).then(
      res => {
        this.setState({historyList: res.items && res.items.length > 0 ? res.items : 'noHistory'})
      }
    )
  }

  // 删除历史记录
  clearHistory(e) {
    e.stopPropagation()
    api.remove(
      {
        platform: 'MINI',
        type: this.props.type,
      }
    ).then(
      res => {
        this.init()
        Taro.showLoading('删除历史记录成功')
      }
    )
    this.props.onBtnHistoryDel()
  }

  clickHistory(val, e) {
    e.stopPropagation()
    let obj = {
      keyword: val,
      historySearch: false
    }
    this.props.onBtnHistory(obj)
  }


  render() {
    const {historyList} = this.state
    return (
      <View className='search'>
        {historyList != 'noHistory' &&
        <View>
          <View className='search-history'>
            <Text>历史纪录</Text>
            <Image src={deleteImg} className='search-history-img' onClick={this.clearHistory}/>
          </View>
          <View className='search-items flex-items'>
            {
              historyList != 'noHistory' && historyList.length > 0 && historyList.map(item => (
                <View className='search-history-font' key={item.id}>
                  <View
                    className='text-ellipsis1'
                    onClick={this.clickHistory.bind(this, item.keyword)}
                  >{item.keyword}</View>
                </View>
              ))
            }
          </View>
        </View>
        }
        {
          historyList == 'noHistory' &&
          <View className='noHistory'>
            <noList
              image='noOrder'
              errPage='暂无历史纪录'
            >
            </noList>
          </View>
        }
      </View>
    )
  }
}
