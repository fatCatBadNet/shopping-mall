<template>
	<div v-if="isshow" style="margin:0 auto;">
		<div id="header">
			<h1 style="font:26px/60px '楷体'; text-align:center;">运营商报告</h1>
		</div>
		<h1 class="th1">用户申请表监测</h1>
		<div style="font:15px/40px '微软雅黑'; padding:10px 20px; box-sizing:border-box; background:#f9f9f9; border:1px solid #eaeaea; overflow:hidden;">
			<el-col :span="8" v-for="(item,index) in applyList" :key="index">
				<label class="tlabel">{{item.key}}:</label>
				<span class="tspan">{{item.value}}</span>
			</el-col>
		</div>
		<h1 class="th1">基本信息</h1>
		<div class="contentsty">
			<div style="border-bottom:1px solid #ccc; overflow:hidden;">
				<el-col :span="6" class="tlabel">检查项目</el-col>
				<el-col :span="6" class="tlabel">检查结果</el-col>
				<el-col :span="12" class="tlabel">备注</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">手机号码</el-col>
				<el-col :span="6">{{info.Basic.Phone}}</el-col>
				<el-col :span="12" class="tlabel">用户认证通过的手机号码</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">互联网标识</el-col>
				<el-col :span="6">{{info.Basic.PhoneInfo==''?'-':info.Basic.PhoneInfo}}</el-col>
				<el-col :span="12" class="tlabel">网络标识</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">号码运营商</el-col>
				<el-col :span="6">{{info.Basic.OperatorZh}}</el-col>
				<el-col :span="12" class="tlabel">号码所属运营商</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">号码归属地</el-col>
				<el-col :span="6">{{info.Basic.PhoneLocation}}</el-col>
				<el-col :span="12" class="tlabel">号码归属地</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">注册时间</el-col>
				<el-col :span="6">{{info.Basic.RegTime}}</el-col>
				<el-col :span="12" class="tlabel">号码注册时间</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">真实姓名</el-col>
				<el-col :span="6">
					{{info.Basic.OperatorName==''?'-':info.Basic.OperatorName}}
					<span v-if="NameSameRst=='完全一致'||NameSameRst=='基本一致'" style="font:10px '微软雅黑'; padding:2px 4px; background:green; color:#fff; margin-left:10px; border-radius:4px;">{{NameSameRst}}</span>
					<span v-else style="font:10px '微软雅黑'; padding:2px 4px; background:red; color:#fff; margin-left:10px; border-radius:4px;">{{NameSameRst}}</span>
				</el-col>
				<el-col :span="12" class="tlabel">用户输入姓名与运营商认证姓名完全一致或不一致</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">身份证号</el-col>
				<el-col :span="6">
					{{info.Basic.OperatorIdCard==''?'-':info.Basic.OperatorIdCard}}
					<span v-if="IdCardSameRst=='完全一致'||IdCardSameRst=='基本一致'" style="font:10px '微软雅黑'; padding:2px 4px; background:green; color:#fff; margin-left:10px; border-radius:4px;">{{IdCardSameRst}}</span>
					<span v-else style="font:10px '微软雅黑'; padding:2px 4px; background:red; color:#fff; margin-left:10px; border-radius:4px;">{{IdCardSameRst}}</span>
				</el-col>
				<el-col :span="12" class="tlabel">{{IdCardSameRst=='无法匹配'?'缺少用户输入信息，或运营商数据缺失，或运营商数据全为掩码':'用户输入身份证与运营商认证'+IdCardSameRst}}</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">当前余额</el-col>
				<el-col :span="6">{{info.Basic.CurBalance}}</el-col>
				<el-col :span="12" class="tlabel">运营商当前用户余额</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">每月平均消费</el-col>
				<el-col :span="6">{{info.Basic.MonthlyAvgConsumption}}</el-col>
				<el-col :span="12" class="tlabel">运营商月消费</el-col>
			</div>
			<div v-for="(item,index) in info.Basic.IfContactEmergency" :key="index" style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">是否联系过紧急联系人{{item.No}}</el-col>
				<el-col :span="6">{{(item.If_tel==0&&item.If_msg==0)?'否':'是'}}</el-col>
				<el-col :span="12" class="tlabel">{{item.If_tel==0?'无':'有'}}通话记录，{{item.If_msg==0?'无':'有'}}短信记录</el-col>
			</div>
		</div>
		<h1 class="th1">风险监测</h1>
		<div class="contentsty">
			<div style="border-bottom:1px solid #ccc; overflow:hidden;">
				<el-col :span="6" class="tlabel">检查项目</el-col>
				<el-col :span="6" class="tlabel">检查结果</el-col>
				<el-col :span="12" class="tlabel">备注</el-col>
			</div>
			<div v-for="(item,index) in info.Risk.Contacts" :key="index" style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">{{item.Ctype==1?'有主叫的联系人':item.Ctype==2?'有被叫的联系人':item.Ctype==3?'互通联系人':''}}号码命中逾期情况</el-col>
				<el-col :span="6">{{item.HitCnt}}个</el-col>
				<el-col :span="12" class="tlabel">{{item.Ctype==1?'本人拨打的号码中，命中信贷逾期的情况':item.Ctype==2?'本人接听的号码中，命中信贷逾期的情况':item.Ctype==3?'与本人相互拨打过的号码中，命中信贷逾期的情况':''}}</el-col>
			</div>
			<div v-for="(item,index) in info.Risk.Single" :key="index" style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">{{item.No==0?'本人':'紧急联系人'+item.No}}号码命中逾期情况</el-col>
				<el-col :span="6">{{item.HitCnt}}个</el-col>
				<el-col :span="12" class="tlabel">{{item.No==0?'本人号码命中逾期情况':'紧急联系人'+item.No+'号码命中逾期次数'}}</el-col>
			</div>
		</div>
		<h1 class="th1">用户画像</h1>
		<!-- <div class="contentsty">
			<div style="border-bottom:1px solid #ccc; overflow:hidden;">
				<el-col :span="6" class="tlabel">检查项目</el-col>
				<el-col :span="6" class="tlabel">检查结果</el-col>
				<el-col :span="12" class="tlabel">备注</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">朋友圈在哪儿</el-col>
				<el-col :span="6">{{info.UserPortrait.ContactsDistribution.Area}}</el-col>
				<el-col :span="12" class="tlabel">{{info.UserPortrait.ContactsDistribution.Area}}地区联系人占比{{info.UserPortrait.ContactsDistribution.Ratio*100}}%</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden; padding:10px 0;">
				<el-col :span="6">号码静默情况</el-col>
				<el-col :span="6" style="line-height:20px;">最长静默天数:{{info.UserPortrait.SilentDays.MaxInterval}}<br/><span v-if="info.UserPortrait.SilentDays.MaxInterval>0">({{info.UserPortrait.SilentDays.MaxDetail[0]}})</span><br/>月平均静默天数:{{info.UserPortrait.SilentDays.MonthlyAvgDays}}</el-col>
				<el-col :span="12" class="tlabel">无通话记录和短信记录则视为静默</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden; padding:10px 0;">
				<el-col :span="6">夜间活动情况</el-col>
				<el-col :span="6" style="line-height:20px;">月平均时长:{{info.UserPortrait.NightActivities.MonthlyAvgSeconds}}分钟<br/>月平均占比:{{info.UserPortrait.NightActivities.MonthlyAvgSecondsRatio*100}}%</el-col>
				<el-col :span="12" class="tlabel">夜间通话时长占全天比例（23点-6点）</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">互通电话的号码数量</el-col>
				<el-col :span="6">{{info.UserPortrait.BothCallCnt}}</el-col>
				<el-col :span="12" class="tlabel">相互拨打过的号码数量</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">110号码通话情况</el-col>
				<el-col :span="6">{{info.SpecialCate[0].CallCnt + info.SpecialCate[0].CalledCnt}}次</el-col>
				<el-col :span="12" class="tlabel">与110号码主叫{{info.SpecialCate[0].CallCnt}}次，时长{{(info.SpecialCate[0].CallSeconds/60).toFixed(2)}}分，被叫{{info.SpecialCate[0].CalledCnt}}次，时长{{(info.SpecialCate[0].CalledSeconds/60).toFixed(2)}}分，短信{{info.SpecialCate[0].MsgCnt}}条</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">120号码通话情况</el-col>
				<el-col :span="6">{{info.SpecialCate[1].CallCnt + info.SpecialCate[1].CalledCnt }}次</el-col>
				<el-col :span="12" class="tlabel">与120号码主叫{{info.SpecialCate[1].CallCnt}}次，时长{{(info.SpecialCate[1].CallSeconds/60).toFixed(2)}}分，被叫{{info.SpecialCate[1].CalledCnt}}次，时长{{(info.SpecialCate[1].CalledSeconds/60).toFixed(2)}}分，短信{{info.SpecialCate[1].MsgCnt}}条</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">贷款类号码通话情况</el-col>
				<el-col :span="6">{{info.SpecialCate[2].CallCnt + info.SpecialCate[2].CalledCnt }}次</el-col>
				<el-col :span="12" class="tlabel">与贷款类号码主叫{{info.SpecialCate[2].CallCnt}}次，时长{{(info.SpecialCate[2].CallSeconds/60).toFixed(2)}}分，被叫{{info.SpecialCate[2].CalledCnt}}次，时长{{(info.SpecialCate[2].CalledSeconds/60).toFixed(2)}}分，短信{{info.SpecialCate[2].MsgCnt}}条</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">互金公司号码通话情况</el-col>
				<el-col :span="6">{{info.SpecialCate[3].CallCnt + info.SpecialCate[3].CalledCnt}}次</el-col>
				<el-col :span="12" class="tlabel">与互金公司号码主叫{{info.SpecialCate[3].CallCnt}}次，时长{{(info.SpecialCate[3].CallSeconds/60).toFixed(2)}}分，被叫{{info.SpecialCate[3].CalledCnt}}次，时长{{(info.SpecialCate[3].CalledSeconds/60).toFixed(2)}}分，短信{{info.SpecialCate[3].MsgCnt}}条</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">其他公司类号码通话情况</el-col>
				<el-col :span="6">{{info.SpecialCate[4].CallCnt + info.SpecialCate[4].CalledCnt}}次</el-col>
				<el-col :span="12" class="tlabel">		
					<p style="line-height:2;" v-for="(item,index) in info.SpecialCate[4].PhoneDetail" :key="index">
						{{item.Phone}},{{item.PhoneInfo}}，主叫{{item.CallCnt}}次，时长{{(item.CallSeconds/60).toFixed(2)}}分，被叫{{item.CalledCnt}}次，时长{{(item.CalledSeconds/60).toFixed(2)}}分，短信发送{{item.SendCnt}}条，短信接收{{item.ReceiveCnt}}条
					</p>
				</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">金融类号码通话情况</el-col>
				<el-col :span="6">{{info.SpecialCate[5].CallCnt + info.SpecialCate[5].CalledCnt}}次</el-col>
				<el-col :span="12" class="tlabel">与金融类号码主叫{{info.SpecialCate[5].CallCnt}}次，时长{{(info.SpecialCate[5].CallSeconds/60).toFixed(2)}}分，被叫{{info.SpecialCate[5].CalledCnt}}次，时长{{(info.SpecialCate[5].CalledSeconds/60).toFixed(2)}}分，短信{{info.SpecialCate[5].MsgCnt}}条</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">快递送餐号码通话情况</el-col>
				<el-col :span="6">{{info.SpecialCate[6].CallCnt + info.SpecialCate[6].CalledCnt}}次</el-col>
				<el-col :span="12" class="tlabel">		
					<p style="line-height: 2;" v-for="(item,index) in info.SpecialCate[6].PhoneDetail" :key="index">
						{{item.Phone}}，{{item.PhoneInfo}}，主叫{{item.CallCnt}}次，时长{{(item.CallSeconds/60).toFixed(2)}}分，被叫{{item.CalledCnt}}次，时长{{(item.CalledSeconds/60).toFixed(2)}}分，短信发送{{item.SendCnt}}条，短信接收{{item.ReceiveCnt}}条
					</p>
				</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">日常生活号码通话情况</el-col>
				<el-col :span="6">{{info.SpecialCate[7].CallCnt + info.SpecialCate[7].CalledCnt}}次</el-col>
				<el-col :span="12" class="tlabel">		
					<p style="line-height: 2;" v-for="(item,index) in info.SpecialCate[7].PhoneDetail" :key="index">
						{{item.Phone}}，
						{{item.PhoneInfo}}，
						主叫{{item.CallCnt}}次，
						时长{{(item.CallSeconds/60).toFixed(2)}}分，
						被叫{{item.CalledCnt}}次，
						时长{{(item.CalledSeconds/60).toFixed(2)}}分，
						短信发送{{item.SendCnt}}条，
						短信接收{{item.ReceiveCnt}}条
					</p>
				</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">网络标识号码通话情况</el-col>
				<el-col :span="6">{{info.SpecialCate[8].CallCnt + info.SpecialCate[8].CalledCnt}}次</el-col>
				<el-col :span="12" class="tlabel">		
					<p style="line-height: 2;" v-for="(item,index) in info.SpecialCate[8].PhoneDetail" :key="index">
						{{item.Phone}},
						{{item.PhoneInfo}},
						主叫{{item.CallCnt}}次，
						时长{{(item.CallSeconds/60).toFixed(2)}}分，
						被叫{{item.CalledCnt}}次，
						时长{{(item.CalledSeconds/60).toFixed(2)}}分，
						短信发送{{item.SendCnt}}条,
						短信接收{{item.ReceiveCnt}}条
					</p>
				</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">信用卡号码通话情况</el-col>
				<el-col :span="6">{{info.SpecialCate[9].CallCnt + info.SpecialCate[9].CalledCnt}}次</el-col>
				<el-col :span="12" class="tlabel">与信用卡号码主叫{{info.SpecialCate[9].CallCnt}}次，时长{{(info.SpecialCate[9].CallSeconds/60).toFixed(2)}}分，被叫{{info.SpecialCate[9].CalledCnt}}次，时长{{(info.SpecialCate[9].CalledSeconds/60).toFixed(2)}}分，短信{{info.SpecialCate[9].MsgCnt}}条</el-col>
			</div>
			<div style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6">银行号码通话情况</el-col>
				<el-col :span="6">{{info.SpecialCate[10].CallCnt + info.SpecialCate[10].CalledCnt}}次</el-col>
				<el-col :span="12" class="tlabel">		
					<p style="line-height: 2;" v-for="(item,index) in info.SpecialCate[10].PhoneDetail" :key="index">
						{{item.Phone}},
						{{item.PhoneInfo}},
						主叫{{item.CallCnt}}次，
						时长{{(item.CallSeconds/60).toFixed(2)}}分，
						被叫{{item.CalledCnt}}次，
						时长{{(item.CalledSeconds/60).toFixed(2)}}分，
						短信发送{{item.SendCnt}}条,
						短信接收{{item.ReceiveCnt}}条
					</p>
				</el-col>
			</div>
		</div> -->
		<h1 class="th1">紧急联系人分析</h1>
		<div class="contentsty">
			<div style="border-bottom:1px solid #ccc; overflow:hidden;">
				<el-col :span="3" class="tlabel">联系人姓名</el-col>
				<el-col :span="5" class="tlabel">最后联系时间</el-col>
				<el-col :span="6" class="tlabel">最近半年通话记录</el-col>
				<el-col :span="2" class="tlabel">网络标识</el-col>
				<el-col :span="8" class="tlabel">其他</el-col>
			</div>
			<div v-for="(item,index) in info.Emergency" :key="index" style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="3">*{{item.Name}}</el-col>
				<el-col :span="5" > {{item.LastContactDate=="" ? '-' : item.LastContactDate}}</el-col>
				<el-col :span="6" >通话 {{item.TalkSeconds =="" ? '-' : (item.TalkSeconds/60).toFixed(2)}} 分</el-col>
				<el-col :span="2" >{{item.PhoneInfo==""?'-':item.PhoneInfo}}</el-col>
				<el-col :span="8" class="tlabel">主叫：{{item.CallCnt}}次，被叫：{{item.CalledCnt}}次， 短信：{{item.SendCnt}}条</el-col>
			</div>
		</div>
		<h1 class="th1">联系人所在地区</h1>
		<div class="contentsty">
			<div style="border-bottom:1px solid #ccc; overflow:hidden;">
				<el-col :span="3" class="tlabel">地区</el-col>
				<el-col :span="3" class="tlabel">联系人数量</el-col>
				<el-col :span="3" class="tlabel">联系人占比</el-col>
				<el-col :span="3" class="tlabel">通话总时长/分</el-col>
				<el-col :span="3" class="tlabel">主叫次数</el-col>
				<el-col :span="3" class="tlabel">主叫时长/分</el-col>
				<el-col :span="3" class="tlabel">被叫次数</el-col>
				<el-col :span="3" class="tlabel">被叫时长/分</el-col>
			</div>
			<div v-for="(item,index) in info.ContactArea" :key="index" style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="3" class="tlabel">{{item.Area}}</el-col>
				<el-col :span="3" class="tlabel">{{item.Contact_phone_cnt}}</el-col>
				<el-col :span="3" class="tlabel">{{(item.Contact_phone_cnt/AreaContactsSum*100).toFixed(2)}}%</el-col>
				<el-col :span="3" class="tlabel">{{(item.Talk_seconds/60).toFixed(2)}}</el-col>
				<el-col :span="3" class="tlabel">{{item.Call_cnt}}</el-col>
				<el-col :span="3" class="tlabel">{{(item.Call_seconds/60).toFixed(2)}}</el-col>
				<el-col :span="3" class="tlabel">{{item.Called_cnt}}</el-col>
				<el-col :span="3" class="tlabel">{{(item.Called_seconds/60).toFixed(2)}}</el-col>
			</div>
		</div>
		<h1 class="th1">运营商月消费</h1>
		<div class="contentsty">
			<div style="border-bottom:1px solid #ccc; overflow:hidden;">
				<el-col :span="6" class="tlabel">月份</el-col>
				<el-col :span="6" class="tlabel">主叫时长/分</el-col>
				<el-col :span="6" class="tlabel">被叫时长/分</el-col>
				<el-col :span="6" class="tlabel">消费金额/元</el-col>
			</div>
			<div v-for="(item,index) in info.MonthlyConsumption" :key="index" style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="6" class="tlabel">{{item.Month}}</el-col>
				<el-col :span="6" class="tlabel">{{(item.CallSeconds/60).toFixed(2)}}</el-col>
				<el-col :span="6" class="tlabel">{{(item.CalledSeconds/60).toFixed(2)}}</el-col>
				<el-col :span="6" class="tlabel">{{item.CallConsumption}}</el-col>
			</div>
		</div>
		<h1 class="th1">通话地区分析</h1>
		<div class="contentsty">
			<div style="border-bottom:1px solid #ccc; overflow:hidden;">
				<el-col :span="4" class="tlabel">通话地区</el-col>
				<el-col :span="4" class="tlabel">通话时长/分</el-col>
				<el-col :span="4" class="tlabel">主叫时长/分</el-col>
				<el-col :span="4" class="tlabel">被叫时长/分</el-col>
				<el-col :span="4" class="tlabel">主叫次数/次</el-col>
				<el-col :span="4" class="tlabel">被叫次数/次</el-col>
			</div>
			<div v-for="(item,index) in info.AreaAnalysis" :key="index" style="border-bottom:1px solid #eee; overflow:hidden;">
				<el-col :span="4" class="tlabel">{{item.Area}}</el-col>
				<el-col :span="4" class="tlabel">{{(item.TalkSeconds/60).toFixed(2)}}</el-col>
				<el-col :span="4" class="tlabel">{{(item.CallSeconds/60).toFixed(2)}}</el-col>
				<el-col :span="4" class="tlabel">{{(item.CalledSeconds/60).toFixed(2)}}</el-col>
				<el-col :span="4" class="tlabel">{{item.CallCnt}}</el-col>
				<el-col :span="4" class="tlabel">{{item.CalledCnt}}</el-col>
			</div>
		</div>
		<h1 class="th1">通讯记录</h1>
		<template>
			<el-table :data="CallLog" v-loading="listLoading" element-loading-text="数据加载中..." border>
				<el-table-column prop="Phone" label="通话号码"></el-table-column>
				<el-table-column label="互联网标识">
					<template slot-scope="scope">
		  	    		<span v-if="scope.row.Phone_info!=''" class="ttag">{{scope.row.Phone_info}}</span>
		  	    		<span v-else>-</span>
					</template>
				</el-table-column>
				<el-table-column label="类别标签">
					<template slot-scope="scope">
		  	    		<span>{{scope.row.Phone_label==''?'-':scope.row.Phone_label}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="Phone_location" label="归属地"></el-table-column>
				<el-table-column label="主叫情况">
					<template slot-scope="scope">
		  	    		{{scope.row.Call_cnt}}次，{{scope.row.Call_seconds==''?'-':(scope.row.Call_seconds/60).toFixed(2)}}分	
					</template>
				</el-table-column>
				<el-table-column label="被叫情况">
					<template slot-scope="scope">
		  	    		{{scope.row.Called_cnt}}次，{{scope.row.Called_seconds==''?'-':(scope.row.Called_seconds/60).toFixed(2)}}分	
					</template>
				</el-table-column>
				<el-table-column label="短信情况">
					<template slot-scope="scope">
		  	    		发送{{scope.row.Send_cnt}}条，接收{{scope.row.Receive_cnt}}条	
					</template>
				</el-table-column>
			</el-table>
			<p v-if="ismore" @click="operatorrptcalllog(1)" id="ismore">查看更多</p>
		</template>
	</div>
</template>

<script>
	import {operatorrpt,operatorrptcalllog,operatormxdata} from 'api/api.js';
	export default {
		props:{
      		uid:{
        		type:String,
        		default:{type:''}
      		}
    	},
		data() {
			return {
                info:{},
                newInfo:{},
				CallLog:[],
				NameSameRst:'',
				IdCardSameRst:'',
				AreaContactsSum:null,
				isshow:false,
				ismore:false,
                listLoading:false,
                applyList:[]
			}
		},
		created() {
            this.getoperatordata();
            this.getOperatormxdata();
			this.operatorrptcalllog(0);
		},
		methods: {
            getOperatormxdata(){
                let params = {Uid:parseInt(this.uid)};
				operatormxdata(params).then((res) => {
					if( res.Ret==200 ){
                        this.newInfo = res.data || {};
						console.log(this.newInfo);
						const applyList = [];
						for(const key in this.newInfo){
							// 用户申请表监测
							if(key === ''){
								applyList.push({
									key:'',
									value:''
								})
							}
						}
                        this.isshow=true;
					}
				});
            },
			getoperatordata(){ //获取手机运营商信息列表
				let params = {Uid:parseInt(this.uid)};
				operatorrpt(params).then((res) => {
					if( res.Ret==200 ){
						this.info = res.Rpt || {};
						this.NameSameRst=res.NameSameRst;
						this.IdCardSameRst=res.IdCardSameRst;
						this.AreaContactsSum=res.AreaContactsSum;
						
					}
				});
			},
			operatorrptcalllog(type){
				this.listLoading = true;
				operatorrptcalllog({Uid:parseInt(this.uid),After100:type}).then((res) => {
//					console.log(res);
					if( res.Ret==200 ){
						if( res.Over100 ){
							this.ismore=true;
						}
						if( type==0 ){
							this.CallLog=res.CallLog || [];
						}else{
							this.CallLog=this.CallLog.concat(res.CallLog);
							this.ismore=false;
						}
						this.listLoading = false;
//						console.log(this.CallLog.length);
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	#header{ width:100%; height:100px; color:#fff; background:#409EFF; }
	.th1{ padding:0 10px; box-sizing:border-box; font:18px/40px "微软雅黑"; color:#409EFF; margin:5px auto; }
	.tlabel{ color:#999; }
	.ttag{ font:10px "微软雅黑"; padding:2px 4px; background:#409EFF; color:#fff; border-radius:2px; }
	#ismore{ font:20px/50px '微软雅黑'; color:#409EFF; cursor:pointer; text-align:center; }
	.contentsty{ font:14px/46px '微软雅黑'; padding:10px 20px; box-sizing:border-box; background:#f9f9f9; border:1px solid #eaeaea; overflow:hidden; }
</style>