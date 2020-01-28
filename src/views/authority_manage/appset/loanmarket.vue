<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">尾量转化设置</div>
			<el-form :model="addForm" :rules="rules" label-width="120px" ref="addForm">
				<el-form-item label="展现形式" prop="ShowTyp">
				    <el-select v-model="addForm.ShowTyp" placeholder="请选择展现形式" @change="changetype" style="width:319px;">
				      	<el-option label="弹窗" value="弹窗"></el-option>
				      	<el-option label="购买信用报告" value="购买信用报告"></el-option>
				    </el-select>
				    <i class="el-icon-info" style="font-size:18px; color:#108EE9; margin:0 20px;"></i>
		          	<span style="padding:11px 20px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">
		          		弹窗：审核失败用户点击认证资料及借款按钮会显示引导弹窗；
						信用报告：审核失败用户点击获取报告按钮，进入支付报告页面。
					</span>
			 	</el-form-item>
			 	<el-form-item label="链接" prop="Url" v-if="addForm.ShowTyp=='弹窗'">
		        	<el-input placeholder="http(s)://" v-model="addForm.Url" clearable style="width:319px;"></el-input>
					<i class="el-icon-info" style="font-size:18px; color:#108EE9; margin:0 20px;"></i>
		          	<span style="padding:11px 20px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">请输入有效的链接，不得放置违法链接。</span>
		        </el-form-item>
				<el-form-item label="信用报告价格" prop="CreditRpt" v-else-if="addForm.ShowTyp=='购买信用报告'">
		          	<el-input type="text" v-model.number="addForm.CreditRpt" clearable placeholder="请输入报告金额" style="width:319px;">
		          		<template slot="append">元</template>
		          	</el-input>
		          	<i class="el-icon-info" style="font-size:18px; color:#108EE9; margin:0 20px;"></i>
		          	<span style="padding:11px 20px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">请输入拒绝报告价格，仅支持小数点后2位。</span>
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
	import { getloanmarket,setloanmarket } from 'api/api.js';
	export default {
		data() {
			return {
				addForm:{
					CreditRpt:null,
					ShowTyp:"",
					Url:""
				},
				rules: {
					ShowTyp:[{
						required:true,
						message:'请选择弹窗形式'
					}],
					Url:[{
						required:true,
						message:'请输入',
						trigger:'blur'
					}],
					CreditRpt: [{
						required:true,
						message:'请输入',
						trigger:'blur'
					}]
				}
			}
		},
		mounted() {
			this.getdtl();
		},
		methods: {
			changetype(){
				if( this.addForm.ShowTyp=="弹窗" ){
					this.addForm.CreditRpt=null;
				}else if( this.addForm.ShowTyp=="购买信用报告" ){
					this.addForm.Url="";
				}
			},
			getdtl(){
				getloanmarket({}).then((res) => {
					console.log(res);
					if( res.Ret === 200 ){
						this.addForm.CreditRpt=res.CreditRpt;
						this.addForm.ShowTyp=res.ShowTyp;
						this.addForm.Url=res.Url;
					}
				});
			},
	     	addSubmit(){
	     		this.$refs.addForm.validate((valid) => {
					if( valid ){
						if( this.addForm.ShowTyp=="购买信用报告" ){
							if( this.addForm.CreditRpt<0 ||  this.addForm.CreditRpt>100 ){
								this.$message.error( "信用报告价格不得小于0且不得大于100!" );
								return false;
							}
							if( this.addForm.CreditRpt%1!=0 ){
								console.log(String(this.addForm.CreditRpt).split(".")[1].length);
								if( String(this.addForm.CreditRpt).split(".")[1].length>2 ){
									this.$message.error( "信用报告价格仅支持小数点后2位!" );
									return false;
								}else{
									this.addForm.CreditRpt=parseFloat(this.addForm.CreditRpt);
								}
							}
						}
						setloanmarket(this.addForm).then((res) => {
							if( res.Ret === 200 ){
								this.$message.success( res.Msg );
								let that=this;
								setTimeout(function(){
									that.historyBack();
								},1000);
							}
							if(res.Ret == 100){
								this._sendCode(this.addForm,setloanmarket).then(res=>{
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