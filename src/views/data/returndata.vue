<template>
	<div ref="carouselContainer" :class="{'carousel-container':true}">
		<div :class="{'carousel-container-child':true,isTransform:isTransform}">
			<el-card class="box-card">
				<div slot="header" style="height:40px; font:16px/32px '微软雅黑'; position:relative;">
					<el-form :inline="true" :model="form" @submit.native.prevent style="position:absolute; left:20px;">
			  			<el-form-item label="日期">
			  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			  			</el-form-item>
			  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
			  		</el-form>
					<el-button type="primary" size="small" style="position:absolute; right:20px;" @click="isTransform=true">查看明细</el-button>
				</div>
				<div id="chartLine"></div>
			</el-card>
			<el-card class="box-card">
				<div slot="header" class="header">
					<el-form :inline="true" :model="form" @submit.native.prevent>
			  			<el-form-item label="日期">
			  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
			  			</el-form-item>
			  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
			  			<el-form-item style="float:right;"><el-button type="primary" size="small" @click="isTransform=false">查看图像</el-button></el-form-item>
			  			<el-form-item style="float:right;"><el-button type="primary" size="small" @click="showDialog=true">导出</el-button></el-form-item>
			  		</el-form>
				</div>
				<template>
					<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;">
						<el-table-column prop="CreateTime" label="日期"></el-table-column>
						<el-table-column prop="MoneyExpire" label="到期本息"></el-table-column>
						<el-table-column prop="MoneyNoreturnExpire" label="到期未还本息"></el-table-column>
						<el-table-column prop="MoneyReturnExpire" label="到期还款本息"></el-table-column>
						<el-table-column prop="MoneyTqretrunExpire" label="提前还款本息"></el-table-column>
						<el-table-column prop="MoneyDrreturnExpire" label="当日还款本息"></el-table-column>
						<el-table-column prop="RateReturn" label="还款率(K+M)/C"></el-table-column>
					</el-table>
				</template>
				<el-col :span="24" class="toolbar">
					<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
				</el-col>
			</el-card>
		</div>
		<!-- 导出时间选择弹框 -->
		<el-dialog title="导出EXCEl表" :visible.sync="showDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="600px">
			<el-form :model="outForm" label-width="120px">
				<el-form-item label="时间范围" prop="dateValue" :rules="[{required:true,message:'时间范围不得为空'}]">
					<el-date-picker v-model="outForm.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="dailyusersdataexportexcel">提交</el-button>
				<el-button @click.native="showDialog=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import http from "../../api/http.js";
import { dailyreturndata } from 'api/api.js';
import echarts from 'echarts';
import '@/assets/js/macarons.js'
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
			isTransform:false,
			page:1,
			total:0,
			pageSize:15,
			pageCount:1,
			ispage:true,
			listLoading:false,
			tableData:[],
			form:{ dateValue:[http.dateFormatter(new Date(new Date().getTime()-14*24*60*60*1000),false),http.dateFormatter(new Date(),false)] },
			isDisplay:false,
			dateData:[],
			MoneyExpireData:[],
			MoneyNoreturnExpireData:[],
			showDialog:false,
			outForm:{ dateValue:[http.dateFormatter(new Date(new Date().getTime()-14*24*60*60*1000),false),http.dateFormatter(new Date(),false)] }
		}
	},
	mounted(){
		this.getdailyreturndata();
	},
	methods: {
		search(){  //搜索
			this.ispage = false;
			this.$nextTick(() => {
				this.page = 1;
				this.getdailyreturndata();
				this.ispage = true;
			});
		},
		getdailyreturndata(){  //获取列表
			let params = {Page:this.page,PageSize:this.pageSize};
			if( !this.form.dateValue ){
				params.StartTime='';
				params.EndTime='';
			}else{
				params.StartTime=this.form.dateValue[0]+' 00:00:00';
				params.EndTime=this.form.dateValue[1]+' 23:59:59';
			}
			this.listLoading = true;
			dailyreturndata(params).then((res) => {
				this.total=res.Result.UserSum;
				if( res.Result.List == null ){
					this.tableData = [];
				}else{
					this.tableData = res.Result.List;
					this.pageCount = Math.ceil(this.total/this.pageSize);
					this.lookecharts();
				}
				this.listLoading = false;
			});
		},
		handleCurrentChange(current){  //分页页码跳转
			this.page = current;
			this.getdailyreturndata();
		},
		handleSizeChange(val){    //分页页码改变
	        this.pageSize=val;
	        this.getdailyreturndata();
	   	},
	   	dailyusersdataexportexcel(){
	   		if( !this.outForm.dateValue ){
				this.$message.error("导出的时间段不得为空！");
				return false;
			}
	   		let url=process.env.API_ROOT+"/export/dailyoverduedataexportexcel?start_time="+this.outForm.dateValue[0]+" 00:00:00&end_time="+this.outForm.dateValue[1]+" 23:59:59&merchant="+JSON.parse( sessionStorage.getItem('userDtl') ).Merchant+"&account="+JSON.parse( sessionStorage.getItem('userDtl') ).Account;
			window.location.href=url;
			this.showDialog=false;
	   	},
	   	lookecharts(){
	   		this.dateData=[];
			this.MoneyExpireData=[];
			this.MoneyNoreturnExpireData=[];
	   		this.tableData.forEach(item=>{
				this.dateData.push( item.CreateTime );
				this.MoneyExpireData.push( item.MoneyExpire );
				this.MoneyNoreturnExpireData.push( item.MoneyNoreturnExpire );
			});
			this.dateData=this.dateData.reverse();
			this.MoneyExpireData=this.MoneyExpireData.reverse();
			this.MoneyNoreturnExpireData=this.MoneyNoreturnExpireData.reverse();
			this.drawLineChart();
	   	},
	   	drawLineChart() {
			this.chartLine = echarts.init(document.getElementById("chartLine"),'macarons');
		    this.chartLine.setOption({
			    title:{text:'用户数据'},
			    tooltip:{
			        trigger:'axis',
			        axisPointer:{
			            type:'cross',
			            label:{
			                backgroundColor:'#6a7985'
			            }
			        }
			    },
			    legend:{
			        data:['到期本息','到期未还本息']
			    },
			    grid: {
			        left:'3%',
			        right:'4%',
			        bottom:'3%',
			        containLabel:true
			    },
			    xAxis:[{
		            type:'category',
		            boundaryGap:false,
		            data:this.dateData
		       }],
			    yAxis:[{
			        type:'value'
			    }],
			    series:[
			        {
			            name:'到期本息',
			            type:'line',
			            label: {
			                normal: {
			                    show:true,
			                    position:'top'
			                }
			            },
			            areaStyle: {normal: {}},
			            data:this.MoneyExpireData
			        },
			        {
			            name:'到期未还本息',
			            type:'line',
			            label: {
			                normal: {
			                    show:true,
			                    position:'top'
			                }
			            },
			            areaStyle: {normal: {}},
			            data:this.MoneyNoreturnExpireData
			        }
			    ]
			});
		}
		
	}
}	
</script>

<style scoped lang="scss">
	.isTransform{ transform:translateX(calc(-100% - 10px)); }
	.carousel-container::-webkit-scrollbar{ display:none; }
	.carousel-container{	
		width:100%;	
		overflow:hidden;
		visibility:visible;
		white-space:nowrap;
		.carousel-container-child{
			transition: 800ms ease-in-out;
		}
		.box-card{
			display: inline-block;
			width: 100%;
			vertical-align: top;
				visibility: visible;
		}
	}
	.header .el-form-item{ margin-bottom:0; }
	#chartLine{ width:100%; height:600px; }
</style>