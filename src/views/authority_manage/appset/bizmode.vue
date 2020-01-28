<template>
	<div id="appBusiness">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>APP业务模式设置</span>
				<span style="float:right;padding-right:40px;color:#409EFF;">提示：如需修改模式，请联系客服人员</span>
			</div>
			<el-form :model="addForm" :rules="rules" label-width="130px" ref="addForm">
				<el-form-item label="APP业务模式： " prop="Switch">
		        	<el-radio-group v-model="addForm.Switch" size="medium">
				      	<el-radio border :label="false" disabled style="width:600px; height:110px; position:relative; margin-bottom:20px;">
				      		<div style="position:absolute; top:24px; left:50px;">
				      			<p style="font:16px/32px '微软雅黑'; color:#606266;">授信审核→借款审核</p>
				      			<p style="font:14px/28px '微软雅黑'; color:#909399;">完成资料认证后，需先进行授信审核，审核通过后可进行借款并提交审核。</p>
				      		</div>
				      	</el-radio>
				      	<br />
				      	<el-radio border :label="true" disabled style="width:600px; height:110px; position:relative; margin-bottom:20px;">
				      		<div style="position:absolute; top:24px; left:50px;">
				      			<p style="font:16px/32px '微软雅黑'; color:#606266;">借款审核</p>
				      			<p style="font:14px/28px '微软雅黑'; color:#909399;">完成资料认证后，可直接进行借款，提交借款后会进行系统或人工的风控审核。</p>
				      		</div>
				      	</el-radio>
				    </el-radio-group>
		        	<!-- <p style="font:14px '微软雅黑'; color:#909399;">该功能仅部分新版APP支持，如有疑问，请联系对接人。</p> -->
		        </el-form-item>
				<!-- <el-form-item style="width:700px; text-align:center; padding-top:20px;">
					<el-button type="primary" @click="addSubmit">确定</el-button>
					<el-button @click.native="historyBack">返回</el-button>
				</el-form-item> -->
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import { getbizmode,setbizmode } from 'api/api.js';
	export default {
		data() {
			return {
				addForm:{
					Switch:null
				},
				rules: {
					Switch: [{
						required:true,
						message:'请选择APP业务模式',
						trigger:'blur'
					}]
				}
			}
		},
		mounted() {
			this.getdtl();
		},
		methods: {
			getdtl(){
				getbizmode({}).then((res) => {
					console.log(res);
					if( res.Ret === 200 ){
						this.addForm.Switch=res.Switch;
					}
				});
			},
	     	addSubmit(){
	     		this.$refs.addForm.validate((valid) => {
					if( valid ){
						setbizmode(this.addForm).then((res) => {
							if( res.Ret === 200 ){
								this.$message.success( res.Msg );
								let that=this;
								setTimeout(function(){
									that.historyBack();
								},1000);
							}
						});
					}
				});
	     	},
	     	historyBack(){  //返回上一页
		    	history.back();
		    }
		}
	}
</script>

<style  lang="scss">	
	#appBusiness{
		.el-radio__inner{
			box-shadow: none;
		}
		.el-radio.is-bordered.is-checked{
		    border-color: #409EFF !important;
		}
	}
	
</style>