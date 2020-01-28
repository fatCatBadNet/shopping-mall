<template>
	<section class="page-set">
		<el-form ref="form" :model="form" label-width="120px" label-position="right" :rules="rules" v-loading="loading">
			<el-card style="box-shadow:none; box-sizing:border-box; border:1px solid #EAEAEA; padding:0 10px; margin-bottom:10px;">
				<div slot="header" class="clearfix" style="color:#101010;">
					<span class="header-left">官网</span>
				</div>
				<el-form-item prop="PageTitle">
					<div slot="label" class="label-slot">
						<span>页面标题：</span>
					</div>
					<el-input v-model="form.PageTitle" placeholder="请输入" auto-complete="off" style="width:200px;" @blur="handleBlur"></el-input>
					<span style="color:#84909D;"> 页面标题、页面描述、页面关键词用于网页SEO搜索</span>
				</el-form-item>
				<el-form-item prop="PageKey">
					<div slot="label" class="label-slot">
						<span>页面关键词：</span>
					</div>
					<el-input v-model="form.PageKey" placeholder="请输入" auto-complete="off" style="width:200px;" @blur="handleBlur"></el-input>
					<span style="color:#84909D;"> 请用英文逗号隔开</span>
				</el-form-item>
				<el-form-item prop="PageDesc">
					<div slot="label" class="label-slot">
						<span>页面描述：</span>
					</div>
					<el-input type="textarea" v-model="form.PageDesc" placeholder="请输入" auto-complete="off" style="width:200px;" @blur="handleBlur"></el-input>
				</el-form-item>
				<el-form-item prop="OfcWebDomain">
					<div slot="label" class="label-slot">
						<span>域名：</span>
					</div>
					<el-input v-model="form.OfcWebDomain" placeholder="请输入" auto-complete="off" style="width:200px;" @blur="handleBlur"></el-input>
				</el-form-item>
				<el-form-item prop="IcpCode">
					<div slot="label" class="label-slot">
						<span>ICP编号：</span>
					</div>
					<el-input v-model="form.IcpCode" placeholder="请输入" auto-complete="off" style="width:200px;" @blur="handleBlur"></el-input>
				</el-form-item>
			</el-card>
			<el-card style="box-shadow:none; box-sizing:border-box; border:1px solid #EAEAEA; padding:0 10px; margin-bottom:10px;">
				<div slot="header" class="clearfix" style="color:#101010;">
					<span class="header-left">推广注册页</span>
				</div>
				<el-form-item prop="RegisterDomain">
					<div slot="label" class="label-slot">
						<span>域名：</span>
					</div>
					<el-input v-model="form.RegisterDomain" placeholder="请输入" auto-complete="off" style="width:200px;" @blur="handleBlur"></el-input>
				</el-form-item>
				<el-form-item prop="RegisterTitle">
					<div slot="label" class="label-slot">
						<span>标题：</span>
					</div>
					<el-input v-model="form.RegisterTitle" placeholder="请输入" auto-complete="off" style="width:200px;" @blur="handleBlur"></el-input>
				</el-form-item>
				<el-form-item prop="RegisterTplId">
					<div slot="label" class="label-slot">
						<span>选中模板：</span>
					</div>
					<el-radio-group v-model="form.RegisterTplId" size="small">
						<div style="display:inline-block; margin-right:30px; vertical-align: top;" v-for="(item,index) in RegisterTpls" :key="index">
							<el-radio :class="{radioDIY:true,'is-checked':form.RegisterTplId === item.Id.toString()}" :label="item.Id.toString()" @change="handleChange">
								<img class="thumbnail" :src="item.PreviewUrl" alt="">
								<div class="checked-active">
									<span>选中</span>
								</div>
							</el-radio>
							<div style="text-align:center;">
								<a v-if="count<=0 && form.RegisterDomain && (form.RegisterTplId === item.Id.toString())" :href="item.TargetAddr" target="_blank" style="font-size:14px;color:#409EFF !important;display:inline-block; padding:10px  0 0;">预览</a>
							</div>
						</div>
					</el-radio-group>
				</el-form-item>
			</el-card>
			<el-card style="box-shadow:none; box-sizing:border-box; border:1px solid #EAEAEA; padding:0 10px; margin-bottom:10px;">
				<div slot="header" class="clearfix" style="color:#101010;">
					<span class="header-left">下载页</span>
				</div>
				<el-form-item prop="DownloadDomain">
					<div slot="label" class="label-slot">
						<span>域名：</span>
					</div>
					<el-input v-model="form.DownloadDomain" placeholder="请输入" auto-complete="off" style="width:200px;" @blur="handleBlur"></el-input>
				</el-form-item>
				<el-form-item prop="DownloadTplId">
					<div slot="label" class="label-slot">
						<span>选中模板：</span>
					</div>
					<el-radio-group v-model="form.DownloadTplId" size="small">
						<div style="display:inline-block; margin-right:30px;vertical-align: top;" v-for="(item,index) in DownloadTpls" :key="index">
							<el-radio :class="{radioDIY:true,'is-checked':form.DownloadTplId === item.Id.toString()}" :label="item.Id.toString()" @change="handleChange">
								<img class="thumbnail" :src="item.PreviewUrl" alt="">
								<div class="checked-active">
									<span>选中</span>
								</div>
							</el-radio>
							<div style="text-align:center;">
								<a v-if="count<=0 && form.RegisterDomain && (form.DownloadTplId === item.Id.toString())" :href="item.TargetAddr" target="_blank" style="font-size:14px;color:#409EFF !important; display:inline-block; padding:10px  0 0;">预览</a>
							</div>
						</div>
					</el-radio-group>
				</el-form-item>
			</el-card>
		</el-form>
		<div style="height:80px; background:rgba(255,255,255,1); text-align:center; font:16px/80px '微软雅黑'; box-shadow:0 0 10px #ddd; position:fixed; bottom:20px; right:35px; left:165px; z-index:10;">
			<label style="color:#999;">修改了 &nbsp;&nbsp;<b class="editwordSty">{{count}}</b>项配置</label>
			<el-button type="primary" size="medium" @click="handleUpdate" style="margin:0 20px;">立即应用</el-button>
			<span class="editwordSty" @click="resizeData">放弃修改</span>
		</div>
	</section>
</template>
<script>
	import {websetpageinfo,editwebsetpage} from "api/api.js";
	import UpLoad from "@/components/upload.vue";
	let timer;
	export default {
		data() {
			return {
				loading: false,
				merchant: JSON.parse(sessionStorage.getItem("userDtl")).Merchant,
				uploadUrl: process.env.API_ROOT,
				RegisterTpls: [],
				DownloadTpls: [],
				form: {
					PageTitle: '', //页面标题
					PageKey: '', //页面关键词
					PageDesc: '', //页面描述
					OfcWebDomain: '', //域名
					IcpCode: '', //ICP编号
					RegisterDomain: '', //注册推广页域名
					RegisterTplId: '', //注册推广页选择模板
					DownloadDomain: '', //下载页域名
					DownloadTplId: '', //下载页选择模板
				},
				rules: {
					PageTitle: [{
						required: true,
						message: "请输入页面标题",
						trigger: "blur"
					}],
					PageKey: [{
						required: true,
						message: "请输入页面关键词",
						trigger: "blur"
					}],
					PageDesc: [{
						required: true,
						message: "请输入页面描述",
						trigger: "blur"
					}],
					OfcWebDomain: [{
						required: true,
						message: "请输入域名",
						trigger: "blur"
					}],
					IcpCode: [{
						required: true,
						message: "请输入ICP编号",
						trigger: "blur"
					}],
					RegisterDomain: [{
						required: true,
						message: "请输入注册推广页域名",
						trigger: "blur"
					}],
					RegisterTitle: [{
						required: true,
						message: "请输入注册推广页标题",
						trigger: "blur"
					}],
					RegisterTplId: [{
						required: true,
						message: "请选择注册推广页模板",
						trigger: "blur"
					}],
					DownloadDomain: [{
						required: true,
						message: "请输入下载页域名",
						trigger: "blur"
					}],
					DownloadTplId: [{
						required: true,
						message: "请选择下载页模板",
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
			handleChange() {
				this.count = this.getUpdateCount(this.realCopyData, this.form);
			},
			handleLoadData() {
				this.count = this.getUpdateCount(this.realCopyData, this.form);
			},
			handleUpdate() {
				this.$refs.form.validate(valid => {
					if(valid) {
						clearTimeout(timer);
						this.loading = true;
						editwebsetpage(this.form).then(res => {
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
				websetpageinfo({}).then(res => {
					console.log('详情', res);
					if(res.Ret == 200) {
						this.form = res.Result;
						this.DownloadTpls = res.DownloadTpls || [];
						this.RegisterTpls = res.RegisterTpls || [];
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
					if(value == nowData[item]) {
						continue;
					} else {
						count++;
					}
				}
				return count;
			},
			resizeData() {
				this.form = JSON.parse(JSON.stringify(this.realCopyData));
				this.$refs.form.resetFields();
				this.count = 0;
			}
		},
		components: {UpLoad}
	};
</script>

<style lang="scss">
	.page-set {
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
			vertical-align: top;
			color: #84909d;
		}
		.label-slot {
			display: inline-block;
			color: #bbbbbb;
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
		.radioDIY {
			position: relative;
			.el-radio__inner {
				display: none !important;
			}
			.el-radio__label {
				padding: 0;
			}
			.thumbnail {
				width: 65px;
				height: 142px;
				background: #84909d;
			}
			.checked-active {
				position: absolute;
				left: 0;
				top: 0;
				background: rgba(0, 0, 0, 0.5);
				width: 100%;
				height: 100%;
				display: none;
				span {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translateX(-50%) translateY(-50%);
					color: #ffffff !important;
				}
			}
		}
		.radioDIY:hover .checked-active {
			display: block !important;
		}
		.is-checked {
			.checked-active {
				display: block !important;
			}
		}
	  	/*input[type="radio"]:checked +.el-radio__label .checked-active{
	    	display: block;
	   	}*/
	}
</style>