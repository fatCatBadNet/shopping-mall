<template>
	<div style="padding-bottom:80px; position:relative;">
		<el-card v-if="isshow" class="box-card" style="padding-bottom:30px;">
			<div slot="header" class="header">
				<div v-if="riskState=='SUCCESS'">
					<span style="margin-right:20px;">{{userDtl.Verifyrealname}}</span><span style="margin-right:30px;">{{userDtl.Account}}</span>
					<b style="margin-right:40px;">【授信金额{{Balance}}元，{{Opername}}  {{OperTime}}，备注：{{HandRemark}}】</b>
					<el-button type="primary" size="small" @click="rewriteDialog=true">修改额度</el-button>
				</div>
				<div v-else-if="riskState=='FAIL'">
					<span style="margin-right:20px;">{{userDtl.Verifyrealname}}</span><span style="margin-right:30px;">{{userDtl.Account}}</span>
					<b style="margin-right:40px;">【{{CloseDays==0?'永久关闭':CloseDays==7?'关闭7天':CloseDays==30?'关闭30天':''}}，{{Opername}}  {{OperTime}}，备注：{{HandRemark}}】</b>
					<el-button type="primary" size="small" @click="rewriteDialog=true">修改额度</el-button>
				</div>
				<div v-else-if="riskState=='CONFIRM'">
					<span style="margin-right:20px;">{{userDtl.Verifyrealname}}</span><span style="margin-right:30px;">{{userDtl.Account}}</span>
				</div>
			</div>
			<div style="text-align:center;">
				<el-col :span="12">
					<table border="1" cellspacing="0" cellpadding="0" bordercolor="#E8EAEE" id="dataTable">
						<tr><td>姓名</td><td>{{userDtl.Verifyrealname}}，{{userDtl.Sex}}，{{userDtl.Age}}</td></tr>
						<tr><td>手机号</td><td>{{userDtl.Account}}</td></tr>
						<tr><td>身份证号</td><td>{{userDtl.IdCard}}</td></tr>
						<!-- <tr v-if="userDtl.ZmScore>1"><td>芝麻分</td><td>{{userDtl.ZmScore}}</td></tr>
						<tr v-else><td>灵芝分</td><td>{{userDtl.XgScore}}</td></tr> -->
						<tr><td>{{Zmxy.ParamZh}}</td><td>{{Zmxy.ParamValue}}</td></tr>
					</table>
				</el-col>
				<el-col :span="11" :offset="1" style="padding-bottom:30px;">
					<div v-if="FkAdviceResult=='PASS'">
						<img src="~@/assets/img/riskSuccess.png" style="height:128px;" />
						<p style="margin:20px auto 30px;">建议结果：授信金额 {{FkAdviceBalance}} 元</p>
					</div>
					<div v-else-if="FkAdviceResult=='REFUSEALL'">
						<p style="margin:20px auto;">建议结果：永久关闭</p>
						<img src="~@/assets/img/riskFill.png" style="height:128px;" />
						<p style="margin-top:20px;">理由：{{reason}}</p>
					</div>
					<div v-else-if="FkAdviceResult==''">
						<img src="~@/assets/img/riskconfirm.png" style="height:128px;" />
						<p style="margin:20px auto 30px;">系统处理中</p>
					</div>
					<div v-else-if="FkAdviceResult=='SOURCEMANUAL'">
						<img src="~@/assets/img/riskconfirm.png" style="height:128px;" />
						<p style="margin:20px auto 30px;">人工审核</p>
					</div>
					<div v-else>
						<p style="margin:20px auto;">建议结果：关闭{{FkAdviceResult=='REFUSE7'?7:FkAdviceResult=='REFUSE30'?30:''}}天</p>
						<img src="~@/assets/img/close30.png" style="height:128px;" />
						<p style="margin-top:20px;">理由：{{reason}}</p>
					</div>
				</el-col>
			</div>
		</el-card>
		<div v-if="riskState=='CONFIRM'&&FkAdviceResult!=''" style="height:80px; background:rgba(255,255,255,1); text-align:center; font:16px/80px '微软雅黑'; box-shadow:0 0 10px #ddd; position:fixed; bottom:20px; right:40px; left:165px; z-index:10;">
			<el-button type="primary" size="medium" style="height:40px; margin:0 15px;" @click="agreeReject(1,null)">授信通过</el-button>
			<el-button type="primary" plain size="medium" style="height:40px; margin:0 15px;" @click="agreeReject(2,7)">关闭7天</el-button>
			<el-button type="primary" plain size="medium" style="height:40px; margin:0 15px;" @click="agreeReject(2,30)">关闭30天</el-button>
			<el-button type="primary" plain size="medium" style="height:40px; margin:0 15px;" @click="agreeReject(2,99)">永久关闭</el-button>
		</div>
		<!-- 授信通过、拒绝弹框 -->
		<el-dialog :title="infoForm.Agree==1?'授信通过':'拒绝授信'" :visible.sync="showDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="620px">
			<el-form :model="infoForm" :rules="rules" label-width="85px" ref="infoForm">
				<el-form-item v-if="infoForm.Agree==1" prop="CreateLimit" label="授信金额">
				    <el-input type="text" v-model.number="infoForm.CreateLimit" placeholder="请输入授信金额" style="width:130px;"></el-input>
				    <span style="color:#999; font-size:12px; margin-left:10px;">填写金额即为用户可借金额，请谨慎填写（{{BalanceDownLimit}}元-{{BalanceUpLimit}}元）</span>
				</el-form-item>
				<el-form-item label="备 注">
				    <el-input type="textarea" v-model="infoForm.Remark" placeholder="请输入备注（选填）" :rows="3" style="width:90%;"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="Submit">确定</el-button>
				<el-button @click.native="showDialog=false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 修改金额弹框 -->
		<el-dialog title="修改金额" :visible.sync="rewriteDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="660px">
			<el-form :model="rewriteForm" :rules="rules" label-width="80px" ref="rewriteForm">
				<el-form-item prop="CreateLimit" label="授信金额">
				    <el-input type="text" v-model.number="Balance" placeholder="请输入" disabled style="width:120px;"></el-input>
				    <span>改为</span>
				    <el-input type="text" v-model.number="rewriteForm.CreateLimit" placeholder="请输入金额" style="width:120px;"></el-input>
				    <span style="color:#999; font-size:12px; margin-left:10px;">修改额度区间为{{BalanceDownLimit}}元-{{BalanceUpLimit}}元</span>
				</el-form-item>
				<el-form-item label="备注">
				    <el-input type="textarea" v-model="rewriteForm.Remark" placeholder="请输入备注信息（选填）" style="width:90%;"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="rewriteSubmit">确定</el-button>
				<el-button @click.native="rewriteDialog=false">取消</el-button>
			</div>
		</el-dialog>
		<el-card class="box-card" v-if="isloading">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="风控报告" name="风控报告">
		    		<fkreport :uid="uid" @getReason="setReason"></fkreport>
		    	</el-tab-pane>
				<el-tab-pane label="用户详情" name="用户详情">
		    		<userdtl :uid="uid"></userdtl>
		    	</el-tab-pane>
		    	<el-tab-pane label="借款记录" name="借款记录">
		    		<loanrecord :uid="uid" @goloanrecord="activeName='还款记录'"></loanrecord>
		    	</el-tab-pane>
		    	<el-tab-pane label="续期记录" name="续期记录">
		    		<renewrecord :uid="uid"></renewrecord>
		    	</el-tab-pane>
		    	<el-tab-pane label="还款记录" name="还款记录">
		    		<repaymentrecord :uid="uid"></repaymentrecord>
		    	</el-tab-pane>
		    	<el-tab-pane label="报告购买记录" name="报告购买记录">
		    		<reportbuyrecord :uid="uid"></reportbuyrecord>
		    	</el-tab-pane>
		    	<el-tab-pane label="银行卡" name="银行卡">
		    		<usersbankcard :uid="uid"></usersbankcard>
		    	</el-tab-pane>
		    	<el-tab-pane label="消息中心" name="消息中心">
		    		<messagecenter :uid="uid"></messagecenter>
		    	</el-tab-pane>
		    	<el-tab-pane label="邀请记录" name="邀请记录">
		    		<invitationrecord :uid="uid"></invitationrecord>
		    	</el-tab-pane>
		    	<el-tab-pane label="登录信息" name="登录信息">
		    		<loginrecords :uid="uid"></loginrecords>
		    	</el-tab-pane>
		    	<el-tab-pane label="联系人&通讯录" name="联系人&通讯录">
		    		<addressbook :uid="uid"></addressbook>
		    	</el-tab-pane>
		    	<el-tab-pane label="手机运营商" name="手机运营商">
		    		<phoneoperators :uid="uid"></phoneoperators>
		    	</el-tab-pane>
		    	<el-tab-pane label="实名认证" name="实名认证">
		    		<identify :uid="uid"></identify>
		    	</el-tab-pane>
		    	<el-tab-pane label="联系历史" name="联系历史">
		    		<contacthistory :uid="uid"></contacthistory>
		    	</el-tab-pane>
				<el-tab-pane label="通讯录比对" name="通讯录比对">
					<phoneoperatorsdddress :uid="uid"></phoneoperatorsdddress>
				</el-tab-pane>
		  	</el-tabs>
		</el-card>
	</div>
</template>

<script>
	import { auditdtl,auditedit,authuserdtl,fkcreditaudit,updatecreditamount } from 'api/api.js';
	import userdtl from '../../components/userDtl/userdtl.vue';
	import loginrecords from '../../components/userDtl/loginrecords.vue';
	import reportbuyrecord from '../../components/userDtl/reportbuyrecord.vue';
	import messagecenter from '../../components/userDtl/messagecenter.vue';
	import repaymentrecord from '../../components/userDtl/repaymentrecord.vue';
	import loanrecord from '../../components/userDtl/loanrecord.vue';
	import usersbankcard from '../../components/userDtl/usersbankcard.vue';
	import invitationrecord from '../../components/userDtl/invitationrecord.vue';
	import identify from '../../components/userDtl/identify.vue';
	import addressbook from '../../components/userDtl/addressbook.vue';
	import phoneoperators from '../../components/userDtl/phoneoperatorsNew.vue';
	import renewrecord from '../../components/userDtl/renewrecord.vue';
	import contacthistory from '../../components/userDtl/contacthistory.vue';
	import fkreport from '../../components/userDtl/fkreport.vue';
	import phoneoperatorsdddress from '@/components/userDtl/phoneoperators.vue';
	import echarts from 'echarts';
	import '@/assets/js/macarons.js'
	export default {
		data(){
			return {
				isshow:false,
				isloading:false,
				activeName:'风控报告',
				uid:parseInt(this.$route.params.id),
				riskState:'',
				Balance:'',
				CloseDays:'',
				PreHandState:'',
				HandRemark:'',
				Opername:'',
				OperTime:'',
				IsHand:false,
				BalanceDownLimit:null,
				BalanceUpLimit:null,
				FkAdviceResult:'',  //风控建议结果
				FkAdviceBalance:null,  //风控建议金额
				userDtl:{},
				Zmxy:{},
				reason:'',  //失败理由
				showDialog:false,  //授信通过、关闭
				infoForm:{
					Uid:parseInt(this.$route.params.id),
					Agree:null,
					CreateLimit:null,
					RefuseDate:null,
					Remark:''
				},
				rules:{
					CreateLimit:[{
						required:true,
						message:'请输入金额',
						trigger:'blur'
					}]
				},
				rewriteDialog:false,  //修改金额
				rewriteForm:{
					Uid:parseInt(this.$route.params.id),
					CreateLimit:null,
					Remark:''
				},
				rules:{
					CreateLimit:[{
						required:true,
						message:'请输入金额',
						trigger:'blur'
					}]
				}
			}
		},
		mounted(){
			this.getDtl();
			this.getAuthuserdtl();
		},
		methods: {
			getDtl(){
				auditdtl({id:this.uid}).then((res) => {
					console.log(res);
					if( res.Ret == 200 ){
						this.riskState=res.State;
						this.Balance=res.Balance;
						this.CloseDays=res.CloseDays;
						this.HandRemark=res.HandRemark;
						this.Opername=res.Opername;
						this.OperTime=res.OperTime;
						this.PreHandState=res.PreHandState;
						this.IsHand=res.IsHand;
						this.FkAdviceResult=res.FkAdviceResult;
						this.FkAdviceBalance=res.FkAdviceBalance;
						this.BalanceDownLimit=res.BalanceDownLimit;
						this.BalanceUpLimit=res.BalanceUpLimit;
						this.isshow=true;
						this.isloading=true;
					}
				});
			},
			agreeReject(type,day){  //授信同意、拒绝
				this.infoForm.Agree=type;
				this.infoForm.RefuseDate=day;
				if( type==1 ){
					this.infoForm.CreateLimit=this.FkAdviceBalance;
				}else{
					this.infoForm.CreateLimit=null;
				}
				this.infoForm.Remark='';
				this.showDialog=true;
				console.log(this.infoForm);
			},
			Submit(){  //授信同意、拒绝提交
				this.$refs.infoForm.validate((valid) => {
					if( valid ){
						if( this.infoForm.Agree==1 ){
							if( this.infoForm.CreateLimit<this.BalanceDownLimit || this.infoForm.CreateLimit>this.BalanceUpLimit ){
								this.$message.error( "你输入的授信金额不在额度区间内！" );
								return false;
							}
							if( this.infoForm.CreateLimit%100!=0 ){
								this.$message.error( "金额需为100的整数倍" );
								return false;
							}
						}
						fkcreditaudit(this.infoForm).then((res) => {
							if( res.Ret == 200 ){
								this.$message.success( res.Msg );
								this.isloading=false;
								this.getDtl();
								this.showDialog=false;
							}
						});
					}
				});
			},
			getAuthuserdtl(){
				let params = {Uid:parseInt(this.uid)}
				authuserdtl(params).then((res) => {
					console.log(res);
					if( res.Ret === 200 ){
						this.userDtl=res.Um;
						this.Zmxy=res.Zmxy;
					}
				});
			},
			rewriteSubmit(){  //修改额度
				this.$refs.rewriteForm.validate((valid) => {
					if( valid ){
						if( this.rewriteForm.CreateLimit<this.BalanceDownLimit || this.rewriteForm.CreateLimit>this.BalanceUpLimit ){
							this.$message.error( "你输入的授信金额不在额度区间内！" );
							return false;
						}
						if( this.rewriteForm.CreateLimit%100!=0 ){
							this.$message.error( "修改后金额需为100的整数倍" );
							return false;
						}
						updatecreditamount(this.rewriteForm).then((res) => {
							if( res.Ret == 200 ){
								this.$message.success( res.Msg );
								this.isloading=false;
								this.getDtl();
								this.rewriteDialog=false;
							}
						});
					}
				});
			},
	      	setReason(val){
	      		console.log("val：",val);
	      		this.reason=val;
	      	}
		},
		components:{fkreport,userdtl,loginrecords,reportbuyrecord,messagecenter,repaymentrecord,loanrecord,usersbankcard,invitationrecord,identify,addressbook,phoneoperators,renewrecord,contacthistory,phoneoperatorsdddress}
	}
</script>

<style lang="scss" scoped>
	.box-card{ margin:6px; }
	.el-card{ padding-bottom:0; }
	.discard{ width:100%; height:44px; padding:0 20px; box-sizing:border-box; font:14px/44px "微软雅黑"; background:#f2f2f2; margin-top:15px; }
	.discard>label{ color:#999; }
	.discard>span{ margin-right:50px; }
	#chartLine{ flex:0 0 340px; width:340px; height:320px; margin-right:30px; }
	#dataTable{ width:100%; margin-top:15px; }
	#dataTable td{ height:48px; }
	#dataTable tr td:nth-of-type(1){ width:200px; text-align:center; background:#F5F7FA; }
	#dataTable tr td:nth-of-type(2){ padding-left:20px; text-align:left; }
</style>