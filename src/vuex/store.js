import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import { setStore,getStore,removeStore } from '@/utils/store';
import { validatenull } from '@/utils/validate';

Vue.use(Vuex);

// 应用初始状态
const state = {
	theme:getStore({name:'theme'}) || '#409EFF'
}

// 定义所需的 mutations
const mutations = {
	SET_THEME:(state,color) => {
//		console.log(state,color);
		state.theme = color;
		setStore({name:'theme',content:state.theme});
	}
}

export default new Vuex.Store({  // 创建 store 实例
	state,
    actions,
    getters,
    mutations
});