<template>
	<div>
		<template>
			<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
				<el-table-column prop="LoanDate" label="申请时间" min-width="150"></el-table-column>
				<el-table-column prop="Money" label="借款金额"></el-table-column>
				<el-table-column prop="LoanTax" label="利息"></el-table-column>
				<el-table-column prop="LoanService" label="服务费"></el-table-column>
				<el-table-column prop="RealMoney" label="到账金额"></el-table-column>
				<el-table-column label="借款期限" min-width="150">
					<template slot-scope="scope">
  	    		        <label>{{scope.row.LoanTermCount}}天</label>
  	    		        <span style="margin-left:10px; color:#999;">{{scope.row.ReplyTime}}至{{scope.row.EndDate}}</span>
	  	    		</template>
				</el-table-column>
				<el-table-column prop="State" label="状态"></el-table-column>
				<el-table-column label="操作" width="300">
					<template slot-scope="scope">
  	    		        <span class="editwordSty" @click="lookschedule(scope.row.Id)">还款计划</span>
	  	    		</template>
				</el-table-column>
			</el-table>
			<el-col :span="24" class="toolbar">
		  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		  	</el-col>
		</template>
	  	<!--还款计划-->
	  	<el-dialog title="还款计划" :visible.sync="showDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="1100px">
			<el-table :data="scheduleData" v-loading="scheduleLoading" element-loading-text="数据加载中..." border style="width:100%; text-align:left;">
				<el-table-column prop="TermNo" label="期数"></el-table-column>
				<el-table-column prop="LoanReturnDate" label="到期时间"></el-table-column>
				<el-table-column prop="OverdueDays" label="逾期天数"></el-table-column>
				<el-table-column prop="CapitalAmount" label="本金">
					<template slot-scope="scope">
							{{scope.row.CapitalAmount}} 元
					</template>
				</el-table-column>
				<el-table-column prop="TaxAmount" label="利息">
					<template slot-scope="scope">
							{{scope.row.TaxAmount}} 元
					</template>
				</el-table-column>
				<el-table-column prop="OverdueBreachOfAmount" label="违约金">
					<template slot-scope="scope">
							{{scope.row.OverdueBreachOfAmount}} 元
					</template>
				</el-table-column>
				<el-table-column prop="OverdueMoneyAmount" label="滞纳金">
					<template slot-scope="scope">
							{{scope.row.OverdueMoneyAmount}} 元
					</template>
				</el-table-column>
				<el-table-column label="待还金额">
					<template slot-scope="scope">
						<span style="color:#de8484;">{{scope.row.NoReturnMoney}} 元</span>	
					</template>
				</el-table-column>
				<el-table-column prop="ReturnMoney" label="已还金额">
					<template slot-scope="scope">
							{{scope.row.ReturnMoney}} 元
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
  	    		        <span class="editwordSty" @click="returnRecord">还款记录</span>
	  	    		</template>
				</el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script>
	import {loanrecord,repaymentschedule} from 'api/api.js';
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
				tableData: [],
				showDialog:false,
				scheduleData:[],
				scheduleLoading:false
			}
		},
		mounted() {
			this.getloanrecord();
		},
		methods: {
			getloanrecord(){ //获取借款记录列表
				let params = {Uid:parseInt(this.uid),PageSize:this.pageSize,Page:this.page};
				this.listLoading = true;
				loanrecord(params).then((res) => {
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
				this.getloanrecord();
			},
			handleSizeChange(val){    //分页页码改变
		        this.pageSize=val;
		        this.getloanrecord();
		   	},
		   	lookschedule(id){
		   		let params = {LoanId:id};
				this.scheduleLoading = true;
				repaymentschedule(params).then((res) => {
					if( res.Ret!=200 ){
						return false;
					}
					this.showDialog=true;
					if( res.Result.List == null ){
						this.scheduleData = [];
					}else{
						this.scheduleData = res.Result.List;
					}
					this.scheduleLoading = false;
				});
		   	},
		   	returnRecord(){
		   		this.showDialog=false;
		   		this.$emit('goloanrecords');
		   	}

		}
	}
</script>

<style scoped lang="scss">

</style>