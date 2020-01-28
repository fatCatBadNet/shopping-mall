<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header" style="position:relative;">
				<el-form :inline="true" :model="form" @submit.native.prevent>
					<el-form-item label="日期">
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:280px;"></el-date-picker>
		  			</el-form-item>
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
		  			<el-form-item v-if="ExportButton">
						<el-button type="primary" size="small" @click="exportexcel">导出</el-button>
					</el-form-item>
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border show-summary>
					<el-table-column prop="CreateTime" label="时间" min-width="90"></el-table-column>
					<el-table-column prop="VipIncome" label="信用报告"></el-table-column>
					<el-table-column prop="TaxIncome" label="息费"></el-table-column>
					<el-table-column prop="DelayingIncome" label="滞纳金"></el-table-column>
					<el-table-column prop="BreachOfIncome" label="违约金"></el-table-column>
					<el-table-column prop="CurrTotalIncome" label="合计"></el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
		  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		  	</el-col>
		</el-card>
	</div>
</template>

<script>
import http from "../../api/http.js";
import { saasdailyincome, buttonctl } from 'api/api.js';
export default {
	data(){
		return {
			pickerOptions:{
						onPick(e){
							this.$nextTick(()=>{
								var a=  document.getElementsByClassName('el-icon-arrow-right');
								a[1].removeAttribute('disabled');
								a[1].classList.remove('is-disabled');
							})
						}
					},
			ExportButton:false,
			page:1,
			total:0,
			pageSize:15,
			ispage:true,
			listLoading:false,
			tableData:[],
			form:{ 
				dateValue:[http.dateFormatter(new Date(new Date().getTime()-14*24*60*60*1000),false),http.dateFormatter(new Date(),false)]
			}
		}
	},
	mounted(){
		this.getlist();
		buttonctl({}).then((res) => {  
			console.log(res);
			this.ExportButton=false;
			if( res.Ret==200 && res.AllCtl.ExportButton ){
				this.ExportButton=res.AllCtl.ExportButton;
			}
		});
	},
	methods: {
		exportexcel(){  //导出数据
	   		if( !this.form.dateValue ){
	   			this.$message.error("日期不得为空！");
				return false;
			}
			let url= `${process.env.API_ROOT}/export/saasdailyincomeexportexcel?start_time=${this.form.dateValue[0]} 00:00:00&end_time=${this.form.dateValue[1]} 23:59:59&merchant=${JSON.parse( sessionStorage.getItem('userDtl') ).Merchant}&account=${JSON.parse( sessionStorage.getItem('userDtl') ).Account}`;
			window.location.href=url;
	   	},
		search(){  //搜索
			this.ispage = false;
			this.$nextTick(() => {
				this.page = 1;
				this.getlist();
				this.ispage = true;
			});
		},
		getlist(){  //获取认证用户列表
			let params = {
				Page:this.page,
				PageSize:this.pageSize
			};
			if( !this.form.dateValue ){
				params.StartTime='';
				params.EndTime='';
			}else{
				params.StartTime=this.form.dateValue[0]+' 00:00:00';
				params.EndTime=this.form.dateValue[1]+' 23:59:59';
			}
			this.listLoading = true;
			saasdailyincome(params).then((res) => {
				console.log(res);
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.Result.UserSum;
				this.TotalLoanMoney=res.Result.TotalLoanMoney;
				this.TotalRealMoney=res.Result.TotalRealMoney;
				if(res.Result.List == null){
					this.tableData = [];
				}else{
					this.tableData = res.Result.List;
				}
				this.listLoading = false;
			});
		},
		handleCurrentChange(current){  //分页页码跳转
			this.page = current;
			this.getlist();
		},
		handleSizeChange(val){    //分页页码改变
	        this.pageSize=val;
	        this.getlist();
	    }
		
	}
}	
</script>

<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
	.status-img{
		width: 20px;
		vertical-align: middle;
	}
    .item-tooltip{}
</style>