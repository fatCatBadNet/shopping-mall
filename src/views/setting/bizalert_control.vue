<template>
	<div style="padding-bottom:100px;">
		<el-row class="header-title">
			<el-button type="primary" size="small" style="width:120px;" icon="el-icon-back" @click="goReturn">返回</el-button>
		</el-row>
		<el-row class="main">
			<thresholdset :list.sync='dataList.RiskThresholds' :metadata="copyDataList.RiskThresholds" :count.sync="fcCount" :title="'风控预警阈值'" :subTitle="'请根据您的业务情况，设置您需要的预警阈值'"></thresholdset>
			<thresholdset :list.sync='dataList.SmsThresholds' :metadata="copyDataList.SmsThresholds" :count.sync="smsCount" :title="'短信预警阈值'" :subTitle="'请根据您的业务情况，设置您需要的预警阈值'"></thresholdset>
			<thresholdset :list.sync='dataList.CAThresholds' :metadata="copyDataList.CAThresholds" :count.sync="caCount" :title="'话费预警阈值'" :subTitle="'请根据您的业务情况，设置您需要的预警阈值'"></thresholdset>
			<thresholdset :list.sync='dataList.TDGPThresholds' :metadata="copyDataList.TDGPThresholds" :count.sync="loanCount" :title="'放款计划预警阈值'" :subTitle="'请根据您的业务情况，设置您需要的预警阈值'"></thresholdset>
			<thresholdset v-if='dataList.HlbThresholds' :list.sync='dataList.HlbThresholds' :metadata="copyDataList.HlbThresholds" :count.sync="hlbCount" :title="'合利宝账户余额预警'" :subTitle="'请根据您的业务情况，设置您需要的预警阈值'"></thresholdset>
			<thresholdset v-if='dataList.CjThresholds' :list.sync='dataList.CjThresholds' :metadata="copyDataList.CjThresholds" :count.sync="cjCount" :title="'畅捷账户余额预警'" :subTitle="'请根据您的业务情况，设置您需要的预警阈值'"></thresholdset>
			<thresholdset v-if='dataList.FyThresholds' :list.sync='dataList.FyThresholds' :metadata="copyDataList.FyThresholds" :count.sync="fyCount" :title="'富友账户余额预警'" :subTitle="'请根据您的业务情况，设置您需要的预警阈值'"></thresholdset>
			<thresholdset v-if='dataList.YbThresholds' :list.sync='dataList.YbThresholds' :metadata="copyDataList.YbThresholds" :count.sync="ybCount" :title="'易宝账户余额预警'" :subTitle="'请根据您的业务情况，设置您需要的预警阈值'"></thresholdset>
		</el-row>
		<div style="height:80px; background:rgba(255,255,255,1); text-align:center; font:16px/80px '微软雅黑'; box-shadow:0 0 10px #ddd; position:fixed; bottom:20px; right:35px; left:165px; z-index:10;">
			<label style="color:#999;">修改了 &nbsp;&nbsp;<b class="editwordSty">{{fcCount+smsCount+loanCount+hlbCount+cjCount+caCount+fyCount+ybCount}}</b>项配置</label>
			<el-button type="primary" size="medium" @click="handleUpdate" style="margin:0 20px;">立即应用</el-button>
			<span class="editwordSty" @click="resizeData">放弃修改</span>
		</div>
	</div>
</template>
<script>
	import{ threshold,editthreshold} from "api/api.js";
	import thresholdset from "@/components/thresholdset";
	export default {
		data() {
			return {
				dataList: {
					RiskThresholds: [""],
					SmsThresholds: [""],
					TDGPThresholds: [""],
					HlbThresholds: [""],
					CjThresholds: [""],
					CAThresholds: [""],
					FyThresholds: [""],
					YbThresholds: [""]
				},
				copyDataList: "",
				fcCount: 0, //风控修改数量
				smsCount: 0, //短信预警数量
				loanCount: 0, //放款修改数量
				hlbCount: 0, //合利宝修改数量
				cjCount: 0, //畅捷修改数量
				caCount: 0, //话费修改数量
				fyCount: 0, //富友修改数量
				ybCount: 0 //易宝修改数量
			};
		},
		mounted() {
			this.getthreshold();
		},
		methods: {
			goReturn() {
				this.$router.replace({path:'/bizalert'});
			},
			handleUpdate() {
				let params = this.dataList;
				if( params.RiskThresholds.includes("") || params.SmsThresholds.includes("") || params.TDGPThresholds.includes("") ){
					this.$message.error('请检查是否有未输入的金额');
				}else{
					if(params.HlbThresholds != undefined) {
						if(params.HlbThresholds.includes("")) {
							this.$message.error('请检查是否有未输入的金额');
							return;
						}
					}
					if(params.CjThresholds != undefined) {
						if(params.CjThresholds.includes("")) {
							this.$message.error('请检查是否有未输入的金额');
							return;
						}
					}
					if(params.CAThresholds != undefined) {
						if(params.CAThresholds.includes("")) {
							this.$message.error('请检查是否有未输入的金额');
							return;
						}
					}
					if(params.FyThresholds != undefined) {
						if(params.FyThresholds.includes("")) {
							this.$message.error('请检查是否有未输入的金额');
							return;
						}
					}
					if(params.YbThresholds != undefined) {
						if(params.YbThresholds.includes("")) {
							this.$message.error('请检查是否有未输入的金额');
							return;
						}
					}
					if(!this.isHasFloatNumber(params.RiskThresholds)){
						this.$message.error('请检查是否含有小数');
						return;
					}
					if(!this.isHasFloatNumber(params.SmsThresholds)){
						this.$message.error('请检查是否含有小数');
						return;
					}
					if(!this.isHasFloatNumber(params.TDGPThresholds)){
						this.$message.error('请检查是否含有小数');
						return;
					}
					if(params.HlbThresholds != undefined) {
						if(!this.isHasFloatNumber(params.HlbThresholds)) {
							this.$message.error('请检查是否含有小数');
							return;
						}
					}
					if(params.CjThresholds != undefined) {
						if(!this.isHasFloatNumber(params.CjThresholds)) {
							this.$message.error('请检查是否含有小数');
							return;
						}
					}
					if(params.CAThresholds != undefined) {
						if(!this.isHasFloatNumber(params.CAThresholds)) {
							this.$message.error('请检查是否含有小数');
							return;
						}
					} 
					if(params.FyThresholds != undefined) {
						if(!this.isHasFloatNumber(params.FyThresholds)) {
							this.$message.error('请检查是否含有小数');
							return;
						}
					} 
					if(params.YbThresholds != undefined) {
						if(!this.isHasFloatNumber(params.YbThresholds)) {
							this.$message.error('请检查是否含有小数');
							return;
						}
					} 
					if( this.getArrayType(params.RiskThresholds) && this.getArrayType(params.SmsThresholds) && this.getArrayType(params.TDGPThresholds) ){
						if( params.HlbThresholds != undefined ){
							if( !this.getArrayType(params.HlbThresholds) ){
								this.$message.error('请检查是否有当前阈值小于等于前一个阈值');
								return;
							}
						}else{
							params.HlbThresholds = null;
						}
						if( params.CjThresholds != undefined ){
							if( !this.getArrayType(params.CjThresholds) ){
								this.$message.error('请检查是否有当前阈值小于等于前一个阈值');
								return;
							}
						}else{
							params.CjThresholds = null;
						}
						if( params.CAThresholds != undefined ){
							if( !this.getArrayType(params.CAThresholds) ){
								this.$message.error('请检查是否有当前阈值小于等于前一个阈值');
								return;
							}
						}else{
							params.CAThresholds = null;
						}
						if( params.FyThresholds != undefined ){
							if( !this.getArrayType(params.FyThresholds) ){
								this.$message.error('请检查是否有当前阈值小于等于前一个阈值');
								return;
							}
						}else{
							params.FyThresholds = null;
						}
						if( params.YbThresholds != undefined ){
							if( !this.getArrayType(params.YbThresholds) ){
								this.$message.error('请检查是否有当前阈值小于等于前一个阈值');
								return;
							}
						}else{
							params.YbThresholds = null;
						}
						editthreshold(params).then(res => {
							if(res.Ret == 200) {
								this.$message.success(res.Msg);
								this.$router.replace({path:'/bizalert'});
							}
						})
					}else{
						this.$message.error('请检查是否有当前阈值小于等于前一个阈值');
					}
				}
			},
			getArrayType(arr) { //判断数组前一个是否比后一个小
				for( let i = 0; i < arr.length; i++ ){
					if(i < arr.length - 1) {
						const current = arr[i];
						const next = arr[i + 1];
						console.log(current, next);
						if(current >= next) {
							return false;
						}
					} else {
						continue;
					}
				}
				return true;
			},
			isHasFloatNumber(arr){ //判断是否含有小数
				for(let i = 0; i < arr.length; i++) {
					if(Number.isInteger(arr[i])){
						continue;
					}else{
						return false;
					}
				}
				return true;
			},
			resizeData() {
				this.dataList = JSON.parse(JSON.stringify(this.copyDataList));
				this.fcCount = 0;
				this.smsCount = 0;
				this.loanCount = 0;
				this.hlbCount = 0;
				this.cjCount = 0;
				this.caCount = 0;
				this.fyCount = 0;
				this.ybCount = 0;
			},
			getthreshold() {
				threshold({}).then(res => {
					console.log(res);
					if(res.Ret == 200) {
						this.dataList.RiskThresholds = res.RiskThresholds == null ? [""] : res.RiskThresholds;
						this.dataList.SmsThresholds = res.SmsThresholds == null ? [""] : res.SmsThresholds;
						this.dataList.TDGPThresholds = res.TDGPThresholds == null ? [""] : res.TDGPThresholds;
						this.dataList.HlbThresholds = res.HlbThresholds === null ? [""] : res.HlbThresholds;
						this.dataList.CjThresholds = res.CjThresholds === null ? [""] : res.CjThresholds;
						this.dataList.CAThresholds = res.CAThresholds === null ? [""] : res.CAThresholds;
						this.dataList.FyThresholds = res.FyThresholds === null ? [""] : res.FyThresholds;
						this.dataList.YbThresholds = res.YbThresholds === null ? [""] : res.YbThresholds;
						this.copyDataList = JSON.parse(JSON.stringify(this.dataList));
					}
				});
			}
		},
		components:{ thresholdset }
	};
</script>
<style lang="scss" scoped>
	.header-title{ background:#fff; height:60px; line-height:60px; text-align:right; box-sizing:border-box; padding-right:14px; }
	.main{ padding:35px 26px 0; background:#fff; margin-top:12px; }
</style>