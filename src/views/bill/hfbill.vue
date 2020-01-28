<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent>
		  			<el-form-item label="呼叫时间">
		  		   		<el-date-picker style="width:250px;" v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
		  			</el-form-item>
		  			<el-form-item label="订单号">
		  		   		<el-input v-model="form.SerialNumber" placeholder="请输入" clearable style="width:200px;"></el-input>
		  			</el-form-item>
                      <el-form-item label="通话ID">
		  		   		<el-input v-model="form.Id" placeholder="请输入" clearable style="width:200px;"></el-input>
		  			</el-form-item>
					<el-form-item label="用户类型">
					  	<el-select v-model="form.Description" placeholder="请选择" style="width:200px;" clearable>
							<el-option label="催收" value="COLLECT"></el-option>
							<el-option label="仅注册用户" value="ONLYREY"></el-option>
							<el-option label="未全部认证的用户" value="NOALLAUTH"></el-option>
							<el-option label="全部认证未借款" value="ALLAUTHNOLOAN"></el-option>
							<el-option label="白名单未借款" value="WRIRTENOLOAN"></el-option>
				    	</el-select>
					</el-form-item>
                      <el-form-item label="手机号" >
		  		   		<el-input v-model="form.Phone" placeholder="请输入" clearable style="width:200px;"></el-input>
		  			</el-form-item>
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
		  			<!--<el-form-item style="float:right;"><el-button type="primary" size="small">添加</el-button></el-form-item>-->
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;">
					<el-table-column prop="Id" label="通话ID" width="120"></el-table-column>
					<el-table-column prop="CallTime" label="呼叫时间"></el-table-column>
					<el-table-column prop="SerialNumber" label="订单号" min-width="120"></el-table-column>
					<el-table-column prop="CallDuration" label="通话时长">
						<template slot-scope="scope">
							{{(scope.row.CallDuration/60).toFixed(2)}}分钟
						</template>
					</el-table-column>
					<el-table-column prop="Phone" label="用户手机号"></el-table-column>
					<el-table-column prop="Price" label="价格（元）"></el-table-column>
					<el-table-column prop="State" label="订单状态">
						<template slot-scope="scope">
							{{scope.row.State=='SUCCESS'?'成功':''}}
						</template>
					</el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
				<span style="font:14px/32px '微软雅黑';">
					合计：条数 <label class="editwordSty">{{total}}</label> &nbsp;&nbsp;&nbsp; 
					费用： <label class="editwordSty">{{PriceSum}}</label>
				</span>
		  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		  	</el-col>
		</el-card>
	</div>
</template>

<script>
import http from "api/http.js";
import { collectioncallorder } from 'api/api.js';
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
			PriceSum:"",
			form:{ 
				Description:'',
				SerialNumber:'',
				Id:'',
				Phone:'',
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
				SerialNumber:this.form.SerialNumber,
				Id:this.form.Id?parseInt(this.form.Id):null,
				Phone:this.form.Phone,
				Description:this.form.Description,
			};
			if( !this.form.dateValue ){
				params.CallStartTime='';
				params.CallEndTime='';
			}else{
				params.CallStartTime=this.form.dateValue[0]+' 00:00:00';
				params.CallEndTime=this.form.dateValue[1]+' 23:59:59';
			}
			this.listLoading = true;
			collectioncallorder(params).then((res) => {
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.UserSum;
				this.PriceSum=res.Prices;
				if(res.List == null){
					this.tableData = [];
				}else{
					this.tableData = res.List;
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
</style>