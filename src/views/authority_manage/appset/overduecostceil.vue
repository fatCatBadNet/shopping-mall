<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">逾期费用上限设置</div>
			<el-form :model="addForm" :rules="rules" label-width="120px" ref="addForm">
				<el-form-item label="逾期费用上限" prop="Amount">
		          	<el-input type="text" v-model.number="addForm.Amount" clearable placeholder="请输入百分数数值" style="width:288px;">
		          		<template slot="append">%</template>
		          	</el-input>
		          	<i class="el-icon-info" style="font-size:18px; color:#108EE9; margin:0 20px;"></i>
		          	<span style="padding:11px 20px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">用户逾期不断递增的各项费用，以本金为基数，当逾期费用达到本金的N%（N为填写数值）后不再增加。建议不超过100%。</span>
		        </el-form-item>
				<el-form-item style="width:400px; text-align:center; padding-top:20px;">
					<el-button type="primary" @click="addSubmit">确定</el-button>
					<el-button @click.native="historyBack">返回</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import { getoverduecostceil,setoverduecostceil } from 'api/api.js';
	export default {
		data() {
			return {
				addForm:{
					Amount:null
				},
				rules: {
					Amount: [{
						required:true,
						message:'逾期费用上限',
						trigger:'blur'
					}]
				}
			}
		},
		mounted() {
			this.getdtl();
		},
		methods: {
			getdtl(){
				getoverduecostceil({}).then((res) => {
					if( res.Ret === 200 ){
						this.addForm.Amount=res.Amount;
					}
				});
			},
	     	addSubmit(){
	     		this.$refs.addForm.validate((valid) => {
					if( valid ){
						if( this.addForm.Amount%1!=0 || this.addForm.Amount<0 || this.addForm.Amount>100 ){
							this.$message.error( "请输入1~100区间的整数!" );
							return false;
						}
						setoverduecostceil(this.addForm).then((res) => {
							if( res.Ret === 200 ){
								this.$message.success( res.Msg );
								let that=this;
								setTimeout(function(){
									that.historyBack();
								},1000);
							}
							if(res.Ret == 100){
								this._sendCode(this.addForm,setoverduecostceil).then(res=>{
									if( res.Ret === 200 ){
										this.$message.success( res.Msg );
										let that=this;
										setTimeout(function(){
											that.historyBack();
										},1000);
									}
								})
							}
						});
					}
				});
	     	},
	     	historyBack(){  //返回上一页
		    	history.back();
		    }
		}
	}
</script>

<style scoped lang="scss"></style>