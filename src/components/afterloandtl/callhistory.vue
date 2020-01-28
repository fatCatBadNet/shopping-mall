<template>
	<div>
		<div v-for="(item,index) in tableData" :key="index" class="item">
            <el-col :span="8">
            	<span class="title">{{item.ContactName}}</span>
            	<span class="value">{{item.ContactPhoneNumber}}</span>
            </el-col>
            <el-col :span="8" v-if="item.SignState==0" style="line-height:40px; color:#999;"></el-col>
            <el-col :span="8" v-else style="line-height:40px; color:#999;">{{item.SignState==1?'正常':item.SignState==2?'虚假':item.SignState==3?'异常':''}}/{{item.SignRemark}}</el-col>
            <el-col :span="8" class="btns">
              	<el-button type="primary" plain size="small" @click="goSign(item)">标记</el-button>
            </el-col>
        </div>
		<el-col :span="24" class="toolbar">
	  		<el-pagination v-if="ispage" small layout="total,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[10,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total"></el-pagination>
	  	</el-col>
	  	<!-- 标记弹框 -->
		<el-dialog title="标记" :visible.sync="remarkDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="330px">
			<el-form :model="infoForm" :rules="rules" ref="infoForm">
				<el-form-item prop='SignState'>
					<el-radio-group v-model="infoForm.SignState" size="medium" @change="infoForm.SignContent=''">
				      	<el-radio border :label="1">正常</el-radio>
				      	<el-radio border :label="2">虚假</el-radio>
				      	<el-radio border :label="3">异常</el-radio>
				    </el-radio-group>
				</el-form-item>
				<el-form-item prop='SignContent' v-if="infoForm.SignState==2">
				    <el-select v-model="infoForm.SignContent" placeholder="请选择具体描述">
				      	<el-option label="非本人" value="非本人"></el-option>
				      	<el-option label="空号" value="空号"></el-option>
				      	<el-option label="停机" value="停机"></el-option>
				      	<el-option label="暂停服务" value="暂停服务"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item prop='SignContent' v-if="infoForm.SignState==3">
				    <el-select v-model="infoForm.SignContent" placeholder="请选择具体描述">
				      	<el-option label="无人接听" value="无人接听"></el-option>
				      	<el-option label="非本人接听" value="非本人接听"></el-option>
				      	<el-option label="无法通话" value="无法通话"></el-option>
				      	<el-option label="通话中" value="通话中"></el-option>
				      	<el-option label="不在服务区" value="不在服务区"></el-option>
				      	<el-option label="关机" value="关机"></el-option>
				    </el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="infoSubmit">提交</el-button>
				<el-button @click.native="remarkDialog=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import http from "../../api/http.js";
import { phonelinkman,signtelephone } from 'api/api.js';
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
			pageSize:10,
			pageCount:1,
			ispage:true,
			tableData:[],
			remarkDialog:false,
			infoForm:{
				"SignContent":"",
				"Mobile":0,
				"Uid":null,
				"SignState":0   //标记状态 0-未标记 1-正常 2-虚假 3-异常
			},
			rules:{
				SignState:[{
					required:true,
					message:'请选择行动分类'
				}],
				SignContent:[{
					required:true,
					message:'请选择行动分类'
				}]
			}
		}
	},
	mounted(){
		this.getphonelinkman();
	},
	methods: {
		getphonelinkman(){  //获取列表
			let params = {Uid:parseInt(this.uid),Page:this.page,PageSize:this.pageSize,SearchAccount:null};
			phonelinkman(params).then((res) => {
				this.total=res.Result.UserSum;
				if( res.Result.TelephoneList == null ){
					this.tableData = [];
				}else{
					this.tableData = res.Result.TelephoneList;
					this.pageCount = Math.ceil(this.total/this.pageSize);
				}
			});
		},
		goSign(item){
			this.infoForm.Mobile=item.ContactPhoneNumber;
			this.infoForm.SignContent=item.SignRemark;
			this.infoForm.SignState=item.SignState;
			this.remarkDialog = true;
		},
		infoSubmit(){
			this.$refs.infoForm.validate((valid) => {
				if( valid ){
					if( parseInt(this.infoForm.SignState)==1 ){
						this.infoForm.SignContent='';
					}
					let params={Uid:parseInt(this.uid),Mobile:this.infoForm.Mobile,SignContent:this.infoForm.SignContent,SignState:parseInt(this.infoForm.SignState)};
					signtelephone(params).then((res) => {
						if( res.Ret==200 ){
							this.$message.success( res.Msg );
							this.remarkDialog = false;
							this.resetForm('infoForm');
							this.getphonelinkman();
						}
					});
				}
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
	   	resetForm(formName){  //重置表单
      		this.$nextTick(() => {
		        this.$refs[formName].resetFields();
		    });
      	}
      	
	}
}	
</script>

<style scoped lang="scss">
	.item{
        width:90%; height:72px;
        border-radius:4px;
        color:rgba(16, 16, 16, 1);
        font:14px/20px "微软雅黑";
        box-sizing: border-box;
        padding: 15px 17px;
        box-shadow: 1px 1px 4px 0px rgba(197, 201, 208, 1);
        border: 1px solid rgba(255, 255, 255, 0);
        margin:15px auto;
        color: #101010;
        font-size: 14px;
        position: relative;
        span{
            display: block;
            
        }
        span:first-child{
                margin-bottom: 5px;
            }
        .btns{
            position: absolute;
            top: 20px;
            right: 20px;
        }
    }
</style>