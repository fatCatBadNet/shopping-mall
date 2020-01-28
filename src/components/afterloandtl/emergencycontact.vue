<template>
    <section class="section">
        <div v-for="(item,index) in LinkmanList" :key="index" class="item">
            <el-col :span="10">
            	<p>{{item.Relation}}</p>
            	<p>
					<span>{{item.ContactPhoneNumber}}</span>
					<span v-if="item.LinkName">（{{item.LinkName}}）</span>
				</p>
            </el-col>
            <el-col :span="7" v-if="item.SignState==0" style="line-height:40px; color:#999;"></el-col>
            <el-col :span="7" v-else style="line-height:40px; color:#999;">{{item.SignState==1?'正常':item.SignState==2?'虚假':item.SignState==3?'异常':''}}/{{item.SignRemark}}</el-col>
            <el-col :span="7" class="btns">
            	<el-button type="primary" plain size="small" @click="comparison(item.ContactPhoneNumber)">比对</el-button>
              	<el-button type="primary" plain size="small" @click="goSign(item)">标记</el-button>
            </el-col>
        </div>
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
		</el-dialog>
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
    </section>
</template>
<script>
import { phonelinkman,datacomparison,signlinkman } from 'api/api.js';
export default {
    props: {
	    uid: {
	      type: String,
	      default: { type: "" }
	    }
	},
    data(){
        return{
			page:1,
			total:0,
			pageSize:15,
			pageCount:1,
			ispage:true,
			LinkmanList:[],
			showDialog:false,
			TelephoneList:{},  //通讯录比对结果
			Mobile15:{},  //通话记录比对结果
			remarkDialog:false,
			infoForm:{
				"SignContent":"",
				"SignId":0,
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
		this.getlist();
	},
	methods: {
		getlist(){
			let params = {Uid:parseInt(this.uid),Page:this.page,PageSize:this.pageSize,SearchAccount:''};
			this.listLoading = true;
			phonelinkman(params).then((res) => {
				if( res.Result.LinkmanList == null ){
					this.LinkmanList = [];
				}else{
					this.LinkmanList = res.Result.LinkmanList;
				}
			});
		},
		goSign(item){
			this.infoForm.SignId=item.Id;
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
					let params={SignId:this.infoForm.SignId,SignContent:this.infoForm.SignContent,SignState:parseInt(this.infoForm.SignState)};
					signlinkman(params).then((res) => {
						if( res.Ret==200 ){
							this.$message.success( res.Msg );
							this.remarkDialog = false;
							this.resetForm('infoForm');
							this.getlist();
						}
					});
				}
			});
		},
		comparison(phone){  //弹框唤醒
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
		},
		resetForm(formName){  //重置表单
      		this.$nextTick(() => {
		        this.$refs[formName].resetFields();
		    });
      	}
      	
	}
	
}
</script>
<style lang="scss" scoped>
.section{
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
        p:first-child{ margin-bottom:5px; }
        .btns{ position:absolute; top:20px; right:20px; }
    }
}
.section:-webkit-scrollbar{
    display: none;
} 
</style>


