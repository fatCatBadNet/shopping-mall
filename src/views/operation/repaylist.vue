<template>
	<div id="repaylist">
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent size="mini">
					<el-form-item label="手机">
						<el-input v-model="form.UserAccount" placeholder="请输入" clearable style="width:120px;"></el-input>
					</el-form-item>
					<el-form-item label="姓名">
						<el-input v-model="form.UserName" placeholder="请输入" clearable style="width:120px;"></el-input>
					</el-form-item>
					<el-form-item label="渠道">
						<el-select v-model="form.Source" clearable filterable placeholder="请输入渠道" style="width:150px;">
					    	<el-option v-for="item in SourceArr" :key="item.Value" :label="item.Label" :value="item.Label"></el-option>
					  	</el-select>
					</el-form-item>
					<el-form-item>
						<el-select v-model="form.TimeType" placeholder="请选择" style="width:110px;">
						    <el-option label="还款时间" :value="3"></el-option>
						    <el-option label="到期时间" :value="4"></el-option>
						</el-select>
						<el-date-picker v-model="form.dateValue" type="daterange" :picker-options="pickerOptions" popper-class="repaylist" @focus="_handleFocus" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:240px;"></el-date-picker>
					</el-form-item>
					<el-form-item label="订单号">
						<el-input v-model="form.OrderNumber" placeholder="请输入" clearable style="width:140px;"></el-input>
					</el-form-item>
					<el-form-item label="还款类型">
						<el-select v-model="form.ReturnType" placeholder="请选择" clearable style="width:110px;">
						    <el-option label="提前还款" :value="1"></el-option>
						    <el-option label="到期还款" :value="2"></el-option>
							<el-option label="逾期还款" :value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="还款方式">
						<el-select v-model="form.Channel" clearable placeholder="请选择" style="width:160px;">
							<el-option v-for="(item,index) in DefaultChannels" :key="index" :label="item.Description" :value="item.DiyCode"></el-option>
							<!-- <el-option label="主动还款-合利宝" :value="13"></el-option>
							<el-option label="代扣-合利宝" :value="3"></el-option>
							<el-option label="支付宝转账" :value="5"></el-option>
							<el-option label="微信转账" :value="4"></el-option>
							<el-option label="银行卡转账" :value="6"></el-option>
							<el-option label="畅捷代扣" :value="8"></el-option>
							<el-option label="畅捷支付" :value="18"></el-option>
							<el-option label="代扣-富友" :value="15"></el-option>
							<el-option label="主动还款-富友" :value="25"></el-option> -->
						</el-select>
					</el-form-item>
					<el-form-item label="状态">
						<el-select v-model="form.State" clearable placeholder="请选择" style="width:140px;">
							<el-option label="支付结果确认中" value="CONFIRM"></el-option>
							<el-option label="成功" value="SUCCESS"></el-option>
							<el-option label="失败" value="FAIL"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核类型">
						<el-select v-model="form.VerifyType" placeholder="请选择" filterable style="width:125px;">
							<el-option  label="全部" :value="0"></el-option>
							<el-option  label="系统自动放款" :value="-1"></el-option>
							<el-option  label="人工审核放款" :value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="mini" @click="search">搜索</el-button>
					</el-form-item>
					<el-form-item v-if="ExportButton">
						<el-button type="primary" size="mini" @click="exportexcel">导出</el-button>
					</el-form-item>
				</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
					<el-table-column prop="Source" label="渠道"></el-table-column>
					<el-table-column prop="Account" label="手机" min-width="105"></el-table-column>
					<el-table-column prop="Verifyrealname" label="姓名"></el-table-column>
					<el-table-column label="到期时间" prop="LoanReturnDate" min-width="95"></el-table-column>
					<el-table-column label="还款时间" prop="CreateTime" min-width="150"></el-table-column>
					<el-table-column label="还款金额(元)" prop="ReturnMoney" min-width="95"></el-table-column>
					<el-table-column label="本金(元)" prop="ReturnCapitalAmount"></el-table-column>
					<el-table-column label="利息(元)" prop="ReturnTaxAmount"></el-table-column>
					<el-table-column label="其他(元)" prop="OthersMoney"></el-table-column>
					<el-table-column label="还款方式" prop="ChannelString" min-width="115"></el-table-column>
					<el-table-column label="订单号" prop="OrderNumber" min-width="225" :render-header="renderHeader1"></el-table-column>
					<el-table-column label="流水号" prop="OidPaybill" min-width="215" :render-header="renderHeader2"></el-table-column>
					<el-table-column label="状态" prop="State" min-width="115">
						<template slot-scope="scope">
							<span v-if="scope.row.State=='CONFIRM'" style="">支付结果确认中</span>
							<span v-else-if="scope.row.State=='SUCCESS'" style="">成功</span>
							<span v-else style="">失败</span>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="primary" plain size="mini" @click="viewdetails(scope.row.Uid)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
				<span style="font:14px/32px '微软雅黑';">
					合计：还款金额 <label class="editwordSty">{{TotalReturnMoney}}</label> &nbsp;&nbsp;&nbsp; 
					本金 <label class="editwordSty">{{TotalReturnCapitalAmount}}</label>&nbsp;&nbsp;&nbsp; 
					利息 <label class="editwordSty">{{TotalReturnTaxAmount}}</label>&nbsp;&nbsp;&nbsp; 
					其他 <label class="editwordSty">{{TotalOthersMoney}}</label>&nbsp;&nbsp;&nbsp; 
					机审订单 <label class="editwordSty">{{NumSystemLoan}}条</label>&nbsp;&nbsp;&nbsp;
					人工审核 <label class="editwordSty">{{NumPersonLoan}}条</label>
				</span>
				<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
			</el-col>
		</el-card>
	</div>
</template>

<script>
	import http from "../../api/http.js";
	import {repaymentlist,buttonctl} from "api/api.js";
	export default {
		data() {
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
				page: 1,
				total: 0,
				pageSize: 15,
				ispage: true,
				listLoading: false,
				tableData: [],
				SourceArr:[],
				DefaultChannels:[],
				form: {
					UserAccount: "", //手机号
					UserName: "", //用户姓名
					OrderNumber: "", //订单号
					Channel: null, //还款方式
					State: "", //状态
					Source:'',
					VerifyType:0,//审核类型
					TimeType:3, //3还款时间，4到期时间
					ReturnType:null,  //1-提前还款 2-到期还款 3-逾期还款
					dateValue: [http.dateFormatter(new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000),false),http.dateFormatter(new Date(), false)]
				},
				TotalReturnMoney: "",
				TotalReturnCapitalAmount: "",
				TotalReturnTaxAmount: "",
				TotalOthersMoney: "",
				NumPersonLoan:"",
				NumSystemLoan:"",
				successlogo: require("../../assets/img/success.png"),
				continuelogo: require("../../assets/img/continue.png"),
				failllogo: require("../../assets/img/faill.png")
			};
		},
		mounted() {
			this.getlist();
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
				if( this.form.TimeType==4 ){
					let url=process.env.API_ROOT+"/export/repaymentdataexportexcel?start_time="+this.form.dateValue[0]+"&end_time="+this.form.dateValue[1]+"&merchant="+JSON.parse( sessionStorage.getItem('userDtl') ).Merchant+"&user_account="+this.form.UserAccount+"&user_name="+this.form.UserName+"&order_number="+this.form.OrderNumber+"&state="+this.form.State+"&channel="+this.form.Channel+"&source="+this.form.Source+"&VerifyType="+this.form.VerifyType+"&account="+JSON.parse( sessionStorage.getItem('userDtl') ).Account+"&time_type="+this.form.TimeType+"&return_type="+this.form.ReturnType;
					window.location.href=url;
				}else{
					let url=process.env.API_ROOT+"/export/repaymentdataexportexcel?start_time="+this.form.dateValue[0]+" 00:00:00&end_time="+this.form.dateValue[1]+" 23:59:59&merchant="+JSON.parse( sessionStorage.getItem('userDtl') ).Merchant+"&user_account="+this.form.UserAccount+"&user_name="+this.form.UserName+"&order_number="+this.form.OrderNumber+"&state="+this.form.State+"&channel="+this.form.Channel+"&source="+this.form.Source+"&VerifyType="+this.form.VerifyType+"&account="+JSON.parse( sessionStorage.getItem('userDtl') ).Account+"&time_type="+this.form.TimeType+"&return_type="+this.form.ReturnType;
					window.location.href=url;
				}
			},
			search() {  //搜索
				this.ispage = false;
				this.$nextTick(() => {
					this.page = 1;
					this.getlist();
					this.ispage = true;
				});
			},
			getlist() {  //获取列表
				let params = {
					Page: this.page,
					PageSize: this.pageSize,
					UserAccount: this.form.UserAccount,
					UserName: this.form.UserName,
					OrderNumber: this.form.OrderNumber,
					State: this.form.State,
					Source:this.form.Source,
					TimeType:this.form.TimeType,
					VerifyType:this.form.VerifyType,
					ReturnType:this.form.ReturnType || null,
					Channel:this.form.Channel || 0
				};
				if(!this.form.dateValue) {
					params.StartTime = "";
					params.EndTime = "";
				} else {
					if( this.form.TimeType==4 ){
						params.StartTime = this.form.dateValue[0];
						params.EndTime = this.form.dateValue[1];
					}else{
						params.StartTime = this.form.dateValue[0] + " 00:00:00";
						params.EndTime = this.form.dateValue[1] + " 23:59:59";
					}
				}
				this.listLoading = true;
				repaymentlist(params).then(res => {
					if(res.Ret == 200) {
						this.total = res.Result.UserSum;
						this.TotalReturnMoney = res.Result.TotalReturnMoney;
						this.TotalReturnCapitalAmount = res.Result.TotalReturnCapitalAmount;
						this.TotalReturnTaxAmount = res.Result.TotalReturnTaxAmount;
						this.TotalOthersMoney = res.Result.TotalOthersMoney;
						this.NumPersonLoan = res.Result.NumPersonLoan;
						this.NumSystemLoan = res.Result.NumSystemLoan;
						this.DefaultChannels=res.Result.DefaultChannels || [];
						this.tableData = res.Result.List || [];
						this.SourceArr=res.Sources || [];
						this.listLoading = false;
					}
				});
			},
			handleCurrentChange(current) {  //分页页码跳转
				this.page = current;
				this.getlist();
			},
			handleSizeChange(val) {  //分页页码改变
				this.pageSize = val;
				this.getlist();
			},
			viewdetails(id) { //查看详情
				sessionStorage.setItem("repaylist", true);
//					this.$router.push({
//						path: "/authuserdtl/" + id
//					});
				let {href} = this.$router.resolve({path:`/authuserdtl/${id}`});
				window.open(href,'_blank');
			},
			renderHeader1(h,{column,$index}){	//订单号
				return h("div",{attrs:{style:"padding:0;"}},[
			        h("span",column.label),
			        h('el-tooltip',{props:{placement:'top',content:'系统内订单编号。'}},
						[ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
					)
			    ]);
			},
			renderHeader2(h,{column,$index}){	//流水号
				return h("div",{attrs:{style:"padding:0;"}},[
			        h("span",column.label),
			        h('el-tooltip',{props:{placement:'top',content:'第三方支付订单编号。'}},
						[ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
					)
			    ]);
			}
		}
	};
</script>

<style lang="scss">
	#repaylist{
		.header .el-form-item{ margin-bottom:0; }
		.el-card__header{ padding-bottom:10px; }
		.el-form-item--mini.el-form-item,.el-form-item--small.el-form-item{ margin-bottom:10px; }
	}
</style>