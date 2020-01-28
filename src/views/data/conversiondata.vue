<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header" style="position:relative;">
				<el-form :inline="true" :model="form" @submit.native.prevent>
					<el-form-item label="日期">
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:280px;"></el-date-picker>
		  			</el-form-item>
		  			<el-form-item label="数据类型">
						<el-select v-model="form.DataType" placeholder="请选择" @change="search" style="width:180px;">
						    <el-option label="按人数统计" :value="1"></el-option>
						    <el-option label="按人数比例统计" :value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item >
                        <div  slot="label">
                            <span>转化周期</span> 
                            <el-tooltip class="item-tooltip" effect="dark" placement="top">
                                <div slot="content">当天注册的用户在转化周期内完成后续的<br/>转化，会计入对应转化项中。——举例：<br/>转化周期为3天，1月1日统计的实名申请<br/>数为1月1日注册且在1日至3日实名申请的<br/>用户<br/></div>
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </div>
						<el-select v-model="form.Cycle" placeholder="请选择" style="width:180px;">
						    <el-option label="1天" :value="1"></el-option>
						    <el-option label="3天" :value="3"></el-option>
						    <el-option label="7天" :value="7"></el-option>
						</el-select>
					</el-form-item>
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
		  			<el-form-item v-if="ExportButton">
						<el-button type="primary" size="small" @click="exportexcel">导出</el-button>
					</el-form-item>
		  		</el-form>
			</div>
			<template>
				<el-table v-if="form.DataType==1" :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;">
					<el-table-column prop="CreateTime" label="日期" min-width="90"></el-table-column>
					<el-table-column prop="NumRegister" label="注册"></el-table-column>
					<el-table-column prop="NumCertApply" label="实名申请"></el-table-column>
					<el-table-column prop="NumCert" label="实名通过"></el-table-column>
					<el-table-column prop="NumLiving" label="活体通过"></el-table-column>
					<el-table-column prop="NumLinkMan" label="紧急联系人"></el-table-column>
					<el-table-column prop="NumMobile" label="运营商认证" ></el-table-column>
					<el-table-column prop="NumZm" label="芝麻信用"></el-table-column>
					<el-table-column prop="NumBankCard" label="收款银行卡" ></el-table-column>
                    <el-table-column prop="NumCreditApply" label="授信申请"></el-table-column>
                    <el-table-column prop="NumCredit" label="授信通过"></el-table-column>
                    <!-- <el-table-column prop="NumLoanRpt" label="首次购买信用报告" min-width="110"></el-table-column> -->
                    <el-table-column prop="NumLoanApply" label="首次借款申请" min-width="90"></el-table-column>
                    <el-table-column prop="NumLoanSuccess" label="首次借款通过" min-width="90"></el-table-column>
				</el-table>
				<el-table v-if="form.DataType==2" :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;">
					<el-table-column prop="CreateTime" label="日期" min-width="90"></el-table-column>
					<el-table-column prop="NumRegister" label="注册"></el-table-column>
					<el-table-column prop="ProCertApply" label="实名申请"></el-table-column>
					<el-table-column prop="ProCert" label="实名通过"></el-table-column>
					<el-table-column prop="ProLiving" label="活体通过"></el-table-column>
					<el-table-column prop="ProLinkMan" label="紧急联系人"></el-table-column>
					<el-table-column prop="ProMobile" label="运营商认证" ></el-table-column>
					<el-table-column prop="ProZm" label="芝麻信用"></el-table-column>
					<el-table-column prop="ProBankCard" label="收款银行卡" ></el-table-column>
                    <el-table-column prop="ProCreditApply" label="授信申请"></el-table-column>
                    <el-table-column prop="ProCredit" label="授信通过"></el-table-column>
                    <!-- <el-table-column prop="ProLoanRpt" label="首次购买信用报告" min-width="110"></el-table-column> -->
                    <el-table-column prop="ProLoanApply" label="首次借款申请" min-width="90"></el-table-column>
                    <el-table-column prop="ProLoanSuccess" label="首次借款通过" min-width="90"></el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
		  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		  	</el-col>
		</el-card>
	</div>
</template>

<script>
import http from "../../api/http.js";
import { saasusersconverdaily, buttonctl} from 'api/api.js';
export default {
	data(){
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
			ExportButton:false,
			page:1,
			total:0,
			pageSize:15,
			pageCount:1,
			ispage:true,
			listLoading:false,
			tableData:[],
			form:{ 
				DataType:1,
				Cycle:1,  
				dateValue:[http.dateFormatter(new Date(new Date().getTime()-14*24*60*60*1000),false),http.dateFormatter(new Date(),false)]
			}
		}
	},
	mounted(){
		this.getlist();
		buttonctl({}).then((res) => {  
			console.log(res);
			this.ExportButton=false;
			if( res.Ret==200 && res.AllCtl.ExportButton ){
				this.ExportButton=res.AllCtl.ExportButton;
			}
		});
	},
	methods: {
		exportexcel(){  //导出数据
	   		if( !this.form.dateValue ){
	   			this.$message.error("日期不得为空！");
				return false;
			}	   
	   		let url= `${process.env.API_ROOT}/export/saasusersconverdailyexportexcel?start_time=${this.form.dateValue[0]} 00:00:00&end_time=${this.form.dateValue[1]} 23:59:59&merchant=${JSON.parse( sessionStorage.getItem('userDtl') ).Merchant}&account=${JSON.parse( sessionStorage.getItem('userDtl') ).Account}&data_type=${this.form.DataType}&cycle=${this.form.Cycle}`;
			window.location.href=url;
	   	},
		search(){  //搜索
			this.ispage = false;
			this.$nextTick(() => {
				this.page = 1;
				this.getlist();
				this.ispage = true;
			});
		},
		getlist(){  //获取认证用户列表
			let params = {
				Page:this.page,
				PageSize:this.pageSize,
				DataType:this.form.DataType,
				Cycle:this.form.Cycle
			};
			if( !this.form.dateValue ){
				params.StartTime='';
				params.EndTime='';
			}else{
				params.StartTime=this.form.dateValue[0]+' 00:00:00';
				params.EndTime=this.form.dateValue[1]+' 23:59:59';
			}
			this.listLoading = true;
			saasusersconverdaily(params).then((res) => {
				console.log(res);
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.Result.UserSum;
				this.TotalLoanMoney=res.Result.TotalLoanMoney;
				this.TotalRealMoney=res.Result.TotalRealMoney;
				if(res.Result.List == null){
					this.tableData = [];
				}else{
					this.tableData = res.Result.List;
					this.pageCount = Math.ceil(this.total/this.pageSize);
				}
				this.listLoading = false;
			});
		},
		handleCurrentChange(current){  //分页页码跳转
			this.page = current;
			this.getlist();
		},
		handleSizeChange(val){    //分页页码改变
	        this.pageSize=val;
	        this.getlist();
	    }
		
	}
}	
</script>

<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
	.status-img{
		width: 20px;
		vertical-align: middle;
	}
    .item-tooltip{}
</style>