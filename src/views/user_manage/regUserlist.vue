<template>
	<div id="regUserlist">
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent size="mini">
					<el-form-item label="手机">
						<el-input v-model="form.UserAccount" placeholder="请输入" clearable></el-input>
					</el-form-item>
					<el-form-item label="注册日期">
						<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
					</el-form-item>
					<el-form-item label="渠道">
						<!--<el-input v-model="form.Source" placeholder="请输入" clearable></el-input>-->
						<el-select v-model="form.Source" clearable filterable placeholder="请选择">
					    	<el-option v-for="item in SourceArr" :key="item.Value" :label="item.Label" :value="item.Label"> </el-option>
					  	</el-select>
					</el-form-item>
					<el-form-item label="认证情况">
						<el-select v-model="form.IsRealName" clearable placeholder="请选择">
						    <el-option label="未认证" value="1"></el-option>
						    <el-option label="已认证" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="mini" @click="search">搜索</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="mini" @click="isSelects=true">批量删除</el-button>
					</el-form-item>
				</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border ref="multipleTable" @selection-change="selectchange">
					<el-table-column v-if="isSelects" type="selection" width="60"></el-table-column>
					<el-table-column prop="Id" label="ID" width="100"></el-table-column>
					<el-table-column prop="Account" label="手机"></el-table-column>
					<el-table-column prop="CreateTime" label="注册时间"></el-table-column>
					<el-table-column prop="Source" label="注册渠道"></el-table-column>
					<el-table-column label="认证情况">
						<template slot-scope="scope">{{scope.row.IsRealName==2?'已认证':'未认证'}}</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="primary" plain size="mini" @click="viewdetails(scope.row.Id)">查看</el-button>
							<!--<router-link tag="a" target="_blank" class="editwordSty" :to="{path:'/authuserdtl/'+scope.row.Id}">查看</router-link>-->
						</template>
					</el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
				<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
			</el-col>
		</el-card>
		<div v-if="batches.length>0" style="height:80px; background:#fff; text-align:center; font:16px/80px '微软雅黑'; box-shadow:0 0 10px #ddd; position:fixed; bottom:20px; right:20px; left:20px; z-index:10;">
			<label style="color:#999;">已选择 &nbsp;<b class="editwordSty">{{batches.length}}</b>条</label>
			<el-button type="primary" size="medium" @click="deleteSelect" style="margin:0 20px;">删除</el-button>
			<el-button type="primary" plain size="medium" @click="cancelSelect" style="margin:0 20px;">取消</el-button>
		</div>
	</div>
</template>

<script>
	import http from "../../api/http.js";
	import {reguserlist,reguserdel} from 'api/api.js';
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
					ispage: true,
					listLoading: false,
					tableData: [],
					SourceArr:[],
					form: {
						UserAccount: '',
						Source:'',
						IsRealName:null,
						dateValue: [http.dateFormatter(new Date(new Date().getTime() - 14*24*60*60*1000),false),http.dateFormatter(new Date(),false)]
					},
					loading:false,
					isSelects:false,  //是否批量删除
					batches: [] //批量选中数组
				}
			},
			mounted() {
				this.getUserlist();
			},
			methods: {
				search() { //搜索
					this.ispage = false;
					this.$nextTick(() => {
						this.page = 1;
						this.getUserlist();
						this.ispage = true;
					});
				},
				getUserlist() { //获取注册用户列表
					let params = {
						Page:this.page,
						PageSize:this.pageSize,
						Source:this.form.Source,
						UserAccount:this.form.UserAccount,
						IsRealName:parseInt(this.form.IsRealName)
					};
					if( !this.form.dateValue ){
						params.StartTime='';
						params.EndTime='';
					}else{
						params.StartTime=this.form.dateValue[0]+' 00:00:00';
						params.EndTime=this.form.dateValue[1]+' 23:59:59';
					}
					this.listLoading = true;
					reguserlist(params).then((res) => {
						if( res.Ret==200 ){
							this.total = res.Result.UserSum;
							this.SourceArr=res.Sources || [];
							this.tableData = res.Result.List || [];
							this.listLoading = false;
							this.batches=[];
							this.isSelects=false;
						}
					});
				},
				selectchange(val){  //选择
					this.batches=[];
					val.forEach(item=>{
						this.batches.push(item.Id);
					});
				},
				cancelSelect(rows){  //取消
				 	this.$refs.multipleTable.clearSelection();
				 	this.batches = [];
				 	this.isSelects=false;
				},
				deleteSelect(){  //删除
					let that=this;
					this.$confirm('删除后，将丢失所有该用户的数据且无法恢复，请谨慎操作。是否确认删除？','删除用户数据',{
						confirmButtonText:'删除',
						confirmButtonClass:'confirmButton',
						cancelButtonText:'取消',
						cancelButtonClass:'cancelButton',
						center:true
					}).then(() => {
						this.loading = true;
						reguserdel({Uids:that.batches}).then((res) => {
						    this.timer = setTimeout(()=>{
						        this.loading = false;
						    },300);
						    if( res.Ret==200 ){
						        this.getUserlist();
						        this.$message.success( res.Msg );
						    }
						    if( res.Ret==100 ){
								this._sendCode({Uids:that.batches},reguserdel).then(res=>{
									if( res.Ret === 200 ){
										this.getUserlist();
										this.$message.success( res.Msg );
									}
						        })
						    }
						});
					}).catch(() => {  });
				},
				handleCurrentChange(current) { //分页页码跳转
					this.page = current;
					this.getUserlist();
				},
				handleSizeChange(val) { //分页页码改变
					this.pageSize = val;
					this.getUserlist();
				},
				viewdetails(id) { //查看详情
					this.$router.push({
			   			path:"/authuserdtl/"+id
			   		});
// 			   		let {href} = this.$router.resolve({path:`/authuserdtl/${id}`});
// 					window.open(href,'_blank');
				}
				

			}
	}
</script>

<style lang="scss">
	#regUserlist{ padding:20px 20px 85px; box-sizing:border-box; min-width:1200px;
		.header .el-form-item{ margin-bottom:0; }
		.el-card__header{ padding-bottom:10px; }
		.el-form-item--mini.el-form-item,.el-form-item--small.el-form-item{ margin-bottom:10px; }
	}
</style>