<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent size="mini">
		  			<el-form-item label="手机">
		  		   		<el-input v-model="form.UserAccount" placeholder="请输入" clearable style="width:120px;"></el-input>
		  			</el-form-item>
		  			<el-form-item label="姓名">
		  		   		<el-input v-model="form.UserName" placeholder="请输入" clearable style="width:120px;"></el-input>
		  			</el-form-item>
		  			<el-form-item label="授信日期">
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:230px;"></el-date-picker>
		  			</el-form-item>
		  			<el-form-item label="渠道">
						<el-select v-model="form.Source" clearable filterable placeholder="请选择" style="width:160px;">
					    	<el-option v-for="item in SourceArr" :key="item.Value" :label="item.Label" :value="item.Label"> </el-option>
					  	</el-select>
		  			</el-form-item>
		  			<el-form-item label="成功借款次数">
		  		   		<el-select v-model="form.LoanSuccessCount" clearable filterable placeholder="请选择" style="width:100px;">
					    	<el-option v-for="item in LoanSuccessCountsArr" :key="item.Value" :label="item.Label" :value="item.Label"> </el-option>
					  	</el-select>
		  			</el-form-item>
		  			<el-form-item label="状态">
						<el-select v-model="form.LoanState" clearable placeholder="请选择" style="width:120px;">
						    <el-option label="未申请" value="1"></el-option>
						    <el-option label="借款中" value="2"></el-option>
						    <el-option label="逾期" value="3"></el-option>
							<el-option label="借款失败" value="4"></el-option>
						</el-select>
					</el-form-item>
		  			<el-form-item><el-button type="primary" size="mini" @click="search">搜索</el-button></el-form-item>
					<el-form-item><el-button type="primary" size="mini" @click="windowopen('/reguserlist')">注册用户</el-button></el-form-item>
					<el-form-item><el-button type="primary" size="mini" @click="windowopen('/authuserlist')">认证用户</el-button></el-form-item>
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
					<el-table-column prop="Uid" label="ID" width="100"></el-table-column>
					<el-table-column prop="Verifyrealname" label="姓名" width="110"></el-table-column>
					<el-table-column prop="Account" label="手机" width="120"></el-table-column>
					<el-table-column prop="AssessTime" label="授信时间"></el-table-column>
					<el-table-column prop="Source" label="注册渠道"></el-table-column>
					<el-table-column label="授信">
						<template slot-scope="scope">{{scope.row.Balance-scope.row.UseBalance}}/{{scope.row.Balance}}</template>
					</el-table-column>
					<el-table-column prop="LoanSuccessCount" label="成功借款次数" width="120"></el-table-column>
					<el-table-column label="状态" width="210">
						<template slot-scope="scope">
							<span style="display:inline-block; width:80px; color:#333;">{{scope.row.State}}</span>
							<span style="color:#6F6B6B;">{{scope.row.Description}}</span>
		  	    		</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
	  	    		        <el-button type="primary" plain size="mini"  @click="viewdetails(scope.row.Uid)">查看</el-button>
		  	    		</template>
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
import { userscreditlist } from 'api/api.js';
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
			SourceArr:[],
			LoanSuccessCountsArr:[],
			form:{ 
				UserAccount:'',
				UserName:'',
				Source:'',
				LoanSuccessCount:'',
				LoanState:null,
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
				PageSize:this.pageSize,
				UserAccount:this.form.UserAccount,
				UserName:this.form.UserName,
				Source:this.form.Source,
				LoanSuccessCount:this.form.LoanSuccessCount
			};
			if( !this.form.dateValue ){
				params.StartTime='';
				params.EndTime='';
			}else{
				params.StartTime=this.form.dateValue[0]+' 00:00:00';
				params.EndTime=this.form.dateValue[1]+' 23:59:59';
			}
			if( this.form.LoanState==null || this.form.LoanState=='' ){
				params.LoanState=0;
			}else{
				params.LoanState=parseInt(this.form.LoanState);
			}
			this.listLoading = true;
			userscreditlist(params).then((res) => {
				console.log(res);
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.Result.UserSum;
				this.SourceArr=res.Sources || [];
				this.LoanSuccessCountsArr=res.LoanSuccessCounts || [];
				this.processData=res.Result.DefaultProcess;
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
	    },
	   	viewdetails(id){  //查看详情
	   		let {href} = this.$router.resolve({path:`/authuserdtl/${id}`});
			window.open(href,'_blank');
	   	},
		windowopen(url){
			let {href} = this.$router.resolve({path:`${url}`});
			window.open(href,'_blank');
		}
	}
}	
</script>

<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
</style>