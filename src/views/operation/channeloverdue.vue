<template>
	<div style="padding-bottom:80px;">
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent>

                    <el-form-item label="渠道">
						<el-select v-model="form.Source" placeholder="请选择渠道" clearable filterable style="width:200px;">
							<el-option v-for="(item,index) in Sources" :key="index" :label="item.Label" :value="item.Label"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="时间">
						<el-date-picker  v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="hasFastRepaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:240px;"></el-date-picker>
					</el-form-item>

					<el-form-item>
						<el-button type="primary"  @click="search">搜索</el-button>
					</el-form-item>
				</el-form>
			</div>
			<template>
				<el-table :data="tableData" r v-loading="listLoading" element-loading-text="数据加载中..." border >
					<el-table-column prop="CreateTime" label="日期" min-width="120"></el-table-column>
					<el-table-column prop="Source" label="渠道" min-width="120"></el-table-column>
					<el-table-column prop="TotalExpireMoney" label="到期金额" min-width="120" :render-header="(h,obj) => renderHeader(h,obj,'指总合同金额（注意：到期金额为合同金额，不包含逾期费等）')"></el-table-column>
					<el-table-column prop="TotalPayMoney" label="已还金额" min-width="120" :render-header="(h,obj) => renderHeader(h,obj,'总还款金额，包含滞纳金、违约金、服务费、日利率 包括提前还款、逾期还款')"></el-table-column>
					<el-table-column prop="TotalNopayMoney" label="未还金额" min-width="120" :render-header="(h,obj) => renderHeader(h,obj,'总合同金额即可')"></el-table-column>
					<el-table-column prop="OverdueRate" label="逾期率" min-width="120" :render-header="(h,obj) => renderHeader(h,obj,'总逾期金额/总到期金额')"></el-table-column>
					<el-table-column prop="FirstOverdueRate" label="首借逾期率" min-width="120" :render-header="(h,obj) => renderHeader(h,obj,'首次借款用户逾期金额/首次借款用户到期总金额（若用户还款，则需更新数据）')"></el-table-column>
					<el-table-column prop="NoFirstOverdueRate" label="复借逾期率" min-width="120" :render-header="(h,obj) => renderHeader(h,obj,'复借逾期金额/复借到期总金额')"></el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
				<span style="font:14px/32px '微软雅黑';">
                    <el-tooltip  effect="dark" content="当前条件下的总借款金额" placement="bottom-start">
                        <span>总借款金额</span>
                    </el-tooltip>
					<label class="editwordSty">{{AllTotalExpireMoney}}</label> &nbsp;&nbsp;&nbsp; 
                    <el-tooltip  effect="dark" content="首次借款用户逾期金额/首次借款用户到期总金额" placement="bottom-start">
                        <span>首借逾期率</span>
                    </el-tooltip>
					<label class="editwordSty">{{AllFirstOverdueRate}}</label>&nbsp;&nbsp;&nbsp; 
                    <el-tooltip  effect="dark" content="复借逾期金额/复借到期总金额" placement="bottom-start">
                        <span>复借逾期率</span>
                    </el-tooltip>
					<label class="editwordSty">{{AllNoFirstOverdueRate}}</label>&nbsp;&nbsp;&nbsp; 
                    <el-tooltip  effect="dark" content="总逾期金额/总到期金额" placement="bottom-start">
                        <span>逾期率</span>
                    </el-tooltip>
					<label class="editwordSty">{{AllOverdueRate}}</label>
				</span>
				<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
			</el-col>
		</el-card>


	</div>
</template>

<script>
	import http from "api/http.js";
	import { sourceoverduedata } from "api/api.js";
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
				pageCount: 1,
				ispage: true,
				listLoading: false,
				tableData: [],
				Sources:[],
				form: {
					Source:"",//渠道
					dateValue: [http.dateFormatter(new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000),false),http.dateFormatter(new Date(), false)]
				},
				AllTotalExpireMoney: "",
				AllFirstOverdueRate: "",
				AllNoFirstOverdueRate: "",
				AllOverdueRate: "",
				showDialog:false,
			};
		},
		mounted() {
			this.getsourceoverduedata();
		},
		methods: {
            renderHeader(h,{column,$index},str){
                return h("div",{attrs:{style:"vertical-align: middle;padding: 0;line-height: 1;"}},[
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
					this.getsourceoverduedata();
					this.ispage = true;
				});
			},
			getsourceoverduedata() { //获取催收列表
				let params = {
					Page: this.page,
					PageSize: this.pageSize,
					Source: this.form.Source
				};
				if(!this.form.dateValue) {
					params.StartTime = "";
					params.EndTime = "";
				} else {
					params.StartTime = this.form.dateValue[0] + " 00:00:00";
					params.EndTime = this.form.dateValue[1] + " 23:59:59";
				}
				this.listLoading = true;
				sourceoverduedata(params).then(res => {
					console.log(res);
					if(res.Ret != 200) {
						return false;
					}
					this.total = res.Result.UserSum;
					this.AllTotalExpireMoney = res.Result.TotalData.AllTotalExpireMoney;
					this.AllFirstOverdueRate = res.Result.TotalData.AllFirstOverdueRate;
					this.AllNoFirstOverdueRate = res.Result.TotalData.AllNoFirstOverdueRate;
					this.AllOverdueRate = res.Result.TotalData.AllOverdueRate;
					this.Sources=res.Sources || [];
					if(res.Result.List == null) {
						this.tableData = [];
					} else {
						this.tableData = res.Result.List;
						this.pageCount = Math.ceil(this.total / this.pageSize);
					}
					this.listLoading = false;
				});
			},
			handleCurrentChange(current) {  //分页页码跳转
				this.page = current;
				this.getsourceoverduedata();
			},
			handleSizeChange(val) {  //分页页码改变
				this.pageSize = val;
				this.getsourceoverduedata();
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