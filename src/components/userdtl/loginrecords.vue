<template>
	<div>
		<template>
			<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
				<el-table-column prop="CreateTime" label="时间"></el-table-column>
				<el-table-column prop="Stage" label="操作"></el-table-column>
				<el-table-column prop="Location" label="定位"></el-table-column>
				<el-table-column prop="MobileType" label="手机型号"></el-table-column>
				<el-table-column prop="MobileVersion" label="系统版本号"></el-table-column>
				<el-table-column prop="AppVersion" label="APP版本号"></el-table-column>
				<el-table-column prop="Devicecode" label="设备ID" min-width="220"></el-table-column>
			</el-table>
		</template>
		<el-col :span="24" class="toolbar">
	  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
	  	</el-col>
	</div>
</template>

<script>
	import {loginrecords} from 'api/api.js';
	export default {
		props:{
      		uid:{
        		type:String,
        		default:{type:''}
      		}
    	},
		data() {
			return {
				page: 1,
				total: 0,
				pageSize: 15,
				pageCount: 1,
				ispage: true,
				listLoading: false,
				tableData: []
			}
		},
		mounted() {
			this.getloginrecords();
		},
		methods: {
			getloginrecords(){ //获取登录记录列表
				let params = {Uid:parseInt(this.uid),PageSize:this.pageSize,Page:this.page};
				this.listLoading = true;
				loginrecords(params).then((res) => {
					if( res.Ret!=200 ){
						return false;
					}
					this.total=res.Result.UserSum;
					if( res.Result.List == null ){
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
				this.getloginrecords();
			},
			handleSizeChange(val){    //分页页码改变
		        this.pageSize=val;
		        this.getloginrecords();
		   	}

		}
	}
</script>

<style scoped lang="scss"></style>