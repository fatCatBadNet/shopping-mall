<template>
	<section>
		<el-form ref="form" :model="form" label-width="120px" label-position="right" :rules="rules" v-loading="loading">
			<el-form-item prop="AppName" style="margin-top:20px;">
				<div slot="label" class="label-slot">
					<span>APP名称：</span>
				</div>
				<el-input v-model="form.AppName" placeholder="请输入" auto-complete="off" style="width:200px;" @blur="handleBlur"></el-input>
			</el-form-item>
			<el-form-item prop="AppIconUrl">
				<div slot="label" class="label-slot">
					<span>APP图标：</span>
				</div>
				<up-load @loadData="handleLoadData" :imgUrl.sync="form.AppIconUrl" :actionUrl="uploadUrl+'/upload/upload'" :data="{Merchant:merchant}"></up-load>
				<span class="note">建议格式为png，尺寸为224*224</span>
			</el-form-item>
			<el-form-item prop="DqrUrl">
				<div slot="label" class="label-slot">
					<span>APP二维码：</span>
				</div>
				<up-load @loadData="handleLoadData" :imgUrl.sync="form.DqrUrl" :actionUrl="uploadUrl+'/upload/upload'" :data="{Merchant:merchant}"></up-load>
				<span class="note">为APP下载链接二维码，建议格式为png，尺寸为360*360</span>
			</el-form-item>
		</el-form>
		<div style="height:80px; background:rgba(255,255,255,1); text-align:center; font:16px/80px '微软雅黑'; box-shadow:0 0 10px #ddd; position:fixed; bottom:20px; right:35px; left:165px; z-index:10;">
			<label style="color:#999;">修改了 &nbsp;&nbsp;<b class="editwordSty">{{count}}</b>项配置</label>
			<el-button type="primary" size="medium" @click="handleUpdate" style="margin:0 20px;">立即应用</el-button>
			<span class="editwordSty" @click="resizeData">放弃修改</span>
		</div>
	</section>
</template>
<script>
	import {websetappinfo,editwebsetapp} from "api/api.js";
	import UpLoad from "@/components/upload.vue";
	import {clearTimeout,setTimeout} from 'timers';
	let timer;
	export default {
		data() {
			return {
				loading: false,
				merchant: JSON.parse(sessionStorage.getItem("userDtl")).Merchant,
				uploadUrl: process.env.API_ROOT,
				form: {
					AppName: "",
					AppIconUrl: "",
					DqrUrl: ""
				},
				rules: {
					AppName: [{
						required: true,
						message: "请输入公司全称",
						trigger: "blur"
					}],
					AppIconUrl: [{
						required: true,
						message: "请上传APP图标",
						trigger: "blur"
					}],
					DqrUrl: [{
						required: true,
						message: "请上传APP首页",
						trigger: "blur"
					}]

				},
				realCopyData: {},
				count: 0
			};
		},
		mounted() {
			this.getDetail();
		},
		methods: {
			handleLoadData() {
				this.count = this.getUpdateCount(this.realCopyData, this.form);
			},
			handleUpdate() {
				this.$refs.form.validate(valid => {
					if(valid) {
						clearTimeout(timer);
						this.loading = true;
						editwebsetapp(this.form).then(res => {
							timer = setTimeout(() => {
								this.loading = false;
							}, 300);

							if(res.Ret == 200) {
								this.$message.success(res.Msg);

								this.getDetail();
								this.count = 0;
							}
						});
					}
				});
			},
			getDetail() {
				websetappinfo({}).then(res => {
					if(res.Ret == 200) {
						this.form = res.Result;
						this.realCopyData = JSON.parse(JSON.stringify(res.Result));
					}
				});
			},
			handleBlur() {
				this.count = this.getUpdateCount(this.realCopyData, this.form);
			},
			getUpdateCount(copyData, nowData) {
				// 深拷贝的元数据     更改过后的数据
				let count = 0;
				for(let [item, value] of Object.entries(copyData)) {
					if(value === nowData[item]) {
						continue;
					} else {
						count++;
					}
				}
				return count;
			},
			resizeData() {
				this.form = JSON.parse(JSON.stringify(this.realCopyData));
				this.count = 0;
			}
		},
		components: {UpLoad}
	};
</script>

<style lang="scss" scoped>
	.arc {
		display: inline-block;
		width: 24px;
		height: 24px;
		border: 1px solid #ff0000;
		border-radius: 50%;
		line-height: 24px;
		text-align: center;
		color: #ff0000;
		font-size: 12px;
	}
	
	.note {
		display: inline-block;
		margin-left: 10px;
		color: #84909D;
		vertical-align: top;
	}
	
	.label-slot {
		display: inline-block;
		color: #BBBBBB;
	}
	
	.example {
		text-align: center;
		.img-title {
			font-size: 14px;
			margin-bottom: 10px;
			display: block;
		}
		.img-example {
			width: 576px;
		}
		.btn-example {
			font-size: 14px;
			display: block;
			margin: 0 auto;
		}
	}
	
	#bigImgDialog {
		background: rgba(0, 0, 0, 0.5);
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 999;
		overflow: scroll;
	}
</style>