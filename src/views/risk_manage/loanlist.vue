<template>
	<div style="padding-bottom:80px;" id="loanList">
		<el-card class="box-card" >
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
							<el-option label="单次关闭" value="REFUSE0"></el-option>
                            <el-option label="关闭7天" value="REFUSE7"></el-option>
                            <el-option label="关闭30天" value="REFUSE30"></el-option>
                            <el-option label="永久关闭" value="REFUSEALL"></el-option>
							<el-option label="人工审核" value="SOURCEMANUAL"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核结果">
						<el-select v-model="form.AuditResult" placeholder="请选择" clearable style="width:120px;">
                            <el-option label="通过" :value="1"></el-option>
                            <el-option label="单次关闭" :value="2"></el-option>
                            <el-option label="关闭7天" :value="3"></el-option>
                            <el-option label="关闭30天" :value="4"></el-option>
                            <el-option label="永久关闭" :value="5"></el-option>
						</el-select>
					</el-form-item>
                    <el-form-item label="审核">
						<el-date-picker v-model="form.dateValue2" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:215px;"></el-date-picker>
					</el-form-item>
                    <el-form-item label="审核人员">
						<el-select v-model="form.Oper" placeholder="请选择" clearable style="width:100px;">
                            <el-option v-for="(item, index) in LoanInfoArr" :label="item.AllowUserName" :value="item.AllowUserName" :key="index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="分配筛选">
						<el-select v-model="form.IsLoanAllow" placeholder="请选择" clearable style="width:90px;">
                            <el-option label="未分配" :value="1"></el-option>
                            <el-option label="已分配" :value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="放款状态">
						<el-select v-model="form.FAKstate" placeholder="请选择"  style="width:120px;">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="放款成功" value="SUCCESS"></el-option>
                            <el-option label="放款等待中" value="PAYING"></el-option>
                            <el-option label="放款失败" value="FAIL"></el-option>
                            <el-option label="续期成功" value="RENEW"></el-option>
                            <el-option label="借款未审核" value="CONFIRM"></el-option>
                            <el-option label="借款审核关闭" value="CLOSE"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="订单类型">
						<el-select v-model="form.OrderType" placeholder="请选择" clearable style="width:110px;">
                            <el-option label="借款订单-首借" :value="-1"></el-option>
                            <el-option label="借款订单-复借" :value="1"></el-option>
							<el-option label="续期订单" :value="2"></el-option>
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
					<el-table-column v-if="isSelects" type="selection" width="40" :selectable='checkboxT'></el-table-column> 
					<el-table-column prop="Phone" label="手机" min-width="95"></el-table-column>
					<el-table-column label="姓名" min-width="180">
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.Name}}</span>
	  	    		        <span v-if="scope.row.LoanFinishCount" style="float:right; width:69px; text-align:center; font-size:12px; color:#8BC34A; border-radius:4px;">已还款{{scope.row.LoanFinishCount}}次</span>
	  	    		        <span v-if="scope.row.RenewCount" style="float:right; padding:0 2px; text-align:center; font-size:12px; color:#FF9800; border-radius:4px;">续期{{scope.row.RenewCount}}次</span>
		  	    		</template>
					</el-table-column>
					<el-table-column prop="Source" label="注册渠道" min-width="90"></el-table-column>
					<el-table-column label="借款金额" min-width="70">
						<template slot-scope="scope">{{scope.row.LoanAmount}}元</template>
					</el-table-column>
					<el-table-column label="借款期限" min-width="70">
						<template slot-scope="scope">{{scope.row.Term}}天</template>
					</el-table-column>
					<el-table-column  label="借款申请时间" min-width="123">
						<template slot-scope="scope">
							{{scope.row.CreateTime}}
						</template>
					</el-table-column>
					<el-table-column label="建议结果" min-width="110">
						<template slot-scope="scope">
							<div v-if="scope.row.RenewCount">通过</div>
							<div v-else>
								<div v-if="scope.row.FkAdviceResult==''&&scope.row.State=='CONFIRM'">系统处理中</div>
								<span v-else>{{scope.row.FkAdviceResult=="PASS"?(scope.row.FkAdviceBalance>0?"通过（"+scope.row.FkAdviceBalance+"元）":'通过'):scope.row.FkAdviceResult=="REFUSE0"?"单次关闭":scope.row.FkAdviceResult==""?"通过":scope.row.FkAdviceResult=="REFUSE7"?"关闭7天":scope.row.FkAdviceResult=="REFUSE30"?"关闭30天":scope.row.FkAdviceResult=="REFUSEALL"?"永久关闭":scope.row.FkAdviceResult=="SOURCEMANUAL"?"人工审核":""}}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="审核结果" min-width="110">
						<template slot-scope="scope">
							<div v-if="scope.row.RenewCount">通过</div>
							<div v-else>
								<div v-if="scope.row.IsLetter==0">
									<span v-if="scope.row.FkAdviceResult=='PASS'">通过（{{scope.row.FkAdviceBalance}}元）</span>
									<span v-else>{{scope.row.FkAdviceResult=="REFUSE0"?"单次关闭":scope.row.FkAdviceResult==""?"系统处理中":scope.row.FkAdviceResult=="REFUSE7"?"关闭7天":scope.row.FkAdviceResult=="REFUSE30"?"关闭30天":scope.row.FkAdviceResult=="REFUSEALL"?"永久关闭":""}}</span>
								</div>
								<div v-else>
									<span v-if="scope.row.LetterState=='CONFIRM'"></span>
									<span v-else-if="scope.row.LetterState=='PASS'">通过（{{scope.row.LoanAmount}}元）</span>
									<span v-else-if="scope.row.LetterState=='REFUSE'">
										{{scope.row.LetterCloseState=="REFUSE0"?"单次关闭":scope.row.LetterCloseState=="REFUSE7"?"关闭7天":scope.row.LetterCloseState=="REFUSE30"?"关闭30天":scope.row.LetterCloseState=="REFUSEALL"?"永久关闭":""}}
									</span>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="审核时间" min-width="123">
						<template slot-scope="scope">
							<div v-if="scope.row.RenewCount">{{scope.row.CreateTime}}</div>
							<div v-else>
								<span v-if="scope.row.GiveoutDate=='01/01/01 00:00:00'"></span>
								<span v-else>{{scope.row.GiveoutDate}}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="备注" min-width="110">
						<template slot-scope="scope">
							<div v-if="scope.row.RenewCount">续期订单自动过</div>
							<div v-else>
								<span v-if="scope.row.IsAtf==0&&scope.row.State!='CONFIRM'">系统自动审核</span>
								<span v-else>{{scope.row.GiveoutRemark}}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="审核人员" min-width="95">
						<template slot-scope="scope">
							<!-- <div v-if="scope.row.FkAdviceResult!=''"> -->
								<span v-if="scope.row.IsAtf==0">系统</span>
	                        	<span v-else-if="scope.row.IsAtf==1&&scope.row.AllotId!=0">{{scope.row.Oper}}</span>
	                        	<span v-else-if="scope.row.IsAtf==1&&scope.row.AllotId==0"></span>
							<!-- </div> -->
						</template>
					</el-table-column>
					<el-table-column label="放款状态" min-width="145">
						<template slot-scope="scope">
							<div v-if="scope.row.FAKstate == 'SUCCESS'">
								<el-tooltip placement="top">
									<div slot="content">放款已成功</div>
								  	<el-button style="cursor:pointer; padding:0px; border:none;" >
								  		<img class="status-img" :src="successlogo" />
								  	</el-button>
								</el-tooltip>
								<span v-if="scope.row.DtOrder !='01/01/01 00:00:00'" style="margin-left:3px;">{{scope.row.DtOrder}}</span>
							</div>
							<div v-if="scope.row.FAKstate == 'PAYING'">
								<el-tooltip placement="top">
									<div slot="content">放款中</div>
								  	<el-button style="cursor:pointer; padding:0px; border:none;" >
								  		<img class="status-img" :src="continuelogo" />
								  	</el-button>
								</el-tooltip>
								<span v-if="scope.row.DtOrder !='01/01/01 00:00:00'" style="margin-left:3px;">{{scope.row.DtOrder}}</span>
							</div>
							<div v-if="scope.row.FAKstate == 'FAIL'">
								<el-tooltip placement="top">
									<div slot="content">借款失败</div>
								  	<el-button style="cursor:pointer; padding:0px; border:none;" >
								  		<img class="status-img" :src="failllogo" />
								  	</el-button>
								</el-tooltip>
								<span v-if="scope.row.DtOrder !='01/01/01 00:00:00'" style="margin-left:3px;">{{scope.row.DtOrder}}</span>
							</div>
							<div v-if="scope.row.FAKstate == 'RENEW'">
								<el-tooltip placement="top">
									<div slot="content">放款已成功</div>
								  	<el-button style="cursor:pointer; padding:0px; border:none;" >
								  		<img class="status-img" :src="successlogo" />
								  	</el-button>
								</el-tooltip>
								<span v-if="scope.row.CreateTime !='01/01/01 00:00:00'" style="margin-left:3px;">{{scope.row.CreateTime}}</span>
							</div>
							<div v-if="scope.row.FAKstate == 'CONFIRM'">
								<span>借款未审核</span>
							</div>
							<div v-if="scope.row.FAKstate == 'CLOSE'">
								<span>借款审核关闭</span>
							</div>
		  	    		</template>
					</el-table-column>
					<el-table-column label="操作" >
						<template slot-scope="scope">
                            <el-button type="primary" plain size="mini" @click="viewdetails(scope.row.Id)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
				<span style="font:14px/32px '微软雅黑';"> 合计：借款金额 <label class="editwordSty">{{LoanAmount}}</label></span>
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
					<el-select v-model="editForm.LoanInfo.Id" placeholder="请选择审核人员" value-key="label" @change="changeInfo">
						<el-option v-for="item in LoanInfoArr" :key="item.Id" :label="item.AllowUserName" :value="item.Id"></el-option>
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
	import {loanlist,loanallocate } from "api/api.js";
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
				successlogo:require('../../assets/img/success.png'),
				continuelogo:require('../../assets/img/continue.png'),
				failllogo:require('../../assets/img/faill.png'),
                LoanInfoArr:[],
				page:1,
				total:0,
				pageSize:15,
				ispage:true,
				listLoading:false,
				LoanAmount:null,
				tableData:[],
				SourceArr:[],
				form: {
					UserAccount:'', //手机号
					UserName:'', //用户姓名
					FkAdviceResult:"",  //建议结果
					AuditResult:null, //审核结果
					Oper:'', //审核人员
                    dateValue:'', //申请时间
                    dateValue2:'', //审核时间
                    IsLoanAllow:null,  //审核状态
                    FAKstate:'',  //放款状态
                    OrderType:null,  //订单状态
                    Source:''
				},
				isSelects:false,
				showDialog:false,
				editForm:{
					LoanIds:[],  //选中id数组
					LoanInfo:{
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
					AuditResult:this.form.AuditResult || null,
					Oper:this.form.Oper,
					IsLoanAllow:this.form.IsLoanAllow || 0,
					FAKstate:this.form.FAKstate,
					OrderType:this.form.OrderType || null,
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
				loanlist(params).then(res => {
					console.log('返回的列表', res);
					if(res.Ret != 200) {
						return false;
					}
					this.total = res.Result.Sum;
					this.LoanAmount = res.Result.LoanAmount;
					if( res.Sources ){
						this.SourceArr=res.Sources;
					}else{
						this.SourceArr=[];
					}
					if( res.LoanInfo ){
						this.LoanInfoArr=res.LoanInfo;
					}else{
						this.LoanInfoArr=[];
					}
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
			checkboxT(row,index){
	    		if( row.IsAtf==1&&row.State=="CONFIRM" ){
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
				// 	path:"/fkdtl/"+id
				// });
				sessionStorage.setItem("listsource","confirm");
				let {href} = this.$router.resolve({path:`/fkdtl/${id}`});
				window.open(href,'_blank');
		   	},
		   	getUids(val){  //勾选（单选、全选）时处理数据
				let newArr = [];
				for(let i=0;i<val.length;i++){
					newArr.push(val[i].Id);
				}
				return newArr;
			},
			handleSelect(secection,row){  //单选
				console.log(secection,row);
				if( secection.indexOf(row)<=-1 ){
					this.editForm.LoanIds = this.getUids(secection);
				}else{
					if( row.IsLoanAllow ==2 ){
						this.$confirm('当前选中的订单是已分配的，是否重新分配?（'+row.Name+'）','提示',{
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
			handleSelectAll(secection){  //全选
			 	console.log(secection);
			 	if( secection.length<=0 ){
			 		this.editForm.LoanIds = [];
			 		return false;
			 	}
			 	secection.forEach(item=>{
			 		if( item.IsLoanAllow ==2 ){
						this.$confirm('选中的订单中包含已分配的，是否重新分配?','提示',{
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
				console.log(this.editForm.LoanIds);
		     	this.$refs.multipleTable.clearSelection();
		     	this.editForm.LoanIds = [];
			 	this.isSelects=false;
			},
			changeInfo(){  //下拉选数据处理
				this.LoanInfoArr.forEach(item=>{
					if( item.Id==this.editForm.LoanInfo.Id ){
						this.editForm.LoanInfo.AllowUserName=item.AllowUserName;
						this.editForm.LoanInfo.OrgId=item.OrgId;
					}
				});
			},
            editSubmit(){  //立即分配
				if( this.editForm.LoanInfo.Id==null ){
					this.$message.error( "请选择审核人员！" );
					return false;
				}
				loanallocate(this.editForm).then(res => {
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

<style lang="scss">
	#loanList{
		.status-img{ width:16px; height:16px; vertical-align:middle; cursor:pointer; }
		.el-card__header{ padding-bottom:0px; }
		.el-form-item--mini.el-form-item,.el-form-item--small.el-form-item{ margin-bottom:10px; }
	}
</style>