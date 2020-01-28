<template>
	<div style="padding-bottom:100px;">
        <el-card style="box-shadow:none; box-sizing:border-box; border:1px solid #EAEAEA; padding:0 10px; margin-bottom:10px;">
	        <div slot="header" class="clearfix" style="color:#101010;">
	        	<span class="header-left">用户信息</span>
	        </div>
            <el-row :span="24" class="list">
                <el-col :span="24" class="item">
                    <div class="label-item">商户名：</div>
                    <div class="label-value">{{Result.MerchantName}}</div>
                </el-col>
                <el-col :span="24" class="item">
                    <div class="label-item">商户号：</div>
                    <div class="label-value">{{Result.MerchantCode}}</div>
                </el-col>
                <el-col :span="24" class="item">
                    <div class="label-item">手机号：</div>
                    <div class="label-value">{{Result.Phone}}</div>
                </el-col>
                <el-col :span="24" class="item">
                    <div class="label-item">邮箱：</div>
                    <div class="label-value">{{Result.Email}}</div>
                </el-col>
                <el-col :span="24" class="item" style="padding-bottom:0;">
                    <div class="label-item">账号状态：</div>
                    <div class="label-value" style="color:#348EF2;">{{Result.AccountState}}</div>
                </el-col>
            </el-row>
        </el-card>
		<el-tabs v-model="activeName" style="background:#ffffff;padding:10px 10px;">
			<el-tab-pane label="产品标识" name="产品标识">
				<product-icon v-if="activeName=='产品标识'"></product-icon>
			</el-tab-pane>
		    <el-tab-pane label="页面设置" name="页面设置">
		    	<page-set v-if="activeName=='页面设置'"></page-set>
		    </el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import { ofccmpninfo } from "api/api.js";
	import http from "@/api/http.js";
	import ProductIcon from "./product_icons";
	import PageSet from "./page_set";
	export default {
		data() {
			return {
				activeName:"产品标识",
				Result:{},
			}
		},
		mounted() {
			this.getcmpninfo();
		},
		methods: {
			getcmpninfo(){ 
				ofccmpninfo({}).then(res=>{
					console.log(res);
					if(res.Ret == 200){
						this.Result = res.Result;
					}
				})
			}
		},
		components:{ProductIcon,PageSet}
	}
</script>

<style scoped lang="scss">
.list{
	.item{
		padding-bottom: 20px;
		.label-item{
        width: 80px;
        text-align: right;
        display: inline-block;
        color: #BBBBBB;
		}
		.label-value{
			display: inline-block;
		}
	}
}
    
</style>