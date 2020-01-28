<template>
	<div>
		<template>
			<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
				<el-table-column prop="CreateTime" label="还款时间" min-width="100"></el-table-column>
				<el-table-column prop="ReturnMoney" label="还款金额"></el-table-column>
				<el-table-column prop="ChannelString" label="还款方式"></el-table-column>
				<el-table-column prop="OrderNumber" label="订单号" min-width="180"></el-table-column>
				<el-table-column prop="OverdueDays" label="还款说明" :formatter="overdueDays"></el-table-column>
				<el-table-column prop="State" label="状态"></el-table-column>
				<el-table-column prop="ReturnCapitalAmount" label="本金（元）"></el-table-column>
				<el-table-column prop="ReturnTaxAmount" label="利息（元）"></el-table-column>
				<el-table-column prop="OthersMoney" label="其他（元）"></el-table-column>
			</el-table>
			<el-col :span="24" class="toolbar">
		  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		  	</el-col>
		</template>
	</div>
</template>

<script>
	import {repaymentrecord} from 'api/api.js';
	export default {
		props:{
      		uid:{
        		type:String,
        		default:{type:''}
      		}
    	},
		data() {
			return {
				page: 1,
				total: 0,
				pageSize: 15,
				pageCount: 1,
				ispage: true,
				listLoading: false,
				tableData: []
			}
		},
		mounted() {
			this.getrepaymentrecord();
		},
		methods: {
			getrepaymentrecord(){ //获取还款记录列表
				let params = {Uid:parseInt(this.uid),PageSize:this.pageSize,Page:this.page};
				this.listLoading = true;
				repaymentrecord(params).then((res) => {
					if( res.Ret!=200 ){
						return false;
					}
					this.total=res.Result.UserSum;
					if( res.Result.List == null ){
						this.tableData = [];
					}else{
						this.tableData = res.Result.List;
						this.pageCount = Math.ceil(this.total/this.pageSize);
					}
					this.listLoading = false;
				});
			},
			handleCurrentChange(current){  //分页页码跳转
				this.page = current;
				this.getrepaymentrecord();
			},
			handleSizeChange(val){    //分页页码改变
		        this.pageSize=val;
		        this.getrepaymentrecord();
		   	},
		   	overdueDays(row){  //还款说明
		   		return row.OverdueDays>0?"逾期还款":"到期还款";
		   	}

		}
	}
</script>

<style scoped lang="scss"></style>