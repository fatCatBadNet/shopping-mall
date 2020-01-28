<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">{{jtitle}}</div>
			<el-form :model="Form" :rules="rules" label-width="120px" ref="Form" style="width:500px;">
				<el-form-item label="广告名称" prop="ActivityName">
		          	<el-input type="text" v-model="Form.ActivityName" placeholder="请输入"></el-input>
		        </el-form-item>
		        <el-form-item label="显示时间" prop="ShowTime">
		          	<el-date-picker v-model="Form.ShowTime" type="datetime" placeholder="请选择时间" @change="changeshowtime"></el-date-picker>
		        </el-form-item>
		        <el-form-item label="消失时间" prop="PastTime">
		          	<el-date-picker v-model="Form.PastTime" type="datetime" placeholder="请选择时间" @change="changepasttime"></el-date-picker>
		        </el-form-item>
		        <el-form-item label="上传图片" prop="Image">
					<el-upload class="avatar-uploader" :action="uploadUrl+'/upload/upload'" :data="{Merchant:merchant}" name="file" :show-file-list="false" :before-upload="addUpload" :on-success="handleAvatarSuccess">
						<img v-if="Form.Image" :src="Form.Image" class="avatar">
					  	<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
					<span>格式为jpg、png</span>
				</el-form-item>
		        <el-form-item label="广告链接地址">
		          	<el-input type="text" v-model="Form.Url" clearable placeholder="请输入链接地址（没有可为空，广告位即不可点）"></el-input>
		        </el-form-item>
		        <el-form-item label="排序号" prop="SortIndex">
		          	<el-input type="text" v-model="Form.SortIndex" placeholder="请输入排序号"></el-input>
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
	import { activityinfo,activityeditadd } from 'api/api.js';
	import http from "../../api/http.js";
	export default {
		data() {
			return {
				id:parseInt(this.$route.params.id),
				jtitle:this.$route.params.id==0?'添加广告':'编辑广告',
				uploadUrl:process.env.API_ROOT,
				merchant:JSON.parse(sessionStorage.getItem('userDtl')).Merchant,
				Form:{},
				rules: {
					ActivityName: [{
						required:true,
						message:'请输入广告名称',
						trigger:'blur'
					}],
					ShowTime: [{
						required:true,
						message:'请选择显示时间',
						trigger:'blur'
					}],
					PastTime: [{
						required:true,
						message:'请选择消失时间',
						trigger:'blur'
					}],
					ShowTime: [{
						required:true,
						message:'请选择显示时间',
						trigger:'blur'
					}],
					Url: [{
						required:true,
						message:'请输入广告链接地址',
						trigger:'blur'
					}],
					SortIndex: [{
						required:true,
						message:'请输入排序号',
						trigger:'blur'
					}],
					Image: [{
						required:true,
						message:'请先上传图片',
						trigger:'blur'
					}]
				}
			}
		},
		mounted() {
			if( this.id==0 ){
				this.Form={
					ActivityName:"",
				  	Id:0,
				  	Image:"",
				  	PastTime:"",
				  	ShowTime:"",
				  	SortIndex:0,
				  	Url:""
				}
			}else{
				activityinfo({Id:this.id}).then((res) => {
					if( res.Ret === 200 ){
						this.Form=res.Result;
						this.Form.ShowTime=http.parserDate(this.Form.ShowTime);
						this.Form.PastTime=http.parserDate(this.Form.PastTime);
						console.log(this.Form);
					}
				});
			}
		},
		methods: {
			changeshowtime(){
				console.log( http.dateFormatter(this.Form.ShowTime,true) );
			},
			changepasttime(){
				console.log( http.dateFormatter(this.Form.PastTime,true) );
			},
	     	addSubmit(){
	     		this.$refs.Form.validate((valid) => {
					if( valid ){
						let that=this;
						let params=Object.assign({},that.Form);
						params.ShowTime=http.dateFormatter(params.ShowTime,true);
						params.PastTime=http.dateFormatter(params.PastTime,true);
						params.SortIndex=parseInt(params.SortIndex);
						activityeditadd(params).then((res) => {
							if( res.Ret === 200 ){
								that.$message.success( res.Msg );
								that.$router.push('/adlist');
							}
						});
					}
				});
	     	},
	     	addUpload(file){
	      		let that=this;
		        const isJPG = file.type === 'image/jpeg';
		        const ispng = file.type === 'image/png';
		        const isLt2M = file.size / 1024 / 1024 < 3;
		        if( !isJPG&&!ispng ){
		        	this.$message.error('上传banner图片只能是 jpg/png 图片格式!');
		        	return false;
		        }
		        if( !isLt2M ){
		        	this.$message.error('上传banner图片大小不能超过 3MB!');
		        	return false;
		        }
	      	},
	      	handleAvatarSuccess(res,file){
	      		console.log(res);
	      		if( res.Ret==200 ){
	      			this.$message.success( res.Msg );
	      			this.Form.Image=res.Url;
	      		}
		    },
	     	historyBack(){  //返回上一页
		    	history.back();
		    }
		}
	}
</script>

<style scoped lang="scss">
	.avatar-uploader .el-upload{ border:1px dashed #d9d9d9; border-radius:6px; cursor:pointer; position:relative; overflow:hidden; }
  	.avatar-uploader .el-upload:hover{ border-color:#409EFF; }
  	.avatar-uploader-icon{ font:28px/140px "微软雅黑"; color:#8c939d; min-width:140px; height:140px; text-align:center; border:1px dotted #ccc; }
  	.avatar{ width:240px; height:120px; display:block; }
</style>