<template>
	<div style="padding:20px; box-sizing:border-box; min-width:1200px;">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span style="font:16px/30px '微软雅黑';">用户详情1</span>
				<!--<el-button type="primary" size="small" style="float:right; margin-left:20px;" @click="goaddressbookinit">初始化通讯录</el-button>-->
				<el-button type="primary" size="small" style="float:right;" @click="golivinginit">初始化人脸</el-button>
				<el-button type="primary" size="small" style="float:right; margin-right:20px;" @click="deleteUser">删除用户</el-button>
			</div>
			<userdtl :uid="authId"></userdtl>
		</el-card>
		<el-card class="box-card" v-if="isshow">
			<el-tabs v-model="activeName" lazy @tab-click="handleClick">
				<el-tab-pane label="风控报告" name="风控报告">
		    		<fkreport :uid="authId"></fkreport>
		    	</el-tab-pane>
		    	<el-tab-pane label="借款记录1" name="借款记录">
		    		<loanrecord :uid="authId" @goloanrecord="activeName='还款记录'"></loanrecord>
		    	</el-tab-pane>
		    	<el-tab-pane label="续期记录" name="续期记录">
		    		<renewrecord :uid="authId"></renewrecord>
		    	</el-tab-pane>
		    	<el-tab-pane label="还款记录" name="还款记录">
		    		<repaymentrecord :uid="authId"></repaymentrecord>
		    	</el-tab-pane>
		    	<!-- <el-tab-pane label="报告购买记录" name="报告购买记录">
		    		<reportbuyrecord :uid="authId"></reportbuyrecord>
		    	</el-tab-pane> -->
		    	<el-tab-pane label="银行卡" name="银行卡">
		    		<usersbankcard :uid="authId"></usersbankcard>
		    	</el-tab-pane>
		    	<!-- <el-tab-pane label="消息中心" name="消息中心">
		    		<messagecenter :uid="authId"></messagecenter>
		    	</el-tab-pane> -->
		    	<!-- <el-tab-pane label="邀请记录" name="邀请记录">
		    		<invitationrecord :uid="authId"></invitationrecord>
		    	</el-tab-pane> -->
		    	<el-tab-pane label="登录信息" name="登录信息">
		    		<loginrecords :uid="authId"></loginrecords>
		    	</el-tab-pane>
		    	<el-tab-pane label="联系人&通讯录" name="联系人&通讯录">
		    		<addressbook :uid="authId"></addressbook>
		    	</el-tab-pane>
		    	<el-tab-pane label="通讯录对比" name="通讯录对比">
		    		<phoneoperators :uid="authId"></phoneoperators>
		    	</el-tab-pane>
		    	<el-tab-pane label="实名认证" name="实名认证">
		    		<identify :uid="authId"></identify>
		    	</el-tab-pane>
		    	<el-tab-pane label="联系历史" name="联系历史">
		    		<contacthistory :uid="authId"></contacthistory>
		    	</el-tab-pane>
		  	</el-tabs>
		</el-card>
	</div>
</template>

<script>
	import { livinginit,addressbookinit,reguserdel } from 'api/api.js';
	import fkreport from '@/components/userDtl/fkreport.vue';
	import userdtl from '@/components/userDtl/userdtl.vue';
	import loginrecords from '@/components/userDtl/loginrecords.vue';
	import reportbuyrecord from '@/components/userDtl/reportbuyrecord.vue';
	import messagecenter from '@/components/userDtl/messagecenter.vue';
	import repaymentrecord from '@/components/userDtl/repaymentrecord.vue';
	import loanrecord from '@/components/userDtl/loanrecord.vue';
	import usersbankcard from '@/components/userDtl/usersbankcard.vue';
	import invitationrecord from '@/components/userDtl/invitationrecord.vue';
	import identify from '@/components/userDtl/identify.vue';
	import addressbook from '@/components/userDtl/addressbook.vue';
	import phoneoperators from '@/components/userDtl/phoneoperators.vue';
	import renewrecord from '@/components/userDtl/renewrecord.vue';
	import contacthistory from '@/components/userDtl/contacthistory.vue';
	export default {
		data(){
			return {
				authId:this.$route.params.id,
				isshow:true,
				loading:false,
				activeName:'风控报告'
			}
		},
		mounted(){
			let repaylist = sessionStorage.getItem("repaylist") || null;
			if( repaylist ){
				this.activeName="还款记录";
				sessionStorage.removeItem('repaylist');
			}
		},
		methods: {
			golivinginit(){  //初始化人脸
				this.$confirm('确定初始化人脸吗?','提示',{
					type:'warning'
				}).then(() => {
					this.isshow=false;
					livinginit({Uid:parseInt(this.authId)}).then((res) => {
						console.log(res);
						if( res.Ret == 200 ){
							this.$message.success( res.Msg );
						}
						this.isshow=true;
					});
				}).catch(() => {  });
			},
			goaddressbookinit(){  //初始化通讯录
				this.$confirm('确定初始化通讯录吗?','提示',{
					type:'warning'
				}).then(() => {
					this.isshow=false;
					addressbookinit({Uid:parseInt(this.authId)}).then((res) => {
						console.log(res);
						if( res.Ret == 200 ){
							this.$message.success( res.Msg );
						}
						this.isshow=true;
					});
				}).catch(() => {  });
			},
			deleteUser(){  //删除用户
				let that=this;
				this.$confirm('删除后，将丢失所有该用户的数据且无法恢复，请谨慎操作。是否确认删除？','删除用户数据',{
					confirmButtonText:'删除',
					confirmButtonClass:'confirmButton',
					cancelButtonText:'取消',
					cancelButtonClass:'cancelButton',
					center:true
				}).then(() => {
					this.loading = true;
					reguserdel({Uids:[parseInt(that.authId)]}).then((res) => {
					    this.timer = setTimeout(()=>{
					        this.loading = false;
					    },300);
					    if( res.Ret==200 ){
					        this.$message.success( res.Msg );
							setTimeout(function(){
// 								that.$router.push({
// 									path:"/reguserlist"
// 								});
								history.back();
							},1000);
					    }
					    if( res.Ret==100 ){
							this._sendCode({Uids:[parseInt(that.authId)]},reguserdel).then(res=>{
								if( res.Ret === 200 ){
									this.$message.success( res.Msg );
									setTimeout(function(){
// 										that.$router.push({
// 											path:"/reguserlist"
// 										});
										history.back();
									},1000);
								}
					        })
					    }
					});
				}).catch(() => {  });
			}
		},
		components:{fkreport,userdtl,loginrecords,reportbuyrecord,messagecenter,repaymentrecord,loanrecord,usersbankcard,invitationrecord,identify,addressbook,phoneoperators,renewrecord,contacthistory}
	}
</script>

<style lang="scss" scoped>
	.el-card{ padding-bottom:0; }
</style>