<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header" style="text-align:right;">
		  		<el-button type="primary" size="small" @click="goSetting">设置预警阈值</el-button>
		  		<el-button type="primary" size="small" @click="goSave({},false)">添加</el-button>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;">
					<el-table-column prop="Name" label="姓名"></el-table-column>
					<el-table-column prop="Phone" label="手机号"></el-table-column>
					<el-table-column prop="Email" label="邮箱"></el-table-column>
					<el-table-column prop="Position" label="职位"></el-table-column>
					<el-table-column prop="NoticeWay" label="接收方式"></el-table-column>
					<el-table-column prop="Business" label="预警业务" min-width="130"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
	  	    		        <span class="editwordSty" @click="goSave(scope.row.Id,true)">编辑</span>
  	    		        	<span class="editwordSty" @click="goDel(scope.row.Id)">删除</span>
		  	    		</template>
					</el-table-column>
				</el-table>
			</template>
		</el-card>
		<!-- 添加/编辑弹框 -->
		<el-dialog title="添加/编辑业务预警" :visible.sync="showDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="700px">
			<el-form :model="infoForm" label-width="100px" ref="infoForm" :rules="rules">
				<el-form-item label="姓名" prop="Name">
					<el-input v-model="infoForm.Name" placeholder="请输入" auto-complete="off" style="width:60%;"></el-input>
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input v-model="infoForm.Email" placeholder="请输入" auto-complete="off" style="width:60%;"></el-input>
				</el-form-item>
				<el-form-item label="手机">
					<el-input v-model="infoForm.Phone" placeholder="请输入" auto-complete="off" maxlength="11" style="width:60%;"></el-input>
				</el-form-item>
				<el-form-item label="职位" prop="Position">
					<el-input v-model="infoForm.Position" placeholder="请输入" auto-complete="off" style="width:60%;"></el-input>
				</el-form-item>
				<el-form-item label="接收方式" prop="NoticeWay">
					<el-checkbox-group v-model="infoForm.NoticeWay">
				    	<el-checkbox label="邮件" name="NoticeWay"></el-checkbox>
				      	<el-checkbox label="短信" name="NoticeWay"></el-checkbox>
				    </el-checkbox-group>
				</el-form-item>
				<el-form-item label="预警业务" prop="Business" class="rolemanage">
					<el-checkbox-group v-model="infoForm.Business">
				    	<el-checkbox label="风控余额" name="Business"></el-checkbox>
				      	<el-checkbox label="短信余额" name="Business"></el-checkbox>
				      	<el-checkbox label="话费余额" name="Business"></el-checkbox>
				      	<el-checkbox label="放款计划" name="Business"></el-checkbox>
				      	<el-checkbox label="合利宝余额" name="Business"></el-checkbox>
				      	<el-checkbox label="畅捷余额" name="Business"></el-checkbox>
						<el-checkbox label="富友余额" name="Business"></el-checkbox>
						<el-checkbox label="易宝余额" name="Business"></el-checkbox>
				    </el-checkbox-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="infoSubmit('infoForm')">保存</el-button>
				<el-button @click.native="showDialog=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import http from "../../api/http.js";
import { bizalertlist,bizalerteditadd,bizalertdel,bizalertinfo } from 'api/api.js';
export default {
	data(){
		return {
			listLoading:false,
			tableData:[],
			showDialog:false,
			isAdd:false,
			infoForm:{
				"Business":[],
		  		"Email":"",
		  		"Id":0,
		  		"Name":"",
				"NoticeWay":[],
				"Phone":"",
				"Position":""
			},
			rules:{
				Name:[{required:true,message:'请输入姓名'}],
//				Email:[{required:true,message:'邮箱不得为空'}],
//				Phone:[{required:true,message:'请输入手机号'}],
				Position:[{required:true,message:'职位不得为空'}],
				NoticeWay:[{required:true,message:'请选择接收方式'}],
				Business:[{required:true,message:'请选择预警业务'}]
			}
		}
	},
	mounted(){
		this.getlist();
	},
	methods: {
		goSetting(){
			this.$router.push({path:'/threshold'})
		},
		goSave(id,type){  //编辑
			if( type ){
				bizalertinfo({Id:id}).then((res) => {
					if( res.Ret==200 ){
						this.infoForm=res.Result;	
						this.isAdd=type;
						this.showDialog=true;
					}
				});
			}else{
				this.infoForm={
					"Business":[],
				  	"Email":"",
				  	"Id":0,
				  	"Name":"",
				  	"NoticeWay":[],
				  	"Phone":"",
				  	"Position":""
				}
				this.isAdd=type;
				this.showDialog=true;
			}
		},
		goDel(id){  //删除
			this.$confirm('删除之后将无法收到消息预警，是否删除？','提示',{
				type:'warning'
			}).then(() => {
				bizalertdel({Id:id}).then((res) => {
					if( res.Ret==200 ){
						this.getlist();
					}
				});
			}).catch(() => {  });
		},
		infoSubmit(formName){
			this.$refs[formName].validate((valid)=>{
				if(valid){
					if( this.infoForm.NoticeWay.indexOf('邮件')>-1 ){
						if( !this.infoForm.Email ){
							this.$message.error("请输入邮箱！");
							return false;
						}
						if( this.infoForm.Email.indexOf('@')==-1 ){
							this.$message.error("邮箱格式输入不正确！");
							return false;
						}
					}
					if( this.infoForm.NoticeWay.indexOf('短信')>-1 ){
						if( !this.infoForm.Phone ){
							this.$message.error("请输入手机号！");
							return false;
						}
						if( !( /^1[34578]\d{9}$/.test(this.infoForm.Phone) ) ){
							this.$message.error("手机号格式输入不正确！");
							return false;
						}
					}
					let params=this.infoForm;
					bizalerteditadd(params).then((res) => {
						if( res.Ret!=200 ){
							return false;
						}
						this.getlist();
						this.resetForm('infoForm');
						this.showDialog=false;
						this.isAdd=false;
						this.$message.success( res.Msg );
					});
				}
			});
			
		},
		getlist(){  //获取认证用户列表
			let params = {};
			this.listLoading = true;
			bizalertlist(params).then((res) => {
				if( res.Ret!=200 ){
					return false;
				}
				if(res.List == null){
					this.tableData = [];
				}else{
					this.tableData = res.List;
				}
				this.listLoading = false;
			});
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