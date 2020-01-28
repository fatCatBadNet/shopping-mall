<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">AI智能语音提醒设置</div>
			<el-form :model="addForm"  label-width="140px" ref="addForm">
				<el-form-item v-if="SwitchVoiceFlag==2" label="到期用户提醒"  style="overflow:auto;">
		          	<el-switch v-model="addForm.SetCurrRetLoanAISwitch" active-text="开" :active-value="true" inactive-text="关" :inactive-value="false"  style="float:left; margin:10px 30px 0;"></el-switch>
		          	<i class="el-icon-info" style="float:left; font-size:18px; color:#108EE9; margin:10px 20px;"></i>
		          	<span style="display:inline-block; width:820px; padding:11px 20px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">
		          		开启AI智能语音系统后，系统将每天9点给当天到期用户拨打语音电话进行提醒<br />
                        为了避免休息时间影响客户，智能语音工作时间为早上9-12点，下午14-20点；一天最多对同一个用户打两次<br />
                        首次开启，请联系商务人员进行相关配置，开启或关闭 次日生效
					</span>
		        </el-form-item>

				<el-form-item v-if="SwitchVoiceFlag==1" label="逾期一天用户提醒"  style="overflow:auto;">
		          	<el-switch v-model="addForm.OverOneSwitch" active-text="开" :active-value="true" inactive-text="关" :inactive-value="false"  style="float:left; margin:10px 30px 0;"></el-switch>
		          	<i class="el-icon-info" style="float:left; font-size:18px; color:#108EE9; margin:10px 20px;"></i>
		          	<span style="display:inline-block; width:820px; padding:11px 20px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">
		          		开启AI智能语音系统后，系统将每天10点给逾期一天用户拨打语音电话进行提醒<br />
                        为了避免休息时间影响客户，智能语音工作时间为早上10-12点，下午14-20点；一天最多对同一个用户打两次<br />
                        首次开启，请联系商务人员进行相关配置，开启或关闭 次日生效
					</span>
		        </el-form-item>

				<template v-if="SwitchVoiceFlag==3">
					<el-form-item  label="到期用户提醒"  style="overflow:auto;">
						<el-switch v-model="addForm.SetCurrRetLoanAISwitch" active-text="开" :active-value="true" inactive-text="关" :inactive-value="false"  style="float:left; margin:10px 30px 0;"></el-switch>
						<i class="el-icon-info" style="float:left; font-size:18px; color:#108EE9; margin:10px 20px;"></i>
						<span style="display:inline-block; width:820px; padding:11px 20px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">
							开启AI智能语音系统后，系统将每天9点给当天到期用户拨打语音电话进行提醒<br />
							为了避免休息时间影响客户，智能语音工作时间为早上9-12点，下午14-20点；一天最多对同一个用户打两次<br />
							首次开启，请联系商务人员进行相关配置，开启或关闭 次日生效
						</span>
					</el-form-item>

					<el-form-item  label="逾期一天用户提醒"  style="overflow:auto;">
						<el-switch v-model="addForm.OverOneSwitch" active-text="开" :active-value="true" inactive-text="关" :inactive-value="false"  style="float:left; margin:10px 30px 0;"></el-switch>
						<i class="el-icon-info" style="float:left; font-size:18px; color:#108EE9; margin:10px 20px;"></i>
						<span style="display:inline-block; width:820px; padding:11px 20px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">
							开启AI智能语音系统后，系统将每天10点给逾期一天用户拨打语音电话进行提醒<br />
							为了避免休息时间影响客户，智能语音工作时间为早上10-12点，下午14-20点；一天最多对同一个用户打两次<br />
							首次开启，请联系商务人员进行相关配置，开启或关闭 次日生效
						</span>
					</el-form-item>
				</template>
				
				<el-form-item style="width:300px;padding-top:100px;">
					<el-button type="primary" @click="addSubmit">确定</el-button>
					<el-button @click.native="historyBack">返回</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import { callswitch,setcall } from 'api/api.js';
	export default {
		data() {
			return {
				SwitchVoiceFlag:'',
				addForm:{
					SetCurrRetLoanAISwitch:false,
					OverOneSwitch:false
				},
				// rules: {
				// 	Switch: [{
				// 		required:true,
				// 		message:'请设置续期开关',
				// 		trigger:'blur'
				// 	}],
				// }
			}
		},
		mounted() {
			this.getdtl();
		},
		methods: {
			getdtl(){
				callswitch({}).then((res) => {
					console.log(res);
					if( res.Ret === 200 ){
						this.addForm.SetCurrRetLoanAISwitch=res.SetCurrRetLoanAISwitch;
						this.addForm.OverOneSwitch=res.OverOneSwitch;
						this.SwitchVoiceFlag = res.SwitchVoiceFlag;
					}
				});
			},
	     	addSubmit(){
	     		this.$refs.addForm.validate((valid) => {
					if( valid ){
						let params = this.SwitchVoiceFlag == 2
						 ? { SetCurrRetLoanAISwitch:this.addForm.SetCurrRetLoanAISwitch }
						  : this.SwitchVoiceFlag == 3 ? 
						  { SetCurrRetLoanAISwitch:this.addForm.SetCurrRetLoanAISwitch,OverOneSwitch:this.addForm.OverOneSwitch }
						   : { OverOneSwitch:this.addForm.OverOneSwitch };
						setcall(params).then((res) => {
							if( res.Ret === 200 ){
								this.$message.success( res.Msg );
								let that=this;
								setTimeout(function(){
									that.historyBack();
								},1000);
							}
							if(res.Ret == 100){
								this._sendCode(params,setcall).then(res=>{
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
			 	sessionStorage.setItem("adminset",true);
		    	history.back();
		    }
		}
	}
</script>

<style scoped lang="scss"></style>