<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				提醒设置
				<span style=" color:#1989FA;float:right;margin-right:120px;">
					首次开启语音提醒和短信提醒，请联系商务人员进行相关配置
				</span>
				<i class="el-icon-info" style=" font-size:18px; color:#108EE9; float:right;margin-right:10px;"></i>
			</div>
			<el-form :model="addForm"  label-width="200px" ref="addForm">
				<el-form-item label="针对仅注册用户" prop="OnlyRegSwitch" style="position: relative;">
		          	<el-select v-model="addForm.OnlyRegSwitch" placeholder="请选择"  style="float:left;">
				      	<el-option label="不提醒" value="0"></el-option>
				      	<el-option label="语音提醒" value="1"></el-option>
				      	<el-option label="短信提醒" value="2"></el-option>
				      	<el-option label="语音+短信提醒" value="3"></el-option>
				    </el-select>
		          	<i class="el-icon-info" style="float:left; font-size:18px; color:#108EE9; margin:10px 20px;"></i>
		          	<span style="position: absolute; display:inline-block; padding:11px 20px; color:#1989FA; border:1px solid #108EE9; border-radius:5px; line-height:1.5;">
		          		开启AI语音提醒后，系统将每天9点给对应的用户拨打语音电话进行提醒<br />为了避免休息时间影响客户，智能语音系统工作时间为早上9-12点，下<br />午14-20点；一天最多对同一个用户打两次
		          	</span>
		        </el-form-item>
				<el-form-item label="未完成全部认证信息的用户" prop="NoAllAuthSwitch" style="position: relative;">
		          	<el-select v-model="addForm.NoAllAuthSwitch" placeholder="请选择"  style="float:left;">
				      	<el-option label="不提醒" value="0"></el-option>
				      	<el-option label="语音提醒" value="1"></el-option>
				      	<el-option label="短信提醒" value="2"></el-option>
				      	<el-option label="语音+短信提醒" value="3"></el-option>
				    </el-select>
		        </el-form-item>
				<el-form-item label="已全部认证但未借款用户" prop="AllAuthNoLoanSwitch" style="position: relative;">
		          	<el-select v-model="addForm.AllAuthNoLoanSwitch" placeholder="请选择"  style="float:left;">
				      	<el-option label="不提醒" value="0"></el-option>
				      	<el-option label="语音提醒" value="1"></el-option>
				      	<el-option label="短信提醒" value="2"></el-option>
				      	<el-option label="语音+短信提醒" value="3"></el-option>
				    </el-select>
		        </el-form-item>
				<el-form-item label="白名单未借款用户" prop="WriteNoLoanSwitch" style="position: relative;">
		          	<el-select v-model="addForm.WriteNoLoanSwitch" placeholder="请选择"  style="float:left;">
				      	<el-option label="不提醒" value="0"></el-option>
				      	<el-option label="语音提醒" value="1"></el-option>
				      	<el-option label="短信提醒" value="2"></el-option>
				      	<el-option label="语音+短信提醒" value="3"></el-option>
				    </el-select>
		        </el-form-item>
				<el-form-item style="width:400px;padding-top:100px;">
					<el-button type="primary" @click="addSubmit">确定</el-button>
					<el-button @click.native="historyBack">返回</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import { loanswitch,setloanswitch } from 'api/api.js';
	export default {
		data() {
			return {
				addForm:{
					OnlyRegSwitch:'0',
					NoAllAuthSwitch:'0',
					AllAuthNoLoanSwitch:'0',
					WriteNoLoanSwitch:'0'
				}
			}
		},
		mounted() {
			this.getdtl();
		},
		methods: {
			getdtl(){
				loanswitch({}).then((res) => {
					console.log(res);
					if( res.Ret === 200 ){
						this.addForm.OnlyRegSwitch = res.OnlyRegSwitch;
						this.addForm.NoAllAuthSwitch = res.NoAllAuthSwitch;
						this.addForm.AllAuthNoLoanSwitch = res.AllAuthNoLoanSwitch;
						this.addForm.WriteNoLoanSwitch = res.WriteNoLoanSwitch;
					}
				});
			},
	     	addSubmit(){
	     		setloanswitch(this.addForm).then((res) => {
					if( res.Ret === 200 ){
						this.$message.success( res.Msg );
						let that=this;
						setTimeout(function(){
							that.historyBack();
						},1000);
					}
					if(res.Ret == 100){
						this._sendCode(this.addForm,setloanswitch).then(res=>{
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

<style scoped lang="scss"></style>