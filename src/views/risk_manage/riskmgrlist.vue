<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent size="mini">
		  			<el-form-item label="手机">
		  		   		<el-input v-model="form.UserAccount" placeholder="请输入" clearable style="width:160px;"></el-input>
		  			</el-form-item>
		  			<el-form-item label="姓名">
		  		   		<el-input v-model="form.UserName" placeholder="请输入" clearable style="width:120px;"></el-input>
		  			</el-form-item>
		  			<el-form-item label="渠道">
		  		   		<el-select v-model="form.Source" clearable filterable placeholder="请选择" style="width:180px;">
					    	<el-option v-for="item in SourceArr" :key="item.Value" :label="item.Label" :value="item.Label"> </el-option>
					  	</el-select>
		  			</el-form-item>
		  			<el-form-item label="建议结果">
						<el-select v-model="form.FkAdviceResult" placeholder="请选择" clearable style="width:120px;">
                            <!-- <el-option label="系统处理中" value="null"></el-option> -->
                            <el-option label="通过" value="PASS"></el-option>
                            <el-option label="关闭7天" value="REFUSE7"></el-option>
                            <el-option label="关闭30天" value="REFUSE30"></el-option>
                            <el-option label="永久关闭" value="REFUSEALL"></el-option>
							<el-option label="人工审核" value="SOURCEMANUAL"></el-option>
						</el-select>
					</el-form-item>
		  			<el-form-item><el-button type="primary" size="mini" @click="search">搜索</el-button></el-form-item>
					<el-form-item class="online">
						<el-dropdown placement="bottom">
							<span class="el-dropdown-link">
								<i :class="[LoginState=='ONLINE'?'fa-commenting':LoginState=='OFFLINE'?'fa-coffee':LoginState=='SUSPEND'?'fa-window-close':'','fa','fa-fw']" :style="{marginRight:'2px',fontSize:'18px',color:LoginState=='ONLINE'?'#8BC34A':LoginState=='OFFLINE'?'#FFD700':LoginState=='SUSPEND'?'#ccc':'#ccc'}"></i>
								<label>{{LoginState=='ONLINE'?'在线':LoginState=='OFFLINE'?'小休':LoginState=='SUSPEND'?'挂起':''}}</label>
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item @click.native="setstate('ONLINE')">
									<i class="fa fa-commenting fa-fw" style="color:#8BC34A;"></i>
									<span>在线</span>
								</el-dropdown-item>
								<el-dropdown-item @click.native="setstate('OFFLINE')">
									<i class="fa fa-coffee fa-fw" style="color:#FFD700;"></i>
									<span>小休</span>
								</el-dropdown-item>
								<el-dropdown-item @click.native="setstate('SUSPEND')">
									<i class="fa fa-window-close fa-fw" style="color:#ccc;"></i>
									<span>挂起</span>
								</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</el-form-item>
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
					<el-table-column prop="Phone" label="手机" min-width="95"></el-table-column>
					<el-table-column label="姓名" min-width="130">
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.Name}}</span>
	  	    		        <span v-if="scope.row.LoanFinishCount" style="float:right; width:55px; text-align:center; font-size:12px; color:#fff; background:#8BC34A; border-radius:4px; margin-left:4px;">借款{{scope.row.LoanFinishCount}}次</span>
	  	    		        <span v-if="scope.row.RenewCount" style="float:right; width:55px; text-align:center; font-size:12px; color:#fff; background:#FF9800; border-radius:4px;">续期{{scope.row.RenewCount}}次</span>
		  	    		</template>
					</el-table-column>
					<el-table-column prop="Source" label="注册渠道"></el-table-column>
					<el-table-column prop="ApplyDate" label="授信申请时间" min-width="135"></el-table-column>
					<el-table-column label="建议结果" min-width="155">
						<template slot-scope="scope">
							<span v-if="scope.row.FkAdviceResult=='PASS'">通过（{{scope.row.FkAdviceBalance}}元）</span>
							<span v-else>{{scope.row.FkAdviceResult=="REFUSE0"?"单次关闭":scope.row.FkAdviceResult==""?"系统处理中":scope.row.FkAdviceResult=="REFUSE7"?"关闭7天":scope.row.FkAdviceResult=="REFUSE30"?"关闭30天":scope.row.FkAdviceResult=="REFUSEALL"?"永久关闭":scope.row.FkAdviceResult=="SOURCEMANUAL"?"人工审核":""}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="CreditAllotName" label="审核人员" min-width="135"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
	  	    		        <el-button type="primary" plain size="mini" @click="viewdetails(scope.row.Uid)">审核</el-button>
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
import { auditlist,getuserloginstate,updateuserloginstate } from 'api/api.js';
export default {
	data(){
		return {
			LoginState:'',
			page:1,
			total:0,
			pageSize:100,
			ispage:true,
			listLoading:false,
			tableData:[],
			SourceArr:[],
			form:{ 
				UserAccount:'',
				UserName:'',
				Source:'',
				FkAdviceResult:""  //建议结果
			}
		}
	},
	mounted(){
		this.getlist();
		this.getstate();
	},
	methods: {
		getstate(){  //获取用户状态
			getuserloginstate({}).then(res => {
				if(res.Ret == 200) {
					this.LoginState=res.LoginState;
				}
			});
		},
		setstate(state){  //设置用户状态
			updateuserloginstate({LoginState:state}).then(res => {
				if(res.Ret == 200) {
					this.getstate();
				}
			});
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
				Source:this.form.Source,
				FkAdviceResult:this.form.FkAdviceResult
			};
			this.listLoading = true;
			auditlist(params).then((res) => {
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.Result.Sum;
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
	   		this.$router.push({
	   			path:"/riskmgrdtl/"+id
	   		});
	   	}
		
	}
}	
</script>

<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
	.status-img{ width:20px; vertical-align:middle; }
	.online{ float:right; padding:2px 10px 2px 5px; color:#000; cursor:pointer; border:1px solid #eaeaea; border-radius:4px; }
</style>