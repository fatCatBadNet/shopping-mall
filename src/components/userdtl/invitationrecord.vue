<template>
	<div>
		<template>
			<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
				<el-table-column prop="Account" label="被邀请手机号"></el-table-column>
				<el-table-column prop="CreateTime" label="注册时间"></el-table-column>
				<el-table-column prop="LoanTime" label="放款时间"></el-table-column>
				<el-table-column label="奖励">
					<template slot-scope="scope">
  	    		        <span style="color:#000;">{{scope.row.CashValue}}元</span>
	  	    		</template>
				</el-table-column>
				<el-table-column label="奖励状态">
					<template slot-scope="scope">
  	    		        <span style="color:blue;">{{scope.row.IsGet==0?"待发放":"已发放"}}</span>
	  	    		</template>
				</el-table-column>
			</el-table>
		</template>
		<el-col :span="24" class="toolbar">
	  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
	  	</el-col>
	</div>
</template>

<script>
	import {invitationrecord} from 'api/api.js';
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
			this.getinvitationrecord();
		},
		methods: {
			getinvitationrecord(){ //获取还款计划列表
				let params = {Uid:parseInt(this.uid),PageSize:this.pageSize,Page:this.page};
				this.listLoading = true;
				invitationrecord(params).then((res) => {
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
				this.getinvitationrecord();
			},
			handleSizeChange(val){    //分页页码改变
		        this.pageSize=val;
		        this.getinvitationrecord();
		   	}

		}
	}
</script>

<style scoped lang="scss"></style>