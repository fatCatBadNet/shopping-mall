<template>
	<div id="newproconfig">
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
					<el-button type="primary" size="small" @click="showDialog_add=true" style="float:right;">添加产品</el-button>
				</el-form>
			</div>
			<template>
				<el-table :data="tableData" v-loading="listLoading" element-loading-text="数据加载中..." border :span-method="objectSpanMethod" :row-class-name="tableRowClassName" @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave">
					<el-table-column label="借款产品" align="center">
						<el-table-column label="期限" min-width="45" align="center">
							<template slot-scope="scope">{{scope.row.TermCount}}天</template>
						</el-table-column>
						<el-table-column label="服务费" :render-header="renderHeader2" align="left">
							<template slot-scope="scope">
								<div v-if="NextServiceFeeShow">
									<span v-if="scope.row.ReportSwitch==1">首借:{{scope.row.ReportMoney}}元</span>
									<span v-else-if="scope.row.ReportSwitch==2">首借:{{scope.row.LoanServiceFee}}%</span>
									<div v-if="scope.row.NextReportSwitch==1">复借:{{scope.row.NextReportMoney}}元</div>
									<div v-else-if="scope.row.NextReportSwitch==2">复借:{{scope.row.NextLoanServiceFee}}%</div>
								</div>
								<div v-else>
									<span v-if="scope.row.ReportSwitch==1">{{scope.row.ReportMoney}}元</span>
									<span v-else>{{scope.row.LoanServiceFee}}%</span>
								</div>
							</template>
						</el-table-column>
						<!-- <el-table-column label="计息方式" :render-header="renderHeader1" min-width="90" align="center">
							<template slot-scope="scope"><span>{{scope.row.TaxMethod==1?"算头不算尾":scope.row.TaxMethod==2?"算头算尾":"不算头算尾"}}</span></template>
						</el-table-column> -->
						<el-table-column label="日利率（%）" align="center">
							<template slot-scope="scope">{{scope.row.LoanTaxFee}}%</template>
						</el-table-column>
						<el-table-column prop="LoanOverdueFee" label="滞纳金率" :formatter="LoanOverdueFee" :render-header="renderHeader3" min-width="90" align="center">
							<template slot-scope="scope">{{scope.row.LoanOverdueFee}}% / 天</template>
						</el-table-column>
						<el-table-column prop="LoanOverdueBreachOfFee" label="违约金" :render-header="renderHeader4" align="center">
							<template slot-scope="scope">{{scope.row.LoanOverdueBreachOfFee}}元</template>
						</el-table-column>
						<el-table-column label="状态" min-width="110" align="center" :render-header="renderHeader6">
							<template slot-scope="scope">
								<el-switch v-model="scope.row.IsUse" active-text="启用" :active-value="1" inactive-text="禁用" :inactive-value="0" @change="freezeDtl(scope.row.Pid,scope.row.IsUse)"></el-switch>
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column label="续期配置" align="center">
						<el-table-column label="期限" min-width="90" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.Id==0">-</span>
								<span v-else>{{scope.row.LoanTermCount}}天</span>
							</template>
						</el-table-column>
						<el-table-column label="续期服务费" align="center">
							<template slot-scope="scope">
								<div v-if="scope.row.Id==0">-</div>
								<div v-else>
									<span v-if="scope.row.RenewalReportSwitch==1">{{scope.row.RenewalReportMoney}}元</span>
									<span v-else>{{scope.row.RenewalReportRate}}%</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column label="续期手续费" align="center">
							<template slot-scope="scope">
								<div v-if="scope.row.Id==0">-</div>
								<div v-else>
									<span v-if="scope.row.RenewalFeeSwitch==1">{{scope.row.RenewalFee}}元</span>
									<span v-else>{{scope.row.RenewalFeeRate}}%</span>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="" label="提额" :render-header="renderHeader5" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.Id==0">-</span>
								<span v-else>{{scope.row.InMention==0?'未计入':scope.row.InMention==1?'计入':''}}</span>
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column label="操作" align="center">
						<el-table-column label="续期操作" min-width="160" align="center">
							<template slot-scope="scope">
								<div v-if="scope.row.Id==0">
									<span style="margin-right:80px;">-</span>
									<span>-</span>
								</div>
								<div v-else>
									<el-button type="primary" plain size="mini" @click="goeditrenewal(scope.row)">修改续期</el-button>
									<el-button type="primary" plain size="mini" @click="godeleterenewal(scope.row.Id)">删除续期</el-button>
								</div>
							</template>
						</el-table-column>
						<el-table-column label="操作" min-width="160" align="center">
							<template slot-scope="scope">
								<el-button type="primary" size="mini" @click="goEdit(scope.row.Pid)">修改产品</el-button>
								<el-button type="primary" plain size="mini" @click="goaddRenew(scope.row.Pid)">添加续期</el-button>
							</template>
						</el-table-column>
					</el-table-column>	
				</el-table>
			</template>
		</el-card>
		<!-- 添加产品弹框 -->
		<el-dialog title="借款配置" :visible.sync="showDialog_add" :close-on-click-modal="true" :center="true" @open="resetForm('addForm')" v-dialogDrag custom-class="dialogclass" width="850px">
			<el-form :model="addForm" :rules="rules" label-width="120px" ref="addForm">
				<el-form-item label="期限" prop="TermCount">
					<el-input v-model="addForm.TermCount" placeholder="请输入" auto-complete="off" style="width:50%;"></el-input>
				</el-form-item>
				<!-- <el-form-item label="计息方式" prop="TaxMethod">
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
				</el-form-item> -->
				<el-form-item label="日利率(%)" prop="LoanTaxFee">
					<el-input type="number" v-model.number="addForm.LoanTaxFee" min='0' placeholder="请输入折合年化不超过36%的日利率" auto-complete="off" style="width:50%;"></el-input>
				</el-form-item>
				<el-form-item :label="NextServiceFeeShow?'服务费(首借)':'服务费'">
					<el-select v-model.number="addForm.ReportSwitch" placeholder="请选择" @change="handleChange($event,'addForm','ReportMoney','LoanServiceFee')" style="width:160px;">
						<el-option label="固定金额" :value="1"></el-option>
						<el-option label="按比例收取" :value="2"></el-option>
					</el-select>
					<el-input v-if="addForm.ReportSwitch==1" type="number" v-model.number="addForm.ReportMoney" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
					<el-input v-else type="number" v-model.number="addForm.LoanServiceFee" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
					<span class="spansty" style="display:inline-block; width:310px;vertical-align: middle;">如按比例收取，则服务费计算公式：借款金额 * 服务费率<br/>如按固定金额，则服务费为填写的金额。</span>
				</el-form-item>
				<el-form-item label="服务费(复借)" v-if="NextServiceFeeShow">
					<el-select v-model.number="addForm.NextReportSwitch" placeholder="请选择" @change="handleChange($event,'addForm','NextReportMoney','NextLoanServiceFee')" style="width:160px;">
						<el-option label="固定金额" :value="1"></el-option>
						<el-option label="按比例收取" :value="2"></el-option>
					</el-select>
					<el-input v-if="addForm.NextReportSwitch==1" type="number" v-model.number="addForm.NextReportMoney" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
					<el-input v-else type="number" v-model.number="addForm.NextLoanServiceFee" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
					<span class="spansty" style="display:inline-block; width:310px;vertical-align: middle;">如按比例收取，则服务费计算公式：借款金额 * 服务费率<br/>如按固定金额，则服务费为填写的金额。</span>
				</el-form-item>
				<el-form-item label="前置费用开关" prop="IsCut">
					<el-switch v-model="addForm.IsCut" active-text="启用" :active-value="1" inactive-text="禁用"  :inactive-value="0"></el-switch>
				</el-form-item>
				<el-form-item label="滞纳金率(%)" prop="LoanOverdueFee">
					<el-input type="number" v-model.number="addForm.LoanOverdueFee" min='0' placeholder="请输入" auto-complete="off" style="width:50%;"></el-input>
					<span class="spansty" style="display:inline-block; width:310px;vertical-align: middle;">逾期后按天收取，计算公式：借款金额 * 滞纳金率 * 天数,可在【设置-商户设置】页 配置滞纳金上限。</span>
				</el-form-item>
				<el-form-item label="违约金(元)" prop="LoanOverdueBreachOfFee">
					<el-input type="number" v-model.number="addForm.LoanOverdueBreachOfFee" min='0' placeholder="请输入" auto-complete="off" style="width:50%;"></el-input>
					<span class="spansty">逾期后按次收取，仅收一笔。</span>
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
		<!-- 修改产品弹框 -->
		<el-dialog title="借款配置" :visible.sync="showDialog_edit" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="850px">
			<el-form :model="editForm" :rules="rules" label-width="120px" ref="editForm">
				<el-form-item label="期限" prop="TermCount">
					<el-input v-model="editForm.TermCount" placeholder="请输入" auto-complete="off" style="width:50%;"></el-input>
				</el-form-item>
				<!-- <el-form-item label="计息方式" prop="TaxMethod">
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
				</el-form-item> -->
				<el-form-item label="日利率(%)" prop="LoanTaxFee">
					<el-input type="number" v-model.number="editForm.LoanTaxFee" min='0' placeholder="请输入折合年化不超过36%的日利率" auto-complete="off" style="width:50%;"></el-input>
				</el-form-item>
				<el-form-item :label="NextServiceFeeShow?'服务费(首借)':'服务费'">
					<el-select v-model.number="editForm.ReportSwitch" placeholder="请选择" @change="handleChange($event,'editForm','ReportMoney','LoanServiceFee')" style="width:160px;">
						<el-option label="固定金额" :value="1"></el-option>
						<el-option label="按比例收取" :value="2"></el-option>
					</el-select>
					<el-input v-if="editForm.ReportSwitch==1" type="number" v-model.number="editForm.ReportMoney" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
					<el-input v-else type="number" v-model.number="editForm.LoanServiceFee" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
					<span class="spansty" style="display:inline-block; width:310px;vertical-align: middle;">如按比例收取，则服务费计算公式：借款金额 * 服务费率<br/>如按固定金额，则服务费为填写的金额</span>
				</el-form-item>
				<el-form-item label="服务费(复借)" v-if="NextServiceFeeShow">
					<el-select v-model.number="editForm.NextReportSwitch" placeholder="请选择" @change="handleChange($event,'editForm','NextReportMoney','NextLoanServiceFee')" style="width:160px;">
						<el-option label="固定金额" :value="1"></el-option>
						<el-option label="按比例收取" :value="2"></el-option>
					</el-select>
					<el-input v-if="editForm.NextReportSwitch==1" type="number" v-model.number="editForm.NextReportMoney" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
					<el-input v-else type="number" v-model.number="editForm.NextLoanServiceFee" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
					<span class="spansty" style="display:inline-block; width:310px;vertical-align: middle;">如按比例收取，则服务费计算公式：借款金额 * 服务费率<br/>如按固定金额，则服务费为填写的金额</span>
				</el-form-item>
				<el-form-item label="前置费用开关" prop="IsCut">
					<el-switch v-model="editForm.IsCut" active-text="启用" :active-value="1" inactive-text="禁用" :inactive-value="0"></el-switch>
				</el-form-item>
				<el-form-item label="滞纳金率(%)" prop="LoanOverdueFee">
					<el-input type="number" v-model.number="editForm.LoanOverdueFee" min='0' placeholder="请输入" auto-complete="off" style="width:50%;"></el-input>
					<span class="spansty" style="display:inline-block; width:310px;vertical-align: middle;">逾期后按天收取，计算公式：借款金额 * 滞纳金率 * 天数,可在【设置-商户设置】页 配置滞纳金上限。</span>
				</el-form-item>
				<el-form-item label="违约金(元)" prop="LoanOverdueBreachOfFee">
					<el-input type="number" v-model.number="editForm.LoanOverdueBreachOfFee" min='0' placeholder="请输入" auto-complete="off" style="width:50%;"></el-input>
					<span class="spansty">逾期后按次收取，仅收一笔。</span>
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
		<!-- 添加续期配置 -->
		<el-dialog title="添加续期配置" :visible.sync="addrenewDialog" :close-on-click-modal="true" :center="true" @open="resetForm('addrenewForm')" v-dialogDrag custom-class="dialogclass" width="800px">
			<el-form :model="addrenewForm" :rules="renewRules" label-width="130px" ref="addrenewForm">
				<el-form-item label="期限:" prop="LoanTermCount">
					<el-input v-model.number="addrenewForm.LoanTermCount" placeholder="请输入" auto-complete="off" style="width:50%;"></el-input>
				</el-form-item>
				<el-form-item label="续期服务费:">
					<el-select v-model.number="addrenewForm.RenewalReportSwitch" placeholder="请选择" @change="handleChange($event,'addrenewForm','RenewalReportMoney','RenewalReportRate')" style="width:160px;">
					    <el-option label="固定金额" :value="1"></el-option>
					    <el-option label="按比例收取" :value="2"></el-option>
					</el-select>
					<el-input v-if="addrenewForm.RenewalReportSwitch==1" type="number" v-model.number="addrenewForm.RenewalReportMoney" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
					<el-input v-else type="number" v-model.number="addrenewForm.RenewalReportRate" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
				</el-form-item>
				<el-form-item label="续期手续费:">
					<el-select v-model.number="addrenewForm.RenewalFeeSwitch" placeholder="请选择" @change="handleChange($event,'addrenewForm','RenewalFee','RenewalFeeRate')" style="width:160px;">
					    <el-option label="固定金额" :value="1"></el-option>
					    <el-option label="按比例收取" :value="2"></el-option>
					</el-select>
					<el-input v-if="addrenewForm.RenewalFeeSwitch==1" type="number" v-model.number="addrenewForm.RenewalFee" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
					<el-input v-else type="number" v-model.number="addrenewForm.RenewalFeeRate" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
				</el-form-item>
				<el-form-item label="是否计入提额:">
					<el-checkbox v-model="addrenewForm.InMention" :true-label="1" :false-label="0" style="margin-right:20px;">计入提额</el-checkbox>
					<span class="spansty" style="display:inline-block; width:310px; padding:5px 10px; vertical-align:middle; border:1px solid #ccc; border-radius:4px;">若不计入提额，用户进行该期限续期，不会视作正常借款，故提额时不会将此还款操作纳入统计。</span>
				</el-form-item>
				<el-form-item label="开始计息日:" v-if="ValueDateShow">
					<el-radio-group v-model="addrenewForm.ValueDate">
						<el-radio :label="0">到期日第二天</el-radio>
						<el-radio :label="1">到期日</el-radio>
					</el-radio-group>
					<span class="spansty" style="display:inline-block; width:500px; padding:5px 10px; vertical-align:middle; line-height:24px; border:1px solid #ccc; border-radius:4px;">到期日第二天：指用户申请续期时，当前借款周期的到期日第二天将作为续期的开始计息日；<br>到期日：指用户申请续期时，当前借款周期的到期日将作为续期的开始计息日。</span>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="addrenewSubmit">提交</el-button>
				<el-button @click.native="addrenewDialog=false">取消</el-button>
			</div>
		</el-dialog>
		<!-- 修改续期配置 -->
		<el-dialog title="修改续期配置" :visible.sync="editrenewDialog" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="800px">
			<el-form :model="editrenewForm" :rules="renewRules" label-width="130px" ref="editrenewForm">
				<el-form-item label="期限:" prop="LoanTermCount">
					<el-input v-model.number="editrenewForm.LoanTermCount" placeholder="请输入" auto-complete="off" style="width:50%;"></el-input>
				</el-form-item>
				<el-form-item label="续期服务费:">
					<el-select v-model.number="editrenewForm.RenewalReportSwitch" placeholder="请选择" @change="handleChange($event,'editrenewForm','RenewalReportMoney','RenewalReportRate')" style="width:160px;">
					    <el-option label="固定金额" :value="1"></el-option>
					    <el-option label="按比例收取" :value="2"></el-option>
					</el-select>
					<el-input v-if="editrenewForm.RenewalReportSwitch==1" type="number" v-model.number="editrenewForm.RenewalReportMoney" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
					<el-input v-else type="number" v-model.number="editrenewForm.RenewalReportRate" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
				</el-form-item>
				<el-form-item label="续期手续费:">
					<el-select v-model.number="editrenewForm.RenewalFeeSwitch" placeholder="请选择" @change="handleChange($event,'editrenewForm','RenewalFee','RenewalFeeRate')" style="width:160px;">
					    <el-option label="固定金额" :value="1"></el-option>
					    <el-option label="按比例收取" :value="2"></el-option>
					</el-select>
					<el-input v-if="editrenewForm.RenewalFeeSwitch==1" type="number" v-model.number="editrenewForm.RenewalFee" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
					<el-input v-else type="number" v-model.number="editrenewForm.RenewalFeeRate" min='0' placeholder="请输入" auto-complete="off" style="width:176px;"></el-input>
				</el-form-item>
				<el-form-item label="是否计入提额:">
					<el-checkbox v-model="editrenewForm.InMention" :true-label="1" :false-label="0" style="margin-right:20px;">计入提额</el-checkbox>
					<span class="spansty" style="display:inline-block; width:310px; padding:5px 10px; vertical-align:middle; border:1px solid #ccc; border-radius:4px;">若不计入提额，用户进行该期限续期，不会视作正常借款，故提额时不会将此还款操作纳入统计。</span>
				</el-form-item>
				<el-form-item label="开始计息日:" v-if="ValueDateShow">
					<el-radio-group v-model="editrenewForm.ValueDate">
						<el-radio :label="0">到期日第二天</el-radio>
						<el-radio :label="1">到期日</el-radio>
					</el-radio-group>
					<span class="spansty" style="display:inline-block; width:500px; padding:5px 10px; vertical-align:middle; line-height:24px; border:1px solid #ccc; border-radius:4px;">到期日第二天：指用户申请续期时，当前借款周期的到期日第二天将作为续期的开始计息日；<br>到期日：指用户申请续期时，当前借款周期的到期日将作为续期的开始计息日。</span>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="editrenewSubmit">提交</el-button>
				<el-button @click.native="editrenewDialog=false">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import http from "../../api/http.js";
	import {configproList,setproisused,addconfigPro,getconfigproinfo,addeditrenewal,deleterenewal} from 'api/api.js';
	export default {
		data() {
			return {
				listLoading: false,
				tableData: [],
				ValueDateShow:false,
				NextServiceFeeShow:false,
				form:{IsUse:''},
				showDialog_add:false,
				addForm:{
					Pid:0,
					IsUse:1,
					TaxMethod:2,
					IsCut:1,
					LoanOverdueBreachOfFee:null,
					LoanOverdueFee:null,
					LoanTaxFee:null,
					TermCount:null,
					ReportSwitch:1,  //服务费标识
					ReportMoney:null,  //服务费（金额）
					LoanServiceFee:null,  //服务费（费率）
					NextLoanServiceFee:null,
					NextReportMoney:null,
					NextReportSwitch:1,
				},
				showDialog_edit:false,
				editForm:{},
				rules:{
					TermCount:[{
						required:true,
						message:'期限不得为空',
						trigger:'blur'
					}],
					TaxMethod:[{
						required:true,
						message:'请选择计息方式',
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
				},
				addrenewDialog:false,
				addrenewForm:{
					Id:null,  //唯一主键
					ProductId:null,  //关联产品主键
					InMention:1,  //计入提额 0未计入提额 1计入提额
					LoanTermCount:null,  //期限
					RenewalFeeSwitch:1,  //续期手续费模式1固定金额2按率计算
					RenewalFee:null,  //固定续期手续费用
					RenewalFeeRate:null,  //费率续期手续费用
					RenewalReportSwitch:1,  //续期服务费模式1固定金额2按率计算
					RenewalReportMoney:null,  //固定续期服务费
					RenewalReportRate:null,  //费率续期服务费
					ValueDate:0
				},
				editrenewDialog:false,
				editrenewForm:{},
				renewRules:{
					LoanTermCount:[{
						required:true,
						message:'期限不得为空',
						trigger:'blur'
					}]
				},
				orderArr:{},   // 整合过的数据    {100:2}  {Pid:rows}
				hoverOrderArr:[]
			}
		},
		mounted() {
			this.getlist();  //获取借款产品列表
		},
		
		methods: {
			tableRowClassName: function ({row,rowIndex}) {
				var arr = this.hoverOrderArr;
				if(arr.includes(rowIndex)){
					return 'success-row';
				}
			},
			getOrderArr(list){
				let obj = {};
				for ( let [index, val] of list.entries()){
					let key = val.Pid;
					if(!obj[key]){
						obj[key] = [];
					}
					obj[key].push(index);

				}
				this.orderArr = obj;
			},
			cellMouseEnter: function (row, column, cell, event) {
				this.hoverOrderArr = this.orderArr[row.Pid] || [];
				// console.log(this.hoverOrderArr);
			},
			cellMouseLeave: function (row, column, cell, event) {
				this.hoverOrderArr= [];
			},
			goeditrenewal(row){  //去修改续期
				this.editrenewForm={};
				this.editrenewForm=JSON.parse(JSON.stringify(row));
				console.log( this.editrenewForm );
				this.editrenewDialog=true;
			},
			editrenewSubmit(){  //添加续期提交
				this.$refs.editrenewForm.validate((valid) => {
					if( valid ){
						if(this.editrenewForm.RenewalReportSwitch == 1){
							if(this.editrenewForm.RenewalReportMoney == null || this.editrenewForm.RenewalReportMoney===''){
								this.$message.error('续期服务费不能为空');
								return false;
							}
						}else{
							if(this.editrenewForm.RenewalReportRate == null || this.editrenewForm.RenewalReportRate===''){
								this.$message.error('续期服务费不能为空');
								return false;
							}
						}
						if(this.editrenewForm.RenewalFeeSwitch == 1){
							if(this.editrenewForm.RenewalFee == null || this.editrenewForm.RenewalFee===''){
								this.$message.error('续期手续费不能为空');
								return false;
							}
						}else{
							if(this.editrenewForm.RenewalFeeRate == null || this.editrenewForm.RenewalFeeRate===''){
								this.$message.error('续期手续费不能为空');
								return false;
							}
						}
						this.editrenewForm.LoanTermCount=parseInt( this.editrenewForm.LoanTermCount );
						let params = this.editrenewForm;
						addeditrenewal(params).then((res) => {
							if( res.Ret==200 ){
								this.$message.success( res.Msg );
								this.editrenewDialog=false;
								this.getlist();
							}
						});
					}
				});
			},
			goaddRenew(id){  //去添加续期配置
				this.addrenewForm.ProductId=id;
				this.addrenewDialog=true;
			},
			addrenewSubmit(){  //添加续期提交
				this.$refs.addrenewForm.validate((valid) => {
					if( valid ){
						if(this.addrenewForm.RenewalReportSwitch == 1){
							if(this.addrenewForm.RenewalReportMoney == null || this.addrenewForm.RenewalReportMoney===''){
								this.$message.error('续期服务费不能为空');
								return false;
							}
						}else{
							if(this.addrenewForm.RenewalReportRate == null || this.addrenewForm.RenewalReportRate===''){
								this.$message.error('续期服务费不能为空');
								return false;
							}
						}
						if(this.addrenewForm.RenewalFeeSwitch == 1){
							if(this.addrenewForm.RenewalFee == null || this.addrenewForm.RenewalFee===''){
								this.$message.error('续期手续费不能为空');
								return false;
							}
						}else{
							if(this.addrenewForm.RenewalFeeRate == null || this.addrenewForm.RenewalFeeRate===''){
								this.$message.error('续期手续费不能为空');
								return false;
							}
						}
						this.addrenewForm.LoanTermCount=parseInt( this.addrenewForm.LoanTermCount );
						let params = this.addrenewForm;
						addeditrenewal(params).then((res) => {
							if( res.Ret==200 ){
								this.$message.success( res.Msg );
								this.addrenewDialog=false;
								this.getlist();
							}
						});
					}
				});
			},
			search() { //搜索
				this.ispage = false;
				this.$nextTick(() => {
					this.page = 1;
					this.getlist();
					this.ispage = true;
				});
			},
			getlist() { //获取列表
				let params = this.form;
				this.listLoading = true;
				configproList(params).then((res) => {
					if( res.Ret == 200 ) {
						this.tableData=[];
						this.ValueDateShow=res.ValueDateShow;
						this.NextServiceFeeShow=res.NextServiceFeeShow;
						if( res.Products.length>0 ){
							res.Products.forEach(items=>{
								if( items.Renewals.length>1 ){
									items.Renewals.forEach((item,index)=>{
										if( index==0 ){
											item.rows=items.Renewals.length;
											item.cols=1;
										}else{
											item.rows=0;
											item.cols=0;
										}
										let newItems=JSON.parse(JSON.stringify(items));
										newItems.Renewals=null;
										this.tableData.push(Object.assign({},newItems,item));
									});
								}else{
									items.Renewals.forEach((item,index)=>{
										item.rows=1;
										item.cols=1;
										let newItems=JSON.parse(JSON.stringify(items));
										newItems.Renewals=null;
										this.tableData.push(Object.assign({},newItems,item));
									});
								}
							});
						}
						this.listLoading = false;
						this.getOrderArr(this.tableData);
					}
				});
			},
			objectSpanMethod({ row,column,rowIndex,columnIndex }) {
				if( columnIndex===0 || columnIndex===1 || columnIndex===2 || columnIndex===3 || columnIndex===4 || columnIndex===5 || columnIndex===11 ){
					return {rowspan:row.rows,colspan:row.cols};
				}
			},
			freezeDtl(id,isUsed){  //产品禁用、启用
				let params = {Id:id,IsUsed:isUsed}
				setproisused(params).then((res) => {
					if( res.Ret == 200 ){
						this.$message.success( res.Msg );
						this.getlist();
					}
				});
			},
			godeleterenewal(id){  //删除续期配置
				this.$confirm('确定删除此项续期配置吗?','提示',{
					type:'warning'
				}).then(() => {
					let params = {Id:id}
					deleterenewal(params).then((res) => {
						if( res.Ret == 200 ){
							this.$message.success( res.Msg );
							this.getlist();
						}
					});
				}).catch(() => {  });
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
						if( !( /^[0-9]*$/.test(this.addForm.TermCount) ) ){
							this.$message.error("期限必须是大于0的整数！");
							return false;
						}
						if( this.addForm.TermCount<=0 || this.addForm.LoanTaxFee<0 || this.addForm.LoanOverdueFee<0 || this.addForm.LoanOverdueBreachOfFee<0 ){
							this.$message.error("输入值不得小于0！");
							return false;
						}
						if(this.addForm.ReportSwitch == 1){
							if(this.addForm.ReportMoney == null || this.addForm.ReportMoney===''){
								this.$message.error(this.NextServiceFeeShow?'首借服务费不能为空':'服务费不能为空');
								return false;
							}
						}else{
							if(this.addForm.LoanServiceFee == null || this.addForm.LoanServiceFee===''){
								this.$message.error(this.NextServiceFeeShow?'首借服务费不能为空':'服务费不能为空');
								return false;
							}
						}
						if( this.NextServiceFeeShow ){
							if(this.addForm.NextReportSwitch == 1){
								if(this.addForm.NextReportMoney == null || this.addForm.NextReportMoney===''){
									this.$message.error('复借服务费不能为空');
									return false;
								}
							}else{
								if(this.addForm.NextLoanServiceFee == null || this.addForm.NextLoanServiceFee===''){
									this.$message.error('复借服务费不能为空');
									return false;
								}
							}
						}
						this.addForm.TermCount=parseInt( this.addForm.TermCount );
						let params = this.addForm;
						addconfigPro(params).then((res) => {
							if( res.Ret==200 ){
								this.$message.success( res.Msg );
								this.showDialog_add=false;
								this.getlist();
								this.resetForm('addForm');
							}
						});
					}
				});
			},
			goEdit(id) { //修改
				getconfigproinfo({Id:id}).then((res) => {
					if( res.Ret == 200 ) {
						this.editForm=res.Result;
						this.showDialog_edit=true;
					}
				});
			},
			editSubmit(){  //修改（提交）
				this.$refs.editForm.validate((valid) => {
					if( valid ){
						if( !( /^[0-9]*$/.test(this.editForm.TermCount) ) ){
							this.$message.error("期限必须是大于0的整数！");
							return false;
						}
						if( this.editForm.TermCount<=0 || this.editForm.LoanTaxFee<0 || this.editForm.LoanOverdueFee<0 || this.editForm.LoanOverdueBreachOfFee<0 ){
							this.$message.error("输入值不得小于0！");
							return false;
						}
						if(this.editForm.ReportSwitch == 1){
							if(this.editForm.ReportMoney == null || this.editForm.ReportMoney===''){
								this.$message.error(this.NextServiceFeeShow?'首借服务费不能为空':'服务费不能为空');
								return false;
							}
						}else{
							if(this.editForm.LoanServiceFee == null || this.editForm.LoanServiceFee===''){
								this.$message.error(this.NextServiceFeeShow?'首借服务费不能为空':'服务费不能为空');
								return false;
							}
						}
						if( this.NextServiceFeeShow ){
							if(this.editForm.NextReportSwitch == 1){
								if(this.editForm.NextReportMoney == null || this.editForm.NextReportMoney===''){
									this.$message.error('复借服务费不能为空');
									return false;
								}
							}else{
								if(this.editForm.NextLoanServiceFee == null || this.editForm.NextLoanServiceFee===''){
									this.$message.error('复借服务费不能为空');
									return false;
								}
							}
						}
						this.editForm.TermCount=parseInt( this.editForm.TermCount );
						let params = this.editForm;
						console.log(params)
						addconfigPro(params).then((res) => {
							if( res.Ret==200 ){
								this.$message.success( res.Msg );
								this.showDialog_edit=false;
								this.getlist();
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
	      	},
			renderHeader1(h,{column,$index}){ //table表头自定义(计息方式)
				return h("div",{attrs:{style:"padding:0;"}},[
			        h("span",column.label),
			        h('el-tooltip',{props:{placement:'top'}},
						[
							h('p',{ slot:'content' },'算头，放款当日开始计息'),
							h('p',{ slot:'content' },'算尾，计息日最后一天为还款日'),
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
							h('p',{ slot:'content' },'服务费：比例收取，则服务费随借款金额动态变化（即借款金额 * 服务费率）'),
							h('p',{ slot:'content' },'固定金额，则不论借款多少，均收取固定金额'),
				    		h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'')
				    	]
					)
			    ]);
			},
			renderHeader3(h,{column,$index}){ //table表头自定义(滞纳金率)
				return h("div",{attrs:{style:"padding:0;"}},[
			        h("span",column.label),
			        h('el-tooltip',{props:{placement:'top',content:'逾期后按天收取，计算公式：借款金额 * 滞纳金率 * 天数。'}},
						[
				    		h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'')
				    	]
					)
			    ]);
			},
			renderHeader4(h,{column,$index}){ //table表头自定义(违约金)
				return h("div",{attrs:{style:"padding:0;"}},[
			        h("span",column.label),
			        h('el-tooltip',{props:{placement:'top',content:'逾期后按次收取，仅收一笔。'}},
						[
				    		h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'')
				    	]
					)
			    ]);
			},
			renderHeader5(h,{column,$index}){ //table表头自定义(提额)
				return h("div",{attrs:{style:"padding:0;"}},[
			        h("span",column.label),
			        h('el-tooltip',{props:{placement:'top',content:'若不计入提额，用户进行该期限续期，不会视作正常还款，故提额时不会将此还款操作纳入统计。'}},
						[
				    		h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'')
				    	]
					)
			    ]);
			},
			renderHeader6(h,{column,$index}){ //table表头自定义(产品状态)
				return h("div",{attrs:{style:"padding:0;"}},[
			        h("span",column.label),
			        h('el-tooltip',{props:{placement:'top',content:'若禁用，则对应产品的续期也会被禁用。'}},
						[
				    		h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'')
				    	]
					)
			    ]);
			}
		}
	}
</script>

<style lang="scss">
	#newproconfig{
		.header .el-form-item { margin-bottom:0;}
		.el-radio.is-bordered.is-bordered{ margin:0 10px 15px 0; }
		.spansty{ color:#999; font:12px "微软雅黑"; margin-left:10px; }
		.switcdiv{ float:left; width:25%; padding:20px 0; text-align:center; border:1px solid rgb(234,234,234); background:rgb(249,249,249); border-radius:5px; margin:20px; }
		.switcdiv>label{ display:inline-block; width:150px; color:#59616A; text-align:left; }
		 .el-table .success-row {
			background: #f5f7fa;
			}

	}
	
</style>