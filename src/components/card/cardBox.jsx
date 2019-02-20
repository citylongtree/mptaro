import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import pic1 from '../../imgs/icons/immediate.png'
import pic2 from '../../imgs/icons/USED.png'
import pic3 from '../../imgs/icons/pass.png'
import noCard from '../../imgs/icons/noCard.png'
import './cardBox.styl'

export default class CardBox extends Component {
    constructor (props) {
        super(props)
        this.state = {
            type:'REDPACKET'
        }
    }
    goto(id){
        if(this.state.type==='REDPACKET'){
            const type='red'
            Taro.navigateTo ({url:`/pages/card/cardDetail?id=${id}&type=${type}`})
        }else if(this.state.type==='COUPON'){
            const type='COUPON'
            Taro.navigateTo ({url:`/pages/card/cardDetail?id=${id}&type=${type}`})
        }
    }
    componentWillReceiveProps(){
        this.setState({
            type: this.props.type,
        })
    }
    render(){
        const {list,type} = this.props
        return(
            <View className='cardBoxList'>
            {list.length>0&&list.map(item=>(
                <View className='cardBox' style='background-image:../../../../imgs/icons/card.png' key={item.id} onClick={this.goto.bind(this, item.id)}>
                    <View className='cardLeft'>
                        <View className='money'><Text className='code'>￥</Text>{item.couponMoney}</View>
                        <View className='usable'>满{item.limitMoney}元可用</View>
                    </View>
                    <View className='cardCenter'>
                        <View className='centerTittle'>{item.describe}</View>
                        <View className='centermark'>有效期</View>
                        <View className='time'>{item.startTime}-{item.endTime}</View>
                    </View>
                    <View className='cardRight'>
                        <View className='pic1'>{
                            item.state==='USABLE'?(<Image src={pic1} className='img1'></Image>):item.state==='USED'?(<Image src={pic2} className='img1'></Image>):(<Image src={pic3} className='img1'></Image>)
                        }
                        </View>
                    </View>
                </View>
            ))}
            {
            list.length === 0&&(
              <View className='noOrderPic'>
              <View className='center'>
              <Image src={noCard} className='orderPic'>
                </Image>
                <View className='title'>{type==='REDPACKET'?'暂无红包':'暂无优惠券'}</View>
              </View>
              </View>
            )
            }
            </View>
        )
    }
}
CardBox.defaultProps={
    list:[]
}
