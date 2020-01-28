<template>
	<el-row :span="24" style=" padding-top:15px; box-sizing:border-box; position:relative; color:#999;" id="userdtl">
		<img src="../../assets/img/userLogo.png" style="width:85px; position:absolute; left:10px; top:5px;" />
		<el-col :span="8" class="el" style="padding-left:130px;">
			<label style="font-weight:800;">{{userDtl.Verifyrealname}}&nbsp;&nbsp;&nbsp;{{userDtl.Sex}}</label>
			<a v-if="IsWhite" style="font-size:12px; padding:2px 5px; color:#fff; background:green; margin-left:20px; border-radius:2px;">白名单</a>
			<a v-if="IsBlack" style="font-size:12px; padding:2px 5px; color:#fff; background:red; margin-left:20px; border-radius:2px;">黑名单</a>
			<a v-if="LoanCount" style="font-size:12px; padding:2px 5px; color:#fff; background:green; margin-left:20px; border-radius:2px;">已借{{LoanCount}}次</a>
			<a v-if="MaxOverdueDays" style="font-size:12px; padding:2px 5px; color:#fff; background:red; margin-left:20px; border-radius:2px;">最大逾期{{MaxOverdueDays}}天</a>
		</el-col>
		<el-col :span="8" class="el">注册渠道：<label>{{userDtl.Source}}</label></el-col>
		<el-col :span="8" class="el">注册时间：<label>{{userDtl.CreateTime}}</label></el-col>
		<el-col :span="8" class="el" style="padding-left:130px;"><label style="font-weight:600;">{{userDtl.IdCard}}</label></el-col>
		<el-col :span="8" class="el">系统评分参考：<label>{{userDtl.CreditScore}}</label></el-col>
		<el-col :span="8" class="el">认证时间：<label>{{userDtl.VerifyTime}}</label></el-col>
		<el-col :span="8" class="el">手机号：<label>{{userDtl.Account}}</label></el-col>
		<!-- <el-col :span="8" class="el" v-if="userDtl.ZmScore>1">芝麻信用分：<label>{{userDtl.ZmScore}}</label></el-col>
		<el-col :span="8" class="el" v-else>灵芝分：<label>{{userDtl.XgScore}}</label></el-col> -->
		<el-col :span="8" class="el">{{Zmxy.ParamZh}}：<label>{{Zmxy.ParamValue}}</label></el-col>
		<el-col :span="8" class="el">最近操作时间：<label>{{userDtl.OperationTime}}</label></el-col>
		<el-col :span="8" class="el">用户 ID：<label>{{userDtl.Id}}</label></el-col>
		<!--<el-col :span="8" class="el">反欺诈风险：<label :style="{color:userDtl.BqsAntiFraud==3?'red':'#333'}">{{userDtl.BqsAntiFraud==0?"未知":userDtl.BqsAntiFraud==1?"无风险":userDtl.BqsAntiFraud==2?"低风险":"高风险"}}</label></el-col>-->
		<el-col :span="8" class="el">反欺诈风险：<label :style="{color:YdRisk=='极高风险'?'red':'#333'}">{{YdRisk=='缺少足够信息来进行风险评估'?"无":YdRisk}}</label></el-col>
		<el-col :span="8" class="el">最近手机型号：<label>{{userDtl.MobileTypeRecent}}</label></el-col>
		<el-col :span="8" class="el">学历：<label>{{userDtl.Education}}</label></el-col>
		<el-col :span="8" class="el">历史设备数：<label>{{setCount}}</label></el-col>
		<el-col :span="8" class="el">居住地址：<label>{{userDtl.LiveAddress}}</label></el-col>
		<el-col :span="8" class="el">婚姻：<label>{{userDtl.Marriage}}</label></el-col>
		<el-col :span="8" class="el">审核结果：<label :style="{color:userDtl.InitAudit==4?'#13CE66':'#333'}">{{userDtl.InitAudit==1?"新用户审核":userDtl.InitAudit==3?"人工审核":userDtl.InitAudit==4?"通过":userDtl.InitAudit==5?"拒绝":userDtl.InitAudit==7?"关闭":userDtl.InitAudit==9?"推送授信":userDtl.InitAudit==0?"未申请":"异常状态"}}</label></el-col>
		<el-col :span="8" class="el">详细地址：<label>{{userDtl.LiveDetailAddress}}</label></el-col>
		<el-col :span="8" class="el">邮箱：<label>{{userDtl.Email}}</label></el-col>
		<el-col :span="8" class="el">可用额度：<label>{{(userDtl.Balance-userDtl.UseBalance) < 0 ? 0 : (userDtl.Balance-userDtl.UseBalance)}}</label></el-col>
		<el-col :span="8" class="el">居住时长：<label>{{userDtl.LiveTime}}</label></el-col>
	</el-row>
</template>

<script>
	import { authuserdtl } from 'api/api.js';
	export default {
		props:{
      		uid:{
        		type:String,
        		default:{type:''}
      		}
    	},
		data() {
			return {
				userDtl:{},
				Zmxy:{},
				IsBlack:false,
				IsWhite:false,
				LoanCount:null,
				MaxOverdueDays:null,
				setCount:null,
				YdRisk:''
			}
		},
		mounted() {
			this.getAuthuserdtl();
		},
		methods: {
			getAuthuserdtl(){
				let params = {Uid:parseInt(this.uid)}
				authuserdtl(params).then((res) => {
					console.log(res,456);
					if( res.Ret === 200 ){
						this.userDtl=res.Um;
						this.Zmxy=res.Zmxy;
						this.setCount=res.Count;
						this.YdRisk=res.YdRisk;
						this.IsBlack=res.IsBlack;
						this.IsWhite=res.IsWhite;
						this.LoanCount=res.LoanCount;
						this.MaxOverdueDays=res.MaxOverdueDays;
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	#userdtl label{ color:#333; margin-left:5px; }
	.el{ padding-left:10px; box-sizing:border-box; margin-bottom:30px;
		span{
			display: block;
			border: #999 solid 1px;
			width: 200px;
			height: 50px;
			line-height: 50px;
			text-align: center;
			cursor: pointer;
		}
	}
</style>