<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header" style="position:relative;">
				<el-form :inline="true" :model="form" @submit.native.prevent>
					<el-form-item label="日期">
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:280px;"></el-date-picker>
		  			</el-form-item>
					<el-form-item >
                        <div slot="label">
                            <span>数据类型</span> 
                            <el-tooltip class="item-tooltip" effect="dark" placement="top">
                                <div slot="content">数据类型为金额时，下方表格中显示的金额为对应项下的本金加总</div>
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </div>
						<el-select v-model="form.DataType" placeholder="请选择" @change="search" style="width:180px;">
						    <el-option label="按人数统计" :value="1"></el-option>
						    <el-option label="按金额统计" :value="2"></el-option>
						</el-select>
					</el-form-item>
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
		  			<el-form-item v-if="ExportButton">
						<el-button type="primary" size="small" @click="exportexcel">导出</el-button>
					</el-form-item>
		  		</el-form>
			</div>
			<template>
				<el-table v-if="form.DataType==1" :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." show-summary border style="width:100%;">
					<el-table-column prop="CreateTime" label="日期" min-width="90"></el-table-column>
					<el-table-column prop="NumExpire" label="当天到期"></el-table-column>
					<el-table-column prop="NumDrReturn" :render-header="renderHeader1"></el-table-column>
					<el-table-column prop="NumPrepayReturn" :render-header="renderHeader2"></el-table-column>
					<el-table-column prop="NumExpireRuturn" :render-header="renderHeader3"></el-table-column>
					<el-table-column prop="NumOverdueRuturn" :render-header="renderHeader4"></el-table-column>
					<el-table-column prop="NumRenewRuturn" :render-header="renderHeader5"></el-table-column>
				</el-table>
				<el-table v-if="form.DataType==2" :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." show-summary border style="width:100%;">
					<el-table-column prop="CreateTime" label="日期" min-width="90"></el-table-column>
					<el-table-column prop="CapitalExpire" label="当天到期"></el-table-column>
					<el-table-column prop="CapitalDrReturn" :render-header="renderHeader1"></el-table-column>
					<el-table-column prop="CapitalPrepayReturn" :render-header="renderHeader2"></el-table-column>
					<el-table-column prop="CapitalExpireRuturn" :render-header="renderHeader3"></el-table-column>
					<el-table-column prop="CapitalOverdueRuturn" :render-header="renderHeader4"></el-table-column>
					<el-table-column prop="CapitalRenewRuturn" :render-header="renderHeader5"></el-table-column>
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
import { saasdailyrepayment, buttonctl } from 'api/api.js';
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
				DataType:2,
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
			let url= `${process.env.API_ROOT}/export/saasdailyrepaymentexportexcel?start_time=${this.form.dateValue[0]} 00:00:00&end_time=${this.form.dateValue[1]} 23:59:59&merchant=${JSON.parse( sessionStorage.getItem('userDtl') ).Merchant}&account=${JSON.parse( sessionStorage.getItem('userDtl') ).Account}&data_type=${this.form.DataType}`;
			window.location.href=url;
	   	},
		renderHeader1(h, { column, $index }) {
	      	return h("div", { attrs: { style: "padding:0;" } }, [
		        h("span", { attrs: { style: "padding-right:4px;" } }, "当天还款"),
		        h("el-tooltip",{props: {placement: "top",content: "当天全平台所有还款合计",trigger: "hover"}},[h("span", [h("i", { attrs: { class: "el-icon-info" } })], "当天还款")])
	      	]);
	    },
	    renderHeader2(h, { column, $index }) {
	      	return h("div", { attrs: { style: "padding:0;" } }, [
		        h("span", { attrs: { style: "padding-right:4px;" } }, "提前还款"),
		        h("el-tooltip",{props: {placement: "top",content: "当天还款中属于提前还款（还款时间早于到期日）",trigger: "hover"}},[h("span", [h("i", { attrs: { class: "el-icon-info" } })], "提前还款")])
	      	]);
	    },
	    renderHeader3(h, { column, $index }) {
	      	return h("div", { attrs: { style: "padding:0;" } }, [
		        h("span", { attrs: { style: "padding-right:4px;" } }, "到期还款"),
		        h("el-tooltip",{props: {placement: "top",content: "当天还款中属于在到期日当天还款",trigger: "hover"}},[h("span", [h("i", { attrs: { class: "el-icon-info" } })], "到期还款")])
	      	]);
	    },
	    renderHeader4(h, { column, $index }) {
	      	return h("div", { attrs: { style: "padding:0;" } }, [
		        h("span", { attrs: { style: "padding-right:4px;" } }, "逾期还款"),
		        h("el-tooltip",{props: {placement: "top",content: "当天还款中属于逾期还款",trigger: "hover"}},[h("span", [h("i", { attrs: { class: "el-icon-info" } })], "逾期还款")])
	      	]);
	    },
	    renderHeader5(h, { column, $index }) {
	      	return h("div", { attrs: { style: "padding:0;" } }, [
		        h("span", { attrs: { style: "padding-right:4px;" } }, "续期还款"),
		        h("el-tooltip",{props: {placement: "top",content: "截止所选日期，对应当天（还款日期）通过续期方式结清的用户（或：金额）",trigger: "hover"}},[h("span", [h("i", { attrs: { class: "el-icon-info" } })], "续期还款")])
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
				DataType:this.form.DataType
			};
			if( !this.form.dateValue ){
				params.StartTime='';
				params.EndTime='';
			}else{
				params.StartTime=this.form.dateValue[0]+' 00:00:00';
				params.EndTime=this.form.dateValue[1]+' 23:59:59';
			}
			this.listLoading = true;
			saasdailyrepayment(params).then((res) => {
				console.log(res);
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.Result.UserSum;
				this.TotalLoanMoney=res.Result.TotalLoanMoney;
				this.TotalRealMoney=res.Result.TotalRealMoney;
				this.tableData = res.Result.List || [];
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