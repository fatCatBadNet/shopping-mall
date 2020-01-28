<template>
	<div>
		<el-row style="margin:10px auto 20px;">
		  	<el-col :span="5" v-for="(item,index) in LinkmanList" :key="index" style="margin:10px;">
			    <el-card shadow="always" style="font:12px/30px '微软雅黑'; padding-bottom:15px;">
					<el-col :span="14">{{item.Relation}}</el-col>
					<el-col :span="10">
						<a :href="'https://www.baidu.com/s?ie=UTF-8&amp;wd='+item.ContactPhoneNumber" target="_blank" class="editwordSty">百度搜索</a>
					</el-col>
					<el-col :span="14">
						<span>{{item.ContactPhoneNumber}}</span>
						<span v-if="item.LinkName">（{{item.LinkName}}）</span>
					</el-col>
					<el-col :span="10">
						<el-button type="primary" size="mini" @click="comparison(item.ContactPhoneNumber)">数据比对</el-button>
					</el-col>
			    </el-card>
		  	</el-col>
		</el-row>
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent>
		  			<el-form-item label="手机号">
		  				<el-input v-model="form.SearchAccount" placeholder="请输入" clearable></el-input>
		  			</el-form-item>
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
					<el-table-column label="姓名">
						<template slot-scope="scope">
	  	    		        <span>{{scope.row.ContactName}}</span>
		  	    		</template>
					</el-table-column>
					<el-table-column prop="ContactPhoneNumber" label="手机号"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<a :href="'https://www.baidu.com/s?ie=UTF-8&amp;wd='+scope.row.ContactPhoneNumber" target="_blank" class="editwordSty">百度搜索</a>
		  	    		</template>
					</el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
		  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		  	</el-col>
		</el-card>
		<!-- 数据对比弹框 -->
		<el-dialog title="数据比对" :visible.sync="showDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="600px" top="35vh">
			<table border="0" cellspacing="0" cellpadding="0" style="width:100%; text-align:center; font:14px/50px '微软雅黑'; cursor:pointer;">
				<tr style="background:#eaeaea;">
					<th>通讯录对比</th>
					<th>通话记录top15对比</th>
				</tr>
				<tr style="color:red;">
					<td>
						<span v-if="JSON.stringify(TelephoneList)!='{}'">{{TelephoneList.ContactName}} &nbsp; {{TelephoneList.ContactPhoneNumber}}</span>
						<span v-else>无</span>
					</td>
					<td>
						<span v-if="JSON.stringify(Mobile15)!='{}'">{{Mobile15.ContactPhoneNumber}} &nbsp;&nbsp; {{Mobile15.MonType}} &nbsp;&nbsp; {{Mobile15.ConnectCount}}次</span>
						<span v-else>无</span>
					</td>
				</tr>
			</table>
			<br />
		</el-dialog>
	</div>
</template>

<script>
import http from "../../api/http.js";
import { phonelinkman,datacomparison } from 'api/api.js';
export default {
	props:{
  		uid:{
    		type:String,
    		default:{type:''}
  		}
	},
	data(){
		return {
			page:1,
			total:0,
			pageSize:15,
			pageCount:1,
			ispage:true,
			listLoading:false,
			tableData:[],
			LinkmanList:[],
			form:{ SearchAccount:null }, 
			showDialog:false,
			addForm:{  //新增
				Days:null,
				LimitMoney:null
			},
			editForm:{  //新增
				LimitMoney:null
			},
			TelephoneList:{},  //通讯录比对结果
			Mobile15:{}  //通话记录比对结果
		}
	},
	mounted(){
		this.getphonelinkman();
	},
	methods: {
		search(){  //搜索
			this.ispage = false;
			this.$nextTick(() => {
				this.page = 1;
				this.getphonelinkman();
				this.ispage = true;
			});
		},
		getphonelinkman(){  //获取列表
			let params = {Uid:parseInt(this.uid),Page:this.page,PageSize:this.pageSize,SearchAccount:this.form.SearchAccount};
			this.listLoading = true;
			phonelinkman(params).then((res) => {
				this.total=res.Result.UserSum;
				if( res.Result.TelephoneList == null ){
					this.tableData = [];
				}else{
					this.tableData = res.Result.TelephoneList;
					this.pageCount = Math.ceil(this.total/this.pageSize);
				}
				if( res.Result.LinkmanList == null ){
					this.LinkmanList = [];
				}else{
					this.LinkmanList = res.Result.LinkmanList;
				}
				this.listLoading = false;
			});
		},
		handleCurrentChange(current){  //分页页码跳转
			this.page = current;
			this.getphonelinkman();
		},
		handleSizeChange(val){    //分页页码改变
	        this.pageSize=val;
	        this.getphonelinkman();
	   	},
		comparison(phone){  //编辑角色弹框唤醒
			let params={IsOperator:true,Mobile:phone,Uid:parseInt(this.uid)};
			datacomparison(params).then((res) => {
				if( res.Ret==200 ){
					if( res.TelephoneList!=null ){
						this.TelephoneList=res.TelephoneList[0];
					}else{
						this.TelephoneList={};
					}
					if( res.Mobile15!=null ){
						this.Mobile15=res.Mobile15;
					}else{
						this.Mobile15={};
					}
					this.showDialog = true;
				}
			});
		}
      
      	
	}
}	
</script>

<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
	.el-card{ padding-bottom:0; }
</style>