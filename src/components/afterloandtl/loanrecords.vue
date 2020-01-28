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
				<el-table-column label="状态">
					<template slot-scope="scope">
  	    		        <span :style="[{color:scope.row.State=='还款中'?'#3ead74':'#333'}]">{{scope.row.State}}</span>
	  	    		</template>
				</el-table-column>
				<el-table-column label="操作" width="300">
					<template slot-scope="scope">
  	    		        <el-button type="primary" plain size="mini" @click="lookschedule(scope.row.Id)">还款计划</el-button>
  	    		        <!-- <el-button type="primary" plain size="mini" v-if="scope.row.State=='还款中'" @click="goRepay(scope.row.RepaymentScheduleId)">代扣</el-button> -->
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
			<br />
		</el-dialog>
		<!-- 代扣弹框 -->
		<el-dialog title="代扣提示" :visible.sync="repayDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="400px">
			<el-form :model="repayForm" :rules="rules" label-width="80px" ref="repayForm">
				<el-form-item label="代扣渠道" prop="Channel">
					<el-select v-model="repayForm.Channel" placeholder="请选择">
						<el-option label="代扣" :value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="代扣金额" prop="ReturnMoney">
					<el-input v-model.number="repayForm.ReturnMoney" placeholder="请输入代扣金额" clearable auto-complete="off" style="width:80%;"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="repaySubmit">确定</el-button>
				<el-button @click.native="repayDialog=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {loanrecord,repaymentschedule,repayment} from 'api/api.js';
	export default {
		props:{
      		uid:{
        		type:String,
        		default:{type:''}
      		}
    	},
		data() {
			return {
				page:1,
				total:0,
				pageSize:15,
				ispage:true,
				listLoading:false,
				tableData:[],
				showDialog:false,
				scheduleData:[],
				scheduleLoading:false,
				repayDialog:false,
				repayForm:{
					RepaymentScheduleId:null,
					ReturnMoney:null,
					Channel:3
				},
				rules:{
					Channel:[{
						required:true,
						message:'请选择代扣渠道',
						trigger:'blur'
					}],
					ReturnMoney:[{
						required:true,
						message:'请输入代扣金额',
						trigger:'blur'
					}]
				}
			}
		},
		mounted() {
			this.getloanrecord();
		},
		methods: {
			goRepay(id){  //代扣弹窗
				this.repayForm.RepaymentScheduleId=id;
				this.repayDialog=true;
			},
			repaySubmit(){  //提交代扣
				this.$refs.repayForm.validate((valid) => {
					if( valid ){
						console.log( this.repayForm.ReturnMoney,!(this.repayForm.ReturnMoney%1===0) );
						if( this.repayForm.ReturnMoney<0 || !(this.repayForm.ReturnMoney%1===0) ){
							this.$message.error( "代扣金额只能输入大于0的整数！" );
							return false;
						}
						let params=this.repayForm;
						params.Uid=parseInt(this.uid);
						repayment(params).then((res) => {
							if( res.Ret==200 ){
								this.$message.success( res.Msg );
								this.getloanrecord();
							}
						});
					}
				});
			},
			getloanrecord(){ //获取借款记录列表
				let params = {Uid:parseInt(this.uid),PageSize:this.pageSize,Page:this.page};
				this.listLoading = true;
				loanrecord(params).then((res) => {
					console.log(res);
					if( res.Ret!=200 ){
						return false;
					}
					this.total=res.Result.UserSum;
					if( res.Result.List == null ){
						this.tableData = [];
					}else{
						this.tableData = res.Result.List;
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