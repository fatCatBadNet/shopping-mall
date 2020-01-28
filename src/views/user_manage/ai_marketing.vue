<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header">
				<el-form :inline="true" :model="form" @submit.native.prevent>
		  			<el-form-item label="呼叫时间">
		  		   		<el-date-picker v-model="form.dateValue" type="daterange"  :picker-options="pickerOptions"  popper-class="repaylist" @focus="_handleFocus"    unlink-panels  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:240px;"></el-date-picker>
		  			</el-form-item>

		  			<el-form-item>
						<el-select v-model="form.Caller" clearable filterable placeholder="请输入主叫号码">
					    	<el-option v-for="(item,index) in CallerArr" :key="index" :label="item" :value="item"> </el-option>
					  	</el-select>
					</el-form-item>

		  			<el-form-item>
		  		   		<el-input type="tel" v-model="form.Callee" placeholder="请输入被叫号码" clearable style="width:150px;"></el-input>
		  			</el-form-item>
		  			<el-form-item>
		  		   		<el-input v-model="form.Id" placeholder="请输入通话ID" clearable style="width:140px;"></el-input>
		  			</el-form-item>
		  	
		  			<el-form-item><el-button type="primary" size="small" @click="search">搜索</el-button></el-form-item>
		  		</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
					<el-table-column prop="Id" label="通话ID"></el-table-column>
					<el-table-column prop="CallTime" label="呼叫时间"></el-table-column>
					<el-table-column  label="响铃时长">
                        <template slot-scope="scope">
                                {{scope.row.RingTime}}秒
                        </template>
                    </el-table-column>
					<el-table-column  label="通话时长">
                        <template slot-scope="scope">
                                {{(scope.row.Duration/60).toFixed(1)}}分钟
                        </template>
                    </el-table-column>
					<el-table-column prop="Caller" label="主叫"></el-table-column>
					<el-table-column prop="Callee" label="被叫"></el-table-column>
					<el-table-column prop="CallUuid" label="录音"  :render-header="renderHeader2">
                        <template slot-scope="scope">
								<el-button v-if="isLinkActive(scope.row.CreateTime)" type="primary" plain size="mini" @click="showDialog(scope.row.CallUuid)">播放录音</el-button>
								<span v-else>录音文件已失效</span>
                        </template>                      
                    </el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
	  	    		        <el-button type="primary" plain size="mini" @click="viewdetails(scope.row)">查看</el-button>
		  	    		</template>
					</el-table-column>
				</el-table>
			</template>
			<!-- 弹窗 -->
			<i-audio  :src="audioSrc" :showAble.sync="showBoolan"> </i-audio>
			<el-col :span="24" class="toolbar">
		  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
		  	</el-col>
		</el-card>
	</div>
</template>

<script>
import http from "api/http.js";
import { collectioncall } from 'api/api.js';
import IAudio from "@/components/IAudio.vue";
export default {
	data(){
		return {
			pickerOptions:{
						onPick(e){
							this.$nextTick(()=>{
								var a=  document.getElementsByClassName('el-icon-arrow-right');
								a[1].removeAttribute('disabled');
								a[1].classList.remove('is-disabled');
							})
						}
					},
			audioSrc:"",
			showBoolan:false,
			page:1,
			total:0,
			pageSize:15,
			ispage:true,
			listLoading:false,
			tableData:[],
			CallerArr:[],
			form:{ 
				Ctype:2,
				Callee:'',
				Id:'',
				Caller:'',
				dateValue:[http.dateFormatter(new Date(new Date().getTime()-14*24*60*60*1000),false),http.dateFormatter(new Date(),false)]
			}
		}
	},
	mounted(){
		this.getcollectioncall();
	},
	methods: {
		showDialog(src){
			this.audioSrc = src;
			this.showBoolan = true;
		},
		isLinkActive(date){  //录音链接是否可用
			let dateTimestamp = new Date(date.replace(/\-/g,'/')).getTime();
			let nowTimestamp = new Date().getTime();
			
			if(dateTimestamp+90*24*60*60*1000>=nowTimestamp){
				return true;
			}else{
				return false;
			}
		},
		renderHeader2(h,{column,$index}){ //table表头自定义
				return h("div",{attrs:{style:"padding:0;"}},[
			        h("span",column.label),
			        h('el-tooltip',{props:{placement:'top'}},
						[
							h('p',{ slot:'content' ,attrs:{style:""}},'录音文件有效期为90天，90天后将会失效，无法播放'),
				    		h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'')
				    	]
					)
			    ]);
			},
		search(){  //搜索
			this.ispage = false;
			this.$nextTick(() => {
				this.page = 1;
				this.getcollectioncall();
				this.ispage = true;
			});
		},
		getcollectioncall(){  
			let params = {
				Page:this.page,
                PageSize:this.pageSize,
                Caller:this.form.Caller,
                Callee:this.form.Callee,
                Ctype:this.form.Ctype,
				Id:this.form.Id?parseInt(this.form.Id):null     
			};
			if( !this.form.dateValue ){
				params.CallStartTime='';
				params.CallEndTime='';
			}else{
				params.CallStartTime=this.form.dateValue[0]+' 00:00:00';
				params.CallEndTime=this.form.dateValue[1]+' 23:59:59';
			}
			this.listLoading = true;
			collectioncall(params).then((res) => {
				console.log(res);
				if( res.Ret!=200 ){
					return false;
				}
				this.total=res.UserSum;
				this.CallerArr=res.Callers || [];
				if(res.List == null){
					this.tableData = [];
				}else{
					this.tableData = res.List;
				}
				this.listLoading = false;
			});
		},
		handleCurrentChange(current){  //分页页码跳转
			this.page = current;
			this.getcollectioncall();
		},
		handleSizeChange(val){    //分页页码改变
	        this.pageSize=val;
	        this.getcollectioncall();
	    },
        viewdetails(row){  //查看详情
           console.log(row);
			let {href} = this.$router.resolve({path:`/authuserdtl/${row.Uid}`});
			window.open(href,'_blank');
	   	}
		
	},
	components: {
		IAudio
	}
}	
</script>

<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
</style>