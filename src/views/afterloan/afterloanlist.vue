<template>
	<div id="afterloanlist">
		<el-card class="box-card">
			<div slot="header" class="header" style="position: relative;">
				<el-form :inline="true" :model="form" @submit.native.prevent size="mini">
					<el-form-item label="到期时间">
						<el-date-picker v-model="form.dateValue" type="daterange"   :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:240px;"></el-date-picker>
					</el-form-item>
					<el-form-item label="手机">
						<el-input v-model="form.UserAccount" placeholder="请输入手机号" clearable style="width:140px;"></el-input>
					</el-form-item>
					<el-form-item label="姓名">
						<el-input v-model="form.UserName" placeholder="请输入姓名" clearable style="width:140px;"></el-input>
					</el-form-item>
					<el-form-item label="渠道">
						<el-select v-model="form.Source" placeholder="请选择渠道" clearable filterable style="width:140px;">
							<el-option v-for="(item,index) in Sources" :key="index" :label="item.Label" :value="item.Label"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核类型">
						<el-select v-model="form.VerifyType" placeholder="请选择审核类型" filterable style="width:140px;">
							<el-option  label="全部" :value="0"></el-option>
							<el-option  label="系统自动放款" :value="-1"></el-option>
							<el-option  label="人工审核放款" :value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="逾期天数">
						<el-input v-model.number="form.MinOverdueDays" clearable style="width:60px;"></el-input> &nbsp;-
						<el-input v-model.number="form.MaxOverdueDays" clearable style="width:60px;"></el-input>
					</el-form-item>
					<el-form-item>
						<!--<el-input v-model="form.AllowUserName" placeholder="催收员" clearable style="width:140px;"></el-input>-->
						<el-select v-model="form.AllowUserName" placeholder="请选择催收员" clearable style="width:140px;">
							<el-option v-for="item in CollectionInfo" :key="item.Id" :label="item.AllowUserName" :value="item.AllowUserName"></el-option>
						</el-select>
					</el-form-item>
					<!-- <el-form-item >
						<el-select v-model="form.Mtype" clearable placeholder="逾期阶段" style="width:120px;">
						    <el-option label="s1" :value="1"></el-option>
						    <el-option label="s2" :value="2"></el-option>
						</el-select>
					</el-form-item> -->
					<el-form-item>
						<el-select v-model="form.ActionType" clearable placeholder="催收行动分类" style="width:140px;">
						  	<el-option label="行动分类" value=""></el-option>
                            <el-option label="无" value="未处理"></el-option>
                            <el-option label="跟进" value="跟进"></el-option>
                            <el-option label="承诺" value="承诺"></el-option>
                            <el-option label="续期" value="续期"></el-option>
                            <el-option label="谈判" value="谈判"></el-option>
                            <el-option label="跳票" value="跳票"></el-option>
                            <el-option label="中本人" value="中本人"></el-option>
                            <el-option label="中家人" value="中家人"></el-option>
                            <el-option label="中第三方" value="中第三方"></el-option>
                            <el-option label="失联" value="失联"></el-option>
                            <el-option label="死亡" value="死亡"></el-option>
                            <el-option label="盗办" value="盗办"></el-option>
                            <el-option label="坐牢" value="坐牢"></el-option>
                            <el-option label="争议" value="争议"></el-option>
                            <el-option label="暂停" value="暂停"></el-option>
                            <el-option label="留案" value="留案"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="mini" @click="search">搜索</el-button>
					</el-form-item>
					<el-form-item v-if="ExportButton">
						<el-button type="primary" size="mini" @click="exportexcel">导出</el-button>
					</el-form-item>
					<el-form-item v-if="isallot">
						<el-button type="primary" size="mini" @click="isSelects=true">分配</el-button>
					</el-form-item>
					<!-- <el-form-item>
						<el-tooltip v-if="showAIButton" class="robot_tooltip" effect="dark" content="AI智能语音机器人介绍" placement="top">
							<el-button @click="handleView" style="padding:5px;">
								<i class="fa fa-android fa-lg" aria-hidden="true" style="vertical-align: text-top;"></i> 
							</el-button>
						</el-tooltip>
					</el-form-item> -->
				</el-form>
			</div>
			<template>
				<el-table :data="tableData" ref="multipleTable" v-loading="listLoading" element-loading-text="数据加载中..." border @select="handleSelect" @select-all="handleSelectAll">
					<el-table-column v-if="isSelects" type="selection" width="60"></el-table-column>
					<el-table-column prop="Account" label="手机" min-width="120"></el-table-column>
					<el-table-column prop="Verifyrealname" label="姓名" min-width="180">
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.Verifyrealname}}</span>
	  	    		        <span v-if="scope.row.LoanFinishCount" style="float:right; width:69px; text-align:center; font-size:12px; color:#8BC34A; border-radius:4px;">已还款{{scope.row.LoanFinishCount}}次</span>
	  	    		        <span v-if="scope.row.RenewCount" style="float:right; padding:0 2px; text-align:center; font-size:12px; color:#FF9800; border-radius:4px;">续期{{scope.row.RenewCount}}次</span>
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
						</template>
					</el-table-column>
					<el-table-column label="渠道" prop="Source" min-width="100"></el-table-column>
					<el-table-column label="到期时间" prop="LoanReturnDate" min-width="100"></el-table-column>
					<el-table-column label="逾期天数" min-width="100">
						<template slot-scope="scope">
							<span>{{scope.row.OverdueDays}} 天</span>
						</template>
					</el-table-column>
					<!-- <el-table-column prop="Mtype" label="催收阶段" ></el-table-column> -->
					<el-table-column prop="ActionType" label="催收行动分类" min-width="100"></el-table-column>
					<el-table-column prop="HandleTime" label="最近催记时间" min-width="160"></el-table-column>
					<el-table-column prop="CollectName" label="催收员"></el-table-column>
					<el-table-column label="备注" min-width="200">
						<template slot-scope="scope">
							<span>{{scope.row.Remark}}</span>
							<span v-if="scope.row.CompositeDate" style="float:right; color:#999; font-size:12px;">复核时间：{{scope.row.CompositeDate}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="primary" plain size="mini" @click="viewdetails(scope.row.Uid,scope.row.LoanId)">处理</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
				<span style="font:14px/32px '微软雅黑';">
					合计：借款金额 <label class="editwordSty">{{TotalMoney}}</label> &nbsp;&nbsp;&nbsp; 
					待还金额 <label class="editwordSty">{{TotalNoReturnMoney}}</label>&nbsp;&nbsp;&nbsp; 
					已还金额 <label class="editwordSty">{{TotalReturnMoney}}</label>&nbsp;&nbsp;&nbsp; 
					到账金额 <label class="editwordSty">{{TotalRealMoney}}</label>&nbsp;&nbsp;&nbsp;
					机审订单 <label class="editwordSty">{{NumSystemLoan}}条</label>&nbsp;&nbsp;&nbsp;
					人工审核 <label class="editwordSty">{{NumPersonLoan}}条</label>
				</span>
				<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
			</el-col>
		</el-card>
		<div v-if="editForm.LoanIds.length>0" style="height:80px; background:#fff; text-align:center; font:16px/80px '微软雅黑'; box-shadow:0 0 10px #ddd; position:fixed; bottom:20px; right:35px; left:165px; z-index:10;">
			<label style="color:#999;">已选择 &nbsp;<b class="editwordSty">{{editForm.LoanIds.length}}</b>条</label>
			<el-button type="primary" size="medium" @click="showDialog=true" style="margin:0 20px;">立即分配</el-button>
			<el-button type="primary" plain size="medium" @click="cancelSelect" style="margin:0 20px;">取消分配</el-button>
		</div>
		<!-- 批量分配弹框 -->
		<el-dialog title="批量分配" :visible.sync="showDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="400px">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="分配给">
					<el-select v-model="editForm.CollectionInfo.Id" placeholder="请选择催收人员" value-key="label" @change="changeInfo">
						<el-option v-for="item in CollectionInfo" :key="item.Id" :label="item.AllowUserName" :value="item.Id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="editSubmit">确定</el-button>
				<el-button @click.native="showDialog=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import http from "../../api/http.js";
	import { collectionlist,collectionallow,buttonctl,aiexplain } from "api/api.js";
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
				showAIButton:false,
				ExportButton:false,
				isSelects:false,
				page:1,
				total:0,
				pageSize:15,
				ispage:true,
				listLoading:false,
				tableData:[],
				CollectionInfo:[],
				Sources:[],
				form: {
					UserAccount: "", //手机号
					UserName: "", //用户姓名
					AllowUserName: "", //催收员
					Source:"",//渠道
					VerifyType:0,//审核类型
					// Mtype:null,//催收阶段
					ActionType: "", //行动分类
					MinOverdueDays: null, //开始逾期天数
					MaxOverdueDays: null, //结束逾期天数
					dateValue: [http.dateFormatter(new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000),false),http.dateFormatter(new Date(), false)]
				},
				isallot:false,  //批量分配按钮权限
				TotalMoney:"",
				TotalNoReturnMoney: "",
				TotalReturnMoney: "",
				TotalRealMoney: "",
				NumPersonLoan: "",
				NumSystemLoan: "",
				showDialog:false,
				editForm:{
					LoanIds:[],  //选中id数组
					CollectionInfo:{
						"AllowUserName":"",
					    "Id":null,
					    "OrgId":null
					}
				},
				successlogo: require("../../assets/img/success.png"),
				continuelogo: require("../../assets/img/continue.png"),
				failllogo: require("../../assets/img/faill.png")
			};
		},
		mounted() {
			this.getcollectionlist();
			buttonctl({}).then((res) => {  //催收按钮权限控制
				console.log(res);
				this.isallot=false;
				if( res.Ret==200 && res.AllCtl.CollectionDistribution ){
					this.isallot=res.AllCtl.CollectionDistribution;
				}
				this.ExportButton=false;
				if( res.Ret==200 && res.AllCtl.ExportButton ){
					this.ExportButton=res.AllCtl.ExportButton;
				}
			});
			this.getAiExplain();
		},
		methods: {
			getAiExplain(){
				aiexplain({}).then(res=>{
					if(res.Ret != 200) {
						return false;
					}
					this.showAIButton = res.Switch;
				})
			},
			handleView(){
				let {href} = this.$router.resolve({path:`/robotIntroduction`});
				window.open(href,'_blank');
			},
			exportexcel(){  //导出数据
		   		if( !this.form.dateValue ){
		   			this.$message.error("到期时间不得为空！");
					return false;
				}
		   		let url=process.env.API_ROOT+"/export/collectionlisttoexcel?start_time="+this.form.dateValue[0]+" 00:00:00&end_time="+this.form.dateValue[1]+" 23:59:59&merchant="+JSON.parse( sessionStorage.getItem('userDtl') ).Merchant+"&account="+JSON.parse( sessionStorage.getItem('userDtl') ).Account+"&user_account="+this.form.UserAccount+"&user_name="+this.form.UserName+"&action_type="+this.form.ActionType+"&allow_user_name="+this.form.AllowUserName+"&source="+this.form.Source+"&verify_type="+this.form.VerifyType+"&min_overdue_days="+this.form.MinOverdueDays+"&max_overdue_days="+this.form.MaxOverdueDays;
				window.location.href=url;
		   	},
			getUids(val){  //单选、全选分配数据处理
				let newArr = [];
				for(let i=0;i<val.length;i++){
					newArr.push(val[i].LoanId);
				}
				return newArr;
			},
			handleSelect(secection,row){  //单选操作
				console.log(secection,row);
				if( secection.indexOf(row)<=-1 ){
					this.editForm.LoanIds = this.getUids(secection);
				}else{
					if( row.CollectName!='' ){
						this.$confirm('当前选中的订单是已分配的，是否重新分配?（'+row.Verifyrealname+'）','提示',{
                            type:'warning'
                        }).then(() => {
							console.log(this.getUids(secection));
							this.editForm.LoanIds = this.getUids(secection);
                        }).catch(() => { 
							this.$refs.multipleTable.toggleRowSelection(row,false);
							this.editForm.LoanIds = this.getUids(secection);
                        });
					}else{
						this.editForm.LoanIds = this.getUids(secection);
					}
				}
			},
			handleSelectAll(secection){  //全选操作
			 	console.log(secection);
			 	if( secection.length<=0 ){
			 		this.editForm.LoanIds = [];
			 		return false;
			 	}
			 	secection.forEach(item=>{
			 		if( item.CollectName!='' ){
						this.$confirm('选中的订单中包含已分配的案件，是否重新分配?','提示',{
                            type:'warning'
                        }).then(() => {
							console.log(this.getUids(secection));
							this.editForm.LoanIds = this.getUids(secection);
                        }).catch(() => { 
							this.$refs.multipleTable.clearSelection();
							this.editForm.LoanIds = [];
                        });
					}else{
						this.editForm.LoanIds = this.getUids(secection);
					}
			 	});
			},
			cancelSelect(rows){  //取消分配
			    this.$refs.multipleTable.clearSelection();
			    this.editForm.LoanIds=[];
				this.isSelects=false;
			},
			changeInfo(){  //下拉选数据处理
				this.CollectionInfo.forEach(item=>{
					if( item.Id==this.editForm.CollectionInfo.Id ){
						this.editForm.CollectionInfo.AllowUserName=item.AllowUserName;
						this.editForm.CollectionInfo.OrgId=item.OrgId;
					}
				});
			},
			editSubmit(){  //催收分配
				if( this.editForm.CollectionInfo.Id==null ){
					this.$message.error( "请选择催收人员！" );
					return false;
				}
				collectionallow(this.editForm).then(res => {
					console.log(res);
					if(res.Ret == 200) {
						this.$message.success( res.Msg );
						this.showDialog=false;
						this.getcollectionlist();
					}
				});
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
					AllowUserName: this.form.AllowUserName,
					Source: this.form.Source,
					VerifyType: this.form.VerifyType,
					// Mtype:this.form.Mtype,
					ActionType: this.form.ActionType,
					MinOverdueDays: parseInt(this.form.MinOverdueDays),
					MaxOverdueDays: parseInt(this.form.MaxOverdueDays)
				};
				if(!this.form.dateValue) {
					params.StartTime = "";
					params.EndTime = "";
				} else {
					params.StartTime = this.form.dateValue[0] + " 00:00:00";
					params.EndTime = this.form.dateValue[1] + " 23:59:59";
				}
				this.listLoading = true;
				collectionlist(params).then(res => {
					console.log(res);
					if(res.Ret != 200) {
						return false;
					}
					this.total = res.Result.UserSum;
					this.TotalMoney = res.Result.TotalMoney;
					this.TotalNoReturnMoney = res.Result.TotalNoReturnMoney;
					this.TotalReturnMoney = res.Result.TotalReturnMoney;
					this.TotalRealMoney = res.Result.TotalRealMoney;
					this.NumPersonLoan = res.Result.NumPersonLoan;
					this.NumSystemLoan = res.Result.NumSystemLoan;
					if( res.CollectionInfo ){
						this.CollectionInfo=res.CollectionInfo;
					}else{
						this.CollectionInfo=[];
					}
					this.Sources=res.Sources || [];
					if(res.Result.List == null) {
						this.tableData = [];
					} else {
						this.tableData = res.Result.List;
					}
					this.listLoading = false;
					this.isSelects=false;
					this.editForm.LoanIds=[];
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
			viewdetails(Uid, LoanId) {  //查看详情
// 				this.$router.push({
// 					path: "/collectiondtl/" + Uid + "/" + LoanId
// 				});
				let {href} = this.$router.resolve({path:`/collectiondtl/${Uid}/${LoanId}`});
				window.open(href,'_blank');
			}
			
		}
	};
</script>

<style lang="scss">
	#afterloanlist{ padding-bottom:80px;
		.header .el-form-item{ margin-bottom:0; }
		.el-card__header{ padding-bottom:10px; }
		.el-form-item--mini.el-form-item,.el-form-item--small.el-form-item{ margin-bottom:10px; }
		.robot_tooltip{ cursor:pointer; padding:5px; margin-left:10px; }
		.robot_tooltip:hover{ color:#409EFF; }
	}
</style>