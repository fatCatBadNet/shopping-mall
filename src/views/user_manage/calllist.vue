<template>
	<div style="padding-bottom:80px;" id="calllist">
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent size="mini">
					<el-form-item>
						<el-select v-model="form.DateType" placeholder="性别" style="width:120px;">
						    <el-option label="分配时间" :value="1"></el-option>
						    <el-option label="最新联系时间" :value="2"></el-option>
						    <el-option label="注册时间" :value="3"></el-option>
						</el-select>
						<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:215px;"></el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-input v-model="form.useraccountORusername" placeholder="请输入手机号或姓名" clearable style="width:160px;"></el-input>
					</el-form-item>
					<el-form-item label="渠道">
		  		   		<el-select v-model="form.Source" clearable filterable placeholder="请选择" style="width:160px;">
					    	<el-option v-for="item in SourceArr" :key="item.Value" :label="item.Label" :value="item.Label"> </el-option>
					  	</el-select>
		  			</el-form-item>
					<el-form-item>
						<el-select v-model="form.Sex" placeholder="性别" clearable style="width:74px;">
                            <el-option label="男" value="男"></el-option>
                            <el-option label="女" value="女"></el-option>
                            <el-option label="未知" value="未知"></el-option>
						</el-select>
					</el-form-item>
                    <el-form-item>
						<el-cascader :options="options" v-model="form.selectedOptions" change-on-select clearable placeholder="请选择用户状态" style="width:180px;"></el-cascader>
					</el-form-item>
                    <el-form-item>
						<el-select v-model="form.CallName" placeholder="客服" clearable style="width:100px;">
                            <el-option v-for="(item, index) in CallNameInfo" :label="item.AllowUserName" :value="item.AllowUserName" :key="index"></el-option>
						</el-select>
					</el-form-item>

                    <el-form-item>
						<el-select v-model="form.IsCallAllow" placeholder="分配情况" clearable style="width:95px;">
                            <el-option label="未分配" :value="1"></el-option>
                            <el-option label="已分配" :value="2"></el-option>
						</el-select>
					</el-form-item>
					
					<el-form-item>
						<el-button type="primary" size="mini" @click="search">搜索</el-button>
					</el-form-item>
					<el-form-item v-if="isallot">
						<el-button type="primary" size="mini" @click="isSelects=true">分配</el-button>
					</el-form-item>
				</el-form>
			</div>
			<template>
				<!-- <el-table :data="tableData" ref="multipleTable" v-loading="listLoading" element-loading-text="数据加载中..." border @selection-change="selectchange"> -->
				<el-table :data="tableData" ref="multipleTable" v-loading="listLoading" element-loading-text="数据加载中..." border @select="handleSelect" @select-all="handleSelectAll">
					<el-table-column v-if="isSelects" type="selection" width="60"></el-table-column>
					<el-table-column prop="Account" label="手机" width="120"></el-table-column>
					<el-table-column prop="Verifyrealname" label="姓名" width="100"></el-table-column>
					<el-table-column prop="Sex" label="性别" width="60"></el-table-column>
					<el-table-column prop="CreateTime" label="注册时间" min-width="155"></el-table-column>
					<el-table-column prop="Source" label="注册渠道" min-width="150"></el-table-column>
					<el-table-column prop="ActionType" label="用户状态" min-width="300">
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
                            <el-tooltip placement="top">
								<div v-if="scope.row.InitAudit===0"  slot="content">未授信</div>
								<div v-if="scope.row.InitAudit===1"  slot="content">授信处理中</div>
								<div v-if="scope.row.InitAudit===4"  slot="content">已授信</div>
								<div v-if="scope.row.InitAudit===5"  slot="content">授信永久关闭</div>
								<div v-if="scope.row.InitAudit===7"  slot="content">授信关闭{{scope.row.CreditCloseDay}}天</div>
							  	<el-button style="cursor:pointer; padding:0px; border:none;" >
                                     <img  v-if="scope.row.InitAudit===0" :src="InitAudit_01" style="width:20px; height:20px;"/> 
                                     <img  v-if="scope.row.InitAudit===1" :src="InitAudit_02" style="width:20px; height:20px;"/> 
                                     <img  v-if="scope.row.InitAudit===4" :src="InitAudit_03" style="width:20px; height:20px;"/> 
                                     <img  v-if="scope.row.InitAudit===5 || scope.row.InitAudit===7" :src="InitAudit_04" style="width:20px; height:20px;"/> 
							  	</el-button>
							</el-tooltip>
							<el-tooltip placement="top">
								<div v-if="(scope.row.RefuseFlag===2 && !(scope.row.LoanState==='PAYING'|| scope.row.LoanState==='FINISH' || scope.row.LoanState==='BACKING' ))|| (scope.row.RefuseFlag===3  && scope.row.LoanCount===0)"  slot="content">未借款</div>
								<div v-if="scope.row.LoanState==='CONFIRM' && scope.row.RefuseFlag===3"  slot="content">借款审核中</div>
								<div v-if="scope.row.LoanState==='PAYING'|| scope.row.LoanState==='FINISH' || scope.row.LoanState==='BACKING' "  slot="content">已借款</div>
								<div v-if="scope.row.RefuseFlag===1"  slot="content">借款关闭</div>
							  	<el-button style="cursor:pointer; padding:0px; border:none;" >
                                     <img  v-if="(scope.row.RefuseFlag===2 && !(scope.row.LoanState==='PAYING'|| scope.row.LoanState==='FINISH' || scope.row.LoanState==='BACKING' ))|| (scope.row.RefuseFlag===3  && scope.row.LoanCount===0)" :src="LoanState_01" style="width:20px; height:20px;"/> 
                                     <img  v-if="scope.row.LoanState==='CONFIRM' && scope.row.RefuseFlag===3" :src="LoanState_02" style="width:20px; height:20px;"/> 
                                     <img  v-if="scope.row.LoanState==='PAYING'|| scope.row.LoanState==='FINISH' || scope.row.LoanState==='BACKING'" :src="LoanState_03" style="width:20px; height:20px;"/> 
                                     <img  v-if="scope.row.RefuseFlag===1" :src="LoanState_04" style="width:20px; height:20px;"/> 
							  	</el-button>
							</el-tooltip>
		  	    		</template>
                    </el-table-column>
					<el-table-column prop="CallAllowTime" label="分配时间" min-width="155"></el-table-column>
					<el-table-column prop="CallLinkTime" label="最近联系时间" min-width="150"></el-table-column>
					<el-table-column prop="CallRemark" label="备注" ></el-table-column>
					<el-table-column prop="CallName" label="客服" min-width="80"></el-table-column>
					<el-table-column label="操作" min-width="180">
						<template slot-scope="scope">
							<span class="editwordSty" @click="showRemark(scope)">备注</span>
                            <span class="editwordSty" @click="viewdetails(scope.row.Id)">查看</span>
                            <el-popover placement="bottom-end" trigger="hover" v-if="scope.row.ConnRecordInfo !=null && scope.row.ConnRecordInfo.length>0">
                                <div>
                                    <ul>
                                        <li style="line-height:25px;padding:0 20px;" v-for="(item,index) in scope.row.ConnRecordInfo" :key="index">{{item.CreateTime}} &nbsp;&nbsp;{{item.Content}}</li>
                                    </ul>
                                </div>
                                <span class="editwordSty" slot="reference">联系历史</span>
                            </el-popover>
						</template>
					</el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
				<span style="font:14px/32px '微软雅黑';">
					合计：<label class="editwordSty">{{total}}</label>人
				</span>
				<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
			</el-col>
		</el-card>
		<div v-if="editForm.Info.length>0" style="height:80px; background:#fff; text-align:center; font:16px/80px '微软雅黑'; box-shadow:0 0 10px #ddd; position:fixed; bottom:20px; right:35px; left:165px; z-index:10;">
			<label style="color:#999;">已选择 &nbsp;<b class="editwordSty">{{editForm.Info.length}}</b>条</label>
			<el-button type="primary" size="medium" @click="showDialog=true" style="margin:0 20px;">立即分配</el-button>
			<el-button type="primary" plain size="medium" @click="cancelSelect" style="margin:0 20px;">取消分配</el-button>
		</div>
        <el-dialog title="备注" :visible.sync="showRemarkDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="400px">
			<el-form :model="remarkForm" label-width="50px" ref="remarkForm">
				<el-form-item label="备注">
					<el-input type="textarea" v-model="remarkForm.Remark" placeholder="请输入备注（选填）" style="width:90%;"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="callremarkBtn">确定</el-button>
				<el-button @click.native="showRemarkDialog=false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 批量分配弹框 -->
		<el-dialog title="批量分配" :visible.sync="showDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="400px">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="分配给">
					<el-select v-model="editForm.CallNameInfo.Id" placeholder="请选择客服人员" value-key="label" @change="changeInfo">
						<el-option v-for="item in CallNameInfo" :key="item.Id" :label="item.AllowUserName" :value="item.Id"></el-option>
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
	import http from "api/http.js";
	import {calllist,calllinkrecord,callremark,callallow,buttonctl } from "api/api.js";
	import dataJson from '@/assets/json/userStatus.json';
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
				SaasType:'', //
				options:[],//用户状态集合
				SourceArr:[],//渠道集合
                CallNameInfo:[],//客服列表
				page:1,
				total:0,
				pageSize:15,
				ispage:true,
				listLoading:false,
				tableData:[],
				form: {
					DateType:3,//时间类型
					useraccountORusername: '', //手机号或用户姓名
					Sex:'',
					CallName: '', //客服
					IsCallAllow:null,//分配情况
                    dateValue: '',
					Source:'',
					selectedOptions:[]  //用户状态
				},
				isallot:false,  //批量分配按钮权限
				isSelects:false,
				showDialog:false,
				editForm:{
					Info:[],  //选中id数组
					AllowRemark:'call_list',
					CallNameInfo:{
						"AllowUserName":"",
					    "Id":null,
					    "OrgId":null
					}
                },
                showRemarkDialog:false,
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
                zhimaac:require('../../assets/img/zhimaac.png'),
                InitAudit_01:require('../../assets/img/InitAudit_01.png'),
                InitAudit_02:require('../../assets/img/InitAudit_02.png'),
                InitAudit_03:require('../../assets/img/InitAudit_03.png'),
                InitAudit_04:require('../../assets/img/InitAudit_04.png'),
                LoanState_01:require('../../assets/img/LoanState_01.png'),
                LoanState_02:require('../../assets/img/LoanState_02.png'),
                LoanState_03:require('../../assets/img/LoanState_03.png'),
                LoanState_04:require('../../assets/img/LoanState_04.png'),
                remarkForm:{
                    Remark:'',
					Uid:'',
					LoanId:'',
					AllowRemark:'call_list',
					ConnType:'CALLREMARK'
                }
			};
		},
		mounted() {
			this.getcalllistDate();
			buttonctl({}).then((res) => {  //催收按钮权限控制
				console.log(res);
				this.isallot=false;
				if( res.Ret==200 && res.AllCtl.CallAllow ){
					this.isallot=res.AllCtl.CallAllow;
				}
			});
		},
		methods: {
            callremarkBtn(){  //修改备注
                let params =this.remarkForm;
                callremark(params).then(res=>{
                    if(res.Ret ==200){
                        this.$message.success(res.Msg);
                        this.getcalllistDate()
                        this.showRemarkDialog = false;
                    }
                })
            },
            showRemark(scope){  //备注
                this.remarkForm.Remark = scope.row.CallRemark;
				this.remarkForm.Uid = scope.row.Id;
				this.remarkForm.LoanId = scope.row.LoanId;
				console.log(scope);
				if(scope.row.IsCallAllow != 2){
					this.$message.error('请先进行分配');
					return;
				}
                this.showRemarkDialog = true;
            },
            getCallList(){  //单独获取客服下拉选项（已弃用）
                calllist({}).then(res=>{
                    if(res.Ret == 200 ){
                        this.CallNameInfo = res.CallNameInfo;
                    }
                })
            },
            getInfo(val){  //处理单选、全选操作时的数据
				let newArr = [];
				for(let i=0;i<val.length;i++){
					newArr.push({
						Uid:val[i].Id,
						LoanId:val[i].LoanId
					});
				}
				return newArr;
			},
			handleSelect(secection,row){  //单选操作
				console.log(row,secection);
				if( secection.indexOf(row)<=-1 ){
					this.editForm.Info = this.getInfo(secection);
				}else{
					if(row.IsCallAllow ==2){
						this.$confirm('当前选中的订单是已分配的案件，是否重新分配?（'+row.Verifyrealname+'）','提示',{
                            type:'warning'
                        }).then(() => {
							console.log(this.getInfo(secection));
							this.editForm.Info = this.getInfo(secection);
                        }).catch(() => { 
							this.$refs.multipleTable.toggleRowSelection(row,false);
							this.editForm.Info = this.getInfo(secection);
                        });
					}else{
						this.editForm.Info = this.getInfo(secection);
					}
				}
			},
			handleSelectAll(secection){  //全选操作
			 	console.log(secection);
			 	if( secection.length<=0 ){
			 		this.editForm.Info = [];
			 		return false;
			 	}
			 	secection.forEach(item=>{
			 		if( item.IsCallAllow ==2 ){
						this.$confirm('选中的订单中包含已分配的案件，是否重新分配?','提示',{
                            type:'warning'
                        }).then(() => {
							console.log(this.getInfo(secection));
							this.editForm.Info = this.getInfo(secection);
                        }).catch(() => { 
							this.$refs.multipleTable.clearSelection();
							this.editForm.Info = [];
                        });
					}else{
						this.editForm.Info = this.getInfo(secection);
					}
			 	});
			},
			cancelSelect(rows){  //取消分配
				console.log(this.editForm.Info);
		     	this.$refs.multipleTable.clearSelection();
		     	this.editForm.Info = [];
			 	this.isSelects=false;
			},
			changeInfo(){  //下拉选数据处理
				this.CallNameInfo.forEach(item=>{
					if( item.Id==this.editForm.CallNameInfo.Id ){
						this.editForm.CallNameInfo.AllowUserName=item.AllowUserName;
						this.editForm.CallNameInfo.OrgId=item.OrgId;
					}
				});
			},
            editSubmit(){  //分配
				if( this.editForm.CallNameInfo.Id==null ){
					this.$message.error( "请选择客服人员！" );
					return false;
				}
				callallow(this.editForm).then(res => {
					console.log(res);
					if(res.Ret == 200) {
						this.$message.success( res.Msg );
						this.showDialog=false;
						this.getcalllistDate();
					}
				});
			},
			search() { //搜索
				this.ispage = false;
				this.$nextTick(() => {
					this.page = 1;
					this.getcalllistDate();
					this.ispage = true;
				});
			},
            getcalllistDate() { //获取列表
				let params = {
					Page: this.page,
					PageSize: this.pageSize,
					DateType:this.form.DateType,
					Sex: this.form.Sex,
					CallName: this.form.CallName,
					IsCallAllow: this.form.IsCallAllow == '' ? null:this.form.IsCallAllow,
					Source:this.form.Source
				};
				
				if(/^[0-9]*$/g.test(this.form.useraccountORusername)){
					params.UserAccount = this.form.useraccountORusername;
				}else{
					params.UserName = this.form.useraccountORusername;
				}

				if(this.form.DateType == 1){
					params.AllowStartTime = this.form.dateValue ? this.form.dateValue[0] + " 00:00:00" : '';
					params.AllowEndTime = this.form.dateValue ? this.form.dateValue[1] + " 23:59:59" : '';
				}else{
					params.CallStartTime = this.form.dateValue ? this.form.dateValue[0] + " 00:00:00" : '';
					params.CallEndTime = this.form.dateValue ? this.form.dateValue[1] + " 23:59:59" : '';
				}
				
				if(this.form.selectedOptions.length>0){
					if(this.SaasType == 'ON'){
						params.DirectLoanType = this.form.selectedOptions;
					}
					if(this.SaasType == 'OFF'){
						params.CreditLoanType = this.form.selectedOptions;
					}
				}else{
					params.DirectLoanType = [];
					params.CreditLoanType = [];

				}
                this.listLoading = true;
				console.log('canshu',params);
				calllist(params).then(res => {
					console.log('返回的列表', res);
					if(res.Ret != 200) {
						return false;
					}
					this.total = res.Result.UserSum;
					this.CallNameInfo=res.CallNameInfo || [];
					this.SourceArr=res.Sources || [];
					this.tableData = res.Result.List || [];
					this.listLoading = false;
					this.isSelects=false;
					this.SaasType = res.SaasType;
					this.options = res.SaasType=="ON" ? dataJson.DirectLoanType :dataJson.CreditLoanType;  //ON-直接借款模式/OFF-授信借款模式
					this.editForm.Info=[];
				});
			},
			handleCurrentChange(current) {  //分页页码跳转
				this.page = current;
				this.getcalllistDate();
			},
			handleSizeChange(val) {  //分页页码改变
				this.pageSize = val;
				this.getcalllistDate();
			},
		   	viewdetails(id){  //查看详情
				let {href} = this.$router.resolve({path:`/authuserdtl/${id}`});
				window.open(href,'_blank');
		   	}
		}
	};
</script>

<style lang="scss">
	#calllist{
		.el-card__header{ padding-bottom:0px; }
		.header .el-form-item{ margin-bottom:0; }
		.el-form-item--mini.el-form-item,.el-form-item--small.el-form-item{ margin-bottom:10px; }
	}
</style>