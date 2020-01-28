<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">修改密码</div>
			<el-form :model="addForm" :rules="rules" label-width="120px" ref="addForm" style="width:500px;">
				<el-form-item label="原密码" prop="OldPwd">
		          	<el-input type="text" v-model="addForm.OldPwd" placeholder="请输入不超过20个字符"></el-input>
		        </el-form-item>
		        <el-form-item label="新密码" prop="NewPwd" v-if="visible">
					<el-input type="password" v-model="addForm.NewPwd" placeholder="请输入长度不超过20个字符" maxlength="20">
		            	<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
		          	</el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="NewPwd" v-else>
		          	<el-input type="text" v-model="addForm.NewPwd" placeholder="请输入长度不超过20个字符" maxlength="20">
		            	<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
		          	</el-input>
		        </el-form-item>
				<el-form-item style="text-align:center; padding-top:20px;">
					<el-button type="primary" @click="addSubmit">确定</el-button>
					<el-button @click.native="historyBack">返回</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import { updatepwd } from 'api/api.js';
	export default {
		data() {
			return {
				visible:true,
				addForm:{
					OldPwd:'',
					NewPwd:''
				},
				rules: {
					OldPwd: [{
						required:true,
						message:'请输入原密码',
						trigger:'blur'
					}],
					NewPwd: [{
						required:true,
						message:'请输入新密码',
						trigger:'blur'
					}]
				}
			}
		},
		mounted() {
			
		},
		methods: {
			changePass(value){
	        	this.visible = !(value === 'show');
	     	},
	     	addSubmit(){
	     		this.$refs.addForm.validate((valid) => {
					if( valid ){
						let that=this;
						let params = that.addForm;
						updatepwd(params).then((res) => {
							if( res.Ret === 200 ){
								that.$message.success("修改密码成功,请重新登录！");
								setTimeout(function(){
//									sessionStorage.removeItem('userDtl');
//									sessionStorage.removeItem('meundata');
//									sessionStorage.removeItem('Xtn');
//									sessionStorage.removeItem('isLoadNodes');
//									sessionStorage.removeItem('Token');
									sessionStorage.clear();
									localStorage.removeItem('checkPass');
//									that.$router.push('/login');
									window.location.reload();
								},1000);
							}
						});
					}
				});
	     	},
	     	historyBack(){  //返回上一页
		    	history.back();
		    }
		}
	}
</script>

<style scoped lang="scss"></style>