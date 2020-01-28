<template>
	<div style="padding-bottom:80px;">
		<el-card class="box-card">
			<div slot="header" class="header" style="position: relative;">
				<el-form :inline="true" :model="form" @submit.native.prevent>
					<el-form-item label="登录时间">
						<el-date-picker v-model="form.dateValue" type="daterange"   :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:240px;"></el-date-picker>
					</el-form-item>
					
					<el-form-item>
						<el-select v-model="form.Ctype" placeholder="请选择审核类型" style="width:140px;">
							<el-option  label="登录账户" :value="1"></el-option>
							<el-option  label="用户名" :value="2"></el-option>
						</el-select>
					</el-form-item>
                    <el-form-item >
						<el-input v-model="form.UserAccount"  :placeholder="form.Ctype==1?'请输入登录账户':'请输入用户名'" clearable style="width:140px;"></el-input>
					</el-form-item>
					<el-form-item label="登录IP">
						<el-input v-model="form.Ip"  placeholder="请输入登录IP" clearable style="width:140px;"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="small" @click="search">搜索</el-button>
					</el-form-item>
				</el-form>
			</div>
			<template>
				<el-table :data="tableData"  v-loading="listLoading" element-loading-text="数据加载中..." border >
					<el-table-column prop="CreateTime" label="登录时间" min-width="120"></el-table-column>
					<el-table-column prop="Account" label="登录账户" min-width="100"></el-table-column>
					<el-table-column prop="Username" label="用户名" min-width="100"></el-table-column>
					<el-table-column prop="Ip" label="登录IP" min-width="100"></el-table-column>
					<el-table-column prop="Browser" label="浏览器" min-width="100"></el-table-column>
					<el-table-column prop="System" label="操作系统" min-width="100"></el-table-column>
					<el-table-column prop="NetType" label="网络类型" min-width="100"></el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
				<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
			</el-col>
		</el-card>
	</div>
</template>

<script>
	import http from "api/http.js";
	import { loginlog } from "api/api.js";
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
				page:1,
				total:0,
				pageSize:15,
				ispage:true,
				listLoading:false,
				tableData:[],
				form: {
					Ctype:1, // 类型 1-登录账户 2-登录用户名
					UserAccount: "", //登录账号or用户名
					Ip:"",//登录IP
					dateValue: [http.dateFormatter(new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000),false),http.dateFormatter(new Date(), false)]
				},
			};
		},
		mounted() {
			this.getloginlog();
		},
		methods: {

			search() { //搜索
				this.ispage = false;
				this.$nextTick(() => {
					this.page = 1;
					this.getloginlog();
					this.ispage = true;
				});
			},
			getloginlog() { 
				let params = {
					Page: this.page,
					PageSize: this.pageSize,
					Ctype:this.form.Ctype,
					Ip:this.form.Ip
				};
				if(!this.form.dateValue) {
					params.StartTime = "";
					params.EndTime = "";
				} else {
					params.StartTime = this.form.dateValue[0] + " 00:00:00";
					params.EndTime = this.form.dateValue[1] + " 23:59:59";
				}
				if(this.form.Ctype==1){
					params.LoginAccount = this.form.UserAccount;
				}else{
					params.UserName = this.form.UserAccount;
				}
				this.listLoading = true;
				loginlog(params).then(res => {
					console.log(res);
					if(res.Ret != 200) {
						return false;
					}
					this.tableData = res.List || [];
					this.total=res.UserSum;
					this.pageCount = Math.ceil(this.total/this.pageSize);
					this.listLoading = false;
				});
			},
			handleCurrentChange(current) {  //分页页码跳转
				this.page = current;
				this.getloginlog();
			},
			handleSizeChange(val) {  //分页页码改变
				this.pageSize = val;
				this.getloginlog();
			}
		}
	};
</script>

<style scoped lang="scss">
	.header .el-form-item {
		margin-bottom: 0;
	}
</style>