import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/index'
import 'taro-ui/dist/style/index.scss'
import { set as setGlobalData, get as getGlobalData } from './utils/global_data'
import '@tarojs/async-await'
import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/mine/mine',
      'pages/order/order'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#F90',
      navigationBarTitleText: '商城',
      navigationBarTextStyle: 'white'
    },
    tabBar: {
      selectedColor:'#F90',
      list: [{
        iconPath: './assets/xx.png',
        selectedIconPath: './assets/xx_a.png',
        pagePath: 'pages/index/index',
        text: '首页'
      }, {
        iconPath: './assets/yy.png',
        selectedIconPath: './assets/yy_a.png',
        pagePath: 'pages/order/order',
        text: '订单'
      }, {
        iconPath: './assets/wd.png',
        selectedIconPath: './assets/wd_a.png',
        pagePath: 'pages/mine/mine',
        text: '我的'
      }]
    },
    networkTimeout: {
      request: 10000,
      downloadFile: 10000
    },
  }

  componentDidMount() {
    console.log('onLaunch',this.$router.params)  
    setGlobalData('test', 1)
    console.log(getGlobalData('test'))
    console.log("当前服务器环境", Taro.getStorageSync('isDev'))
    if (!Taro.getStorageSync('isDev')) {
      Taro.setStorageSync('isDev', "false") // 切换生产服务器
    }
  }

  componentDidShow() {
    console.log('onShow',this.$router.params)
  }

  componentDidHide() {
    console.log('onHide')
  }

  componentDidCatchError() {
    console.log('onError')
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
