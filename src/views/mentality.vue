<template>
	<div id="container"></div>
</template>

<script>
	import { mainauth,getmenulist } from 'api/api.js';
	import MenuUtils from 'utils/MenuUtils.js';
	export default {
		data() {
			return {
				m:this.$route.params.m,
				t:this.$route.params.t
			};
		},
		mounted(){
			console.log(this.$route.params.m,this.$route.params.t,123);
			this.handleSubmit();
		},
		methods: {
			handleSubmit(){  //登录
				mainauth({Merchant:this.m,Token:this.t}).then(res => {
					console.log(res);
					if( res.Ret==200 ){
						sessionStorage.setItem('userDtl',JSON.stringify(res.SysUserInfo));
						sessionStorage.setItem('Token',res.Token);
						sessionStorage.setItem('Xtn',res.Xtn);
						this.menuNav();
					}else{
						this.$router.push('/login');
					}
				});
			},
			menuNav(){  //获取左侧菜单
				let that = this;
				getmenulist({}).then(res => {
					if( res.Ret == 200) {
						let priData={};
						if( res.Menus!=null ){
							priData = res.Menus;
							priData = JSON.stringify(priData).toLowerCase(); //所有的key转换成小写
							sessionStorage.setItem('meundata',priData);
						}
						that.$router.options.routes=[];
						let routes = [];
						if( priData.length>0 ){
							MenuUtils(routes,priData);
							that.$router.options.routes = Object.assign(that.$router.options.routes,routes);
							that.$router.addRoutes(routes);
						}
						that.$router.push({
							path: '/main'
						});
					} else {
						this.navlists = null;
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped></style>