<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent>
		  			<el-form-item label="场景">
		  				<el-input v-model="form.Scene" placeholder="请输入" clearable></el-input>
		  			</el-form-item>
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
		  			<!--<el-form-item style="float:right;"><el-button type="primary" size="small">短信变量对照表</el-button></el-form-item>-->
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;">
					<el-table-column prop="Scene" label="场景"></el-table-column>
					<el-table-column prop="Title" label="标题"></el-table-column>
					<el-table-column prop="Content" label="系统消息内容" min-width="300"></el-table-column>
					<el-table-column label="状态">
						<template slot-scope="scope">
	  	    		        <el-switch v-model="scope.row.State" active-text="启用" :active-value="1" inactive-text="禁用" :inactive-value="0" @change="freezeDtl(scope.row.Id,scope.row.State)"></el-switch>
		  	    		</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
	  	    		        <el-button type="primary" plain size="mini" @click="eidtDtl(scope.row)">编辑</el-button>
		  	    		</template>
					</el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
		  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		  	</el-col>
		</el-card>
		<!-- 修改弹框 -->
		<el-dialog :title="editForm.Scene" :visible.sync="showDialog_edit" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="850px">
			<el-form :model="editForm" label-width="100px" ref="editForm">
				<el-form-item label="短信内容">
					<el-input type="textarea" v-model="editForm.Content" placeholder="请输入短信内容" auto-complete="off" style="width:50%;"></el-input>
					<p class="spansty">
						<label>如使用变量，请遵循以下规则插入：<br /></label>
						<span v-for="(item,index) in contrast" :key="index">{{item.ValueName}} : {{item.VarName}}<br/></span>
					</p>
				</el-form-item>
				<el-form-item label="状态" prop="State">
					<el-switch v-model.number="editForm.State" active-text="启用" :active-value="1" inactive-text="禁用" :inactive-value="0"></el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="editSubmit">提交</el-button>
				<el-button @click.native="showDialog_edit=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import http from "../../api/http.js";
import { sysmsgtpllist,sysmsgtplisused,sysmsgtpledit,varcontrast } from 'api/api.js';
export default {
	data(){
		return {
			page:1,
			total:0,
			pageSize:15,
			pageCount:1,
			ispage:true,
			listLoading:false,
			tableData:[],
			form:{ Scene:'' }, 
			showDialog_edit:false,
			editForm:{ },
			contrast:[],
			batches:[]  //选中id数组
		}
	},
	mounted(){
		this.getsysmsgtpllist();
		varcontrast({}).then((res) => {
			if( res.Ret == 200 ){
				this.contrast=res.List || [];
			}
		});
	},
	methods: {
		search(){  //搜索
			this.ispage = false;
			this.$nextTick(() => {
				this.page = 1;
				this.getsysmsgtpllist();
				this.ispage = true;
			});
		},
		getsysmsgtpllist(){  //获取列表
			let params = {Scene:this.form.Scene,PageSize:this.pageSize,Page:this.page};
			this.listLoading = true;
			sysmsgtpllist(params).then((res) => {
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.Result.Sum;
				if( res.Result.List == null ){
					this.tableData = [];
				}else{
					this.tableData = res.Result.List;
					this.pageCount = Math.ceil(this.total/this.pageSize);
				}
				this.listLoading = false;
			});
		},
		freezeDtl(id,isUsed){  //禁用、启用
			isUsed=isUsed==1?"USE":"UNUSED";
			let params = {Id:id,IsUsed:isUsed}
			sysmsgtplisused(params).then((res) => {
				if( res.Ret == 200 ){
					this.$message.success( res.Msg );
					this.getsysmsgtpllist();
				}
				if(res.Ret == 100){
					this._sendCode(params,sysmsgtplisused).then(res=>{
							if( res.Ret === 200 ){
								this.$message.success( res.Msg );
								this.getsysmsgtpllist();
							}
					})
				}
			});
		},
      	editSubmit(){  //修改（提交）
      		if( !this.editForm.Content ){
      			this.$message.error('短信内容不得为空！');
      			return false;
      		}
      		let params = {
      			Content:this.editForm.Content,
      			Id:this.editForm.Id,
      			State:this.editForm.State
      		}
      		sysmsgtpledit(params).then((res) => {
      			if(res.Ret == 200){
					this.showDialog_edit = false;
					this.$message.success( res.Msg );
					this.getsysmsgtpllist();
					this.resetForm('editForm');
				  }
				if(res.Ret == 100){
					this._sendCode(params,sysmsgtpledit).then(res=>{
							if( res.Ret === 200 ){
								this.showDialog_edit = false;
								this.$message.success( res.Msg );
								this.getsysmsgtpllist();
								this.resetForm('editForm');
							}
					})
				}
      		});
      	},
      	eidtDtl(item){  
			this.editForm=Object.assign({},item);
			this.showDialog_edit = true;
      	},
      	handleCurrentChange(current){  //分页页码跳转
			this.page = current;
			this.getsysmsgtpllist();
		},
		handleSizeChange(val){    //分页页码改变
	        this.pageSize=val;
	        this.getsysmsgtpllist();
	   	},
	   	resetForm(formName){  //重置表单
        	this.$refs[formName].resetFields();
      	}
		
	}
}	
</script>

<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
	.spansty{ width:45%; color:#999; font:13px/22px "微软雅黑"; float:right; }
</style>