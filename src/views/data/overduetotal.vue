<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header" style="position:relative;">
				<el-form :inline="true" :model="form" @submit.native.prevent>
					<el-form-item label="日期">
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:280px;"></el-date-picker>
		  			</el-form-item>
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
					<el-table-column prop="LoanReturnDate" label="日期"></el-table-column>
					<el-table-column prop="AllCount" label="当天到期人数"></el-table-column>
					<el-table-column prop="AllMoney" label="当天到期本金"></el-table-column>
					<el-table-column prop="PayMoney" label="当天还款本金（累计）" :render-header="renderHeader"></el-table-column>
					<el-table-column label="当天还款率">
						<template slot-scope="scope">{{parseInt(scope.row.RepaymentRate*10000)/100}}%</template>
					</el-table-column>
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
import { saasoverduestaic } from 'api/api.js';
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
	},
	methods: {
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
				params.StartTime=this.form.dateValue[0];
				params.EndTime=this.form.dateValue[1];
			}
			this.listLoading = true;
			saasoverduestaic(params).then((res) => {
				console.log(res);
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.Result.UserSum;
				this.tableData = res.Result.List || [];
				this.listLoading = false;
			});
		},
		renderHeader(h,{column,$index}){ //当天还款金额（累计）
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
		        h('el-tooltip',{props:{placement:'top', content:'仅包含当天到期的还款本金（含续期成功的本金），提前还款和逾期还款的本金都不包含在内。备注：该数据为实时数据，每小时更新一次。'}},
		            [ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
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
</style>