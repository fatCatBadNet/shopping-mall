<template>
    <div>
		<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
			<el-table-column prop="Name" label="收件人" width="70"></el-table-column>
			<el-table-column prop="Telephone" label="收件人电话" width="110"></el-table-column>
			<el-table-column prop="Address" label="收货地址" min-width="240"></el-table-column>
			<el-table-column prop="Cnt" label="使用次数" width="80"></el-table-column>
			<el-table-column prop="Amount" label="送货总金额" width="95"></el-table-column>
			<el-table-column prop="LastDate" label="最后使用时间" width="105"></el-table-column>
		</el-table>
    </div>    
</template>

<script>
	import {tjtaobaoreport} from 'api/api.js';
	export default {
		props:{
      		uid:{
        		type:String,
        		default:{type:''}
      		}
    	},
		data() {
			return {
				listLoading:false,
				tableData:[]
			}
		},
		mounted() {
			this.getdtl();
		},
		methods: {
			getdtl(){ 
				this.listLoading = true;
				tjtaobaoreport({Uid:parseInt(this.uid)}).then((res) => {
					this.isshow=false;
					if( res.Ret==200 ){
						if( !res.IsShow ){
							this.$emit('showtaobao');
						}
						this.tableData=res.Data.AddrsInfo.MostUsedAddrs || [];
						this.listLoading = false;
						// console.log(this.tableData,"++++++++++++++++++++++++++++++++++++");
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
    
</style>