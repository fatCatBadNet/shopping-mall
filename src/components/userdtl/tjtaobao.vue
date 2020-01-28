<template>
    <div v-if="isshow" style="margin:0 auto;">
    	<div id="header">
    		<h1 style="font:26px/60px '楷体'; text-align:center;">淘宝报告</h1>
    		<p style="font:20px '楷体'; padding:0 40px; box-sizing:border-box;">
    			<span style="float:right;">报告生成时间：{{dataObj.ReportInfo.ReportTime}}</span>
    		</p>
    	</div>
    	<h1 class="th1">基本信息</h1>
    	<div class="contentsty">
    		<el-col :span="12">
    			<label class="tlabel">该用户的姓名：</label>
    			<span class="tspan">{{dataObj.BasicInfo.Name}}</span>
    		</el-col>
    		<el-col :span="12">
    			<label class="tlabel">该用户绑定的身份证号码：</label>
    			<span class="tspan">{{dataObj.BasicInfo.VerifiedIDCard}}</span>
    		</el-col>
    		<el-col :span="12">
    			<label class="tlabel">该用户绑定的手机号码：</label>
    			<span class="tspan">{{dataObj.BasicInfo.BindingPhone}}</span>
    		</el-col>
			<el-col :span="12">
				<label class="tlabel">邮箱：</label>
				<span class="tspan">{{dataObj.BasicInfo.Email}}</span>
			</el-col>
			<el-col :span="24">
				<label class="tlabel">默认地址：</label>
				<span class="tspan">{{dataObj.BasicInfo.DefaultAdress}}</span>
			</el-col>
    	</div>
        <h1 class="th1">财富信息</h1>
        <div class="contentsty">
        	<el-col :span="12">
        		<label class="tlabel">支付宝余额：</label>
        		<span class="tspan">{{dataObj.FortuneInfo.ZhifubaoBalance}}</span>
        	</el-col>
        	<el-col :span="12">
        		<label class="tlabel">余额宝余额：</label>
        		<span class="tspan">{{dataObj.FortuneInfo.YuebaoBalance}}</span>
        	</el-col>
        	<el-col :span="12">
        		<label class="tlabel">花呗总额度：</label>
        		<span class="tspan">{{dataObj.FortuneInfo.HuabeiTotalCreditAmount}}</span>
        	</el-col>
        	<el-col :span="12">
        		<label class="tlabel">花呗可用额度：</label>
        		<span class="tspan">{{dataObj.FortuneInfo.HuabeiCreditAmount}}</span>
        	</el-col>
        </div>
		<h1 class="th1">信用资质</h1>
		<div class="contentsty">
			<el-col :span="12">
				<label class="tlabel">淘气值：</label>
				<span class="tspan">{{dataObj.CreditInfo.NaughtyScore}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">天猫积分：</label>
				<span class="tspan">{{dataObj.CreditInfo.TianmaoPoint}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">买家信用评级：</label>
				<span class="tspan">{{dataObj.CreditInfo.BuyerCreditLevel}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">是否实名认证：</label>
				<span class="tspan">{{dataObj.CreditInfo.Authentication==1?'是':dataObj.CreditInfo.Authentication==0?'否':''}}</span>
			</el-col>
		</div>
		<h1 class="th1">购物规模</h1>
		<div class="contentsty">
			<el-col :span="12">
				<label class="tlabel">交易成功订单总金额：</label>
				<span class="tspan">{{dataObj.ShoppingAmount.TotalOrdersAmount}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">交易成功订单总次数：</label>
				<span class="tspan">{{dataObj.ShoppingAmount.TotalOrdersCnt}}</span>
			</el-col>
			<br>
			<el-table :data="ShoppingArr" border v-if="ShoppingArr.length>0" style="width:80%; margin:15px auto; border:1px solid #dfdfdf;">
				<el-table-column prop="date" label="月份" align="center"></el-table-column>
				<el-table-column prop="count" label="近6个月每月交易成功订单次数" align="center"></el-table-column>
				<el-table-column prop="money" label="近6个月每月交易成功订单金额" align="center"></el-table-column>
			</el-table>
		</div>
		<h1 class="th1">购物偏好（只统计交易成功订单）</h1>
		<div class="contentsty">
			<el-col :span="12">
				<label class="tlabel">食物购物金额占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.FoodAmountRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">服装购物金额占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.ClothingAmountRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">化妆品购物金额占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.CosmeticAmountRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">日用品购物金额占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.DailyNecessitiesAmountRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">交通票务购物金额占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.TransportationTicketingAmountRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">电子产品购物金额占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.ElectricDeviceAmountRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">家用电器购物金额占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.ElectricApplianceAmountRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">充值购物金额占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.ChargeAmountRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">工作学习购物金额占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.WorkAndStudyAmountRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">娱乐购物金额占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.EntertainmentAmountRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">保险购物金额占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.InsuranceAmountRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">其他购物金额占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.OthersAmountRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">食物购物次数占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.FoodCntRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">服装购物次数占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.ClothingCntRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">化妆品购物次数占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.CosmeticCntRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">日用品购物次数占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.DailyNecessitiesCntRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">交通票务购物次数占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.TransportationTicketingCntRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">电子产品购物次数占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.ElectricDeviceCntRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">家用电器购物次数占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.ElectricApplianceCntRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">充值购物次数占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.ChargeCntRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">工作学习购物次数占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.WorkAndStudyCntRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">娱乐购物次数占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.EntertainmentCntRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">保险购物次数占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.InsuranceCntRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">其他购物次数占比：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.OthersCntRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">单次购物金额平均数：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.ConsumeMean}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">单次购物金额中位数：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.ConsumeMedian}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">单次购物金额最大值：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.ConsumeMax}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">单次购物金额最小值：</label>
				<span class="tspan">{{dataObj.ShoppingPreference.ConsumeMin}}</span>
			</el-col>
		</div>
		<h1 class="th1">购物习惯</h1>
		<div class="contentsty">
			<el-col :span="12">
				<label class="tlabel">购买折扣商品次数占比（只统计交易成功订单）：</label>
				<span class="tspan">{{dataObj.ShoppingHabbit.DiscountCntRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">购买折扣商品金额占比（只统计交易成功订单）：</label>
				<span class="tspan">{{dataObj.ShoppingHabbit.DiscountAmountRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">购买商品平均折扣率（只统计交易成功订单）：</label>
				<span class="tspan">{{dataObj.ShoppingHabbit.AverageDiscountRate}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">失败订单次数占比（交易失败订单数量/总订单数量）：</label>
				<span class="tspan">{{dataObj.ShoppingHabbit.FailedOrdersRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">手机订单次数占比（只统计交易成功订单）：</label>
				<span class="tspan">{{dataObj.ShoppingHabbit.PhoneOrdersRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">工作时间订单占比（注：假定周一至周五9:00~17:00为工作时间）（只统计交易成功订单）：</label>
				<span class="tspan">{{dataObj.ShoppingHabbit.WorktimeOrdersRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">评价次数与购物次数之比（只统计交易成功订单）：</label>
				<span class="tspan">{{dataObj.ShoppingHabbit.EvaluateRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">好评次数与评价次数之比（只统计交易成功订单）：</label>
				<span class="tspan">{{dataObj.ShoppingHabbit.GoodEvaluateRate}}</span>
			</el-col>
		</div>
		<h1 class="th1">危险购物（只统计交易成功订单）</h1>
		<div class="contentsty">
			<el-col :span="12">
				<label class="tlabel">购买博彩类次数占比：</label>
				<span class="tspan">{{dataObj.DangerousShopping.BuyLotteryCntRatio}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">购买博彩类金额占比：</label>
				<span class="tspan">{{dataObj.DangerousShopping.BuyLotteryAmountRatio}}</span>
			</el-col>
		</div>
		<h1 class="th1">收货地址（只统计交易成功订单）</h1>
		<div class="contentsty">
			<el-col :span="12">
				<label class="tlabel">近6个月使用的收货地址数量：</label>
				<span class="tspan">{{dataObj.AddrsInfo.AddrsCnt}}</span>
			</el-col>
			<el-col :span="12">
				<label class="tlabel">近6个月使用的收件人数量：</label>
				<span class="tspan">{{dataObj.AddrsInfo.ReceiversCnt}}</span>
			</el-col>
			<br>
			<el-table :data="MostUsedAddrsArr" border v-if="MostUsedAddrsArr.length>0" style="width:90%; margin:15px auto; border:1px solid #dfdfdf;">
				<el-table-column prop="Name" label="收件人" align="center"></el-table-column>
				<el-table-column prop="Telephone" label="收件人电话" align="center"></el-table-column>
				<el-table-column prop="Address" label="收货地址" align="center" min-width="200"></el-table-column>
				<el-table-column prop="Cnt" label="该地址使用次数" align="center"></el-table-column>
				<el-table-column prop="Amount" label="该地址送货总金额" align="center"></el-table-column>
				<el-table-column prop="FirstDate" label="首次使用该地址时间" align="center"></el-table-column>
				<el-table-column prop="LastDate" label="最后使用该地址时间" align="center"></el-table-column>
			</el-table>
		</div>
    </div>    
</template>

<script>
	import {tjtaobaoreport} from 'api/api.js';
	export default {
		props:{
      		uid:{
        		type:String,
        		default:{type:''}
      		}
    	},
		data() {
			return {
				isshow:false,
				dataObj:{},
				ShoppingArr:[],
				MostUsedAddrsArr:[]
			}
		},
		mounted() {
			this.getdtl();
		},
		methods: {
			getdtl(){ 
				tjtaobaoreport({Uid:parseInt(this.uid)}).then((res) => {
					console.log(res,"++++++++++++++++++++++++++++++++++++");
					this.isshow=res.IsShow;
					if( res.IsShow ){
						this.$emit('isshowtaobao');
					}
					if( res.Ret==200 ){
						this.dataObj=res.Data;
						let MonthOrdersAmountArr=Object.entries(this.dataObj.ShoppingAmount.MonthOrdersAmount);
						let MonthOrdersCntArr=Object.entries(this.dataObj.ShoppingAmount.MonthOrdersCnt);
						this.ShoppingArr=[];
						if( MonthOrdersAmountArr.length>0 ){
							MonthOrdersAmountArr.forEach((item,index)=>{
								// console.log(item,index,MonthOrdersCntArr[index]);
								this.ShoppingArr.push({date:item[0],count:MonthOrdersCntArr[index][1],money:item[1]});
							});
						}
						this.MostUsedAddrsArr=this.dataObj.AddrsInfo.MostUsedAddrs || [];
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	#header{ width:100%; height:100px; color:#fff; background:#409EFF; }
	.th1{ padding:0 10px; box-sizing:border-box; font:18px/40px "微软雅黑"; color:#409EFF; margin:5px auto; }
	.tlabel{ color:#999; }
	.ttag{ font:10px "微软雅黑"; padding:2px 4px; background:#409EFF; color:#fff; border-radius:2px; }
	.contentsty{ font:15px/40px '微软雅黑'; padding:10px 20px; box-sizing:border-box; background:#f9f9f9; border:1px solid #eaeaea; overflow:hidden; }
</style>