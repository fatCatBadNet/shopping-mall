<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header" style="position:relative;">
				<el-form :inline="true" :model="form" @submit.native.prevent>
					<el-form-item label="日期">
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"   :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:280px;"></el-date-picker>
		  			</el-form-item>
                    <el-form-item label="渠道">
		  		   		<el-select v-model="form.Source" clearable filterable placeholder="请选择" style="width:180px;">
					    	<el-option v-for="item in SourceArr" :key="item.Value" :label="item.Label" :value="item.Label"></el-option>
					  	</el-select>
		  			</el-form-item>
		  			<el-form-item label="数据类型">
						<el-select v-model="form.DataType" @change="search" placeholder="请选择" style="width:180px;">
						    <el-option label="按人数统计" :value="1"></el-option>
						    <el-option label="按金额统计" :value="2"></el-option>
						</el-select>
					</el-form-item>
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
                    <el-form-item v-if="ExportButton">
						<el-button type="primary" size="small" @click="exportexcel">导出</el-button>
					</el-form-item>
					<el-form-item  style="margin-left:10px;">
						<el-checkbox v-model="is_display">逾期3天和7天数据展示</el-checkbox>
					</el-form-item>
		  		</el-form>
			</div>
			<template>
				<div v-show="form.DataType==1">
					<el-table v-show="is_display" :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;">
						<el-table-column prop="CreateTime" label="日期" min-width="95"></el-table-column>
						<el-table-column prop="Source" label="渠道"></el-table-column>
						<el-table-column prop="NumRegister" label="注册用户"></el-table-column>
						<el-table-column prop="NumCertApply" label="认证用户"></el-table-column>
						<el-table-column prop="NumCreditApply" label="授信申请"></el-table-column>
						<el-table-column prop="NumCredit" label="授信通过"></el-table-column>
	                    <el-table-column prop="ProCredit" label="授信通过率" :render-header="renderHeader4" min-width="150"></el-table-column>
	                    
	                    <el-table-column prop="NumLoanApply" label="借款申请"></el-table-column>
	                    <el-table-column prop="NumLoanSuccess" label="借款通过"></el-table-column>
	                    <el-table-column prop="LoanSuccessRate" label="借款通过率" min-width="95"></el-table-column>
						
						<el-table-column prop="AllNumExpire" label="当天到期"></el-table-column>
						<el-table-column prop="AllNumExpireOverdue" label="当天逾期"></el-table-column>
	                    <el-table-column prop="AllNumExpireOverdue3" label="逾期3天"></el-table-column>
	                    <el-table-column prop="AllNumExpireOverdue7" label="逾期7天"></el-table-column>
	                    <el-table-column prop="ProOverdue" label="首逾率" :render-header="renderHeader1" min-width="125"></el-table-column>
	                    <el-table-column prop="ProOverdue3" label="3天逾期率" :render-header="renderHeader2" min-width="145"></el-table-column>
	                    <el-table-column prop="ProOverdue7" label="7天逾期率" :render-header="renderHeader3" min-width="145"></el-table-column>
					</el-table>

					<el-table v-show="!is_display" :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;">
						<el-table-column prop="CreateTime" label="日期" min-width="95"></el-table-column>
						<el-table-column prop="Source" label="渠道"></el-table-column>
						<el-table-column prop="NumRegister" label="注册用户"></el-table-column>
						<el-table-column prop="NumCertApply" label="认证用户"></el-table-column>
						<el-table-column prop="NumCreditApply" label="授信申请"></el-table-column>
						<el-table-column prop="NumCredit" label="授信通过"></el-table-column>
	                    <el-table-column prop="ProCredit" label="授信通过率" :render-header="renderHeader4" min-width="150"></el-table-column>
	                    
	                    <el-table-column prop="NumLoanApply" label="借款申请"></el-table-column>
	                    <el-table-column prop="NumLoanSuccess" label="借款通过"></el-table-column>
	                    <el-table-column prop="LoanSuccessRate" label="借款通过率" min-width="95"></el-table-column>
						
						<el-table-column prop="AllNumExpire" label="当天到期"></el-table-column>
						<el-table-column prop="AllNumExpireOverdue" label="当天逾期"></el-table-column>
	                    <el-table-column prop="ProOverdue" label="首逾率" :render-header="renderHeader1" min-width="125"></el-table-column>
					</el-table>

					<el-col :span="24" class="toolbar">
						<span style="font:14px/32px '微软雅黑';">
						合计：注册总人数 <label class="editwordSty">{{TotalNumRegister}}</label> &nbsp;&nbsp;&nbsp; 
							认证总人数 <label class="editwordSty">{{TotalNumCertApply}}</label>&nbsp;&nbsp;&nbsp; 
							授信总人数 <label class="editwordSty">{{TotalNumCreditApply}}</label>&nbsp;&nbsp;&nbsp; 
							授信通过总人数 <label class="editwordSty">{{TotalNumCredit}}</label>
						</span>
				  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
				  	</el-col>
				</div>
				<div v-show="form.DataType==2">
					<el-table v-show="is_display" :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;">
						<el-table-column prop="CreateTime" label="日期" min-width="95"></el-table-column>
						<el-table-column prop="Source" label="渠道"></el-table-column>
	                    <el-table-column prop="MoneyCredit" label="授信通过" :render-header="renderHeader5" min-width="140"></el-table-column>
	                    
	                    <el-table-column prop="CapitalLoanApply" label="借款申请金额" min-width="105"></el-table-column>
	                    <el-table-column prop="CapitalToAccount" label="借款通过金额" min-width="105"></el-table-column>
	                    <el-table-column prop="LoanSuccessRate" label="借款金额通过率" min-width="120"></el-table-column>
	                    
						<el-table-column prop="MoneyToAccount" label="到账金额"></el-table-column>
						<el-table-column prop="AllCapitalExpire" label="当天到期"></el-table-column>
						<el-table-column prop="AllCapitalExpireOverdue" label="当天逾期"></el-table-column>
	                    <el-table-column prop="AllCapitalExpireOverdue3" label="逾期3天"></el-table-column>
	                    <el-table-column prop="AllCapitalExpireOverdue7" label="逾期7天"></el-table-column>
	                    <el-table-column prop="ProOverdue" label="首逾率" :render-header="renderHeader6" min-width="125"></el-table-column>
	                    <el-table-column prop="ProOverdue3" label="3天逾期率" :render-header="renderHeader7" min-width="145"></el-table-column>
	                    <el-table-column prop="ProOverdue7" label="7天逾期率" :render-header="renderHeader8" min-width="145"></el-table-column>
					</el-table>
					<el-table v-show="!is_display" :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;">
						<el-table-column prop="CreateTime" label="日期" min-width="95"></el-table-column>
						<el-table-column prop="Source" label="渠道"></el-table-column>
	                    <el-table-column prop="MoneyCredit" label="授信通过" :render-header="renderHeader5" min-width="140"></el-table-column>
	                    
	                    <el-table-column prop="CapitalLoanApply" label="借款申请金额" min-width="105"></el-table-column>
	                    <el-table-column prop="CapitalToAccount" label="借款通过金额" min-width="105"></el-table-column>
	                    <el-table-column prop="LoanSuccessRate" label="借款金额通过率" min-width="120"></el-table-column>
	                    
						<el-table-column prop="MoneyToAccount" label="到账金额"></el-table-column>
						<el-table-column prop="AllCapitalExpire" label="当天到期"></el-table-column>
						<el-table-column prop="AllCapitalExpireOverdue" label="当天逾期"></el-table-column>
	                    <el-table-column prop="ProOverdue" label="首逾率" :render-header="renderHeader6" min-width="125"></el-table-column>
					</el-table>
					<el-col :span="24" class="toolbar">
						<span style="font:14px/32px '微软雅黑';">
						合计：授信通过总金额 <label class="editwordSty">{{TotalMoneyCredit}}</label> &nbsp;&nbsp;&nbsp; 
							借款通过总金额 <label class="editwordSty">{{TotalCapitalToAccount}}</label>&nbsp;&nbsp;&nbsp; 
							到账总金额 <label class="editwordSty">{{TotalMoneyToAccount}}</label>&nbsp;&nbsp;&nbsp; 
							当天到期总金额 <label class="editwordSty">{{TotalAllCapitalExpire}}</label>
						</span>
				  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
				  	</el-col>
				</div>
			</template>
		</el-card>
	</div>
</template>

<script>
import http from "../../api/http.js";
import { saasdailyoperating, buttonctl } from 'api/api.js';
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
			is_display:false,  //是否展示逾期3天和7天数据
			ExportButton:false,
			page:1,
			total:0,
			pageSize:30,
			ispage:true,
			listLoading:false,
			tableData:[],
			TotalAllCapitalExpire:null,
			TotalCapitalToAccount:null,
			TotalMoneyCredit:null,
			TotalMoneyToAccount:null,
			TotalNumCertApply:null,
			TotalNumCredit:null,
			TotalNumCreditApply:null,
			TotalNumRegister:null,
			SourceArr:[],
			form:{ 
				Source:'', 
				DataType:2,
				IsDefault:false,
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
			let url= `${process.env.API_ROOT}/export/saasdailyoperatingexportexcel?start_time=${this.form.dateValue[0]} 00:00:00&end_time=${this.form.dateValue[1]} 23:59:59&merchant=${JSON.parse( sessionStorage.getItem('userDtl') ).Merchant}&account=${JSON.parse( sessionStorage.getItem('userDtl') ).Account}&source=${this.form.Source}&data_type=${this.form.DataType}&is_display=${this.is_display}`;
			window.location.href=url;
	   	},
        renderHeader1(h,{column,$index}){ //首逾率
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
                h('el-tooltip',{props:{placement:'top', content:'当天到期用户中首日逾期用户占比'}},
                    [ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		},
		renderHeader2(h,{column,$index}){ //3天逾期率
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
                h('el-tooltip',{props:{placement:'top', content:'当天到期用户中3天逾期用户占比'}},
                    [ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		},
		renderHeader3(h,{column,$index}){ //7天逾期率
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
                h('el-tooltip',{props:{placement:'top', content:'当天到期用户中7天逾期用户占比'}},
                    [ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		},
		renderHeader4(h,{column,$index}){ //授信通过率
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
                h('el-tooltip',{props:{placement:'top', content:'授信申请用户中通过用户占比'}},
                    [ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		},
		renderHeader5(h,{column,$index}){ //授信通过
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
                h('el-tooltip',{props:{placement:'top', content:'某一渠道当天授信通过的总金额'}},
                    [ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		},
		renderHeader6(h,{column,$index}){ //首逾率
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
                h('el-tooltip',{props:{placement:'top', content:'当天到期总金额中首日逾期总金额占比'}},
                    [ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		},
		renderHeader7(h,{column,$index}){ //3天逾期率
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
                h('el-tooltip',{props:{placement:'top', content:'当天到期总金额中3天逾期总金额占比'}},
                    [ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		},
		renderHeader8(h,{column,$index}){ //7天逾期率
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
                h('el-tooltip',{props:{placement:'top', content:'当天到期总金额中7天逾期总金额占比'}},
                    [ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		},
		search(){  //搜索
			this.ispage = false;
			this.$nextTick(() => {
				this.form.IsDefault=true;
				this.page = 1;
				this.getlist();
				this.ispage = true;
			});
		},
		getlist(){  //获取认证用户列表
			let params = {
				Page:this.page,
				PageSize:this.pageSize,
				DataType:this.form.DataType,
				Source:this.form.Source,
				IsDefault:this.form.IsDefault
			};
			if( !this.form.dateValue ){
				params.StartTime='';
				params.EndTime='';
			}else{
				params.StartTime=this.form.dateValue[0]+' 00:00:00';
				params.EndTime=this.form.dateValue[1]+' 23:59:59';
			}
			this.listLoading = true;
			saasdailyoperating(params).then((res) => {
				console.log(res);
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.Result.UserSum;
				this.SourceArr=res.Sources || [];
				this.TotalAllCapitalExpire=res.Result.TotalData.TotalAllCapitalExpire;
				this.TotalCapitalToAccount=res.Result.TotalData.TotalCapitalToAccount;
				this.TotalMoneyCredit=res.Result.TotalData.TotalMoneyCredit;
				this.TotalMoneyToAccount=res.Result.TotalData.TotalMoneyToAccount;
				this.TotalNumCertApply=res.Result.TotalData.TotalNumCertApply;
				this.TotalNumCredit=res.Result.TotalData.TotalNumCredit;
				this.TotalNumCreditApply=res.Result.TotalData.TotalNumCreditApply;
				this.TotalNumRegister=res.Result.TotalData.TotalNumRegister;
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