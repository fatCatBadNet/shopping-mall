<template>
	<div id="giveoutset" style="padding-bottom:80px;">
		<!-- <el-card class="box-card">
			<div style="height:50px; font:16px/50px '微软雅黑'; display:flex; margin-bottom:50px;">
				<div style="flex:0 0 100px; width:100px;">放款策略选择</div>
				<div style="flex:1; border-bottom:1px dashed #ccc;"></div>
			</div>
			<div style="color:#999;">
				<el-col :span="6">请根据您的业务情况，选择您需要的放款策略</el-col>
				<el-col :span="12">
    				<div style="padding:30px 40px; box-sizing:border-box; text-align:center; border:1px solid #eaeaea; border-radius:6px; background:#f9f9f9;">
    					<el-input-number v-model="ManualWeight" :disabled="true"></el-input-number>
    					<el-slider v-model="ManualWeight" :step="10" show-stops @change="changeslider"></el-slider>
    				</div>
    				<div style="padding:20px 10px; box-sizing:border-box;">
    					<el-col :span="24" style="color:#666; margin-bottom:10px;">自动放款比例，数值越高，则自动放款比例越高。</el-col>
    					<el-col :span="24" style="line-height:26px;">示例： 如比例为0，则全部为手动放款（需至风控-放款管理中操作）;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 如比例为100，则全部自动放款。</el-col>
    				</div>
				</el-col>
				<el-col :span="6"></el-col>
			</div>
		</el-card> -->
		<!-- <el-card class="box-card">
			<div style="height:50px; font:16px/50px '微软雅黑'; display:flex; margin-bottom:50px;">
				<div style="flex:0 0 140px; width:140px;">应用市场伪装开关</div>
				<div style="flex:1; border-bottom:1px dashed #ccc;"></div>
			</div>
			<div style="color:#999;">
				<el-col :span="6">安卓应用市场上架时，控制是否显示APP账单</el-col>
				<el-col :span="18" v-if="isshowSwitch" style="overflow:auto;">
					<p style="color:#666; margin-bottom:10px; padding-left:20px; box-sizing:border-box;">开关关闭，则APP显示账单模块，上架应用市场时，建议开启开关。</p>
    				<div class="switcdiv">
    					<label>腾讯应用宝</label>
    					<el-switch v-model="Switchs[0]" active-value="腾讯应用宝" @change="changeslider"></el-switch> 
    				</div>
    				<div class="switcdiv">
    					<label>小米应用商店</label>
    					<el-switch v-model="Switchs[1]" active-value="小米应用商店" @change="changeslider"></el-switch>
    				</div>
    				<div class="switcdiv">
    					<label>魅族应用商店</label>
    					<el-switch v-model="Switchs[2]" active-value="魅族应用商店" @change="changeslider"></el-switch>
    				</div>
    				<div class="switcdiv">
    					<label>华为应用商店</label>
    					<el-switch v-model="Switchs[3]" active-value="华为应用商店" @change="changeslider"></el-switch>
    				</div class="switcdiv">
    				<div class="switcdiv">
    					<label>OPPO应用商店</label>
    					<el-switch v-model="Switchs[4]" active-value="OPPO应用商店" @change="changeslider"></el-switch>
    				</div class="switcdiv">
    				<div class="switcdiv">
    					<label>VIVO应用商店</label>
    					<el-switch v-model="Switchs[5]" active-value="VIVO应用商店" @change="changeslider"></el-switch>
    				</div class="switcdiv">
    				<div class="switcdiv">
    					<label>奇虎360手机助手</label>
    					<el-switch v-model="Switchs[6]" active-value="奇虎360手机助手" @change="changeslider"></el-switch>
    				</div>
				</el-col>
			</div>
		</el-card>
		<el-card class="box-card">
			<div style="height:50px; font:16px/50px '微软雅黑'; display:flex; margin-bottom:50px;">
				<div style="flex:0 0 140px; width:140px;">谷歌验证器开关</div>
				<div style="flex:1; border-bottom:1px dashed #ccc;"></div>
			</div>
			<div style="color:#999;">
				<el-col :span="6">请根据您的业务情况，选择是否开启谷歌验证器</el-col>
				<el-col :span="18" style="overflow:auto;">
					<p style="color:#666; margin-bottom:10px; padding-left:20px; box-sizing:border-box;">打开谷歌验证器，在登录及关键操作步骤进行验证，可提高网站安全。</p>
    				<div class="switcdiv">
    					<label>谷歌验证器</label>
    					<el-switch v-model="IsGooAuth" :active-value="true" :inactive-value="false" @change="changeslider"></el-switch> 
    				</div>
				</el-col>
			</div>
		</el-card> -->

		<el-card class="box-card">
			<div style="height:50px; font:16px/50px '微软雅黑'; display:flex; margin-bottom:50px;">
				<div style="flex:0 0 200px;">借款人工审核-自动分配</div>
				<div style="flex:1; border-bottom:1px dashed #ccc;"></div>
			</div>
			<div style="color:#999;">
				<el-col :span="6">借款人工审核-自动分配</el-col>
				<el-col :span="18" style="overflow:auto;">
					
    				<div style="margin-bottom:34px;">

						<el-radio-group v-model="LoanAutoAllotSwitch" @change="changeslider">
							<el-radio-button style="margin-right:64px;" label="ON">顺序分配</el-radio-button>
							<el-radio-button style="border-left:1px solid #dcdfe6;" label="OFF">倒序分配</el-radio-button>

						</el-radio-group>
    				</div>
					<p style="color:#666; margin-bottom:10px; box-sizing:border-box;">顺序分配：<span style="color: #e51c23;">最近</span>时间的借款申请用户优先自动分配</p>
					<p style="color:#666; margin-bottom:10px; box-sizing:border-box;">倒序分配：<span style="color: #e51c23;">最早</span>时间的借款申请用户优先自动分配</p>
				</el-col>
			</div>
		</el-card>
		<div v-show="isloading" style="height:80px; background:rgba(255,255,255,1); text-align:center; font:16px/80px '微软雅黑'; box-shadow:0 0 10px #ddd; position:fixed; bottom:20px; right:32px; left:165px; z-index:10;">
			<label style="color:#999;">修改了 &nbsp;&nbsp;<b class="editwordSty">{{changeCount}}</b>项配置</label>
			<el-button type="primary" size="medium" @click="goSave" style="margin:0 20px;">立即应用</el-button>
			<span class="editwordSty" @click="getDtl">放弃修改</span>
		</div>
	</div>
</template>

<script>
import { loanstrategydetail,motifyloanstrategy } from 'api/api.js';
export default {
	data(){
		return {
			isloading:false,
			firstvalue:0,
			firstGooAuth:null,
			firstSwitchs:'',
			firstGooAuth2:null,
			ManualWeight:0,
			SystemWeight:null,
			isshowSwitch:false,
			Switchs:['腾讯应用宝','小米应用商店','魅族应用商店','华为应用商店','OPPO应用商店','VIVO应用商店','奇虎360手机助手'],
			SwitchsArr:[],
			IsGooAuth:false,
			LoanAutoAllotSwitch:'',
			changeCount:0
		}
	},
	mounted(){
		this.getDtl();
	},
	methods: {
		getDtl(){
			loanstrategydetail({}).then((res) => {
				console.log(res);
				if( res.Ret==200 ){
					//放款策略选择参数
					if( res.LoanStrategy.SystemWeight==1&&res.LoanStrategy.ManualWeight!=9 ){
						this.firstvalue=res.LoanStrategy.SystemWeight*100;
						this.ManualWeight=res.LoanStrategy.SystemWeight*100;
					}else{
						this.firstvalue=res.LoanStrategy.SystemWeight*10;
						this.ManualWeight=res.LoanStrategy.SystemWeight*10;
					}
					//应用市场伪装开关参数
					this.Switchs.forEach((item,index)=>{
						if( res.Switchs.join(',').indexOf(item)==-1 ){
							this.Switchs[index]='';
						}
					});
					this.isshowSwitch=true;
					this.firstSwitchs=res.Switchs.join(',');
					//谷歌验证器开关参数
					this.IsGooAuth=res.IsGooAuth;
					this.LoanAutoAllotSwitch=res.LoanAutoAllotSwitch;
					this.firstGooAuth=res.IsGooAuth;
					this.firstGooAuth2=res.LoanAutoAllotSwitch;
					//修改项数
					this.changeCount=0;
					this.isloading=false;
				}
			});
		},
		goSave(){
			let params={};
			//放款策略选择参数
			if( this.ManualWeight==0 ){
				params.ManualWeight=1;
				params.SystemWeight=0;
			}else if( this.ManualWeight==100 ){
				params.ManualWeight=0;
				params.SystemWeight=1;
			}else{
				let len = this.ManualWeight/10;
				params.ManualWeight=10-len;
				params.SystemWeight=len;
			}
			//应用市场伪装开关参数
			this.SwitchsArr=[];
			this.Switchs.forEach(item=>{
				if( item!=false ){
					this.SwitchsArr.push(item);
				}
			});
			params.Switchs=this.SwitchsArr;
			//谷歌验证器开关参数
			params.IsGAuth=this.IsGooAuth;
			params.LoanAutoAllotSwitch=this.LoanAutoAllotSwitch;
			console.log(params);
			motifyloanstrategy(params).then((res) => {
				if( res.Ret==200 ){
					this.$message.success( res.Msg );
					this.getDtl();
				}
				if(res.Ret == 100){
					this._sendCode(params,motifyloanstrategy).then(res=>{
							if( res.Ret==200 ){
								this.$message.success( res.Msg );
								this.getDtl();
							}
					})
				}
			});
		},
		changeslider(){
			let changeCount=0
			if( this.firstvalue!=this.ManualWeight ){
				changeCount++;
			}
			let switchsArr=[];
			this.Switchs.forEach(item=>{
				if( item!=false ){
					switchsArr.push(item);
				}
			});
			if( this.firstSwitchs!=switchsArr.join(',') ){
				changeCount++;
			}
			if( this.firstGooAuth!=this.IsGooAuth ){
				changeCount++;
			}
			if( this.firstGooAuth2!=this.LoanAutoAllotSwitch ){
				changeCount++;
			}
			if( changeCount==0 ){
				this.isloading=false;
			}else{
				this.changeCount=changeCount;
				this.isloading=true;
			}
		}
		
	}
}	
</script>

<style  lang="scss">
	#giveoutset{
		.switcdiv{ float:left; width:25%; padding:20px 0; text-align:center; border:1px solid rgb(234,234,234); background:rgb(249,249,249); border-radius:5px; margin:20px; }
		.switcdiv>label{ display:inline-block; width:150px; color:#59616A; text-align:left; }
		.el-radio-button:first-child .el-radio-button__inner{
			border-radius: 4px;
		}
		.el-radio-button:last-child .el-radio-button__inner{
			border-radius: 4px;
		}
	}
	
</style>