<template>
	<div>
		<template>
			<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
				<el-table-column prop="CardNumber" label="银行卡号"></el-table-column>
				<el-table-column prop="BankName" label="银行"></el-table-column>
				<el-table-column prop="BankMobile" label="预留手机号"></el-table-column>
				<el-table-column prop="ChannelString" label="通道"></el-table-column>
				<el-table-column prop="CreateTime" label="绑卡时间"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
  	    		        <el-button type="primary" plain size="mini" @click="goEdit(scope.row)">修改</el-button>
  	    		        <el-button type="primary" plain size="mini" @click="goUntie(scope.row)">解绑</el-button>
	  	    		</template>
				</el-table-column>
			</el-table>
		</template>
		<!--修改银行预留手机号-->
		<el-dialog title="修改银行预留手机号" :visible.sync="showDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="500px">
			<el-form :model="bankFrom" label-width="120px" ref="bankFrom">
				<el-form-item label="手机号" prop="BankMobile" :rules="[{required:true,message:'银行预留手机号不得为空'}]">
					<el-input v-model="bankFrom.BankMobile" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="editSubmit">提交</el-button>
				<el-button @click.native="showDialog=false">取消</el-button>
			</div>
		</el-dialog>
		<!--解绑银行卡-->
		<el-dialog title="解绑银行卡" :visible.sync="untieDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="380px">
			<div>将此银行卡解绑后，用户可重新在app操作绑卡</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="untieSubmit">提交</el-button>
				<el-button @click.native="untieDialog=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {usersbankcard,modifyphonenum,unwrapusersbankcard} from 'api/api.js';
	export default {
		props:{
      		uid:{
        		type:String,
        		default:{type:''}
      		}
    	},
		data() {
			return {
				listLoading:false,
				tableData: [],
				showDialog:false,
				bankFrom:{},
				untieDialog:false
			}
		},
		mounted() {
			this.getusersbankcard();
		},
		methods: {
			getusersbankcard(){ //获取银行卡信息列表
				let params = {Uid:parseInt(this.uid)};
				this.listLoading = true;
				usersbankcard(params).then((res) => {
					if( res.Ret!=200 ){
						return false;
					}
					if( res.UsersBankcards == null ){
						this.tableData = [];
					}else{
						this.tableData = res.UsersBankcards;
					}
					this.listLoading = false;
				});
			},
			goEdit(item){
				this.bankFrom=Object.assign({},item);
				this.showDialog=true;
			},
			editSubmit(){
				if( !this.bankFrom.BankMobile ){
					this.$message.error( "手机号不得为空" );
					return false;
				}
				let params = {NewPhone:this.bankFrom.BankMobile,UsersBankcardId:this.bankFrom.Id};
				modifyphonenum(params).then((res) => {
					if( res.Ret==200 ){
						this.$message.success( res.Msg );
						this.getusersbankcard();
						this.showDialog=false;
					}
				});
			},
			goUntie(item){  //解绑银行卡
				this.bankFrom=Object.assign({},item);
				this.untieDialog=true;
			},
			untieSubmit(){
				unwrapusersbankcard({BankcardId:this.bankFrom.Id,Uid:this.bankFrom.Uid}).then((res) => {
					if( res.Ret==200 ){
						this.$message.success( res.Msg );
						this.getusersbankcard();
						this.untieDialog=false;
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss"></style>