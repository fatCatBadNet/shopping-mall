<template>
	<div v-if="isshow" id="mainpage">
		<el-card class="box-card">
			<div slot="header" class="cardhead">余额监控</div>
			<div style="font:14px '微软雅黑'; text-align:center;">
				<!-- <el-col :span="5">
					<p>今日剩余放款计划</p>
					<h2 :style="[{color:IsLoanLimitAlert?'red':'#333'}]">{{RemaindLoanLimit}}</h2>
				</el-col> -->
				<el-col :span="6">
					<el-button class="topdata">
						<!-- <p>{{PayChannel=="CJ"?"畅捷":PayChannel=="HLB"?"合利宝":PayChannel=="FY"?"富友":""}}余额</p> -->
						<p>{{LoanBalance.AccountDesc}}</p>
						<div>
							<span>{{LoanBalance.AvailableBalanceDesc}}</span>
							<b style="color:#409EFF;">{{moneyData(LoanBalance.AvailableBalance,'',2)}}</b>&nbsp;
							<br>
							<span>{{LoanBalance.BalanceDesc}}</span>
							<b :style="[{color:IsBalanceAlert?'red':'#333'}]">{{moneyData(LoanBalance.Balance,'',2)}}</b>
						</div>
					</el-button>
				</el-col>
				<el-col :span="6">
					<el-button class="topdata" @click="$router.push({path:'/fkbill'})">
						<p>风控余额</p>
						<h2 :style="[{color:IsFKBalanceAlert?'red':'#333'}]">{{moneyData(FKBalance,'',2)}}</h2>
					</el-button>
				</el-col>
				<el-col :span="6">
					<el-button class="topdata" @click="$router.push({path:'/smsbill'})">
						<p>短信余额</p>
						<h2 :style="[{color:IsSMSBalanceAlert?'red':'#333'}]">{{moneyData(SMSBalance,'',2)}}</h2>
					</el-button>
				</el-col>
				<el-col :span="6">
					<el-tooltip placement="top" content="指AI智能语音催收系统里的话费余额">
						<el-button class="topdata" @click="$router.push({path:'/connectbill'})">
							<p>话费余额</p>
							<h2 :style="[{color:IsHFBalanceAlert?'red':'#333'}]">{{moneyData(HFBalance,'',2)}}</h2>
						</el-button>
					</el-tooltip>
				</el-col>
			</div>
		</el-card>
		<el-card class="box-card">
			<div slot="header" class="cardhead">今日数据</div>
			<div style="text-align:right;">
				<el-col :span="1" class="panel" style="text-align:center;">
					<p class="p1"></p>
					<p class="p2" style="color:#333;">今日</p>
					<p class="p3" style="color:#333;">昨日</p>
				</el-col>
				<el-col :span="1.5" class="panel">
					<p class="p1">注册数</p>
					<p class="p2">
						<b>{{moneyData(TodayData.NumRegister,'',2)}}</b>
						<img :src="up" v-if="TodayData.NumRegister>YesterdayData.NumRegister" />
						<img :src="down" v-else-if="TodayData.NumRegister<YesterdayData.NumRegister" />
						<img src="../assets/img/loginlogo.png" v-else />
					</p>
					<p class="p3"><span>{{moneyData(YesterdayData.NumRegister,'',2)}}</span></p>
				</el-col>
				<el-col :span="2" class="panel">
					<p class="p1">认证数</p>
					<p class="p2">
						<b>{{moneyData(TodayData.NumCert,'',2)}}</b>
						<img :src="up" v-if="TodayData.NumCert>YesterdayData.NumCert" />
						<img :src="down" v-else-if="TodayData.NumCert<YesterdayData.NumCert" />
						<img src="../assets/img/loginlogo.png" v-else />
					</p>
					<p class="p3"><span>{{moneyData(YesterdayData.NumCert,'',2)}}</span></p>
				</el-col>
				<el-col :span="2" class="panel">
					<p class="p1">
						<span>借款申请数</span>
						<el-popover placement="top" title="" width="280" trigger="hover">
							<p style="font:14px/22px '微软雅黑'; color:#666; margin:6px 0;">当天申请的借款订单和App续期订单数。</p>
							<el-button icon="el-icon-info" circle slot="reference" style="border:none; padding:5px; margin-right:-5px;"></el-button>
						</el-popover>
					</p>
					<p class="p2">
						<b>{{moneyData(TodayData.NumLoanApply,'',2)}}</b>
						<img :src="up" v-if="TodayData.NumLoanApply>YesterdayData.NumLoanApply" />
						<img :src="down" v-else-if="TodayData.NumLoanApply<YesterdayData.NumLoanApply" />
						<img src="../assets/img/loginlogo.png" v-else />
					</p>
					<p class="p3"><span>{{moneyData(YesterdayData.NumLoanApply,'',2)}}</span></p>
				</el-col>
				<el-col :span="2" class="panel">
					<p class="p1">
						<span>机审通过数</span>
						<el-popover placement="top" title="" width="350" trigger="hover">
							<p style="font:14px/22px '微软雅黑'; color:#666; margin:6px 0;">当天申请当天机审通过的借款订单和App续期订单数。</p>
							<el-button icon="el-icon-info" circle slot="reference" style="border:none; padding:5px; margin-right:-5px;"></el-button>
						</el-popover>
					</p>
					<p class="p2">
						<b>{{moneyData(TodayData.NumPassSystem,'',2)}}</b>
						<img :src="up" v-if="TodayData.NumPassSystem>YesterdayData.NumPassSystem" />
						<img :src="down" v-else-if="TodayData.NumPassSystem<YesterdayData.NumPassSystem" />
						<img src="../assets/img/loginlogo.png" v-else />
					</p>
					<p class="p3"><span>{{moneyData(YesterdayData.NumPassSystem,'',2)}}</span></p>
				</el-col>
				<el-col :span="2" class="panel">
					<p class="p1">
						<span>人工通过数</span>
						<el-popover placement="top" title="" width="300" trigger="hover">
							<p style="font:14px/22px '微软雅黑'; color:#666; margin:6px 0;">当天申请当天人工审核通过的借款订单数。</p>
							<el-button icon="el-icon-info" circle slot="reference" style="border:none; padding:5px; margin-right:-5px;"></el-button>
						</el-popover>
					</p>
					<p class="p2">
						<b>{{moneyData(TodayData.NumPassArtificial,'',2)}}</b>
						<img :src="up" v-if="TodayData.NumPassArtificial>YesterdayData.NumPassArtificial" />
						<img :src="down" v-else-if="TodayData.NumPassArtificial<YesterdayData.NumPassArtificial" />
						<img src="../assets/img/loginlogo.png" v-else />
					</p>
					<p class="p3"><span>{{moneyData(YesterdayData.NumPassArtificial,'',2)}}</span></p>
				</el-col>
				<el-col :span="2" class="panel">
					<p class="p1">
						<span>实际放款数</span>
						<el-popover placement="top" title="" width="300" trigger="hover">
							<p style="font:14px/22px '微软雅黑'; color:#666; margin:6px 0;">当天放款的借款订单数，与是否当天申请无关。</p>
							<el-button icon="el-icon-info" circle slot="reference" style="border:none; padding:5px; margin-right:-5px;"></el-button>
						</el-popover>
					</p>
					<p class="p2">
						<b>{{moneyData(TodayData.NumTradeMoney,'',2)}}</b>
						<img :src="up" v-if="TodayData.NumTradeMoney>YesterdayData.NumTradeMoney" />
						<img :src="down" v-else-if="TodayData.NumTradeMoney<YesterdayData.NumTradeMoney" />
						<img src="../assets/img/loginlogo.png" v-else />
					</p>
					<p class="p3"><span>{{moneyData(YesterdayData.NumTradeMoney,'',2)}}</span></p>
				</el-col>
				<el-col :span="0.5" class="panel" style="text-align:right;">
					<p class="p1"></p>
					<el-tooltip class="item" effect="dark" content="展开数据" placement="top">
						<i class="el-icon-d-arrow-right" style="font-size:20px; padding:3px; vertical-align:middle; cursor:pointer; border:1px solid #999; border-radius:100%; margin-left:10px;" @click="dataDialog=true"></i>
					</el-tooltip> 
				</el-col>
				<el-col :span="2" class="panel" style="border-left:1px solid #eaeaea;">
					<p class="p1">
						<span>借款金额</span>
						<el-popover placement="top" title="" width="450" trigger="hover">
							<p style="font:14px/22px '微软雅黑'; color:#666; margin:6px 0;">当天0点到当前最新刷新时间，放款成功订单的合同金额之和（不含续期）。</p>
							<el-button icon="el-icon-info" circle slot="reference" style="border:none; padding:5px; margin-right:-5px;"></el-button>
						</el-popover>
					</p>
					<p class="p2">
						<b>{{moneyData(TodayData.MoneyLoanSuccess,'',2)}}</b>
						<img :src="up" v-if="TodayData.MoneyLoanSuccess>YesterdayData.MoneyLoanSuccess" />
						<img :src="down" v-else-if="TodayData.MoneyLoanSuccess<YesterdayData.MoneyLoanSuccess" />
						<img src="../assets/img/loginlogo.png" v-else />
					</p>
					<p class="p3"><span>{{moneyData(YesterdayData.MoneyLoanSuccess,'',2)}}</span></p>
				</el-col>
				<el-col :span="2.5" class="panel">
					<p class="p1">
						<span>实际放款金额</span>
						<el-popover placement="top" title=""  trigger="hover">
							<p style="font:14px/22px '微软雅黑'; color:#666; margin:6px 0;">不含续期</p>
							<el-button icon="el-icon-info" circle slot="reference" style="border:none; padding:5px; margin-right:-5px;"></el-button>
						</el-popover>
					</p>
					<p class="p2">
						<b>{{moneyData(TodayData.TradeMoney,'',2)}}</b>
						<img :src="up" v-if="TodayData.TradeMoney>YesterdayData.TradeMoney" />
						<img :src="down" v-else-if="TodayData.TradeMoney<YesterdayData.TradeMoney" />
						<img src="../assets/img/loginlogo.png" v-else />
					</p>
					<p class="p3"><span>{{moneyData(YesterdayData.TradeMoney,'',2)}}</span></p>
				</el-col>
				<el-col :span="2" class="panel">
					<p class="p1">
						<span>续期金额</span>
						<el-popover placement="top" title="" width="450" trigger="hover">
							<p style="font:14px/22px '微软雅黑'; color:#666; margin:6px 0;">当天0点到当前最新刷新时间，发送续期申请并成功的订单的续期本金（计息本金）之和。</p>
							<el-button icon="el-icon-info" circle slot="reference" style="border:none; padding:5px; margin-right:-5px;"></el-button>
						</el-popover>
					</p>
					<p class="p2">
						<b>{{moneyData(TodayData.RenewalMoney,'',2)}}</b>
						<img :src="up" v-if="TodayData.RenewalMoney>YesterdayData.RenewalMoney" />
						<img :src="down" v-else-if="TodayData.RenewalMoney<YesterdayData.RenewalMoney" />
						<img src="../assets/img/loginlogo.png" v-else />
					</p>
					<p class="p3"><span>{{moneyData(YesterdayData.RenewalMoney,'',2)}}</span></p>
				</el-col>
				<el-col :span="2" class="panel">
					<p class="p1">
						<span>还款金额</span>
						<el-popover placement="top" title="" width="450" trigger="hover">
							<p style="font:14px/22px '微软雅黑'; color:#666; margin:6px 0;">当天0点到当前最新刷新时间，还款列表里收到的还款金额之和。</p>
							<el-button icon="el-icon-info" circle slot="reference" style="border:none; padding:5px; margin-right:-5px;"></el-button>
						</el-popover>
					</p>
					<p class="p2">
						<b>{{moneyData(TodayData.MoneyDrreturnExpire,'',2)}}</b>
						<img :src="up" v-if="TodayData.MoneyDrreturnExpire>YesterdayData.MoneyDrreturnExpire" />
						<img :src="down" v-else-if="TodayData.MoneyDrreturnExpire<YesterdayData.MoneyDrreturnExpire" />
						<img src="../assets/img/loginlogo.png" v-else />
					</p>
					<p class="p3"><span>{{moneyData(YesterdayData.MoneyDrreturnExpire,'',2)}}</span></p>
				</el-col>
				<el-col :span="2.5" class="panel">
					<p class="p1">
						<span>当日还款复借率</span>
						<el-popover placement="top" title="" width="450" trigger="hover">
							<p style="font:14px/22px '微软雅黑'; color:#666; margin:6px 0;"><b>当日还款复借率</b>：当天成功复借订单数/当天还款订单数*100%；</p>
							<p style="font:14px/22px '微软雅黑'; color:#666; margin:6px 0;"><b>当天成功复借订单数</b>：当天00:00:00至最新刷新时间段成功还款并再次借款的所有订单数（包括借款订单和续期订单），续期可以理解为 还款并复借；</p>
							<p style="font:14px/22px '微软雅黑'; color:#666; margin:6px 0;"><b>当天还款订单数</b>：当天00:00:00至最新刷新时间段成功还款的所有订单数（包括还款订单和续期订单）；</p>
							<el-button icon="el-icon-info" circle slot="reference" style="border:none; padding:5px;"></el-button>
						</el-popover>
					</p>
					<p class="p2">
						<b>{{TodayData.TodayRepaymentRate}}</b>
						<img :src="up" v-if="TodayData.TodayRepaymentRate>YesterdayData.TodayRepaymentRate" />
						<img :src="down" v-else-if="TodayData.TodayRepaymentRate<YesterdayData.TodayRepaymentRate" />
						<img src="../assets/img/loginlogo.png" v-else />
					</p>
					<p class="p3"><span>{{YesterdayData.TodayRepaymentRate}}</span></p>
				</el-col>
				<!-- <el-col :span="2" class="panel">
					<p class="p1">昨日逾期金额</p>
					<p class="p2">
						<b>-</b>
						<img src="../assets/img/loginlogo.png" />
					</p>
					<p class="p3"><span>{{YesterdayData.MoneyOverdueAdd}}</span></p>
				</el-col> -->
				<!-- <el-col :span="2" class="panel">
					<p class="p1">到期本息（含已还）</p>
					<p class="p2">
						<b>{{TodayData.MoneyExpire}}</b>
						<img :src="up" v-if="TodayData.MoneyExpire>YesterdayData.MoneyExpire" />
						<img :src="down" v-else-if="TodayData.MoneyExpire<YesterdayData.MoneyExpire" />
						<img src="../assets/img/loginlogo.png" v-else />
					</p>
					<p class="p3"><span>{{YesterdayData.MoneyExpire}}</span></p>
				</el-col> -->
				<!--<el-col :span="2" class="panel" style="border-left:1px solid #eaeaea;">
					<p class="p1">逾期差</p>
					<p class="p2">
						<b>{{TodayData.MoneyDiffOverdue}}</b>
						<img :src="up" v-if="TodayData.MoneyDiffOverdue>YesterdayData.MoneyDiffOverdue" />
						<img :src="down" v-else-if="TodayData.MoneyDiffOverdue<YesterdayData.MoneyDiffOverdue" />
						<img src="../assets/img/loginlogo.png" v-else />
					</p>
					<p class="p3"><span>{{YesterdayData.MoneyDiffOverdue}}</span></p>
				</el-col>-->
			</div>
		</el-card>
		<el-card class="box-card">
			<div slot="header" class="cardhead">
				<label>数据展示</label>
				<span style="float:right; color:#666;">数据每10分钟刷新一次，最新刷新时间为{{FinancialData.LastFlushTime}}</span>
			</div>
			<el-row type="flex" :gutter="20" style="padding:25px 20px; box-sizing:border-box;">
				<el-col :span="4">
					<el-tooltip content="指到期日为今天，包括借款订单和续期订单，包括结清和未结清。" placement="top" style="width:100%; padding:12px 0;">
						<el-button>
							<p class="ptop">今日到期</p>
							<p class="pcon">{{moneyData(FinancialData.ExpireTodayMoney,'',2)}}元</p>
							<p class="ptop">{{FinancialData.NumExpireTodayMoney}}笔</p>
						</el-button>
					</el-tooltip>
				</el-col>
				<el-col :span="4">
					<el-tooltip content="指到期日为今天且截止最新刷新时间，仍未结清的订单，包括借款订单和续期订单。" placement="top" style="width:100%; padding:12px 0;">
						<el-button>
							<p class="ptop">今日到期未还</p>
							<p class="pcon">{{moneyData(FinancialData.ExpireTodayNoReturnMoney,'',2)}}元</p>
							<p class="ptop">{{FinancialData.NumExpireTodayNoReturnMoney}}笔({{FinancialData.RateExpireTodayNoReturnMoney}})</p>
						</el-button>
					</el-tooltip>
				</el-col>
				<el-col :span="4">
					<el-tooltip content="到期日为明天，包括借款订单和续期订单，包括结清和未结清。" placement="top" style="width:100%; padding:12px 0;">
						<el-button>
							<p class="ptop">明日到期</p>
							<p class="pcon">{{moneyData(FinancialData.ExpireTomorrowMoney,'',2)}}元</p>
							<p class="ptop">{{FinancialData.NumExpireTomorrowMoney}}笔</p>
						</el-button>
					</el-tooltip>
				</el-col>
				<el-col :span="4">
					<el-tooltip content="指到期日为明天且截止最新刷新时间，仍未结清的订单，包括借款订单和续期订单。" placement="top" style="width:100%; padding:12px 0;">
						<el-button>
							<p class="ptop">明日到期未还</p>
							<p class="pcon">{{moneyData(FinancialData.ExpireTomorrowNoReturnMoney,'',2)}}元</p>
							<p class="ptop">{{FinancialData.NumExpireTomorrowNoReturnMoney}}笔({{FinancialData.RateExpireTomorrowNoReturnMoney}})</p>
						</el-button>
					</el-tooltip>
				</el-col>
				<el-col :span="4">
					<el-tooltip content="截止到最新刷新时间，所有成功借款用户的放款订单的实际到账总额，为实际成本，不包括续期订单。" placement="top" style="width:100%; padding:12px 0;">
						<el-button>
							<p class="ptop" style="color:#f47920;">累计放款</p>
							<p class="pcon">{{moneyData(FinancialData.TotalTradeMoney,'',2)}}元</p>
							<p class="ptop">{{FinancialData.NumTotalTradeMoney}}笔</p>
						</el-button>
					</el-tooltip>
				</el-col>
				<el-col :span="4">
					<el-tooltip content="截止到当前最新刷新时间，所有借款成功（放款成功）订单和续期申请成功订单，包括手动续期和app续期。" placement="top" style="width:100%; padding:12px 0;">
						<el-button>
							<p class="ptop" style="color:#f47920;">累计借款</p>
							<p class="pcon">{{moneyData(FinancialData.TotalLoanMoney,'',2)}}元</p>
							<p class="ptop">{{FinancialData.NumTotalLoanMoney}}笔</p>
						</el-button>
					</el-tooltip>
				</el-col>
			</el-row>
			<el-row type="flex" :gutter="20" style="padding:25px 20px; box-sizing:border-box;">
				<el-col :span="4">
					<el-tooltip placement="top" style="width:100%; padding:12px 0;">
						<div slot="content" style="line-height:24px;">截止当前日期，对应逾期1天且截止当前刷新时间，仍未结清的订单。<br/>占比计算方式：h%=逾期1天订单数H/【累计放款订单数+累计APP续期订单数+累计手动续期订单数】*100%。</div>
						<el-button>
							<p class="ptop">逾期1天</p>
							<p class="pcon">{{moneyData(FinancialData.Overdue1dMoney,'',2)}}元</p>
							<p class="ptop">{{FinancialData.NumOverdue1dMoney}}笔({{FinancialData.Overdue1dMoneyRate}})</p>
						</el-button>
					</el-tooltip>
				</el-col>
				<el-col :span="4">
					<el-tooltip placement="top" style="width:100%; padding:12px 0;">
						<div slot="content" style="line-height:24px;">截止当前日期，对应逾期2天和3天且截止当前刷新时间，仍未结清的订单。<br/>占比计算方式：X%=逾期2~3天订单数E/【累计放款订单数+累计APP续期订单数+累计手动续期订单数】*100%。</div>
						<el-button>
							<p class="ptop">逾期2~3天</p>
							<p class="pcon">{{moneyData(FinancialData.Overdue2to3dMoney,'',2)}}元</p>
							<p class="ptop">{{FinancialData.NumOverdue2to3dMoney}}笔({{FinancialData.Overdue2to3dMoneyRate}})</p>
						</el-button>
					</el-tooltip>
				</el-col>
				<el-col :span="4">
					<el-tooltip placement="top" style="width:100%; padding:12px 0;">
						<div slot="content" style="line-height:24px;">截止当前日期，对应逾期4天、5天、6天和7天且截止当前刷新时间，仍未结清的订单。<br/>占比计算方式：Y%=逾期4~7天订单数/【累计放款订单数+累计APP续期订单数+累计手动续期订单数】*100%。</div>
						<el-button>
							<p class="ptop">逾期4~7天</p>
							<p class="pcon">{{moneyData(FinancialData.Overdue4to7dMoney,'',2)}}元</p>
							<p class="ptop">{{FinancialData.NumOverdue4to7dMoney}}笔({{FinancialData.Overdue4to7dMoneyRate}})</p>
						</el-button>
					</el-tooltip>
				</el-col>
				<el-col :span="4">
					<el-tooltip placement="top" style="width:100%; padding:12px 0;">
						<div slot="content" style="line-height:24px;">截止当前日期，对应逾期8天及以上且截止当前刷新时间，仍未结清的订单。<br/>占比计算方式：Z%=逾期8天及以上未还订单数/【累计放款订单数+累计APP续期订单数+累计手动续期订单数】*100%。</div>
						<el-button>
							<p class="ptop">逾期8天及以上</p>
							<p class="pcon">{{moneyData(FinancialData.Overdue8AdMoney,'',2)}}元</p>
							<p class="ptop">{{FinancialData.NumOverdue8AdMoney}}笔({{FinancialData.Overdue8AdMoneyRate}})</p>
						</el-button>
					</el-tooltip>
				</el-col>
				<el-col :span="4">
					<el-tooltip placement="top" style="width:100%; padding:12px 0;">
						<div slot="content" style="line-height:24px;">截止到最新刷新时间，所有逾期且未结清的订单（借款订单+续期订单）。<br/>占比计算方式：Q%=当前逾期笔数D/【累计放款订单数+累计APP续期订单数+累计手动续期订单数】*100%。</div>
						<el-button>
							<p class="ptop">当前逾期</p>
							<p class="pcon">{{moneyData(FinancialData.OverdueTodayMoney,'',2)}}元</p>
							<p class="ptop">{{FinancialData.NumOverdueTodayMoney}}笔({{FinancialData.OverdueTodayMoneyRate}})</p>
						</el-button>
					</el-tooltip>
				</el-col>
				<el-col :span="4">
					<el-tooltip content="截止到当前最新刷新时间，所有未结清（包括未到期、到期、逾期）的订单（借款订单+续期订单）。" placement="top" style="width:100%; padding:12px 0;">
						<el-button>
							<p class="ptop">当前待收</p>
							<p class="pcon">{{moneyData(FinancialData.TotalNoReturnMoney,'',2)}}元</p>
							<p class="ptop">{{FinancialData.NumTotalNoReturnMoney}}笔</p>
						</el-button>
					</el-tooltip>
				</el-col>
			</el-row>
			<el-row type="flex" :gutter="20" style="padding:25px 20px; box-sizing:border-box;">
				<el-col :span="4">
					<el-tooltip placement="top" style="width:100%; padding:12px 0;">
						<div slot="content" style="line-height:24px;">所有已还款订单的计息本金之和，包括已还款的借款订单和已还款的续期订单。<br/>包括APP还款、代扣、手动还款录入等还款方式，不包括续期方式结清的订单。</div>
						<el-button>
							<p class="ptop">已还本金</p>
							<p class="pcon">{{moneyData(FinancialData.ReturnCapitalAmount,'',2)}}元</p>
						</el-button>
					</el-tooltip>
				</el-col>
				<el-col :span="4">
					<el-tooltip placement="top" style="width:100%; padding:12px 0;">
						<div slot="content" style="line-height:24px;">所有已还款订单的还款利息之和，包括已还款的借款订单和已还款的续期订单。<br/>包括APP还款、代扣、手动还款录入等还款方式，包括续期方式结清的订单。</div>
						<el-button>
							<p class="ptop">已还利息</p>
							<p class="pcon">{{moneyData(FinancialData.ReturnTaxAmount,'',2)}}元</p>
						</el-button>
					</el-tooltip>
				</el-col>
				<el-col :span="4">
					<el-tooltip content="所有已结清的逾期订单的逾期费用（滞纳金、违约金）之和，包括还款方式结清和续期方式结清的逾期订单。" placement="top" style="width:100%; padding:12px 0;">
						<el-button>
							<p class="ptop">已还逾期费用</p>
							<p class="pcon">{{moneyData(FinancialData.ReturnOverdueAmount,'',2)}}元</p>
						</el-button>
					</el-tooltip>
				</el-col>
				<el-col :span="4">
					<el-tooltip content="续期订单的续期服务费以及已还续期订单的续期手续费之和。" placement="top" style="width:100%; padding:12px 0;">
						<el-button>
							<p class="ptop">续期费用</p>
							<p class="pcon">{{moneyData(FinancialData.ReturnRenewAmount,'',2)}}元</p>
						</el-button>
					</el-tooltip>
				</el-col>
				<el-col :span="4">
					<el-tooltip content="还款用户还款时减免的费用总额。" placement="top" style="width:100%; padding:12px 0;">
						<el-button>
							<p class="ptop">费用减免总额</p>
							<p class="pcon">{{moneyData(FinancialData.ReturnReduceAmount,'',2)}}元</p>
						</el-button>
					</el-tooltip>
				</el-col>
				<el-col :span="4">
					<el-tooltip placement="top" style="width:100%; padding:12px 0;">
						<div slot="content" style="line-height:24px;">截止当前最新刷新时间，商户累计收款的金额，包括：<br/>1.真正还款的借款订单（和续期订单）的还款本金、还款利息、逾期费用；还款包括APP还款和手动还款录入还款金额；<br/>2.续期方式结清的借款订单（和续期订单）的结清利息、逾期费用、续期服务费和手续费，包括手动续期的费用；<br/>3.商户收到的购买拒绝报告的费用。</div>
						<el-button>
							<p class="ptop" style="color:#f47920;">累计已还总额</p>
							<p class="pcon">{{moneyData(FinancialData.TotalReturnMoney,'',2)}}元</p>
						</el-button>
					</el-tooltip>
				</el-col>
				<!-- <el-col :span="2">
					<el-tooltip content="授信拒绝用户购买的报告费总额" placement="top" style="width:100%; padding:12px 0;">
						<el-button>
							<p class="ptop">拒绝报告费</p>
							<p class="pcon">{{FinancialData.ReturnRefuseReportAmount}}</p>
						</el-button>
					</el-tooltip>
				</el-col> -->
			</el-row>
		</el-card>
		<!-- 数据展示弹框 -->
		<el-dialog title="今日数据展示" :visible.sync="dataDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="560px">
			<el-table :data="todayArr" border>
				<el-table-column prop="title" label="今日数据" align="center"></el-table-column>
				<el-table-column prop="NumLoanApplyWrap" label="借款申请数" align="center"></el-table-column>
				<el-table-column prop="NumPassSystemWrap" label="机审通过数" align="center"></el-table-column>
				<el-table-column prop="NumPassArtificialWrap" label="人工通过数" align="center"></el-table-column>
				<el-table-column prop="NumTradeMoneyWrap" label="实际放款数" align="center"></el-table-column>
			</el-table><br/>
		</el-dialog>
	</div>
</template>

<script>
import http from "../api/http.js";
import { buttonctl,domainprefix,indexdtl,toggledatascreen,dailyusersdata,syncdata,balancemonitor,financialdata} from 'api/api.js';
//import echarts from 'echarts';
//import '@/assets/js/macarons.js'
export default {
	data(){
		return {
			isshow:false,
			up:require('../assets/img/up.png'),
			down:require('../assets/img/down.png'),
			dataDialog:false,
			TodayData:{},
			todayArr:[],
			YesterdayData:{},
			page:1,
			pageSize:10,
			ismonth:'日',
			BillInfo:{},
			DataScreen:{},
			TenantInfo:{},
			tableData:[],
			form:{ dateValue:[http.dateFormatter(new Date(new Date().getTime()-10*24*60*60*1000),false),http.dateFormatter(new Date(),false)] },
			dateData:[],
			regData:[],
			authData:[],
			RemaindLoanLimit:null,
			PayChannel:null,
			// Balance:0,
			LoanBalance:{},
			FKBalance:0,
			SMSBalance:0,
			HFBalance:0,
			IsLoanLimitAlert:false,
			// BalanceDesc:'',
			IsBalanceAlert:false,
			IsFKBalanceAlert:false,
			IsSMSBalanceAlert:false,
			IsHFBalanceAlert:false,
			FinancialData:{}
		}
	},
	mounted(){
		buttonctl({}).then((res) => {  //数据展示按钮权限控制
			this.isshow=false;
			if( res.Ret==200 && res.AllCtl.IndexData ){
				// console.log(res);
				this.getsyncdata();
//				this.getIndexdtl();
//				this.toggledatascreen(false);
//				this.getdailyusersdata();
				this.getbalancemonitor();
				this.getfinancialdata();
				this.isshow=true;
				// console.log(123456789.0,this.moneyData(12345123456789.0,'',2))
			}
		});
		domainprefix({}).then((res) => {
			if( res.Ret==200 ){
				// console.log(res);
				sessionStorage.setItem('copyurl',res.Msg);
			}
		});
	},
	methods: {
		moneyData(value,currency,decimals){  //数据格式化
			const digitsRE = /(\d{4})(?=\d)/g;
			value = parseFloat(value);
			if(!isFinite(value) || (!value && value !== 0)) return '';
			currency = currency != null ? currency : '$';
			decimals = decimals != null ? decimals : 2;
			var stringified = Math.abs(value).toFixed(decimals);
			var _int = decimals? stringified.slice(0, -1 - decimals): stringified;
			var i = _int.length % 4;
			var head = i > 0? (_int.slice(0, i) + (_int.length > 4 ? ' ' : '')): '';
			var _float = decimals? stringified.slice(-1 - decimals): '';
			var sign = value < 0 ? '-' : '';
			if( _float==".00" ){
				return sign + currency + head +_int.slice(i).replace(digitsRE, '$1 ');
			}else{
				return sign + currency + head +_int.slice(i).replace(digitsRE, '$1 ') +_float;
			}
		},
		getbalancemonitor(){  //余额监控
			balancemonitor({}).then((res) => {
				// console.log( res,"getbalancemonitor" );
				if( res.Ret==200 ){
					this.RemaindLoanLimit=res.RemaindLoanLimit;
					this.PayChannel=res.PayChannel;
					// this.Balance=res.Balance;
					this.LoanBalance=res.LoanBalance;
					this.FKBalance=res.FKBalance;
					this.SMSBalance=res.SMSBalance;
					this.HFBalance=res.HFBalance;
					this.IsLoanLimitAlert=res.IsLoanLimitAlert;
					// this.BalanceDesc=res.BalanceDesc;
					this.IsBalanceAlert=res.IsBalanceAlert;
					this.IsFKBalanceAlert=res.IsFKBalanceAlert;
					this.IsSMSBalanceAlert=res.IsSMSBalanceAlert;
					this.IsHFBalanceAlert=res.IsHFBalanceAlert;
				}
			});
		},
		getfinancialdata(){  //财务数据
			financialdata({}).then((res) => {
				// console.log( res,"financialdata" );
				if( res.Ret==200 ){
					this.FinancialData=res.FinancialData;
				}
			});
		},
		getsyncdata(){  //获取实时数据
			let that=this;
			let params = {};
			syncdata(params).then((res) => {
				if( res.Ret==200 ){
					that.TodayData=res.TodayData;
					that.YesterdayData=res.YesterdayData;
					that.todayArr=[];
					let titleArr=["首借订单","复借订单","续期订单","合计"];
					// let wrapArr=["NumLoanApplyWrap","NumPassSystemWrap","NumPassArtificialWrap","NumTradeMoneyWrap"];
					// that.todayArr.push({title:item,FirstCount:;NoFirstCount:;RenewCount:;TotalCount:});
					let countArr=["FirstCount","NoFirstCount","RenewCount","TotalCount"];
					titleArr.forEach((item,index)=>{
						let indexname=countArr[index];
						if( index==2 ){
							that.todayArr.push({title:item,NumLoanApplyWrap:that.moneyData(res.TodayData.NumLoanApplyWrap[indexname],'',2),NumPassSystemWrap:that.moneyData(res.TodayData.NumPassSystemWrap[indexname],'',2),NumPassArtificialWrap:"--",NumTradeMoneyWrap:"--"});
						}else{
							that.todayArr.push({title:item,NumLoanApplyWrap:that.moneyData(res.TodayData.NumLoanApplyWrap[indexname],'',2),NumPassSystemWrap:that.moneyData(res.TodayData.NumPassSystemWrap[indexname],'',2),NumPassArtificialWrap:that.moneyData(res.TodayData.NumPassArtificialWrap[indexname],'',2),NumTradeMoneyWrap:that.moneyData(res.TodayData.NumTradeMoneyWrap[indexname],'',2)});
						}
// 						if( index==0 ){
// 							that.todayArr.push({title:item,NumLoanApplyWrap:res.TodayData.NumLoanApplyWrap.FirstCount,NumPassSystemWrap:res.TodayData.NumPassSystemWrap.FirstCount,NumPassArtificialWrap:res.TodayData.NumPassArtificialWrap.FirstCount,NumTradeMoneyWrap:res.TodayData.NumTradeMoneyWrap.FirstCount});
// 						}else if( index==1 ){
// 							that.todayArr.push({title:item,NumLoanApplyWrap:res.TodayData.NumLoanApplyWrap.NoFirstCount,NumPassSystemWrap:res.TodayData.NumPassSystemWrap.NoFirstCount,NumPassArtificialWrap:res.TodayData.NumPassArtificialWrap.NoFirstCount,NumTradeMoneyWrap:res.TodayData.NumTradeMoneyWrap.NoFirstCount});
// 						}else if( index==2 ){
// 							that.todayArr.push({title:item,NumLoanApplyWrap:res.TodayData.NumLoanApplyWrap.RenewCount,NumPassSystemWrap:res.TodayData.NumPassSystemWrap.RenewCount,NumPassArtificialWrap:res.TodayData.NumPassArtificialWrap.RenewCount,NumTradeMoneyWrap:res.TodayData.NumTradeMoneyWrap.RenewCount});
// 						}else if( index==3 ){
// 							that.todayArr.push({title:item,NumLoanApplyWrap:res.TodayData.NumLoanApplyWrap.TotalCount,NumPassSystemWrap:res.TodayData.NumPassSystemWrap.TotalCount,NumPassArtificialWrap:res.TodayData.NumPassArtificialWrap.TotalCount,NumTradeMoneyWrap:res.TodayData.NumTradeMoneyWrap.TotalCount});
// 						}else{}
					});
					// console.log(that.todayArr);
				}
			});
		},
		getIndexdtl(){
			let params = {};
			indexdtl(params).then((res) => {
				if( res.Ret==200 ){
					this.BillInfo=res.BillInfo;
					this.BillInfo.FkBalance=this.BillInfo.FkBalance.toFixed(2);
					this.BillInfo.FkTotalConsume=this.BillInfo.FkTotalConsume.toFixed(2);
					this.BillInfo.SmsBalance=this.BillInfo.SmsBalance.toFixed(2);
					this.BillInfo.SmsTotalConsume=this.BillInfo.SmsTotalConsume.toFixed(2);
					this.TenantInfo=res.TenantInfo;
				}
			});
		},
		toggledatascreen(tip){
			let params = {IsMonth:tip};
			toggledatascreen(params).then((res) => {
				if( res.Ret==200 ){
					this.DataScreen=res.DataScreen;
					if( tip ){
						this.ismonth="月";
						this.$refs.elcarousel.setActiveItem(1);
					}else{
						this.ismonth="日";
						this.$refs.elcarousel.setActiveItem(0);
					}
				}
			});
		},
		getdailyusersdata(){  //获取列表
			let params = {Page:this.page,PageSize:this.pageSize,StartTime:this.form.dateValue[0],EndTime:this.form.dateValue[1]};
			dailyusersdata(params).then((res) => {
				if( res.Result.List == null ){
					this.tableData = [];
				}else{
					this.tableData = res.Result.List;
					this.lookecharts();
				}
			});
		},
	   	lookecharts(){
	   		this.dateData=[];
			this.regData=[];
			this.authData=[];
	   		this.tableData.forEach(item=>{
				this.dateData.push( item.CreateTime );
				this.regData.push( item.NumRegister );
				this.authData.push( item.NumCert );
			});
			this.dateData=this.dateData.reverse();
			this.regData=this.regData.reverse();
			this.authData=this.authData.reverse();
			this.drawLineChart();
	   	},
	   	drawLineChart() {
			this.chartLine = echarts.init(document.getElementById("chartLine"),'macarons');
		    this.chartLine.setOption({
			    title:{text:'最近10天用户数据'},
			    tooltip:{
			        trigger:'axis',
			        axisPointer:{
			            type:'cross',
			            label:{
			                backgroundColor:'#6a7985'
			            }
			        }
			    },
			    legend:{
			        data:['注册人数','认证人数']
			    },
			    grid: {
			        left:'3%',
			        right:'4%',
			        bottom:'3%',
			        containLabel:true
			    },
			    xAxis:[{
		            type:'category',
		            boundaryGap:false,
		            data:this.dateData
		       }],
			    yAxis:[{
			        type:'value'
			    }],
			    series:[
			        {
			            name:'注册人数',
			            type:'line',
			            label: {
			                normal: {
			                    show:true,
			                    position:'top'
			                }
			            },
			            areaStyle: {normal: {}},
			            data:this.regData
			        },
			        {
			            name:'认证人数',
			            type:'line',
			            label: {
			                normal: {
			                    show:true,
			                    position:'top'
			                }
			            },
			            areaStyle: {normal: {}},
			            data:this.authData
			        }
			    ]
			});
		}
		
	}
}	
</script>

<style scoped lang="scss">
	#mainpage{
		.topdata{ width:80%; padding:20px; line-height:28px; 
			h2{ line-height:56px; }
		}
		.fa-fw{ font-size:14px; }
		.faDayActionColor{ color:#344059; }
		.faMonthActionColor{ color:#10A0FF; }
		.box-card{ margin:0px auto 10px !important; }
		.cardhead{ font:15px/28px '微软雅黑'; color:#000; position:relative; }
		.headlabel{ position:absolute; left:0px; }
		.flexblocl{ flex:1; height:90px; line-height:38px; margin:10px; padding:5px 20px; box-sizing:border-box; background:#eaeaea; }
		.flexblocl>div{ font-size:20px; color:#6078AA; }
		#companydtl>p{ padding:5px 2px; font:14px/26px "微软雅黑" !important; }
		#companydtl>p label{ display:inline-block; width:80px; color:#999; text-align:center; }
		.monthTag{ height:20px; line-height:20px; border-radius:3px; padding:0px 6px; float:right; margin-top:10px; background:#344059; color:#fff; }
		.dayTag{ height:20px; line-height:20px; border-radius:3px; padding:0px 6px; float:right; margin-top:10px; background:#10A0FF; color:#fff; }
		#chartLine{ width:100%; height:600px; }
		.panel{ height:110px; padding-right:10px; box-sizing:border-box; }
		.p1{ height:35px; padding-right:22px; box-sizing:border-box; line-height:35px; color:#999; }
		.p2{ height:40px; font:15px/40px "微软雅黑"; }
		.p2 img{ width:15px; margin-left:5px; }
		.p3{ height:35px; font:14px/35px "微软雅黑"; color:#999; overflow:auto; }
		.p3 span{ margin-right:24px; }
		.ptop{ width:100%; font:14px/28px "微软雅黑"; text-align:center; color:#666; }
		.pcon{ width:100%; font:14px/30px "微软雅黑"; text-align:center; color:#000; }
	}
</style>