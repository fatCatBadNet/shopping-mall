<template>
	<div>
		<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
			<el-table-column prop="CreateTime" label="时间"></el-table-column>
			<el-table-column prop="Operator" label="操作人"></el-table-column>
			<el-table-column label="联系内容">
				<template slot-scope="scope">
    		    	<span>{{scope.row.Content}}</span>
    		    	<span style="float:right; color:#999;">复核时间：{{scope.row.CompositeDate}}</span>
  	    		</template>
			</el-table-column>
			<el-table-column label="联系类型">
				<template slot-scope="scope">
    		    	<!-- <span>{{scope.row.ConnType=='CHECKUP'?'贷前审查':scope.row.ConnType=='COLLECTION'?'贷后催收':scope.row.ConnType=='LETTER'?'信审联系':scope.row.ConnType=='CLIENTRECORD'?'客服记录':scope.row.ConnType=='COMPLANIT'?'投诉处理':scope.row.ConnType=='CASECHECKUP'?'案件审查':scope.row.ConnType=='CALLREMARK'?'客服类型':scope.row.ConnType=='LOSSLOANREMARK'?'流失用户列表':''}}</span> -->
					<span>{{scope.row.ConnType=='CHECKUP'?'贷前审查':scope.row.ConnType=='LETTER'?'信审联系':scope.row.ConnType=='CLIENTRECORD'?'客服记录':scope.row.ConnType=='COMPLANIT'?'投诉处理':scope.row.ConnType=='CASECHECKUP'?'案件审查':scope.row.ConnType=='CALLREMARK'?'客服记录':scope.row.ConnType=='LOSSLOANREMARK'?'客服记录':scope.row.ConnType=='RISKAPPROVAL'?'风控审核':scope.row.ConnType=='FINARECORDS'?'财务记录':scope.row.ConnType=='COLLECTION'?'贷后催记':''}}</span>
					<span style="color:#999; margin-left:20px;">{{scope.row.ActionType}}</span>
  	    		</template>
			</el-table-column>
		</el-table>
		<el-col :span="24" class="toolbar">
	  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
	  	</el-col>
	</div>
</template>

<script>
	import {connrecord} from 'api/api.js';
	export default {
		props:{
      		uid:{type:String,default:{type:''}}
    	},
		data(){
			return{
				page:1,
				total:0,
				pageSize:15,
				ispage:true,
				listLoading:false,
				tableData:[]
			}
		},
		mounted(){
			this.getList();
		},
		methods:{
			getList(){ //获取借款记录列表
				let params = {Uid:parseInt(this.uid),PageSize:this.pageSize,Page:this.page};
				this.listLoading = true;
				connrecord(params).then((res) => {
					if( res.Ret==200 ){
						this.total=res.Result.UserSum;
						this.tableData = res.Result.List || [];
						this.listLoading = false;
					}
				});
			},
			handleCurrentChange(current){  //分页页码跳转
				this.page = current;
				this.getList();
			},
			handleSizeChange(val){    //分页页码改变
		        this.pageSize=val;
		        this.getList();
		   	}
		}
	}
</script>

<style scoped lang="scss"></style>