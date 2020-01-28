<template>
	<div>
		<el-card class="box-card" >
			<div slot="header" class="clearfix">自动代扣设置</div>
			<el-form :model="addForm" :rules="rules" label-width="130px" ref="addForm">
				<el-form-item label="代扣时间选择： " prop="Ints">
		        	<el-select v-model="addForm.Ints" multiple disabled placeholder="请选择" popper-class="zdy" style="width:300px;" @change="changesel">
						<el-option label="1点" :value="1"></el-option>
						<el-option label="2点" :value="2"></el-option>
						<el-option label="3点" :value="3"></el-option>
						<el-option label="4点" :value="4"></el-option>
						<el-option label="5点" :value="5"></el-option>
						<el-option label="6点" :value="6"></el-option>
						<el-option label="7点" :value="7"></el-option>
						<el-option label="8点" :value="8"></el-option>
						<el-option label="9点" :value="9"></el-option>
						<el-option label="10点" :value="10"></el-option>
						<el-option label="11点" :value="11"></el-option>
						<el-option label="12点" :value="12"></el-option>
						<el-option label="13点" :value="13"></el-option>
						<el-option label="14点" :value="14"></el-option>
						<el-option label="15点" :value="15"></el-option>
						<el-option label="16点" :value="16"></el-option>
						<el-option label="17点" :value="17"></el-option>
						<el-option label="18点" :value="18"></el-option>
						<el-option label="19点" :value="19"></el-option>
						<el-option label="20点" :value="20"></el-option>
						<el-option label="21点" :value="21"></el-option>
						<el-option label="22点" :value="22"></el-option>
						<el-option label="23点" :value="23"></el-option>
						<el-option label="24点" :value="24"></el-option>
					</el-select>
					<i class="el-icon-info" style="font-size:18px; color:#108EE9; margin:0 20px;"></i>
		          	<span style="padding:11px 20px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">建议选择不超过2个代扣时间。第三方支付对代扣成功率有一定要求，且银行通道对单卡代扣次数有限制。</span>
		        </el-form-item>
				<el-form-item style="width:440px; text-align:center; padding-top:20px; margin-top:600px;">
					<el-button type="primary" @click="addSubmit">确定</el-button>
					<el-button @click.native="historyBack">返回</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import { getautowithhold,setautowithhold } from 'api/api.js';
	export default {
		data() {
			return {
				zdyInts:[],
				addForm:{
					Ints:[]
				},
				rules: {
					Ints: [{
						required:true,
						message:'请选择代扣时间',
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
				getautowithhold({}).then((res) => {
					console.log(res);
					if( res.Ret === 200 ){
//						this.Labels=res.Labels;
						res.Labels.forEach(item=>{
							this.addForm.Ints.push( item.Value );
							this.zdyInts.push( item.Value );
						});
					}
				});
			},
			changesel(val){
				console.log( this.addForm.Ints,this.zdyInts );
				if( this.addForm.Ints.length>2 && this.addForm.Ints.length>this.zdyInts.length ){
					this.$confirm('当前选择代扣次数超过2次，有被第三支付或银行通道限制风险，是否确定选择？','提示',{
						type:'warning',
						cancelButtonClass:'fright',
						confirmButtonClass:'fright'
					}).then(() => {
						this.zdyInts=[...this.addForm.Ints];
					}).catch(() => { 
						this.addForm.Ints.pop();
						this.zdyInts=[...this.addForm.Ints];
					});
				}
				this.zdyInts=[...this.addForm.Ints];
				console.log( this.addForm.Ints,this.zdyInts,123 );
			},
	     	addSubmit(){
	     		this.$refs.addForm.validate((valid) => {
					if( valid ){
						setautowithhold(this.addForm).then((res) => {
							if( res.Ret === 200 ){
								this.$message.success( res.Msg );
								let that=this;
								setTimeout(function(){
									that.historyBack();
								},1000);
							}
							if(res.Ret == 100){
								this._sendCode(this.addForm,setautowithhold).then(res=>{
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

<style scoped lang="scss">
	
</style>