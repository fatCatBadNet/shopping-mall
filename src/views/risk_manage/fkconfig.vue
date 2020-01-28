<template>
	<div style="padding-bottom:80px; overflow:auto;">
		<div style="width:100%; overflow:auto;">
			<el-card class="box-card" style="width:49.3%; min-height:446px; float:left; margin-right:1%;" v-if="!DirectLoan">
				<div slot="header" class="clearfix">授信结果配置</div>
				<div>
					<table border="1" cellspacing="0" cellpadding="0" bordercolor="#ebeef5" style="width:610px;" class="zdytable">
						<tr>
							<th style="width:50%;">风控建议结果</th>
							<th style="width:50%;">处理方式</th>
						</tr>
						<tr v-for="(item,index) in StateTransSetArr" :key="index" v-if="item.UserOperation=='CREDIT'">
							<td>{{item.FkState=="PASS"?"通过":item.FkState=="REFUSE7"?"关闭7天":item.FkState=="REFUSE30"?"关闭30天":item.FkState=="REFUSEALL"?"永久关闭":item.FkState=="REFUSE0"?"正常关闭":""}}</td>
							<td>
								<el-select v-model="item.FinalState" placeholder="请选择" @change="goChangeCount">
									<el-option label="建议结果即为最终结果" value="DEFAULT"></el-option>
									<el-option label="授信人工审核" value="MANUAL"></el-option>
								</el-select>
							</td>
						</tr>
					</table>
				</div>
			</el-card>
			<el-card class="box-card" style="width:49.3%; min-height:446px; float:left;">
				<div slot="header" class="clearfix">借款结果配置</div>
				<div>
					<table border="1" cellspacing="0" cellpadding="0" bordercolor="#ebeef5" style="width:610px;" class="zdytable">
						<tr>
							<th style="width:50%;">风控建议结果</th>
							<th style="width:50%;">处理方式</th>
						</tr>
						<tr v-for="(item,index) in StateTransSetArr" :key="index" v-if="item.UserOperation=='LOAN'">
							<td>{{item.FkState=="PASS"?"通过":item.FkState=="REFUSE7"?"关闭7天":item.FkState=="REFUSE30"?"关闭30天":item.FkState=="REFUSEALL"?"永久关闭":item.FkState=="REFUSE0"?"正常关闭":""}}</td>
							<td>
								<el-select v-model="item.FinalState" placeholder="请选择" @change="goChangeCount">
									<el-option label="建议结果即为最终结果" value="DEFAULT"></el-option>
									<el-option label="借款人工审核" value="MANUAL"></el-option>
								</el-select>
							</td>
						</tr>
					</table>
				</div>
			</el-card>
		</div>
		<el-card class="box-card">
			<div slot="header" class="clearfix"><b>配置说明</b></div>
			<div class="tips">
				<p>在此配置全自动机审或配置半自动审核。半自动机审，借款审核需要人工介入，系统只出建议结果。</p>
				<br/>
				<div v-if="!DirectLoan">
					<b>一、App业务模式：授信审核-->借款审核</b>
					<p>全自动机审：授信结果配置，处理方式全部为[建议结果即为最终结果]。借款结果配置，处理方式全部为[建议结果即为最终结果]。</p>
					<p>半自动机审：授信结果配置，处理方式全部为[建议结果即为最终结果]。借款结果配置，处理方式全部为[借款人工审核]。</p>
				</div>
				<div v-else>
					<b>一、App业务模式：借款审核</b>
					<p>全自动机审：借款结果配置，处理方式全部为[建议结果即为最终结果]。</p>
					<p>半自动机审：借款结果配置，处理方式全部为[借款人工审核]。</p>
				</div>
				<br/>
				<b>二、更多配置</b>
				<p>全/半自动机审：全/半自动模式下，对于风险较低用户，也可以配置成借款人工审核，提高转化率。示例：系统建议正常关闭、关闭7天的用户，处理方式配置成[借款人工审核]。</p>
			</div>
		</el-card>
		<div v-if="changeCount>0" style="height:80px; background:#fff; text-align:center; font:16px/80px '微软雅黑'; box-shadow:0 0 10px #ddd; position:fixed; bottom:20px; right:35px; left:165px; z-index:10;">
			<label style="color:#999;">已选择 &nbsp;<b class="editwordSty">{{changeCount}}</b>条</label>
			<el-button type="primary" size="medium" @click="setChangeCount" style="margin:0 20px;">立即应用</el-button>
			<el-button type="primary" plain size="medium" @click="getinfo" style="margin:0 20px;">放弃修改</el-button>
		</div>
	</div>
</template>

<script>
	import { fkresultconfig,updatefkresultconfig } from "api/api.js";
	export default {
		data() {
			return {
				changeCount:0,
				changeArr:[],
            	StateTransSetArr:[],
            	rrStateTransSetArr:[],
				DirectLoan:false
			};
		},
		mounted() {
        	this.getinfo();
		},
		methods: {
			getinfo(){
				fkresultconfig({}).then(res => {
					console.log(res);
					if(res.Ret == 200) {
						this.StateTransSetArr=res.StateTransSet || [];
						this.rrStateTransSetArr=JSON.parse(JSON.stringify(res.StateTransSet || []));
						this.changeCount=0;
						this.DirectLoan=res.DirectLoan;
					}
				});
			},
			goChangeCount(){
				this.changeCount=0;
				this.changeArr=[];
				this.rrStateTransSetArr.forEach((item,index)=>{
					if( this.rrStateTransSetArr[index].FinalState!=this.StateTransSetArr[index].FinalState ){
						this.changeArr.push({FinalState:this.StateTransSetArr[index].FinalState,Id:this.StateTransSetArr[index].Id });
						this.changeCount++;
					}
				});
			},
			setChangeCount(){
				updatefkresultconfig({StateTransSetList:this.changeArr}).then(res => {
					if(res.Ret == 200) {
						this.$message.success( res.Msg );
						this.getinfo();
					}
					if(res.Ret == 100){
						this._sendCode({StateTransSetList:this.changeArr},updatefkresultconfig).then(res=>{
								if( res.Ret === 200 ){
									this.$message.success( res.Msg );
									this.getinfo();
								}
						})
					}
				});
			}
		}
	};
</script>

<style scoped lang="scss">
	.zdytable th{ padding:12px 20px; background:#f9f9f9; text-align:left; }
	.zdytable td{ padding:10px 20px; }
	.tips b{ font:700 14px/34px '微软雅黑'; }
	.tips p{ font:14px/28px '微软雅黑'; }
</style>