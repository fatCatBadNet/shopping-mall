<template>
	<div>
		<el-card class="box-card">
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;">
					<el-table-column prop="Name" label="控制项"></el-table-column>
					<el-table-column prop="Remark" label="描述"></el-table-column>
					<el-table-column prop="Content" label="弹窗内容" min-width="300"></el-table-column>
					<el-table-column label="开关">
						<template slot-scope="scope">
	  	    		        <el-switch v-model="scope.row.IsUse" active-text="启用" active-value="USE" inactive-text="禁用" inactive-value="UNUSED" disabled @change="freezeDtl(scope.row.Id,scope.row.IsUse)"></el-switch>
		  	    		</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
	  	    		        <el-button type="primary" plain size="mini" @click="eidtDtl(scope.row)">修改</el-button>
		  	    		</template>
					</el-table-column>
				</el-table>
			</template>
		</el-card>
		<!-- 修改弹框 -->
		<el-dialog title="修改" :visible.sync="showDialog_edit" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="600px">
			<el-form :model="editForm" label-width="100px" ref="editForm">
				<el-form-item label="弹窗内容">
					<el-input type="textarea" v-model="editForm.Content" placeholder="请输入弹窗内容" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="开关" prop="IsUse">
					<el-switch v-model="editForm.IsUse" active-text="启用" active-value="USE" inactive-text="禁用" inactive-value="UNUSED"></el-switch>
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
import { bizcontrollist,bizcontrolisused,bizcontroledit } from 'api/api.js';
export default {
	data(){
		return {
			listLoading:false,
			tableData:[],
			showDialog_edit:false,
			editForm:{ }
		}
	},
	mounted(){
		this.getbizcontrollist();
	},
	methods: {
		getbizcontrollist(){  //获取列表
			let params = {};
			this.listLoading = true;
			bizcontrollist(params).then((res) => {
				if( res.List == null ){
					this.tableData = [];
				}else{
					this.tableData = res.List;
				}
				this.listLoading = false;
			});
		},
		freezeDtl(id,isUsed){  //禁用、启用
			let params = {Id:id,IsUsed:isUsed}
			bizcontrolisused(params).then((res) => {
				if( res.Ret == 200 ){
					this.$message.success( res.Msg );
					this.getbizcontrollist();
				}
				if(res.Ret == 100){
					this._sendCode(params,bizcontrolisused).then(res=>{
							if( res.Ret === 200 ){
								this.$message.success( res.Msg );
								this.getbizcontrollist();
							}
					})
				}
			});
		},
      	editSubmit(){  //修改（提交）
      		if( !this.editForm.Content ){
      			this.$message.error('弹窗内容不得为空！');
      			return false;
      		}
      		let params = {
      			Content:this.editForm.Content,
      			Id:this.editForm.Id,
      			IsUse:this.editForm.IsUse
      		}
      		bizcontroledit(params).then((res) => {
      			if(res.Ret == 200){
					this.showDialog_edit = false;
					this.$message.success( res.Msg );
					this.getbizcontrollist();
					this.resetForm('editForm');
				  }
				  if(res.Ret == 100){
					this._sendCode(params,bizcontroledit).then(res=>{
							if( res.Ret === 200 ){
								this.showDialog_edit = false;
								this.$message.success( res.Msg );
								this.getbizcontrollist();
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
      	resetForm(formName){  //重置表单
        	this.$refs[formName].resetFields();
      	}
      	
	}
}	
</script>

<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
</style>