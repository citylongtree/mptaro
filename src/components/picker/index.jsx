import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import yuan from '../../imgs/icons/yuan.png'
import dui from '../../imgs/icons/dui.png'
import './index.styl'

export default class HgPicker extends Component {
  constructor(props){
    super(props)
  }

  clickItem(items){
    this.props.onSelect(items)
  }

  closePicker() {
    this.props.onClose()
  }

  render () {
    const {title, list, activeId, showTag, PickerType} = this.props
    return (
      showTag && <View className='picker-box' onClick={this.closePicker}>
      <View className='picker-main'>
        {
          title && <Text  className='picker-main-title line'>{title}</Text>
        }
        {list && list.length > 0 && <View className='picker-main-list'>
          {
            list.map((items, index) => (
              <View className='picker-main-list-item line' key={index} onClick={this.clickItem.bind(this, items)}>
                {
                  PickerType==='deliverType'? <Text className='picker-item-name' style={items.id === activeId ? 'color: #FF7900' : ''} >{ items.describe }</Text>:
                    <View className='picker-item-left'>
                    {
                      index === 0 ?
                        <Text className='picker-item-name' style={items.id === activeId ? 'color: #FF7900' : ''} >{ items.describe }</Text>
                      :
                        <block>
                        <Text className='picker-item-left-name text-ellipsis1' style='color: #FF7900' >{ PickerType==='COUPON'?items.couponMoney+'元优惠券':items.couponMoney+'元红包' }</Text>
                        <Text className='picker-item-left-Time'>{ items.startTime+'-'+items.endTime }</Text>
                        </block>
                    }
                    </View>
                }
                <Image className='picker-item-active-img' src={items.id === activeId ? dui : yuan} />
              </View>
            ))
          }
        </View>}
      </View>
      </View>
    )
  }

}
HgPicker.defaultProps = {
  list: []
}
