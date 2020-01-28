<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent>
                    <el-form-item label="渠道">
						<el-select v-model="form.Source" placeholder="请选择渠道" clearable filterable style="width:200px;">
							<el-option v-for="(item,index) in Sources" :key="index" :label="item.Label" :value="item.Label"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="时间">
						<el-date-picker  v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="hasFastRepaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:250px;"></el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="search">搜索</el-button>
					</el-form-item>
				</el-form>
			</div>
			<template>
				<el-table :data="tableData"  v-loading="listLoading" element-loading-text="数据加载中..." border >
					<el-table-column prop="CreateTime" label="日期" min-width="120"></el-table-column>
					<el-table-column prop="Source" label="渠道" min-width="120"></el-table-column>
					<el-table-column prop="PV" label="PV" min-width="120" :render-header="(h,obj) => renderHeader(h,obj,'浏览页面访客数量')"></el-table-column>
					<el-table-column prop="UV" label="UV" min-width="120" :render-header="(h,obj) => renderHeader(h,obj,'独立访客用户数量')"></el-table-column>
					<el-table-column prop="NumRegister" label="注册用户" min-width="120"></el-table-column>
					<el-table-column prop="Jihuo" label="激活数" min-width="120" :render-header="(h,obj) => renderHeader(h,obj,'注册登录app的用户数量')"></el-table-column>
					<el-table-column prop="NumCert" label="认证用户" min-width="120"></el-table-column>
					<el-table-column prop="NumLoanApplyL" label="申请借款" min-width="120" :render-header="(h,obj) => renderHeader(h,obj,'用户申请借款的数量')"></el-table-column>
					<el-table-column prop="NumLoanSuccess" label="借款通过" min-width="120" :render-header="(h,obj) => renderHeader(h,obj,'成功放款用户的数量')"></el-table-column>
					<el-table-column prop="LoanSuccessRate" label="借款通过率" min-width="120" :render-header="(h,obj) => renderHeader(h,obj,'借款通过/申请借款')"></el-table-column>
					<!-- <el-table-column prop="TransformRate" label="转化率" min-width="120" :render-header="(h,obj) => renderHeader(h,obj,'借款通过/注册量')"></el-table-column> -->
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
				<span style="font:14px/32px '微软雅黑';">
                    <el-tooltip  effect="dark" content="累计注册量" placement="bottom-start">
                        <span>总注册量</span>
                    </el-tooltip>
					<label class="editwordSty">{{TotalNumRegister}}</label> &nbsp;&nbsp;&nbsp; 
                    <el-tooltip  effect="dark" content="借款通过/申请借款" placement="bottom-start">
                        <span>借款通过率</span>
                    </el-tooltip>
					<label class="editwordSty">{{TotalLoanSuccessRate}}</label>&nbsp;&nbsp;&nbsp; 
                    <!-- <el-tooltip  effect="dark" content="借款通过/注册量" placement="bottom-start">
                        <span>转化率</span>
                    </el-tooltip>
					<label class="editwordSty">{{TotalTransformRate}}</label>&nbsp;&nbsp;&nbsp;  -->
				</span>
				<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
			</el-col>
		</el-card>
	</div>
</template>

<script>
	import http from "api/http.js";
	import { sourcedata } from "api/api.js";
	export default {
		data() {
			return {
                pickerOptions: {
					onPick(e){
						this.$nextTick(()=>{
							var a=  document.getElementsByClassName('el-icon-arrow-right');
							a[1].removeAttribute('disabled');
							a[1].classList.remove('is-disabled');
						})
					},
                    shortcuts: [{
                        text: '近7天',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '近14天',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
                        picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '近30天',
                        onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                        }
                    }]
                },
				page: 1,
				total: 0,
				pageSize: 15,
				ispage: true,
				listLoading: false,
				tableData: [],
				Sources:[],
				form: {
					OperateType:1,
					Source:"",//渠道
					dateValue: [http.dateFormatter(new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000),false),http.dateFormatter(new Date(), false)]
				},
				TotalNumRegister: "",
				TotalLoanSuccessRate: "",
				TotalTransformRate: "",
				TotalRealMoney: "",
				showDialog:false
			};
		},
		mounted() {
			this.getsourcedata();
		},
		methods: {
            renderHeader(h,{column,$index},str){
                return h("div",{attrs:{style:"vertical-align:middle;padding:0;line-height:1;"}},[
                    h("span",column.label),
                    h('el-tooltip',{props:{placement:'top',content:str}},
                        [ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none;padding:0 20px;"}},'') ]
                    )
                ]);
            },
			search() { //搜索
				this.ispage = false;
				this.$nextTick(() => {
					this.page = 1;
					this.getsourcedata();
					this.ispage = true;
				});
			},
			getsourcedata() { //获取催收列表
				let params = {
					Page: this.page,
					PageSize: this.pageSize,
					Source: this.form.Source,
					OperateType:this.form.OperateType
				};
				if(!this.form.dateValue) {
					params.StartTime = "";
					params.EndTime = "";
				} else {
					params.StartTime = this.form.dateValue[0] + " 00:00:00";
					params.EndTime = this.form.dateValue[1] + " 23:59:59";
				}
				this.listLoading = true;
				sourcedata(params).then(res => {
					if( res.Ret==200 ){
						this.total = res.Result.UserSum;
						this.TotalNumRegister = res.Result.TotalData.TotalNumRegister;
						this.TotalLoanSuccessRate = res.Result.TotalData.TotalLoanSuccessRate;
						this.TotalTransformRate = res.Result.TotalData.TotalTransformRate;
						this.Sources=res.Sources || [];
						this.tableData = res.Result.List || [];
						this.listLoading = false;
					}
				});
			},
			handleCurrentChange(current) {  //分页页码跳转
				this.page = current;
				this.getsourcedata();
			},
			handleSizeChange(val) {  //分页页码改变
				this.pageSize = val;
				this.getsourcedata();
			}
		}
	};
</script>

<style scoped lang="scss">
	.header .el-form-item {
		margin-bottom: 0;
	}
	
	.status-img {
		width: 20px;
		vertical-align: middle;
	}
</style>