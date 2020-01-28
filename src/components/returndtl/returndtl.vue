<template>
	<section>
		<el-card class="box-card">
			<div slot="header" class="clearfix" style="color:#101010;">
				<span>{{LoanBackDetail.Verifyrealname}}</span>
				<span style="padding-left:8px;">{{LoanBackDetail.Account}}</span>
				<span style="color:#6B6B6B;padding-left:8px;">（用户ID：{{LoanBackDetail.Uid}}）</span>
			</div>
			<el-row :span="24" style="padding-top:15px; box-sizing:border-box; position:relative; color:#999;" id="retundtl">
				<el-col class="item-card" :span="12" style="padding-right:3px;">
					<el-card style="box-shadow:none;border: 1px solid #EAEAEA;padding-left:20px;height:308px; padding-right:20px; ">
						<div slot="header" class="clearfix" style="color:#101010;">
							<span class="header-left">到期时间</span>
							<span class="header-right">
                <span class="time">{{LoanBackDetail.RemaindTip}}</span>
							</span>
						</div>
						<el-row :span="24" class="list">
							<el-col class="list-item">
								<span class="title">借款天数</span>
								<span class="value">{{LoanBackDetail.LoanTermCount}}天</span>
							</el-col>
							<el-col class="list-item">
								<span class="title">借款时间</span>
								<span class="value">{{LoanBackDetail.LoanDate}}</span>
							</el-col>
							<el-col class="list-item">
								<template v-if="LoanBackDetail.RenewCount > 0">
									<span class="title">办理续期时间</span>
									<span class="value">{{LoanBackDetail.RenewDate}}</span>
								</template>
								<template v-else>
									<span class="title">放款时间</span>
									<span class="value">{{LoanBackDetail.TradeDate}}</span>
								</template>
							</el-col>
							<el-col class="list-item">
								<span class="title">借款起止日期</span>
								<span class="value">{{LoanBackDetail.ReplyTime}}--{{LoanBackDetail.EndDate}}</span>
							</el-col>
						</el-row>
					</el-card>
				</el-col>
				<el-col class="item-card" :span="12" style="padding-left:3px;">
					<el-card :body-style="{ 'padding-left': '0px' }" style=" height:308px;box-shadow:none;border: 1px solid #EAEAEA;padding-left:20px; padding-right:20px; ">
						<div slot="header" class="clearfix" style="color:#101010;">
							<span class="header-left">待还金额</span>
							<span class="header-right">
              	<span class="time">{{LoanBackDetail.NoReturnMoney}}</span>
								<span>元</span>
							</span>
						</div>
						<el-row :span="24" class="list">
							<el-col class="list-item2">
								<span class="title">借款金额</span>
								<span class="value">{{LoanBackDetail.Money}}</span>
							</el-col>
							<el-col class="list-item2">
								<span class="title">利息</span>
								<span class="value">{{LoanBackDetail.TaxAmount}}</span>
							</el-col>
							<el-col class="list-item2">
								<span class="title">违约金</span>
								<span class="value">{{LoanBackDetail.OverdueBreachOfAmount}}</span>
							</el-col>
							<el-col class="list-item2" style="padding-bottom:10px;">
								<span class="title">滞纳金</span>
								<span class="value">{{LoanBackDetail.OverdueMoneyAmount}}</span>
							</el-col>
							<el-col class="list-item2" style="padding-top:10px; border-top:1px solid #ebeef5;">
								<span class="title">已还金额</span>
								<span class="value">{{LoanBackDetail.ReturnMoney}}</span>
							</el-col>
							<el-col class="list-item2" style="padding-top:10px;">
								<el-button type="primary" style="width:147px;height:37px;line-height:37px;padding:0;" :disabled="LoanBackDetail.State !='未还'" @click="handleClick(LoanBackDetail)">还款录入</el-button>
							</el-col>
						</el-row>
					</el-card>
				</el-col>
			</el-row>
		</el-card>
		<!-- 添加弹框 -->
		<el-dialog title="添加" :visible.sync="showDialog_add" @open="resetForm('addForm')" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="600px">
			<el-form :model="addForm" label-width="100px" ref="addForm" :rules="rules">
				<el-form-item label="还款金额" prop="ReturnMoney">
					<el-input type="number" v-model.number="addForm.ReturnMoney" placeholder="请输入不超过待还金额" :min="0" :max="LoanBackDetail.NoReturnMoney" auto-complete="off" style="width:250px;"></el-input>
					<el-popover placement="right" title="" width="360" trigger="hover">
						<p>&nbsp;还款抵扣顺序：本金 - 利息 - 滞纳金 - 逾期费</p>
						<br />
						<p>&nbsp;费用减免抵扣顺序：逾期费 - 滞纳金 - 利息 - 本金</p>
						<el-button icon="el-icon-info" circle slot="reference" style="border:none;"></el-button>
					</el-popover>
				</el-form-item>
				<el-form-item label="还款方式" prop="Channel">
					<el-select v-model.number="addForm.Channel" placeholder="请选择" style="width:250px;">
						<el-option label="代扣" :value="3"></el-option>
						<el-option label="支付宝转账" :value="5"></el-option>
						<el-option label="微信转账" :value="4"></el-option>
						<el-option label="转账" :value="6"></el-option>
						<el-option label="费用减免" :value="9"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注" prop="Remark">
					<el-input type="textarea" v-model="addForm.Remark" placeholder="请填写备注——选填" style="width:420px;" rows="3"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" :loading="btnLoading" @click.native="addSubmit('addForm')">确定</el-button>
				<el-button @click.native="showDialog_add=false">取消</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { financemanagedetail, repayment } from "api/api.js";
	export default {
		props: {
			uid: {
				type: String,
				default: {
					type: ""
				}
			}
		},
		data() {
			return {
				btnLoading: false,
				LoanBackDetail: {},
				showDialog_add: false,
				Uid: "",
				addForm: {
					ReturnMoney: null, //还款金额
					Channel: null, //还款方式
					Remark: "", //备注
					RepaymentScheduleId: '',
					Uid: ''
				},
				rules: {
					ReturnMoney: [{
						required: true,
						message: '金额不得为空'
					}],
					Channel: [{
						required: true,
						message: '请选择还款方式'
					}]
				}
			};
		},
		mounted() {
			this.getfinancemanagedetail();
		},
		methods: {
			getfinancemanagedetail() {
				let params = {
					LoanId: parseInt(this.uid)
				};
				financemanagedetail(params).then(res => {
					if(res.Ret === 200) {
						this.LoanBackDetail = res.LoanBackDetail;
					}
				});
			},
			handleClick(row) {
				console.log(row);
				this.addForm.RepaymentScheduleId = row.RepaymentScheduleId;
				this.addForm.Uid = row.Uid;
				this.showDialog_add = true;
			},
			addSubmit(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.setrepayment()
					}
				});
			},
			setrepayment() {
				let params = this.addForm;
				this.btnLoading = true;
				repayment(params).then(res => {
					this.btnLoading = false;
					if(res.Ret == 200) {
						this.$message.success(res.Msg);
						this.showDialog_add = false;
						this.$emit('dispalyBtn');
					} else {
						this.$message.error(res.Msg);
					}
				})
			},
			resetForm(formName) {
				//重置表单
				this.$nextTick(function() {
					this.$refs[formName].resetFields();
				});
			}
		}
	};
</script>

<style scoped lang="scss">
	#retundtl {
		.item-card {
			box-sizing: border-box;
			.clearfix {
				box-sizing: border-box;
				height: 36px;
				padding-top: 10px;
				line-height: 38px;
				font-size: 14px;
				.header-left {
					float: left;
					color: #84909d;
				}
				.header-right {
					float: right;
					color: #3a94f8;
					.time {
						font-size: 24px;
					}
				}
			}
			.list {
				text-align: right;
				color: #84909d;
				font-size: 12px;
				.list-item {
					span {
						display: inline-block;
						height: 25px;
						line-height: 25px;
					}
					.value {
						width: 150px;
					}
				}
				.list-item2 {
					span {
						display: inline-block;
						height: 25px;
						line-height: 25px;
					}
					.value {
						min-width: 100px;
					}
				}
			}
		}
	}
</style>