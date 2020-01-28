<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">首页显示额度设置</div>
			<el-form :model="addForm" :rules="rules" label-width="180px" ref="addForm">
				<!-- <el-form-item label="未登录状态下" prop="UnlogBalance">
		          	<el-input type="text" v-model.number="addForm.UnlogBalance"clearable placeholder="请输入100的整数倍金额" style="width:288px;">
		          		<template slot="append">元</template>
		          	</el-input>
		          	<i class="el-icon-info" style="font-size:18px; color:#108EE9; margin:0 20px;"></i>
		          	<span style="padding:11px 20px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">未登录状态下，APP首页展示的可借金额。</span>
		        </el-form-item> -->
				<el-form-item label="白名单用户建议额度" prop="WhiteUserBalance" v-if="HaveWhite">
				  	<el-input type="text" v-model.number="addForm.WhiteUserBalance"clearable placeholder="请输入100的整数倍金额" style="width:288px;">
				  		<template slot="append">元</template>
				  	</el-input>
				  	<i class="el-icon-info" style="font-size:18px; color:#108EE9; margin:0 20px;"></i>
				  	<span style="padding:11px 20px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">白名单内用户填写实名认证和银行卡信息即可获得。</span>
				</el-form-item>
				<el-form-item label="首页展示额度" prop="DirectLoanBalance">
				  	<el-input type="text" v-model.number="addForm.DirectLoanBalance"clearable placeholder="请输入100的整数倍金额" style="width:288px;">
				  		<template slot="append">元</template>
				  	</el-input>
				  	<!-- <i class="el-icon-info" style="font-size:18px; color:#108EE9; margin:0 20px;"></i>
				  	<span style="padding:11px 20px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">放款金额以用户实际授信金额为准。</span> -->
				</el-form-item>
				<el-form-item label="系统通过建议额度" prop="NormalBalance">
				  	<el-input type="text" v-model.number="addForm.NormalBalance"clearable placeholder="请输入100的整数倍金额" style="width:288px;">
				  		<template slot="append">元</template>
				  	</el-input>
					<i class="el-icon-info" style="font-size:18px; color:#108EE9; margin:0 20px;"></i>
					<span style="padding:11px 20px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">风控系统如果通过，将给出的建议额度。</span>
				</el-form-item>
				<el-form-item style="width:800px; text-align:center; padding-top:20px;">
					<el-button type="primary" @click="addSubmit">确定</el-button>
					<el-button @click.native="historyBack">返回</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import { getbalanceparm,setbalanceparm } from 'api/api.js';
	export default {
		data() {
			return {
				addForm:{
					UnlogBalance:null,  //未登录状态下
					HaveWhite:false,  //是否有白名单用户配置
					WhiteUserBalance:null,  //白名单用户建议额度
					DirectLoanBalance:null,  //首页展示额度
					NormalBalance:null,  //系统通过建议额度
				},
				rules: {
// 					UnlogBalance:[{
// 						required:true,
// 						message:'请输入未登录状态下额度',
// 						trigger:'blur'
// 					}],
					WhiteUserBalance:[{
						required:true,
						message:'请输入白名单用户建议额度',
						trigger:'blur'
					}],
					DirectLoanBalance:[{
						required:true,
						message:'请输入首页展示额度',
						trigger:'blur'
					}],
					NormalBalance:[{
						required:true,
						message:'请输入系统通过建议额度',
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
				getbalanceparm({}).then((res) => {
					console.log(res);
					if( res.Ret === 200 ){
						this.addForm.UnlogBalance=res.UnlogBalance;
						this.HaveWhite=res.HaveWhite;
						this.addForm.WhiteUserBalance=res.WhiteUserBalance;
						this.addForm.DirectLoanBalance=res.DirectLoanBalance;
						this.addForm.NormalBalance=res.NormalBalance;
					}
				});
			},
	     	addSubmit(){
				 
	     		this.$refs.addForm.validate((valid) => {
					if( valid ){
// 						if( this.addForm.UnlogBalance%100!=0 || this.addForm.UnlogBalance<=0 ){
// 							this.$message.error( "未登录状态下：请输入100的整数倍金额!" );
// 							return false;
// 						}
						if( this.HaveWhite&&(this.addForm.WhiteUserBalance%100!=0 || this.addForm.WhiteUserBalance<=0) ){
							this.$message.error( "白名单用户建议额度：请输入100的整数倍金额!" );
							return false;
						}
						if( this.addForm.DirectLoanBalance%100!=0 || this.addForm.DirectLoanBalance<=0 ){
							this.$message.error( "首页展示额度：请输入100的整数倍金额!" );
							return false;
						}
						if( this.addForm.NormalBalance%100!=0 || this.addForm.NormalBalance<=0 ){
							this.$message.error( "系统通过建议额度：请输入100的整数倍金额!" );
							return false;
						}
						setbalanceparm(this.addForm).then((res) => {
							if( res.Ret === 200 ){
								this.$message.success( res.Msg );
								let that=this;
								setTimeout(function(){
									that.historyBack();
								},1000);
							}
							if(res.Ret == 100){
								this._sendCode(this.addForm,setbalanceparm).then(res=>{
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