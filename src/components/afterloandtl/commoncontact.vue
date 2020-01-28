<template>
	<div>
		<div style="height:50px; line-height:50px; margin:10px 10px 10px 0; text-align:center;">
			<el-col :span="3">
				<el-button type="primary" plain size="mini" style="background:#fff; color:#333; border-color:#ccc;">归属地</el-button>
			</el-col>
			<!--<el-col :span="5">
				<el-button type="primary" size="mini" style="color:#fff; background:#A55915; border:none;">近3月联系次数</el-button>
			</el-col>-->
			<el-col :span="4">
				<el-button type="primary" size="mini" style="color:#fff; background:#FE8926; border:none;">总呼叫数</el-button>
			</el-col>
			<el-col :span="4">
				<el-button type="primary" size="mini" style="color:#fff; background:#FEA64C; border:none;">主动呼叫数</el-button>
			</el-col>
			<el-col :span="4">
				<el-button type="primary" size="mini" style="color:#fff; background:#FEBE79; border:none;">被动呼叫数</el-button>
			</el-col>
		</div>
		<div v-for="(item,index) in tableData" :key="index" style="height:50px; line-height:50px; margin:10px 10px 10px 0; text-align:center; border:1px solid #eaeaea;">
			<el-col :span="4">{{item.Phone}}</el-col>
			<el-col :span="2"><el-button type="primary" plain size="mini" style="background:#fff; color:#333; border-color:#ccc;">{{item.Phone_location}}</el-button></el-col>
			<!--<el-col :span="2"><el-button type="primary" size="mini" style="width:50px; color:#fff; background:#A55915; border:none;">{{item.Contact_3m}}</el-button></el-col>-->
			<el-col :span="2"><el-button type="primary" size="mini" style="width:50px; color:#fff; background:#FE8926; border:none;">{{item.Talk_cnt}}</el-button></el-col>
			<el-col :span="2"><el-button type="primary" size="mini" style="width:50px; color:#fff; background:#FEA64C; border:none;">{{item.Call_cnt}}</el-button></el-col>
			<el-col :span="2"><el-button type="primary" size="mini" style="width:50px; color:#fff; background:#FEBE79; border:none;">{{item.Called_cnt}}</el-button></el-col>
			<el-col :span="5">
				<el-button type="primary" plain size="mini" @click="comparison(item.Phone)">比对</el-button>
				<el-button type="primary" plain size="mini" @click="goSign(item)">标记</el-button>
			</el-col>
			<el-col :span="4" style="text-align:left;">
				<span v-if="item.SignState==0"></span>
				<span v-else>{{item.SignState==1?'正常':item.SignState==2?'虚假':item.SignState==3?'异常':''}}/{{item.SignRemark}}</span>
			</el-col>
		</div>
		<el-col :span="24" class="toolbar">
	  		<el-pagination v-if="ispage" small layout="total,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[10,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total"></el-pagination>
	  	</el-col>
		<!-- 数据比对弹框 -->
		<el-dialog title="数据比对" :visible.sync="showDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="600px" top="35vh">
			<table border="0" cellspacing="0" cellpadding="0" style="width:100%; text-align:center; font:14px/50px '微软雅黑'; cursor:pointer;">
				<tr style="background:#eaeaea;">
					<th>通讯录对比</th>
				</tr>
				<tr style="color:red;">
					<td>
						<span v-if="JSON.stringify(TelephoneList)!='{}'">{{TelephoneList.ContactName}}&nbsp;{{TelephoneList.ContactPhoneNumber}}</span>
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
	</div>
</template>

<script>
	import {colloperatordata,datacomparison,signcommonlinkman} from 'api/api.js';
	export default {
		props:{
      		uid:{
        		type:String,
        		default:{type:''}
      		}
    	},
		data() {
			return {
				page:1,
				total:0,
				pageSize:10,
				ispage:true,
				listLoading:false,
				tableData: [],
				showDialog:false,
				bankFrom:{},
				TelephoneList:{},  //通讯录比对结果
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
		mounted() {
			this.getoperatordata();
		},
		methods: {
			getoperatordata(){  //获取手机运营商信息列表
				let params = {Uid:parseInt(this.uid),PageSize:this.pageSize,Page:this.page};
				this.listLoading = true;
				colloperatordata(params).then((res) => {
					if( res.Ret!=200 ){
						return false;
					}
					this.total=res.UserSum;
					if( res.List == null ){
						this.tableData = [];
					}else{
						this.tableData = res.List;
					}
					this.listLoading = false;
				});
			},
			comparison(phone){
				let params={IsOperator:false,Mobile:phone,Uid:parseInt(this.uid)};
				datacomparison(params).then((res) => {
					if( res.Ret==200 ){
						if( res.TelephoneList!=null ){
							this.TelephoneList=res.TelephoneList[0];
						}else{
							this.TelephoneList={};
						}
						this.showDialog = true;
					}
				});
			},
			goSign(item){
				this.infoForm.Mobile=item.Phone;
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
						signcommonlinkman(params).then((res) => {
							if( res.Ret==200 ){
								this.$message.success( res.Msg );
								this.remarkDialog = false;
								this.resetForm('infoForm');
								this.getoperatordata();
							}
						});
					}
				});
			},
			handleCurrentChange(current){  //分页页码跳转
				this.page = current;
				this.getoperatordata();
			},
			handleSizeChange(val){    //分页页码改变
		        this.pageSize=val;
		        this.getoperatordata();
		   	},
			resetForm(formName){  //重置表单
	      		this.$nextTick(() => {
			        this.$refs[formName].resetFields();
			    });
	      	}

		}
	}
</script>

<style scoped lang="scss"></style>