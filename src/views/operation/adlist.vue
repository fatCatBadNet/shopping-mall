<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent>
					<el-form-item label="">
						<el-select v-model="form.DateType" clearable placeholder="请选择" style="width:150px;">
						    <el-option label="消失时间" value="消失时间"></el-option>
						    <el-option label="显示时间" value="显示时间"></el-option>
						</el-select>
					</el-form-item>
		  			<el-form-item label="">
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:260px;"></el-date-picker>
		  			</el-form-item>
		  			<el-form-item label="广告名称">
		  		   		<el-input v-model="form.ActivityName" placeholder="请输入" clearable style="width:150px;"></el-input>
		  			</el-form-item>
		  			<el-form-item label="序号ID">
		  		   		<el-input v-model="form.SortIndex" placeholder="请输入" clearable style="width:150px;"></el-input>
		  			</el-form-item>
		  			<el-form-item label="状态">
						<el-select v-model="form.State" clearable placeholder="请选择" style="width:150px;">
						    <el-option label="未开始" value="未开始"></el-option>
						    <el-option label="进行中" value="进行中"></el-option>
						    <el-option label="已结束" value="已结束"></el-option>
						</el-select>
					</el-form-item>
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
		  			<el-form-item style="float:right;"><el-button type="primary" size="small" @click="addeditact(0)">+ 添加广告</el-button></el-form-item>
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
					<el-table-column prop="Id" label="序号ID"></el-table-column>
					<el-table-column label="广告图" min-width="150">
						<template slot-scope="scope">
	  	    		       <img :src="scope.row.Image" style="width:200px;" />
		  	    		</template>
					</el-table-column>
					<el-table-column prop="ActivityName" label="广告名称"></el-table-column>
					<el-table-column prop="SortIndex" label="排序"></el-table-column>
					<el-table-column prop="ShowTime" label="显示时间" min-width="150"></el-table-column>
					<el-table-column prop="PastTime" label="消失时间" min-width="150"></el-table-column>
					<el-table-column label="状态">
						<template slot-scope="scope">
	  	    		    	<span :style="{color:scope.row.State=='进行中'?'green':scope.row.State=='已结束'?'#409EFF':'yellow'}">{{scope.row.State}}</span>
		  	    		</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
	  	    		        <el-button type="primary" plain size="mini" @click="addeditact(scope.row.Id)">编辑</el-button>
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
import { activitylist } from 'api/api.js';
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
			pageCount:1,
			ispage:true,
			listLoading:false,
			tableData:[],
			form:{
				ActivityName:"",
  				DateType:"",
			  	SortIndex:"",
			  	State:"",
				dateValue:[http.dateFormatter(new Date(new Date().getTime()-14*24*60*60*1000),false),http.dateFormatter(new Date(),false)]
			}
		}
	},
	mounted(){
		this.getauthuserlist();
	},
	methods: {
		search(){  //搜索
			this.ispage = false;
			this.$nextTick(() => {
				this.page = 1;
				this.getauthuserlist();
				this.ispage = true;
			});
		},
		getauthuserlist(){  //获取认证用户列表
			let params = {
				Page:this.page,
				PageSize:this.pageSize,
				ActivityName:this.form.ActivityName,
				DateType:this.form.DateType,
				SortIndex:this.form.SortIndex,
				State:this.form.State,
			};
			if( !this.form.dateValue ){
				params.StartDate='';
				params.EndDate='';
			}else{
				params.StartDate=this.form.dateValue[0]+' 00:00:00';
				params.EndDate=this.form.dateValue[1]+' 23:59:59';
			}
			this.listLoading = true;
			activitylist(params).then((res) => {
				console.log(res);
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.Result.Sum;
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
			this.getauthuserlist();
		},
		handleSizeChange(val){    //分页页码改变
	        this.pageSize=val;
	        this.getauthuserlist();
	   	},
	   	addeditact(id){  //查看详情
	   		this.$router.push({
	   			path:"/addacty/"+id
	   		});
	   	}
		
	}
}	
</script>

<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
</style>