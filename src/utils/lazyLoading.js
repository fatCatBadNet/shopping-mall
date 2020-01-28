const home = import('@/views/Home.vue');  //外层框架
const main = import('@/views/Main.vue');  //登录后引导页

const productConfig = import('@/views/setting/newproconfig.vue');  //产品配置
const loanProgram = import('@/views/setting/loan_program.vue');  //放款计划 
const operacontrol = import('@/views/setting/opera_control.vue');  //业务控制
const smstemplate = import('@/views/setting/sms_template.vue');  //短信模版
// const smstemplate = import('@/views/setting/voice_template.vue');  //语音模版
const systemmsg = import('@/views/setting/system_msg.vue');  //系统消息
const apppush = import('@/views/setting/app_push.vue');  //app推送
const bizalert = import('@/views/setting/bizalert.vue');  //业务预警
const giveoutset = import('@/views/setting/giveoutset.vue');  //配置管理
const ofcwebset = import('@/views/setting/page_setting/index.vue');  //页面配置
const blackwhite = import('@/views/setting/blackwhite.vue');  //黑白名单

const black = import('@/views/setting/black.vue');  //黑名单列表
const advanceconf = import('@/views/setting/advanceconf.vue');  //高级配置

const regUserlist = import('@/views/user_manage/regUserlist.vue');  //注册用户
const authUserlist = import('@/views/user_manage/authUserlist.vue');  //认证用户
const ainerverloan = import('@/views/user_manage/ai_marketing.vue');  //ai语音提醒
const advise = import('@/views/user_manage/advise.vue');  //意见反馈
const authUserDtl = import('@/views/user_manage/authUserDtl.vue');  //认证用户详情
const viprecord = import('@/views/user_manage/viprecord.vue');  //报告购买记录
const creditlist = import('@/views/user_manage/creditlist.vue');  //认证用户
const lossuserallow = import('@/views/user_manage/loseuserallocation.vue');  //流失用户分配
const lossuserlist = import('@/views/user_manage/loseuserlist.vue');  //流失用户列表

const rolemanage = import('@/views/authority_manage/role_manage.vue');  //角色管理
const accountmanage = import('@/views/authority_manage/account_manage.vue');  //账号管理
const organization = import('@/views/authority_manage/organization.vue');  //组织架构
const appset = import('@/views/authority_manage/appset.vue');  //商户设置
const syslog = import('@/views/authority_manage/login_note.vue');  //登录日志

const totaldata = import('@/views/data/totaldata.vue');  //总数据统计
const userdata = import('@/views/data/userdata.vue');  //用户数据
const loandata = import('@/views/data/loandata.vue');  //放款数据
const returndata = import('@/views/data/returndata.vue');  //还款数据
const overduedata = import('@/views/data/overduedata.vue');  //逾期数据
const statisticdata = import('@/views/data/statisticdata.vue');  //统计数据
const overduetotal = import('@/views/data/overduetotal.vue');  //逾期汇总
const zhldata = import('@/views/data/conversiondata.vue');  //转化率数据
const tgldata = import('@/views/data/passdata.vue');  //通过率数据
const qdfxdata = import('@/views/data/channeldata.vue');  //渠道分析
const sydata = import('@/views/data/firstoverdata.vue');  //首逾数据
const jkfxdata = import('@/views/data/owedata.vue');  //借款分析
const srfxdata = import('@/views/data/srfxdata.vue');  //收入分析
const hkfxdata = import('@/views/data/hkfxdata.vue');  //还款分析
const zdfxdata = import('@/views/data/zdfxdata.vue');  //账单分析
const fjfxdata = import('@/views/data/fjfxdata.vue');  //复借分析

const sourcedata = import('@/views/operation/channeldata/index.vue');  //运营渠道数据
const sourceoverduedata = import('@/views/operation/channeloverdue.vue');  //运营渠道逾期
const channelmanage = import('@/views/operation/channelmanage.vue');  //运营渠道管理
const channelset = import('@/views/operation/channelset.vue');  //运营渠道配置
const adlist = import('@/views/operation/adlist.vue');  //运营广告管理列表
const addacty = import('@/views/operation/addacty.vue');  //新增便捷活动广告
const repaylist = import('@/views/operation/repaylist.vue');  //还款记录列表
const renewlist = import('@/views/operation/renewlist.vue');  //续期管理列表
const returnlist = import('@/views/operation/returnlist.vue');  //回款列表
const returndtl = import('@/views/operation/returndtl.vue');  //回款详情

const smsbill = import('@/views/bill/smsbill.vue');  //短信账单
const fkbill = import('@/views/bill/fkbill.vue');  //风控账单
const chargelist = import('@/views/bill/chargelist.vue');  //风控账单
const connectbill = import('@/views/bill/hfbill.vue');  //通话账单

const risklist = import('@/views/risk_manage/risklist.vue');  //风控列表
const loanAudit = import('@/views/risk_manage/loanAudit.vue');  //借款审核
const riskmgrlist = import('@/views/risk_manage/riskmgrlist.vue');  //风控授信列表
const riskmgrdtl = import('@/views/risk_manage/riskmgrdtl.vue');  //风控授信管理详情
const loanlist = import('@/views/risk_manage/loanlist.vue');  //借款管理列表
const creditmanagerlist = import('@/views/risk_manage/creditlist.vue');  //授信管理列表
const fkconfig = import('@/views/risk_manage/fkconfig.vue');  //风控结果配置

const threshold = import('@/views/setting/bizalert_control.vue');  //阈值设置

const afterloanlist = import('@/views/afterloan/afterloanlist.vue');  //贷后列表
const afterloandtl = import('@/views/afterloan/afterloandtl.vue');  //贷后详情
const collection_return = import('@/views/afterloan/collection_return.vue');  //贷后列表
const ai_collection = import('@/views/afterloan/ai_collection.vue');  //AI催收列表
const more_repay = import('@/views/afterloan/handle_hold.vue');  //批量代扣

const calllist = import('@/views/user_manage/calllist.vue');  //客服列表

const portset = import('@/views/setting/port_set.vue');  //协议配置

const updatelog = import('@/views//dataLog.vue');  //更新日志
const refuselist = import('@/views/risk_manage/refuselist.vue');  //更新日志

function look(n){
	switch(n){
		case 'home':
  			return home;
  			break;
	    case 'reguserlist':
	    	return regUserlist;
	        break;
	    case 'authuserlist':
	    	return authUserlist;
	        break;
	    case 'authuserdtl':
	    	return authUserDtl;
	        break;
	    case 'viprecord':
	    	return viprecord;
	        break;
	    case 'creditlist':
	    	return creditlist;
	        break;
	    case 'advise':
	    	return advise;
	        break;  
        case 'sysrole':
	    	return rolemanage;
	        break;
        case 'sysuser':
	    	return accountmanage;
	        break;
	    case 'sysorg':
	    	return organization;
	        break;
	    case 'appset':
	    	return appset;
	        break;
	    case 'product':
	    	return productConfig;
	        break;
	    case 'loanlimit':
	    	return loanProgram;
	        break;
	    case 'bizcontrol':
	    	return operacontrol;
	        break;
	    case 'smstemplate':
	    	return smstemplate;
	        break;
	    case 'systemmsg':
	    	return systemmsg;
	        break;
	    case 'apppushtpl':
	    	return apppush;
	        break;
	    case 'bizalert':
	    	return bizalert;
	        break;
	    case 'giveoutset':
	    	return giveoutset;
	        break;
	    case 'ofcwebset':
	    	return ofcwebset;
	        break;
	    case 'namelib':
	    	return blackwhite;
	        break;
		case 'blacklib':
			return black;
			break;
		case 'advanceconf':
			return advanceconf;
		    break;
	    case 'totaldata':
	    	return totaldata;
	        break;
	    case 'userdata':
	    	return userdata;
	        break;
	    case 'loandata':
	    	return loandata;
	        break;
	    case 'returndata':
	    	return returndata;
	        break;
	    case 'overduedata':
	    	return overduedata;
	        break;
	    case 'statisticdata':
	    	return statisticdata;
	        break;
		case 'yqhzdata':
			return overduetotal;
		    break;
	    case 'zhldata':
	    	return zhldata;
	        break;
	    case 'tgldata':
	    	return tgldata;
	        break;
	    case 'sydata':
	    	return sydata;
	        break;
	    case 'jkfxdata':
	    	return jkfxdata;
	        break;
	    case 'qdfxdata':
	    	return qdfxdata;
	        break;
	    case 'srfxdata':
	    	return srfxdata;
	        break;
	    case 'hkfxdata':
	    	return hkfxdata;
	        break;
	    case 'zdfxdata':
	    	return zdfxdata;
	        break;
		case 'fjfxdata':
			return fjfxdata;
		    break;
	    case 'channelmanage':
	    	return channelmanage;
	        break;
	    case 'chanset':
	    	return channelset;
	        break;
	    case 'adlist':
	    	return adlist;
	        break;
	    case 'addacty':
	    	return addacty;
	        break;
	    case 'repaylist':
	    	return repaylist;
	        break;
	    case 'renewlist':
	    	return renewlist;
	        break;
	    case 'smsbill':
	    	return smsbill;
	        break;
	    case 'fkbill':
	    	return fkbill;
	        break;
	    case 'chargelist':
	    	return chargelist;
	        break;
	    case 'fklist':
	    	return risklist;
	        break;
	    case 'fkdtl':
	    	return loanAudit;
	        break;
	    case 'riskmgrlist':
	    	return riskmgrlist;
	        break;
	    case 'riskmgrdtl':
	    	return riskmgrdtl;
	        break;
	    case 'loanlist':
	    	return loanlist;
	        break; 
	    case 'creditmanagerlist':
	    	return creditmanagerlist;
	        break;    
	    case 'fkresultconfig':
	    	return fkconfig;
	        break; 
	    case 'returnlist':
	    	return returnlist;
	        break;
	    case 'returndtl':
	    	return returndtl;
	        break;
	    case 'threshold':
	    	return threshold;
	        break;
	    case 'collectionlist':
	    	return afterloanlist;
	        break;
	    case 'collectiondtl':
	    	return afterloandtl;
	        break;
	    case 'collection_return':
	    	return collection_return;
	        break;
	    case 'calllist':
	    	return calllist;
	        break;
	    case 'portset':
	    	return portset;
	        break;
		case 'updatelog':
			return updatelog;
			break;
		case 'refuselist':
			return refuselist;
			break;
		case 'aicoll_record':
			return ai_collection;
			break;
		case 'connectbill':
			return connectbill;
			break;
		case 'lossuserallow':
			return lossuserallow;
			break;
		case 'lossuserlist':
			return lossuserlist;
		case 'sourcedata':
			return sourcedata;
			break;
		case 'sourceoverduedata':
			return sourceoverduedata;
		case 'ainerverloan':
			return ainerverloan;
		case 'more_repay':
			return more_repay;
			break;
		case 'syslog':
			return syslog;
			break;
		default:
			return main;
			break;
	}
}

export default (name) => () => look(name);