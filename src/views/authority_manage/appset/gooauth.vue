<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">谷歌验证器开关设置</div>
			<div style="width:50%; color:#999;">
				<p style="color:#666; margin-bottom:10px; padding-left:20px; box-sizing:border-box;">打开谷歌验证器，在登录及关键操作步骤进行验证，可提高网站安全。</p>
				<div class="switcdiv">
					<label>谷歌验证器</label>
					<el-switch v-model="IsGooAuth" :active-value="true" :inactive-value="false" @change="changeslider"></el-switch> 
				</div>
			</div>
			<br />	
			<div style="width:400px; text-align:center; padding-top:140px;">
				<el-button type="primary" @click="addSubmit">确定</el-button>
				<el-button @click.native="historyBack">返回</el-button>
			</div>
		</el-card>
	</div>
</template>

<script>
	import { getgooauth,setgooauth } from 'api/api.js';
	export default {
		data() {
			return {
				IsGooAuth:false
			}
		},
		mounted() {
			this.getdtl();
		},
		methods: {
			getdtl(){
				getgooauth({}).then((res) => {
					console.log(res);
					if( res.Ret === 200 ){
						this.IsGooAuth=res.IsGooAuth;
					}
				});
			},
	     	addSubmit(){
	     		let params={};
				params.Switch=this.IsGooAuth;
				setgooauth(params).then((res) => {
					if( res.Ret === 200 ){
						this.$message.success( res.Msg );
						let that=this;
						setTimeout(function(){
							that.historyBack();
						},1000);
					}
					if(res.Ret == 100){
						this._sendCode(params,setgooauth).then(res=>{
								if( res.Ret === 200 ){
									this.$message.success( res.Msg );
									let that=this;
									setTimeout(function(){
										that.historyBack();
									},1000);
								}
						})
					}
				});
	     	},
	     	historyBack(){  //返回上一页
	     		sessionStorage.setItem("adminset",true);
		    	history.back();
		    }
		}
	}
</script>

<style scoped lang="scss">
	.switcdiv{ float:left; width:300px; padding:35px 40px; text-align:center; border:1px solid rgb(234,234,234); background:rgb(249,249,249); border-radius:5px; margin:20px; }
	.switcdiv>label{ display:inline-block; width:150px; color:#59616A; text-align:left; }
</style>