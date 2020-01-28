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
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border :summary-method="getSummaries" show-summary>
					<el-table-column prop="CreateTime" label="时间" min-width="90"></el-table-column>
					<el-table-column prop="NumReturn" label="当天还款老用户数" :render-header="renderHeader1"></el-table-column>
					<el-table-column prop="NumReturnAfterSuccess" label="当天成功复借人数" :render-header="renderHeader7"></el-table-column>
					<el-table-column prop="RateReturnAfterSuccess" label="当天复借率" :render-header="renderHeader2"></el-table-column>
					<el-table-column prop="NumReturnAfterSuccess3" label="3天复借人数" :render-header="renderHeader3"></el-table-column>
					<el-table-column prop="RateReturnAfterSuccess3" label="3天复借率" :render-header="renderHeader4"></el-table-column>
					<el-table-column prop="NumReturnAfterSuccess7" label="7天复借人数" :render-header="renderHeader5"></el-table-column>
					<el-table-column prop="RateReturnAfterSuccess7" label="7天复借率" :render-header="renderHeader6"></el-table-column>
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
import { saasreturnafterloandalily,buttonctl } from 'api/api.js';
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
			dataResult:{},
			form:{ 
				dateValue:[http.dateFormatter(new Date(new Date().getTime()-30*24*60*60*1000),false),http.dateFormatter(new Date(),false)]
			}
		}
	},
	mounted(){
		this.getlist();
		buttonctl({}).then((res) => {  
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
			let url= `${process.env.API_ROOT}/export/saasreturnafterloandalilyexportexcel?start_time=${this.form.dateValue[0]} 00:00:00&end_time=${this.form.dateValue[1]} 23:59:59&merchant=${JSON.parse( sessionStorage.getItem('userDtl') ).Merchant}&account=${JSON.parse( sessionStorage.getItem('userDtl') ).Account}`;
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
			saasreturnafterloandalily(params).then((res) => {
				if( res.Ret==200 ){
					this.dataResult=res.Result;
					this.total=res.Result.UserSum;
					this.tableData = res.Result.List || [];
					this.listLoading = false;
				}
			});
		},
		getSummaries(param){
			const sums = ["总计",this.dataResult.TotalNumReturn,this.dataResult.TotalNumReturnAfterSuccess,this.dataResult.TotalRateNumReturnAfterSuccess,this.dataResult.TotalNumReturnAfterSuccess3,this.dataResult.TotalRateNumReturnAfterSuccess3,this.dataResult.TotalNumReturnAfterSuccess7,this.dataResult.TotalRateNumReturnAfterSuccess7];
			return sums;
		},
		handleCurrentChange(current){  //分页页码跳转
			this.page = current;
			this.getlist();
		},
		handleSizeChange(val){    //分页页码改变
	        this.pageSize=val;
	        this.getlist();
	    },
		renderHeader1(h,{column,$index}){  //当天还款老用户数
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
		        h('el-tooltip',{props:{placement:'top',content:'指当天还款 且当天还款之前至少有一次成功还款记录的用户'}},
					[ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		},
		renderHeader7(h,{column,$index}){  //当天成功复借人数
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
		        h('el-tooltip',{props:{placement:'top',content:'当天00:00:00至23:59:59时间段成功还款的用户数中当天成功借款的用户数'}},
					[ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		},
		renderHeader2(h,{column,$index}){  //当天复借率
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
		        h('el-tooltip',{props:{placement:'top',content:'当天成功复借用户数/当天还款老用户数*100%'}},
					[ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		},
		renderHeader3(h,{column,$index}){  //3天复借人数
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
		        h('el-tooltip',{props:{placement:'top',content:'当天还款的用户数在接下来3天成功借款的用户数'}},
					[ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		},
		renderHeader4(h,{column,$index}){  //3天复借率
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
		        h('el-tooltip',{props:{placement:'top',content:'3天复借人数/当天还款用户数*100%'}},
					[ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		},
		renderHeader5(h,{column,$index}){  //7天复借人数
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
		        h('el-tooltip',{props:{placement:'top',content:'当天还款的用户数在接下来7天成功借款的用户数'}},
					[ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		},
		renderHeader6(h,{column,$index}){  //7天复借率
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
		        h('el-tooltip',{props:{placement:'top',content:'7天复借人数/当天还款用户数*100%'}},
					[ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		}
	}
}	
</script>

<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
</style>