<template>
	<div style="padding-bottom:80px;" id="creditlist">
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent size="mini">
					<el-form-item label="申请">
						<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:215px;"></el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-input v-model="form.UserAccount" placeholder="手机号" clearable style="width:110px;"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input v-model="form.UserName" placeholder="姓名" clearable style="width:100px;"></el-input>
					</el-form-item>
					<el-form-item label="">
						<el-select v-model="form.Source" clearable filterable placeholder="请选择渠道" style="width:110px;">
					    	<el-option v-for="item in SourceArr" :key="item.Value" :label="item.Label" :value="item.Label"> </el-option>
					  	</el-select>
					</el-form-item>
					<el-form-item label="建议结果">
						<el-select v-model="form.FkAdviceResult" placeholder="请选择" clearable style="width:120px;">
                            <el-option label="系统处理中" value="null"></el-option>
                            <el-option label="通过" value="PASS"></el-option>
                            <el-option label="关闭7天" value="REFUSE7"></el-option>
                            <el-option label="关闭30天" value="REFUSE30"></el-option>
                            <el-option label="永久关闭" value="REFUSEALL"></el-option>
                            <el-option label="人工审核" value="SOURCEMANUAL"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核结果">
						<el-select v-model="form.InitAudit" placeholder="请选择" clearable style="width:120px;">
                            <el-option label="通过" :value="4"></el-option>
                            <el-option label="关闭7天" :value="7"></el-option>
                            <el-option label="关闭30天" :value="30"></el-option>
                            <el-option label="永久关闭" :value="5"></el-option>
						</el-select>
					</el-form-item>
                    <el-form-item label="审核">
						<el-date-picker v-model="form.dateValue2" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:215px;"></el-date-picker>
					</el-form-item>
                    <el-form-item label="审核人员">
						<el-select v-model="form.Oper" placeholder="请选择" clearable style="width:100px;">
                            <el-option v-for="(item, index) in CreditInfoArr" :label="item.AllowUserName" :value="item.AllowUserName" :key="index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="分配筛选">
						<el-select v-model="form.IsLoanAllow" placeholder="请选择" clearable style="width:90px;">
                            <el-option label="未分配" :value="1"></el-option>
                            <el-option label="已分配" :value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="mini" @click="search">搜索</el-button>
					</el-form-item>
					<el-form-item>
						<el-tooltip class="item" effect="dark" content="只能分配人工审核的订单" placement="bottom">
					    	<el-button type="primary" size="mini" @click="isSelects=true">分配</el-button>
					    </el-tooltip>
					</el-form-item>
				</el-form>
			</div>
			<template>
				<el-table :data="tableData" ref="multipleTable" v-loading="listLoading" element-loading-text="数据加载中..." border @select="handleSelect" @select-all="handleSelectAll">
					<el-table-column v-if="isSelects" type="selection" width="60" :selectable='checkboxT'></el-table-column> 
					<el-table-column prop="Phone" label="手机" min-width="120"></el-table-column>
					<el-table-column label="姓名" >
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.Name}}</span>
	  	    		        <!-- <span v-if="scope.row.LoanFinishCount" style="float:right; width:75px; text-align:center; font-size:12px; color:#fff; background:#8BC34A; border-radius:4px; margin-left:4px;">第{{scope.row.LoanFinishCount}}次借款</span>
	  	    		        <span v-if="scope.row.RenewCount" style="float:right; width:55px; text-align:center; font-size:12px; color:#fff; background:#FF9800; border-radius:4px;">续期{{scope.row.RenewCount}}次</span>
							   -->
		  	    		</template>
					</el-table-column>
					<el-table-column prop="Source" label="注册渠道" min-width="150"></el-table-column>
					<el-table-column prop="ApplyDate" label="授信申请时间" min-width="150"></el-table-column>
					<el-table-column label="建议结果" min-width="130">
						<template slot-scope="scope">
							<span v-if="scope.row.FkAdviceResult=='PASS'">{{scope.row.FkAdviceBalance>0?"通过（"+scope.row.FkAdviceBalance+"元）":'通过'}}</span>
							<span v-else>{{scope.row.FkAdviceResult==""?"系统处理中":scope.row.FkAdviceResult=="REFUSE7"?"关闭7天":scope.row.FkAdviceResult=="REFUSE30"?"关闭30天":scope.row.FkAdviceResult=="REFUSEALL"?"永久关闭":scope.row.FkAdviceResult=="SOURCEMANUAL"?"人工审核":""}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="LetterResult" label="审核结果" min-width="130">
						<template slot-scope="scope">
							<span v-if="scope.row.InitAudit==0"></span>
							<span v-else-if="scope.row.InitAudit==4">通过（{{scope.row.Balance}}元）</span>
							<span v-else-if="scope.row.InitAudit==5">永久关闭</span>
							<span v-else-if="scope.row.InitAudit==7">关闭{{scope.row.CreditCloseDay}}天</span>
						</template>
					</el-table-column>
					<el-table-column prop="" label="审核时间" min-width="150">
						<template slot-scope="scope">
							<span v-if="scope.row.OperatorTime=='0001-01-01 00:00:00'"></span>
							<span v-else>{{scope.row.OperatorTime}}</span>
						</template>
					</el-table-column>
					<!-- <el-table-column prop="HandRemark" label="备注" min-width="140"></el-table-column> -->
					<el-table-column label="审核人员" min-width="120">
						<template slot-scope="scope">
							<!-- <div v-if="scope.row.FkAdviceResult!=''"> -->
								<span v-if="scope.row.IsLetter==0">系统</span>
								<span v-else-if="scope.row.IsLetter==1&&scope.row.CreditAllotId!=0">{{scope.row.CreditAllotName}}</span>
								<span v-else-if="scope.row.IsLetter==1&&scope.row.CreditAllotId==0"></span>
							<!-- </div> -->
						</template>
					</el-table-column>
					<el-table-column label="操作" min-width="120">
						<template slot-scope="scope">
                            <el-button type="primary" plain size="mini" @click="viewdetails(scope.row.Uid)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
				<!-- <span style="font:14px/32px '微软雅黑';"> 合计：借款金额 <label class="editwordSty">{{LoanAmount}}</label></span> -->
				<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
			</el-col>
		</el-card>
		<div v-if="editForm.CreditIds.length>0" style="height:80px; background:#fff; text-align:center; font:16px/80px '微软雅黑'; box-shadow:0 0 10px #ddd; position:fixed; bottom:20px; right:35px; left:165px; z-index:10;">
			<label style="color:#999;">已选择 &nbsp;<b class="editwordSty">{{editForm.CreditIds.length}}</b>条</label>
			<el-button type="primary" size="medium" @click="showDialog=true" style="margin:0 20px;">立即分配</el-button>
			<el-button type="primary" plain size="medium" @click="cancelSelect" style="margin:0 20px;">取消分配</el-button>
		</div>
		<!-- 批量分配弹框 -->
		<el-dialog title="批量分配" :visible.sync="showDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="400px">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="分配给">
					<el-select v-model="editForm.CreditInfo.Id" placeholder="请选择审核人员" value-key="label" @change="changeInfo">
						<el-option v-for="item in CreditInfoArr" :key="item.Id" :label="item.AllowUserName" :value="item.Id"></el-option>
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
	import {creditmanagerlist,creditallocate } from "api/api.js";
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
                CreditInfoArr:[],
				page:1,
				total:0,
				pageSize:15,
				ispage:true,
				listLoading:false,
				// LoanAmount:null,
				tableData:[],
				SourceArr:[],
				form: {
					UserAccount:'', //手机号
					UserName:'', //用户姓名
					FkAdviceResult:"",  //建议结果
					InitAudit:null, //审核结果
					Oper:'', //审核人员
                    dateValue:'', //申请时间
                    dateValue2:'', //审核时间
                    IsLoanAllow:null,  //审核状态
                    Source:''
				},
				isSelects:false,
				showDialog:false,
				editForm:{
					CreditIds:[],  //选中id数组
					CreditInfo:{
						"AllowUserName":"",
					    "Id":null,
					    "OrgId":null
					}
               	}
			};
		},
		mounted() {
            this.getlist();
		},
		methods: {
			search() { //搜索
				this.ispage = false;
				this.$nextTick(() => {
					this.page = 1;
					this.getlist();
					this.ispage = true;
				});
			},
            getlist() { //获取列表
				let params = {
					Page:this.page,
					PageSize:this.pageSize,
					UserAccount:this.form.UserAccount,
					UserName:this.form.UserName,
					FkAdviceResult:this.form.FkAdviceResult,
					InitAudit:this.form.InitAudit || 99,
					Oper:this.form.Oper,
					IsLoanAllow:this.form.IsLoanAllow || 0,
					Source:this.form.Source
				};
				if(!this.form.dateValue) {
					params.StartTime = "";
					params.EndTime = "";
				} else {
					params.StartTime = this.form.dateValue[0] + " 00:00:00";
					params.EndTime = this.form.dateValue[1] + " 23:59:59";
                }
                if(!this.form.dateValue2) {
					params.StartDate = "";
					params.EndDate = "";
				} else {
					params.StartDate = this.form.dateValue2[0] + " 00:00:00";
					params.EndDate = this.form.dateValue2[1] + " 23:59:59";
				}
                this.listLoading = true;
				creditmanagerlist(params).then(res => {
					if(res.Ret != 200) {
						return false;
					}
					this.total = res.Result.Sum;
					// this.LoanAmount = res.Result.LoanAmount;
					this.SourceArr=res.Sources || [];
					this.CreditInfoArr=res.CreditInfo || [];
					if(res.Result.List == null) {
						this.tableData = [];
					} else {
						this.tableData = res.Result.List;
					}
					this.listLoading = false;
					this.isSelects=false;
					this.editForm.CreditIds=[];
				});
			},
			checkboxT(row,index){
	    		if( row.IsLetter==1&&row.InitAudit==1&&row.FkAdviceResult!='' ){
	    			return true;
	    		}else{
	    			return false;
	    		}
	    	},
			handleCurrentChange(current) {  //分页页码跳转
				this.page = current;
				this.getlist();
			},
			handleSizeChange(val) {  //分页页码改变
				this.pageSize = val;
				this.getlist();
			},
		   	viewdetails(id){  //查看详情
				// this.$router.push({
				// 	path:"/riskmgrdtl/"+id
				// });
				let {href} = this.$router.resolve({path:`/riskmgrdtl/${id}`});
				window.open(href,'_blank');
		   	},
		   	getUids(val){  //勾选（单选、全选）时处理数据
				let newArr = [];
				for(let i=0;i<val.length;i++){
					newArr.push(val[i].Uid);
				}
				return newArr;
			},
			handleSelect(secection,row){  //单选
				console.log(secection,row);
				if( secection.indexOf(row)<=-1 ){
					this.editForm.CreditIds = this.getUids(secection);
				}else{
					if( row.IsLoanAllow ==2 ){
						this.$confirm('当前选中的订单是已分配的，是否重新分配?（'+row.Name+'）','提示',{
                            type:'warning'
                        }).then(() => {
							console.log(this.getUids(secection));
							this.editForm.CreditIds = this.getUids(secection);
                        }).catch(() => { 
							this.$refs.multipleTable.toggleRowSelection(row,false);
							this.editForm.CreditIds = this.getUids(secection);
                        });
					}else{
						this.editForm.CreditIds = this.getUids(secection);
					}
				}
			},
			handleSelectAll(secection){  //全选
			 	console.log(secection);
			 	if( secection.length<=0 ){
			 		this.editForm.CreditIds = [];
			 		return false;
			 	}
			 	secection.forEach(item=>{
			 		if( item.IsLoanAllow ==2 ){
						this.$confirm('选中的订单中包含已分配的，是否重新分配?','提示',{
                            type:'warning'
                        }).then(() => {
							console.log(this.getUids(secection));
							this.editForm.CreditIds = this.getUids(secection);
                        }).catch(() => { 
							this.$refs.multipleTable.clearSelection();
							this.editForm.CreditIds = [];
                        });
					}else{
						this.editForm.CreditIds = this.getUids(secection);
					}
			 	});
			},
			cancelSelect(rows){  //取消分配
				console.log(this.editForm.CreditIds);
		     	this.$refs.multipleTable.clearSelection();
		     	this.editForm.CreditIds = [];
			 	this.isSelects=false;
			},
			changeInfo(){  //下拉选数据处理
				this.CreditInfoArr.forEach(item=>{
					if( item.Id==this.editForm.CreditInfo.Id ){
						this.editForm.CreditInfo.AllowUserName=item.AllowUserName;
						this.editForm.CreditInfo.OrgId=item.OrgId;
					}
				});
			},
            editSubmit(){  //立即分配
				if( this.editForm.CreditInfo.Id==null ){
					this.$message.error( "请选择审核人员！" );
					return false;
				}
				creditallocate(this.editForm).then(res => {
					console.log(res);
					if(res.Ret == 200) {
						this.$message.success( res.Msg );
						this.showDialog=false;
						this.getlist();
					}
				});
			}
		}
	};
</script>

<style  lang="scss">
	

	#creditlist{
		.header .el-form-item {
			margin-bottom: 0;
		}
		
		.status-img {
			width: 20px;
			vertical-align: middle;
		}
		.el-card__header{
			padding-bottom:10px; 
		}
		.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
			margin-bottom: 10px ;
		}
	}
</style>