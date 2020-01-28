<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header" style="position:relative;">
				<el-form :inline="true" :model="form" @submit.native.prevent>
					<el-form-item label="日期">
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:280px;"></el-date-picker>
		  			</el-form-item>
		  			<el-form-item label="数据类型">
						<el-select v-model="form.DataType" placeholder="请选择" @change="search" style="width:180px;">
						    <el-option label="按人数统计" :value="1"></el-option>
						    <el-option label="按金额统计" :value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核类型">
						<el-select v-model="form.IsLetter" placeholder="请选择" @change="search" style="width:180px;">
						    <el-option label="全部" :value="99"></el-option>
						    <el-option label="系统自动放款" :value="0"></el-option>
						    <el-option label="人工审核放款" :value="1"></el-option>
						</el-select>
					</el-form-item>
					
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
                    <el-form-item v-if="ExportButton">
						<el-button type="primary" size="small" @click="exportexcel">导出</el-button>
					</el-form-item>
					<el-form-item  style="margin-left:10px;">
						<el-checkbox v-model="is_display">区分新老用户</el-checkbox>
					</el-form-item>
		  		</el-form>
			</div>
			<div v-show="!is_display">
					<el-table v-show="form.DataType==1" :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
						<el-table-column prop="CreateTime" label="日期"></el-table-column>
						<el-table-column prop="AllNumExpire" label="当天到期"></el-table-column>
						<el-table-column prop="AllNumExpireOverdue" label="当天逾期"></el-table-column>
						<el-table-column prop="AllNumExpireOverdue3" label="逾期3天"></el-table-column>
						<el-table-column prop="AllNumExpireOverdue7" label="逾期7天"></el-table-column>
						<el-table-column prop="ProOverdueAll" label="首逾率"></el-table-column>
						<el-table-column prop="ProOverdue3All" label="3天逾期率"></el-table-column>
						<el-table-column prop="ProOverdue7All" label="7天逾期率"></el-table-column>	
					</el-table>
					<el-table v-show="form.DataType==2" :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
						<el-table-column prop="CreateTime" label="日期"></el-table-column>
						<el-table-column prop="AllCapitalExpire" label="当天到期"></el-table-column>
						<el-table-column prop="AllCapitalExpireOverdue" label="当天逾期"></el-table-column>
						<el-table-column prop="AllCapitalExpireOverdue3" label="逾期3天"></el-table-column>
						<el-table-column prop="AllCapitalExpireOverdue7" label="逾期7天"></el-table-column>
						<el-table-column prop="ProOverdueAll" label="首逾率"></el-table-column>
						<el-table-column prop="ProOverdue3All" label="3天逾期率"></el-table-column>
						<el-table-column prop="ProOverdue7All" label="7天逾期率"></el-table-column>
					</el-table>
			</div>

			<div v-show="is_display">
				<el-table v-show="form.DataType==1" :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
					<el-table-column prop="CreateTime" label="日期"></el-table-column>
					<el-table-column label="全部用户" align="center">
                        <el-table-column prop="AllNumExpire" label="当天到期"></el-table-column>
                        <el-table-column prop="AllNumExpireOverdue" label="当天逾期"></el-table-column>
                        <el-table-column prop="AllNumExpireOverdue3" label="逾期3天"></el-table-column>
                        <el-table-column prop="AllNumExpireOverdue7" label="逾期7天"></el-table-column>
                        <el-table-column prop="ProOverdueAll" label="首逾率"></el-table-column>
                        <el-table-column prop="ProOverdue3All" label="3天逾期率"></el-table-column>
                        <el-table-column prop="ProOverdue7All" label="7天逾期率"></el-table-column>
                    </el-table-column>
					<el-table-column label="首次借款用户" align="center">
                        <el-table-column prop="NumExpireFirst" label="当天到期"></el-table-column>
                        <el-table-column prop="NumExpireOverdueFirst" label="当天逾期"></el-table-column>
                        <el-table-column prop="NumExpireOverdue3First" label="逾期3天"></el-table-column>
                        <el-table-column prop="NumExpireOverdue7First" label="逾期7天"></el-table-column>
                        <el-table-column prop="ProOverdueFirst" label="首逾率"></el-table-column>
                        <el-table-column prop="ProOverdue3First" label="3天逾期率"></el-table-column>
                        <el-table-column prop="ProOverdue7First" label="7天逾期率"></el-table-column>
                    </el-table-column>
                    <el-table-column label="复借用户" align="center">
                        <el-table-column prop="NumExpireNoFirst" label="当天到期"></el-table-column>
                        <el-table-column prop="NumExpireOverdueNoFirst" label="当天逾期"></el-table-column>
                        <el-table-column prop="NumExpireOverdue3NoFirst" label="逾期3天"></el-table-column>
                        <el-table-column prop="NumExpireOverdue7NoFirst" label="逾期7天"></el-table-column>
                        <el-table-column prop="ProOverdueNoFirst" label="首逾率"></el-table-column>
                        <el-table-column prop="ProOverdue3NoFirst" label="3天逾期率"></el-table-column>
                        <el-table-column prop="ProOverdue7NoFirst" label="7天逾期率"></el-table-column>
                    </el-table-column>
				</el-table>
				<el-table v-show="form.DataType==2" :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
					<el-table-column prop="CreateTime" label="日期"></el-table-column>
					<el-table-column label="全部用户" align="center">
                        <el-table-column prop="AllCapitalExpire" label="当天到期"></el-table-column>
                        <el-table-column prop="AllCapitalExpireOverdue" label="当天逾期"></el-table-column>
                        <el-table-column prop="AllCapitalExpireOverdue3" label="逾期3天"></el-table-column>
                        <el-table-column prop="AllCapitalExpireOverdue7" label="逾期7天"></el-table-column>
                        <el-table-column prop="ProOverdueAll" label="首逾率"></el-table-column>
                        <el-table-column prop="ProOverdue3All" label="3天逾期率"></el-table-column>
                        <el-table-column prop="ProOverdue7All" label="7天逾期率"></el-table-column>
                    </el-table-column>
					<el-table-column label="首次借款用户" align="center">
                        <el-table-column prop="CapitalExpireFirst" label="当天到期"></el-table-column>
                        <el-table-column prop="CapitalExpireOverdueFirst" label="当天逾期"></el-table-column>
                        <el-table-column prop="CapitalExpireOverdue3First" label="逾期3天"></el-table-column>
                        <el-table-column prop="CapitalExpireOverdue7First" label="逾期7天"></el-table-column>
                        <el-table-column prop="ProOverdueFirst" label="首逾率"></el-table-column>
                        <el-table-column prop="ProOverdue3First" label="3天逾期率"></el-table-column>
                        <el-table-column prop="ProOverdue7First" label="7天逾期率"></el-table-column>
                    </el-table-column>
                    <el-table-column label="复借用户" align="center">
                        <el-table-column prop="CapitalExpireNoFirst" label="当天到期"></el-table-column>
                        <el-table-column prop="CapitalExpireOverdueNoFirst" label="当天逾期"></el-table-column>
                        <el-table-column prop="CapitalExpireOverdue3NoFirst" label="逾期3天"></el-table-column>
                        <el-table-column prop="CapitalExpireOverdue7NoFirst" label="逾期7天"></el-table-column>
                        <el-table-column prop="ProOverdueNoFirst" label="首逾率"></el-table-column>
                        <el-table-column prop="ProOverdue3NoFirst" label="3天逾期率"></el-table-column>
                        <el-table-column prop="ProOverdue7NoFirst" label="7天逾期率"></el-table-column>
                    </el-table-column>
				</el-table>
			</div>
			<el-col :span="24" class="toolbar">
		  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		  	</el-col>
		</el-card>
	</div>
</template>

<script>
import http from "../../api/http.js";
import { saasexpireoverdueratedaily, buttonctl } from 'api/api.js';
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
			is_display:false,  //是否区分新老用户
			ExportButton:false,
			page:1,
			total:0,
			pageSize:15,
			pageCount:1,
			ispage:true,
			listLoading:false,
			tableData:[],
			form:{ 
				DataType:2,
				IsLetter:99,
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
			let url= `${process.env.API_ROOT}/export/saasexpireoverdueratedailyexcel?start_time=${this.form.dateValue[0]} 00:00:00&end_time=${this.form.dateValue[1]} 23:59:59&merchant=${JSON.parse( sessionStorage.getItem('userDtl') ).Merchant}&account=${JSON.parse( sessionStorage.getItem('userDtl') ).Account}&data_type=${this.form.DataType}&is_letter=${this.form.IsLetter}&is_display=${this.is_display}`;
			window.location.href=url;
	   	},
        renderHeader1(h,{column,$index}){ //首逾率
					return h("div",{attrs:{style:"padding:0;"}},[
				        h("span",column.label),
                        h('el-tooltip',{props:{placement:'top', content:'当天到期用户中首日逾期用户占比',trigger:'hover'}},
                            [
								h('span','首逾率'),
					    	]
						)
				    ]);
				},
		renderHeader2(h,{column,$index}){ //3天逾期率
					return h("div",{attrs:{style:"padding:0;"}},[
				        h("span",column.label),
                        h('el-tooltip',{props:{placement:'top', content:'当天到期用户中3天逾期用户占比',trigger:'hover'}},
                            [
								h('span','3天逾期率'),
					    	]
						)
				    ]);
				},
		renderHeader3(h,{column,$index}){ //7天逾期率
					return h("div",{attrs:{style:"padding:0;white-space: normal;line-height: normal;"}},[
				        h("span",column.label),
                        h('el-tooltip',{props:{placement:'top', content:'当天到期用户中7天逾期用户占比',trigger:'hover'}},
                            [
								h('span','7天逾期率'),
					    	]
						)
				    ]);
				},
		renderHeader4(h,{column,$index}){ //授信通过率
					return h("div",{attrs:{style:"padding:0;white-space:normal;line-height: normal;"}},[
				        h("span",column.label),
                        h('el-tooltip',{props:{placement:'top', content:'授信申请用户中通过用户占比',trigger:'hover'}},
                            [
								h('span','授信通过率'),
					    	]
						)
				    ]);
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
				PageSize:this.pageSize,
				DataType:this.form.DataType,
				IsLetter:this.form.IsLetter
			};
			if( !this.form.dateValue ){
				params.StartTime='';
				params.EndTime='';
			}else{
				params.StartTime=this.form.dateValue[0]+' 00:00:00';
				params.EndTime=this.form.dateValue[1]+' 23:59:59';
			}
			this.listLoading = true;
			saasexpireoverdueratedaily(params).then((res) => {
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
					this.pageCount = Math.ceil(this.total/this.pageSize);
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