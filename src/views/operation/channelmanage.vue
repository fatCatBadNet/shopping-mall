<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent>
		  			<el-form-item label="公司">
						<el-select v-model.number="form.CompanyId" clearable placeholder="请选择" style="width:170px;">
						    <el-option v-for="(item,index) in companylist" :key="index" :label="item.Name" :value="item.Id"></el-option>
						</el-select>
					</el-form-item>
		  			<el-form-item label="渠道名">
		  		   		<el-select v-model="form.SourceName" clearable filterable placeholder="请选择">
					    	<el-option v-for="item in SourceArr" :key="item.Value" :label="item.Label" :value="item.Label"></el-option>
					  	</el-select>
		  			</el-form-item>
		  			<el-form-item label="日期">
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:280px;"></el-date-picker>
		  			</el-form-item>
		  			<el-form-item label="结算方式">
						<el-select v-model="form.BalanceType" clearable placeholder="请选择" style="width:170px;">
						    <el-option label="单条结算" value="单条结算"></el-option>
						    <el-option label="综合结算" value="综合结算"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="计价方式">
						<el-select v-model="form.BalanceWay" clearable placeholder="请选择" style="width:170px;">
						    <el-option label="CPA" value="CPA"></el-option>
						    <el-option label="CPA阶梯" value="CPA阶梯"></el-option>
						    <el-option label="CPS" value="CPS"></el-option>
						    <el-option label="CPS阶梯" value="CPS阶梯"></el-option>
						</el-select>
					</el-form-item>
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
		  			<!--<el-form-item style="float:right;"><el-button type="primary" size="small" @click="goSave({},false)">添加</el-button></el-form-item>-->
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;">
					<el-table-column prop="CreateTime" label="日期"></el-table-column>
					<el-table-column prop="Company" label="公司"></el-table-column>
					<el-table-column prop="SourceName" label="渠道名"></el-table-column>
					<el-table-column prop="NumRegister" label="注册人数"></el-table-column>
					<el-table-column prop="NumCert" label="认证人数"></el-table-column>
					<el-table-column prop="NumCredit" label="授信通过人数" :render-header="renderHeader4" min-width="100"></el-table-column>
					<el-table-column prop="MoneyCredit" label="授信通过金额" :render-header="renderHeader5" min-width="100"></el-table-column>
					<el-table-column prop="FirstNumLoanApply" label="首次借款人数" :render-header="renderHeader1" min-width="100"></el-table-column>
					<el-table-column prop="FirstNumPass" label="首次借款通过人数" :render-header="renderHeader2" min-width="100"></el-table-column>
					<el-table-column prop="FirstMoneyPass" label="首次借款通过金额" :render-header="renderHeader3" min-width="100"></el-table-column>
					<!-- <el-table-column label="操作">
						<template slot-scope="scope">
	  	    		        <span class="editwordSty" @click="goSave(scope.row,true)">编辑</span>
  	    		        	<a :href="scope.row.CompanyLink" target="_blank" class="editwordSty">甲方链接</a>
		  	    		</template>
					</el-table-column> -->
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
				<span style="font:14px/32px '微软雅黑';">
					合计：注册人数 <label class="editwordSty">{{TotalNumRegister}}</label> &nbsp;&nbsp;&nbsp; 
					认证人数 <label class="editwordSty">{{TotalNumCert}}</label> &nbsp;&nbsp;&nbsp; 
					总费用 <label class="editwordSty">{{TotalCost}}</label> &nbsp;&nbsp;&nbsp; 
					<b v-if="IsShow">{{BalanceWay}} | {{BalanceType}}</b>
				</span>
		  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		  	</el-col>
		</el-card>
		<!-- 添加/编辑弹框 -->
		<el-dialog title="添加/编辑渠道" :visible.sync="showDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="800px">
			<el-form :model="infoForm" :rules="rules" label-width="120px" ref="infoForm">
				<el-form-item label="公司名称" prop="CompanyId">
					<el-select v-model="infoForm.CompanyId" clearable placeholder="请选择" :disabled="isAdd" style="width:60%;" @change="changeCompany">
						<el-option v-for="(item,index) in companylist" :key="index" :label="item.Name" :value="item.Id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="渠道名称" prop="SourceName">
					<el-input v-model="infoForm.SourceName" placeholder="请输入英文字母" auto-complete="off" @change="inputSource" style="width:60%;"></el-input>
				</el-form-item>
				<el-form-item label="" prop="SourceLink">
					<el-input v-model="'https://a.5ujr.cn/wallet/index?source='+infoForm.SourceName" disabled auto-complete="off" style="width:60%;"></el-input>
					<span class="copyBtn" :data-clipboard-text="infoForm.SourceLink" @click="copyUrl" style="color:#3A94F8; cursor:pointer; margin-left:20px;">复制</span>
				</el-form-item>
				<el-form-item label="渠道状态" prop="State">
					<el-switch v-model="infoForm.State" active-text="启用" active-value="ON" inactive-text="停用" inactive-value="OFF"></el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="infoSubmit">保存</el-button>
				<el-button @click.native="showDialog=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import http from "../../api/http.js";
import { companyselect,channellist,addoreditsource } from 'api/api.js';
import Clipboard from 'clipboard';
let clipboard = new Clipboard('.copyBtn');
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
			companylist:[],
			page:1,
			total:0,
			pageSize:15,
			ispage:true,
			listLoading:false,
			tableData:[],
			TotalNumRegister:null,
			TotalNumCert:null,
			TotalCost:null,
			IsShow:false,
			BalanceWay:'',
			BalanceType:'',
			SourceArr:[],
			form:{ 
				CompanyId:'',
				SourceName:'',
				BalanceType:'',
				BalanceWay:'',
				dateValue:[http.dateFormatter(new Date(new Date().getTime()-14*24*60*60*1000),false),http.dateFormatter(new Date(),false)]
			},
			showDialog:false,
			isAdd:false,
			infoForm:{
				"Company": "",
				"CompanyId":null,
				"SourceId": 0,
				"SourceLink": "",
				"SourceName": "",
				"State":"ON"
			},
			rules:{
				CompanyId:[{
					required:true,
					message:'请选择公司名称',
					trigger:'blur'
				}],
				SourceName:[{
					required:true,
					message:'渠道名称不得为空',
					trigger:'blur'
				}],
				SourceLink:[{
					required:true,
					message:'渠道链接不得为空',
					trigger:'blur'
				}]
			}
		}
	},
	mounted(){
		companyselect({}).then((res) => {
			if( res.Ret!=200 ){
				return false;
			}
			this.companylist=res.List || [];
		});
		this.getlist();
	},
	methods: {
		renderHeader1(h,{column,$index}){ //首次借款人数
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
		        h('el-tooltip',{props:{placement:'top',content:'指注册当天申请借款的人数'}},
					[ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		},
		renderHeader2(h,{column,$index}){ //首次借款通过人数
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
		        h('el-tooltip',{props:{placement:'top',content:'指注册当天借款通过的人数'}},
					[ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		},
		renderHeader3(h,{column,$index}){ //首次借款通过金额
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
		        h('el-tooltip',{props:{placement:'top',content:'指注册当天借款成功的金额'}},
					[ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		},
		renderHeader4(h,{column,$index}){ //授信通过人数
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
		        h('el-tooltip',{props:{placement:'top',content:'指注册当天授信通过人数'}},
					[ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		},
		renderHeader5(h,{column,$index}){ //授信通过金额
			return h("div",{attrs:{style:"padding:0;"}},[
		        h("span",column.label),
		        h('el-tooltip',{props:{placement:'top',content:'指注册当天授信通过金额'}},
					[ h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'') ]
				)
		    ]);
		},
		inputSource(){
			this.infoForm.SourceLink="https://a.5ujr.cn/wallet/index?source="+this.infoForm.SourceName;
		},
		copyUrl(){  //复制到粘贴板
			if( !this.infoForm.SourceName ){
				this.$message.error('请先输入渠道名称！');
				return false;
			}
			this.$message.success('复制成功！');
		},
		changeCompany(){
			this.companylist.forEach(item=>{
				if( item.Id==this.infoForm.CompanyId ){
					this.infoForm.Company=item.Name;
				}
			});
		},
		goSave(item,type){
			if( type ){
				this.infoForm=Object.assign({},item);
				this.inputSource();
			}else{
				this.infoForm={
					"Company": "",
					"CompanyId":null,
					"SourceId": 0,
					"SourceLink":"",
					"SourceName":"",
					"State":"ON"
				}
			}
			console.log( this.infoForm );
			this.isAdd=type;
			this.showDialog=true;
		},
		infoSubmit(){
			this.$refs.infoForm.validate((valid) => {
				if( valid ){
					let params=this.infoForm;
					addoreditsource(params).then((res) => {
						if( res.Ret!=200 ){
							return false;
						}
						this.getlist();
						this.resetForm('infoForm');
						this.showDialog=false;
						this.isAdd=false;
					});	
				}
			});
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
			if( this.form.CompanyId=='' ){
				this.form.CompanyId=null;
			}
			let params = {
				Page:this.page,
				PageSize:this.pageSize,
				CompanyId:this.form.CompanyId,
				SourceName:this.form.SourceName,
				BalanceType:this.form.BalanceType,
				BalanceWay:this.form.BalanceWay
			};
			if( !this.form.dateValue ){
				params.StartTime='';
				params.EndTime='';
			}else{
				params.StartTime=this.form.dateValue[0]+' 00:00:00';
				params.EndTime=this.form.dateValue[1]+' 23:59:59';
			}
			this.listLoading = true;
			channellist(params).then((res) => {
				console.log(res);
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.Result.UserSum;
				this.SourceArr=res.Sources || [];
				this.TotalNumRegister=res.Result.TotalNumRegister;
				this.TotalNumCert=res.Result.TotalNumCert;
				this.TotalCost=res.Result.TotalCost;
				this.IsShow=res.Result.IsShow;
				this.BalanceWay=res.Result.BalanceWay;
				this.BalanceType=res.Result.BalanceType;
				if(res.Result.List == null){
					this.tableData = [];
				}else{
					this.tableData = res.Result.List;
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
	.header .el-form-item{ margin-bottom:0; }
</style>