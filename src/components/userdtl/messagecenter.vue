<template>
	<div>
		<template>	 		
			 <el-tabs v-model="tabVal" @tab-click="handleClick">
				<el-tab-pane label="借贷多头A" name="first" header-row-class-name="ggg">
					<el-table :data="tableDataA" v-loading="listLoading" :show-header="false" element-loading-text="数据加载中..." border>
						<el-table-column  label=""  min-width="350">
							 <template slot-scope="scope">
								<span style="margin-left: 10px">{{ scope.row[0].title }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="value" label=""></el-table-column>
						<el-table-column label="" min-width="350">
							 <template slot-scope="scope">
								<span style="margin-left: 10px">{{ scope.row[1].title }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="value" label=""></el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="借贷多头B" name="second">
					<!-- <el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
						<el-table-column prop="CreateTime" label="贷款总机构数"></el-table-column>
						<el-table-column prop="Title" label="xxxx"></el-table-column>
						<el-table-column prop="Content" label="当天贷款申请机构数	" min-width="350"></el-table-column>
						<el-table-column prop="IsRead" label="" :formatter="isRead"></el-table-column>
					</el-table> -->
					<el-tabs v-model="ucrVal"> 
						<el-tab-pane label="用户特徵" name="user_features">
							<el-table :data="user_features" v-loading="kfkfLoading" element-loading-text="数据加载中..." border>
								<el-table-column prop="user_feature_type" label="特徵结果"></el-table-column>
								<el-table-column prop="last_modified_date" label="最后命中时间" min-width="350"></el-table-column>
							</el-table>
						</el-tab-pane>
						<el-tab-pane label="多头行为分数" name="score_detail">
							<el-table :data="score_detail" border>
								<el-table-column prop="score" label="多头模型分（分值越大風險越大）"></el-table-column>
								<el-table-column prop="risk_evaluation" label="风险等级" min-width="350"></el-table-column>
							</el-table>
						</el-tab-pane>
						<el-tab-pane label="用户申请行为（恶意借款）建议" name="suggest">
							<el-table :data="suggest" border>
								<el-table-column prop="request_count_too_many" label="总申请借款次数过多"></el-table-column>
								<el-table-column prop="request_days_too_many" label="总申请借款天数过多"></el-table-column>
								<el-table-column prop="request_count_7d_too_many" label="近7天内申请借款次数过多"></el-table-column>
								<el-table-column prop="request_platform_count_on_same_day_too_many" label="单日申请借款平台数过多"></el-table-column>
								<el-table-column prop="request_count_on_same_day_too_many" label="单日申请借款次数过多"></el-table-column>
								<el-table-column prop="loan_platform_count_too_many" label="总申请借款平台数过多"></el-table-column>
							</el-table>
						</el-tab-pane>
						<el-tab-pane label="多头详情" name="detailList">
							<el-table :data="detailList" border>
								<el-table-column prop="actual_loan_platform_count" label="实际借款数"></el-table-column>
								<el-table-column prop="repayment_times_count" label="还款次数"></el-table-column>
								<el-table-column prop="loan_detail_rule" label="多头行为建议"></el-table-column>
								<el-table-column prop="loan_platform_count" label="申请借款平台数"></el-table-column>
								<el-table-column prop="repayment_platform_count" label="还款平台数"></el-table-column>
								<el-table-column prop="today_request_loan_fre_more" label="今日申请借款次数过多"></el-table-column>
								<el-table-column prop="today_request_loan_p_more" label="今日申请借款平台数过多"></el-table-column>
								<el-table-column prop="today_request_loan_divice_more" label="今日申请设备过多"></el-table-column>
								<el-table-column prop="actual_loan_platform_count_1m" label="近1月实际借款平台数"></el-table-column>
								<el-table-column prop="repayment_platform_count_1m" label="近1月还款平台数"></el-table-column>
								<el-table-column prop="actual_loan_platform_count_3m" label="近3月实际借款平台数"></el-table-column>
								<el-table-column prop="repayment_platform_count_3m" label="近3月还款平台数"></el-table-column>
								<el-table-column prop="actual_loan_platform_count_6m" label="近6月实际借款平台数"></el-table-column>
								<el-table-column prop="repayment_platform_count_6m" label="近6月还款平台数"></el-table-column>
								<el-table-column prop="loan_platform_count_1m" label="近1月申请借款平台数"></el-table-column>
								<el-table-column prop="loan_platform_count_7d" label="近7天申请借款平台数"></el-table-column>
								<el-table-column prop="loan_platform_count_3m" label="近3月申请借款平台数"></el-table-column>
								<el-table-column prop="loan_platform_count_15d" label="近15天申请借款平台数"></el-table-column>
								<el-table-column prop="loan_platform_count_6m" label="近6月申请借款平台数"></el-table-column>
							</el-table>		
						</el-tab-pane>
						<el-tab-pane label="用户申请行为（恶意借款）分析" name="action">
							<el-table :data="action" border>
								<el-table-column prop="loan_request_app_sum" label="总计申请借款的app"></el-table-column>
								<el-table-column prop="loan_request_app_sum_7day" label="近7天内申请借款的APP数"></el-table-column>
								<el-table-column prop="loan_request_app_sum_15day" label="近15天内申请借款的APP数"></el-table-column>
								<el-table-column prop="loan_request_app_sum_1m" label="近1月内申请借款的APP数"></el-table-column>
								<el-table-column prop="loan_request_app_sum_3m" label="近3月内申请借款的APP数"></el-table-column>
								<el-table-column prop="loan_request_app_sum_6m" label="近6月内申请借款的APP数"></el-table-column>
								<el-table-column prop="loan_request_app_day_max" label="单日申请借款的APP数"></el-table-column>
								<el-table-column prop="loan_request_app_7day_max" label="近7天单日申请借款的APP数"></el-table-column>
								<el-table-column prop="loan_request_app_15day_max" label="近15天单日申请借款的APP数"></el-table-column>
								<el-table-column prop="loan_request_app_1m_max" label="近1月单日申请借款的APP数"></el-table-column>
							</el-table>
						</el-tab-pane>
						<el-tab-pane label="关系图谱" name="real">
							<el-table :data="real" border>
								<el-table-column prop="partner_mark_count" label="商户标记数"></el-table-column>
								<el-table-column prop="living_attack_count" label="活体攻击行为"></el-table-column>
								<el-table-column prop="court_dishonest_count" label="法院失信"></el-table-column>
								<el-table-column prop="online_dishonest_count" label="网贷失信"></el-table-column>
							</el-table>
						</el-tab-pane>
						<el-tab-pane label="设备指纹" name="finger">
							<el-table :data="finger" border>
								<el-table-column prop="cheats_device" label="是否安装作弊软件"></el-table-column>
								<el-table-column prop="rootis_rooted" label="是否"></el-table-column>
								<el-table-column prop="fraud_device" label="可疑设备"></el-table-column>
								<el-table-column prop="is_using_proxy_port" label="是否使用代理"></el-table-column>
								<el-table-column prop="network_type" label="网络类型"></el-table-column>
								<el-table-column prop="app_instalment_count" label="借贷app安装数量"></el-table-column>
								<el-table-column prop="living_attack" label="有无活体攻击行为"></el-table-column>
								<el-table-column prop="device_loan_request_fre_day_max_more" label="设备单日申请借款总次数过多"></el-table-column>
								<el-table-column prop="loan_app_too_many" label="安装的借贷类APP数过多"></el-table-column>
							</el-table>		
						</el-tab-pane>
						<el-tab-pane label="黑客风险" name="hack">
							<el-table :data="hack" border>
								<el-table-column prop="id_no_living_attack_platform_count" label="活体攻击平台数"></el-table-column>
								<el-table-column prop="device_living_attack_count" label="活体攻击设备数"></el-table-column>
								<el-table-column prop="id_no_software_simulation_attack_count" label="软件模拟攻击次数"></el-table-column>
								<el-table-column prop="id_no_living_attack_count" label="活体攻击次数"></el-table-column>
								<el-table-column prop="id_no_mask_attack_count" label="面具攻击次数"></el-table-column>
								<el-table-column prop="id_no_video_attack_count" label="视频攻击次数"></el-table-column>
								<el-table-column prop="use_bad_ip" label="是否命中不良ip"></el-table-column>
								<el-table-column prop="use_proxy_ip" label="是否使用代理ip"></el-table-column>
								<el-table-column prop="use_bad_base_station" label="是否命中不良基站"></el-table-column>
								<el-table-column prop="use_bad_wifimac" label="是否命中不良"></el-table-column>
							</el-table>			
						</el-tab-pane>
					</el-tabs>
				</el-tab-pane>
			</el-tabs>

			

			
		</template>
		<!-- <el-col :span="24" class="toolbar">
	  		<el-pagination v-if="ispage" layout="total,sizes,prev,pager,next,jumper" background @current-change="handleCurrentChange" :page-sizes="[15,30,50,100]" :page-size="pageSize" @size-change="handleSizeChange" :total="total" style="float:right;"></el-pagination>
	  	</el-col> -->
	</div>
</template>

<script>
	import {getFKFKCreditReport} from '@/api/api.js';
	import dataA from './data/dataA'
	export default {
		props:{
      		uid:{
        		type:String,
        		default:{type:''}
      		}
    	},
		data() {
			return {
				page: 1,
				total: 0,
				pageSize: 15,
				pageCount: 1,
				ispage: true,
				listLoading: false,
				kfkfLoading: false,
				tableData: [],
				tabVal:'first',
				dataA: dataA.data,
				tableDataA: [],
				ucrVal:'user_features',
				user_features:[],
				score_detail:[],
				suggest:[],
				detailList:[],
				action:[],
				hack:[],
				finger:[],
				real:[],
			}
		},
		mounted() {
			console.log('--')
			// this.getmessagecenter();
			console.log(this.dataA)
			this.getList()
		},
		methods: {
			handleClick() {
			},
			getmessagecenter(){ //获取消息列表
				let params = {Uid:parseInt(this.uid),PageSize:this.pageSize,Page:this.page};
				this.listLoading = true;
				messagecenter(params).then((res) => {
					if( res.Ret!=200 ){
						return false;
					}
					this.total=res.Result.UserSum;
					if( res.Result.List == null ){
						this.tableData = [];
					}else{
						this.tableData = res.Result.List;
						this.pageCount = Math.ceil(this.total/this.pageSize);
					}
					this.listLoading = false;
				});
			},
			handleCurrentChange(current){  //分页页码跳转
				this.page = current;
				this.getmessagecenter();
			},
			handleSizeChange(val){    //分页页码改变
		        this.pageSize=val;
		        this.getmessagecenter();
		   	},
		   	isRead(row){
		   		return row.IsRead==1?"已读":"未读";
			},
			getList() {
				// this.handleData()
				const params = {　Uid:parseInt(this.uid)　}
				this.kfkfLoading = true;
				getFKFKCreditReport(params).then((res)=>{
					console.log('getFKFKCreditReport',res)
					const tableDataA = this.tableDataA;
					let itemArr = [];
					const TCRData = res.TCReport.Report;
					//收集返回的数据型号
					for(const key in TCRData){
						this.dataA.forEach((item,index) => {
							if(item.key === key){
								const obj = { title: item.title, value: TCRData[key]}
								itemArr.push(obj)
							}									
						})
					}
					//切割两两一组
					for(var i=0;i<itemArr.length;i+=2){ 
						tableDataA.push(itemArr.slice(i,i+2));
					}

					// B处理
					// console.log("tableDataA",tableDataA);
					//   suggest detailList  action real finger hack
					if(!res.UDReport.Report){
						this.kfkfLoading = false;
						return;
					}
					const UDRData = res.UDReport.Report.body;
					const info = UDRData.request_info;
					
					this.user_features = UDRData.user_features ? UDRData.user_features : [];
					this.score_detail = UDRData.score_detail ? [UDRData.score_detail] : [];
					this.suggest = info ? [info.request_detail_rule] : [];
					this.detailList = UDRData.loan_detail ? [UDRData.loan_detail] : [];
					this.action = info ? [info.request_app] : []; 
					this.real = UDRData.graph_detail ? [UDRData.graph_detail.link_user_detail] : [];
					this.finger = UDRData.devices_list ? [UDRData.devices_list.device_detail] : [];
					this.hack = info ? [info.request_living_attack] : [];

					this.kfkfLoading = false;
				})
			},
			handleData() { 
				const tableDataA = this.tableDataA
				let itemArr = []
				this.dataA.forEach((item,index) => {										
					const obj = { title: item.title, value: ''}
					itemArr.push(obj)
					if (index % 2){
						tableDataA.push(itemArr)	
						itemArr = []											
					}
				})
			}

		}
	}
</script>

<style scoped lang="scss">
	.block-panel{width: 100%;height: 40px;;margin-bottom: 15px;border-bottom: 1px solid #ebeef5}
	.block-panel ul li{float: left;width: 100px;line-height: 40px;background: #f9f9f9;text-align: center;border-radius: 6px}
	.block-panel ul li:hover{color: #2db7f5;cursor: pointer;}
	.active{border: 1px solid #ebeef5;border-bottom: 1px solid #fff;background: #fff!important;}
</style>