import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.styl'
import shareFriends from "../../imgs/icons/icon-weixin.png";
import shareFriendsCircle from "../../imgs/icons/icon-friends-circle.png";

export default class goodItem extends Component {
  constructor(props){
    super(props)
  }
  hiddenShare(){
    // 取消
    this.props.onHideSare()
  }
  shareFriendImg(){
    this.props.onShareImg()
  }
  render () {
    const {isShow} = this.props // 是否显示
    return (
      <View className='share-panel' hidden={!isShow} onClick={this.hiddenShare}>
        <View className='share-panel-content'>
          <View className='share-content'>
            <View className='share-friend'>
              <Button openType='share' plain>
                <Image
                  src={shareFriends}
                >
                </Image>
                <Text>分享给朋友</Text>
              </Button>
            </View>
            <View>
              <Button plain onClick={this.shareFriendImg}>
                <Image
                  src={shareFriendsCircle}
                >
                </Image>
                <Text>分享到朋友圈</Text>
              </Button>
            </View>
          </View>
          <View className='cancel-btn' onClick={this.hiddenShare}>取消</View>
        </View>
      </View>
    )
  }
}
