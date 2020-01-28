<template>
	<div style="padding-bottom:100px;">
		<section id="retundtl">
			<el-col class="item-card" :span="6" style="padding-right:5px;">
				<el-card style="box-shadow:none; box-sizing:border-box; border:1px solid #EAEAEA; padding:0 10px; height:490px;">
					<div slot="header" class="clearfix" style="color:#101010;">
						<span class="header-left">用户信息</span>
					</div>
					<el-row :span="24" class="list">
						<el-col class="user-header">
							<span style="letter-spacing: 1px;">{{userDetail.Verifyrealname}}</span>
							<img v-if="userDetail.Sex=='男'" class="sex" src="~@/assets/img/man.png" alt="" />
							<img v-else class="sex" src="~@/assets/img/woman.png" alt="" />
							<span v-if="userDetail.Marriage" class="marriage">{{userDetail.Marriage}}</span>
							<span class="id-card">{{userDetail.IdCard}}</span>
						</el-col>
						<el-col class="list-item font14">
							<span class="title">手 机 号</span>
							<span class="value">{{userDetail.Account}}</span>
						</el-col>
						<el-col class="list-item font14">
							<span class="title">邮 &nbsp;&nbsp;&nbsp; 箱</span>
							<span class="value">{{userDetail.Email}}</span>
						</el-col>
						<el-col class="list-item">
							<span class="title">身份证地址</span>
							<span class="value">{{userDetail.IdcardAddress}}</span>
						</el-col>
						<el-col class="list-item">
							<span class="title">居 住 地 址</span>
							<span class="value">{{userDetail.LiveAddress}} {{userDetail.LiveDetailAddress}}</span>
						</el-col>
						<el-col class="list-item">
							<span class="title">最近操作时间</span>
							<span class="value">{{userDetail.OperationTime}}</span>
						</el-col>
						<el-col class="bank-info">
							<p class="bank">
								<span>{{tableData.BankName}}</span>                      
		            			<span class="phone">{{tableData.BankMobile}}（预留号码）</span> 
							</p>
							<p class="card-number"> 
				            	{{tableData.CardNumber?tableData.CardNumber.slice(0,4):''}} 
				              	{{tableData.CardNumber?tableData.CardNumber.slice(4,8):''}}
				              	{{tableData.CardNumber?tableData.CardNumber.slice(8,12):''}}
				              	{{tableData.CardNumber?tableData.CardNumber.slice(12,16):''}} 
				              	{{tableData.CardNumber?tableData.CardNumber.slice(16,19):''}}
				            </p>
						</el-col>
					</el-row>
				</el-card>
			</el-col>
			<el-col class="item-card" :span="6" style="padding-right:5px;">
				<el-card style="box-shadow:none; box-sizing:border-box; border:1px solid #EAEAEA; padding:0 10px; height:490px;">
					<div slot="header" class="clearfix" style="color:#101010;">
						<span class="header-left">借款信息</span>
					</div>
					<el-row :span="24" class="list">
						<el-col class="list-item font14">
							<span class="title">待还金额</span>
							<span class="value" style="color:#3A94F8;">
		              		<span style="font-size:24px;">{{LoanBackDetail.NoReturnMoney}}</span>
							<span>元</span>
							</span>
						</el-col>
						<el-col class="list-item font14">
							<span class="title">借款金额</span>
							<span class="value">{{LoanBackDetail.Money}} 元</span>
						</el-col>
						<el-col class="list-item font14">
							<span class="title">利 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 息</span>
							<span class="value">{{LoanBackDetail.TaxAmount}} 元</span>
						</el-col>
						<el-col class="list-item font14">
							<span class="title">违 &nbsp;约&nbsp; 金</span>
							<span class="value">{{LoanBackDetail.OverdueBreachOfAmount}} 元</span>
						</el-col>
						<el-col class="list-item font14">
							<span class="title">滞 &nbsp;纳&nbsp; 金</span>
							<span class="value">{{LoanBackDetail.OverdueMoneyAmount}} 元</span>
						</el-col>
						<el-col class="list-item font14">
							<span class="title">逾期天数</span>
							<span class="value"> {{LoanBackDetail.OverdueDays}} 天</span>
						</el-col>
						<el-col class="list-item font14">
							<span class="title">借款期限</span>
							<span class="value">{{LoanBackDetail.LoanTermCount}} 天</span>
						</el-col>
						<el-col class="list-item font14">
							<span class="title">借款时间</span>
							<span class="value">{{LoanBackDetail.LoanDate}}</span>
						</el-col>
					</el-row>
				</el-card>
			</el-col>
			<el-col class="item-card" :span="12" style="background:rgb(255, 255, 255); overflow:hidden; height:490px; border:1px solid #EAEAEA; box-sizing:border-box; padding:30px 10px 0;">
				<el-tabs v-model="smallActiveName">
					<el-tab-pane label="紧急联系人" name="紧急联系人" style="padding:0px 0; height:380px; overflow-y:scroll; overflow-x:hidden;">
						<emergencycontact :uid="uid"></emergencycontact>
					</el-tab-pane>
					<el-tab-pane label="手机通讯录" name="手机通讯录" style="padding:0px 0; height:380px; overflow-y:scroll; overflow-x:hidden;">
						<callhistory :uid="uid"></callhistory>
					</el-tab-pane>
					<el-tab-pane label="常用联系人" name="常用联系人" style="padding:0px 0; height:380px; overflow-y:scroll; overflow-x:hidden;">
						<commoncontact :uid="uid"></commoncontact>
					</el-tab-pane>
					<el-tab-pane v-if="isshowtaobao" label="淘宝常用收货人" name="淘宝常用收货人" style="padding:0px 0; height:380px; overflow-y:scroll; overflow-x:hidden;">
						<taobao :uid="uid" @showtaobao="isshowtaobao=false"></taobao>
					</el-tab-pane>
				</el-tabs>
			</el-col>
		</section>
		<el-card class="box-card">
			<el-tabs v-model="activeName" lazy @tab-click="handleClick">
		    	<el-tab-pane label="借款记录" name="借款记录">
		    		<loanrecords :uid="uid" @goloanrecords="activeName='还款记录'"></loanrecords>
		    	</el-tab-pane>
		    	<el-tab-pane label="续期记录" name="续期记录">
		    		<renewrecord :uid="uid"></renewrecord>
		    	</el-tab-pane>
		    	<el-tab-pane label="还款记录" name="还款记录" v-if="isShowrepay">
		    		<repaymentrecord :uid="uid"></repaymentrecord>
		    	</el-tab-pane>
		    	<el-tab-pane label="报告购买记录" name="报告购买记录">
		    		<reportbuyrecord :uid="uid"></reportbuyrecord>
		    	</el-tab-pane>
		    	<el-tab-pane label="银行卡" name="银行卡">
		    		<usersbankcards :uid="uid"></usersbankcards>
		    	</el-tab-pane>
		    	<el-tab-pane label="实名认证" name="实名认证">
		    		<identify :uid="uid"></identify>
		    	</el-tab-pane>
		    	<el-tab-pane label="联系历史" name="联系历史">
		    		<contacthistory :uid="uid" v-if="isShow"></contacthistory>
		    	</el-tab-pane>
				<el-tab-pane label="通讯录比对" name="通讯录比对">
					<phoneoperatorsdddress :uid="uid"></phoneoperatorsdddress>
				</el-tab-pane>
		  	</el-tabs>
		</el-card>
		<div style="height:100px; background:rgba(255,255,255,1); text-align:center; box-shadow:0 0 10px #ddd; position:fixed; bottom:20px; right:35px; left:165px; overflow:hidden; z-index:10;">
			<el-form ref="form" :rules="rules" :inline="true" :model="form" @submit.native.prevent style="height:100px; font:16px/100px '微软雅黑'; overflow:hidden;">
				<el-form-item prop='Remark' style="margin-top:12px;">
			    	<el-input type="textarea" placeholder="请填写备注（选填）" :rows="3" v-model="form.Remark"></el-input>
			  	</el-form-item>
			  	<el-form-item prop='ActionType' style="margin-top:30px;">
				    <el-select v-model="form.ActionType" placeholder="请选择行动分类" style="width:200px;">
				      	<el-option label="跟进" value="跟进"></el-option>
				      	<el-option label="承诺" value="承诺"></el-option>
				      	<el-option label="续期" value="续期"></el-option>
				      	<el-option label="谈判" value="谈判"></el-option>
				      	<el-option label="跳票" value="跳票"></el-option>
				      	<el-option label="中本人" value="中本人"></el-option>
				      	<el-option label="中家人" value="中家人"></el-option>
				      	<el-option label="失联" value="失联"></el-option>
				      	<el-option label="死亡" value="死亡"></el-option>
				      	<el-option label="盗办" value="盗办"></el-option>
				      	<el-option label="坐牢" value="坐牢"></el-option>
				      	<el-option label="争议" value="争议"></el-option>
				      	<el-option label="暂停" value="暂停"></el-option>
				      	<el-option label="留案" value="留案"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item style="margin-top:30px;">
					<el-date-picker v-model="form.CompositeDate" type="datetime" placeholder="请选择复核时间（选填）" @change="changeceshi" style="width:210px;"></el-date-picker>
				</el-form-item>
			  	<el-form-item style="margin-top:30px;">
			    	<el-button type="primary" size="medium" @click="goSave" style="margin-left:20px;">添加催记</el-button>
			  	</el-form-item>
			  	<el-form-item style="margin-top:30px;">
			    	<el-button type="primary" size="medium" @click="setBlack" :disabled="IsBlack" style="margin-left:20px;">{{IsBlack?'已入黑':'提交入黑'}}</el-button>
			  	</el-form-item>
				<el-form-item style="margin-top:30px;">
					<el-button type="primary" size="medium" @click="getWithhole" style="margin-left:20px;">代扣</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!-- 代扣弹框 -->
		<el-dialog title="代扣提示" :visible.sync="repayDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="400px">
			<el-form :model="repayForm" :rules="repayrules" label-width="80px" ref="repayForm">
				<el-form-item label="代扣渠道" prop="Channel">
					<el-select v-model="repayForm.Channel" placeholder="请选择">
						<el-option label="代扣" :value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="代扣金额" prop="ReturnMoney">
					<el-input v-model.number="repayForm.ReturnMoney" placeholder="请输入代扣金额" clearable auto-complete="off" style="width:80%;"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="goWithhole">确定</el-button>
				<el-button @click.native="repayDialog=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import emergencycontact from '@/components/afterloandtl/emergencycontact.vue';
	import callhistory from '@/components/afterloandtl/callhistory.vue';
	import commoncontact from '@/components/afterloandtl/commoncontact.vue';
	import taobao from '@/components/afterloandtl/taobao.vue';
	import loanrecords from '@/components/afterloandtl/loanrecords.vue';
	import repaymentrecord from '@/components/userDtl/repaymentrecord.vue';
	import reportbuyrecord from '@/components/userDtl/reportbuyrecord.vue';
	import usersbankcards from '@/components/userDtl/usersbankcard.vue';
	import renewrecord from '@/components/userDtl/renewrecord.vue';
	import identify from '@/components/userDtl/identify.vue';
	import contacthistory from '@/components/userDtl/contacthistory.vue';
	import phoneoperatorsdddress from '@/components/userDtl/phoneoperators.vue';
	import http from "api/http.js";
	import { authuserdtl,usersbankcard,financemanagedetail,collectionhandle,usertoblack,repaymentuserinfo,repayment } from "api/api.js";
	export default {
		data(){
			return {
				loanid:this.$route.params.loanid,
				uid:this.$route.params.uid,
				userDetail:{},
				IsBlack:false,
				showDialog_add: false,
				smallActiveName: '紧急联系人',
				tableData: {}, //返回的银行卡信息列表
				LoanBackDetail: {}, //借款信息
				activeName:'借款记录',
				isShow:true, //联系历史
				form:{
					ActionType:'跟进',
					CompositeDate:'',
					Remark:''
				},
				rules:{
					ActionType:[{
						required:true,
						message:'请选择行动分类',
						trigger:'blur'
					}],
					CompositeDate:[{
						required:true,
						message:'请选择复核时间',
						trigger:'blur'
					}]
				},
				isshowtaobao:true,
				repayDialog:false,
				repayForm:{
					RepaymentScheduleId:null,
					ReturnMoney:null,
					Channel:3
				},
				repayrules:{
					Channel:[{
						required:true,
						message:'请选择代扣渠道',
						trigger:'blur'
					}],
					ReturnMoney:[{
						required:true,
						message:'请输入代扣金额',
						trigger:'blur'
					}]
				},
				isShowrepay:true
			}
		},
		mounted(){
			this.getauthuserdtl();
			this.getusersbankcard();
			this.getfinancemanagedetail();
		},
		methods: {
			getWithhole(){  //获取代扣信息
				let that=this;
				repaymentuserinfo({Uid:parseInt(this.uid)}).then(res => {
					if( res.Ret===200 ){
						if( res.Msg=="该笔订单已结清" ){
							this.$message.success( res.Msg );
							setTimeout(function(){
								// history.back();
								that.$router.push({path:"/collectionlist"});
							},2000);
						}else{
							this.repayForm.RepaymentScheduleId=res.List.RepaymentScheduleId;
							this.repayDialog=true;
						}
					}
				});
			},
			goWithhole(){  //代扣
				this.$refs.repayForm.validate((valid) => {
					if( valid ){
						if( this.repayForm.ReturnMoney<0 || !(this.repayForm.ReturnMoney%1===0) ){
							this.$message.error( "代扣金额只能输入大于0的整数！" );
							return false;
						}
						this.isShowrepay=false;
						let params=this.repayForm;
						params.Uid=parseInt(this.uid);
						repayment(params).then((res) => {
							if( res.Ret==200 ){
								this.$message.success( res.Msg );
								this.getauthuserdtl();
								this.getusersbankcard();
								this.getfinancemanagedetail();
								this.repayDialog=false;
								this.isShowrepay=true;
							}
						});
					}
				});
			},
			setBlack(){  //提交入黑
				this.$confirm('您确定将客户'+this.userDetail.Verifyrealname+this.userDetail.Account+'，拉入黑名单嘛？','提示',{
					type:'warning'
				}).then(() => {
					usertoblack({ IdCard:this.userDetail.IdCard,UserAccount:this.userDetail.Account,Source:'贷后催收' }).then(res => {
						if(res.Ret === 200) {
							this.$message.success( res.Msg );
							this.getauthuserdtl();
						}
					});
				}).catch(() => {  });
			},
			getfinancemanagedetail() {
				financemanagedetail({ LoanId:parseInt(this.loanid) }).then(res => {
					if(res.Ret === 200) {
						this.LoanBackDetail = res.LoanBackDetail;
					}
				});
			},
			getusersbankcard() { //获取银行卡信息列表
				usersbankcard({ Uid:parseInt(this.uid) }).then((res) => {
					if(res.Ret != 200) {
						return false;
					}
					if(res.UsersBankcards == null) {
						this.tableData = {};
					} else {
						this.tableData = res.UsersBankcards[0];
					}
				});
			},
			getauthuserdtl() {
				authuserdtl({ Uid:parseInt(this.uid) }).then(res => {
					if(res.Ret === 200) {
						this.userDetail = res.Um;
						this.IsBlack=res.IsBlack;
						console.log( this.userDetail,212 );
					}
				});
			},
			changeceshi(){
				console.log( this.form.CompositeDate );
			},
			handleClick(tab,event){},  //tab切换
	      	returnloanrecords(){  //还款记录切换
	      		this.activeName="还款记录";
	      	},
	      	goSave(){  //催记
	      		this.$refs.form.validate((valid) => {
					if( valid ){
						let params = { 
							"ActionType":this.form.ActionType,
							"Remark":this.form.Remark,
							"LoanId":parseInt(this.loanid),
							"Uid":parseInt(this.uid)
						};
						if( this.form.CompositeDate ){
							params.CompositeDate=http.dateFormatter(this.form.CompositeDate,true);
						}else{
							params.CompositeDate=this.form.CompositeDate;
						}
						console.log(params);
						this.isShow=false;
						collectionhandle(params).then((res) => {
							if(res.Ret == 200){
								this.$message.success( res.Msg );
								this.resetForm('form');
								this.form.CompositeDate='';
							}
							this.isShow=true;
						});
					}
				});
	      	},
	      	resetForm(formName){  //重置表单
	      		this.$nextTick(() => {
			        this.$refs[formName].resetFields();
			    });
	      	}
		},
		components:{emergencycontact,callhistory,commoncontact,loanrecords,repaymentrecord,reportbuyrecord,usersbankcards,renewrecord,identify,contacthistory,taobao,phoneoperatorsdddress}
	}
</script>

<style lang="scss" scoped>
	.font14{ font-size:14px; }
	#retundtl{ display:flex; padding-bottom:15px; box-sizing:border-box; position:relative; color:#999;
		.item-card{ box-sizing:border-box;
			.clearfix{ height:36px; font:14px/38px "微软雅黑"; padding-top:10px; box-sizing:border-box;
				.header-left{ float:left; color:#84909d; }
			}
			.list{ color:#84909d; font-size:12px;
				.user-header{ font:14px/30px "微软雅黑";
					.sex{ width:15px; height:15px; vertical-align:middle; margin:0 4px; padding:4px; background:#3A94F8; border-radius:100%; }
					.marriage{ display:inline-block; height:23px; padding:1px 5px; background:#DAEFFF; color:#3A94F8; text-align:center; font:12px/23px "微软雅黑"; margin-right:4px; }
					.id-card{ color:#c9c9c9; vertical-align:middle; margin-left:10px; }
				}
				.bank-info{ margin-top:20px; width:100%; height:78px; line-height:20px; border-radius:2px; box-shadow:1px 1px 6px 0px rgba(170, 170, 170, 0.75); border:1px solid rgba(234, 234, 234, 1);
					p{ font-size:14px; padding:15px 30px 0 19px; box-sizing:border-box; }
					.phone{ float:right; padding:0; }
					.card-number{ padding-top:5px; }
				}
				.list-item{ margin-top:14px;
					span{ display:inline-block; line-height:25px; }
					.title{ width:90px; vertical-align:text-top; color:#BFBFBF; }
					.value{ width:190px; vertical-align:text-top; color:#6B6B6B; }
				}
				.list-item2{
					span{ display:inline-block; height:25px; line-height:25px; }
					.value{ min-width:100px; }
				}
			}
		}
	}
	.el-card{ padding-bottom:0; }
</style>