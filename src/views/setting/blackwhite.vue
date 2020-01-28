<template>
	<div>
		<el-tabs v-model="activeName">
		    <el-tab-pane label="白名单" name="白名单">
		    	<el-card class="box-card">
					<div slot="header" class="header">
						<el-form :inline="true" :model="form1" @submit.native.prevent>
				  			<el-form-item label="手机号">
				  				<el-input v-model="form1.UserAccount" placeholder="请输入手机号" clearable></el-input>
				  			</el-form-item>
				  			<el-form-item label="数据来源">
								<el-select v-model="form1.Source" clearable placeholder="请选择">
								    <el-option label="空" value="空"></el-option>
								    <el-option label="有脉爬取" value="有脉爬取"></el-option>
								</el-select>
							</el-form-item>
				  			<el-form-item><el-button type="primary" size="small" @click="search1">搜索</el-button></el-form-item>
				  			<el-form-item style="float:right;">
				  				<!--<el-upload :action="uploadUrl+'/namelib/inputexcel'" :data="{Merchant:merchant,IsBlack:false}" name="file" method:="post" :before-upload="addUpload" :on-success="handleSuccess1" :show-file-list="false" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
          							<el-button type="primary" size="small">导入白名单</el-button>
								</el-upload>-->
          						<el-button type="primary" size="small" @click="whiteDialog=true">导入白名单</el-button>
				  			</el-form-item>
							<el-form-item style="float:right;">
          						<el-button type="primary" size="small" @click="addWhiteListDialog=true">单条添加白名单</el-button>
				  			</el-form-item>
				  		</el-form>
					</div>
					<template>
						<el-table :data="tableData1" v-loading="listLoading1" element-loading-text="数据加载中..." border>
							<el-table-column prop="Id" label="序号"></el-table-column>
							<el-table-column prop="Mobile" label="手机号"></el-table-column>
							<el-table-column prop="IdCard" label="身份证号"></el-table-column>
							<el-table-column prop="CreateTime" label="时间"></el-table-column>
							<el-table-column prop="Source" label="数据来源"></el-table-column>
							<el-table-column prop="Username" label="操作人"></el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
			  	    		        <el-button type="primary" plain size="mini" @click="goDelWhite(scope.row)">移除</el-button>
				  	    		</template>
							</el-table-column>
						</el-table>
					</template>
					<el-col :span="24" class="toolbar">
				  		<el-pagination v-if="ispage1" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange1" :page-size="pageSize1" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange1" :total="total1" style="float:right;"></el-pagination>
				  	</el-col>
				</el-card>
				<!-- 白名单移除提示弹框 -->
				<el-dialog title="白名单移除提示" :visible.sync="delDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="360px">
					<el-form :model="delForm" label-width="100px">
						<el-form-item label="用户：">{{delForm.Mobile}}</el-form-item>
						<el-form-item label="身份证号：">{{delForm.IdCard}}</el-form-item>
						<el-form-item label="时间：">{{delForm.CreateTime}}</el-form-item>
						<el-form-item label="数据来源：">{{delForm.Source}}</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click.native="whitedelete">提交</el-button>
						<el-button @click.native="delDialog=false">取消</el-button>
					</div>
				</el-dialog>
				<!-- 导入白名单弹框 -->
				<el-dialog title="白名单导入提示" :visible.sync="whiteDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="450px">
					<div>
						<label style="display:inline-block; width:20px; height:20px; line-height:20px; text-align:center; color:#fff; background:#1D9FFF; border-radius:100%; margin:0 10px 20px 0;">1</label>
						<span style="color:#080808;">下载excel示例模板</span>
					</div>
					<el-row>
						<el-col :span="7" :offset="2" @click.native="exportexcel" style="color:#1D9FFF; cursor:pointer;">
							<i class="el-icon-download" style="font-size:20px; margin-right:6px;"></i>
							<span>点击下载</span>
						</el-col>
						<el-col :span="15" style="line-height:22px; color:#999;">请先下载该示例模板填入后上传</el-col>
					</el-row>
					<br />
					<div>
						<label style="display:inline-block; width:20px; height:20px; line-height:20px; text-align:center; color:#fff; background:#1D9FFF; border-radius:100%; margin:0 10px 20px 0;">2</label>
						<span style="color:#080808;">上传文件</span>
					</div>
					<el-upload drag multiple :action="uploadUrl+'/namelib/inputexcel'" :data="{Merchant:merchant,IsBlack:false,Account:account,Token:token}" name="file" method:="post" :before-upload="addUpload" :on-success="handleSuccess1" :show-file-list="false">
					  	<i class="el-icon-upload"></i>
					  	<div class="el-upload__text">将文件拖到此处，或<em>上传文件</em></div>
					  	<div class="el-upload__tip" slot="tip" style="font:13px/26px '微软雅黑';">
					  		<span style="display:inline-block; width:8px; height:8px; background:#999; border-radius:100%; margin:-2px 5px 0 30px;"></span>
					  		<span>支持文件类型</span>
					  		<span style="color:red;">xlsx</span> 
					  		<br />
					  		<span style="display:inline-block; width:8px; height:8px; background:#999; border-radius:100%; margin:-2px 5px 0 30px;"></span>
					  		<span>文件大小不得超过</span>
					  		<span style="color:red;">3MB</span>
					  	</div>
					</el-upload>
					<br />
				</el-dialog>
				<!-- 单条添加白名单 -->
				<el-dialog title="单条添加白名单" :visible.sync="addWhiteListDialog" @close='resetForm("addWhiteForm")' :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="500px">
					<el-form  ref="addWhiteForm" :model="addWhiteForm" label-width="100px" :rules="addWhiteListRules">
						<el-form-item prop="UserAccount" label="手机号">
							<el-input v-model="addWhiteForm.UserAccount" placeholder="请输入手机号" maxlength="11" clearable></el-input>
						</el-form-item>
						<el-form-item prop="IdCard" label="身份证">
							<el-input v-model="addWhiteForm.IdCard" placeholder="请输入身份证" clearable></el-input>
						</el-form-item>
						<el-form-item prop="Source" label="来源">
							<el-input v-model="addWhiteForm.Source" placeholder="请输入来源" clearable></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click.native="addWhiteSubmit()">提交</el-button>
						<el-button @click.native="addWhiteListDialog=false">取消</el-button>
					</div>
				</el-dialog>
		    </el-tab-pane>
		    <el-tab-pane label="黑名单" name="黑名单">
		    	<el-card class="box-card">
					<div slot="header" class="header">
						<el-form :inline="true" :model="form2" @submit.native.prevent>
				  			<el-form-item label="手机号">
				  				<el-input v-model="form2.UserAccount" placeholder="请输入手机号" clearable></el-input>
				  			</el-form-item>
				  			<el-form-item label="数据来源">
								<el-select v-model="form2.Source" clearable placeholder="请选择">
								    <el-option label="空" value="空"></el-option>
								    <el-option label="有脉爬取" value="有脉爬取"></el-option>
								</el-select>
							</el-form-item>
				  			<el-form-item><el-button type="primary" size="small" @click="search2">搜索</el-button></el-form-item>
				  			<el-form-item style="float:right;">
				  				<!--<el-upload :action="uploadUrl+'/namelib/inputexcel'" :data="{Merchant:merchant,IsBlack:true}" name="file" method:="post" :before-upload="addUpload" :on-success="handleSuccess2" :show-file-list="false" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
          							<el-button type="primary" size="small">导入黑名单</el-button>
								</el-upload>-->
								<el-button type="primary" size="small" @click="blackDialog=true">导入黑名单</el-button>
				  			</el-form-item>
							<el-form-item style="float:right;">
          						<el-button type="primary" size="small" @click="addBlockListDialog=true">单条添加黑名单</el-button>
				  			</el-form-item>
				  		</el-form>
					</div>
					<template>
						<el-table :data="tableData2" v-loading="listLoading2" element-loading-text="数据加载中..." border>
							<el-table-column prop="Id" label="序号"></el-table-column>
							<el-table-column prop="Mobile" label="手机号"></el-table-column>
							<el-table-column prop="IdCard" label="身份证号"></el-table-column>
							<el-table-column prop="CreateTime" label="时间"></el-table-column>
							<el-table-column prop="Source" label="数据来源"></el-table-column>
							<el-table-column prop="Username" label="操作人"></el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
			  	    		        <el-button type="primary" plain size="mini" @click="goDelBlack(scope.row)">移除</el-button>
				  	    		</template>
							</el-table-column>
						</el-table>
					</template>
					<el-col :span="24" class="toolbar">
				  		<el-pagination v-if="ispage2" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange2" :page-size="pageSize2" :page-sizes="[15,30,50,100]" @size-change="handleSizeChange2" :total="total2" style="float:right;"></el-pagination>
				  	</el-col>
				</el-card>
				<!-- 黑名单移除提示弹框 -->
				<el-dialog title="黑名单移除提示" :visible.sync="blackdelDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="360px">
					<el-form :model="blackdelForm" label-width="100px">
						<el-form-item label="用户：">{{blackdelForm.Mobile}}</el-form-item>
						<el-form-item label="身份证号：">{{blackdelForm.IdCard}}</el-form-item>
						<el-form-item label="时间：">{{blackdelForm.CreateTime}}</el-form-item>
						<el-form-item label="数据来源：">{{blackdelForm.Source}}</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click.native="blackdelete">提交</el-button>
						<el-button @click.native="blackdelDialog=false">取消</el-button>
					</div>
				</el-dialog>
				<!-- 导入黑名单弹框 -->
				<el-dialog title="黑名单导入提示" :visible.sync="blackDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="450px">
					<div>
						<label style="display:inline-block; width:20px; height:20px; line-height:20px; text-align:center; color:#fff; background:#1D9FFF; border-radius:100%; margin:0 10px 20px 0;">1</label>
						<span style="color:#080808;">下载excel示例模板</span>
					</div>
					<el-row>
						<el-col :span="7" :offset="2" @click.native="exportexcel" style="color:#1D9FFF; cursor:pointer;">
							<i class="el-icon-download" style="font-size:20px; margin-right:6px;"></i>
							<span>点击下载</span>
						</el-col>
						<el-col :span="15" style="line-height:22px; color:#999;">请先下载该示例模板填入后上传</el-col>
					</el-row>
					<br />
					<div>
						<label style="display:inline-block; width:20px; height:20px; line-height:20px; text-align:center; color:#fff; background:#1D9FFF; border-radius:100%; margin:0 10px 20px 0;">2</label>
						<span style="color:#080808;">上传文件</span>
					</div>
					<el-upload drag multiple :action="uploadUrl+'/namelib/inputexcel'" :data="{Merchant:merchant,IsBlack:true,Account:account,Token:token}" name="file" method:="post" :before-upload="addUpload" :on-success="handleSuccess2" :show-file-list="false">
					  	<i class="el-icon-upload"></i>
					  	<div class="el-upload__text">将文件拖到此处，或<em>上传文件</em></div>
					  	<div class="el-upload__tip" slot="tip" style="font:13px/26px '微软雅黑';">
					  		<span style="display:inline-block; width:8px; height:8px; background:#999; border-radius:100%; margin:-2px 5px 0 30px;"></span>
					  		<span>支持文件类型</span>
					  		<span style="color:red;">xlsx</span> 
					  		<br />
					  		<span style="display:inline-block; width:8px; height:8px; background:#999; border-radius:100%; margin:-2px 5px 0 30px;"></span>
					  		<span>文件大小不得超过</span>
					  		<span style="color:red;">3MB</span>
					  	</div>
					</el-upload>
					<br />
				</el-dialog>
				<!-- 单条添加黑名单 -->
				<el-dialog title="单条添加黑名单" :visible.sync="addBlockListDialog" @close='resetForm("addBlockForm")' :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="500px">
					<el-form  ref="addBlockForm" :model="addBlockForm" label-width="100px" :rules="addBlockListRules">
						<el-form-item prop="UserAccount" label="手机号">
							<el-input v-model="addBlockForm.UserAccount" placeholder="请输入手机号" maxlength="11" clearable></el-input>
						</el-form-item>
						<el-form-item prop="IdCard" label="身份证">
							<el-input v-model="addBlockForm.IdCard" placeholder="请输入身份证" clearable></el-input>
						</el-form-item>
						<el-form-item prop="Source" label="来源">
							<el-input v-model="addBlockForm.Source" placeholder="请输入来源" clearable></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click.native="addBlockSubmit()">提交</el-button>
						<el-button @click.native="addBlockListDialog=false">取消</el-button>
					</div>
				</el-dialog>
		    </el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import http from "../../api/http.js";
	import {nameliblist,namelibdelete,blacknamelibdelete,oneadd} from 'api/api.js';
	export default {
		data() {
			return {
				activeName:'白名单',
				uploadUrl:process.env.API_ROOT,
				merchant:JSON.parse(sessionStorage.getItem('userDtl')).Merchant,
				account:JSON.parse(sessionStorage.getItem('userDtl')).Account,
				token:sessionStorage.getItem('Token'),
				//白名单
				page1:1,
				total1:0,
				pageSize1:15,
				ispage1:true,
				listLoading1:false,
				tableData1:[],
				form1:{ IsBlack:false,UserAccount:'',Source:'' }, 
				delDialog:false,
				delForm:{},
				whiteDialog:false,
				//黑名单
				page2:1,
				total2:0,
				pageSize2:15,
				ispage2:true,
				listLoading2:false,
				tableData2:[],
				form2:{ IsBlack:true,UserAccount:'',Source:'' },
				blackdelDialog:false,
				blackdelForm:{},
				blackDialog:false,

				//单次添加白名单
				addWhiteListDialog:false,
				addWhiteForm:{
					UserAccount:'',
					IdCard:'',
					Source:'',
					IsBlack:false
				},
				addWhiteListRules:{
					UserAccount: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					}],
					IdCard: [{
						required: true,
						message: '请输入身份证',
						trigger: 'blur'
					}]
				},
				//单次添加黑名单
				addBlockListDialog:false,
				addBlockForm:{
					UserAccount:'',
					IdCard:'',
					Source:'',
					IsBlack:true
				},
				addBlockListRules:{
					UserAccount: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					}],
					IdCard: [{
						required: true,
						message: '请输入身份证',
						trigger: 'blur'
					}]
				}
			}
		},
		mounted() {
			this.getList1();  //获取白名单
			this.getList2();  //获取黑名单
		},
		methods: {

			addWhiteSubmit(){
				this.addBlockOrWhiteSubmit(this.addWhiteForm,'addWhiteForm');
			},
			addBlockSubmit(){
				this.addBlockOrWhiteSubmit(this.addBlockForm,'addBlockForm');
			},

			addBlockOrWhiteSubmit(params,ref){
				oneadd(params).then(res=>{
					if(res.Ret == 200){
						this.$message.success(res.Msg);
						this.closeDialog(ref);
						this.getDataList(ref);
						
					}
				})
			},
			getDataList(ref){
				if(ref == 'addWhiteForm'){
					this.getList1();
				}else{
					this.getList2();
				}
			},
			closeDialog(ref){
				if(ref == 'addWhiteForm'){
					this.addWhiteListDialog = false;
				}else{
					this.addBlockListDialog = false;
				}
			},
			resetForm(formName) {
				if(this.$refs[formName]){
					this.$refs[formName].resetFields();
				}
				
			},
			exportexcel(){  //下载模板
		   		window.location.href=process.env.API_ROOT+"/down/template?merchant="+JSON.parse( sessionStorage.getItem('userDtl') ).Merchant;
		   	},
			addUpload(file){
				console.log(file,123);
		        if( file.name.indexOf('.xlsx')==-1 ){
		        	this.$message.error('上传文件格式只能是.xlsx');
		        	return false;
		        }
	      	},
            handleSuccess1(res,file){  //导入白名单成功触发
	      		console.log(res);
	      		if( res.Ret==200 ){
	      			this.$message.success( res.Msg );
	      			this.getList1();
	      			this.whiteDialog=false;
	      		}else{
	      			this.$message.error( res.Msg );
	      		}
		    },
		    handleSuccess2(res,file){  //导入黑名单成功触发
	      		console.log(res);
	      		if( res.Ret==200 ){
	      			this.$message.success( res.Msg );
	      			this.getList2();
	      			this.blackDialog=false;
	      		}else{
	      			this.$message.error( res.Msg );
	      		}
		    },
			//白名单tab模块
			search1(){  //搜索白名单
				this.ispage1 = false;
				this.$nextTick(() => {
					this.page1 = 1;
					this.getList1();
					this.ispage1 = true;
				});
			},
			getList1(){  //获取白名单列表
				let params = {
					Page:this.page1,
					PageSize:this.pageSize1,
					UserAccount:this.form1.UserAccount,
					IsBlack:this.form1.IsBlack,
					Source:this.form1.Source
				};
				this.listLoading1 = true;
				nameliblist(params).then((res) => {
					console.log(res);
					if( res.Ret!=200 ){
						return false;
					}
					this.total1=res.Result.UserSum;
					if(res.Result.List == null){
						this.tableData1 = [];
					}else{
						this.tableData1 = res.Result.List;
						this.pageCount1 = Math.ceil(this.total1/this.pageSize1);
					}
					this.listLoading1 = false;
				});
			},
			goDelWhite(item){
				this.delForm=Object.assign({},item);
				this.delDialog = true;
			},
			whitedelete(){
				namelibdelete({Id:this.delForm.Id}).then((res) => {
					if( res.Ret == 200 ){
	      				this.getList1();
						this.$message.success(res.Msg);
						this.delDialog=false;
	      			}
				});
			},
			handleCurrentChange1(current){  //白名单分页页码跳转
				this.page1 = current;
				this.getList1();
			},
			handleSizeChange1(val){    //白名单分页页码改变
		        this.pageSize1=val;
		        this.getList1();
		    },
		    //黑名单tab模块
		    goDelBlack(item){
		    	this.blackdelForm=Object.assign({},item);
				this.blackdelDialog = true;
		    },
		    blackdelete(){
				blacknamelibdelete({Id:this.blackdelForm.Id}).then((res) => {
					if( res.Ret == 200 ){
	      				this.getList2();
						this.$message.success(res.Msg);
						this.blackdelDialog=false;
	      			}
				});
			},
		    search2(){  //搜索黑名单
				this.ispage2 = false;
				this.$nextTick(() => {
					this.page2 = 1;
					this.getList2();
					this.ispage2 = true;
				});
			},
			getList2(){  //获取黑名单列表
				let params = {
					Page:this.page2,
					PageSize:this.pageSize2,
					UserAccount:this.form2.UserAccount,
					IsBlack:this.form2.IsBlack,
					Source:this.form2.Source
				};
				this.listLoading2 = true;
				nameliblist(params).then((res) => {
					console.log(res);
					if( res.Ret!=200 ){
						return false;
					}
					this.total2=res.Result.UserSum;
					if(res.Result.List == null){
						this.tableData2 = [];
					}else{
						this.tableData2 = res.Result.List;
						this.pageCount2 = Math.ceil(this.total2/this.pageSize2);
					}
					this.listLoading2 = false;
				});
			},
			handleCurrentChange2(current){  //白名单分页页码跳转
				this.page2 = current;
				this.getList2();
			},
			handleSizeChange2(val){    //白名单分页页码改变
		        this.pageSize2=val;
		        this.getList2();
			}
		}
	}
</script>

<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
</style>