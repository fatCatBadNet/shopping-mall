<template>
	<div style="padding-bottom:80px;" id="loseuserallocation">
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent >
					<el-form-item label="手机">
						<el-input v-model="form.UserAccount" placeholder="请输入" clearable style="width:150px;"></el-input>
					</el-form-item>
					<el-form-item label="姓名">
						<el-input v-model="form.UserName" placeholder="请输入" clearable style="width:150px;"></el-input>
					</el-form-item>
                    <el-form-item label="已还款次数">
						<el-select v-model="form.LoanFinishCount" placeholder="请选择" clearable style="width:150px;">
                            <el-option v-for="(item, index) in RetLoanCount" :label="item" :value="item" :key="index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="距上次还款天数">
						<el-input v-model.number="form.DistLostRetCountSt" clearable style="width:60px;"></el-input> &nbsp;-
						<el-input v-model.number="form.DistLostRetCountEn" clearable style="width:60px;"></el-input>
					</el-form-item>
                    <el-form-item>
						<el-select v-model="form.IsCallAllow" placeholder="分配情况" clearable style="width:120px;">
                            <el-option label="未分配" :value="1"></el-option>
                            <el-option label="已分配" :value="2"></el-option>
						</el-select>
					</el-form-item>
                    <el-form-item>
						<el-select v-model="form.CallName" placeholder="客服" clearable style="width:150px;">
                            <el-option v-for="(item, index) in CallNameInfo" :label="item.AllowUserName" :value="item.AllowUserName" :key="index"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item>
						<el-button type="primary"  @click="search">搜索</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary"  @click="isSelects=true">分配</el-button>
					</el-form-item>
				</el-form>
			</div>
			<template>
				<!-- <el-table :data="tableData" ref="multipleTable" v-loading="listLoading" element-loading-text="数据加载中..." border @selection-change="selectchange"> -->
				<el-table :data="tableData" ref="multipleTable" v-loading="listLoading" element-loading-text="数据加载中..." border @select="handleSelect" @select-all="handleSelectAll">
					<el-table-column v-if="isSelects" type="selection" width="60"></el-table-column>
					<el-table-column prop="Verifyrealname" label="姓名" width="100"></el-table-column>
					<el-table-column prop="Account" label="手机" width="120"></el-table-column>
					<el-table-column prop="Balance" label="授信" min-width="100"></el-table-column>
                    <el-table-column prop="LoanFinishCount" label="已还款次数" min-width="100"></el-table-column>
                    <el-table-column label="距上次还款天数" min-width="100">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.DistLostRetCount}}天
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="CallAllowTime" label="分配时间" min-width="150"></el-table-column>
                    <el-table-column prop="CallLinkTime" label="最近联系时间" min-width="150"></el-table-column>
                    <el-table-column prop="CallRemark" label="备注" min-width="120"></el-table-column>
                    <el-table-column prop="CallName" label="客服" min-width="100"></el-table-column>
					
					<el-table-column label="操作" min-width="180">
						<template slot-scope="scope">
                            <span class="editwordSty" @click="viewdetails(scope.row.Id)">查看</span>
						</template>
					</el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
				<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
			</el-col>
		</el-card>
		<div v-if="editForm.Info.length>0" style="height:80px; background:#fff; text-align:center; font:16px/80px '微软雅黑'; box-shadow:0 0 10px #ddd; position:fixed; bottom:20px; right:35px; left:165px; z-index:10;">
			<label style="color:#999;">已选择 &nbsp;<b class="editwordSty">{{editForm.Info.length}}</b>条</label>
			<el-button type="primary" size="medium" @click="showDialog=true" style="margin:0 20px;">立即分配</el-button>
			<el-button type="primary" plain size="medium" @click="cancelSelect" style="margin:0 20px;">取消分配</el-button>
		</div>
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
	import http from "../../api/http.js";
	import {lossuserlist,calllinkrecord,callremark,callallow} from "api/api.js";
	export default {
		data() {
			return {
                prevValList:[],
                CallNameInfo:[],//客服列表
                RetLoanCount:[],//已还款次数
				page:1,
				total:0,
				pageSize:15,
				ispage:true,
				listLoading:false,
				tableData:[],
				form: {
					UserAccount: '', //手机号
                    UserName: '', //用户姓名
                    LoanFinishCount:null,
					DistLostRetCountSt:null,
                    DistLostRetCountEn:null,
					IsCallAllow:null,//分配情况
					CallName: '' //客服
				},

				isSelects:false,
				showDialog:false,
				editForm:{
					Info:[],  //选中id数组
					AllowRemark:'loss_user',
					CallNameInfo:{
						"AllowUserName":"",
					    "Id":null,
					    "OrgId":null
					}
                },
			};
		},
		mounted() {
            this.getlossuserlistDate();
		},
		methods: {
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
						this.getlossuserlistDate();
					}
				});
			},
			search() { //搜索
				this.ispage = false;
				this.$nextTick(() => {
					this.page = 1;
					this.getlossuserlistDate();
					this.ispage = true;
				});
			},
            getlossuserlistDate() { //获取列表
				let params = {
					Page: this.page,
					PageSize: this.pageSize,
					UserAccount: this.form.UserAccount,
                    UserName: this.form.UserName,
                    LoanFinishCount: this.form.LoanFinishCount || -1,
					DistLostRetCountSt:this.form.DistLostRetCountSt === 0 ? this.form.DistLostRetCountSt : this.form.DistLostRetCountSt || -1,
                    DistLostRetCountEn:this.form.DistLostRetCountEn === 0 ? this.form.DistLostRetCountEn : this.form.DistLostRetCountEn || -1,
					IsCallAllow:this.form.IsCallAllow || null,//分配情况
					CallName: this.form.CallName || '' //客服

				};
                this.listLoading = true;
				lossuserlist(params).then(res => {
					console.log('返回的列表', res);
					if(res.Ret != 200) {
						return false;
					}
                    this.total = res.Result.UserSum;
                    this.RetLoanCount = res.RetLoanCount || [];
					if( res.CallNameInfo ){
						this.CallNameInfo=res.CallNameInfo;
					}else{
						this.CallNameInfo=[];
					}
					if(res.Result.List == null) {
						this.tableData = [];
					} else {
						this.tableData = res.Result.List;
					}
					this.listLoading = false;
					this.isSelects=false;
					this.editForm.Info=[];
				});
			},
			handleCurrentChange(current) {  //分页页码跳转
				this.page = current;
				this.getlossuserlistDate();
			},
			handleSizeChange(val) {  //分页页码改变
				this.pageSize = val;
				this.getlossuserlistDate();
			},
		   	viewdetails(id){  //查看详情
				let {href} = this.$router.resolve({path:`/authuserdtl/${id}`});
				window.open(href,'_blank');
		   	}
		}
	};
</script>

<style lang="scss">
	#loseuserallocation{
		.el-card__header{ padding-bottom:20px; }
		.header .el-form-item{ margin-bottom:0; }
		.el-form-item--mini.el-form-item,.el-form-item--small.el-form-item{ margin-bottom:10px; }
	}
</style>