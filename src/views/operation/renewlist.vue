<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent size="mini">
					<el-form-item label="手机">
						<el-input v-model="form.UserAccount" placeholder="请输入" clearable style="width:125px;"></el-input>
					</el-form-item>
					<el-form-item label="姓名">
						<el-input v-model="form.UserName" placeholder="请输入" clearable style="width:125px;"></el-input>
					</el-form-item>
					<el-form-item label="时间">
						<el-date-picker v-model="form.dateValue" type="daterange" :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:235px;"></el-date-picker>
					</el-form-item>
					<el-form-item label="渠道">
						<el-select v-model="form.Source" clearable filterable placeholder="请输入渠道" style="width:150px;">
					    	<el-option v-for="item in SourceArr" :key="item.Value" :label="item.Label" :value="item.Label"> </el-option>
					  	</el-select>
					</el-form-item>
					<el-form-item label="续期方式">
						<el-select v-model="form.Channel" clearable placeholder="请选择" style="width:125px;">
							<el-option v-for="(item,index) in DefaultChannels" :key="index" :label="item.Description" :value="item.DiyCode"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="续期期限">
						<el-select v-model.number="form.RenewDay" clearable placeholder="请选择" style="width:85px;">
						    <el-option v-for="(item,index) in DefaultRenewDays" :key="index" :label="item.Label+'天'" :value="item.Value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="状态">
						<el-select v-model="form.State" clearable placeholder="请选择" style="width:105px;">
							<el-option label="成功" value="SUCCESS"></el-option>
							<el-option label="失败" value="FAIL"></el-option>
							<el-option label="处理中" value="CONFIRM"></el-option>
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
					<el-table-column prop="Account" label="手机" min-width="88"></el-table-column>
					<el-table-column prop="Verifyrealname" label="姓名"></el-table-column>
					<el-table-column label="续期时间" prop="CreateTime" min-width="125"></el-table-column>
					<el-table-column label="续期本金(元)" prop="Money"></el-table-column>
					<el-table-column label="续期总费用" prop="PayMoney" :render-header="renderHeader1" min-width="105"></el-table-column>
					<el-table-column label="续期服务费" prop="VipFee"></el-table-column>
					<el-table-column label="结清利息" prop="InterestFee"></el-table-column>
					<el-table-column label="续期手续费" prop="ProcedureFee"></el-table-column>
					<el-table-column label="续期期限">
						<template slot-scope="scope">{{scope.row.RenewDay}}天</template>
					</el-table-column>
					<el-table-column label="续期方式" prop="ChannelString">
						<!--<template slot-scope="scope">{{scope.row.Channel==3?'合利宝':scope.row.Channel==8?'畅捷':''}}</template>-->
					</el-table-column>
					<el-table-column label="订单号" prop="OrderNumber" min-width="200"></el-table-column>
					<el-table-column label="续期结果" prop="State" min-width="120">
						<template slot-scope="scope">
							<span v-if="scope.row.State=='CONFIRM'" style="color:#1d9fff;">支付结果确认中</span>
							<span v-else-if="scope.row.State=='SUCCESS'" style="color:#333;">成功</span>
							<span v-else><span style="color:red;">失败</span><span style="float:right; color:#999; font-size:12px;">{{scope.row.FailReason}}</span></span>
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
					合计：续期本金 <label class="editwordSty">{{TotalData.TotalMoney}}</label> &nbsp;&nbsp;&nbsp; 
					续期总费用 <label class="editwordSty">{{TotalData.TotalPayMoney}}</label> &nbsp;&nbsp;&nbsp; 
					续期服务费 <label class="editwordSty">{{TotalData.TotalVipFee}}</label> &nbsp;&nbsp;&nbsp; 
					结清利息 <label class="editwordSty">{{TotalData.TotalInterestFee}}</label> &nbsp;&nbsp;&nbsp; 
					续期手续费  <label class="editwordSty">{{TotalData.TotalProcedureFee}}</label>
				</span>
				<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
			</el-col>
		</el-card>
	</div>
</template>

<script>
	import http from "../../api/http.js";
	import {renewlist,buttonctl} from "api/api.js";
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
				SourceArr:[],//渠道集合
				DefaultChannels:[],
				DefaultRenewDays:[],
				TotalData:{},
				form: {
					UserAccount: "", //手机号
					UserName: "", //用户姓名
					RenewDay: null, //订单号
					Channel: null, //还款方式
					State: "", //状态
					Source:"",
					dateValue: [http.dateFormatter(new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000),false),http.dateFormatter(new Date(), false)]
				}
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
		   			this.$message.error("续期时间不得为空！");
					return false;
				}
		   		let url=process.env.API_ROOT+"/export/renewdataexportexcel?start_time="+this.form.dateValue[0]+" 00:00:00&end_time="+this.form.dateValue[1]+" 23:59:59&merchant="+JSON.parse( sessionStorage.getItem('userDtl') ).Merchant+"&user_account="+this.form.UserAccount+"&user_name="+this.form.UserName+"&state="+this.form.State+"&channel="+this.form.Channel+"&source="+this.form.Source+"&account="+JSON.parse( sessionStorage.getItem('userDtl') ).Account;
				window.location.href=url;
		   	},
			search() {  //搜索
				this.ispage = false;
				this.$nextTick(() => {
					this.page = 1;
					this.getlist();
					this.ispage = true;
				});
			},
			getlist() {  //获取回款管理列表
				let params = {
					Page: this.page,
					PageSize: this.pageSize,
					UserAccount: this.form.UserAccount,
					UserName: this.form.UserName,
					RenewDay: this.form.RenewDay,
					State: this.form.State,
					Source:this.form.Source
				};
				if(!this.form.dateValue) {
					params.StartTime = "";
					params.EndTime = "";
				} else {
					params.StartTime = this.form.dateValue[0] + " 00:00:00";
					params.EndTime = this.form.dateValue[1] + " 23:59:59";
				}
				if(this.form.Channel == null || this.form.Channel == '') {
					params.Channel = 0;
				} else {
					params.Channel = parseInt(this.form.Channel);
				}
				if(this.form.RenewDay == null || this.form.RenewDay == '') {
					params.RenewDay = 0;
				} else {
					params.RenewDay = parseInt(this.form.RenewDay);
				}
				this.listLoading = true;
				renewlist(params).then(res => {
					console.log(res);
					if(res.Ret != 200) {
						return false;
					}
					this.total = res.Result.UserSum;
					this.tableData = res.Result.List || [];
					this.SourceArr=res.Sources || [];
					this.DefaultChannels=res.Result.DefaultChannels || [];
					this.DefaultRenewDays=res.Result.DefaultRenewDays || [];
					this.TotalData=res.Result.TotalData || {};
					this.listLoading = false;
				});
			},
			renderHeader1(h,{column,$index}){	//续期总费用
				return h("div",{attrs:{style:"padding:0;"}},[
			        h("span",column.label),
			        h('el-tooltip',{props:{placement:'top',content:'续期总费用为续期服务费、结清利息、续期手续费之和。'}},
						[ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
					)
			    ]);
			},
			handleCurrentChange(current) {  //分页页码跳转
				this.page = current;
				this.getlist();
			},
			handleSizeChange(val) {  //分页页码改变
				this.pageSize = val;
				this.getlist();
			},
			viewdetails(id) {  //查看详情
//				this.$router.push({
//					path: "/authuserdtl/" + id
//				});
				let {href} = this.$router.resolve({path:`/authuserdtl/${id}`});
				window.open(href,'_blank');
			}
		}
	};
</script>

<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
</style>