<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent>
					<el-form-item label="手机">
						<el-input v-model="form.UserAccount" placeholder="请输入" clearable></el-input>
					</el-form-item>
					<el-form-item label="反馈日期">
						<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
					</el-form-item>
					<el-form-item label="备注">
						<el-select v-model="form.IsRemark" clearable placeholder="请选择">
						    <el-option label="待处理" value="1"></el-option>
						    <el-option label="已处理" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="small" @click="search">搜索</el-button>
					</el-form-item>
				</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;">
					<el-table-column prop="Account" label="手机" width="120"></el-table-column>
					<el-table-column prop="MobileType" label="手机型号" width="130"></el-table-column>
					<el-table-column prop="AppVersion" label="APP版本" width="120"></el-table-column>
					<el-table-column prop="CreateTime" label="反馈时间" width="170"></el-table-column>
					<el-table-column prop="Content" label="反馈内容" min-width="200"></el-table-column>
					<el-table-column prop="Remarks" label="备注" :formatter="remarks" width="140"></el-table-column>
					<el-table-column label="处理人/处理时间" min-width="150">
						<template slot-scope="scope">
	  	    		        {{scope.row.Dealpeople}}&nbsp;{{scope.row.ModifyTime}}
		  	    		</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="primary" plain size="mini" @click="goRemark(scope.row)">备注</el-button>
						</template>
					</el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
				<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
			</el-col>
		</el-card>
		<!-- 备注弹框 -->
		<el-dialog title="备 注" :visible.sync="showDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="700px">
			<el-form :model="remarkForm" label-width="90px" ref="remarkForm">
				<el-form-item label="添加备注" prop="Remarks" :rules="[{required:true,message:'备注不得为空'}]">
					<el-input type="textarea" v-model="remarkForm.Remarks" auto-complete="off" style='width:520px;'></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-radio-group v-model="remarkForm.Remarks" size="medium">
				      	<el-radio border label="已联系"></el-radio>
				      	<el-radio border label="已处理"></el-radio>
				      	<el-radio border label="0额度"></el-radio>
				      	<el-radio border label="无人接听"></el-radio>
				      	<el-radio border label="挂断"></el-radio>
				      	<el-radio border label="拒接"></el-radio>
				      	<el-radio border label="来电提醒"></el-radio>
				      	<el-radio border label="命中黑名单"></el-radio>
				    </el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="remarkSubmit">提交</el-button>
				<el-button @click.native="showDialog=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import http from "../../api/http.js";
	import {adviselist,addadvise} from 'api/api.js';
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
					page: 1,
					total: 0,
					pageSize: 15,
					pageCount: 1,
					ispage: true,
					listLoading: false,
					tableData: [],
					form: {
						UserAccount: '',
						IsRemark:'',
						dateValue: [http.dateFormatter(new Date(new Date().getTime() - 14*24*60*60*1000),false),http.dateFormatter(new Date(),false)]
					},
					showDialog:false,
					remarkForm:{},
				}
			},
			mounted() {
				this.getadviselist();
			},
			methods: {
				search() { //搜索
					this.ispage = false;
					this.$nextTick(() => {
						this.page = 1;
						this.getadviselist();
						this.ispage = true;
					});
				},
				getadviselist() { //获取意见反馈列表
					let params = {
						Page: this.page,
						PageSize: this.pageSize,
						IsRemark: parseInt(this.form.IsRemark),
						UserAccount: this.form.UserAccount,
					};
					if( !this.form.dateValue ){
						params.StartTime='';
						params.EndTime='';
					}else{
						params.StartTime=this.form.dateValue[0]+' 00:00:00';
						params.EndTime=this.form.dateValue[1]+' 23:59:59';
					}
					this.listLoading = true;
					adviselist(params).then((res) => {
						if(res.Ret != 200) {
							return false;
						}
						this.total = res.Result.UserSum;
						if(res.Result.List == null) {
							this.tableData = [];
						} else {
							this.tableData = res.Result.List;
							this.pageCount = Math.ceil(this.total / this.pageSize);
						}
						this.listLoading = false;
					});
				},
				remarks(row){
					if( !row.Remarks ){
						return "待处理";
					}else{
						return row.Remarks;
					}
				},
				handleCurrentChange(current) { //分页页码跳转
					this.page = current;
					this.getadviselist();
				},
				handleSizeChange(val) { //分页页码改变
					this.pageSize = val;
					this.getadviselist();
				},
				goRemark(item) { //备注
					this.showDialog=true;
					this.remarkForm=Object.assign({},item);
				},
				remarkSubmit(){  //添加备注
					if( !this.remarkForm.Remarks ){
						this.$message.error( '备注不能为空' );
						return false;
					}
					let params = {AdviseId:this.remarkForm.Id,Remark:this.remarkForm.Remarks};
					addadvise(params).then((res) => {
						if( res.Ret==200 ){
							this.$message.success( res.Msg );
							this.showDialog=false;
							this.getadviselist();
							this.resetForm('remarkForm');
						}
					});
				},
				resetForm(formName){  //重置表单
		      		this.$nextTick(() => {
				        this.$refs[formName].resetFields();
				    });
		      	}

			}
	}
</script>

<style scoped lang="scss">
	.header .el-form-item {
		margin-bottom: 0;
	}
	.el-radio.is-bordered.is-bordered{ margin:0 10px 15px 0; }
</style>