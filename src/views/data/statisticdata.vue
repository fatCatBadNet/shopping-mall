<template>
	<div id="statisticdata">
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent size="mini">
					<el-form-item>
						<el-select v-model="form.TimeType" placeholder="请选择" style="width:110px;">
						    <el-option label="借款时间" :value="1"></el-option>
						    <el-option label="放款时间" :value="2"></el-option>
						</el-select>
		  		   		<el-date-picker v-model="form.dateValue" type="daterange" :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:215px;"></el-date-picker>
		  			</el-form-item>
					<el-form-item label="渠道">
						<el-select v-model="form.Source" clearable filterable placeholder="请输入渠道" style="width:150px;">
					    	<el-option v-for="item in SourceArr" :key="item.Value" :label="item.Label" :value="item.Label"></el-option>
					  	</el-select>
					</el-form-item>
		  			<el-form-item label="手机">
		  		   		<el-input v-model="form.UserAccount" placeholder="请输入" clearable style="width:120px;"></el-input>
		  			</el-form-item>
		  			<el-form-item label="姓名">
		  		   		<el-input v-model="form.UserName" placeholder="请输入" clearable style="width:85px;"></el-input>
		  			</el-form-item>
		  			<el-form-item label="放款通道">
						<el-select v-model="form.Channel" clearable placeholder="请选择" style="width:85px;">
							<el-option v-for="(item,index) in DefaultChannels" :key="index" :label="item.Description" :value="item.DiyCode"></el-option>
						    <!-- <el-option label="合利宝" :value="3"></el-option>
						    <el-option label="畅捷" :value="8"></el-option>
							<el-option label="富友" :value="15"></el-option> -->
						</el-select>
					</el-form-item>
					<el-form-item label="状态">
						<el-select v-model="form.TradeState" clearable placeholder="请选择" style="width:85px;">
						    <el-option label="成功" :value="'SUCCESS'"></el-option>
						    <el-option label="等待中" :value="'CONFIRM'"></el-option>
						    <el-option label="失败" :value="'FAIL'"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="订单号">
		  		   		<el-input v-model="form.OrderNumber" placeholder="请输入" clearable style="width:120px;"></el-input>
		  			</el-form-item>
		  			<el-form-item label="审核类型">
						<el-select v-model="form.IsLetter" placeholder="请选择" style="width:120px;">
						    <el-option label="全部" :value="99"></el-option>
						    <el-option label="系统自动放款" :value="0"></el-option>
						    <el-option label="人工审核放款" :value="1"></el-option>
						</el-select>
					</el-form-item>
		  			<el-form-item><el-button type="primary" size="mini" @click="search">搜索</el-button></el-form-item>
		  			<el-form-item v-if="ExportButton">
						<el-button type="primary" size="mini" @click="exportexcel">导出</el-button>
					</el-form-item>
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
					<el-table-column prop="Source" label="渠道"></el-table-column>
					<el-table-column prop="LoanDate" label="借款时间" min-width="150"></el-table-column>
					<el-table-column prop="Account" label="手机" min-width="100"></el-table-column>
					<el-table-column prop="Verifyrealname" label="姓名"></el-table-column>
					<el-table-column label="借款金额">
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.Money}}元</span>
		  	    		</template>
					</el-table-column>
					<el-table-column label="到账金额">
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.CapitalAmount}}元</span>
		  	    		</template>
					</el-table-column>
					<el-table-column label="借款期限">
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.LoanTermCount}}天</span>
		  	    		</template>
					</el-table-column>
					<el-table-column label="放款通道" prop="ChannelString">
						<!-- <template slot-scope="scope">
	  	    		        <span>{{scope.row.Channel==3?"合利宝":scope.row.Channel==8?"畅捷":scope.row.Channel==15?"富友":""}}</span>
		  	    		</template> -->
					</el-table-column>
					<el-table-column prop="OrderNumber" label="订单号" min-width="200"></el-table-column>
					<el-table-column label="状态" min-width="190">
						<template slot-scope="scope">
	  	    		    	<img class="status-img" :src="scope.row.State=='SUCCESS'?successlogo:scope.row.State=='CONFIRM'?continuelogo:failllogo" />
	  	    		    	<span style="margin-left:3px;">{{scope.row.DtOrder}}</span>
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
				<span style="font:14px/32px '微软雅黑';">
					合计：借款金额 <label class="editwordSty">{{TotalLoanMoney}}</label> &nbsp;&nbsp;&nbsp; 
					到账金额 <label class="editwordSty">{{TotalRealMoney}}</label> &nbsp;&nbsp;&nbsp;
					机审订单 <label class="editwordSty">{{NumSystemLoan}}条</label> &nbsp;&nbsp;&nbsp;
					人工审核 <label class="editwordSty">{{NumPersonLoan}}条</label>
				</span>
		  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		  	</el-col>
		</el-card>
	</div>
</template>

<script>
import http from "../../api/http.js";
import { traderecordlist,buttonctl } from 'api/api.js';
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
			DefaultChannels:[],
			form:{ 
				UserAccount:'',
				UserName:'',
				Channel:null, //1连连，3易宝
				TradeState:'',  //放款状态 SUCCESS-成功 CONFIRM-放款中 FAIL-失败
				OrderNumber:'',
				IsLetter:99,
				Source:'',
				TimeType:1, //1-借款时间 2-放款时间 3-应还款日期
				dateValue:[http.dateFormatter(new Date(new Date().getTime()-14*24*60*60*1000),false),http.dateFormatter(new Date(),false)],
			},
			TotalLoanMoney:'',
			TotalRealMoney:'',
			NumPersonLoan:"",
			NumSystemLoan:"",
			successlogo:require('../../assets/img/success.png'),
			continuelogo:require('../../assets/img/continue.png'),
			failllogo:require('../../assets/img/faill.png')
		}
	},
	mounted(){
		this.gettraderecordlist();
		buttonctl({}).then((res) => {  //催收按钮权限控制
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
	   			this.$message.error("时间不得为空！");
				return false;
			}
	   		let url=process.env.API_ROOT+"/export/tradedataexportexcel?start_time="+this.form.dateValue[0]+" 00:00:00&end_time="+this.form.dateValue[1]+" 23:59:59&time_type="+this.form.TimeType+"&merchant="+JSON.parse( sessionStorage.getItem('userDtl') ).Merchant+"&user_account="+this.form.UserAccount+"&user_name="+this.form.UserName+"&state="+this.form.TradeState+"&channel="+this.form.Channel+"&is_letter="+this.form.IsLetter+"&source="+this.form.Source+"&account="+JSON.parse( sessionStorage.getItem('userDtl') ).Account+"&order_number="+this.form.OrderNumber;
			window.location.href=url;
	   	},
		search(){  //搜索
			this.ispage = false;
			this.$nextTick(() => {
				this.page = 1;
				this.gettraderecordlist();
				this.ispage = true;
			});
		},
		gettraderecordlist(){  //获取认证用户列表
			if( this.form.Channel=='' ){
				this.form.Channel=null;
			}
			let params = {
				Page:this.page,
				PageSize:this.pageSize,
				UserAccount:this.form.UserAccount,
				UserName:this.form.UserName,
				Channel:this.form.Channel,
				TradeState:this.form.TradeState,
				OrderNumber:this.form.OrderNumber,
				IsLetter:this.form.IsLetter,
				TimeType:this.form.TimeType,
				Source:this.form.Source
			};
			if( !this.form.dateValue ){
				params.StartTime='';
				params.EndTime='';
			}else{
				params.StartTime=this.form.dateValue[0]+' 00:00:00';
				params.EndTime=this.form.dateValue[1]+' 23:59:59';
			}
			this.listLoading = true;
			traderecordlist(params).then((res) => {
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.Result.UserSum;
				this.TotalLoanMoney=res.Result.TotalLoanMoney;
				this.TotalRealMoney=res.Result.TotalRealMoney;
				this.NumPersonLoan = res.Result.NumPersonLoan;
				this.NumSystemLoan = res.Result.NumSystemLoan;
				this.tableData = res.Result.List || [];
				this.SourceArr=res.Sources || [];
				this.DefaultChannels=res.Result.DefaultChannels || [];
				this.listLoading = false;
			});
		},
		handleCurrentChange(current){  //分页页码跳转
			this.page = current;
			this.gettraderecordlist();
		},
		handleSizeChange(val){    //分页页码改变
	        this.pageSize=val;
	        this.gettraderecordlist();
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

<style lang="scss">
	#statisticdata{
		.header .el-form-item{ margin-bottom:0; }
		.el-card__header{ padding-bottom:10px; }
		.el-form-item--mini.el-form-item,.el-form-item--small.el-form-item{ margin-bottom:10px; }
		.status-img{ width:20px; vertical-align:middle; }
	}
</style>