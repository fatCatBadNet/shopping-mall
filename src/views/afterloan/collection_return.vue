<template>
	<div style="padding-bottom:80px;" id="collectionreturn">
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent size="mini">
					<el-form-item label="手机">
						<el-input v-model="form.UserAccount" placeholder="请输入手机号" clearable style="width:120px;"></el-input>
					</el-form-item>
					<el-form-item label="姓名">
						<el-input v-model="form.UserName" placeholder="请输入姓名" clearable style="width:110px;"></el-input>
					</el-form-item>
					<el-form-item label="渠道">
						<el-select v-model="form.Source" placeholder="请选择渠道" clearable filterable style="width:100px;">
							<el-option v-for="(item,index) in Sources" :key="index" :label="item.Label" :value="item.Label"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="到期时间">
						<el-date-picker v-model="form.dateValue" type="daterange"   :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:205px;"></el-date-picker>
					</el-form-item>
					<el-form-item label="逾期天数">
						<el-select v-model="form.OverdueDays" placeholder="请选择逾期天数" clearable filterable style="width:100px;">
							<el-option v-for="(item,index) in OverDays" :key="index" :label="'逾期'+item+'天'" :value="item"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="结清时间">
						<el-date-picker v-model="form.fDateValue" type="daterange"   :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:205px;"></el-date-picker>
					</el-form-item>
					<el-form-item label="催收员">
						<el-select v-model="form.CollectionName" placeholder="请选择催收员" clearable style="width:120px;">
							<el-option v-for="item in CollectionInfo" :key="item.Id" :label="item.AllowUserName" :value="item.AllowUserName"></el-option>
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
				<el-table :data="tableData" ref="multipleTable" v-loading="listLoading" element-loading-text="数据加载中..." border @selection-change="selectchange">
					<el-table-column v-if="isSelects" type="selection" width="60"></el-table-column>
					<el-table-column prop="Account" label="手机" min-width="120"></el-table-column>
					<el-table-column prop="Verifyrealname" label="姓名" min-width="100"></el-table-column>
					<el-table-column label="借款金额">
						<template slot-scope="scope">
							<span>{{scope.row.Money}} 元</span>
						</template>
					</el-table-column>
					<el-table-column label="渠道" prop="Source" min-width="100"></el-table-column>
					<el-table-column label="到期时间" prop="LoanReturnDate" min-width="100"></el-table-column>
					<el-table-column label="结清时间" prop="FinishDate" min-width="100"></el-table-column>
					<el-table-column label="逾期天数" min-width="100">
						<template slot-scope="scope">
							<span>{{scope.row.OverdueDays}} 天</span>
						</template>
					</el-table-column>
					<el-table-column prop="ReturnMoney" label="结清金额"></el-table-column> 
					<el-table-column prop="OverMoney" label="逾期费用"></el-table-column>
					<el-table-column prop="CostMoney" label="费用减免" min-width="160"></el-table-column>
					<el-table-column prop="CollectName" label="催收员"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="primary" plain size="mini" @click="viewdetails(scope.row.Uid)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
				<span style="font:14px/32px '微软雅黑';">
					合计：借款金额 <label class="editwordSty">{{Moneys}}</label> &nbsp;&nbsp;&nbsp; 
					结清金额 <label class="editwordSty">{{ReturnMoneys}}</label>&nbsp;&nbsp;&nbsp; 
					逾期费用 <label class="editwordSty">{{OverMoneys}}</label>&nbsp;&nbsp;&nbsp; 
					费用减免 <label class="editwordSty">{{CostMoneys}}</label>
				</span>
				<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
			</el-col>
		</el-card>
	</div>
</template>

<script>
	import http from "../../api/http.js";
	import { collectionreturnlist,buttonctl } from "api/api.js";
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
				pageCount: 1,
				ispage: true,
				listLoading: false,
				tableData: [],
				CollectionInfo:[],
				Sources:[],
				OverDays:[],
				form: {
					UserAccount: "", //手机号
					UserName: "", //用户姓名
					CollectionName: "", //催收员
					Source:"",//渠道
					OverdueDays:"",//逾期天数
					ActionType: "", //行动分类
					MinOverdueDays:null, //开始逾期天数
					MaxOverdueDays:null, //结束逾期天数
					dateValue: [http.dateFormatter(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),false),http.dateFormatter(new Date(), false)],
					fDateValue:''
				}
			};
		},
		mounted() {
			this.getcollectionlist();
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
		   			this.$message.error("到期时间不得为空！");
					return false;
				}
		   		if( !this.form.fDateValue ){
		   			this.$message.error("结清时间不得为空！");
					return false;
				}
		   		let url=process.env.API_ROOT+"/export/collectionbacklisttoexcel?start_time="+this.form.dateValue[0]+" 00:00:00&end_time="+this.form.dateValue[1]+" 23:59:59&start_finish_date="+this.form.fDateValue[0]+" 00:00:00&end_finish_date="+this.form.fDateValue[1]+" 23:59:59&merchant="+JSON.parse( sessionStorage.getItem('userDtl') ).Merchant+"&user_account="+this.form.UserAccount+"&user_name="+this.form.UserName+"&source="+this.form.Source+"&collection_name="+this.form.CollectionName+"&account="+JSON.parse( sessionStorage.getItem('userDtl') ).Account;
				window.location.href=url;
		   	},
			search() { //搜索
				this.ispage = false;
				this.$nextTick(() => {
					this.page = 1;
					this.getcollectionlist();
					this.ispage = true;
				});
			},
			getcollectionlist() { //获取催收列表
				let params = {
					Page: this.page,
					PageSize: this.pageSize,
					UserAccount: this.form.UserAccount,
					UserName: this.form.UserName,
					Source: this.form.Source,
					OverdueDays:this.form.OverdueDays === ''?  -1 : this.form.OverdueDays,
					CollectionName: this.form.CollectionName,
				};
				if(!this.form.dateValue) {
					params.StartTime = "";
					params.EndTime = "";
				} else {
					params.StartTime = this.form.dateValue[0] + " 00:00:00";
					params.EndTime = this.form.dateValue[1] + " 23:59:59";
				}
				if(!this.form.fDateValue) {
					params.StartFinishDate = "";
					params.EndFinishDate = "";
				} else {
					params.StartFinishDate = this.form.fDateValue[0] + " 00:00:00";
					params.EndFinishDate = this.form.fDateValue[1] + " 23:59:59";
				}
				this.listLoading = true;
				collectionreturnlist(params).then(res => {
					console.log(res);
					if(res.Ret != 200) {
						return false;
					}
					this.total = res.Result.UserSum;
					if( res.CollectionInfo ){
						this.CollectionInfo=res.CollectionInfo;
					}else{
						this.CollectionInfo=[];
					}
					this.Sources=res.Sources || [];
					if( res.OverDays ){
						this.OverDays=res.OverDays;
					}else{
						this.OverDays=[];
					}
					this.Moneys=res.Data.Moneys;
					this.ReturnMoneys=res.Data.ReturnMoneys;
					this.OverMoneys=res.Data.OverMoneys;
					this.CostMoneys=res.Data.CostMoneys;
					
					if(res.Result.List == null) {
						this.tableData = [];
					} else {
						this.tableData = res.Result.List;
						this.pageCount = Math.ceil(this.total / this.pageSize);
					}
					this.listLoading = false;
				});
			},
			handleCurrentChange(current) {  //分页页码跳转
				this.page = current;
				this.getcollectionlist();
			},
			handleSizeChange(val) {  //分页页码改变
				this.pageSize = val;
				this.getcollectionlist();
			},
			viewdetails(uid) {  //查看详情
//				this.$router.push({
//					path: "/authuserdtl/" + uid
//				});
				let {href} = this.$router.resolve({path:`/authuserdtl/${uid}`});
				window.open(href,'_blank');
			}
		}
	};
</script>

<style lang="scss">
	#collectionreturn{
		.el-card__header{ padding-bottom:0px; }
		.el-form-item--mini.el-form-item,.el-form-item--small.el-form-item{ margin-bottom:10px; }
	}
</style>