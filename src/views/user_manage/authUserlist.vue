<template>
	<div style="padding:20px; box-sizing:border-box; min-width:1200px;">
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent>
		  			<el-form-item label="手机">
		  		   		<el-input v-model="form.UserAccount" placeholder="请输入" clearable style="width:140px;"></el-input>
		  			</el-form-item>
		  			<el-form-item label="姓名">
		  		   		<el-input v-model="form.UserName" placeholder="请输入" clearable style="width:140px;"></el-input>
		  			</el-form-item>
		  			<el-form-item label="认证日期">
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:240px;"></el-date-picker>
		  			</el-form-item>
		  			<el-form-item label="渠道">
						<el-select v-model="form.Source" clearable filterable placeholder="请选择">
					    	<el-option v-for="item in SourceArr" :key="item.Value" :label="item.Label" :value="item.Label"> </el-option>
					  	</el-select>
					</el-form-item>
		  			<el-form-item label="认证进度">
		  				<el-select v-model="form.SelectProcess" multiple collapse-tags placeholder="请选择" style="width:195px;">
							<el-option v-for="item in processData" :key="item.Value" :label="item.Label" :value="item.Value"></el-option>
						</el-select>
		  			</el-form-item>
		  			<el-form-item label="授信">
						<el-select v-model="form.CreditState" clearable placeholder="请选择" style="width:140px;">
						    <el-option label="未申请" value="0"></el-option>
						    <el-option label="处理中" value="1"></el-option>
						    <el-option label="通过" value="4"></el-option>
						    <el-option label="关闭" value="7"></el-option>
						    <el-option label="永久关闭" value="5"></el-option>
						</el-select>
					</el-form-item>
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
					<el-table-column prop="Id" label="ID" width="100"></el-table-column>
					<el-table-column prop="Verifyrealname" label="姓名" width="110"></el-table-column>
					<el-table-column prop="Account" label="手机" width="120"></el-table-column>
					<el-table-column prop="VerifyTime" label="认证时间"></el-table-column>
					<el-table-column prop="Source" label="注册渠道"></el-table-column>
					<el-table-column label="认证进度" min-width="140">
						<template slot-scope="scope">
							<el-tooltip placement="top">
								<div slot="content">OCR扫描</div>
							  	<el-button style="cursor:pointer; padding:0px; border:none;" >
							  		<img :src="scope.row.IsOcr==2?ocrac:ocr" style="width:20px; height:20px;" />
							  	</el-button>
							</el-tooltip>
	  	    		        <el-tooltip placement="top">
								<div slot="content">实名认证</div>
							  	<el-button style="cursor:pointer; padding:0px; border:none;" >
							  		<img :src="scope.row.IsRealName==2?shimingac:shiming" style="width:20px; height:20px;" />
							  	</el-button>
							</el-tooltip>
							<el-tooltip placement="top">
								<div slot="content">活体检测</div>
							  	<el-button style="cursor:pointer; padding:0px; border:none;" >
							  		<img :src="scope.row.IsLiving==2?huotiac:huoti" style="width:20px; height:20px;" />
							  	</el-button>
							</el-tooltip>
							<el-tooltip placement="top">
								<div slot="content">紧急联系人</div>
							  	<el-button style="cursor:pointer; padding:0px; border:none;" >
							  		<img :src="scope.row.IsUsersLinkman==2?jinjiac:jinji" style="width:20px; height:20px;" />
							  	</el-button>
							</el-tooltip>
							<el-tooltip placement="top">
								<div slot="content">手机运营商</div>
							  	<el-button style="cursor:pointer; padding:0px; border:none;" >
							  		<img :src="scope.row.IsMobileOperatorsMx==2?yunyingac:yunying" style="width:20px; height:20px;" />
							  	</el-button>
							</el-tooltip>
							<el-tooltip placement="top">
								<div slot="content">收款银行卡</div>
							  	<el-button style="cursor:pointer; padding:0px; border:none;" >
							  		<img :src="scope.row.IsBindCard==2?addbankac:addbank" style="width:20px; height:20px;" />
							  	</el-button>
							</el-tooltip>
							<!--<el-tooltip placement="top">
								<div slot="content">芝麻信用</div>
							  	<el-button style="cursor:pointer; padding:0px; border:none;" >
							  		<img :src="scope.row.IsZmAuth==2?zhimaac:zhima" style="width:20px; height:20px;" />
							  	</el-button>
							</el-tooltip>-->
		  	    		</template>
					</el-table-column>
					<el-table-column label="授信/借款">
						<template slot-scope="scope">
							<div v-if="scope.row.InitAudit==0">未申请</div>
	  	    		        <div v-else-if="scope.row.InitAudit==4">
	  	    		        	<span>{{scope.row.Balance-scope.row.UseBalance}}/{{scope.row.Balance}}</span>
	  	    		        	<label v-if="scope.row.OverdueDays>0&&scope.row.State=='未还'" style="color:red; float:right;">逾期</label>
	  	    		        </div>
	  	    		        <div v-else-if="scope.row.InitAudit==7">
	  	    		        	<span>关闭</span>
	  	    		        	<el-popover placement="top" title="" trigger="hover">
									<p>{{scope.row.CloseTime}}</p>
									<p>关闭{{scope.row.CreditCloseDay}}天</p>
									<el-button icon="el-icon-info" circle slot="reference" style="border:none; padding:0; margin-left:10px;"></el-button>
			  					</el-popover>
	  	    		        </div>
	  	    		        <div v-else-if="scope.row.InitAudit==1" style="color:#10ac6d;">处理中</div>
	  	    		        <div v-else-if="scope.row.InitAudit==5">永久关闭</div>
		  	    		</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
	  	    		        <el-button type="primary" plain size="mini" @click="viewdetails(scope.row.Id)">查看</el-button>
	  	    		        <!--<router-link tag="a" target="_blank" class="editwordSty" :to="{path:'/authuserdtl/'+scope.row.Id}">查看</router-link>-->
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
import { authuserlist } from 'api/api.js';
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
			processData:[],
			form:{ 
				UserAccount:'',
				UserName:'',
				Source:'',
				SelectProcess:[],
				CreditState:null,
				dateValue:[http.dateFormatter(new Date(new Date().getTime()-14*24*60*60*1000),false),http.dateFormatter(new Date(),false)]
			},
			ocr:require('../../assets/img/ocr.png'),
			ocrac:require('../../assets/img/ocrac.png'),
			shiming:require('../../assets/img/shiming.png'),
			shimingac:require('../../assets/img/shimingac.png'),
			huoti:require('../../assets/img/huoti.png'),
			huotiac:require('../../assets/img/huotiac.png'),
			jinji:require('../../assets/img/jinji.png'),
			jinjiac:require('../../assets/img/jinjiac.png'),
			yunying:require('../../assets/img/yunying.png'),
			yunyingac:require('../../assets/img/yunyingac.png'),
			addbank:require('../../assets/img/addbank.png'),
			addbankac:require('../../assets/img/addbankac.png'),
			zhima:require('../../assets/img/zhima.png'),
			zhimaac:require('../../assets/img/zhimaac.png')
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
				UserAccount:this.form.UserAccount,
				UserName:this.form.UserName,
				Source:this.form.Source,
				SelectProcess:this.form.SelectProcess
			};
			if( !this.form.dateValue ){
				params.StartTime='';
				params.EndTime='';
			}else{
				params.StartTime=this.form.dateValue[0]+' 00:00:00';
				params.EndTime=this.form.dateValue[1]+' 23:59:59';
			}
			if( this.form.CreditState==null || this.form.CreditState=='' ){
				params.CreditState=-1;
			}else{
				params.CreditState=parseInt(this.form.CreditState);
			}
			this.listLoading = true;
			authuserlist(params).then((res) => {
				console.log(res);
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.Result.UserSum;
				this.SourceArr=res.Sources || [];
				this.processData=res.Result.DefaultProcess || [];
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
			this.getauthuserlist();
		},
		handleSizeChange(val){    //分页页码改变
	        this.pageSize=val;
	        this.getauthuserlist();
	    },
	   	viewdetails(id){  //查看详情
//	   		this.$router.push({
//	   			path:"/authuserdtl/"+id
//	   		});
			let {href} = this.$router.resolve({path:`/authuserdtl/${id}`});
			window.open(href,'_blank');
	   	}
		
	}
}	
</script>

<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
</style>