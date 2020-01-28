<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">续期开关设置</div>
			<el-form :model="addForm" :rules="rules" label-width="120px" ref="addForm">
				<el-form-item label="未逾期订单" prop="Switch" style="overflow:auto;">
		          	<el-switch v-model="addForm.Switch" active-text="开" :active-value="true" inactive-text="关" :inactive-value="false" @change="switchChange" style="float:left; margin:10px 30px 0;"></el-switch>
		          	<i class="el-icon-info" style="float:left; font-size:18px; color:#108EE9; margin:10px 20px;"></i>
		          	<span style="display:inline-block; width:820px; padding:11px 20px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">
		          		开启后，用户当前订单若未逾期，则可以看到续期入口。支付手续费及下期借款的服务费后，可按照选择的续期期限续借1笔<br />
						例：1月1日借款7天，1月7日为到期还款日。用户1月7日或之前办理续期，1月8日为续期订单的开始计息日，若续期期限为7天，1月14日为续期订单的到期日
					</span>
		        </el-form-item>
		        <el-form-item label="逾期订单" prop="RenewOverdueSwitch" style="overflow:auto;">
		          	<el-switch v-model="addForm.RenewOverdueSwitch" active-text="开" :active-value="true" inactive-text="关" :inactive-value="false" style="float:left; margin:10px 30px 0;"></el-switch>
		          	<i class="el-icon-info" style="float:left; font-size:18px; color:#108EE9; margin:10px 20px;"></i>
		          	<span style="display:inline-block; width:820px; padding:11px 20px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">
		          		开启后，用户当前订单若已逾期，则可以看到续期入口。支付逾期费、手续费及下期借款的服务费后，可按照选择的续期期限续借1笔<br />
						关闭后，逾期订单将不能进行续期。
					</span>
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
	import { getrenewalswitch,setrenewalswitch } from 'api/api.js';
	export default {
		data() {
			return {
				addForm:{
					Switch:false,
					RenewOverdueSwitch:false
				},
				rules: {
					Switch: [{
						required:true,
						message:'请设置续期开关',
						trigger:'blur'
					}],
					RenewOverdueSwitch: [{
						required:true,
						message:'请设置逾期订单开关',
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
				getrenewalswitch({}).then((res) => {
					console.log(res);
					if( res.Ret === 200 ){
						this.addForm.Switch=res.Switch;
						this.addForm.RenewOverdueSwitch=res.RenewOverdueSwitch;
					}
				});
			},
			// switchChange(){
			// 	if( this.addForm.Switch ){
			// 		this.addForm.RenewOverdueSwitch=true;
			// 	}
			// },
	     	addSubmit(){
	     		this.$refs.addForm.validate((valid) => {
					if( valid ){
						setrenewalswitch(this.addForm).then((res) => {
							if( res.Ret === 200 ){
								this.$message.success( res.Msg );
								let that=this;
								setTimeout(function(){
									that.historyBack();
								},1000);
							}
							if(res.Ret == 100){
								this._sendCode(this.addForm,setrenewalswitch).then(res=>{
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