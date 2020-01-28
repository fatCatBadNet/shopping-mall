<template>
	<div>
        <el-card>
	        <div slot="header" class="clearfix">企业信息</div>
            <el-row :span="24" class="list">
                <el-col :span="24" class="item">
                    <div class="label-item">公司：</div>
                    <div class="label-value">{{Rst.CompanyName}}</div>
                </el-col>
                <el-col :span="24" class="item">
                    <div class="label-item">应用名称：</div>
                    <div class="label-value">{{Rst.AppName}}</div>
                </el-col>
                <el-col :span="24" class="item">
                    <div class="label-item">应用图标：</div>
                    <div class="label-value">
                    	<img :src="Rst.LogoUrl" style="width:60px; height:60px;" />
                    </div>
                </el-col>
                <!-- <el-col :span="24" class="item">
                    <div class="label-item">官网：</div>
                    <div class="label-value">
                    	<span class="copyBtn editwordSty" style="float:left;" :data-clipboard-text="Rst.OfcWebDomain" @click="copyUrl">{{Rst.OfcWebDomain}}</span>
                    </div>
                </el-col> -->
                <el-col :span="24" class="item">
                    <div class="label-item" style="line-height:36px;">下载地址：</div>
                    <div class="label-value">
                    	<span class="copyBtn editwordSty" style="float:left; line-height:36px;" :data-clipboard-text="Rst.DownloadDomain" @click="copyUrl">{{Rst.DownloadDomain}}</span>
                    	<el-tooltip placement="right" effect="light" style="border:none;">
							<div slot="content">
								<img :src="Rst.DqrUrl" style="height:150px; cursor:pointer;" />
							</div>
						  	<el-button style="padding:0; margin:0;">
						  		<img src="~@/assets/img/ewm.png" style="height:40px; cursor:pointer; margin:0px; padding:0;" />
						  	</el-button>
						</el-tooltip>
                    </div>
                </el-col>
            </el-row>
        </el-card>
        <br />
        <el-card>
			<el-tabs v-model="activeName">
				<el-tab-pane label="APP配置" name="APP配置">
					<p class="otherset" style="border-top:1px solid #eaeaea;">额度设置</p>
					<div class="applist">
						<el-col :span="4" style="color:#999;">
							<i class="el-icon-warning" v-if="appRst.BalanceParm=='未设置'" style="color:red; margin-right:5px;"></i>
							<span>额度参数</span>
						</el-col>
						<el-col :span="9">{{appRst.BalanceParm?appRst.BalanceParm:'-'}}</el-col>
						<el-col :span="9" style="color:#999;">对APP进行三项额度参数设置，为必填项</el-col>
						<el-col :span="2"><router-link to="balanceparm" class="editwordSty">修改 </router-link></el-col>
					</div>
					<!-- <div class="applist">
						<el-col :span="4" style="color:#999;">
							<i class="el-icon-warning" v-if="!appRst.RiskBaseBalance" style="color:red; margin-right:5px;"></i>
							<span>首借额度</span>
						</el-col>
						<el-col :span="9">{{appRst.RiskBaseBalance?appRst.RiskBaseBalance:'-'}}</el-col>
						<el-col :span="9" style="color:#999;">通过授信的用户获得的授信额度</el-col>
						<el-col :span="2"><router-link to="firstbalance" class="editwordSty">修改 </router-link></el-col>
					</div>
					<div class="applist">
						<el-col :span="4" style="color:#999;">
							<i class="el-icon-warning" v-if="!appRst.WhiteUserBalance" style="color:red; margin-right:5px;"></i>
							<span>白名单首借额度</span>
						</el-col>
						<el-col :span="9">{{appRst.WhiteUserBalance?appRst.WhiteUserBalance:'-'}}</el-col>
						<el-col :span="9" style="color:#999;">白名单用户完成认证后获得的授信额度</el-col>
						<el-col :span="2"><router-link to="whitebalance" class="editwordSty">修改 </router-link></el-col>
					</div> -->
					<div class="applist">
						<el-col :span="4" style="color:#999;">
							<i class="el-icon-warning" v-if="!appRst.RiskIncrBls" style="color:red; margin-right:5px;"></i>
							<span>提额</span>
						</el-col>
						<el-col :span="9">{{appRst.RiskIncrBls?appRst.RiskIncrBls:'-'}}</el-col>
						<el-col :span="9" style="color:#999;">用户还款结清后对符合条件用户按规则进行提额</el-col>
						<el-col :span="2"><router-link to="incrinfo" class="editwordSty">修改 </router-link></el-col>
					</div>
					<div class="applist">
						<el-col :span="4" style="color:#999;">
							<i class="el-icon-warning" v-if="!appRst.BalanceUpperLimit" style="color:red; margin-right:5px;"></i>
							<span>授信额度上限</span>
						</el-col>
						<el-col :span="9">{{appRst.BalanceUpperLimit?appRst.BalanceUpperLimit:'-'}}</el-col>
						<el-col :span="9" style="color:#999;">用户在通过任何方式获得的授信金额最高不可超过的上限</el-col>
						<el-col :span="2"><router-link to="blsupperlimit" class="editwordSty">修改 </router-link></el-col>
					</div>
					<p class="otherset">业务设置</p>
					<div class="applist">
						<el-col :span="4" style="color:#999;">
							<i class="el-icon-warning" v-if="!appRst.DayLoanSchemeAmount" style="color:red; margin-right:5px;"></i>
							<span>放款计划</span>
						</el-col>
						<el-col :span="9">{{appRst.DayLoanSchemeAmount?appRst.DayLoanSchemeAmount:'-'}}</el-col>
						<el-col :span="9" style="color:#999;">放款计划控制当天从第三方支付打款出去的金额（续期不占用放款计划）</el-col>
						<el-col :span="2"><router-link to="dayscheme" class="editwordSty">修改 </router-link></el-col>
					</div>
					<div class="applist" v-if="false">
						<el-col :span="4" style="color:#999;">
							<i class="el-icon-warning" v-if="!appRst.DirectLoan" style="color:red; margin-right:5px;"></i>
							<span>APP业务模式</span>
						</el-col>
						<el-col :span="9">{{appRst.DirectLoan?appRst.DirectLoan:'-'}}</el-col>
						<el-col :span="9" style="color:#999;">可以选择跳过授信或者进行授信审核的APP业务流程</el-col>
						<el-col :span="2"><router-link to="bizmode" class="editwordSty">查看 </router-link></el-col>
					</div>
					<div class="applist">
						<el-col :span="4" style="color:#999;">
							<i class="el-icon-warning" v-if="!appRst.OverdueCostCeil" style="color:red; margin-right:5px;"></i>
							<span>逾期费用上限</span>
						</el-col>
						<el-col :span="9">{{appRst.OverdueCostCeil?appRst.OverdueCostCeil:'-'}}</el-col>
						<el-col :span="9" style="color:#999;">逾期费用超过本金的一定比例就不再增加</el-col>
						<el-col :span="2"><router-link to="overduecostceil" class="editwordSty">修改 </router-link></el-col>
					</div>
					<div class="applist">
						<el-col :span="4" style="color:#999;">
							<i class="el-icon-warning" v-if="!appRst.RenewState" style="color:red; margin-right:5px;"></i>
							<span>续期</span>
						</el-col>
						<el-col :span="9">{{appRst.RenewState?appRst.RenewState:'-'}}</el-col>
						<el-col :span="9" style="color:#999;">办理续期将还款日延后一个借款周期</el-col>
						<el-col :span="2"><router-link to="renewalswitch" class="editwordSty">修改 </router-link></el-col>
					</div>
					<div class="applist">
						<el-col :span="4" style="color:#999;">
							<i class="el-icon-warning" v-if="!appRst.RepaymentPoint" style="color:red; margin-right:5px;"></i>
							<span>自动代扣时间设置</span>
						</el-col>
						<el-col :span="9">{{appRst.RepaymentPoint?appRst.RepaymentPoint:'-'}}</el-col>
						<el-col :span="9" style="color:#999;">可修改自动代扣的发起时间和次数</el-col>
						<el-col :span="2"><router-link to="autowithhold" class="editwordSty">修改 </router-link></el-col>
					</div>
					<p class="otherset">其他设置</p>
					<div class="applist">
						<el-col :span="4" style="color:#999;">
							<i class="el-icon-warning" v-if="!appRst.CustomerTele" style="color:red; margin-right:5px;"></i>
							<span>客服联系方式</span>
						</el-col>
						<el-col :span="9">{{appRst.CustomerTele?appRst.CustomerTele:'-'}}</el-col>
						<el-col :span="9" style="color:#999;">APP弹窗、短信及帮助中心中显示的客服联系方式</el-col>
						<el-col :span="2"><router-link to="customertel" class="editwordSty">修改 </router-link></el-col>
					</div>
					<!-- <div class="applist">
						<el-col :span="4" style="color:#999;">
							<i class="el-icon-warning" v-if="!appRst.LoanMarket" style="color:red; margin-right:5px;"></i>
							<span>尾量转化</span>
						</el-col>
						<el-col :span="9">{{appRst.LoanMarket?appRst.LoanMarket:'-'}}</el-col>
						<el-col :span="9" style="color:#999;">审核失败的用户，推荐到其他小贷平台或收取信用报告费</el-col>
						<el-col :span="2"><router-link to="loanmarket" class="editwordSty">修改 </router-link></el-col>
					</div> -->
				</el-tab-pane>
			    <!-- <el-tab-pane label="后台配置" name="后台配置"> -->
			    	<!-- <div class="applist">
						<el-col :span="4" style="color:#999;">
							<i class="el-icon-warning" v-if="!LoanStrategy.SystemWeight" style="color:red; margin-right:5px;"></i>
							<span>自动放款比例</span>
						</el-col>
						<el-col :span="9" v-if="LoanStrategy.SystemWeight+LoanStrategy.ManualWeight==0">未设置（默认50%）</el-col>
						<el-col :span="9" v-else>{{LoanStrategy.SystemWeight/(LoanStrategy.SystemWeight+LoanStrategy.ManualWeight)*100}}%</el-col>
						<el-col :span="9" style="color:#999;">借款申请中系统自动处理占比，数值越大，则放款比例越高</el-col>
						<el-col :span="2"><router-link to="loanstrategy" class="editwordSty">修改 </router-link></el-col>
					</div> -->
					<!-- <div class="applist">
						<el-col :span="4" style="color:#999;"> -->
							<!--<i class="el-icon-warning" v-if="!IsGooAuth" style="color:red; margin-right:5px;"></i>-->
							<!-- <span>谷歌验证器</span> -->
						<!-- </el-col>
						<el-col :span="9">{{IsGooAuth?'开':'关'}}</el-col>
						<el-col :span="9" style="color:#999;">开启后登陆系统后台需验证谷歌验证器</el-col>
						<el-col :span="2"><router-link to="gooauth" class="editwordSty">修改 </router-link></el-col>
					</div> -->
					<!-- <div class="applist" v-if="false">
						<el-col :span="4" style="color:#999;">
							<span>AI智能语音提醒</span>
						</el-col>
						<el-col :span="9">{{getIsCallCollect(CallLoanSwitch)}}</el-col>
						<el-col :span="9" style="color:#999;">{{Merchant=='jsqb'?'开启后，启用AI智能语音系统进行到期、逾期提醒':'开启后，启用AI智能语音系统进行到期提醒'}}</el-col>
						<el-col :span="2"><router-link to="AI" class="editwordSty">修改 </router-link></el-col>
					</div>
					<div class="applist" v-if="false">
						<el-col :span="4" style="color:#999;">
							<span>从未借款用户提醒</span>
						</el-col>
						<el-col :span="9">{{getUserRemindState(NerverLoanSwitch)}}</el-col>
						<el-col :span="9" style="color:#999;">设置后，对从未借款用户进行短信或语音提醒</el-col>
						<el-col :span="2"><router-link to="userremind" class="editwordSty">修改 </router-link></el-col>
					</div>
			    </el-tab-pane> -->
			</el-tabs>
		</el-card>
		<!-- 提示弹框 -->
		<el-dialog title="提示：商户基础配置不全，请立即完善" :visible.sync="showDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="400px">
			<div class="applist" v-if="appRst.BalanceParm=='未设置'">
				<el-col :span="19" style="color:#999;">
					<i class="el-icon-warning" style="color:red; margin-right:5px;"></i>
					<span>额度参数</span>
				</el-col>
				<el-col :span="5"><router-link to="balanceparm" class="editwordSty">设置</router-link></el-col>
			</div>
			<!-- <div class="applist" v-if="!appRst.RiskBaseBalance">
				<el-col :span="19" style="color:#999;">
					<i class="el-icon-warning" style="color:red; margin-right:5px;"></i>
					<span>首借额度</span>
				</el-col>
				<el-col :span="5"><router-link to="firstbalance" class="editwordSty">设置</router-link></el-col>
			</div>
			<div class="applist" v-if="!appRst.WhiteUserBalance">
				<el-col :span="19" style="color:#999;">
					<i class="el-icon-warning" style="color:red; margin-right:5px;"></i>
					<span>白名单首借额度</span>
				</el-col>
				<el-col :span="5"><router-link to="whitebalance" class="editwordSty">设置</router-link></el-col>
			</div> -->
			<div class="applist" v-if="!appRst.DayLoanSchemeAmount">
				<el-col :span="19" style="color:#999;">
					<i class="el-icon-warning" style="color:red; margin-right:5px;"></i>
					<span>放款计划</span>
				</el-col>
				<el-col :span="5"><router-link to="dayscheme" class="editwordSty">设置</router-link></el-col>
			</div>
			<div class="applist" v-if="!appRst.RenewState">
				<el-col :span="19" style="color:#999;">
					<i class="el-icon-warning" style="color:red; margin-right:5px;"></i>
					<span>续期</span>
				</el-col>
				<el-col :span="5"><router-link to="renewalswitch" class="editwordSty">设置</router-link></el-col>
			</div>
			<div class="applist" v-if="!appRst.OverdueCostCeil">
				<el-col :span="19" style="color:#999;">
					<i class="el-icon-warning" style="color:red; margin-right:5px;"></i>
					<span>逾期费用上限</span>
				</el-col>
				<el-col :span="5"><router-link to="overduecostceil" class="editwordSty">设置</router-link></el-col>
			</div>
			<div class="applist" v-if="!appRst.CustomerTele">
				<el-col :span="19" style="color:#999;">
					<i class="el-icon-warning" style="color:red; margin-right:5px;"></i>
					<span>客服联系方式</span>
				</el-col>
				<el-col :span="5"><router-link to="customertel" class="editwordSty">设置</router-link></el-col>
			</div>
			<div class="applist" v-if="!appRst.RiskIncrBls">
				<el-col :span="19" style="color:#999;">
					<i class="el-icon-warning" style="color:red; margin-right:5px;"></i>
					<span>提额</span>
				</el-col>
				<el-col :span="5"><router-link to="incrinfo" class="editwordSty">设置</router-link></el-col>
			</div>
			<div class="applist" v-if="!appRst.BalanceUpperLimit">
				<el-col :span="19" style="color:#999;">
					<i class="el-icon-warning" style="color:red; margin-right:5px;"></i>
					<span>授信额度上限</span>
				</el-col>
				<el-col :span="5"><router-link to="blsupperlimit" class="editwordSty">设置</router-link></el-col>
			</div>
			<div class="applist" v-if="!appRst.LoanMarket">
				<el-col :span="19" style="color:#999;">
					<i class="el-icon-warning" style="color:red; margin-right:5px;"></i>
					<span>尾量转化</span>
				</el-col>
				<el-col :span="5"><router-link to="loanmarket" class="editwordSty">设置</router-link></el-col>
			</div>
			
			<div class="applist" v-if="!appRst.DirectLoan">
				<el-col :span="19" style="color:#999;">
					<i class="el-icon-warning" style="color:red; margin-right:5px;"></i>
					<span>APP业务模式</span>
				</el-col>
				<el-col :span="5"><router-link to="bizmode" class="editwordSty">设置</router-link></el-col>
			</div>
			<div class="applist" v-if="!appRst.RepaymentPoint">
				<el-col :span="19" style="color:#999;">
					<i class="el-icon-warning" style="color:red; margin-right:5px;"></i>
					<span>自动代扣时间设置</span>
				</el-col>
				<el-col :span="5"><router-link to="autowithhold" class="editwordSty">设置</router-link></el-col>
			</div>
			<br /><br />
		</el-dialog>
	</div>
</template>

<script>
	import { appsetcmpninfo,appsetinfo,appsetbackstginfo } from "api/api.js";
	import http from "@/api/http.js";
	import Clipboard from 'clipboard';
	let clipboard = new Clipboard('.copyBtn');
	export default {
		data() {
			return {
				Merchant:JSON.parse(sessionStorage.getItem('userDtl')).Merchant || '',
				activeName:"APP配置",
				showDialog:false,
				Rst:{},  //企业信息
				appRst:{},
				LoanStrategy:{},
				IsGooAuth:false,
				IsCallCollect:'OFF',
				NerverLoanSwitch:0,
			}
		},
		mounted() {
			let adminset = sessionStorage.getItem("adminset") || null;
			if( adminset ){
				this.activeName="后台配置";
				sessionStorage.removeItem('adminset');
			}
			this.getappsetcmpninfo();
			this.getappsetinfo();
			this.getappsetbackstginfo();
		},
		methods: {
			getIsCallCollect(n){  //获取AI智能语音提醒
				switch (n) {
					case 0:
						return '关闭';
						break;
					case 1:
						return '到期提醒';
						break;
					case 2:
						return '逾期一天提醒';
						break;
					case 3:
						return '到期提醒、逾期一天提醒';
						break;
					default: 
						return '-';
						break;
				}
			},
			getUserRemindState(n){  //获取借款提醒
				switch (n) {
					case 0:
						return '未设置';
						break;
					case 1:
						return '语音';
						break;
					case 2:
						return '短信';
						break;
					case 3:
						return '语音、短信';
						break;
					default: 
						return '-';
						break;
				}
			},
			getappsetcmpninfo(){  //
				appsetcmpninfo({}).then(res=>{
					console.log(res);
					if(res.Ret == 200){
						this.Rst=res.Rst;
					}
				})
			},
			copyUrl(){  //复制到粘贴板
				this.$message.success('复制成功！');
			},
			getappsetinfo(){  //app配置
				appsetinfo({}).then(res=>{
					console.log(res);
					if(res.Ret == 200){
						this.appRst=res.Rst;
						if( res.Rst.BalanceParm!='未设置' && res.Rst.BalanceUpperLimit && res.Rst.CustomerTele && res.Rst.DayLoanSchemeAmount && res.Rst.LoanMarket && res.Rst.OverdueCostCeil && res.Rst.RenewState && res.Rst.RiskBaseBalance && res.Rst.RiskIncrBls && res.Rst.WhiteUserBalance && res.Rst.DirectLoan && res.Rst.RepaymentPoint ){
							this.showDialog=false;
						}else{
							this.showDialog=true;
						}
					}
				})
			},
			getappsetbackstginfo(){  //后台配置
				appsetbackstginfo({}).then(res=>{
					console.log(res);
					if(res.Ret == 200){
						this.IsGooAuth=res.IsGooAuth;
						this.LoanStrategy=res.LoanStrategy;
						this.IsCallCollect=res.IsCallCollect;
						this.NerverLoanSwitch=parseInt(res.NerverLoanSwitch);
						this.CallLoanSwitch=parseInt(res.CallLoanSwitch);
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.item{ margin:15px auto; overflow:auto;
		.label-item{ float:left; width:100px; display:inline-block; color:#999; }
		.label-value{ display:inline-block; overflow:auto; }
	}
	.applist{ padding:15px 20px; box-sizing:border-box; background:#fff; border-bottom:1px solid #eaeaea; overflow:hidden; }
	.otherset{ padding:10px 20px; box-sizing:border-box; background:#f3f3f3; border-bottom:1px solid #eaeaea; overflow:hidden; }
</style>