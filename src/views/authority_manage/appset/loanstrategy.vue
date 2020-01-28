<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">自动放款比例设置</div>
			<div style="width:50%; color:#999;">
				<div style="padding:30px 40px; box-sizing:border-box; text-align:center; border:1px solid #eaeaea; border-radius:6px; background:#f9f9f9;">
					<el-input-number v-model="ManualWeight" :disabled="true"></el-input-number>
					<el-slider v-model="ManualWeight" :step="10" show-stops></el-slider>
				</div>
				<div style="padding:20px 10px; box-sizing:border-box;">
					<el-col :span="24" style="color:#666; margin-bottom:10px;">自动放款比例，数值越高，则自动放款比例越高。</el-col>
					<el-col :span="24" style="line-height:26px;">示例： 如比例为0，则全部为手动放款（需至风控-放款管理中操作）;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 如比例为100，则全部自动放款。</el-col>
				</div>
			</div>
			<br />	
			<div style="width:50%; text-align:center; padding-top:100px;">
				<el-button type="primary" @click="addSubmit">确定</el-button>
				<el-button @click.native="historyBack">返回</el-button>
			</div>
		</el-card>
	</div>
</template>

<script>
	import { getloanstrategy,setloanstrategy } from 'api/api.js';
	export default {
		data() {
			return {
				ManualWeight:null
			}
		},
		mounted() {
			this.getdtl();
		},
		methods: {
			getdtl(){
				getloanstrategy({}).then((res) => {
					console.log(res);
					if( res.Ret === 200 ){
						if( res.LoanStrategy.SystemWeight==1&&res.LoanStrategy.ManualWeight!=9 ){
							this.ManualWeight=res.LoanStrategy.SystemWeight*100;
						}else{
							this.ManualWeight=res.LoanStrategy.SystemWeight*10;
						}
					}
				});
			},
	     	addSubmit(){
	     		let params={};
				if( this.ManualWeight==0 ){
					params.ManualWeight=1;
					params.SystemWeight=0;
				}else if( this.ManualWeight==100 ){
					params.ManualWeight=0;
					params.SystemWeight=1;
				}else{
					let len = this.ManualWeight/10;
					params.ManualWeight=10-len;
					params.SystemWeight=len;
				}
				setloanstrategy(params).then((res) => {
					if( res.Ret === 200 ){
						this.$message.success( res.Msg );
						let that=this;
						setTimeout(function(){
							that.historyBack();
						},1000);
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

<style scoped lang="scss"></style>