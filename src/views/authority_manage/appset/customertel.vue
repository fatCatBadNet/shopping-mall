<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">客服联系方式设置</div>
			<el-form :model="addForm" label-width="100px" ref="addForm">
				<el-form-item label="客服电话">
		          	<el-input type="text" v-model="addForm.Tel" clearable placeholder="请输入客服电话" style="width:288px;"></el-input>
		          	<i class="el-icon-info" style="font-size:18px; color:#108EE9; margin:0 20px;"></i>
		          	<span style="padding:11px 20px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">客服电话将会出现在帮助中心/关键结果页面处，没有可不填。</span>
		        </el-form-item>
		        <el-form-item label="QQ">
		          	<el-input type="text" v-model="addForm.QQ" clearable placeholder="请输入QQ" style="width:288px;"></el-input>
		          	<i class="el-icon-info" style="font-size:18px; color:#108EE9; margin:0 20px;"></i>
		          	<span style="padding:11px 20px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">QQ将会出现在帮助中心页面处，没有可不填。</span>
		        </el-form-item>
		        <el-form-item label="微信">
		          	<el-input type="text" v-model="addForm.Wechat" clearable placeholder="请输入微信" style="width:288px;"></el-input>
		          	<i class="el-icon-info" style="font-size:18px; color:#108EE9; margin:0 20px;"></i>
		          	<span style="padding:11px 20px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">微信将会出现在帮助中心页面处，没有可不填。</span>
		        </el-form-item>
				<el-form-item style="width:400px; text-align:center; padding-top:20px;">
					<el-button type="primary" @click="addSubmit">确定</el-button>
					<el-button @click.native="historyBack">返回</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import { getcustomertel,setcustomertel } from 'api/api.js';
	export default {
		data() {
			return {
				addForm:{
					Tel:'',
					QQ:'',
					Wechat:''
				}
			}
		},
		mounted() {
			this.getdtl();
		},
		methods: {
			getdtl(){
				getcustomertel({}).then((res) => {
					console.log(res);
					if( res.Ret === 200 ){
						this.addForm.Tel=res.Tel;
						this.addForm.QQ=res.QQ;
						this.addForm.Wechat=res.Wechat;
					}
				});
			},
	     	addSubmit(){
				setcustomertel(this.addForm).then((res) => {
					if( res.Ret === 200 ){
						this.$message.success( res.Msg );
						let that=this;
						setTimeout(function(){
							that.historyBack();
						},1000);
					}
					if(res.Ret == 100){
						this._sendCode(this.addForm,setcustomertel).then(res=>{
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
		    	history.back();
		    }
		}
	}
</script>

<style scoped lang="scss"></style>