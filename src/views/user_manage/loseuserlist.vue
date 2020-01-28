<template>
	<div style="padding-bottom:80px;" id="loseuserlist">
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
						<el-button type="primary"  @click="search">搜索</el-button>
					</el-form-item>
				</el-form>
			</div>
            <el-table :data="tableData"  v-loading="listLoading" element-loading-text="数据加载中..." border >
                <el-table-column prop="Verifyrealname" label="姓名" min-width="100"></el-table-column>
                <el-table-column prop="Account" label="手机" min-width="120"></el-table-column>
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
			<el-col :span="24" class="toolbar">
				<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
			</el-col>
		</el-card>
		
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

	</div>
</template>

<script>
	import http from "api/http.js";
	import {lossuserlist,callremark,callallow } from "api/api.js";
	export default {
		data() {
			return {

				page:1,
				total:0,
				pageSize:15,
				ispage:true,
				listLoading:false,
                tableData:[],
                RetLoanCount:[],//已还款次数
				form: {
					UserAccount: '', //手机号
                    UserName: '', //用户姓名
                    LoanFinishCount:null,
                    DistLostRetCountSt:null,
                    DistLostRetCountEn:null
				},
				showDialog:false,
                showRemarkDialog:false,
                remarkForm:{
                    Remark:'',
					Uid:'',
					AllowRemark:'loss_user',
                    ConnType:"LOSSLOANREMARK"
                }
			};
		},
		mounted() {
            this.getlossuserlistDate();

		},
		methods: {
            callremarkBtn(){  //修改备注
                let params =this.remarkForm;
                callremark(params).then(res=>{
                    if(res.Ret ==200){
                        this.$message.success(res.Msg);
                        this.getlossuserlistDate()
                        this.showRemarkDialog = false;
                    }
                })
            },
            showRemark(scope){  //备注
                this.remarkForm.Remark = scope.row.CallRemark;
                this.remarkForm.Uid = scope.row.Id;
				this.remarkForm.LoanId = scope.row.LoanId;
				if(scope.row.IsCallAllow != 2){
					this.$message.error('请先进行分配');
					return;
				}
                this.showRemarkDialog = true;
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
                    DistLostRetCountEn:this.form.DistLostRetCountEn === 0 ? this.form.DistLostRetCountEn : this.form.DistLostRetCountEn || -1

				};
                this.listLoading = true;
				lossuserlist(params).then(res => {
					console.log('返回的列表', res);
					if(res.Ret != 200) {
						return false;
					}
					this.total = res.Result.UserSum;
					this.RetLoanCount = res.RetLoanCount || [];
					if(res.Result.List == null) {
						this.tableData = [];
					} else {
						this.tableData = res.Result.List;
					}
					this.listLoading = false;
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
	#loseuserlist{
		.el-card__header{ padding-bottom:20px; }
		.header .el-form-item{ margin-bottom:0; }
		.el-form-item--mini.el-form-item,.el-form-item--small.el-form-item{ margin-bottom:10px; }
	}
</style>