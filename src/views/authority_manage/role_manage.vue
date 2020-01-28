<template>
	<div id="rolemanage">
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent>
		  			<el-form-item label="角色">
		  		   		<el-input v-model="form.Displayname" value="form.Displayname" placeholder="请输入角色" clearable></el-input>
		  			</el-form-item>
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
		  			<el-form-item style="float:right;"><el-button type="primary" size="small" @click="batchesdel">批量删除</el-button></el-form-item>
		  			<el-form-item style="float:right;"><el-button type="primary" size="small" @click="addPermission(0)">添加</el-button></el-form-item>
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;" @selection-change="selectchange">
					<el-table-column type="selection" width="60"></el-table-column>
					<el-table-column prop="Id" label="序号"></el-table-column>
					<el-table-column prop="Displayname" label="角色名称"></el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
	  	    		        <el-button type="primary" plain size="mini"  @click="editPermission(scope.row.Id)">编辑</el-button>
	  	    		        <el-button type="primary" plain size="mini" @click="delDtl(scope.row.Id)">删除</el-button>
		  	    		</template>
					</el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
		  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		  	</el-col>
		</el-card>
		<!-- 新增权限弹框 -->
		<el-dialog title="新增角色" :visible.sync="showDialog_add" @open="resetForm('addForm')" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="600px">
			<el-form :model="addForm" label-width="120px" ref="addForm">
				<el-form-item label="角色名称：" prop="name" :rules="[{required:true,message:'角色不得为空'}]">
					<el-input v-model="addForm.name" placeholder="请输入名称（10个字符内）" auto-complete="off" style="width: 50%;"></el-input>
				</el-form-item>
				<el-form-item label="按钮权限：" class="rolemanage">
					<el-checkbox-group v-model="addForm.Buttons">
				      	<el-checkbox v-for="(item,index) in buttonArr" :key="index" :label="item.Id" :value="item.Id">{{item.Description}}</el-checkbox>
				    </el-checkbox-group>
				</el-form-item>
				<el-form-item label="权限范围：" :rules="[{required:true}]">
					<el-tree ref="addtree" :data="Qdata" :props="defaultProps" :expand-on-click-node="false" show-checkbox default-expand-all check-on-click-node :default-checked-keys="selectArr" node-key="Id" @check="check"></el-tree>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="addSubmit">提交</el-button>
				<el-button @click.native="showDialog_add=false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 编辑权限弹框 -->
		<el-dialog title="编辑角色" :visible.sync="showDialog_edit" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="600px">
			<el-form :model="addForm" label-width="120px" ref="editForm">
				<el-form-item label="角色名称：" prop="name" :rules="[{required:true,message:'岗位名称不得为空'}]">
					<el-input v-model="addForm.name" value="addForm.name" auto-complete="off" style="width: 50%;"></el-input>
				</el-form-item>
				<el-form-item label="按钮权限：" class="rolemanage">
					<el-checkbox-group v-model="addForm.Buttons">
				      	<el-checkbox v-for="(item,index) in buttonArr" :key="index" :label="item.Id" :value="item.Id">{{item.Description}}</el-checkbox>
				    </el-checkbox-group>
				</el-form-item>
				<el-form-item label="权限设置：" :rules="[{required:true}]">
					<el-tree ref="edittree" :data="Qdata" :props="defaultProps" :expand-on-click-node="false" show-checkbox default-expand-all check-on-click-node :default-checked-keys="selectArr" node-key="Id" @check="check"></el-tree>
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
import MenuUtils from 'utils/MenuUtils.js';
import { sysrolelist,jurisdictionMenutree,sysroleadd,sysroledel,getmenulist,buttonlist } from 'api/api.js';
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
			form:{ Displayname:'' }, 
			showDialog_add:false,
			showDialog_edit:false,
			Qdata:[],  //角色权限树节点数据
			selectArr:[],  //角色权限树选中节点id数组
			roleid:null,
			addForm:{  //新增角色表单
				name:'',
				Buttons:[]
			},
			defaultProps:{
				label:'Name',
				children:'Children',
				id:'Id'
			},
			buttonArr:[],
			batches:[]  //批量删除id数组
		}
	},
	mounted(){
		this.getsysrolelist();
	},
	methods: {
		search(){  //搜索角色
			this.ispage = false;
			this.$nextTick(() => {
				this.page = 1;
				this.getsysrolelist();
				this.ispage = true;
			});
		},
		getsysrolelist(){  //获取角色列表
			let params = {Page:this.page,PageSize:this.pageSize,RoleName:this.form.Displayname};
			this.listLoading = true;
			sysrolelist(params).then((res) => {
				if(res.Result.List == null){
					this.tableData = [];
				}else{
					this.tableData = res.Result.List;
				}
				this.total=res.Result.UserSum;
				this.pageCount = Math.ceil(this.total/this.pageSize);
				this.listLoading = false;
			});
		},
		handleCurrentChange(current){  //分页页码跳转
			this.page = current;
			this.getsysrolelist();
		},
		handleSizeChange(val){    //分页页码改变
	        this.pageSize=val;
	        this.getsysrolelist();
	   	},
	   	selectchange(val){  //角色多选操作
	   		this.batches=[];
	   		val.forEach(item=>{
	   			this.batches.push(item.Id);
	   		});
	   	},
		addPermission(id){  //新增角色弹框唤醒
			this.getButtonList(id);
			this.getPermissionMenutree(id);
			this.showDialog_add = true;
		},
		editPermission(id){  //编辑角色弹框唤醒
			this.roleid = id;
			this.getButtonList(id);
			this.getPermissionMenutree(id);
			this.showDialog_edit = true;
		},
		getButtonList(id){
			buttonlist({Id:id}).then((res) => {
				if( res.Ret==200 ){
					console.log(res);
					this.buttonArr=res.List || [];
					this.addForm.Buttons=[];
					res.List.forEach(item=>{
						if( item.Checked ){
							this.addForm.Buttons.push( item.Id );
						}
					});
				}
			});
		},
		getPermissionMenutree(id){  //获取角色权限树数据（加载树）
			jurisdictionMenutree({Id:id}).then((res) => {
				if(res.Menus == null){
					this.Qdata = [];
					return false;
				}
				this.selectArr = res.MenusId ? res.MenusId.map((item) => {return item;}) : [];
				this.addForm.name = res.RoleName;
				this.Qdata = res.Menus;
			});
		},
//		handleCheckChange(data,ischecked,indeterminate){},
      	check(data,ischecked){  //菜单树复选框被点击
      		this.selectArr=ischecked.checkedKeys;
      		console.log( this.selectArr,29 );
      	},
      	addSubmit(){  //新增角色（提交）
			let addarr1 = this.$refs.addtree.getHalfCheckedKeys();
		    let addarr2 = this.$refs.addtree.getCheckedKeys();
		    let addarr3 = addarr1.concat(addarr2);
      		let params = {
      			DisplayName:this.addForm.name,
      			Menus:addarr3,
      			Buttons:this.addForm.Buttons,
      			Rid:0
      		}
      		if( !this.addForm.name ){
      			this.$message.error('角色不得为空！');
      			return false;
      		}
      		if( params.Menus.length == 0 ){
      			this.$message.error('角色权限范围不得为空！');
      			return false;
      		}
      		sysroleadd(params).then((res) => {
      			if(res.Ret == 200){
					this.showDialog_add = false;
					this.$message.success("新增角色成功");
					this.getsysrolelist();
					this.resetForm('addForm');
      			}
      		});
      	},
      	editSubmit(){  //编辑角色（提交）
			let editarr1 = this.$refs.edittree.getHalfCheckedKeys();
		    let editarr2 = this.$refs.edittree.getCheckedKeys();
		    let editarr3 = editarr1.concat(editarr2);
      		let params = {
      			DisplayName:this.addForm.name,
      			Menus:editarr3,
      			Buttons:this.addForm.Buttons,
      			Rid:this.roleid
      		}
      		if( !this.addForm.name ){
      			this.$message.error('角色不得为空！');
      			return false;
      		}
      		if( params.Menus.length == 0 ){
      			this.$message.error('角色权限范围不得为空！');
      			return false;
      		}
      		sysroleadd(params).then((res) => {
      			if(res.Ret == 200){
					this.showDialog_edit = false;
					this.$message.success("编辑角色成功");
					this.getsysrolelist();
					this.menuNav();
					this.resetForm('editForm');
      			}
      		});
      	},
      	delDtl(id){  //删除单个角色
			this.$confirm('确认删除吗?','提示',{
				type:'warning'
			}).then( () => {
				let params = { Rids:[id] };
	      		sysroledel(params).then((res) => {
					if( res.Ret==200 ){
						this.$message.success( '删除成功！' );
						this.getsysrolelist();
					}
				});
			}).catch(() => {});
      	},
      	batchesdel(){  //批量删除角色
      		if( this.batches.length==0 ){
      			this.$message.error('请选择要删除的角色！');
      			return false;
      		}
      		this.$confirm('确定要批量删除这些选中项吗?','提示',{
				type:'warning'
			}).then( () => {
				let params = { Rids:this.batches };
	      		sysroledel(params).then((res) => {
					if( res.Ret==200 ){
						this.$message.success( '删除成功！' );
						this.getsysrolelist();
					}
				});
			}).catch(() => {});
      	},
      	menuNav(){  //刷新菜单权限
			let that = this;
			let params = {}
			getmenulist(params).then(res => {
				if( res.Ret == 200) {
					let priData={};
					if( res.Menus!=null ){
						priData = res.Menus;
						priData = JSON.stringify(priData).toLowerCase(); //所有的key转换成小写
						window.sessionStorage.setItem('meundata',priData);
					}
					that.$router.options.routes=[];
					let routes = [];
					if( priData.length>0 ){
						MenuUtils(routes,priData);
						that.$router.options.routes = Object.assign(that.$router.options.routes,routes);
						that.$router.addRoutes(routes);
					}
				} else {
					this.navlists = null;
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

<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
</style>