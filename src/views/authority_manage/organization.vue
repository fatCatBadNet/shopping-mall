<template>
	<div style="background:#fff; overflow:auto;">
		<el-col :span="6">
			<el-card class="box-card"shadow="never">
				<div slot="header">
					<span>组织架构</span>
					<el-button type="primary" size="small" style="float:right; margin-left:20px;" @click="rouseAddAlert">添加</el-button>
					<el-button type="primary" size="small" style="float:right;" @click="rouseEditAlert">编辑</el-button>
				</div>
				<el-col :span="24">
					<el-tree class="filter-tree" ref="tree" :data="Qdata" :props="defaultProps" node-key="Id" :expand-on-click-node="false" show-checkbox default-expand-all check-strictly check-on-click-node @node-click="nodeClick" @check-change="checkChange"></el-tree>
				</el-col>
			</el-card>
		</el-col>
		<el-col :span="18">
			<el-card class="box-card" shadow="never" style="border-left:none;">
				<div slot="header">
					<span>当前选中的节点：</span>
					<b style="color:red;">{{selectnodename}}</b>
					<el-button type="primary" size="small" style="float:right; margin-left:20px;" @click="stationAddAlert" v-if="editCheckId!=0">添加岗位</el-button>
				</div>
				<el-col :span="24">
					<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border style="width:100%;">
						<el-table-column prop="StationName" label="岗位名称"></el-table-column>
						<el-table-column prop="RoleName" label="角色"></el-table-column>
						<el-table-column prop="StationType" label="岗位类型"></el-table-column>
						<el-table-column prop="DatarType" label="数据权限"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
		  	    		        <el-button type="primary" size="mini"  @click="stationEditAlert(scope.row.Id)">编辑</el-button>
		  	    		        <el-button type="primary" plain size="mini" @click="delstation(scope.row.Id)" :disabled="editCheckId==0">删除</el-button>
			  	    		</template>
						</el-table-column>
					</el-table>
				</el-col>
			</el-card>
		</el-col>
		<!-- 添加权限弹框 -->
		<el-dialog title="添加组织架构节点" :visible.sync="showDialog_add" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="500px">
			<el-form :model="addForm" label-width="120px" ref="addForm">
				<el-form-item label="组织名称" prop="OrgName" :rules="[{required:true,message:'组织名称不得为空'}]">
					<el-input v-model="addForm.OrgName" value="addForm.OrgName" placeholder="请输入组织名称" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="addorganization">提交</el-button>
				<el-button @click.native="showDialog_add=false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 编辑权限弹框 -->
		<el-dialog title="编辑组织架构节点" :visible.sync="showDialog_edit" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="500px">
			<el-form :model="editForm" label-width="120px" ref="editForm">
				<el-form-item label="组织名称" prop="OrgName" :rules="[{required:true,message:'组织名称不得为空'}]">
					<el-input v-model="editForm.OrgName" value="OrgName.OrgName" placeholder="请输入组织名称" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="上级组织名称" prop="upOrgName" :rules="[{required:true,message:'上级组织名称不可修改'}]">
					<el-input v-model="editForm.upOrgName" value="editForm.upOrgName" disabled auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="editorganization">提交</el-button>
				<el-button @click.native="showDialog_edit=false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 添加岗位弹框 -->
		<el-dialog title="添加岗位" :visible.sync="stationDialog_add" @open="resetForm('stationForm_add')" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="800px">
			<el-form :model="stationForm_add" label-width="120px" ref="stationForm_add">
				<el-form-item label="岗位名称" prop="Name" :rules="[{required:true,message:'岗位名称不得为空'}]">
					<el-input v-model="stationForm_add.Name" value="stationForm_add.Name" placeholder="请输入岗位名称" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色" prop="OrgName">
					<el-select v-model="stationForm_add.RoleId">
						<el-option v-for="(item,index) in rolelists" :key="index" :label="item.Displayname" :value="item.Id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="岗位类型">
					<el-checkbox-group v-model="stationForm_add.StationTypes">
				    	<!--<el-checkbox :label="0" :value="0">信审</el-checkbox>
				      	<el-checkbox :label="1" :value="1">本人资料信审</el-checkbox>
				      	<el-checkbox :label="2" :value="2">M3催收</el-checkbox>-->
				      	<el-checkbox :label="3" :value="3">管理者 </el-checkbox>
				      	<el-checkbox :label="4" :value="4">催收员</el-checkbox>
				      	<el-checkbox :label="5" :value="5">客服专员</el-checkbox>
				      	<el-checkbox :label="6" :value="6">授信审核员</el-checkbox>
				      	<el-checkbox :label="7" :value="7">借款审核员</el-checkbox>
				    </el-checkbox-group>
				</el-form-item>
				<el-form-item label="数据权限">
					<el-select v-model="stationForm_add.DatarType" @change="addDatarTypechange">
						<el-option label="仅本人" :value="0"></el-option>
						<el-option label="部门及下属" :value="1"></el-option>
						<el-option label="自定义" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="岗位权限" v-if="addstationtree">
					<el-tree :data="Qdata" :props="stationDefaultProps" :default-checked-keys="stationForm_add.StationOrgs" :expand-on-click-node="false" show-checkbox default-expand-all check-strictly check-on-click-node node-key="Id" @check="checkadd"></el-tree>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="addstation">提交</el-button>
				<el-button @click.native="stationDialog_add=false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 编辑岗位弹框 -->
		<el-dialog title="编辑岗位" :visible.sync="stationDialog_edit" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="800px">
			<el-form :model="stationForm_edit" label-width="120px" ref="stationForm_edit">
				<el-form-item label="岗位名称" prop="StationName" :rules="[{required:true,message:'岗位名称不得为空'}]">
					<el-input v-model="stationForm_edit.StationName" value="stationForm_edit.Name" placeholder="请输入岗位名称" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色">
					<el-select v-model="stationForm_edit.RoleId">
						<el-option v-for="(item,index) in rolelists" :key="index" :label="item.Displayname" :value="item.Id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="岗位类型">
					<el-checkbox-group v-model="stationForm_edit.StationTypes">
				    	<!--<el-checkbox :label="0" :value="0">信审</el-checkbox>
				      	<el-checkbox :label="1" :value="1">本人资料信审</el-checkbox>
				      	<el-checkbox :label="2" :value="2">M3催收</el-checkbox>-->
				      	<el-checkbox :label="3" :value="3">管理者 </el-checkbox>
				      	<el-checkbox :label="4" :value="4">催收员</el-checkbox>
						<el-checkbox :label="5" :value="5">客服专员</el-checkbox>
						<el-checkbox :label="6" :value="6">授信审核员</el-checkbox>
				      	<el-checkbox :label="7" :value="7">借款审核员</el-checkbox>
				    </el-checkbox-group>
				</el-form-item>
				<el-form-item label="数据权限">
					<el-select v-model="stationForm_edit.DatarType" @change="editDatarTypechange">
						<el-option label="仅本人" :value="0"></el-option>
						<el-option label="部门及下属" :value="1"></el-option>
						<el-option label="自定义" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="岗位权限" v-if="editstationtree">
					<el-tree :data="Qdata" :props="stationDefaultProps" :default-checked-keys="stationForm_edit.StationOrgs" :expand-on-click-node="false" show-checkbox default-expand-all check-strictly check-on-click-node node-key="Id" @check="checkedit"></el-tree>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="editstation">提交</el-button>
				<el-button @click.native="stationDialog_edit=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>


<script>

import { rolelistall,getorganizationtree,addorganization,editorganization,jurisdictionlist,jurisdictionAdd,getjurisdictioninfo,jurisdictionEdit,jurisdictionDelete } from 'api/api.js';
export default {
	data(){
		return {
			editCheckId:null,  //当前选中节点id
			selectnodename:'空',  //当前选中节点名称
			selectUpnodename:'空',  //当前选中节点父级名称
			selectnodechildren:[],  //当前选中节点子节点id数组
			tableData:[],
			listLoading:false,
			showDialog_add:false,
			addForm:{ OrgName:'' },
			showDialog_edit:false,
			editForm:{ OrgName:'',upOrgName:'' },
			stationDialog_add:false,
			addstationtree:false,
			stationForm_add:{  //添加岗位表单
				"DatarType":0,
			  	"Name":"",
			  	"OrgId":0,
			  	"RoleId":1,
			  	"StationOrgs":[],
			  	"StationTypes":[]
			},
			stationDialog_edit:false,
			editstationtree:false,
			stationForm_edit:{},  //编辑岗位表单
			rolelists:[],
			id:0,
			Qdata:[],
			selectArr:[],
			defaultProps:{
				label:'Name',
				children:'Children',
				id:'Id'
			},
			stationDefaultProps:{
				label:'Name',
				children:'Children',
				id:'Id'
			}
		}
	},
	mounted(){
		this.getorganizationtree();
	},
	methods: {
		StationType(row){  //岗位类型
			return row.StationType.replace(/0/g,'信审').replace(/1/g,'本人资料信审').replace(/2/g,'M3催收');
		},
		stationEditAlert(id){  //唤醒编辑岗位弹窗
			if( this.editCheckId==null ){
				this.$message.error('请先选中一个组织架构节点！');
				return false;
			}
			this.stationForm_edit.OrgId=this.editCheckId;
			this.stationDialog_edit = true;
			this.editstationtree=false;
			this.getrolelistall();
			this.getjurisdictioninfo(id);
		},
		getjurisdictioninfo(id){  //获取某个岗位要编辑的信息
			let params = {StaionId:id};
			getjurisdictioninfo(params).then((res) => {
				if( res.Result == null ){
					this.stationForm_edit = {};
					return false;
				}
				this.stationForm_edit = res.Result;
				if( this.stationForm_edit.DatarType==2 ){
					this.editstationtree=true;
				}else{
					this.editstationtree=false;
				}
			});
		},
		addDatarTypechange(){  //新增岗位数据权限切换
			this.stationForm_add.StationOrgs=[];
			if( this.stationForm_add.DatarType==2 ){
				this.addstationtree=true;
			}else if( this.stationForm_add.DatarType==1 ){
				this.addstationtree=false;
				this.stationForm_add.StationOrgs=[].concat(this.selectnodechildren);
				this.stationForm_add.StationOrgs.push( this.editCheckId );
			}else if( this.stationForm_add.DatarType==0 ){
				this.addstationtree=false;
			}
			this.stationForm_add.StationOrgs=new Set(this.stationForm_add.StationOrgs);
			console.log( this.selectnodechildren+'+++++++'+this.editCheckId+'+++++++'+JSON.stringify(this.stationForm_add.StationOrgs) );
		},
		editDatarTypechange(){  //编辑岗位数据权限切换
			this.stationForm_edit.StationOrgs=[];
			if( this.stationForm_edit.DatarType==2 ){
				this.editstationtree=true;
			}else if( this.stationForm_edit.DatarType==0 ){
				this.editstationtree=false;
			}else if( this.stationForm_edit.DatarType==1 ){
				this.editstationtree=false;
				this.stationForm_edit.StationOrgs=[].concat(this.selectnodechildren);
				this.stationForm_edit.StationOrgs.push( this.editCheckId );
			}
			this.stationForm_edit.StationOrgs=new Set(this.stationForm_edit.StationOrgs);
			console.log( this.selectnodechildren+'+++++++'+this.editCheckId+'+++++++'+JSON.stringify(this.stationForm_edit.StationOrgs) );
		},
		checkedit(data,ischecked){  //菜单树复选框被点击
      		this.stationForm_edit.StationOrgs=ischecked.checkedKeys;
      		console.log( this.stationForm_edit.StationOrgs,29 );
      	},
      	editstation(){  //编辑岗位
      		console.log( this.stationForm_edit );
			let params = this.stationForm_edit;
			params.OrgId=this.editCheckId;
			jurisdictionEdit(params).then((res) => {
				if( res.Ret == 200 ){
      				this.getjurisdictionlist(this.editCheckId);
					this.stationDialog_edit = false;
					this.$message.success(res.Msg);
					this.resetForm('stationForm_edit');
      			}
				this.stationForm_edit.StationTypes=[];
			});
      	},
		stationAddAlert(){  //唤醒添加岗位弹窗
			if( this.editCheckId==null ){
				this.$message.error('请先选中一个组织架构节点！');
				return false;
			}
			this.stationForm_add.OrgId=this.editCheckId;
			this.stationDialog_add = true;
			this.getrolelistall();
		},
		getrolelistall(){  //获取岗位角色列表
			let params = {};
			rolelistall(params).then((res) => {
				if(res.Result.List == null){
					this.rolelists = [];
					return false;
				}
				this.rolelists = res.Result.List;
			});
		},
		checkadd(data,ischecked){  //菜单树复选框被点击
      		this.stationForm_add.StationOrgs=ischecked.checkedKeys;
      		console.log( this.stationForm_add.StationOrgs,29 );
      	},
		addstation(){  //添加岗位
			console.log( this.stationForm_add );
			let params = this.stationForm_add;
			jurisdictionAdd(params).then((res) => {
				if( res.Ret == 200 ){
      				this.getjurisdictionlist(this.editCheckId);
					this.stationDialog_add = false;
					this.$message.success(res.Msg);
					this.resetForm('stationForm_add');
      			}
			});
			this.stationForm_add.StationTypes=[];
		},
		delstation(id){  //删除岗位
			this.$confirm('确定删除此岗位吗?','提示',{
				type:'warning'
			}).then(() => {
				let params = {Id:id};
				jurisdictionDelete(params).then((res) => {
					if( res.Ret == 200 ){
	      				this.getjurisdictionlist(this.editCheckId);
						this.$message.success(res.Msg);
	      			}
				});
			}).catch(() => {  });
		},
		getorganizationtree(){  //获取组织菜单树权限数据
			let params = {};
			getorganizationtree(params).then((res) => {
				if(res.Orgs == null){
					this.Qdata = [];
					return false;
				}
				this.Qdata = res.Orgs;
			});
		},
		checkChange(item,node,self){  //组织架构树节点复选框点击（和nodeclick搭配使用，实现只能选中唯一节点）
			if( node==true ){  //点击未选中复选框
				this.editCheckId=item.Id;
				this.selectnodename=item.Name;
				let parentNode=this.$refs.tree.getNode( item.Id ).parent.data.Name;
				this.selectUpnodename=parentNode?parentNode:"无上级组织";
				this.$refs.tree.setCheckedKeys([item.Id]);
				console.log( item.Children );
				this.selectnodechildren=[];
				if( item.Children!=null ){
					this.pushselnodechild(item.Children);
					console.log(this.selectnodechildren,"++++++++++2222");
				}
				console.log( this.selectnodechildren,"node" );
				this.getjurisdictionlist(item.Id);
			}else{
				if( this.editCheckId==item.Id ){  //点击已选中复选框，保证至少一个选中
					this.$refs.tree.setCheckedKeys([item.Id]);
				}
			}
		},
		nodeClick(item,node,self){  //组织架构树节点点击（和checkchange搭配使用，实现只能选中唯一节点）
			this.editCheckId = item.Id;
			this.selectnodename=item.Name;
			this.$refs.tree.setCheckedKeys([item.Id]);
		},
		pushselnodechild(data){  //组织架构当前选中节点的所有子节点
			data.forEach((item) => {
				this.selectnodechildren.push( item.Id );
				if( item.Children ){
					this.pushselnodechild( item.Children );
				}
			});
		},
		rouseAddAlert(){  //唤醒添加组织架构弹窗
			if( this.editCheckId==null ){
				this.$message.error('请先选中一个组织架构节点！');
				return false;
			}
			this.showDialog_add = true;
		},
		addorganization(){  //提交新增组织架构
			if( !this.addForm.OrgName ){
				this.$message.error('组织名称不能为空！');
				return false;
			}
      		let params = { Pid:this.editCheckId,OrgName:this.addForm.OrgName };
      		addorganization(params).then((res) => {
      			if(res.Ret == 200){
      				this.getorganizationtree();
					this.showDialog_add = false;
					this.$message.success(res.Msg);
					this.resetForm('addForm');
      			}
      		});
      	},
      	rouseEditAlert(id){  //唤醒编辑组织架构弹窗
      		if( this.editCheckId==null ){
				this.$message.error('请先选中一个组织架构节点！');
				return false;
			}
      		this.editForm.OrgName=this.selectnodename;
      		this.editForm.upOrgName=this.selectUpnodename;
			this.showDialog_edit = true;
		},
      	editorganization(){  //提交编辑组织架构
      		if( !this.editForm.OrgName ){
				this.$message.error('组织名称不能为空！');
				return false;
			}
      		let params = { OrgId:this.editCheckId,OrgName:this.editForm.OrgName };
      		editorganization(params).then((res) => {
      			if(res.Ret == 200){
      				this.getorganizationtree();
					this.showDialog_edit = false;
					this.selectnodename=this.editForm.OrgName;
					this.$message.success(res.Msg);
					this.resetForm('editForm');
      			}
      		});
      	},
		getjurisdictionlist(id){  //获取组织岗位列表
			let params = {OrgId:id};
			this.listLoading = true;
			jurisdictionlist(params).then((res) => {
				if(res.List == null){
					this.tableData = [];
					this.listLoading = false;
					return false;
				}
				this.tableData = res.List;
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
	.el-card{ border-bottom:none; }
</style>