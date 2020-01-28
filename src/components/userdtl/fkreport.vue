<template>
    <section>
        <!-- <el-col class="title" :span="24">风控建议</el-col>
        <el-row class="sub-title">
            <el-col class="title-item" :span="12">检查规则</el-col>
            <el-col class="title-item" :span="12">检查提示</el-col>
        </el-row> -->
        <el-collapse id="datacollapse" v-if="isshow" v-model="activeNames">
            <el-collapse-item v-for="(item,index) in userInfo" :key="index" :name="index+1">
                <div class="collapse-title" slot="title">
                    <div class="collapse-title-left">{{item.ModuleName}}</div>
                    <div class="collapse-title-right" v-if="item.advice">
						<i class="header-icon el-icon-warning"></i>
						<el-tooltip class="item" effect="dark" :content="item.advice" placement="top">
							<span style="margin-left:5px;">{{item.advice}}</span>
						</el-tooltip> 
					</div>
                </div>
                <div class="collapse-main">
                    <el-col class="main-item" :span="12" v-for="column in item.columns" :key="column.sort">
						<el-col class="main-title" :span="14">{{column.ParamZh}}</el-col>
						<el-col :span="10">{{column.ParamZh=='芝麻分' && column.ParamValue == 1 ? '-' : disData(column.ParamValue,column.DealType)}}</el-col>
					</el-col>
                </div>
            </el-collapse-item>
        </el-collapse>
		<fkreportdtl :uid='uid'></fkreportdtl>
		<p style="font:16px '微软雅黑'; color:#1D9FFF; text-align:center; cursor:pointer; margin-top:20px;" @click="goidentify(uid)">点击查看《更多详细报告》</p>
    </section>    
</template>

<script>
	import {simplefkadvicedtl} from 'api/api.js';
	// import Identify from './identify.vue';
	import fkreportdtl from '../../views/fkreportdtl.vue';
	export default {
		components:{
			fkreportdtl
		},
		props:{
      		uid:{
        		type:String,
        		default:{type:''}
      		}
    	},
		data() {
			return {
				isshow:false,
				userInfo:[],
				activeNames:[]
			}
		},
		mounted() {
			this.getfkadvicedtl();
		},
		methods: {
			getfkadvicedtl(){ 
				simplefkadvicedtl({Uid:parseInt(this.uid)}).then((res) => {
					console.log(res);
					this.isshow=false;
					if( res.Ret==200 ){
						this.userInfo=res.Result.SimpleRiskItemDetail || [];
						this.isshow=true;
						this.$emit('getReason',res.Reason);
// 						for( var i=0;i<this.userInfo.length;i++ ){
// 							this.activeNames.push( i.toString() );
// 						}
						let a = [...new Array(this.userInfo.length)];
						let b = a.map((item,index)=>{ return index+1});
						this.activeNames = b;
					}
				});
			},
			disData( val,t ){
				if( val || val==0 ){
//					console.log(val,t);
					if( val==-1 ){
						return '数据异常';
					}else if( val==-2 ){
						return '数据缺失';
					}else{
						if( t==1 ){
							return parseInt(parseFloat(val)*10000)/100+'%';
						}else if( t==2 ){
							return parseInt(parseFloat(val)*100)/100;
						}else{
							return val;
						}
					}
				}else{
					return '-';
				}
			},
			goidentify(uid){
				let {href} = this.$router.resolve({path:`/fkreportdtl/${uid}`});
				window.open(href,'_blank');
			}
		}
	}
</script>

<style lang="scss" scoped>
    .title{ background:#409EFF; font:18px/50px "微软雅黑"; color:#fff; text-align:center; }
    .sub-title{ font:16px/50px "微软雅黑"; color:#333;
        .title-item{ box-sizing:border-box; padding-left:100px; }
    }
    .collapse-title{ display:flex; flex:1; height:48px; box-sizing:border-box; overflow:hidden; }
    .collapse-title div{ flex:1; width:50%; padding-left:150px; box-sizing:border-box; }
    .collapse-title-right{ color:#F25E63; }
    .collapse-main .main-item{ padding-left:100px; box-sizing:border-box; margin:8px 0; 
        .main-title{ color:#999; }
    }
</style>