<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent size="mini">
					<el-form-item label="借款时间">
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:220px;"></el-date-picker>
		  			</el-form-item>
		  			<el-form-item label="手机号">
		  		   		<el-input v-model="form.UserAccount" placeholder="请输入" clearable style="width:125px;"></el-input>
		  			</el-form-item>
		  			<el-form-item label="姓名">
		  		   		<el-input v-model="form.UserName" placeholder="请输入" clearable style="width:90px;"></el-input>
		  			</el-form-item>
                    <el-form-item label="渠道">
		  		   		<el-select v-model="form.Source" clearable filterable placeholder="请选择" style="width:100px;">
					    	<el-option v-for="item in SourceArr" :key="item.Value" :label="item.Label" :value="item.Label"></el-option>
					  	</el-select>
		  			</el-form-item>
					<el-form-item label="状态">
						<el-select v-model="form.LetterCloseState" clearable placeholder="请选择" style="width:95px;">
						    <el-option label="单次拒绝" :value="'REFUSE0'"></el-option>
						    <el-option label="拒绝7天" :value="'REFUSE7'"></el-option>
						    <el-option label="关闭30天" :value="'REFUSE30'"></el-option>
						    <el-option label="永久拒绝" :value="'REFUSEALL'"></el-option>
						</el-select>
					</el-form-item>
                    <el-form-item label="处理时间">
		  		   		<el-date-picker v-model="form.dateValue1" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:220px;"></el-date-picker>
		  			</el-form-item>
					<el-form-item label="处理人">
		  		   		<el-input v-model="form.Operator" placeholder="请输入" clearable style="width:90px;"></el-input>
		  			</el-form-item>
		  			<el-form-item><el-button type="primary" size="mini" @click="search">搜索</el-button></el-form-item>
		  			<!--<el-form-item v-if="ExportButton">
						<el-button type="primary" size="mini" @click="exportexcel">导出</el-button>
					</el-form-item>-->
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
					<el-table-column prop="Account" label="手机号"></el-table-column>
					<el-table-column prop="Verifyrealname" label="姓名"></el-table-column>
					<el-table-column prop="Source" label="渠道"></el-table-column>
					<el-table-column label="借款金额">
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.Money}}元</span>
		  	    		</template>
					</el-table-column>
					<el-table-column prop="LoanDate" label="借款时间" min-width="126"></el-table-column>
					<el-table-column label="状态" min-width="150">
						<template slot-scope="scope">{{scope.row.LetterCloseState=='REFUSE0'?'单次拒绝':scope.row.LetterCloseState=='REFUSE7'?'拒绝7天':scope.row.LetterCloseState=='REFUSE30'?'关闭30天':scope.row.LetterCloseState=='REFUSEALL'?'永久拒绝':''}}</template>
					</el-table-column>
					<el-table-column prop="Operator" label="最近处理人"></el-table-column>
                    <el-table-column prop="OperateTime" label="最近处理时间" min-width="126"></el-table-column>
					<el-table-column label="操作" min-width="120">
						<template slot-scope="scope">
                        	<router-link tag="a" target="_blank" class="editwordSty" :to="{path:'/authuserdtl/'+scope.row.Uid}">查看</router-link>
                        	<span class="editwordSty" @click="viewdetails(scope.row.Id)">修改</span>
                        	<el-popover placement="bottom-end" trigger="hover" v-if="scope.row.Records!=null && scope.row.Records.length>0">
                                <div>
                                    <ul>
                                        <li style="line-height:25px; padding:0 20px;" v-for="(item,index) in scope.row.Records" :key="index">{{item.CreateTime}} &nbsp;&nbsp;{{item.Description}}</li>
                                    </ul>
                                </div>
                                <span class="editwordSty" slot="reference">处理历史</span>
                            </el-popover>
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
import { refuselist,buttonctl } from 'api/api.js';
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
			SourceArr:[],
			form:{ 
				UserAccount:'',
				UserName:'',
				LetterCloseState:'',  //REFUSE0-单次拒绝 REFUSE7-拒绝7天 REFUSE30-关闭30天 REFUSEALL-永久拒绝
				Operator:'',
				Source:'',
				dateValue:[http.dateFormatter(new Date(new Date().getTime()-14*24*60*60*1000),false),http.dateFormatter(new Date(),false)],
				dateValue1:[http.dateFormatter(new Date(new Date().getTime()-14*24*60*60*1000),false),http.dateFormatter(new Date(),false)]
			}
		}
	},
	mounted(){
		this.getlist();
//		buttonctl({}).then((res) => {  //催收按钮权限控制
//			console.log(res);
//			this.ExportButton=false;
//			if( res.Ret==200 && res.AllCtl.ExportButton ){
//				this.ExportButton=res.AllCtl.ExportButton;
//			}
//		});
	},
	methods: {
		exportexcel(){  //导出数据
	   		if( !this.form.dateValue ){
	   			this.$message.error("借款时间不得为空！");
				return false;
			}
	   		let url=process.env.API_ROOT+"/export/riskmgrdataexportexcel?start_time="+this.form.dateValue[0]+" 00:00:00&end_time="+this.form.dateValue[1]+" 23:59:59&merchant="+JSON.parse( sessionStorage.getItem('userDtl') ).Merchant+"&user_account="+this.form.UserAccount+"&user_name="+this.form.UserName+"&LetterCloseState="+this.form.LetterCloseState+"&channel_string="+this.form.Channel+"&order_number="+this.form.OrderNumber+"&source="+this.form.Source+"&oper="+this.form.Operator+"&account="+JSON.parse( sessionStorage.getItem('userDtl') ).Account;
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
				UserAccount:this.form.UserAccount,
				UserName:this.form.UserName,
				LetterCloseState:this.form.LetterCloseState,
				Operator:this.form.Operator,
				Source:this.form.Source
			};
			if( !this.form.dateValue ){
				params.LoanStartTime='';
				params.LoanEndTime='';
			}else{
				params.LoanStartTime=this.form.dateValue[0]+' 00:00:00';
				params.LoanEndTime=this.form.dateValue[1]+' 23:59:59';
			}
			if( !this.form.dateValue1 ){
				params.OperateStartTime='';
				params.OperateEndTime='';
			}else{
				params.OperateStartTime=this.form.dateValue1[0]+' 00:00:00';
				params.OperateEndTime=this.form.dateValue1[1]+' 23:59:59';
			}
			this.listLoading = true;
			refuselist(params).then((res) => {
				console.log(res);
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.Result.UserSum;
				this.SourceArr=res.Sources || [];
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
	   	viewdetails(id){  //审核
			sessionStorage.setItem("listsource","refuse");
	   		let {href} = this.$router.resolve({path:`/fkdtl/${id}`});
			window.open(href,'_blank');
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
</style>