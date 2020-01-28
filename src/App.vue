<template>
	<div id="app">
		<transition name="fade" mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
	import { loginconf } from 'api/api.js';
	export default{
		name:'app',
		created() {
//			loginconf({Domain:window.location.href}).then(res => {
//				if( res.Ret==200 ){
//					if( res.Rst.Title ){
//						document.title=res.Rst.Title;
//					}
//					if( res.Rst.AppIconUrl ){
//						document.getElementById('icon').href=res.Rst.AppIconUrl;
//					}
//					sessionStorage.setItem('rst',JSON.stringify(res.Rst));
//				}else{
//					sessionStorage.clear();
//				}
//			});
		}
	}
</script>

<style lang="scss">
	@import '~scss_vars';
	body{ margin:0px; padding:0px; font-family:Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif; font-size:14px; -webkit-font-smoothing:antialiased; }
	#app{ width:100%; position:absolute; top:0px; bottom:0px; }
	.el-submenu [class^=fa]{ vertical-align:baseline; margin-right:10px; }
	.el-menu-item [class^=fa]{ vertical-align:baseline; margin-right:10px; }
	.toolbar{ font:14px "微软雅黑"; color:$color-primary; background:#f2f2f2; padding:10px 15px; margin:10px 0px;
		.el-form-item{ margin-bottom:10px; }
	}
	.headTip{ padding:10px 15px; margin:10px auto; font:14px "微软雅黑"; color:#fff; background:$color-primary; }
	.fade-enter-active,.fade-leave-active{ transition: all .2s ease; }
	.fade-enter,.fade-leave-active{ opacity:0; }
</style>