<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header" style="position:relative;">
				<el-form :inline="true" :model="form" @submit.native.prevent>
					<el-form-item label="日期">
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:280px;"></el-date-picker>
		  			</el-form-item>
					<el-form-item label="数据类型">
						<el-select v-model="form.DataType" @change="search" placeholder="请选择" style="width:180px;">
						    <el-option label="按次数统计" :value="1"></el-option>
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
				<el-table v-if="form.DataType==1" :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border show-summary>
					<el-table-column prop="CreateTime" label="日期" min-width="90"></el-table-column>
					<el-table-column prop="Num1Hit" label="OCR调用"></el-table-column>
					<el-table-column prop="Num2Hit" label="实名调用"></el-table-column>
					<el-table-column prop="FkNumHit" label="风控调用"></el-table-column>
					<el-table-column prop="NumSmsHit" label="短信调用"></el-table-column>
					<el-table-column prop="CurrTotalNumHit" label="数据调用合计" :render-header="renderHeader1"></el-table-column>
				</el-table>
				<el-table v-if="form.DataType==2" :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border show-summary>
					<el-table-column prop="CreateTime" label="日期" min-width="90"></el-table-column>
					<el-table-column prop="Price1Hit" label="OCR调用"></el-table-column>
					<el-table-column prop="Price2Hit" label="实名调用"></el-table-column>
					<el-table-column prop="FkPriceHit" label="风控调用"></el-table-column>
					<el-table-column prop="PriceSmsHit" label="短信调用"></el-table-column>
					<el-table-column prop="CurrTotalPriceHit" label="数据调用合计" :render-header="renderHeader1"></el-table-column>
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
import { saasdailybill, buttonctl } from 'api/api.js';
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
			let url= `${process.env.API_ROOT}/export/saasdailybillexcel?start_time=${this.form.dateValue[0]} 00:00:00&end_time=${this.form.dateValue[1]} 23:59:59&merchant=${JSON.parse( sessionStorage.getItem('userDtl') ).Merchant}&account=${JSON.parse( sessionStorage.getItem('userDtl') ).Account}&data_type=${this.form.DataType}`;
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
			saasdailybill(params).then((res) => {
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
					// this.tableData = res.Result.List;
					this.tableData = [];
					res.Result.List.forEach(item=>{
						if( this.form.DataType==1 ){
							// item.datatotal=parseInt((item.Num1Hit+item.Num2Hit+item.FkNumHit+item.NumSmsHit)*100)/100;
							item.NumSmsHit=item.NumSmsHit.toFixed(2);
							item.CurrTotalNumHit=item.CurrTotalNumHit.toFixed(2);
						}else if( this.form.DataType==2 ){
							// item.datatotal=parseInt((item.Price1Hit+item.Price2Hit+item.FkPriceHit+item.PriceSmsHit)*100)/100;
							item.PriceSmsHit=item.PriceSmsHit.toFixed(2);
							item.CurrTotalPriceHit=item.CurrTotalPriceHit.toFixed(2);
						}
						this.tableData.push(item);
					});
					console.log(this.tableData);
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
	    },
		renderHeader1(h,{column,$index}){  //数据调用合计
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
		        h('el-tooltip',{props:{placement:'top',content:'ocr调用+实名调用+风控调用+短信调用'}},
					[ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
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