import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView} from '@tarojs/components'
import { AtTabs, AtTabsPane} from 'taro-ui'
import { CardBox } from '../../components/card/cardBox'
import {  util } from "../../utils"
import api from '../../api/card/card.js'
import './card.styl'

export default class Card extends Component {
    // title
    config = {
        navigationBarTitleText: '我的卡券包'
    }
    // 定的变量数据
    constructor (props) {
        super(props)
        this.state = {
            current: 0,
            list:[],
            couponType:'REDPACKET',
            page:1,
            nowPage:'',
        }
    }
    // tab切换
    handleClick (value) {
    this.setState({
      current: value
    })
    switch(value){
      case 0:
      value ="REDPACKET";
      break;
      case 1:
      value ="COUPON";
      break;
    }
    this.setState({
        couponType: value
      })
    this.getList(value,1)
    }
    getList = (value, page) => {
        this.setState({
            page: 1
        })
        api.list({role:'personal',couponType:value,page:page}).then(res=>{
            this.setState({
                list: res.items,
                nowPage:res.totalPage,
                page:2
            })
        })
    }
    componentWillMount(){
        let couponType = "REDPACKET"
        this.getList(couponType,1)
    }
    handleScrollLower(){
        let{couponType,page,nowPage}  = this.state
            if(page===nowPage + 1){
                util.showToast('没有更多数据了')
            }else{
                api.list({role:'personal',couponType:couponType,page:page}).then(res=>{
                        let list = this.state.list.concat(res.items)
                        this.setState({
                            list: list,
                        })
                        this.setState({
                            page: this.state.page+1
                        })
                })
            }
    }
    render(){
        const tabList = [{ title: '红包' }, { title: '优惠券' }]
        const {list, couponType} = this.state
        return(
            <View className='cardIndex'>
                <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
                {
                    tabList.map((item,index)=>(
                    <AtTabsPane current={this.state.current} index={index} key={index}>
                        <ScrollView scrollY className='scroll-view' onScrollToLower={this.handleScrollLower.bind(this)}>
                            <View className='cardList'>
                                <CardBox list={list} type={couponType} index={index}  current={this.state.current}></CardBox>
                            </View>
                        </ScrollView>
                    </AtTabsPane>
                    ))
                }
                </AtTabs>
            </View>
        )
    }
}