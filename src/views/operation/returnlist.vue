<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent size="mini">
					<el-form-item label="手机">
		  		   		<el-input v-model="form.UserAccount" placeholder="请输入" clearable style="width:135px;"></el-input>
		  			</el-form-item>
					<el-form-item label="姓名">
		  		   		<el-input v-model="form.UserName" placeholder="请输入" clearable style="width:135px;"></el-input>
		  			</el-form-item>
					<el-form-item label="渠道">
						<el-select v-model="form.Source" clearable filterable placeholder="请输入渠道" style="width:150px;">
					    	<el-option v-for="item in SourceArr" :key="item.Value" :label="item.Label" :value="item.Label"></el-option>
					  	</el-select>
					</el-form-item>
					<el-form-item>
						<el-select v-model="form.TimeType" placeholder="请选择" style="width:110px;">
						    <el-option label="借款时间" :value="1"></el-option>
						    <el-option label="放款时间" :value="2"></el-option>
						    <el-option label="应还款日期" :value="3"></el-option>
						</el-select>
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:235px;"></el-date-picker>
		  			</el-form-item>
					<el-form-item label="审核类型">
						<el-select v-model="form.VerifyType" placeholder="请选择" filterable style="width:125px;">
							<el-option  label="全部" :value="0"></el-option>
							<el-option  label="系统自动放款" :value="-1"></el-option>
							<el-option  label="人工审核放款" :value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="借款情况">
		  				<el-select v-model="form.SelectedLoanCond" multiple :multiple-limit="2" collapse-tags placeholder="请选择" style="width:145px;">
							<el-option label="借款" :value="-1"></el-option>
							<el-option label="续期" :value="1"></el-option>
							<el-option label="未逾期" :value="-2"></el-option>
							<el-option label="逾期" :value="2"></el-option>
						</el-select>
					</el-form-item>
		  			<el-form-item><el-button type="primary" size="mini" @click="search">搜索</el-button></el-form-item>
		  			<el-form-item v-if="ExportButton">
						<el-button type="primary" size="mini" @click="exportexcel">导出</el-button>
					</el-form-item>
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;">
					<el-table-column prop="Source" label="渠道"></el-table-column>
					<el-table-column label="手机" min-width="120">
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.Account}}</span>
	  	    		        <span v-if="scope.row.RenewCount" style="float:right; width:55px; text-align:center; font-size:12px; color:#fff; background:#FF9800; border-radius:4px;">第{{scope.row.RenewCount}}次续期</span>
		  	    		</template>
					</el-table-column>
					<el-table-column prop="Verifyrealname" label="姓名" min-width="100"></el-table-column>
					<el-table-column label="实际金额">
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.RealMoney}} 元</span>
		  	    		</template>
					</el-table-column>
					<el-table-column label="借款金额">
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.Money}} 元</span>
		  	    		</template>
					</el-table-column>
					<el-table-column label="待还金额">
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.NoReturnMoney}} 元</span>
							<span v-if="scope.row.OverdueFee>0" style="color:#ff0000;">（{{scope.row.OverdueFee}} 元）</span>
		  	    		</template>
					</el-table-column>
					<el-table-column label="借款时间" prop="LoanDate" min-width="100"></el-table-column>
					<el-table-column label="放款时间" prop="TradeDate" min-width="100"></el-table-column>
					<el-table-column label="应还款日期"  min-width="120">
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.LoanReturnDate}}</span>
	  	    		        <span v-if="scope.row.OverdueDays" style="float:right; font-size:12px; color:#E51C23;">逾期{{scope.row.OverdueDays}}天</span>
		  	    		</template>
					</el-table-column>
					<el-table-column label="操作" min-width="110">
						<template slot-scope="scope">
	  	    		        <el-button type="primary" plain size="mini"  @click="viewdetails(scope.row.Uid,scope.row.LoanId)">查看</el-button>
	  	    		        <el-button type="primary" plain size="mini"  @click="gohandrenew(scope.row.LoanId)">手动续期</el-button>
		  	    		</template>
					</el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
				<span style="font:14px/32px '微软雅黑';">
					合计：借款金额 <label class="editwordSty">{{TotalMoney}}</label> &nbsp;&nbsp;&nbsp; 
					实际金额 <label class="editwordSty">{{TotalRealMoney}}</label> &nbsp;&nbsp;&nbsp; 
					待还金额 <label class="editwordSty">{{TotalNoReturnMoney}}</label>&nbsp;&nbsp;&nbsp;
					机审订单 <label class="editwordSty">{{NumSystemLoan}}条</label>&nbsp;&nbsp;&nbsp;
					人工审核 <label class="editwordSty">{{NumPersonLoan}}条</label>
				</span>
		  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		  	</el-col>
		</el-card>
		<!-- 添加渠道弹框 -->
		<el-dialog title="手动续期（手动续期仅作入账记录）" :visible.sync="renewDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="700px">
			<el-form :model="renewForm" :rules="rules" label-width="80px" ref="renewForm">
				<el-form-item label="续期时间" prop="RenewDay">
					<el-input v-model.number="renewForm.RenewDay" placeholder="请输入" clearable auto-complete="off" style="width:40%;"></el-input><span> 天</span>
				</el-form-item>
				<el-form-item label="续期费用" prop="RenewMoney">
					<el-input v-model.number="renewForm.RenewMoney" placeholder="请输入" clearable auto-complete="off" style="width:40%;"></el-input><span> 元</span>
					<label style="width:54%; font:12px/20px '微软雅黑'; color:#ccc; float:right;">*续期费用包括但不限于续期服务费、续期手续费，不会额外在APP中向用户收取</label>
				</el-form-item>
				<el-form-item label="备注" prop="Remark">
					<el-input type="textarea" v-model="renewForm.Remark" placeholder="请输入（选填）" style="width:80%;"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="renewSubmit">确定</el-button>
				<el-button @click.native="renewDialog=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import http from "../../api/http.js";
import { financemanagelist,handrenew,buttonctl } from 'api/api.js';
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
				UserAccount:'', //手机号
				UserName:'',    //用户姓名
				SelectedLoanCond:[], 
				Source:'',
				VerifyType:0,//审核类型
				TimeType:1, //1-借款时间 2-放款时间 3-应还款日期
				dateValue:[http.dateFormatter(new Date(new Date().getTime()-14*24*60*60*1000),false),http.dateFormatter(new Date(),false)]
			},
			TotalMoney:'',
			TotalRealMoney:'',
			TotalNoReturnMoney:'',
			NumPersonLoan:"",
			NumSystemLoan:"",
			successlogo:require('../../assets/img/success.png'),
			continuelogo:require('../../assets/img/continue.png'),
			failllogo:require('../../assets/img/faill.png'),
			renewDialog:false,
			renewForm:{
				LoanId:null,
				RenewDay:null,
				RenewMoney:null,
				Remark:''
			},
			rules:{
				RenewDay:[{
					required:true,
					message:'请输入续期时间',
					trigger:'blur'
				}],
				RenewMoney:[{
					required:true,
					message:'请输入续期费用',
					trigger:'blur'
				}]
			}
		}
	},
	mounted(){
		this.getfinancemanagelist();
		buttonctl({}).then((res) => {  //钮权限控制
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
	   		let url=process.env.API_ROOT+"/export/backinglisttoexcel?start_time="+this.form.dateValue[0]+" 00:00:00&end_time="+this.form.dateValue[1]+" 23:59:59&merchant="+JSON.parse( sessionStorage.getItem('userDtl') ).Merchant+"&user_account="+this.form.UserAccount+"&user_name="+this.form.UserName+"&time_type="+this.form.TimeType+"&selected_loan_cond="+this.form.SelectedLoanCond.join(',')+"&source="+this.form.Source+"&VerifyType="+this.form.VerifyType+"&account="+JSON.parse( sessionStorage.getItem('userDtl') ).Account;
			window.location.href=url;
	   	},
		gohandrenew(id){  //手动续期
			this.renewForm.LoanId=id;
			this.renewForm.RenewDay=null;
			this.renewForm.RenewMoney=null;
			this.renewForm.Remark='';
			this.renewDialog=true;
		},
		renewSubmit(){  //确定手动续期
			this.$refs.renewForm.validate((valid) => {
				if( valid ){
					if( this.renewForm.RenewDay<0 ){
						this.$message.error('续期时间请输入大于0的天数！');
						return false;
					}
					if( this.renewForm.RenewMoney<0 ){
						this.$message.error('续期费用请输入大于0的金额！');
						return false;
					}
					handrenew(this.renewForm).then((res) => {
						if( res.Ret==200 ){
							this.$message.success( res.Msg );
							this.getfinancemanagelist();
							this.renewDialog=false;
						}
					});
				}
			});
		},
		search(){  //搜索
			this.ispage = false;
			this.$nextTick(() => {
				this.page = 1;
				this.getfinancemanagelist();
				this.ispage = true;
			});
		},
		getfinancemanagelist(){  //获取回款管理列表
			let params = {
				Page:this.page,
				PageSize:this.pageSize,
				UserAccount:this.form.UserAccount,
				UserName:this.form.UserName,
				TimeType:this.form.TimeType,
				SelectedLoanCond:this.form.SelectedLoanCond,
				Source:this.form.Source,
				VerifyType:this.form.VerifyType
			};
			if( !this.form.dateValue ){
				params.StartTime='';
				params.EndTime='';
			}else{
				params.StartTime=this.form.dateValue[0]+' 00:00:00';
				params.EndTime=this.form.dateValue[1]+' 23:59:59';
			}
			this.listLoading = true;
			financemanagelist(params).then((res) => {
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.Result.UserSum;
				this.TotalMoney=res.Result.TotalMoney;
				this.TotalRealMoney=res.Result.TotalRealMoney;
				this.TotalNoReturnMoney=res.Result.TotalNoReturnMoney;
				this.NumPersonLoan = res.Result.NumPersonLoan;
				this.NumSystemLoan = res.Result.NumSystemLoan;
				this.tableData = res.Result.List || [];
				this.SourceArr=res.Sources || [];
				this.listLoading = false;
			});
		},
		handleCurrentChange(current){  //分页页码跳转
			this.page = current;
			this.getfinancemanagelist();
		},
		handleSizeChange(val){    //分页页码改变
	        this.pageSize=val;
	        this.getfinancemanagelist();
	   	},
	   	viewdetails(Uid,LoanId){  //查看详情
//	   		this.$router.push({
//	   			path:"/returndtl/"+Uid+"/"+LoanId
//	   		});
			let {href} = this.$router.resolve({path:`/returndtl/${Uid}/${LoanId}`});
			window.open(href,'_blank');
	   	}
		
	}
}	
</script>

<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
</style>