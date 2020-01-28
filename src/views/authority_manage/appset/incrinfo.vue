<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="clearfix">提额设置</div>
			<el-form :model="addForm" :rules="rules" label-width="90px" ref="addForm">
				<el-form-item label="触发条件" prop='TriggerValue'>
					<el-select v-model="addForm.Trigger" placeholder="请选择" style="width:170px;    vertical-align: top;">
					    <el-option label="成功还款" value="成功还款"></el-option>
					</el-select>
		          	<el-input type="text" v-model.number="addForm.TriggerValue" clearable placeholder="请输入" style="width:142px;   vertical-align: top;">
		          		<template slot="append">次</template>
		          	</el-input>
					&nbsp;&nbsp;&nbsp;每
					<el-input type="text" v-model.number="addForm.TriggerIncreRound" clearable placeholder="请输入" class="my_item" style="width:142px;  vertical-align: top;">
		          		<template slot="append">次</template>
		          	</el-input>
					  &nbsp;提额一次
		          	<i class="el-icon-info" style="font-size:18px; color:#108EE9; margin:0 15px;"></i>
		          	<span style="padding:11px 10px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;width:700px;display:inline-block;    line-height: 1.5; vertical-align: top;"> 完成触发条件要求的操作后，即会开始进行提额程序。如选择成功还款1次，每2次提额一次，则成功还款一次后提额一次，还款第三次后，再提额一次。</span>
		        </el-form-item>
		        <el-form-item label="满足条件" prop='MatchValue'>
					<el-select v-model="addForm.Match" placeholder="请选择" style="width:170px;">
					    <el-option label="逾期不超过" value="逾期不超过"></el-option>
					    <el-option label="无条件" value="无条件"></el-option>
					</el-select>
		          	<el-input type="text" v-model.number="addForm.MatchValue" clearable placeholder="请输入" v-if="addForm.Match=='逾期不超过'" style="width:142px;">
		          		<template slot="append">天</template>
		          	</el-input>
		          	<p v-if="addForm.Match=='无条件'||addForm.Match==''" style="display:inline-block; width:142px;"></p>
		          	<i class="el-icon-info" style="font-size:18px; color:#108EE9; margin:0 15px;"></i>
		          	<span style="padding:11px 10px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">逾期不超过N天：即要求最近一次结清的借款不得逾期超过N天，否则不予提额；无条件：即任何还款都可以提额。</span>
		        </el-form-item>
		        <el-form-item label="提额策略" prop='StrategyValue'>
					<el-select v-model="addForm.Strategy" placeholder="请选择" @change="srtategychange" style="width:170px;">
					    <el-option label="固定金额提额" value="固定金额提额"></el-option>
					    <el-option label="按比例提额" value="按比例提额"></el-option>
					</el-select>
		          	<el-input type="text" v-model.number="addForm.StrategyValue" clearable placeholder="请输入" style="width:142px;">
		          		<template slot="append">{{addForm.Strategy=='固定金额提额'?'元':addForm.Strategy=='按比例提额'?'%':''}}</template>
		          	</el-input>
		          	<i class="el-icon-info" style="font-size:18px; color:#108EE9; margin:0 15px;"></i>
		          	<span style="padding:11px 10px; color:#1989FA; border:1px solid #108EE9; border-radius:5px;">
		          		1.固定金额提额，默认在当前授信额度基础上加上提额额度；
						2.按比例提额，默认以当前授信额度为基础进行提额，比如当天额度1000，提30%，则提额后为1300元。
					</span>
		        </el-form-item>
				<el-form-item style="width:400px; text-align:center; padding-top:20px;">
					<el-button type="primary" @click="addSubmit">确定</el-button>
					<el-button @click.native="historyBack">返回</el-button>
				</el-form-item>
			</el-form>
			<div style="width:60%; padding:30px 50px; margin-top:120px; border:1px dotted #ccc;">
				<p>提额业务流程图</p>
				<img src="https://static.****.com/static/img/guide.png" style="width:743px;" />
			</div>
		</el-card>
	</div>
</template>

<script>
	import { getincrinfo,setincrinfo } from 'api/api.js';
	export default {
		data() {
			return {
				addForm:{
					Trigger:"",  //触发条件
					TriggerValue:null,
					TriggerIncreRound:null,
					Match:"",  //满足条件
					MatchValue:null,
					Strategy:"",  //提额策略
					StrategyValue:null
				},
				rules: {
					TriggerValue: [{
						required:true,
						message:'请输入',
						trigger:'blur'
					}],
					MatchValue: [{
						required:true,
						message:'请输入',
						trigger:'blur'
					}],
					StrategyValue: [{
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
			getdtl(){
				getincrinfo({}).then((res) => {
					console.log(res);
					if( res.Ret === 200 ){
						this.addForm.Trigger=res.Rst.Trigger;
						this.addForm.TriggerValue=res.Rst.TriggerValue;
						this.addForm.TriggerIncreRound=res.Rst.TriggerIncreRound==0?1:res.Rst.TriggerIncreRound;
						this.addForm.Match=res.Rst.Match;
						this.addForm.MatchValue=res.Rst.MatchValue;
						this.addForm.Strategy=res.Rst.Strategy;
						this.addForm.StrategyValue=res.Rst.StrategyValue;
					}
				});
			},
			srtategychange(){
				this.addForm.StrategyValue=null;
			},
	     	addSubmit(){
	     		this.$refs.addForm.validate((valid) => {
					if( valid ){
						if( this.addForm.TriggerValue%1!=0 || this.addForm.TriggerValue<=0 ){
							this.$message.error( "触发条件：仅允许输入整数次!" );
							return false;
						}
						if( this.addForm.TriggerIncreRound%1!=0 || this.addForm.TriggerIncreRound<=0 ){
							this.$message.error( "次数不得为空!" );
							return false;
						}
						if( this.addForm.Match=='逾期不超过' ){
							if( this.addForm.MatchValue%1!=0 || this.addForm.MatchValue<=0 || this.addForm.MatchValue>90 ){
								this.$message.error( "满足条件：仅允许输入整数天数且不超过90天!" );
								return false;
							}
						}else{
							this.addForm.MatchValue=0;
						}
						if( this.addForm.Strategy=='固定金额提额' ){
							console.log( this.addForm.StrategyValue );
							if( this.addForm.StrategyValue%1!=0 || this.addForm.StrategyValue<0 || this.addForm.StrategyValue>5000 ){
								this.$message.error( "提额策略：仅允许输入不超过5000元的整数金额（可为0）!" );
								return false;
							}
						}else if( this.addForm.Strategy=='按比例提额' ){
							if( this.addForm.StrategyValue<0 || this.addForm.StrategyValue>300 ){
								this.$message.error( "提额策略：仅允许输入不超过300%的数值（支持2位小数，及0）!" );
								return false;
							}
							if( this.addForm.StrategyValue%1!=0 ){
								console.log(String(this.addForm.StrategyValue).split(".")[1].length);
								if( String(this.addForm.StrategyValue).split(".")[1].length>2 ){
									this.$message.error( "提额策略：仅允许输入不超过300%的数值（支持2位小数，及0）!" );
									return false;
								}else{
									this.addForm.StrategyValue=parseFloat(this.addForm.StrategyValue);
								}
							}
						}
						setincrinfo(this.addForm).then((res) => {
							if( res.Ret === 200 ){
								this.$message.success( res.Msg );
								let that=this;
								setTimeout(function(){
									that.historyBack();
								},1000);
							}
							if(res.Ret == 100){
								this._sendCode(this.addForm,setincrinfo).then(res=>{
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

<style  lang="scss">

</style>