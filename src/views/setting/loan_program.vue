<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent>
		  			<el-form-item label="日期">
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
		  			</el-form-item>
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
		  			<el-form-item style="float:right;"><el-button type="primary" size="small" @click="batchesEdit">批量修改</el-button></el-form-item>
		  			<el-form-item style="float:right;"><el-button type="primary" size="small" @click="showDialog_add = true">添加计划</el-button></el-form-item>
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border @selection-change="selectchange">
					<el-table-column type="selection" width="60"></el-table-column>
					<el-table-column prop="Date" label="日期"></el-table-column>
					<el-table-column label="单日放款金额限额（万元）">
						<template slot-scope="scope">
	  	    		        {{scope.row.LimitMoney/10000}}
		  	    		</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
	  	    		        <el-button type="primary" plain size="mini" @click="eidtDtl(scope.row)">修改</el-button>
		  	    		</template>
					</el-table-column>
				</el-table>
			</template>
			<el-col :span="24" class="toolbar">
		  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		  	</el-col>
		</el-card>
		<!-- 新增限额弹框 -->
		<el-dialog title="新增放款计划" :visible.sync="showDialog_add" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="600px">
			<el-form :model="addForm" label-width="120px" ref="addForm">
				<el-form-item prop="Days" label="新增计划" :rules="[{required:true,message:'请选择新增计划'}]">
					<el-select v-model.number="addForm.Days" clearable placeholder="请选择">
					    <el-option label="7天" :value="7"></el-option>
					    <el-option label="30天" :value="30"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="LimitMoney" label="单日限额" :rules="[{required:true,message:'金额不得为空'}]">
					<el-input type="number" v-model.number="addForm.LimitMoney" placeholder="请输入金额（万元）" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="addSubmit">提交</el-button>
				<el-button @click.native="showDialog_add=false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 修改权限弹框 -->
		<el-dialog title="单日放款限额" :visible.sync="showDialog_edit" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="600px">
			<el-form :model="editForm" label-width="100px" ref="editForm">
				<el-form-item prop="LimitMoney" label="金额" :rules="[{required:true,message:'金额不得为空'}]">
					<el-input type="number" v-model.number="editForm.LimitMoney" placeholder="请输入金额（万元）" auto-complete="off"></el-input>
					<span>万元</span>
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
import http from "../../api/http.js";
import { loanlimitList,loanlimitedit,loanlimitadd } from 'api/api.js';
export default {
	data(){
		return {
			pickerOptions:{
						onPick(e){
							this.$nextTick(()=>{
								var a=  document.getElementsByClassName('el-icon-arrow-right');
								a[1].removeAttribute('disabled');
								a[1].classList.remove('is-disabled');
							})
						}
					},
			page:1,
			total:0,
			pageSize:15,
			pageCount:1,
			ispage:true,
			listLoading:false,
			tableData:[],
			form:{ dateValue:[http.dateFormatter(new Date(new Date().getTime()-6*24*60*60*1000),false),http.dateFormatter(new Date(new Date().getTime()+30*24*60*60*1000),false)] }, 
			showDialog_add:false,
			showDialog_edit:false,
			addForm:{  //新增
				Days:null,
				LimitMoney:null
			},
			editForm:{  //新增
				LimitMoney:null
			},
			batches:[]  //选中id数组
		}
	},
	mounted(){
		this.getloanlimitList();
	},
	methods: {
		search(){  //搜索
			this.ispage = false;
			this.$nextTick(() => {
				this.page = 1;
				this.getloanlimitList();
				this.ispage = true;
			});
		},
		getloanlimitList(){  //获取列表
			let params = {Page:this.page,PageSize:this.pageSize};
			if( !this.form.dateValue ){
				params.StartTime='';
				params.EndTime='';
			}else{
				params.StartTime=this.form.dateValue[0]+' 00:00:00';
				params.EndTime=this.form.dateValue[1]+' 23:59:59';
			}
			this.listLoading = true;
			loanlimitList(params).then((res) => {
				this.total=res.Result.Sum;
				if( res.Result.List == null ){
					this.tableData = [];
				}else{
					this.tableData = res.Result.List;
					this.pageCount = Math.ceil(this.total/this.pageSize);
				}
				this.listLoading = false;
			});
		},
		handleCurrentChange(current){  //分页页码跳转
			this.page = current;
			this.getloanlimitList();
		},
		handleSizeChange(val){    //分页页码改变
	        this.pageSize=val;
	        this.getloanlimitList();
	   	},
		editPermission(id){  //编辑角色弹框唤醒
			this.roleid = id;
			this.showDialog_edit = true;
		},
      	addSubmit(){  //新增
      		if( !this.addForm.Days ){
      			this.$message.error('请选择新增计划天数！');
      			return false;
      		}
      		if( this.addForm.LimitMoney<=0 ){
      			this.$message.error('单日限额请输入大于0的数！');
      			return false;
      		}
      		let params = {
      			Days:this.addForm.Days,
      			LimitMoney:this.addForm.LimitMoney
      		}
      		loanlimitadd(params).then((res) => {
      			if(res.Ret == 200){
					this.showDialog_add = false;
					this.$message.success( res.Msg );
					this.getloanlimitList();
					this.resetForm('addForm');
      			}
      		});
      	},
      	editSubmit(){  //修改（提交）
      		if( this.editForm.LimitMoney<=0 ){
      			this.$message.error('请输入大于0的数！');
      			return false;
      		}
      		let params = {
      			LimitMoney:this.editForm.LimitMoney,
      			Ids:this.batches
      		}
      		loanlimitedit(params).then((res) => {
      			if(res.Ret == 200){
					this.showDialog_edit = false;
					this.$message.success( res.Msg );
					this.getloanlimitList();
					this.batches=[];
					this.resetForm('editForm');
      			}
      		});
      	},
      	eidtDtl(item){  //修改单个
			this.batches=[item.Id];
			this.editForm = Object.assign({},item);
			this.editForm.LimitMoney=this.editForm.LimitMoney/10000;
			this.showDialog_edit = true;
      	},
      	selectchange(val){  //多选操作
	   		this.batches=[];
	   		val.forEach(item=>{
	   			this.batches.push(item.Id);
	   		});
	   	},
      	batchesEdit(){  //批量修改
      		if( this.batches.length==0 ){
      			this.$message.error('请选择要修改的对象！');
      			return false;
      		}
			this.showDialog_edit = true;
      	},
      	resetForm(formName){  //重置表单
        	this.$refs[formName].resetFields();
      	}
      	
	}
}	
</script>

<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
</style>