<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header" style="position:relative;">
				<el-form :inline="true" :model="form" @submit.native.prevent>
					<el-form-item label="日期">
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:280px;"></el-date-picker>
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
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
					<el-table-column prop="CreateTime" label="日期" min-width="95"></el-table-column>
					<el-table-column prop="AllLoanApply" label="申请借款人数"></el-table-column>
					<el-table-column prop="AllLoanSuccess" label="成功借款人数"></el-table-column>
					<el-table-column prop="ProNumAll"  :render-header="renderHeader1"></el-table-column>
					<el-table-column prop="AllMoneyApply" label="申请借款金额"></el-table-column>
					<el-table-column prop="AllMoneySuccess" label="成功借款金额"></el-table-column>
					<el-table-column prop="ProMoneyAll"  :render-header="renderHeader2"></el-table-column>
				</el-table>
			</div>
			<div v-show="is_display">
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
					<el-table-column prop="CreateTime" label="日期" min-width="95"></el-table-column>
					<el-table-column label="全部用户" align="center">
                        <el-table-column prop="AllLoanApply" label="申请借款人数"></el-table-column>
                        <el-table-column prop="AllLoanSuccess" label="成功借款人数"></el-table-column>
                        <el-table-column prop="ProNumAll"  :render-header="renderHeader1"></el-table-column>
                        <el-table-column prop="AllMoneyApply" label="申请借款金额"></el-table-column>
                        <el-table-column prop="AllMoneySuccess" label="成功借款金额"></el-table-column>
                        <el-table-column prop="ProMoneyAll"  :render-header="renderHeader2"></el-table-column>
                    </el-table-column>
					<el-table-column label="新用户" align="center">
                        <el-table-column prop="FirstLoanApply" label="申请借款人数"></el-table-column>
                        <el-table-column prop="FirstLoanSuccess" label="成功借款人数"></el-table-column>
                        <el-table-column prop="ProNumFirst"  :render-header="renderHeader1"></el-table-column>
                        <el-table-column prop="FirstMoneyApply" label="申请借款金额"></el-table-column>
                        <el-table-column prop="FirstMoneySuccess" label="成功借款金额"></el-table-column>
                        <el-table-column prop="ProMoneyFirst"  :render-header="renderHeader2"></el-table-column>
                    </el-table-column>
                    <el-table-column label="老用户" align="center">
                        <el-table-column prop="NoFirstLoanApply" label="申请借款人数"></el-table-column>
                        <el-table-column prop="NoFirstLoanSuccess" label="成功借款人数"></el-table-column>
                        <el-table-column prop="ProNumNoFirst"  :render-header="renderHeader1"></el-table-column>
                        <el-table-column prop="NoFirstMoneyApply" label="申请借款金额"></el-table-column>
                        <el-table-column prop="NoFirstMoneySuccess" label="成功借款金额"></el-table-column>
                        <el-table-column prop="ProMoneyNoFirst"  :render-header="renderHeader2"></el-table-column>
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
import { findailyloandata, buttonctl } from 'api/api.js';
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
				IsLetter:99,
				dateValue:[http.dateFormatter(new Date(new Date().getTime()-14*24*60*60*1000),false),http.dateFormatter(new Date(),false)]
			}
		}
	},
	mounted(){
		this.gettraderecordlist();
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
			let url= `${process.env.API_ROOT}/export/dailyloandataexportexcel?start_time=${this.form.dateValue[0]} 00:00:00&end_time=${this.form.dateValue[1]} 23:59:59&merchant=${JSON.parse( sessionStorage.getItem('userDtl') ).Merchant}&account=${JSON.parse( sessionStorage.getItem('userDtl') ).Account}&is_letter=${this.form.IsLetter}&is_display=${this.is_display}`;
			window.location.href=url;
	   	},
        renderHeader1(h,{column,$index}){ //通过率(按人数)
					return h("div",{attrs:{style:"padding:0;white-space:normal;line-height: normal;"}},[
				        h("span",column.label),
                        h('el-tooltip',{props:{placement:'top', content:'申请借款用户中通过用户占比',trigger:'hover'}},
                            [
								h('span','通过率(按人数)'),
					    	]
						)
				    ]);
                },
        renderHeader2(h,{column,$index}){ //通过率(按金额)
					return h("div",{attrs:{style:"padding:0;white-space:normal;line-height: normal;"}},[
				        h("span",column.label),
                        h('el-tooltip',{props:{placement:'top', content:'申请借款用户中通过用户占比',trigger:'hover'}},
                            [
								h('span','通过率(按金额)'),
					    	]
						)
				    ]);
				},
		search(){  //搜索
			this.ispage = false;
			this.$nextTick(() => {
				this.page = 1;
				this.gettraderecordlist();
				this.ispage = true;
			});
		},
		gettraderecordlist(){  //获取认证用户列表
			let params = {
				IsLetter:this.form.IsLetter,
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
			findailyloandata(params).then((res) => {
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
			this.gettraderecordlist();
		},
		handleSizeChange(val){    //分页页码改变
	        this.pageSize=val;
	        this.gettraderecordlist();
	   	},
	   	viewdetails(id){  //查看详情
	   		this.$router.push({
	   			path:"/authuserdtl/"+id
	   		});
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