<template>
	<div v-if="tabDisplay">
		<returndtl :uid="loanid" @dispalyBtn="dispalyBtn" ></returndtl>
		<el-card class="box-card" >
			<el-tabs v-model="activeName" lazy @tab-click="handleClick">
		    	<el-tab-pane label="借款记录" name="借款记录">
		    		<loanrecords :uid="uid" @goloanrecords="activeName='还款记录'"></loanrecords>
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
		    	<el-tab-pane label="联系历史" name="联系历史">
		    		<contacthistory :uid="uid"></contacthistory>
		    	</el-tab-pane>
		  	</el-tabs>
		</el-card>
	</div>
</template>

<script>
	import returndtl from '@/components/returndtl/returndtl.vue';
	import loanrecords from '@/components/returndtl/loanrecords.vue';
	import repaymentrecord from '../../components/userDtl/repaymentrecord.vue';
	import reportbuyrecord from '../../components/userDtl/reportbuyrecord.vue';
	import usersbankcard from '../../components/userDtl/usersbankcard.vue';
	import renewrecord from '../../components/userDtl/renewrecord.vue';
	import contacthistory from '../../components/userDtl/contacthistory.vue';
import { setTimeout, clearTimeout } from 'timers';
	export default {
		data(){
			return {
				tabDisplay:true,
				loanid:this.$route.params.loanid,
				uid:this.$route.params.uid,
				activeName:'借款记录'
			}
		},
		mounted(){
			console.log(this.$route.params);
		},
		methods: {
			dispalyBtn(){
				this.tabDisplay = false;
				clearTimeout(this.timer);
				this.timer = setTimeout(()=>{
					this.tabDisplay=true;
				},300)
			},
			handleClick(tab,event){},  //tab切换
	      	returnloanrecords(){  //还款记录切换
	      		this.activeName="还款记录";
	      	}
		},
		components:{returndtl,loanrecords,repaymentrecord,reportbuyrecord,usersbankcard,renewrecord,contacthistory}
	}
</script>

<style lang="scss" scoped>
	.el-card{ padding-bottom:0; }
</style>