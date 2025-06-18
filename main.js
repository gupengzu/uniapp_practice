import Vue from 'vue'
import App from './App'
import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
Vue.component('uni-icons', UniIcons)


//导入网络请求的包为$http,然后把它挂载到uni这个顶级对象上作为一个自定义属性
import{$http}from "@escook/request-miniprogram"
uni.$http=$http
//设置请求的根路径,这样每次写网络请求时就不要在前面带着https://api-hmugo-web.itheima.net
$http.baseUrl='https://api-hmugo-web.itheima.net'


//请求拦截器
$http.beforeRequest=function(options){
	uni.showLoading({
		title:"数据加载中..."
	})
}
//响应拦截器
$http.afterRequest=function(options){
	uni.hideLoading()
}
//封装请求失败时的弹框方法
uni.$showMsg=function(title='数据请求失败',duration=1500){
	uni.showToast({
		title,
		duration,
		icon:'none'
	})
}


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
