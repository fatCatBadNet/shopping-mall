<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent size="mini">
					<!--<el-form-item label="借款时间">
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:215px;"></el-date-picker>
		  			</el-form-item>-->
		  			<el-form-item label="手机">
		  		   		<el-input v-model="form.UserAccount" placeholder="请输入" clearable style="width:160px;"></el-input>
		  			</el-form-item>
		  			<el-form-item label="姓名">
		  		   		<el-input v-model="form.UserName" placeholder="请输入" clearable style="width:120px;"></el-input>
		  			</el-form-item>
		  			<!--<el-form-item label="放款通道">
						<el-select v-model="form.Channel" clearable placeholder="请选择" style="width:95px;">
						    <el-option label="合利宝" :value="'合利宝'"></el-option>
						    <el-option label="支付宝" :value="'支付宝'"></el-option>
						    <el-option label="微信" :value="'微信'"></el-option>
						    <el-option label="银行转账" :value="'银行转账'"></el-option>
						    <el-option label="畅捷" :value="'畅捷'"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="状态">
						<el-select v-model="form.State" clearable placeholder="请选择" style="width:85px;">
						    <el-option label="成功" :value="'SUCCESS'"></el-option>
						    <el-option label="等待中" :value="'CONFIRM'"></el-option>
						    <el-option label="失败" :value="'FAIL'"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="处理人">
		  		   		<el-input v-model="form.Oper" placeholder="请输入" clearable style="width:85px;"></el-input>
		  			</el-form-item>-->
		  			<el-form-item label="渠道">
		  		   		<el-select v-model="form.Source" clearable filterable placeholder="请选择" style="width:180px;">
					    	<el-option v-for="item in SourceArr" :key="item.Value" :label="item.Label" :value="item.Label"> </el-option>
					  	</el-select>
		  			</el-form-item>
		  			<el-form-item label="建议结果">
						<el-select v-model="form.FkAdviceResult" placeholder="请选择" clearable style="width:120px;">
                            <!-- <el-option label="系统处理中" value="null"></el-option> -->
                            <el-option label="通过" value="PASS"></el-option>
							<el-option label="单次关闭" value="REFUSE0"></el-option>
                            <el-option label="关闭7天" value="REFUSE7"></el-option>
                            <el-option label="关闭30天" value="REFUSE30"></el-option>
                            <el-option label="永久关闭" value="REFUSEALL"></el-option>
							<el-option label="人工审核" value="SOURCEMANUAL"></el-option>
						</el-select>
					</el-form-item>
		  			<!--<el-form-item label="订单号">
		  		   		<el-input v-model="form.OrderNumber" placeholder="请输入" clearable style="width:120px;"></el-input>
		  			</el-form-item>
		  			<el-form-item label="复借类型">
		  		   		<el-select v-model="form.SelectLoanFinishCount" multiple collapse-tags placeholder="请选择" style="width:150px;">
					    	<el-option v-for="item in LoanFinishArr" :key="item.Value" :label='item.Label' :value="item.Value"></el-option>
					  	</el-select>
		  			</el-form-item>-->
		  			<el-form-item><el-button type="primary" size="mini" @click="search">搜索</el-button></el-form-item>
		  			<!--<el-form-item v-if="ExportButton">
						<el-button type="primary" size="mini" @click="exportexcel">导出</el-button>
					</el-form-item>-->
					<el-form-item class="online">
						<el-dropdown placement="bottom">
							<span class="el-dropdown-link">
								<i :class="[LoginState=='ONLINE'?'fa-commenting':LoginState=='OFFLINE'?'fa-coffee':LoginState=='SUSPEND'?'fa-window-close':'','fa','fa-fw']" :style="{marginRight:'2px',fontSize:'18px',color:LoginState=='ONLINE'?'#8BC34A':LoginState=='OFFLINE'?'#FFD700':LoginState=='SUSPEND'?'#ccc':'#ccc'}"></i>
								<label>{{LoginState=='ONLINE'?'在线':LoginState=='OFFLINE'?'小休':LoginState=='SUSPEND'?'挂起':''}}</label>
							</span>
							<!--<span class="el-dropdown-link" v-else-if="LoginState=='OFFLINE'">
								<i class="fa fa-coffee fa-fw" style="font-size:18px; margin-right:2px; color:#FFD700;"></i>
								<label>小休</label>
							</span>
							<span class="el-dropdown-link" v-else-if="LoginState=='SUSPEND'">
								<i class="fa fa-window-close fa-fw" style="font-size:18px; margin-right:2px; color:#ccc;"></i>
								<label>挂起</label>
							</span>-->
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
					<el-table-column prop="Source" label="渠道"></el-table-column>
					<el-table-column label="借款金额">
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.LoanAmount}}元</span>
		  	    		</template>
					</el-table-column>
					<!--<el-table-column label="到账金额">
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.ReplyAmount}}元</span>
		  	    		</template>
					</el-table-column>-->
					<el-table-column label="借款期限">
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.Term}}天</span>
		  	    		</template>
					</el-table-column>
					<el-table-column prop="LoanDate" label="借款申请时间" min-width="135"></el-table-column>
					<el-table-column label="建议结果" min-width="155">
						<template slot-scope="scope">
							<div v-if="scope.row.FkAdviceResult==''&&scope.row.State=='CONFIRM'">系统处理中</div>
							<span v-else>{{scope.row.FkAdviceResult=="PASS"?(scope.row.FkAdviceBalance>0?"通过（"+scope.row.FkAdviceBalance+"元）":'通过'):scope.row.FkAdviceResult=="REFUSE0"?"单次关闭":scope.row.FkAdviceResult==""?"通过":scope.row.FkAdviceResult=="REFUSE7"?"关闭7天":scope.row.FkAdviceResult=="REFUSE30"?"关闭30天":scope.row.FkAdviceResult=="REFUSEALL"?"永久关闭":scope.row.FkAdviceResult=="SOURCEMANUAL"?"人工审核":""}}</span>
						</template>
					</el-table-column>
					<!--<el-table-column prop="LetterResult" label="审核结果" min-width="155">
						<template slot-scope="scope">
							<span v-if="scope.row.LetterState=='CONFIRM'"></span>
							<span v-else-if="scope.row.LetterState=='PASS'">通过（{{scope.row.LoanAmount}}元）</span>
							<span v-else-if="scope.row.LetterState=='REFUSE'">
								{{scope.row.LetterCloseState=="REFUSE0"?"关闭":scope.row.LetterCloseState=="REFUSE7"?"拒绝7天":scope.row.LetterCloseState=="REFUSE30"?"关闭30天":scope.row.LetterCloseState=="REFUSEALL"?"永久拒绝":""}}
							</span>
						</template>
					</el-table-column>-->
					<!--<el-table-column label="状态" min-width="150">
						<template slot-scope="scope">
	  	    		    	<img class="status-img" :src="scope.row.State=='SUCCESS'?successlogo:scope.row.State=='CONFIRM'?continuelogo:failllogo" />
	  	    		    	<span v-if="scope.row.State!='CONFIRM'" style="margin-left:3px;">{{scope.row.GiveoutDate}}</span>
		  	    		</template>
					</el-table-column>-->
					<!--<el-table-column label="放款通道 | 订单号&备注" min-width="240">
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.Channel}}</span>&nbsp;
	  	    		        <span style="color:#999;">{{scope.row.Remark}}</span>
	  	    		        <span v-if="scope.row.RenewCount" style="float:right; font-size:12px; color:#fff; padding:1px 4px; background:#8BC34A; border-radius:4px; margin-left:4px;">续期订单</span>
		  	    		</template>
					</el-table-column>-->
					<!--<el-table-column prop="GiveoutDate" label="审核时间" min-width="135"></el-table-column>
					<el-table-column prop="GiveoutRemark" label="备注" min-width="130"></el-table-column>-->
					<el-table-column prop="Oper" label="审核人员" min-width="100"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<!--<el-button type="primary" plain size="mini" @click="lookuserdtl(scope.row.Uid)">查看</el-button>-->
							<!--<el-button type="primary" plain size="mini" @click="viewdetails(scope.row.Id)" v-if="scope.row.State=='CONFIRM'&&scope.row.IsAtf==1">审核</el-button>-->
	  	    		        <el-button type="primary" plain size="mini" @click="viewdetails(scope.row.Id)">审核</el-button>
		  	    		</template>
					</el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
				<span style="font:14px/32px '微软雅黑';">
					合计：
					借款笔数 <label class="editwordSty">{{total}}</label> &nbsp;&nbsp;&nbsp; 
					借款金额 <label class="editwordSty">{{LoanAmount}}</label> &nbsp;&nbsp;&nbsp; 
					到账金额 <label class="editwordSty">{{ReplyAmount}}</label>
				</span>
		  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		  	</el-col>
		</el-card>
	</div>
</template>

<script>
import http from "../../api/http.js";
import { riskmgrlist,buttonctl,getuserloginstate,updateuserloginstate } from 'api/api.js';
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
			LoginState:'',
			ExportButton:false,
			page:1,
			total:0,
			pageSize:100,
			ispage:true,
			listLoading:false,
			tableData:[],
			SourceArr:[],
			LoanFinishArr:[],
			form:{ 
				UserAccount:'',
				UserName:'',
				Channel:"", 
				State:'',  //放款状态 SUCCESS-成功 CONFIRM-放款中 FAIL-失败
				Oper:'',
				Source:'',
				SelectLoanFinishCount:[],
				OrderNumber:'',
				FkAdviceResult:"",  //建议结果
				dateValue:[http.dateFormatter(new Date(new Date().getTime()-14*24*60*60*1000),false),http.dateFormatter(new Date(),false)]
			},
			LoanAmount:'',
			ReplyAmount:'',
			successlogo:require('../../assets/img/success.png'),
			continuelogo:require('../../assets/img/continue.png'),
			failllogo:require('../../assets/img/faill.png')
		}
	},
	mounted(){
		this.getlist();
		this.getstate();
//		buttonctl({}).then((res) => {  //按钮权限控制
//			console.log(res);
//			this.ExportButton=false;
//			if( res.Ret==200 && res.AllCtl.ExportButton ){
//				this.ExportButton=res.AllCtl.ExportButton;
//			}
//		});
	},
	methods: {
		getstate(){  //获取用户状态
			getuserloginstate({}).then(res => {
				console.log(res);
				if(res.Ret == 200) {
					this.LoginState=res.LoginState;
				}
			});
		},
		setstate(state){  //设置用户状态
			updateuserloginstate({LoginState:state}).then(res => {
				console.log(res);
				if(res.Ret == 200) {
					this.getstate();
				}
			});
		},
		exportexcel(){  //导出数据
	   		if( !this.form.dateValue ){
	   			this.$message.error("借款时间不得为空！");
				return false;
			}
	   		let url=process.env.API_ROOT+"/export/riskmgrdataexportexcel?start_time="+this.form.dateValue[0]+" 00:00:00&end_time="+this.form.dateValue[1]+" 23:59:59&merchant="+JSON.parse( sessionStorage.getItem('userDtl') ).Merchant+"&user_account="+this.form.UserAccount+"&user_name="+this.form.UserName+"&state="+this.form.State+"&channel_string="+this.form.Channel+"&order_number="+this.form.OrderNumber+"&source="+this.form.Source+"&oper="+this.form.Oper+"&select_loan_finish_count="+this.form.SelectLoanFinishCount.join(',')+"&account="+JSON.parse( sessionStorage.getItem('userDtl') ).Account;
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
//				Channel:this.form.Channel,
//				State:this.form.State,
//				Oper:this.form.Oper,
				Source:this.form.Source,
				FkAdviceResult:this.form.FkAdviceResult,
//				SelectLoanFinishCount:this.form.SelectLoanFinishCount,
//				OrderNumber:this.form.OrderNumber
			};
//			if( !this.form.dateValue ){
//				params.StartTime='';
//				params.EndTime='';
//			}else{
//				params.StartTime=this.form.dateValue[0]+' 00:00:00';
//				params.EndTime=this.form.dateValue[1]+' 23:59:59';
//			}
			this.listLoading = true;
			riskmgrlist(params).then((res) => {
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.Result.Sum;
				this.SourceArr=res.Sources || [];
				this.LoanFinishArr=res.LoanFinishCounts || [];
				this.LoanAmount=res.Result.LoanAmount;
				this.ReplyAmount=res.Result.ReplyAmount;
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
	   	lookuserdtl(id){  //查看
//	   		this.$router.push({
//	   			path:"/authuserdtl/"+id
//	   		});
	   		let {href} = this.$router.resolve({path:`/authuserdtl/${id}`});
			window.open(href,'_blank');
	   	},
	   	viewdetails(id){  //审核
			sessionStorage.setItem("listsource","confirm");
	   		this.$router.push({
	   			path:"/fkdtl/"+id
	   		});
//	   		let {href} = this.$router.resolve({path:`/fkdtl/${id}`});
//			window.open(href,'_blank');
	   	}
		
	}
}	
</script>

<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
	.status-img{ width:20px; vertical-align:middle; }
	.online{ float:right; padding:2px 10px 2px 5px; color:#000; cursor:pointer; border:1px solid #eaeaea; border-radius:4px; }
</style>