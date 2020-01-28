<template>
    <section>
        <el-col class="title" :span="24">风控建议</el-col>
        <el-row class="sub-title">
            <el-col class="title-item" :span="12">检查规则</el-col>
            <el-col class="title-item" :span="12">检查提示</el-col>
        </el-row>
        <el-collapse id="datacollapse" v-if="isshow">
            <el-collapse-item>
                <div  class="collapse-title" slot="title">
                    <div class="collapse-title-left">个人资质信息情况</div>
                    <div class="collapse-title-right" v-if="userInfo.base_info.advice"><i class="header-icon el-icon-warning"></i><span style="margin-left:10px;">{{userInfo.base_info.advice}}</span></div>
                </div >
                <div class="collapse-main">
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">姓名</el-col><el-col :span="10">{{disData(userInfo.base_info.name)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">姓名是否与运营商数据匹配</el-col><el-col :span="10">{{disData(userInfo.base_info.name_match_mobile_operator)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">性别</el-col><el-col :span="10">{{disData(userInfo.base_info.id_gender)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">借贷app安装数量</el-col><el-col :span="10">{{disData(userInfo.base_info.app_instalment_count)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">年龄</el-col><el-col :span="10">{{disData(userInfo.base_info.id_birth)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">用户关联银行卡数</el-col><el-col :span="10">{{disData(userInfo.base_info.bankcard_count)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">婚姻状态</el-col><el-col :span="10">{{disData(userInfo.base_info.marriage)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">用户使用手机号数</el-col><el-col :span="10">{{disData(userInfo.base_info.mobile_count)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">学历层次</el-col><el-col :span="10">{{disData(userInfo.base_info.education)}}</el-col></el-col>
                    <!--<el-col class="main-item" :span="12"><el-col class="main-title" :span="14">芝麻分</el-col><el-col :span="10">{{disData(userInfo.base_info.zm_score)}}</el-col></el-col>-->
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">机构分</el-col><el-col :span="10">{{disData(userInfo.base_info.zm_score)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">身份证号码是否与运营商匹配</el-col><el-col :span="10">{{disData(userInfo.base_info.idcard_match_mobile_operator)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">风险等级</el-col><el-col :span="10">{{disData(userInfo.base_info.risk_evaluation)}}</el-col></el-col> 
                </div>
            </el-collapse-item>
            <el-collapse-item>
                <div class="collapse-title" slot="title">
                    <div class="collapse-title-left">黑名单验证</div>
                    <div class="collapse-title-right" v-if="userInfo.black_info.advice"><i class="header-icon el-icon-warning"></i><span style="margin-left:10px;">{{userInfo.black_info.advice}}</span></div>
                </div>
                <div class="collapse-main">
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">手机号黑名单</el-col><el-col :span="10">{{disData(userInfo.black_info.black_phone)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">身份证黑名单</el-col><el-col :span="10">{{disData(userInfo.black_info.black_id_card)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">逾期黑名单</el-col><el-col :span="10">{{disData(userInfo.black_info.black_overdue)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">户籍黑名单</el-col><el-col :span="10">{{disData(userInfo.black_info.black_region)}}</el-col></el-col> 
                </div>
            </el-collapse-item>
            <el-collapse-item>
                <div class="collapse-title" slot="title">
                    <div class="collapse-title-left">设备风险评估</div>
                    <div class="collapse-title-right" v-if="userInfo.device_risk.advice"><i class="header-icon el-icon-warning"></i><span style="margin-left:10px;">{{userInfo.device_risk.advice}}</span></div>
                </div>
                <div class="collapse-main">
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">用户关联设备数</el-col><el-col :span="10">{{disData(userInfo.device_risk.id_link_device_count)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">设备关联用户数</el-col><el-col :span="10">{{disData(userInfo.device_risk.device_link_id_count)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">活体攻击</el-col><el-col :span="10">{{disData(userInfo.device_risk.living_attack)==1?'命中':'未命中'}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">作弊软件</el-col><el-col :span="10">{{disData(userInfo.device_risk.cheats_device)>0?'命中':'未命中'}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">设备欺诈风险极高</el-col><el-col :span="10">{{disData(userInfo.device_risk.bqs_flow_control_loan)}}</el-col></el-col> 
                </div>
            </el-collapse-item>
            <el-collapse-item>
                <div class="collapse-title" slot="title">
                    <div class="collapse-title-left">信用风险评估</div>
                    <div class="collapse-title-right" v-if="userInfo.credit_risk.advice"><i class="header-icon el-icon-warning"></i><span style="margin-left:10px;">{{userInfo.credit_risk.advice}}</span></div>
                </div>
                <div class="collapse-main">
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">法院失信</el-col><el-col :span="10">{{disData(userInfo.credit_risk.court_dishonesty)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">恶意贷款风险</el-col><el-col :span="10">{{disData(userInfo.credit_risk.bqs_malicious_loan_loan)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">设备关联异常</el-col><el-col :span="10">{{disData(userInfo.credit_risk.device_link_exception)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">身份信息疑似泄漏</el-col><el-col :span="10">{{disData(userInfo.credit_risk.identity_leakage)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">疑似团伙欺诈</el-col><el-col :span="10">{{disData(userInfo.credit_risk.gang_fraud)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">活体风险异常</el-col><el-col :span="10">{{disData(userInfo.credit_risk.living_attack)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">网贷失信</el-col><el-col :span="10">{{disData(userInfo.credit_risk.loan_dishonesty)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">短时逾期</el-col><el-col :span="10">{{disData(userInfo.credit_risk.short_overdue)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">网贷不良</el-col><el-col :span="10">{{disData(userInfo.credit_risk.loan_bad)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">失信风险极高</el-col><el-col :span="10">{{disData(userInfo.credit_risk.bqs_lose_credit_loan)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">异常贷款</el-col><el-col :span="10">{{disData(userInfo.credit_risk.bqs_abnormal_loan_loan)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">多头风险极高</el-col><el-col :span="10">{{disData(userInfo.credit_risk.bqs_platform_risk_loan)}}</el-col></el-col> 
                </div>
            </el-collapse-item>
            <el-collapse-item>
                <div class="collapse-title" slot="title">
                    <div class="collapse-title-left">近1月多头借贷和逾期情况</div>
                    <div class="collapse-title-right" v-if="userInfo.one_month_loan_info.advice"><i class="header-icon el-icon-warning"></i><span style="margin-left:10px;">{{userInfo.one_month_loan_info.advice}}</span></div>
                </div>
                <div class="collapse-main">
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">近1月申请借款平台数（A机构）</el-col><el-col :span="10">{{disData(userInfo.one_month_loan_info.loan_platform_count_1m)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">近1月实际借款平台数（A机构）</el-col><el-col :span="10">{{disData(userInfo.one_month_loan_info.actual_loan_platform_count_1m)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">近1月还款平台数（A机构）</el-col><el-col :span="10">{{disData(userInfo.one_month_loan_info.repayment_platform_count_1m)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">在现金类型网贷中最近1个月发生逾期的平台数（B机构）</el-col><el-col :span="10">{{disData(userInfo.one_month_loan_info.loan_overdue_cash_30d_plts)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">在消费类型网贷中最近1个月发生逾期的平台数（B机构）</el-col><el-col :span="10">{{disData(userInfo.one_month_loan_info.loan_overdue_consumption_30d_plts)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">在小额短期贷类型网贷中最近1个月发生逾期的平台数（B机构）</el-col><el-col :span="10">{{disData(userInfo.one_month_loan_info.loan_overdue_payday_30d_plts)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">近1个月在所有类型平台中发生逾期的平台数（B机构）</el-col><el-col :span="10">{{disData(userInfo.one_month_loan_info.loan_overdue_itfin_30d_plts)}}</el-col></el-col> 
                </div>
            </el-collapse-item>
            <el-collapse-item>
                <div class="collapse-title" slot="title">
                    <div class="collapse-title-left">近3月多头借贷情况</div>
                    <div class="collapse-title-right" v-if="userInfo.three_month_loan_info.advice"><i class="header-icon el-icon-warning"></i><span style="margin-left:10px;">{{userInfo.three_month_loan_info.advice}}</span></div>
                </div>
                <div class="collapse-main">
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">近3月申请借款平台数（A机构）</el-col><el-col :span="10">{{disData(userInfo.three_month_loan_info.loan_platform_count_3m)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">近3月实际借款平台数（A机构）</el-col><el-col :span="10">{{disData(userInfo.three_month_loan_info.actual_loan_platform_count_3m)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">近3月还款平台数（A机构）</el-col><el-col :span="10">{{disData(userInfo.three_month_loan_info.repayment_platform_count_3m)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">在现金类型网贷中最近3个月发生逾期的平台数（B机构）</el-col><el-col :span="10">{{disData(userInfo.three_month_loan_info.loan_overdue_cash_90d_plts)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">在消费类型网贷中最近3个月发生逾期的平台数（B机构）</el-col><el-col :span="10">{{disData(userInfo.three_month_loan_info.loan_overdue_consumption_90d_plts)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">在小额短期贷类型网贷中最近3个月发生逾期的平台数（B机构）</el-col><el-col :span="10">{{disData(userInfo.three_month_loan_info.loan_overdue_payday_90d_plts)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">近3个月在所有类型平台中发生逾期的平台数（B机构）</el-col><el-col :span="10">{{disData(userInfo.three_month_loan_info.loan_overdue_itfin_90d_plts)}}</el-col></el-col> 
                </div>
            </el-collapse-item>
            <el-collapse-item>
                <div class="collapse-title" slot="title">
                    <div class="collapse-title-left">近6月多头借贷情况</div>
                    <div class="collapse-title-right" v-if="userInfo.six_month_loan_info.advice"><i class="header-icon el-icon-warning"></i><span style="margin-left:10px;">{{userInfo.six_month_loan_info.advice}}</span></div>
                </div>
                <div class="collapse-main">
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">近6月申请借款平台数（A机构）</el-col><el-col :span="10">{{disData(userInfo.six_month_loan_info.loan_platform_count_6m)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">近6月实际借款平台数（A机构）</el-col><el-col :span="10">{{disData(userInfo.six_month_loan_info.actual_loan_platform_count_6m)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">近6月还款平台数（A机构）</el-col><el-col :span="10">{{disData(userInfo.six_month_loan_info.repayment_platform_count_6m)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">在现金类型网贷中最近6个月发生逾期的平台数（B机构）</el-col><el-col :span="10">{{disData(userInfo.six_month_loan_info.loan_overdue_cash_180d_plts)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">在消费类型网贷中最近6个月发生逾期的平台数（B机构）</el-col><el-col :span="10">{{disData(userInfo.six_month_loan_info.loan_overdue_consumption_180d_plts)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">在小额短期贷类型网贷中最近6个月发生逾期的平台数（B机构）</el-col><el-col :span="10">{{disData(userInfo.six_month_loan_info.loan_overdue_payday_180d_plts)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">近6个月在所有类型平台中发生逾期的平台数（B机构）</el-col><el-col :span="10">{{disData(userInfo.six_month_loan_info.loan_overdue_itfin_180d_plts)}}</el-col></el-col> 
                </div>
            </el-collapse-item>
            <el-collapse-item>
                <div class="collapse-title" slot="title">
                    <div class="collapse-title-left">历史借贷和还款情况</div>
                    <div class="collapse-title-right" v-if="userInfo.history_loan_repayment.advice"><i class="header-icon el-icon-warning"></i><span style="margin-left:10px;">{{userInfo.history_loan_repayment.advice}}</span></div>
                </div>
                <div class="collapse-main">
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">申请借款平台数（A机构）</el-col><el-col :span="10">{{disData(userInfo.history_loan_repayment.loan_platform_count)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">实际借款平台数（A机构）</el-col><el-col :span="10">{{disData(userInfo.history_loan_repayment.actual_loan_platform_count)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">还款平台数（A机构）</el-col><el-col :span="10">{{disData(userInfo.history_loan_repayment.repayment_platform_count)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">借还款平台差</el-col><el-col :span="10">{{disData(userInfo.history_loan_repayment.loan_repayment_count)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">申请还款平台差</el-col><el-col :span="10">{{disData(userInfo.history_loan_repayment.application_repayment_count)}}</el-col></el-col> 
                </div>
            </el-collapse-item>
            <el-collapse-item>
                <div class="collapse-title" slot="title">
                    <div class="collapse-title-left">失联风险评估</div>
                    <div class="collapse-title-right" v-if="userInfo.loss_risk.advice"><i class="header-icon el-icon-warning"></i><span style="margin-left:10px;">{{userInfo.loss_risk.advice}}</span></div>
                </div>
                <div class="collapse-main">
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">入网时长</el-col><el-col :span="10">{{disData(userInfo.loss_risk.the_net_time,2)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">用户通话地个数</el-col><el-col :span="10">{{disData(userInfo.loss_risk.common_call_place_count,2)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">用户及联系人号码归属地个数</el-col><el-col :span="10">{{disData(userInfo.loss_risk.phone_belong_to_count1,2)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">近6月月均静默天数</el-col><el-col :span="10">{{disData(userInfo.loss_risk.six_months_silent_days,2)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">近6月月均短信数</el-col><el-col :span="10">{{disData(userInfo.loss_risk.six_months_average_sms,2)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">近6月最长连续静默天数</el-col><el-col :span="10">{{disData(userInfo.loss_risk.six_months_large_silence_days,2)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">近6月互通电话的号码数目</el-col><el-col :span="10">{{disData(userInfo.loss_risk.six_months_inter_communication_phones,2)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">近6月互通电话的号码数目占比</el-col><el-col :span="10">{{disData(userInfo.loss_risk.six_months_inter_communication_phones_proportion,1)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">近6月深夜通话时长占比</el-col><el-col :span="10">{{disData(userInfo.loss_risk.late_night_call_times_rate_6m,1)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">通讯录号码半年内有通话数</el-col><el-col :span="10">{{disData(userInfo.loss_risk.users_telephone_directory_call_num,2)}}</el-col></el-col>
                    <!--<el-col class="main-item" :span="12"><el-col class="main-title" :span="14">通讯录号码半年内有通话数占比</el-col><el-col :span="10">{{disData(userInfo.loss_risk.proportion_of_users_telephone_directory_call_and_called_num,1)}}</el-col></el-col>-->
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">通讯录中有效联系人数</el-col><el-col :span="10">{{disData(userInfo.loss_risk.users_telephone_directory_true_num,2)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">通讯录中无效联系号码数占比</el-col><el-col :span="10">{{disData(userInfo.loss_risk.proportion_of_false_number_in_telephone_directory,1)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">通讯录号码半年内有互通号码数</el-col><el-col :span="10">{{disData(userInfo.loss_risk.users_telephone_directory_call_and_called_num,2)}}</el-col></el-col>
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">通讯录号码半年内有互通号码数占比</el-col><el-col :span="10">{{disData(userInfo.loss_risk.proportion_of_users_telephone_directory_call_and_called_num,1)}}</el-col></el-col> 
                    <el-col class="main-item" :span="12"><el-col class="main-title" :span="14">紧急联系人为互通联系人数</el-col><el-col :span="10">{{disData(userInfo.loss_risk.users_linkman_call_and_called_num,2)}}</el-col></el-col> 
                </div>
            </el-collapse-item>
        </el-collapse>
    </section>    
</template>

<script>
	import {fkadvicedtl} from 'api/api.js';
	export default {
		props:{
      		uid:{
        		type:String,
        		default:{type:''}
      		}
    	},
		data() {
			return {
				isshow:false,
				userInfo:{}
			}
		},
		mounted() {
			this.getfkadvicedtl();
		},
		methods: {
			getfkadvicedtl(){ 
				fkadvicedtl({Uid:parseInt(this.uid)}).then((res) => {
					console.log(res);
					this.isshow=false;
					if( res.Ret==200 ){
						this.userInfo=res.Result;
						this.isshow=true;
						this.$emit('getReason',res.Reason);
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