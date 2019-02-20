import Taro, {Component} from '@tarojs/taro'
import {Text, View, ScrollView} from '@tarojs/components'
import {connect} from "@tarojs/redux";
import {AtIcon} from "taro-ui";
import HgdPop from  './../../../components/pop/index'
import './index.styl'

@connect(({ticket}) => ({
  ...ticket
}))
class GetTicket extends Component {
    static options = {
      addGlobalClass: true
    }
    constructor(props) {
        super(props)
    }
    handleShowTicket(){
      this.props.dispatch({
        type:'ticket/save',
        showTicket:true
      })
    }
    handleClose(){
      this.props.dispatch({
        type:'ticket/save',
        showTicket:false
      })
    }
    handleGetTicket(id){
      this.props.dispatch({
        type:'ticket/getTicket',
        id
      })
    }
    render() {
        const {receiveList,showTicket} = this.props
        return (
          <View>
            {
              receiveList&&receiveList.length>0&&(
                <View className='goods-handle-getTicket clear' onClick={this.handleShowTicket.bind(this)}>
                  <Text>领取优惠券</Text>
                  <AtIcon value='chevron-right' color='#A1A1A1' className='icon' />
                </View>
              )
            }
            <HgdPop
              isOpened={showTicket}
              onClose={this.handleClose.bind(this)}
            >
              <View className='getTicket'>
                <View className='title'>领取优惠券</View>
                  <ScrollView scrollY className='getTicket-list'>
                    {
                      receiveList.map(item=>(
                        <View className={['getTicket-list-item',item.receiveState === '0' ? 'getTicket-list-item-active': '']} key={item.id}>
                          <View className='getTicket-list-item-left'>
                            <View className='flex1 money'>
                              <Text className='text'>{item.money}</Text>
                              </View>
                            <View className='flex2 name'>{item.describe}</View>
                            <View className='flex1 limit'>满{item.limitMoney}元可用</View>
                            <View className='flex2 useTime'>有效期:{item.endTime}</View>
                          </View>
                          <View className='getTicket-list-item-right'>
                            {
                              item.receiveState === '0' &&(<View className='handel' onClick={this.handleGetTicket.bind(this,item.id)}>立即领取</View>)
                            }
                            {
                              item.receiveState === '1' &&(<View className='handel'>已领取</View>)
                            }
                            {
                              item.receiveState === '2'&&(<View className='handel'>已领完</View>)
                            }
                          </View>
                        </View>
                      ))
                    }
                  </ScrollView>
              </View>
            </HgdPop>
          </View>
        )
    }
}
export default GetTicket
