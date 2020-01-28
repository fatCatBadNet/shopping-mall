<template>
	<div>
		<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
			<el-table-column label="续期时间" prop="CreateTime" min-width="115"></el-table-column>
			<el-table-column label="续期本金(元)" prop="Money"></el-table-column>
			<el-table-column label="续期总费用" prop="PayMoney" :render-header="renderHeader1"></el-table-column>
			<el-table-column label="续期服务费" prop="VipFee"></el-table-column>
			<el-table-column label="结清利息" prop="InterestFee"></el-table-column>
			<el-table-column label="续期手续费" prop="ProcedureFee"></el-table-column>
			<el-table-column label="续期期限" min-width="150">
				<template slot-scope="scope">
					<label style="display:inline-block; width:40px;">{{scope.row.RenewDay}}天</label>
					<span style="color:#999;">{{scope.row.LoanDate}}至{{scope.row.EndDate}}</span>
				</template>
			</el-table-column>
			<el-table-column label="续期状态" prop="RenewTip">
				<!--<template slot-scope="scope">{{scope.row.Channel==3?'合利宝':scope.row.Channel==8?'畅捷':''}}</template>-->
			</el-table-column>
			<el-table-column label="订单号" prop="OrderNumber" min-width="180"></el-table-column>
			<el-table-column label="续期结果" prop="StateDesc" min-width="120">
				<!-- <template slot-scope="scope">
					<span v-if="scope.row.State=='CONFIRM'" style="color:#1d9fff;">支付结果确认中</span>
					<span v-else-if="scope.row.State=='SUCCESS'" style="color:#333;">成功</span>
					<span v-else><span style="color:red;">失败</span><span style="float:right; color:#999; font-size:12px;">{{scope.row.FailReason}}</span></span>
				</template> -->
			</el-table-column>
		</el-table>
		<el-col :span="24" class="toolbar">
			<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		</el-col>
	</div>
</template>

<script>
	import {renewlist} from "api/api.js";
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
				ispage: true,
				listLoading: false,
				tableData: []
			};
		},
		mounted() {
			this.getlist();
		},
		methods: {
			getlist() {  //获取列表
				let params = {Uid:parseInt(this.uid),PageSize:this.pageSize,Page:this.page};
				this.listLoading = true;
				renewlist(params).then(res => {
//					console.log(res);
					if(res.Ret != 200) {
						return false;
					}
					this.total = res.Result.UserSum;
					if(res.Result.List == null) {
						this.tableData = [];
					} else {
						this.tableData = res.Result.List;
					}
					this.listLoading = false;
				});
			},
			renderHeader1(h,{column,$index}){	//续期总费用
				return h("div",{attrs:{style:"padding:0;"}},[
			        h("span",column.label),
			        h('el-tooltip',{props:{placement:'top',content:'续期总费用为续期服务费、结清利息、续期手续费之和。'}},
						[ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
					)
			    ]);
			},
			handleCurrentChange(current) {  //分页页码跳转
				this.page = current;
				this.getlist();
			},
			handleSizeChange(val) {  //分页页码改变
				this.pageSize = val;
				this.getlist();
			}
		}
	};
</script>

<style scoped lang="scss">
	.header .el-form-item {
		margin-bottom: 0;
	}
	.status-img {
		width: 20px;
		vertical-align: middle;
	}
</style>