<template>
	<div>
		<template>
			<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
				<el-table-column prop="CreateTime" label="购买时间"></el-table-column>
				<el-table-column prop="TicketName" label="报告类型"></el-table-column>
				<el-table-column prop="RealMoney" label="支付金额"></el-table-column>
				<el-table-column prop="OrderNumber" label="订单号" min-width="150"></el-table-column>
				<el-table-column prop="ChannelString" label="支付方式"></el-table-column>
				<el-table-column prop="State" label="状态"></el-table-column>
			</el-table>
		</template>
		<el-col :span="24" class="toolbar">
	  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
	  	</el-col>
	</div>
</template>

<script>
	import {reportbuyrecord} from 'api/api.js';
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
			this.getreportbuyrecord();
		},
		methods: {
			getreportbuyrecord(){ //获取购买记录列表
				let params = {Uid:parseInt(this.uid),PageSize:this.pageSize,Page:this.page};
				this.listLoading = true;
				reportbuyrecord(params).then((res) => {
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
				this.getreportbuyrecord();
			},
			handleSizeChange(val){    //分页页码改变
		        this.pageSize=val;
		        this.getreportbuyrecord();
		   	}

		}
	}
</script>

<style scoped lang="scss"></style>