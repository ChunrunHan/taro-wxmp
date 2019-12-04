import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
import { AtButton, AtFab, AtMessage } from 'taro-ui'
import {getHomeAdv} from '../../service/api'

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页',
    enablePullDownRefresh: true
  }

  state = {
    myTime: 12,
    header: '头部'
  }

  renderHeader() {
    const { header } = this.state
    return <View>{header}</View>
  }

  renderFooter(footer) {
    return <View onClick={() => this.handleClick()}>{footer}</View>
  }
  // page.onload
  componentWillMount () { }
  // onReady
  componentDidMount () {
    getHomeAdv().then(res=>{
      console.log("广告",res)
    }).catch(err=>{

    })
    this.setState({     // ✗ 尽量避免，可以在 componentWillMount 中处理
      name: 1
    })
  }
  // onUnload
  componentWillUnmount () { }
  // onShow
  componentDidShow () { }
  // onHide
  componentDidHide () { }

  onButtonClick(){
    console.log("点击浮动button")
  }

  onPullDownRefresh (){
    console.log('下拉刷新啊')
  }

  onShareAppMessage (res){
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  }

  handleClick = () =>{
    console.log("点击了底部啊")
  }

  render () {
    return (
      <View className='index'>
        <AtMessage />
        {this.renderHeader()}
        <Text className='col-f90'>Hello world!</Text>
        <AtButton>按钮文案{this.state.myTime}</AtButton>
        <AtButton type='primary'>按钮文案</AtButton>
        <AtButton type='secondary'>按钮文案</AtButton>
        <AtFab onClick={this.onButtonClick.bind(this)}>
          <Text className='at-fab__icon at-icon at-icon-menu'></Text>
        </AtFab>
        {this.renderFooter("我是底部")}
      </View>
    )
  }
}
