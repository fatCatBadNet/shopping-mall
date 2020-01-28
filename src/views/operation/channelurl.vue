<template>
	<div id="channelurl">
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent>
		  			<el-form-item label="公司">
						<el-select v-model.number="form.DesId" disabled placeholder="请选择" style="width:170px;">
						    <el-option :label="companylist.Name" :value="companylist.DesId"></el-option>
						</el-select>
					</el-form-item>
		  			<el-form-item label="渠道名">
		  		   		<el-input v-model="form.SourceName" placeholder="请输入" disabled style="width:170px;"></el-input>
		  			</el-form-item>
		  			<el-form-item label="日期">
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:280px;"></el-date-picker>
		  			</el-form-item>
		  			<el-form-item label="结算方式">
						<el-select v-model="form.BalanceType" clearable placeholder="请选择" style="width:170px;">
						    <el-option label="单条结算" value="单条结算"></el-option>
						    <el-option label="综合结算" value="综合结算"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="计价方式">
						<el-select v-model="form.BalanceWay" clearable placeholder="请选择" style="width:170px;">
						    <el-option label="CPA" value="CPA"></el-option>
						    <el-option label="CPA阶梯" value="CPA阶梯"></el-option>
						    <el-option label="CPS" value="CPS"></el-option>
						    <el-option label="CPS阶梯" value="CPS阶梯"></el-option>
						</el-select>
					</el-form-item>
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;">
					<el-table-column prop="CreateTime" label="日期"></el-table-column>
					<el-table-column prop="Company" label="公司"></el-table-column>
					<el-table-column prop="SourceName" label="渠道名"></el-table-column>
					<el-table-column prop="NumRegister" label="注册人数"></el-table-column>
					<el-table-column prop="NumCert" label="认证人数"></el-table-column>
					<el-table-column prop="FirstNumLoanApply" label="首次申请人数" v-if="BalanceWay=='CPS'||BalanceWay=='CPS阶梯'"></el-table-column>
					<el-table-column prop="FirstNumPass" label="首次通过人数" v-if="BalanceWay=='CPS'||BalanceWay=='CPS阶梯'"></el-table-column>
					<el-table-column prop="FirstMoneyPass" label="首次通过金额" v-if="BalanceWay=='CPS'||BalanceWay=='CPS阶梯'"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
	  	    		        <span class="editwordSty" @click="goLook(scope.row)">查看注册</span>
		  	    		</template>
					</el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
				<span style="font:14px/32px '微软雅黑';">
					合计：注册人数 <label class="editwordSty">{{TotalNumRegister}}</label> &nbsp;&nbsp;&nbsp; 
					认证人数 <label class="editwordSty">{{TotalNumCert}}</label> &nbsp;&nbsp;&nbsp; 
					总费用 <label class="editwordSty">{{TotalCost}}</label> &nbsp;&nbsp;&nbsp; 
					<b>{{BalanceWay}} | {{BalanceType}}</b>
				</span>
		  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		  	</el-col>
		</el-card>
	</div>
</template>

<script>
import http from "../../api/http.js";
import { jiachannellist,companyinfo,dessourcename } from 'api/api.js';
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
			merchant:this.$route.params.merchant,
			DesId:this.$route.params.id,
			channelname:this.$route.params.name,
			gourl:window.location.href.split('#')[0],
			companylist:{},
			page:1,
			total:0,
			pageSize:15,
			ispage:true,
			listLoading:false,
			tableData:[],
			TotalNumRegister:null,
			TotalNumCert:null,
			TotalCost:null,
			BalanceWay:'',
			BalanceType:'',
			form:{ 
				DesId:this.$route.params.id,
				SourceName:'test',
				BalanceType:'',
				BalanceWay:'',
				dateValue:[http.dateFormatter(new Date(new Date().getTime()-14*24*60*60*1000),false),http.dateFormatter(new Date(),false)]
			}
		}
	},
	mounted(){
		companyinfo({DesId:this.DesId,merchant:this.merchant}).then((res) => {
			if( res.Ret!=200 ){
				return false;
			}
			this.companylist=res.Company || {};
		});
		dessourcename({DesSourceName:this.channelname,merchant:this.merchant}).then((res) => {
			if( res.Ret==200 ){
				this.form.SourceName=res.SourceName;
				this.getlist();
			}
		});
//		console.log( window.location.href.split('#')[0] );
	},
	methods: {
		goLook(item){  //查看注册
			window.location.href=this.gourl+"#/lookreg/"+item.SourceName+"/"+this.merchant+"/"+item.Sid+"/"+item.CreateTime;
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
			if( this.form.DesId=='' ){
				this.form.DesId=null;
			}
			let params = {
				merchant:this.merchant,
				Page:this.page,
				PageSize:this.pageSize,
				DesId:this.form.DesId,
				SourceName:this.form.SourceName,
				BalanceType:this.form.BalanceType,
				BalanceWay:this.form.BalanceWay
			};
			if( !this.form.dateValue ){
				params.StartTime='';
				params.EndTime='';
			}else{
				params.StartTime=this.form.dateValue[0]+' 00:00:00';
				params.EndTime=this.form.dateValue[1]+' 23:59:59';
			}
			this.listLoading = true;
			jiachannellist(params).then((res) => {
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.Result.UserSum;
				this.TotalNumRegister=res.Result.TotalNumRegister;
				this.TotalNumCert=res.Result.TotalNumCert;
				this.TotalCost=res.Result.TotalCost;
				this.BalanceWay=res.Result.BalanceWay;
				this.BalanceType=res.Result.BalanceType;
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

<style lang="scss">
	#channelurl{ min-width:1200px; padding:20px; box-sizing:border-box; overflow:scroll;
		.header .el-form-item{ margin-bottom:10px; }
		.el-card__header{ padding-bottom:0px; }
	}
</style>