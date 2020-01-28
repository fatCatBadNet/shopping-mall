<template>
	<div id="channeldata">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane name="one" style="padding-right:0;">
				<el-tooltip slot="label" effect="dark" content="指按注册当天统计" placement="top">
					<span>按注册</span>
				</el-tooltip>
				<by-register v-if="activeName == 'one'"></by-register>
			</el-tab-pane>
			<el-tab-pane name="two">
				<el-tooltip slot="label" effect="dark" content="指按实际操作时间统计" placement="top">
					<span>按借款</span>
				</el-tooltip>
				<by-loan v-if="activeName == 'two'"></by-loan>
			</el-tab-pane>
		</el-tabs>	
	</div>
</template>

<script>
	import ByRegister from './by_register.vue';
	import ByLoan from './by_loan.vue';
	export default {
		data() {
			return {
				activeName:'one'
			};
		},
		mounted(){},
		methods:{
			handleClick(e){
				this.activeName = e.name;
			}
		},
		components:{ByRegister,ByLoan}
	};
</script>

<style lang="scss" scoped></style>