import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import getDict from '../../utils/dict/index.js'
import yuan from '../../imgs/icons/yuan.png'
import dui from '../../imgs/icons/dui.png'
import './select.styl'

export default class SingleSelect extends Component {
    constructor (props) {
        super(props)
        this.state = {
            value:'',
            typeName:this.props.type
        }
    }
   componentWillReceiveProps(nextProps){
       const {type} = this.props
       const {value} = nextProps
       if(type === 'cancelData'&&!value){
         console.log(type)
         console.log(value)
         this.setState({
           value:'0'
         })
       }
    }
    change(value, v){
            console.log(value)
            console.log(v)
            this.props.onHandleChange(v)
            this.setState({
                value:value
            })
    }
    render() {
        const reasonData = getDict.getselectList(this.state.typeName)
        const {value} = this.state
        return(
           <View className='selectList'>
               {reasonData.map(item=>(
                   <View key={item.name} className='selectLine' onClick={this.change.bind(this, item.name, item.value)}>
                        <View className='selectText'>{item.value}</View>
                        {
                        value === item.name?(
                            <View className='dui'>
                            <Image src={dui} className='dui'></Image>
                        </View>
                        ):(
                            <View className='yuan'>
                            <Image src={yuan} className='yuan' />
                        </View>
                        )
                        }
                    </View>

               ))}
           </View>
        )
    }
}
