<template>
	<div class="audit-wrapper">
		<div>
			<el-col :span="8">
				<el-card class="box-card h400">
					<div slot="header" class="cardhead">借款信息</div>
					<el-card shadow="always" class="box-card-item">
						<el-col :span="12">
							<span>{{LoanAmount}}</span>
							<label>元</label>
						</el-col>
						<el-col :span="12">
							<span>{{Term}}</span>
							<label>天</label>
						</el-col>
						<el-col :span="12">借款金额</el-col>
						<el-col :span="12">借款期限</el-col>
				    </el-card>
					<div class="discard">
						<label>姓名：</label>
						<span>{{LoanInfo.Verifyrealname}}</span>
						<label>手机号：</label>
						<span>{{LoanInfo.Account}}</span>
					</div>
				    <div class="discard">
						<label>利息：</label>
						<span>{{TaxAmount}}元</span>
						<label>信用报告：</label>
						<span>{{CreditReportAmount}}元</span>
						<label>服务费：</label>
						<span>{{LoanService}}元</span>
					</div>
					<div class="discard">
						<label>借款时间：</label>
						<span>{{LoanDate}}</span>
					</div>
					<!--<div class="discard">
						<label>借款起止：</label>
						<span>{{LoanDateStartEnd}}</span>
					</div>-->
				</el-card>
			</el-col>
			<el-col :span="16">
				<el-card class="box-card h400">
					<div slot="header" class="cardhead">风控审核建议</div>
					<div class="content">
						<div class="content-chart" id="chartLine"></div>
						<div class="content-score">
							<p>系统评分 <span class="fs18">{{CreditScore}}</span> 分</p>
							<p v-if="false">理由：<span>{{reason}}</span></p>
							<p v-if="false">建议结果：
								<span v-if="LoanInfo.FkAdviceResult=='PASS'">通过（{{LoanInfo.FkAdviceBalance}}元）</span>
								<span v-else >{{LoanInfo.FkAdviceResult=="REFUSE0"?"单次关闭":LoanInfo.FkAdviceResult==""?"系统处理中":LoanInfo.FkAdviceResult=="REFUSE7"?"拒绝7天":LoanInfo.FkAdviceResult=="REFUSE30"?"关闭30天":LoanInfo.FkAdviceResult=="REFUSEALL"?"永久拒绝":LoanInfo.FkAdviceResult=="SOURCEMANUAL"?"人工审核":""}}</span>
							</p>
						</div>
					</div>
				</el-card>
			</el-col>
		</div>
		<el-card class="box-card" v-if="isloading">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="用户详情" name="用户详情">
		    		<userdtl :uid="uid"></userdtl>
		    	</el-tab-pane>
				<el-tab-pane label="信用报告" name="信用报告">
		    		<messagecenter :uid="uid"></messagecenter>
		    	</el-tab-pane>
				<el-tab-pane label="风控报告" name="风控报告" v-if="false">
		    		<fkreport :uid="uid" @getReason="setReason"></fkreport>
		    	</el-tab-pane>
				<el-tab-pane label="手机运营商" name="手机运营商">
		    		<phoneoperators :uid="uid"></phoneoperators>
		    	</el-tab-pane>
				<el-tab-pane label="实名认证" name="实名认证">
		    		<identify :uid="uid"></identify>
		    	</el-tab-pane>
				<el-tab-pane label="通讯录比对" name="通讯录比对">
					<phoneoperatorsdddress :uid="uid"></phoneoperatorsdddress>
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
		    	<!-- <el-tab-pane label="报告购买记录" name="报告购买记录">
		    		<reportbuyrecord :uid="uid"></reportbuyrecord>
		    	</el-tab-pane> -->
		    	<el-tab-pane label="银行卡" name="银行卡">
		    		<usersbankcard :uid="uid"></usersbankcard>
		    	</el-tab-pane>
		    	<!-- <el-tab-pane label="邀请记录" name="邀请记录">
		    		<invitationrecord :uid="uid"></invitationrecord>
		    	</el-tab-pane> -->
		    	<el-tab-pane label="登录信息" name="登录信息">
		    		<loginrecords :uid="uid"></loginrecords>
		    	</el-tab-pane>
		    	<el-tab-pane label="联系人&通讯录" name="联系人&通讯录">
		    		<addressbook :uid="uid"></addressbook>
		    	</el-tab-pane>
		    	<el-tab-pane label="联系历史" name="联系历史">
		    		<contacthistory :uid="uid"></contacthistory>
		    	</el-tab-pane>
		  	</el-tabs>
		</el-card>
		
		<div v-if="source=='refuse'">
			<div style="height:80px; background:rgba(255,255,255,1); text-align:center; font:16px/80px '微软雅黑'; box-shadow:0 0 10px #ddd; position:fixed; bottom:20px; right:40px; left:165px; z-index:10;">
				<el-button type="primary" plain size="medium" style="height:40px; margin:0 15px;" @click="reject(0)">单次关闭</el-button>
				<el-button type="primary" plain size="medium" style="height:40px; margin:0 15px;" @click="reject(7)">关闭7天</el-button>
				<el-button type="primary" plain size="medium" style="height:40px; margin:0 15px;" @click="reject(30)">关闭30天</el-button>
				<el-button type="primary" plain size="medium" style="height:40px; margin:0 15px;" @click="reject(99)">永久关闭</el-button>
			</div>
		</div>
		<div v-else>
			<div v-if="isshow" style="height:80px; background:rgba(255,255,255,1); text-align:center; font:16px/80px '微软雅黑'; box-shadow:0 0 10px #ddd; position:fixed; bottom:20px; right:40px; left:165px; z-index:10;">
				<el-button type="primary" size="medium" style="height:40px; margin:0 15px;" @click="rewriteDialog=true">同意放款</el-button>
				<el-button type="primary" plain size="medium" style="height:40px; margin:0 15px;" @click="reject(0)">单次关闭</el-button>
				<el-button type="primary" plain size="medium" style="height:40px; margin:0 15px;" @click="reject(7)">关闭7天</el-button>
				<el-button type="primary" plain size="medium" style="height:40px; margin:0 15px;" @click="reject(30)">关闭30天</el-button>
				<el-button type="primary" plain size="medium" style="height:40px; margin:0 15px;" @click="reject(99)">永久关闭</el-button>
			</div>
		</div>
		
		<!-- 同意弹框 -->
		<el-dialog title="同意放款" :visible.sync="rewriteDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="700px">
			<el-form :model="rewriteForm" :rules="rules" label-width="120px" ref="rewriteForm">
				<el-form-item label="申请借款金额">
				    <el-input type="text" v-model="LoanAmount" placeholder="请输入" disabled style="width:217px;"></el-input>
				</el-form-item>
				<el-form-item prop="NewMoney" label="放款金额">
				    <el-input type="number" v-model.number="rewriteForm.NewMoney" placeholder="请输入金额" min="500" style="width:217px;"></el-input>
				    <span style="color:#999; font-size:12px; margin-left:10px;">不得高于商户设置中的授信额度上限，不得低于500元</span>
				</el-form-item>
				<el-form-item prop="Channel" label="放款方式">
					<el-select v-model="rewriteForm.Channel">
						<el-option label="代付" value="合利宝"></el-option>
						<el-option label="支付宝" value="支付宝"></el-option>
						<el-option label="微信" value="微信"></el-option>
						<el-option label="银行卡" value="银行转账"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注">
				    <el-input type="textarea" v-model="rewriteForm.Remark" placeholder="请填写备注——选填" :rows="3" style="width:400px;"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="rewriteSubmit">立即放款</el-button>
				<el-button @click.native="rewriteDialog=false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 拒绝弹框 -->
		<el-dialog title="拒绝放款" :visible.sync="showDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="760px">
			<el-form :model="infoForm" label-width="85px" ref="infoForm">
				<el-form-item label="备注：">
					<el-input type="textarea" v-model="infoForm.Remark" placeholder="请填写备注——选填" :rows="3" style="width:590px;"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="Submit">提交</el-button>
				<el-button @click.native="showDialog=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { loaninfo,loangiveout,loanrewrite,loanrewriteandgiveout } from 'api/api.js';
	import fkreport from '../../components/userDtl/fkreport.vue';
	import userdtl from '../../components/userDtl/userdtl.vue';
	import loginrecords from '../../components/userDtl/loginrecords.vue';
	import reportbuyrecord from '../../components/userDtl/reportbuyrecord.vue';
	// import messagecenter from '../../components/userDtl/messagecenter.vue';
	import messagecenter from './messagecenter.vue';
	import repaymentrecord from '../../components/userDtl/repaymentrecord.vue';
	import loanrecord from '../../components/userDtl/loanrecord.vue';
	import usersbankcard from '../../components/userDtl/usersbankcard.vue';
	import invitationrecord from '../../components/userDtl/invitationrecord.vue';
	import identify from '../../components/userDtl/identify.vue';
	import addressbook from '../../components/userDtl/addressbook.vue';
	import phoneoperators from '../../components/userDtl/phoneoperatorsNew.vue'; //旧的手机运营商
	// import phoneoperators from '../../components/userDtl/newPhoneoperators.vue';
	// import phoneoperators from './newPhoneoperator.vue';
	import renewrecord from '../../components/userDtl/renewrecord.vue';
	import contacthistory from '../../components/userDtl/contacthistory.vue';
	import phoneoperatorsdddress from '@/components/userDtl/phoneoperators.vue';
	import echarts from 'echarts';
	import '@/assets/js/macarons.js'
	export default {
		data(){
			return {
				source:sessionStorage.getItem("listsource") || null,
				authId:parseInt(this.$route.params.id),
				activeName:'用户详情',
				isloading:false,
				uid:null,
				LoanInfo:{},
				CreditReportAmount:null,
				LoanAmount:null,
				LoanDate:"",
				LoanDateStartEnd:"",
				TaxAmount:null,
				LoanService:null,
				Term:null,
				CreditScore:null,
				isshow:false,  //是否展示底部同意、拒绝点击导航条
				rewriteDialog:false,  //同意放款
				rewriteForm:{
					Uid:null,
					Agree:1,  //1同意 2拒绝
					LoanId:parseInt(this.$route.params.id),
					NewMoney:null,
					Channel:'合利宝',
					Remark:''
				},
				rules:{
					NewMoney:[{
						required:true,
						message:'请输入放款金额',
						trigger:'blur'
					}],
					Channel:[{
						required:true,
						message:'请选择放款方式'
					}]
				},
				showDialog:false,  //拒绝放款
				infoForm:{
					Uid:null,
					Agree:2,  //1同意 2拒绝
					Channel:'合利宝',  //放款方式 合利宝 支付宝 微信 银行转账
					LoanId:parseInt(this.$route.params.id),
					Remark:'',
					RefuseDate:null
				},
				IsLoanRewrite:'',  //是否放开修改金额再放款权限
				LetterState:'',
				reason:""
			}
		},
		mounted(){
			console.log( this.$route.params.id );
			this.getDtl();
		},
		methods: {
			getDtl(){
				loaninfo({Id:this.authId}).then((res) => {
					console.log(res);
					if( res.Ret == 200 ){
						this.uid=res.LoanInfo.Uid;
						this.rewriteForm.Uid=res.LoanInfo.Uid;
						this.infoForm.Uid=res.LoanInfo.Uid;
						this.CreditReportAmount=res.LoanInfo.CreditReportAmount;
						this.LoanAmount=res.LoanInfo.LoanAmount;
						this.LoanDate=res.LoanInfo.LoanDate;
						this.LoanDateStartEnd=res.LoanInfo.LoanDateStartEnd;
						this.TaxAmount=res.LoanInfo.TaxAmount;
						this.LoanService=res.LoanInfo.LoanService;
						this.Term=res.LoanInfo.Term;
						this.CreditScore=res.CreditScore;
						this.IsLoanRewrite=res.IsLoanRewrite;
						this.LetterState=res.LoanInfo.LetterState;
						if( res.LoanInfo.LetterState=="CONFIRM"&&res.LoanInfo.IsLetter==1 ){
							if( res.LoanInfo.RenewCount>0 ){
								this.isshow=false;
							} else{
								this.isshow=true;
							}
						}else{
							this.isshow=false;
						}
// 						if( res.LoanInfo.InitAudit==4 ){
// 							this.rewriteForm.NewMoney=res.LoanInfo.LoanAmount;
// 						}else{
// 							this.rewriteForm.NewMoney=res.LoanInfo.FkAdviceBalance;
// 						}
						this.rewriteForm.NewMoney=res.LoanInfo.LoanAmount;
						if( res.NormalBalance<this.rewriteForm.NewMoney&&res.NormalBalance>0 ){
							this.rewriteForm.NewMoney=res.NormalBalance;
						}
						if( res.LoanInfo.FkAdviceBalance<this.rewriteForm.NewMoney&&res.LoanInfo.FkAdviceBalance>0 ){
							this.rewriteForm.NewMoney=res.LoanInfo.FkAdviceBalance;
						}
						this.LoanInfo=res.LoanInfo;
						this.drawLineChart();
						this.isloading=true;
					}
				});
			},
			rewriteSubmit(){
				this.$refs.rewriteForm.validate((valid) => {
					if( valid ){
						if( this.rewriteForm.NewMoney<500 ){
							this.$message.error( "金额不得小于500元" );
							return false;
						}
//						if( this.rewriteForm.NewMoney>this.LoanAmount ){
//							this.$message.error( "金额不得超过原借款金额" );
//							return false;
//						}
						if( this.rewriteForm.NewMoney%100!=0 ){
							this.$message.error( "修改后金额需为100的整数倍" );
							return false;
						}
						loanrewriteandgiveout(this.rewriteForm).then((res) => {
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
			Submit(){
				loanrewriteandgiveout(this.infoForm).then((res) => {
					if( res.Ret == 200 ){
						this.showDialog=false;
						this.isshow=false;
						this.$message.success( res.Msg );
					}
				});
			},
			agreedLoan(){  //同意放款
				this.infoForm.Channel="合利宝";
				this.infoForm.Agree=1;
				this.infoForm.Remark='';
				this.infoForm.RefuseDate=null;
				this.showDialog=true;
			},
			reject(day){  //拒绝放款
				this.infoForm.Channel="";
				this.infoForm.Agree=2;
				this.infoForm.Remark='';
				this.infoForm.RefuseDate=day;
				this.showDialog=true;
			},
	      	drawLineChart() {
	      		let that=this;
				this.chartLine = echarts.init(document.getElementById("chartLine"),'macarons');
			    this.chartLine.setOption({
				    tooltip : {
				        formatter: "{a} {b}: {c}分"
				    },
				    series: [
				        {
				            name: '评分',
				            type: 'gauge',
				            min:0,   
				            max:1000,    //设置刻度盘内数值区间
				            splitNumber:10,  //设置间隔区域的显示数量
				            axisLine: {            // 坐标轴线
				                lineStyle: {       // 属性lineStyle控制线条样式
				                    color:[[0.312,'#ff4500'],[1,'#1e90ff']],
				                    width:5,
				                    shadowColor:'#000', //默认透明
				                    shadowBlur:0
				                }
				            },
				            detail: {formatter:'{value}'},
				            data: [{value:this.CreditScore,name:''}]
				        }
				    ]
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
	.fs18{font-size:18px}
	.audit-wrapper{
		position: relative;
		padding-bottom: 80px;
	}
	.box-card{ 
		margin:6px; 
		&.h400{
			height: 400px;
		}
		.box-card-item{
			padding-bottom:15px;
			font:14px/30px '微软雅黑'; 
			color:#999; 
			text-align:center;
			span,label{
				color: #3A94F8;
			}
			span{
				font-weight: bold
			}
		}
	}
	.el-card{ padding-bottom:0; }
	.discard{ width:100%; height:44px; padding:0 20px; box-sizing:border-box; font:14px/44px "微软雅黑"; background:#f2f2f2; margin-top:15px; }
	.discard>label{ color:#999; }
	.discard>span{ margin-right:50px; }
	#chartLine{ flex:0 0 340px; width:340px; height:320px; margin-right:30px; }
	.content{display: flex}
	.content-score{
		display: flex;
		flex: 1;
		align-items: center;
		font-size: 14px;
		line-height: 40px;
		font-family: '微软雅黑';
		color:#b6b6b6;
		p{
			span{
				color: #333
			}
		}
	}
</style>