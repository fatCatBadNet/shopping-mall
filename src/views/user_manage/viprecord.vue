<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent>
					<el-form-item label="手机">
		  		   		<el-input v-model="form.UserAccount" placeholder="请输入" clearable style="width:135px;"></el-input>
		  			</el-form-item>
		  			<el-form-item label="姓名">
		  		   		<el-input v-model="form.UserName" placeholder="请输入" clearable style="width:130px;"></el-input>
		  			</el-form-item>
					<el-form-item label="购买时间">
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width:240px;"></el-date-picker>
		  			</el-form-item>
		  			<el-form-item label="报告类型">
						<el-select v-model="form.VipRechargeType" clearable placeholder="请选择" style="width:120px;">
						    <el-option label="借款报告" :value="1"></el-option>
						    <el-option label="拒绝报告" :value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="状态">
						<el-select v-model="form.State" clearable placeholder="请选择" style="width:120px;">
							<el-option label="处理中" :value="'CONFIRM'"></el-option>
						    <el-option label="成功" :value="'SUCCESS'"></el-option>
						    <el-option label="失败" :value="'FAIL'"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="支付通道">
						<el-select v-model="form.Channel" clearable placeholder="请选择" style="width:120px;">
							<el-option v-for="(item,index) in DefaultChannels" :key="index" :label="item.Description" :value="item.DiyCode"></el-option>
						    <!-- <el-option label="合利宝" :value="3"></el-option>
						    <el-option label="预付费" :value="4"></el-option>
						    <el-option label="畅捷" :value="8"></el-option> -->
						</el-select>
					</el-form-item>
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
		  			<el-form-item style="float:right;"><el-button type="primary" size="small" @click="dailyusersdataexportexcel">导出</el-button></el-form-item>
		  		</el-form>
			</div>
			<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;">
				<el-table-column prop="Account" label="手机" min-width="90"></el-table-column>
				<el-table-column prop="Verifyrealname" label="姓名"></el-table-column>
				<el-table-column prop="CreateTime" label="购买时间" min-width="130"></el-table-column>
				<el-table-column prop="DtOrder" label="回调时间" min-width="130"></el-table-column>
				<el-table-column prop="OrderNumber" label="订单号" min-width="220"></el-table-column>
				<el-table-column label="报告类型">
					<template slot-scope="scope">
	    		        <span>{{scope.row.VipRechargeType==1?'借款报告':'拒绝报告'}}</span>
	  	    		</template>
				</el-table-column>
				<el-table-column prop="RealMoney" label="支付金额（元）" min-width="110"></el-table-column>
				<el-table-column prop="ChannelString" label="支付通道"></el-table-column>
				<el-table-column label="状态" min-width="190">
					<template slot-scope="scope">
	    		    	<span v-if="scope.row.State=='SUCCESS'" style="color:#000;">成功</span>
	    		    	<span v-else-if="scope.row.State=='FAIL'" style="color:#ff7100;">失败</span>
	    		    	<span v-else style="color:#409eff;">处理中</span>
	    		    	<label style="margin-left:10px;">{{scope.row.Remark}}</label>
	  	    		</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
	    		        <el-button type="primary" plain size="mini"  @click="viewdetails(scope.row.Uid)">查看</el-button>
	  	    		</template>
				</el-table-column>
			</el-table>
			<el-col :span="24" class="toolbar">
		  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		  	</el-col>
		</el-card>
	</div>
</template>

<script>
import http from "../../api/http.js";
import { viplist } from 'api/api.js';
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
			page:1,
			total:0,
			pageSize:15,
			ispage:true,
			listLoading:false,
			tableData:[],
			DefaultChannels:[],
			form:{
				VipRechargeType:null,
				UserAccount:'',
				UserName:'',
				Channel:null, //支付渠道 1-连连 2-支付宝 3-合利宝 5-易宝
				State:'',  //放款状态 SUCCESS-成功 CONFIRM-放款中 FAIL-失败
				dateValue:[http.dateFormatter(new Date(new Date().getTime()-14*24*60*60*1000),false),http.dateFormatter(new Date(),false)]
			}
		}
	},
	mounted(){
		this.getlist();
	},
	methods: {
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
				UserAccount:this.form.UserAccount,
				UserName:this.form.UserName,
				Channel:this.form.Channel || null,
				State:this.form.State,
				VipRechargeType:this.form.VipRechargeType || null
			};
			if( !this.form.dateValue ){
				params.StartTime='';
				params.EndTime='';
			}else{
				params.StartTime=this.form.dateValue[0]+' 00:00:00';
				params.EndTime=this.form.dateValue[1]+' 23:59:59';
			}
			this.listLoading = true;
			viplist(params).then((res) => {
				if( res.Ret==200 ){
					this.total=res.Result.UserSum;
					this.tableData = res.Result.List || [];
					this.DefaultChannels=res.Result.DefaultChannels || [];
					this.listLoading = false;
				}
			});
		},
		handleCurrentChange(current){  //分页页码跳转
			this.page = current;
			this.getlist();
		},
		handleSizeChange(val){    //分页页码改变
	        this.pageSize=val;
	        this.getlist();
	   	},
	   	viewdetails(id){  //查看详情
//	   		this.$router.push({
//	   			path:"/authuserdtl/"+id
//	   		});
			let {href} = this.$router.resolve({path:`/authuserdtl/${id}`});
			window.open(href,'_blank');
	   	},
	   	dailyusersdataexportexcel(){
	   		if( !this.form.dateValue ){
	   			this.$message.error("购买时间范围不得为空！");
				return false;
			}
	   		let url=process.env.API_ROOT+"/export/viprechargelistdataexportexcel?start_time="+this.form.dateValue[0]+" 00:00:00&end_time="+this.form.dateValue[1]+" 23:59:59&merchant="+JSON.parse( sessionStorage.getItem('userDtl') ).Merchant+"&user_account="+this.form.UserAccount+"&user_name="+this.form.UserName+"&vip_recharge_type="+this.form.VipRechargeType+"&state="+this.form.State+"&channel="+this.form.Channel+"&account="+JSON.parse( sessionStorage.getItem('userDtl') ).Account;
			window.location.href=url;
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
</style>