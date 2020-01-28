<template>
	<div>
		<template>
			<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
				<el-table-column prop="Phone" label="通话号码"></el-table-column>
				<el-table-column label="通讯录比对名称">
					<template slot-scope="scope">{{scope.row.DistinctList?scope.row.DistinctList[0].ContactName:'-'}}</template>
				</el-table-column>
				<el-table-column prop="Phone_location" label="归属地"></el-table-column>
				<!--<el-table-column prop="Contact_3m" label="联系次数(近3月)"></el-table-column>-->
				<el-table-column prop="Talk_cnt" label="总联系次数"></el-table-column>
				<el-table-column prop="Call_cnt" label="主叫次数"></el-table-column>
				<el-table-column prop="Called_cnt" label="被叫次数"></el-table-column>
				<el-table-column label="联系时长(分)">
					<template slot-scope="scope">{{parseInt(parseFloat(scope.row.Talk_seconds)/60*100)/100}}</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<!--<span class="editwordSty" @click="comparison(scope.row.Phone)">数据比对</span>-->
  	    		        <a :href="'https://www.baidu.com/s?ie=UTF-8&amp;wd='+scope.row.Phone" target="_blank" class="editwordSty">百度搜索</a>
	  	    		</template>
				</el-table-column>
			</el-table>
		</template>
		<!-- 数据比对弹框 -->
		<el-dialog title="数据比对" :visible.sync="showDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="600px" top="35vh">
			<table border="0" cellspacing="0" cellpadding="0" style="width:100%; text-align:center; font:14px/50px '微软雅黑'; cursor:pointer;">
				<tr style="background:#eaeaea;">
					<th>通讯录对比</th>
				</tr>
				<tr style="color:red;">
					<td>
						<span v-if="JSON.stringify(TelephoneList)!='{}'">{{TelephoneList.ContactName}}&nbsp;{{TelephoneList.ContactPhoneNumber}}</span>
						<span v-else>无</span>
					</td>
				</tr>
			</table>
		</el-dialog>
	</div>
</template>

<script>
	import {operatordata,datacomparison} from 'api/api.js';
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
				tableData: [],
				showDialog:false,
				bankFrom:{},
				TelephoneList:{}  //通讯录比对结果
			}
		},
		mounted() {
			this.getoperatordata();
		},
		methods: {
			getoperatordata(){ //获取手机运营商信息列表
				let params = {Uid:parseInt(this.uid)};
				this.listLoading = true;
				operatordata(params).then((res) => {
					console.log(res);
					if( res.Ret!=200 ){
						return false;
					}
					if( res.List == null ){
						this.tableData = [];
					}else{
						this.tableData = res.List;
					}
					this.listLoading = false;
				});
			},
			comparison(phone){
				let params={IsOperator:false,Mobile:phone,Uid:parseInt(this.uid)};
				datacomparison(params).then((res) => {
					if( res.Ret==200 ){
						if( res.TelephoneList!=null ){
							this.TelephoneList=res.TelephoneList[0];
						}else{
							this.TelephoneList={};
						}
						this.showDialog = true;
					}
				});
			}

		}
	}
</script>

<style scoped lang="scss"></style>