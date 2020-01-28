<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent>
		  			<el-form-item label="日期">
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"    :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
		  			</el-form-item>
		  			<el-form-item label="类型">
						<el-select v-model.number="form.ChargeType" clearable placeholder="请选择">
							<el-option label="风控账户" :value="1"></el-option>
						    <el-option label="短信账户" :value="2"></el-option>
						    <el-option label="话费账户" :value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="状态">
						<el-select v-model.number="form.State" clearable placeholder="请选择">
						    <el-option label="成功" :value="1"></el-option>
						    <el-option label="失败" :value="2"></el-option>
						</el-select>
					</el-form-item>
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;">
					<el-table-column prop="ChargeTime" label="充值时间"></el-table-column>
					<el-table-column prop="ChargeMoney" label="充值金额"></el-table-column>
					<el-table-column label="类型" :render-header="renderHeader2">
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.ChargeType==1?"风控账户":scope.row.ChargeType==2?'短信账户':'话费账户'}}</span>
		  	    		</template>
					</el-table-column>
					<el-table-column label="订单状态">
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.State==1?"成功":scope.row.State==2?"失败":scope.row.State==3?"处理中":''}}</span> &nbsp;
							<!-- <span style="color:#010084;">{{scope.row.Remark}}</span> -->
		  	    		</template>
					</el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
				<span style="font:14px/32px '微软雅黑';">
					合计：笔数 <label class="editwordSty">{{total}}</label> &nbsp;&nbsp;&nbsp; 
					充值金额： <label class="editwordSty">{{PriceSum}}</label><span>元</span>
				</span>
		  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		  	</el-col>
		</el-card>
	</div>
</template>

<script>
import http from "../../api/http.js";
import { chargelist } from 'api/api.js';
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
			PriceSum:"",
			form:{ 
				ChargeType:null,
				State:null,
				dateValue:[http.dateFormatter(new Date(new Date().getTime()-14*24*60*60*1000),false),http.dateFormatter(new Date(),false)]
			}
		}
	},
	mounted(){
		this.getlist();
	},
	methods: {
		renderHeader2(h,{column,$index}){ //table表头自定义
				return h("div",{attrs:{style:"padding:0;"}},[
			        h("span",column.label),
			        h('el-tooltip',{props:{placement:'top'}},
						[
							h('p',{ slot:'content' ,attrs:{style:"display:block;padding:5px 0;width:420px;"}},'风控账户：用户提交授信时，进行风控计费，若账户余额不足，用户将无法进行授信'),
							h('p',{ slot:'content' ,attrs:{style:"display:block;padding:5px 0;width:420px;"}},'短信账户：用户获取验证码时，发送的短信计费，若账户余额不足，用户将无法收到验证码'),
							h('p',{ slot:'content' ,attrs:{style:"display:block;padding:5px 0;width:420px;"}},'话费账户：AI智能语音提醒系统给用户拨打电话后，按拨打成功次数进行收费，若账户余额不足，将无法给用户拨打电话'),
				    		h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'')
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
				State:parseInt(this.form.State),
				ChargeType:parseInt(this.form.ChargeType)
			};
			if( !this.form.dateValue ){
				params.StartTime='';
				params.EndTime='';
			}else{
				params.StartTime=this.form.dateValue[0]+' 00:00:00';
				params.EndTime=this.form.dateValue[1]+' 23:59:59';
			}
			this.listLoading = true;
			chargelist(params).then((res) => {
				console.log(res);
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.Result.UserSum;
				this.PriceSum=res.Result.PriceSum;
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
</style>