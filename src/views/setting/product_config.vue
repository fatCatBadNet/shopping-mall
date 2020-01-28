<template>
	<div>
		<el-tabs v-model="activeName">
			<el-tab-pane label="产品配置" name="产品配置">
				<el-card class="box-card">
					<div slot="header" class="header">
						<el-form :inline="true" :model="form" @submit.native.prevent>
							<el-form-item label="状态">
								<el-select v-model="form.IsUse" clearable placeholder="请选择">
								    <el-option label="启用" value="1"></el-option>
								    <el-option label="禁用" value="0"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" size="small" @click="search">搜索</el-button>
							</el-form-item>
							<el-button type="primary" size="small" @click="showDialog_add=true" style="float:right;">添加</el-button>
						</el-form>
					</div>
					<template>
						<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border>
							<el-table-column label="期限" min-width="40">
								<template slot-scope="scope">{{scope.row.LoanTermCount}}天</template>
							</el-table-column>
							<el-table-column label="计息方式" :render-header="renderHeader1" min-width="90">
								<template slot-scope="scope"><span>{{scope.row.TaxMethod==1?"算头不算尾":scope.row.TaxMethod==2?"算头算尾":"不算头算尾"}}</span></template>
							</el-table-column>
							<el-table-column prop="RepayType" label="还款方式" :formatter="repayType"></el-table-column>
							<el-table-column label="日利率（%）">
								<template slot-scope="scope">{{scope.row.LoanTaxFee}}%</template>
							</el-table-column>
							<el-table-column label="折合年化（%）" min-width="110">
								<template slot-scope="scope">
									<span>{{scope.row.LoanTaxFee*365}}%</span>
									<label v-if="scope.row.LoanTaxFee*365>36" style="float:right; color:red; margin-left:5px;">超过年化36%</label>
				  	    		</template>
							</el-table-column>
							<el-table-column label="服务费" :render-header="renderHeader2">
								<template slot-scope="scope">
									<span v-if="scope.row.ReportSwitch==1">{{scope.row.ReportMoney}}元</span>
									<span v-else>{{scope.row.LoanServiceFee}}%</span>
								</template>
							</el-table-column>
							
							<el-table-column label="续期服务费">
								<template slot-scope="scope">
									<span v-if="scope.row.RenewalReportSwitch==1">{{scope.row.RenewalReportMoney}}元</span>
									<span v-else>{{scope.row.RenewalReportRate}}%</span>
								</template>
							</el-table-column>
							<el-table-column label="续期手续费">
								<template slot-scope="scope">
									<span v-if="scope.row.RenewalFeeSwitch==1">{{scope.row.RenewalFee}}元</span>
									<span v-else>{{scope.row.RenewalFeeRate}}%</span>
								</template>
							</el-table-column>
							
							<el-table-column prop="LoanOverdueFee" label="滞纳金率" :formatter="LoanOverdueFee" :render-header="renderHeader3" min-width="90">
								<template slot-scope="scope">{{scope.row.LoanOverdueFee}}% / 天</template>
							</el-table-column>
							<el-table-column prop="LoanOverdueBreachOfFee" label="违约金" :render-header="renderHeader4">
								<template slot-scope="scope">{{scope.row.LoanOverdueBreachOfFee}}元</template>
							</el-table-column>
							<el-table-column label="状态" min-width="110">
								<template slot-scope="scope">
			  	    		        <el-switch v-model="scope.row.IsUse" active-text="启用" :active-value="1" inactive-text="禁用" :inactive-value="0" @change="freezeDtl(scope.row.Id,scope.row.IsUse)"></el-switch>
				  	    		</template>
							</el-table-column>
							<el-table-column label="操作">
								<template slot-scope="scope">
									<el-button type="primary" plain size="mini" @click="goEdit(scope.row.Id)">修改</el-button>
								</template>
							</el-table-column>
						</el-table>
					</template>
				</el-card>
				<!-- 添加弹框 -->
				<el-dialog title="添加" :visible.sync="showDialog_add" :close-on-click-modal="true" :center="true" @open="resetForm('addForm')" v-dialogDrag custom-class="dialogclass" width="850px">
					<el-form :model="addForm" :rules="rules" label-width="120px" ref="addForm">
						<el-form-item label="期限" prop="LoanTermCount">
							<el-input v-model="addForm.LoanTermCount" placeholder="请输入" auto-complete="off" style="width:50%;"></el-input>
							<!--<el-select v-model="" clearable placeholder="请选择">
							    <el-option label="天" value="天"></el-option>
							</el-select>-->
						</el-form-item>
						<el-form-item label="计息方式" prop="TaxMethod">
							<el-select v-model.number="addForm.TaxMethod" clearable placeholder="请选择">
							    <el-option label="算头不算尾" :value="1"></el-option>
							    <el-option label="算头算尾" :value="2"></el-option>
							    <el-option label="不算头算尾" :value="3"></el-option>
							</el-select>
							<el-popover placement="right" title="" width="360" trigger="hover">
								<p>&nbsp;算头，放款当日开始计息</p>
								<p>&nbsp;算尾，计息日最后一天为还款日</p>
								<br />
								<p>&nbsp;示例：借款周期7天，1月1日借款，则</p>
								<p>&nbsp;-算头不算尾 ，1月1日开始计息，最晚还款日为1月8日；</p>
								<p>&nbsp;-算头算尾，1月1日开始计息，最晚还款日为1月7日；</p>
								<p>&nbsp;-不算头算尾，1月2日开始计息，最晚还款日为1月8日。</p>
								<el-button icon="el-icon-info" circle slot="reference" style="border:none;"></el-button>
		  					</el-popover>
						</el-form-item>
						<el-form-item label="还款方式" prop="RepayType">
							<el-select v-model.number="addForm.RepayType" clearable placeholder="请选择">
							    <el-option label="等本等息" :value="0"></el-option>
							    <el-option label="先息后本" :value="1"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="日利率(%)" prop="LoanTaxFee">
							<el-input type="number" v-model.number="addForm.LoanTaxFee" min='0' placeholder="请输入折合年化不超过36%的日利率" auto-complete="off" style="width:50%;"></el-input>
						</el-form-item>
						<el-form-item label="服务费" >
							<el-select v-model.number="addForm.ReportSwitch" placeholder="请选择" @change="handleChange($event,'addForm','ReportMoney','LoanServiceFee')" style="width:160px;">
							    <el-option label="固定金额" :value="1"></el-option>
							    <el-option label="按比例收取" :value="2"></el-option>
							</el-select>
							<el-input v-if="addForm.ReportSwitch==1" type="number" v-model.number="addForm.ReportMoney" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
							<el-input v-else type="number" v-model.number="addForm.LoanServiceFee" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
							<span class="spansty" style="display:inline-block; width:310px;vertical-align: middle;">如按比例收取，则服务费计算公式：借款金额 * 服务费率<br/>如按固定金额，则服务费为填写的金额。</span>
						</el-form-item>
						<el-form-item label="滞纳金率(%)" prop="LoanOverdueFee">
							<el-input type="number" v-model.number="addForm.LoanOverdueFee" min='0' placeholder="请输入" auto-complete="off" style="width:50%;"></el-input>
							<span class="spansty" style="display:inline-block; width:310px;vertical-align: middle;">逾期后按天收取，计算公式：借款金额 * 滞纳金率 * 天数,可在【设置-商户设置】页 配置滞纳金上限。</span>
						</el-form-item>
						<el-form-item label="违约金(元)" prop="LoanOverdueBreachOfFee">
							<el-input type="number" v-model.number="addForm.LoanOverdueBreachOfFee" min='0' placeholder="请输入" auto-complete="off" style="width:50%;"></el-input>
							<span class="spansty">逾期后按次收取，仅收一笔。</span>
						</el-form-item>
						
						<el-form-item label="续期服务费" >
							<el-select v-model.number="addForm.RenewalReportSwitch" placeholder="请选择" @change="handleChange($event,'addForm','RenewalReportMoney','RenewalReportRate')" style="width:160px;">
							    <el-option label="固定金额" :value="1"></el-option>
							    <el-option label="按比例收取" :value="2"></el-option>
							</el-select>
							<el-input v-if="addForm.RenewalReportSwitch==1" type="number" v-model.number="addForm.RenewalReportMoney" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
							<el-input v-else type="number" v-model.number="addForm.RenewalReportRate" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
						</el-form-item>
						<el-form-item label="续期手续费" >
							<el-select v-model.number="addForm.RenewalFeeSwitch" placeholder="请选择" @change="handleChange($event,'addForm','RenewalFee','RenewalFeeRate')" style="width:160px;">
							    <el-option label="固定金额" :value="1"></el-option>
							    <el-option label="按比例收取" :value="2"></el-option>
							</el-select>
							<el-input v-if="addForm.RenewalFeeSwitch==1" type="number" v-model.number="addForm.RenewalFee" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
							<el-input v-else type="number" v-model.number="addForm.RenewalFeeRate" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
						</el-form-item>
						
						<el-form-item label="状态" prop="IsUse">
							<el-switch v-model="addForm.IsUse" active-text="启用" :active-value="1" inactive-text="禁用" :inactive-value="0"></el-switch>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click.native="addSubmit">提交</el-button>
						<el-button @click.native="showDialog_add=false">取消</el-button>
					</div>
				</el-dialog>
				<!-- 修改弹框 -->
				<el-dialog title="修改" :visible.sync="showDialog_edit" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="850px">
					<el-form :model="editForm" :rules="rules" label-width="120px" ref="editForm">
						<el-form-item label="期限" prop="LoanTermCount">
							<el-input v-model="editForm.LoanTermCount" placeholder="请输入" auto-complete="off" style="width:50%;"></el-input>
						</el-form-item>
						<el-form-item label="计息方式" prop="TaxMethod">
							<el-select v-model.number="editForm.TaxMethod" clearable placeholder="请选择">
							    <el-option label="算头不算尾" :value="1"></el-option>
							    <el-option label="算头算尾" :value="2"></el-option>
							    <el-option label="不算头算尾" :value="3"></el-option>
							</el-select>
							<el-popover placement="right" title="" width="360" trigger="hover">
								<p>&nbsp;算头，放款当日开始计息</p>
								<p>&nbsp;算尾，计息日最后一天为还款日</p>
								<br />
								<p>&nbsp;示例：借款周期7天，1月1日借款，则</p>
								<p>&nbsp;-算头不算尾 ，1月1日开始计息，最晚还款日为1月8日；</p>
								<p>&nbsp;-算头算尾，1月1日开始计息，最晚还款日为1月7日；</p>
								<p>&nbsp;-不算头算尾，1月2日开始计息，最晚还款日为1月8日。</p>
								<el-button icon="el-icon-info" circle slot="reference" style="border:none;"></el-button>
		  					</el-popover>
						</el-form-item>
						<el-form-item label="还款方式" prop="RepayType">
							<el-select v-model.number="editForm.RepayType" clearable placeholder="请选择">
							    <el-option label="等本等息" :value="0"></el-option>
							    <el-option label="先息后本" :value="1"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="日利率(%)" prop="LoanTaxFee">
							<el-input type="number" v-model.number="editForm.LoanTaxFee" min='0' placeholder="请输入折合年化不超过36%的日利率" auto-complete="off" style="width:50%;"></el-input>
						</el-form-item>
						<el-form-item label="服务费" >
							<el-select v-model.number="editForm.ReportSwitch" placeholder="请选择" @change="handleChange($event,'editForm','ReportMoney','LoanServiceFee')" style="width:160px;">
							    <el-option label="固定金额" :value="1"></el-option>
							    <el-option label="按比例收取" :value="2"></el-option>
							</el-select>
							<el-input v-if="editForm.ReportSwitch==1" type="number" v-model.number="editForm.ReportMoney" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
							<el-input v-else type="number" v-model.number="editForm.LoanServiceFee" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
							<span class="spansty" style="display:inline-block; width:310px;vertical-align: middle;">如按比例收取，则服务费计算公式：借款金额 * 服务费率<br/>如按固定金额，则服务费为填写的金额</span>
						</el-form-item>
						<el-form-item label="滞纳金率(%)" prop="LoanOverdueFee">
							<el-input type="number" v-model.number="editForm.LoanOverdueFee" min='0' placeholder="请输入" auto-complete="off" style="width:50%;"></el-input>
							<span class="spansty" style="display:inline-block; width:310px;vertical-align: middle;">逾期后按天收取，计算公式：借款金额 * 滞纳金率 * 天数,可在【设置-商户设置】页 配置滞纳金上限。</span>
						</el-form-item>
						<el-form-item label="违约金(元)" prop="LoanOverdueBreachOfFee">
							<el-input type="number" v-model.number="editForm.LoanOverdueBreachOfFee" min='0' placeholder="请输入" auto-complete="off" style="width:50%;"></el-input>
							<span class="spansty">逾期后按次收取，仅收一笔。</span>
						</el-form-item>
						
						<el-form-item label="续期服务费" >
							<el-select v-model.number="editForm.RenewalReportSwitch" placeholder="请选择" @change="handleChange($event,'editForm','RenewalReportMoney','RenewalReportRate')" style="width:160px;">
							    <el-option label="固定金额" :value="1"></el-option>
							    <el-option label="按比例收取" :value="2"></el-option>
							</el-select>
							<el-input v-if="editForm.RenewalReportSwitch==1" type="number" v-model.number="editForm.RenewalReportMoney" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
							<el-input v-else type="number" v-model.number="editForm.RenewalReportRate" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
						</el-form-item>
						<el-form-item label="续期手续费" >
							<el-select v-model.number="editForm.RenewalFeeSwitch" placeholder="请选择" @change="handleChange($event,'editForm','RenewalFee','RenewalFeeRate')" style="width:160px;">
							    <el-option label="固定金额" :value="1"></el-option>
							    <el-option label="按比例收取" :value="2"></el-option>
							</el-select>
							<el-input v-if="editForm.RenewalFeeSwitch==1" type="number" v-model.number="editForm.RenewalFee" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
							<el-input v-else type="number" v-model.number="editForm.RenewalFeeRate" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
						</el-form-item>
						
						<el-form-item label="状态" prop="IsUse">
							<el-switch v-model="editForm.IsUse" active-text="启用" :active-value="1" inactive-text="禁用" :inactive-value="0"></el-switch>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click.native="editSubmit">提交</el-button>
						<el-button @click.native="showDialog_edit=false">取消</el-button>
					</div>
				</el-dialog>
			</el-tab-pane>
		    <!--<el-tab-pane label="信用报告" name="信用报告">
		    	 <el-card class="box-card">
					<div style="height:50px; font:16px/50px '微软雅黑'; display:flex; margin-bottom:50px;">
						<div style="flex:0 0 100px; width:100px;">信用报告定价</div>
						<div style="flex:1; border-bottom:1px dashed #ccc;"></div>
					</div>
					<div style="color:#999;">
						<el-col :span="6" style="line-height:40px;">请根据您的业务情况，设置您需要的信用报告价格。</el-col>
						<el-col :span="18" style="color:#84909D;">
		    				<label>信用报告收费</label>
		    				<el-input type="number" v-model.number="RealPrice" placeholder="请输入金额" auto-complete="off" @input="countModify" style="width:140px; margin:0 20px;"></el-input>
		    				<span>元信用报告费</span>
						</el-col>
					</div>
				</el-card> 
				<el-card class="box-card">
					<div style="height:50px; font:16px/50px '微软雅黑'; display:flex; margin-bottom:50px;">
						<div style="flex:0 0 100px; width:100px;">拒绝报告定价</div>
						<div style="flex:1; border-bottom:1px dashed #ccc;"></div>
					</div>
					<div style="color:#999;">
						<el-col :span="6" style="line-height:40px;">请根据您的业务情况，设置您需要的信用报告价格。</el-col>
						<el-col :span="18" style="color:#84909D;">
		    				<label>信用报告收费</label>
		    				<el-input type="number" v-model.number="RefusePrice" placeholder="请输入金额" auto-complete="off" @input="countModify" style="width:140px; margin:0 20px;"></el-input>
		    				<span>元信用报告费</span>
						</el-col>
					</div>
				</el-card>
				 <el-card class="box-card">
					<div style="height:50px; font:16px/50px '微软雅黑'; display:flex; margin-bottom:50px;">
						<div style="flex:0 0 120px; width:120px;">预付费报告定价</div>
						<div style="flex:1; border-bottom:1px dashed #ccc;"></div>
					</div>
					<div style="color:#999;">
						<el-col :span="6" style="line-height:40px;">请根据您的业务情况，设置您需要的信用报告价格。</el-col>
						<el-col :span="18" style="color:#84909D;">
		    				<label>信用报告收费</label>
		    				<el-input type="number" v-model.number="PrePrice" placeholder="请输入金额" auto-complete="off" @input="countModify" style="width:140px; margin:0 20px;"></el-input>
		    				<span>元信用报告费</span>
						</el-col>
					</div>
				</el-card> 
				<div style="height:80px; background:rgba(255,255,255,1); text-align:center; font:16px/80px '微软雅黑'; box-shadow:0 0 10px #ddd; position:fixed; bottom:20px; right:40px; left:220px; z-index:10;">
					<label style="color:#999;">修改了 &nbsp;&nbsp;<b class="editwordSty">{{modifyCount}}</b>项配置</label>
					<el-button type="primary" size="medium" @click="setReportMoney" style="margin:0 20px;">立即应用</el-button>
					<span class="editwordSty" @click="getReportMoney">放弃修改</span>
				</div>
		    </el-tab-pane>-->
		    <!-- <el-tab-pane label="续期功能" name="续期功能">
		    	<el-card class="box-card">
					<div style="height:50px; font:16px/50px '微软雅黑'; display:flex; margin-bottom:50px;">
						<div style="flex:0 0 80px; width:80px;">续期开关</div>
						<div style="flex:1; border-bottom:1px dashed #ccc;"></div>
					</div>
					<div style="color:#999;">
						<el-col :span="6">请根据您的业务情况，选择是否开启续期开关。</el-col>
						<el-col :span="18" style="overflow:auto;">
							<p style="color:#666; margin-bottom:10px; padding-left:20px; box-sizing:border-box;">打开续期开关，符合续期条件的用户可看到续期入口，且可进行续期申请。</p>
		    				<div class="switcdiv">
		    					<label>续期功能</label>
		    					<el-switch v-model="Switch" :active-value="true" :inactive-value="false" @change="changeSwitch"></el-switch> 
		    				</div>
						</el-col>
					</div>
				</el-card>
		    	<div style="height:80px; background:rgba(255,255,255,1); text-align:center; font:16px/80px '微软雅黑'; box-shadow:0 0 10px #ddd; position:fixed; bottom:20px; right:40px; left:220px; z-index:10;">
					<label style="color:#999;">修改了 &nbsp;&nbsp;<b class="editwordSty">{{switchCount}}</b>项配置</label>
					<el-button type="primary" size="medium" @click="setSwitch" style="margin:0 20px;">立即应用</el-button>
					<span class="editwordSty" @click="getproductrenewal">放弃修改</span>
				</div>
		    </el-tab-pane> -->
		</el-tabs>
	</div>
</template>

<script>
	import http from "../../api/http.js";
	import {configproList,setproisused,addconfigPro,getconfigproinfo,creditrpt,setcreditrpt,productrenewal,productsetrenewal} from 'api/api.js';
	export default {
		data() {
			return {
				activeName:"产品配置",
				//续期功能模块
				Switch:false,
				SwitchOrg:false,
				switchCount:0,
				//信用报告模块
				RealPrice:null,
				RefusePrice:null,
				PrePrice:null,
				modifyCount:0,  //信用报告修改项数
				RealPrice2:null,
				RefusePrice2:null,
				PrePrice2:null,
				//借款产品模块
				listLoading: false,
				tableData: [],
				form:{IsUse:''},
				showDialog_add:false,
				addForm:{
					Id:0,
					IsUse:1,
					IsCut:1,
					TaxMethod:null,
					LoanOverdueBreachOfFee:null,
					LoanOverdueFee:null,
					LoanTaxFee:null,
					RepayType:null,
					LoanTermCount:null,
					ReportSwitch:1,  //服务费标识
					ReportMoney:null,  //服务费（金额）
					LoanServiceFee:null,  //服务费（费率）
					RenewalReportSwitch:1,  //续期服务费标识
					RenewalReportMoney:null,  //续期服务费（金额）
					RenewalReportRate:null,  //续期服务费（费率）
					RenewalFeeSwitch:1,  //续期手续费标识
					RenewalFee:null,  //续期手续费（金额）
					RenewalFeeRate:null  //续期手续费（费率）
				},
				showDialog_edit:false,
				editForm:{},
				rules:{
					LoanTermCount:[{
						required:true,
						message:'期限不得为空',
						trigger:'blur'
					}],
					TaxMethod:[{
						required:true,
						message:'请选择计息方式',
						trigger:'blur'
					}],
					RepayType:[{
						required:true,
						message:'请选择还款方式',
						trigger:'blur'
					}],
					LoanTaxFee:[{
						required:true,
						message:'日利率不得为空，没有请输入0',
						trigger:'blur'
					}],
					LoanOverdueFee:[{
						required:true,
						message:'滞纳金率不得为空，没有请输入0',
						trigger:'blur'
					}],
					LoanOverdueBreachOfFee:[{
						required:true,
						message:'违约金不得为空，没有请输入0',
						trigger:'blur'
					}]
				}
			}
		},
		mounted() {
			this.getconfigProlist();  //获取借款产品列表
//			this.getReportMoney();  //获取信用报告信息
//			this.getproductrenewal();  //获取续期开关状态
		},
		methods: {
			//续期功能tab分模块
			getproductrenewal(){  //获取续期开关状态
				console.log(123)
				productrenewal({}).then((res) => {
					console.log(res,234)
					if( res.Ret == 200 ) {
						this.Switch=res.Switch;
						this.SwitchOrg=res.Switch;
						this.switchCount=0;
					}
				});
			},
			changeSwitch(){  //判断续期开关是否修改
				this.switchCount=this.Switch==this.SwitchOrg?0:1;
			},
			setSwitch(){
				productsetrenewal({Switch:this.Switch}).then((res) => {
					console.log(res);
					if( res.Ret==200 ){
						this.$message.success( res.Msg );
						this.getproductrenewal();
					}
				});
			},
			
			//信用报告tab分模块
			countModify(){  //判断信用报告修改项数
				this.modifyCount=0;
				if( this.RealPrice!=this.RealPrice2 ){
					this.modifyCount=this.modifyCount+1;
				}
				if( this.RefusePrice!=this.RefusePrice2 ){
					this.modifyCount=this.modifyCount+1;
				}
				if( this.PrePrice!=this.PrePrice2 ){
					this.modifyCount=this.modifyCount+1;
				}
			},
			getReportMoney(){  //获取报告费
				creditrpt({}).then((res) => {
					if( res.Ret == 200 ) {
						this.RealPrice=parseFloat(res.RealPrice);
						this.RefusePrice=parseFloat(res.RefusePrice);
						this.PrePrice=parseFloat(res.PrePrice);
						this.RealPrice2=parseFloat(res.RealPrice);
						this.RefusePrice2=parseFloat(res.RefusePrice);
						this.PrePrice2=parseFloat(res.PrePrice);
						this.modifyCount=0;
					}
				});
			},
			setReportMoney(){  //信用报告设置提交
				if( !this.RealPrice || this.RealPrice<0 ){
					this.$message.error("信用报告定价请输入大于0的数！");
					return false;
				}
				if( !this.RefusePrice || this.RefusePrice<0 ){
					this.$message.error("拒绝报告定价请输入大于0的数！");
					return false;
				}
				if( !this.PrePrice || this.PrePrice<0 ){
					this.$message.error("预付费报告定价请输入大于0的数！");
					return false;
				}
				setcreditrpt({RealPrice:parseFloat(this.RealPrice),RefusePrice:parseFloat(this.RefusePrice),PrePrice:parseFloat(this.PrePrice)}).then((res) => {
					if( res.Ret == 200 ) {
						this.$message.success( res.Msg );
						this.getReportMoney();
					}
				});
			},
			
			//借款产品tab分模块
			search() { //搜索
				this.$nextTick(() => {
					this.getconfigProlist();
				});
			},
			getconfigProlist() { //获取列表
				let params = this.form;
				this.listLoading = true;
				configproList(params).then((res) => {
					if( res.Ret != 200 ) {
						return false;
					}
					if(res.Products == null) {
						this.tableData = [];
					} else {
						this.tableData = res.Products;
					}
					this.listLoading = false;
				});
			},
			renderHeader1(h,{column,$index}){ //table表头自定义(计息方式)
				return h("div",{attrs:{style:"padding:0;"}},[
			        h("span",column.label),
			        h('el-tooltip',{props:{placement:'top'}},
						[
							h('p',{ slot:'content' },'算头，放款当日开始计息'),
							h('p',{ slot:'content' },'算尾，计息日最后一天为还款日'),
							h('br',{ slot:'content' }),
							h('p',{ slot:'content' },'示例：借款周期7天，1月1日借款，则'),
							h('p',{ slot:'content' },'-算头不算尾 ，1月1日开始计息，最晚还款日为1月8日；'),
							h('p',{ slot:'content' },'-算头算尾，1月1日开始计息，最晚还款日为1月7日；'),
							h('p',{ slot:'content' },'-不算头算尾，1月2日开始计息，最晚还款日为1月8日。'),
				    		h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'')
				    	]
					)
			    ]);
			},
			renderHeader2(h,{column,$index}){ //table表头自定义(服务费)
				return h("div",{attrs:{style:"padding:0;"}},[
			        h("span",column.label),
			        h('el-tooltip',{props:{placement:'top'}},
						[
							h('p',{ slot:'content' },'比例收取，则服务费随借款金额动态变化（即借款金额 * 服务费率）固定金额，'),
							h('p',{ slot:'content' },'则不论借款多少，均收取固定金额'),
				    		h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'')
				    	]
					)
			    ]);
			},
			renderHeader3(h,{column,$index}){ //table表头自定义(违约金率)
				return h("div",{attrs:{style:"padding:0;"}},[
			        h("span",column.label),
			        h('el-tooltip',{props:{placement:'top',content:'逾期后按天收取，计算公式：借款金额 * 滞纳金率 * 天数。'}},
						[
				    		h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'')
				    	]
					)
			    ]);
			},
			renderHeader4(h,{column,$index}){ //table表头自定义(滞纳金)
				return h("div",{attrs:{style:"padding:0;"}},[
			        h("span",column.label),
			        h('el-tooltip',{props:{placement:'top',content:'逾期后按次收取，仅收一笔。'}},
						[
				    		h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'')
				    	]
					)
			    ]);
			},
			repayType(row){  //还款方式
				return row.RepayType==0?"等本等息":"先息后本";
			},
			freezeDtl(id,isUsed){  //产品禁用、启用
				let params = {Id:id,IsUsed:isUsed}
				setproisused(params).then((res) => {
					if( res.Ret == 200 ){
						this.$message.success( res.Msg );
						this.getconfigProlist();
					}
				});
			},
			handleChange(val,type,key1,key2){  //服务费、续期服务费、续期手续费标识切换
				if(val==1){
					this[type][key2]=null;
				}else{
					this[type][key1]=null;
				}
				console.log(this[type]);
			},
			addSubmit(){  //添加
				this.$refs.addForm.validate((valid) => {
					if( valid ){
						if( !( /^[0-9]*$/.test(this.addForm.LoanTermCount) ) ){
							this.$message.error("期限必须是大于0的整数！");
							return false;
						}
						if( this.addForm.LoanTermCount<=0 || this.addForm.LoanTaxFee<0 || this.addForm.LoanOverdueFee<0 || this.addForm.LoanOverdueBreachOfFee<0 ){
							this.$message.error("输入值不得小于0！");
							return false;
						}
						if(this.addForm.ReportSwitch == 1){
							if(this.addForm.ReportMoney == null || this.addForm.ReportMoney===''){
								this.$message.error('服务费不能为空');
								return false;
							}
						}else{
							if(this.addForm.LoanServiceFee == null || this.addForm.LoanServiceFee===''){
								this.$message.error('服务费不能为空');
								return false;
							}
						}
						if(this.addForm.RenewalReportSwitch == 1){
							if(this.addForm.RenewalReportMoney == null || this.addForm.RenewalReportMoney===''){
								this.$message.error('续期服务费不能为空');
								return false;
							}
						}else{
							if(this.addForm.RenewalReportRate == null || this.addForm.RenewalReportRate===''){
								this.$message.error('续期服务费不能为空');
								return false;
							}
						}
						if(this.addForm.RenewalFeeSwitch == 1){
							if(this.addForm.RenewalFee == null || this.addForm.RenewalFee===''){
								this.$message.error('续期手续费不能为空');
								return false;
							}
						}else{
							if(this.addForm.RenewalFeeRate == null || this.addForm.RenewalFeeRate===''){
								this.$message.error('续期手续费不能为空');
								return false;
							}
						}
						this.addForm.LoanTermCount=parseInt( this.addForm.LoanTermCount );
						let params = this.addForm;
						addconfigPro(params).then((res) => {
							if( res.Ret==200 ){
								this.$message.success( res.Msg );
								this.showDialog_add=false;
								this.getconfigProlist();
								this.resetForm('addForm');
							}
						});
					}
				});
			},
			goEdit(id) { //修改
				let params = {Id:id};
				getconfigproinfo(params).then((res) => {
					if( res.Ret != 200 ) {
						return false;
					}
					console.log(res.Result);
					this.editForm=res.Result;
					this.showDialog_edit=true;
				});
			},
			editSubmit(){  //修改（提交）
				this.$refs.editForm.validate((valid) => {
					if( valid ){
						if( !( /^[0-9]*$/.test(this.editForm.LoanTermCount) ) ){
							this.$message.error("期限必须是大于0的整数！");
							return false;
						}
						if( this.editForm.LoanTermCount<=0 || this.editForm.LoanTaxFee<0 || this.editForm.LoanOverdueFee<0 || this.editForm.LoanOverdueBreachOfFee<0 ){
							this.$message.error("输入值不得小于0！");
							return false;
						}
						if(this.editForm.ReportSwitch == 1){
							if(this.editForm.ReportMoney == null || this.editForm.ReportMoney===''){
								this.$message.error('服务费不能为空');
								return false;
							}
						}else{
							if(this.editForm.LoanServiceFee == null || this.editForm.LoanServiceFee===''){
								this.$message.error('服务费不能为空');
								return false;
							}
						}
						if(this.editForm.RenewalReportSwitch == 1){
							if(this.editForm.RenewalReportMoney == null || this.editForm.RenewalReportMoney===''){
								this.$message.error('续期服务费不能为空');
								return false;
							}
						}else{
							if(this.editForm.RenewalReportRate == null || this.editForm.RenewalReportRate===''){
								this.$message.error('续期服务费不能为空');
								return false;
							}
						}
						if(this.editForm.RenewalFeeSwitch == 1){
							if(this.editForm.RenewalFee == null || this.editForm.RenewalFee===''){
								this.$message.error('续期手续费不能为空');
								return false;
							}
						}else{
							if(this.editForm.RenewalFeeRate == null || this.editForm.RenewalFeeRate===''){
								this.$message.error('续期手续费不能为空');
								return false;
							}
						}
						this.editForm.LoanTermCount=parseInt( this.editForm.LoanTermCount );
						let params = this.editForm;
						addconfigPro(params).then((res) => {
							if( res.Ret==200 ){
								this.$message.success( res.Msg );
								this.showDialog_edit=false;
								this.getconfigProlist();
								this.resetForm('editForm');
							}
						});
					}
				});
			},
	      	resetForm(formName){  //重置表单
	      		this.$nextTick(() => {
			        this.$refs[formName].resetFields();
			    });
	      	}
		}
	}
</script>

<style scoped lang="scss">
	.header .el-form-item { margin-bottom:0;}
	.el-radio.is-bordered.is-bordered{ margin:0 10px 15px 0; }
	.spansty{ color:#999; font:12px "微软雅黑"; margin-left:10px; }
	.switcdiv{ float:left; width:25%; padding:20px 0; text-align:center; border:1px solid rgb(234,234,234); background:rgb(249,249,249); border-radius:5px; margin:20px; }
	.switcdiv>label{ display:inline-block; width:150px; color:#59616A; text-align:left; }
</style>