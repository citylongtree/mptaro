import Taro, {Component} from '@tarojs/taro'
import {View,Image, Text, ScrollView} from '@tarojs/components'
import {connect} from "@tarojs/redux";
import './index.styl'
import iconOne from './one.jpg'

@connect(({ticket}) => ({
  ...ticket
}))
class Ticket extends Component {
    static options = {
      addGlobalClass: true
    }
    constructor(props) {
        super(props)
        this.state = {}
    }
    handleGetTicket(id){
      this.props.dispatch({
        type:'ticket/getTicket',
        id
      })
    }
    render() {
        let {receiveList} = this.props
        return (
          <View>
            {
              receiveList&&receiveList.length>0&&(
              <View className='ticket'>
                <ScrollView scrollX>
                  <View className='ticket-content'>
                      {
                        receiveList.length === 1&&(
                          <View  className='ticket-content-img'>
                            <Image src={iconOne} className='img' />
                          </View>
                        )
                      }
                      {
                        receiveList.map(item=>(
                          <View className={['ticket-content-item clear',item.receiveState === '0' ? 'active': '']} key={item.id} >
                            <View className='ticket-content-item-money clear lf'>
                              <View className='use'>
                                <Text className='use-text'>{item.money}</Text>
                              </View>
                              <View className='limit'>满{item.limitMoney}元即可使用</View>
                            </View>
                            <View className='ticket-content-item-btn'>
                              {
                                item.receiveState === '0' &&(<View className='handel'  onClick={this.handleGetTicket.bind(this,item.id)}>立即领取</View>)
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
                  </View>
                </ScrollView>
              </View>)
            }
          </View>
        )
    }
}
export default Ticket
