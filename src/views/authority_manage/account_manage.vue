<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent>
		  			<el-form-item label="账号名">
		  		   		<el-input v-model="form.AccountName" value="form.AccountName" placeholder="请输入账号名" clearable></el-input>
		  			</el-form-item>
		  			<el-form-item label="使用人">
		  		   		<el-input v-model="form.UserName" value="form.UserName" placeholder="请输入使用人" clearable></el-input>
		  			</el-form-item>
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
		  			<el-form-item style="float:right;"><el-button type="primary" size="small" @click="addAcount">添加</el-button></el-form-item>
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;">
					<el-table-column prop="Account" label="账号"></el-table-column>
					<el-table-column prop="Username" label="使用人"></el-table-column>
					<el-table-column prop="StationName" label="岗位"></el-table-column>
					<el-table-column label="账号状态">
						<template slot-scope="scope">
	  	    		        <el-switch v-model="scope.row.IsUsed" active-text="启用" active-value="USE" inactive-text="禁用" inactive-value="UNUSED" @change="freezeDtl(scope.row.Id,scope.row.IsUsed)"></el-switch>
		  	    		</template>
					</el-table-column>
					<el-table-column label="操作" min-width="120">
						<template slot-scope="scope">
	  	    		        <el-button type="primary" plain size="mini" @click="editAcount(scope.row.Id, scope.row.IsUsed)">编辑</el-button>
	  	    		        <el-button type="primary" plain size="mini" @click="gogg(scope.row)" v-if="scope.row.IsGAuth">绑定验证器</el-button>
	  	    		        <el-button type="primary" plain size="mini" @click="resetpsd(scope.row)" v-if="IsPermission">重置密码</el-button>
	  	    		        <el-button type="primary" plain size="mini" @click="delDtl(scope.row.Id)">删除</el-button>
		  	    		</template>
					</el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
		  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		  	</el-col>
		</el-card>
		<!-- 添加账号弹框 -->
		<el-dialog title="添加账号" :visible.sync="showDialog_add" @open="resetForm('addForm')" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="950px">
			<el-form :model="addForm" :rules="rules" label-width="120px" ref="addForm">
				<el-form-item label="账号名：" prop="Account" v-if="isdomain">
					<el-input v-model="addForm.Account" placeholder="请输入" auto-complete="off" style="width:40%;"></el-input>
				</el-form-item>
				<el-form-item label="账号名：" prop="Account" v-else>
					<el-input v-model="addForm.Account" placeholder="请输入" auto-complete="off" style="width:40%;">
						<template slot="append">{{prepends}}</template>
					</el-input>
					<span class="spansty">登录用账号名为输入框内输入字符拼上"{{prepends}}",例如账号kefu001{{prepends}}</span>
				</el-form-item>
				
				<el-form-item label="使用人：" prop="Username">
					<el-input v-model="addForm.Username" placeholder="请输入" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="登录密码：" v-if="visible" prop="Password">
					<el-input type="password" v-model="addForm.Password" placeholder="请输入新密码">
		            	<i slot="suffix" class="el-icon-view el-input__icon" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
		          	</el-input>
				</el-form-item>
				<el-form-item label="登录密码：" v-else prop="Password">
		          	<el-input type="text" v-model="addForm.Password" placeholder="请输入密码">
		            	<i slot="suffix" class="el-icon-more el-input__icon" title="隐藏密码" @click="changePass('hide')" style="cursor:pointer;"></i>
		          	</el-input>
		        </el-form-item>
				<el-form-item label="账号状态：" prop="IsUsed">
					<el-switch v-model="addForm.IsUsed" active-text="启用" active-value="USE" inactive-text="禁用" inactive-value="UNUSED"></el-switch>
				</el-form-item>
				<el-form-item label="岗位：" prop="StationId">
					<el-tree class="filter-tree" ref="tree" :data="Qdata" :props="defaultProps" :default-checked-keys="selectArr" node-key="Id" :expand-on-click-node="false" show-checkbox default-expand-all check-strictly :check-on-click-node="false" @check-change="checkChange"></el-tree>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addSubmit('addForm')">提交</el-button>
				<el-button @click.native="showDialog_add=false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 编辑账号弹框 -->
		<el-dialog title="编辑账号" :visible.sync="showDialog_edit" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="950px">
			<el-form :model="editForm" :rules="rules" label-width="120px" ref="editForm">
				<el-form-item label="账号名：" prop="Account" v-if="isdomain">
					<el-input v-model="editForm.Account" placeholder="请输入" auto-complete="off" style="width:40%;"></el-input>
				</el-form-item>
				<el-form-item label="账号名：" prop="Account" v-else>
					<el-input v-model="editForm.Account" placeholder="请输入" auto-complete="off" style="width:40%;">
						<template slot="append">{{prepends}}</template>
					</el-input>
					<span class="spansty">登录用账号名为输入框内输入字符拼上"{{prepends}}",例如账号kefu001{{prepends}}</span>
				</el-form-item>
				<el-form-item label="使用人：" prop="Username">
					<el-input v-model="editForm.Username" placeholder="请输入" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="登录密码：" prop="Password">
					<el-input type="password" v-model="editForm.Password" placeholder="请输入新密码" disabled suffix-icon="el-icon-view">
		            	<i slot="suffix" title="显示密码" @click="changePass('show')" style="cursor:pointer;"></i>
		          	</el-input>
				</el-form-item>
				<el-form-item label="账号状态：" prop="IsUsed">
					<el-switch v-model="editForm.IsUsed" active-text="启用" active-value="USE" inactive-text="禁用" inactive-value="UNUSED"></el-switch>
				</el-form-item>
				<el-form-item label="岗位：" prop="StationId" v-if="edittree">
					<el-tree class="filter-tree" ref="tree2" :data="Qdata" :props="defaultProps" :default-checked-keys="selectArr" node-key="Id" :expand-on-click-node="false" show-checkbox default-expand-all check-strictly :check-on-click-node="false" @check-change="checkChange2"></el-tree>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="editSubmit">提交</el-button>
				<el-button @click.native="showDialog_edit=false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 验证器弹框 -->
		<el-dialog title="绑定谷歌验证器" :visible.sync="ggDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="900px">
			<div style="padding:10px 20px 30px; box-sizing:border-box; line-height:30px; color:#84909D; border-bottom:1px solid #eaeaea; overflow:hidden;">谷歌验证器是一款动态口令工具，工作原理类似短信动态验证。绑定后每30s生成一个动态验证码，验证码可用于登录等操作的安全验证。</div>
			<div style="padding:30px 20px; box-sizing:border-box; border-bottom:1px solid #eaeaea; overflow:hidden;">
				<el-col :span="12">
					<p style="color:#59616A;">
						<label style="display:inline-block; width:20px; height:20px; line-height:20px; text-align:center; color:#fff; background:#84909D; border-radius:100%; margin:0 10px 20px 0;">1</label>
						<span>下载谷歌验证器APP</span>
					</p>
					<p style="line-height:40px; color:#84909D;">iOS用户登录App Store搜索“Authenticator”下载。</p>
					<p style="line-height:40px; color:#84909D;">安卓用户登录应用商店货使用手机浏览器搜索“谷歌验证器”下载。</p>
				</el-col>
				<el-col :span="12">
					<el-tooltip placement="right" effect="light" style="border:none;">
						<div slot="content">
							<img src="~@/assets/img/iosLogo.png" style="height:140px; cursor:pointer; margin:10px;" />
						</div>
					  	<el-button>
					  		<img src="~@/assets/img/appstore.png" style="height:40px; cursor:pointer; margin:0px; padding:0;" />
					  	</el-button>
					</el-tooltip>
					<br />
					<el-tooltip placement="right" effect="light" style="border:none;">
						<div slot="content">
							<img src="~@/assets/img/androidLogo.png" style="height:140px; cursor:pointer; margin:10px;" />
						</div>
					  	<el-button>
					  		<img src="~@/assets/img/android.png" style="height:40px; cursor:pointer; margin:0px; padding:0;" />
					  	</el-button>
					</el-tooltip>
				</el-col>
			</div>
			<br />
			<div style="padding:30px 20px 0; box-sizing:border-box; overflow:hidden;">
				<p style="color:#59616A;">
					<label style="display:inline-block; width:20px; height:20px; line-height:20px; text-align:center; color:#fff; background:#84909D; border-radius:100%; margin:0 10px 20px 0;">2</label>
					<span>在谷歌验证器中添加密钥并备份</span>
				</p>
				<p style="line-height:30px; color:#84909D;">打开各个验证器，扫描下方二维码或手动输入下属密钥添加验证令牌。</p>
				<dl style="overflow:hidden;">
					<dt style="float:left; width:145px; height:145px; margin:10px 20px 0 0;"><img :src="ggImgurl" style="width:100%; height:100%;" /></dt>
					<dd style="margin:80px 0 10px;">密钥</dd>
					<dd>
						<span>{{ggCode}}</span>
						<span class="copyBtn" :data-clipboard-text="ggCode" style="color:#7B98F4; margin-left:20px; cursor:pointer;" @click="$message.success('复制成功！')">复制</span>
					</dd>
				</dl>
			</div>
			<br />
		</el-dialog>
	</div>
</template>

<script>
import { sysuserList,sysuserIsused,sysuserAdd,sysuserEdit,sysuserDel,sysuserInfo,sysuserUserInfo,stationtree,inituserpwd,ispermission } from 'api/api.js';
import Clipboard from 'clipboard';
let clipboard = new Clipboard('.copyBtn');
export default {
	data(){
		return {
			isdomain:JSON.parse(sessionStorage.getItem('rst')).Merchant || null,
			IsPermission:false,
			StationId:JSON.parse(sessionStorage.getItem('userDtl')).StationId || null,
			page:1,
			total:0,
			pageSize:15,
			ispage:true,
			listLoading:false,
			tableData:[],
			form:{ AccountName:'',UserName:'' },
			showDialog_add: false,
			showDialog_edit: false,
			stationInfo: {},
			stationName: '',
			id: 0,
			isUsed: '',
			addForm: {
				"Account": "",
			    "Id": 0,
			    "IsUsed": "USE",
			    "Password": "",
			    "Phone": "",
			    "StationId":null,
			    "StationName": "",
			    "Username": ""
			},
			visible:true,
			editForm: {},
			rules:{
				Account:[{
					required:true,
					message:'账号名不得为空',
					trigger:'blur'
				}],
				Username:[{
					required:true,
					message:'使用人姓名不得为空',
					trigger:'blur'
				}],
				Password:[{
					required:true,
					message:'密码不得为空',
					trigger:'blur'
				}]
			},
			editCheckId:null,  //当前选中节点id
			selectnodename:'空',  //当前选中节点名称
			selectArr:[],
			edittree:true,
			Qdata:[],
			defaultProps:{
				label:'Name',
				children:'Children',
				id:'Id',
				disabled:'Disable'
			},
			prepends:"@"+JSON.parse( sessionStorage.getItem('userDtl') ).Merchant,
			ggDialog:false,
			ggImgurl:'',
			ggCode:''
		}
	},
	mounted(){
		console.log( JSON.parse(sessionStorage.getItem('rst')).Merchant || null );
		this.getUserList();
		this.getstationtree();
		this.getispermission();
	},
	methods: {
		getispermission(){
			ispermission({}).then(res=>{
				console.log('按钮权限:',res);
				if(res.Ret == 200){
					this.IsPermission = res.IsPermission
				}
			})
		},
		resetpsd(item){
			this.$confirm('账号 “'+item.Username+'” 的登录密码将会重置为123456，重置后账号 “'+item.Username+'” 需使用新密码重新登录，是否继续操作?','提示',{
				type:'warning'
			}).then(() => {
				inituserpwd({id:item.Id}).then((res) => {
					if( res.Ret==200 ){
						this.$message.success(res.Msg);
					}
				});
			}).catch(() => {  });
		},
		gogg(item){
			this.ggImgurl=item.AuthQR;
			this.ggCode=item.AuthSecret;
			this.ggDialog=true;
		},
		changePass(value) {
        	this.visible = !(value === 'show');
     	},
		checkChange(item,node,self){  //组织架构树节点复选框点击（和nodeclick搭配使用，实现只能选中唯一节点）
			if( node==true ){  //点击未选中复选框
				this.editCheckId=item.Id;
				this.selectnodename=item.Name;
//				console.log( item.Id,item.Name );
				this.addForm.StationId=this.editCheckId;
				this.$refs.tree.setCheckedKeys([item.Id]);
			}else{
				if( this.editCheckId==item.Id ){  //点击已选中复选框，保证至少一个选中
					this.$refs.tree.setCheckedKeys([item.Id]);
				}
			}
		},
		checkChange2(item,node,self){  //组织架构树节点复选框点击（和nodeclick搭配使用，实现只能选中唯一节点）
			if( node==true ){  //点击未选中复选框
				this.editCheckId=item.Id;
				this.selectnodename=item.Name;
				this.editForm.StationId=this.editCheckId;
				this.selectArr=[];
				this.selectArr.push(this.editCheckId);
				this.$refs.tree2.setCheckedKeys([item.Id]);
			}else{
				if( this.editCheckId==item.Id ){  //点击已选中复选框，保证至少一个选中
					this.$refs.tree2.setCheckedKeys([item.Id]);
				}
			}
		},
		search(){  //搜索角色
			this.ispage = false;
			this.form.AccountName=this.form.AccountName.split('@')[0];
			this.$nextTick(() => {
				this.page = 1;
				this.getUserList();
				this.ispage = true;
			});
		},
		getUserList(){  //获取用户列表
			let params = {AccountName:this.form.AccountName,UserName:this.form.UserName,PageSize:this.pageSize,Page:this.page};
			this.listLoading = true;
			sysuserList(params).then((res) => {
				console.log(res);
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.Result.UserSum;
				if( res.Result.List == null ){
					this.tableData = [];
				}else{
					this.tableData = res.Result.List;
				}
				this.listLoading = false;
			});
		},
		handleCurrentChange(current){  //分页页码跳转
			this.page = current;
			this.getUserList();
		},
		handleSizeChange(val){    //分页页码改变
	        this.pageSize=val;
	        this.getUserList();
	   	},
		freezeDtl(id,isUsed){  //禁用、启用
			let params = {Id:id,IsUsed:isUsed}
			sysuserIsused(params).then((res) => {
				if( res.Ret == 200 ){
					this.$message.success( res.Msg );
					this.getUserList();
				}
			});
		},
		//新增账号弹框
		addAcount(){
			this.showDialog_add = true;
		},
		getstationtree(tip){  //获取岗位菜单树
			let params = {};
			stationtree(params).then((res) => {
				if(res.Ret == 200){
					this.Qdata=res.Nodes;	
				}
			});
		},
		addSubmit(formName){  //添加账号
			this.$refs.addForm.validate((valid) => {
				if( valid ){
					if( this.addForm.Account.indexOf("@")!=-1 ){
						this.$message.error( "账号名格式输入有误" );
						return false;
					}
					if( !this.addForm.StationId ){
						this.$message.error( "请选择岗位" );
						return false;
					}
					let params = {User:this.addForm};
					sysuserAdd(params).then((res) => {
						if(res.Ret == 200){
							this.$message.success(res.Msg);
							this.showDialog_add = false;
							this.getUserList();
							this.resetForm(formName);
							this.selectArr=[];
							this.editCheckId=null;
							this.$refs.tree.setCheckedKeys([]);
						}
					});
				}
			});
		},
		editAcount(id,isUsed){  //编辑账号弹框
			this.showDialog_edit = true;
			this.getUserInfo(id);
		},
		editSubmit(){
			this.$refs.editForm.validate((valid) => {
				if( valid ){
					if( this.editForm.Account.indexOf("@")!=-1 ){
						this.$message.error( "账号名格式输入有误" );
						return false;
					}
					let params = { User:this.editForm };
					sysuserEdit(params).then((res) => {
						if(res.Ret == 200){
							this.$message.success(res.Msg);
							this.showDialog_edit = false;
							this.getUserList();
							this.$refs.tree2.setCheckedKeys([]);
							this.resetForm('editForm');
						}
					});
				}
			});
		},
		getSysuserInfo(){  //岗位信息
			let params = {};
			sysuserInfo(params).then((res) => {
				if(res.Ret == 200){
					this.stationInfo = res.List;
				}
			});
		},
		getUserInfo(id){  //获取用户信息
			let params = { Id: id };
			this.edittree=false;
			sysuserUserInfo(params).then((res) => {
				if(res.Ret == 200){ 
					this.editForm=res.User;
					this.editCheckId=res.User.StationId;
					this.selectArr=[];
					this.selectArr.push(res.User.StationId);
					this.edittree=true;
				}
			});
		},
      	delDtl(id){  //删除
			this.$confirm('确认删除吗?','提示',{
				type:'warning'
			}).then( () => {
				let params = { Id: id };
	      		sysuserDel(params).then((res) => {
					if( res.Ret==200 ){
						this.$message.success( '删除成功！' );
						this.getUserList();
					}
				});
			}).catch(() => {});
      	},
      	resetForm(formName){  //重置表单
      		this.$nextTick(() => {
		        this.$refs[formName].resetFields();
		    });
      	},
      	resetPwd(){  //重置密码
      		this.editForm.pwd = '888888';
      	}
	}
}	

</script>


<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
	.resetPwd{ font-size:12px; cursor:pointer; color:#409EFF; }
	.spansty{ color:red; font:12px "微软雅黑"; margin-left:10px; }
	.el-checkbox.is-disabled .el-checkbox__inner{ border-radius:100%; }
</style>