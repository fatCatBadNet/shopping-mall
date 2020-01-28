import 'babel-polyfill'
//import Vue from 'vue'
import App from './App'
//import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'
//import Mock from './mock/mock.js'
//Mock.bootstrap();  // 控制mock的开关
import 'font-awesome/css/font-awesome.min.css'
import axios from "axios"
import MenuUtils from '@/utils/MenuUtils.js'
import '@/utils/dialog.js'

//import 'element-ui/lib/theme-chalk/index.css';
import {mixins} from '@/mixins'//引入混合
Vue.mixin(mixins);//使用混合


//Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

const router = new VueRouter({
//	mode:"history",
	routes
})

let data = window.sessionStorage.getItem('meundata');
if( data ){
  	let routes = [];
  	MenuUtils(routes,data);
	router.options.routes = Object.assign(router.options.routes,routes);
	router.addRoutes(routes);
	window.sessionStorage.removeItem('isLoadNodes');
}

router.beforeEach((to, from, next) => {
	if( to.path == '/login' ){
  		sessionStorage.removeItem('userDtl');
  		sessionStorage.removeItem('meundata');
  		sessionStorage.removeItem('Xtn');
  		window.sessionStorage.removeItem('isLoadNodes');
  	}
  	let user = JSON.parse(sessionStorage.getItem('userDtl'));
  	if( !user && to.path != '/login' && to.path.substring(0,13) != '/partyChannel' && to.path.substring(0,11) != '/channelurl' && to.path.substring(0,8) != '/lookreg' && to.path.substring(0,10) != '/mentality' ){	
  		next({ path:'/login' })
  	}else{
	    if( to.path ){
	    	next()
	    }else{
	    	next({ path:'/404' })
	    }
  	}
});

new Vue({
	router,
  	store,
  	render: h => h(App)
}).$mount('#app');