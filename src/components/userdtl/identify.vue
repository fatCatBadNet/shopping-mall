<template>
	<div style="overflow:auto;">
		<div class="title">实名认证</div>
		<el-row>
			<el-col :span="10" style="width:520px; margin-right:10px;" id="disImg" v-if="IdentifyInfoshow">
				<img :src="IdentifyInfo.FrontCard" style="width:300px; height:200px;" />
				<img :src="IdentifyInfo.PhotoGet" style="width:150px; height:200px;" />
				<img :src="IdentifyInfo.BackCard" style="width:300px; height:200px;" />
				<img :src="IdentifyInfo.PhotoLiving" style="width:150px; height:200px;" />
			</el-col>
			<el-col :span="13" :offset="1" id="disTielt" v-if="PersonInfoshow">
				<p></p>
				<p>
					<label>身份证地址：</label>
					<span>{{IdentifyInfo.Address}}</span>
				</p>
				<p>
					<label>借款申请平台数：</label>
					<span>{{PersonInfo.LoanPlatformCount}}</span>
				</p>
				<p>
					<label>实际借款平台数：</label>
					<span>{{PersonInfo.ActualLoanPlatformCount}}</span>
				</p>
				<p>
					<label>还款平台数：</label>
					<span>{{PersonInfo.RepaymentPlatformCount}}</span>
				</p>
				<p>
					<label>还款笔数：</label>
					<span>{{PersonInfo.RepaymentTimesCount}}</span>
				</p>
				<p>
					<label>最近一次借款：</label>
					<span>{{PersonInfo.LoanLastDate}}</span>
				</p>
				<p>
					<label>最近一次还款：</label>
					<span>{{PersonInfo.RepaymentLastDate}}</span>
				</p>
				<p>
					<label>近1月/3月/6月借款平台数：</label>
					<span v-if="ishaveVal">{{PersonInfo.ActualLoanPlatformCount1m}}/{{PersonInfo.ActualLoanPlatformCount3m}}/{{PersonInfo.ActualLoanPlatformCount6m}}</span>
				</p>
				<p>
					<label>近1月/3月/6月申请借款平台数：</label>
					<span v-if="ishaveVal">{{PersonInfo.LoanPlatformCount1m}}/{{PersonInfo.LoanPlatformCount3m}}/{{PersonInfo.LoanPlatformCount6m}}</span>
				</p>
				<p>
					<label>近1月/3月/6月还款平台数：</label>
					<span v-if="ishaveVal">{{PersonInfo.RepaymentPlatformCount1m}}/{{PersonInfo.RepaymentPlatformCount3m}}/{{PersonInfo.RepaymentPlatformCount6m}}</span>
				</p>
			</el-col>
		</el-row>
		<div style="box-sizing:border-box; padding:20px 0px 0px; color:#101010;">
			<el-col :span="24" style="margin-bottom:20px;">
				<span style="color:#808080; padding:0 10px;">命中黑名单种类：</span>
				<span>{{ Hits?Hits.length>1?Hits.join('/'):Hits.join(''):'未命中'}}</span>
			</el-col>
			<el-table border v-show="isShow(tableData[0])" style="margin-bottom:40px;" :data="tableData[0]">
				<el-table-column label="现金贷类型" prop="Type"></el-table-column>
				<el-table-column label="近一个月" prop="One"></el-table-column>
				<el-table-column label="近三个月" prop="Two"></el-table-column>
				<el-table-column label="近六个月" prop="Three"></el-table-column>
			</el-table>
			<el-table border v-show="isShow(tableData[1])" style="margin-bottom:40px;" :data="tableData[1]">
				<el-table-column label="消费贷类型" prop="Type"></el-table-column>
				<el-table-column label="近一个月" prop="One"></el-table-column>
				<el-table-column label="近三个月" prop="Two"></el-table-column>
				<el-table-column label="近六个月" prop="Three"></el-table-column>
			</el-table>
			<el-table border v-show="isShow(tableData[2])" style="margin-bottom:40px;" :data="tableData[2]">
				<el-table-column label="小额短期类型" prop="Type"></el-table-column>
				<el-table-column label="近一个月" prop="One"></el-table-column>
				<el-table-column label="近三个月" prop="Two"></el-table-column>
				<el-table-column label="近六个月" prop="Three"></el-table-column>
			</el-table>
			<el-table border v-show="isShow(tableData[3])" style="margin-bottom:40px;" :data="tableData[3]">
				<el-table-column label="信用卡代偿分期类型" prop="Type"></el-table-column>
				<el-table-column label="近一个月" prop="One"></el-table-column>
				<el-table-column label="近三个月" prop="Two"></el-table-column>
				<el-table-column label="近六个月" prop="Three"></el-table-column>
			</el-table>
			<el-table border v-show="isShow(tableData[4])" style="margin-bottom:40px;" :data="tableData[4]">
				<el-table-column label="流行平台贷款类型" prop="Type"></el-table-column>
				<el-table-column label="近一个月" prop="One"></el-table-column>
				<el-table-column label="近三个月" prop="Two"></el-table-column>
				<el-table-column label="近六个月" prop="Three"></el-table-column>
			</el-table>
			<el-table border v-show="isShow(tableData[5])" style="margin-bottom:40px;" :data="tableData[5]">
				<el-table-column label="助学贷款类型" prop="Type"></el-table-column>
				<el-table-column label="近一个月" prop="One"></el-table-column>
				<el-table-column label="近三个月" prop="Two"></el-table-column>
				<el-table-column label="近六个月" prop="Three"></el-table-column>
			</el-table>
			<el-table border v-show="isShow(tableData[6])" style="margin-bottom:40px;" :data="tableData[6]">
				<el-table-column label="非银行其他类型" prop="Type"></el-table-column>
				<el-table-column label="近一个月" prop="One"></el-table-column>
				<el-table-column label="近三个月" prop="Two"></el-table-column>
				<el-table-column label="近六个月" prop="Three"></el-table-column>
			</el-table>
			<el-table border v-show="isShow(tableData[7])" style="margin-bottom:40px;" :data="tableData[7]">
				<el-table-column label="网贷总计类型" prop="Type"></el-table-column>
				<el-table-column label="近一个月" prop="One"></el-table-column>
				<el-table-column label="近三个月" prop="Two"></el-table-column>
				<el-table-column label="近六个月" prop="Three"></el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	import {identify,institutiondata} from 'api/api.js';
	import { format } from 'url';
	export default {
		props:{
      		uid:{
        		type:String,
        		default:{type:''}
      		}
    	},
		data() {
			return {
				userLogo:require('../../assets/img/identifyLogo.png'),
				ishaveVal:false,
				IdentifyInfoshow:false,
				IdentifyInfo:{},
				PersonInfoshow:false,
				PersonInfo:{},
				tableData:[],
				Hits:''
			}
		},
		mounted() {
			this.getloginrecords();
			this.getinstitutiondata();
		},
		methods: {
			isShow(arr){
				if( arr ){
					for (let val of arr){
						if((val.One=='0' || val.One=='无') && (val.Two=='0' ||val.Two=='无') && (val.Three=='0' ||val.Three=='无')){
							continue;
						}else{
							return true;
						}
					}
					return false;
				}
			},
			getinstitutiondata(){
				institutiondata({Uid:parseInt(this.uid)}).then(res=>{
					if(res.Ret == 200){
						this.tableData  = this.tableDataFormat(res.Result.Data);
						this.Hits = res.Result.Hits==null?'':res.Result.Hits;
					}
				})
			},
			setType(i){
				if(i%3 ==0){
					return '注册平台数';					
				}else if(i%3 ==1){
					return '逾期平台数';
				}else{
					return '逾期最长时间';
				}
			},
			tableDataFormat(arr){
				let newArr = [];
				let formatData = [];
				if (arr) {
					for(let i=0;i<arr.length;i++){
						let n = parseInt(i/3);
						arr[i].unshift(this.setType(i));
						if(newArr[n]==undefined){
							newArr[n]=[];
						}
						newArr[n].push(arr[i])
					}
					for (let i =0 ;i<newArr.length;i++){
						formatData.push(this.getChildData(newArr[i]));
					}
				}
				return formatData;
			},
			getChildData(arr){   //[[],[],[]]
				let dataArr = [...arr];
				let newChildArr = [];
				for(let i = 0; i<dataArr.length;i++){
					let Obj = {};
					Obj.Type = dataArr[i][0];
					Obj.One = dataArr[i][1];
					Obj.Two = dataArr[i][2];
					Obj.Three = dataArr[i][3];
					newChildArr.push(Obj);
				}
				return newChildArr;
			},
			getloginrecords(){ //获取登录记录列表
				let params = {Uid:parseInt(this.uid)};
				this.listLoading = true;
				identify(params).then((res) => {
					if( res.Ret!=200 ){
						return false;
					}
					if( res.IdentifyInfo==null ){
						this.IdentifyInfoshow=false;
						this.IdentifyInfo={
							FrontCard:this.userLogo,
							BackCard:this.userLogo,
							PhotoGet:this.userLogo,
							PhotoLiving:this.userLogo
						}
					}else{
						this.IdentifyInfo=res.IdentifyInfo;
						this.IdentifyInfoshow=true;
					}
					if( res.PersonInfo==null ){
						this.PersonInfoshow=false;
						this.PersonInfo={
							LoanPlatformCount:'',
							ActualLoanPlatformCount:'',
							RepaymentPlatformCount:'',
							RepaymentTimesCount:'',
							LoanLastDate:'',
							RepaymentLastDate:'',
							ActualLoanPlatformCount1m:'',
							ActualLoanPlatformCount3m:'',
							ActualLoanPlatformCount6m:'',
							LoanPlatformCount1m:'',
							LoanPlatformCount3m:'',
							LoanPlatformCount6m:'',
							RepaymentPlatformCount1m:'',
							RepaymentPlatformCount3m:'',
							RepaymentPlatformCount6m:''
						}
						this.ishaveVal=false;
					}else{
						this.PersonInfo=res.PersonInfo;
						this.PersonInfoshow=true;
						this.ishaveVal=true;
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	#disImg>img{ margin:10px; border:1px solid #eaeaea; }
	#disTielt>p{ margin-bottom:20px; font:14px "微软雅黑"; color:#000; }
	#disTielt>p label{ color:#999; margin-right:10px; }
	.title{ background:#409EFF; font:18px/50px "楷体"; color:#fff; text-align:center; margin:20px auto; }
</style>