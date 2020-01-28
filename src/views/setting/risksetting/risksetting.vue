<template>
    <div style="min-height:200px; padding-bottom:100px;" v-loading="loading" >
        <el-collapse id="fkcollapse" v-model="activeCollapse">
            <el-collapse-item v-for="(collapseItem,index) in form" :key="index" :name="index+1" >
				<div  class="collapse-title" slot="title">
					<div class="collapse-title-left">{{collapseItem.module_name}}</div>
				</div >
				<div class="collapse-main">
					<list-item :tableData.sync = "collapseItem.show_rule" :typeList = "result_type_list"></list-item>
				</div>
            </el-collapse-item>
        </el-collapse>
        <div  style="height:80px; background:rgba(255,255,255,1); text-align:center; font:16px/80px '微软雅黑'; box-shadow:0 0 10px #ddd; position:fixed; bottom:20px; right:32px; left:162px; z-index:10;">
            <el-button type="primary" size="medium" @click="goReset" style="margin:0 10px;">重置</el-button>
			<el-button type="primary" size="medium" @click="goSave" style="margin:0 10px;">保存</el-button>
			<el-button type="primary" size="medium" @click="getfkshowtemplate" plain  style="margin:0 10px;">取消</el-button>
		</div>
    </div>    
</template>

<script>
	import {fkshowtemplate,fksavetemplate,fkresettemplate} from 'api/api.js';
    import { setTimeout } from 'timers';
    import  ListItem  from './listitem.vue';
	export default {
		data() {
			return {
                loading:false,
                activeCollapse:[],
                result_type_list:[],
				form:[]
			}
		},
		mounted() {
            this.getfkshowtemplate();
		},
		methods: {
            goReset(){
                this.$confirm('确认将风控配置项恢复初始默认值?', '重置提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    fkresettemplate({}).then((res) => {
                        this.timer = setTimeout(()=>{
                            this.loading = false;
                        },300);
                        if( res.Ret==200 ){
                            this.getfkshowtemplate();
                            this.$message.success( res.Msg );
                        }
                        if( res.Ret==100 ){
							this._sendCode({},fkresettemplate).then(res=>{
								if( res.Ret === 200 ){
									this.getfkshowtemplate();
									this.$message.success( res.Msg );
								}
                            })
                        }
                    });
                }).catch(()=>{})
            },
            goSave(){
                let params = {
                    result_type_list:this.result_type_list,
                    show_module:this.form
                };
                console.log(params);
                if( this.dataVerify(params.show_module) ){
                    this.loading = true;
                    fksavetemplate(params).then(res=>{
                        console.log(res);
                        this.timer = setTimeout(()=>{
							this.loading = false;
						},300);
                        if( res.Ret==200 ){
                            this.getfkshowtemplate();
                            this.$message.success( res.Msg );  
                        }
                        if( res.Ret==100 ){
                            this._sendCode(params,fksavetemplate).then(res=>{
								if( res.Ret===200 ){
									this.getfkshowtemplate();
									this.$message.success( res.Msg );  
								}
                            })
                        }
                    })
                }
            },
            dataVerify(list){
                for( let [index,val] of list.entries() ){
                    let item = this.getchildStatus(val.show_rule);
                    if(item.isHasEmpty){
                        this.$message.error(`${val.module_name}下的第${item.index+1}行值不能为空 `);
                        return false;
                    }else{
                        continue;
                    }
                }
                return true;
            },
            getchildStatus(childItem = [] ){
                for(let [idx,val] of childItem.entries()){
                    if(val.is_enum){
                        continue;
                    }else{
                        if(val.rule_detail_list.param_value){
                            continue;
                        }else{
                            return {
                                isHasEmpty:true,
                                index:idx
                            }
                        }
                    }
                }
                return {
                    isHasEmpty:false,   //是否有空值
                    index:0   //第几行是空值
                }
            },
			getfkshowtemplate(){ 
                this.loading = true;
				fkshowtemplate({}).then((res) => {
                    console.log(res);
                    this.timer = setTimeout(()=>{
						this.loading = false;
					},300);
					if( res.Ret==200 && res.Result.data ){
                        let dataList = res.Result.data.show_module;
                        this.form = dataList || [];
                        this.result_type_list = res.Result.data.result_type_list || [];
                        //展开项
                        let a = [...new Array(res.Result.data.show_module.length)];
                        let b = a.map((item,index)=>{ return index+1});
                        this.activeCollapse = b;
					}
                });
			},
			disData( val,t ){
				if( val ){
					if( val.Value==-1 ){
						return '数据异常';
					}else if( val.Value==-2 ){
						return '数据缺失';
					}else{
						if( t==1 ){
							return parseInt(parseFloat(val.Value)*10000)/100+'%';
						}else if( t==2 ){
							return parseInt(parseFloat(val.Value)*100)/100;
						}else{
							return val.Value;
						}
					}
				}else{
					return '-';
				}
			}
        },
        components:{ListItem}
	}
</script>

<style lang="scss" scoped>
    .title{ background:#409EFF; font:18px/50px "微软雅黑"; color:#fff; text-align:center; }
    .collapse-title{ display:flex; flex:1; height:48px; box-sizing:border-box; overflow:hidden; }
    .collapse-title div{ flex:1; width:50%; padding-left:150px; box-sizing:border-box; }
    .collapse-title-right{ color:#F25E63; }
    .collapse-main{ display:flex; flex-wrap:wrap; flex-direction:row; justify-items:center; margin-bottom:0;
		.main-item{ box-sizing:border-box; padding:20px; min-width:720px; }
	}
    
</style>
