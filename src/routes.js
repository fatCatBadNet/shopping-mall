const login = r => require.ensure([], () => r(require('./views/Login.vue')),'Login');  //登录页
const mentality = r => require.ensure([], () => r(require('./views/mentality.vue')),'mentality');  //系统
const resetpassword = r => require.ensure([], () => r(require('./views/resetpassword.vue')),'resetpassword');  //修改密码
const datalog = r => require.ensure([], () => r(require('./views/dataLog.vue')),'datalog');  //更新日志
const notFound = r => require.ensure([], () => r(require('./views/404.vue')),'NotFound');  //404页面
const home = r => require.ensure([], () => r(require('./views/Home.vue')),'Home');  //主页
const main = r => require.ensure([], () => r(require('./views/Main.vue')),'Main');  //数据展示页
const partyChannel = r => require.ensure([], () => r(require('./views/operation/partyChannel.vue')),'partyChannel');  //甲方链接
const channelurl = r => require.ensure([], () => r(require('./views/operation/channelurl.vue')),'channelurl');  //渠道链接
const lookreg = r => require.ensure([], () => r(require('./views/operation/lookreg.vue')),'lookreg');  //注册统计
const firstbalance = r => require.ensure([], () => r(require('./views/authority_manage/appset/firstbalance.vue')),'firstbalance');  //首借额度设置
const whitebalance = r => require.ensure([], () => r(require('./views/authority_manage/appset/whitebalance.vue')),'whitebalance');  //白名单首借额度设置
const dayscheme = r => require.ensure([], () => r(require('./views/authority_manage/appset/dayscheme.vue')),'dayscheme');  //放款计划设置
const renewalswitch = r => require.ensure([], () => r(require('./views/authority_manage/appset/renewalswitch.vue')),'renewalswitch');  //续期开关设置
const overduecostceil = r => require.ensure([], () => r(require('./views/authority_manage/appset/overduecostceil.vue')),'overduecostceil');  //逾期费用上限设置
const customertel = r => require.ensure([], () => r(require('./views/authority_manage/appset/customertel.vue')),'customertel');  //客服联系方式设置
const blsupperlimit = r => require.ensure([], () => r(require('./views/authority_manage/appset/blsupperlimit.vue')),'blsupperlimit');  //授信额度上限设置
const loanmarket = r => require.ensure([], () => r(require('./views/authority_manage/appset/loanmarket.vue')),'loanmarket');  //尾量转化设置
const incrinfo = r => require.ensure([], () => r(require('./views/authority_manage/appset/incrinfo.vue')),'incrinfo');  //提额设置
const bizmode = r => require.ensure([], () => r(require('./views/authority_manage/appset/bizmode.vue')),'bizmode');  //app业务模式设置
const autowithhold = r => require.ensure([], () => r(require('./views/authority_manage/appset/autowithhold.vue')),'autowithhold');  //自动代扣时间设置
const loanstrategy = r => require.ensure([], () => r(require('./views/authority_manage/appset/loanstrategy.vue')),'loanstrategy');  //自动放款比例设置
const gooauth = r => require.ensure([], () => r(require('./views/authority_manage/appset/gooauth.vue')),'gooauth');  //谷歌验证器开关设置
const AI = r => require.ensure([], () => r(require('./views/authority_manage/appset/AI.vue')),'AI');  //AI提醒开关设置
const balanceparm = r => require.ensure([], () => r(require('./views/authority_manage/appset/balanceparm.vue')),'balanceparm');  //额度参数设置
const userremind = r => require.ensure([], () => r(require('./views/authority_manage/appset/userremind.vue')),'userremind');  //提醒设置
const fkreportdtl = r => require.ensure([], () => r(require('./views/fkreportdtl.vue')),'fkreportdtl');  //风控报告详情页
const authuserlist = r => require.ensure([], () => r(require('./views/user_manage/authUserlist.vue')),'authuserlist');  //认证用户
const reguserlist = r => require.ensure([], () => r(require('./views/user_manage/regUserlist.vue')),'reguserlist');  //注册用户
const authuserdtl = r => require.ensure([], () => r(require('./views/user_manage/authUserDtl.vue')),'authuserdtl');  //用户详情
const robotIntroduction = r => require.ensure([], () => r(require('./views/afterloan/robot_introduction.vue')),'fkreportdtl');  //智能语音介绍

let routes = [
	{path:'*',redirect:{path:'/404'},hidden:true},
    {path:'/login',component:login,name:'',hidden:true},
    {path:'/mentality/:m/:t',component:mentality,name:'',hidden:true},
    {path:'/404',component:notFound,name:'',hidden:true},
    {path:'/partyChannel/:id/:merchant',component:partyChannel,name:'',hidden:true},
	{path:'/channelurl/:id/:name/:merchant',component:channelurl,name:'',hidden:true},
	{path:'/lookreg/:name/:merchant/:sid/:d',component:lookreg,name:'',hidden:true},
	// {path:'/robotIntroduction',component:robotIntroduction,name:'智能语音介绍',hidden:true},
    {path:'/',component:home,name:'主页',hidden:true,
    	children:[
        	{ path:'main',component:main,name:'数据展示',hidden:true},
        	{ path:'resetpsd',component:resetpassword,name:'修改密码',hidden:true},
        	{ path:'datalog',component:datalog,name:'更新日志',hidden:true}
      	]
    },
    {path:'/',component:home,name:' 商户设置',hidden:true,
    	children:[
        	{ path:'firstbalance',component:firstbalance,name:'首借额度设置',hidden:true},
        	{ path:'whitebalance',component:whitebalance,name:'白名单首借额度设置',hidden:true},
        	{ path:'dayscheme',component:dayscheme,name:'放款计划设置',hidden:true},
        	{ path:'renewalswitch',component:renewalswitch,name:'续期开关设置',hidden:true},
        	{ path:'overduecostceil',component:overduecostceil,name:'逾期费用上限设置',hidden:true},
        	{ path:'customertel',component:customertel,name:'客服联系方式设置',hidden:true},
        	{ path:'incrinfo',component:incrinfo,name:'提额设置',hidden:true},
        	{ path:'blsupperlimit',component:blsupperlimit,name:'授信额度上限设置',hidden:true},
        	{ path:'loanmarket',component:loanmarket,name:'尾量转化设置',hidden:true},
        	{ path:'bizmode',component:bizmode,name:'APP业务模式设置',hidden:true},
        	{ path:'autowithhold',component:autowithhold,name:'自动代扣时间设置',hidden:true},
        	{ path:'loanstrategy',component:loanstrategy,name:'自动放款比例设置',hidden:true},
			{ path:'gooauth',component:gooauth,name:'谷歌验证器开关设置',hidden:true},
			{ path:'AI',component:AI,name:'AI智能语音提醒设置',hidden:true},
			{ path:'balanceparm',component:balanceparm,name:'首页显示额度设置',hidden:true},
			{ path:'userremind',component:userremind,name:'设置',hidden:true}
      	]
    },
	{path:'/fkreportdtl/:id',component:fkreportdtl,name:'详细风控报告',hidden:true},
	{path:'/authuserlist',component:authuserlist,name:'认证用户',hidden:true},
	{path:'/reguserlist',component:reguserlist,name:'注册用户',hidden:true},
	{path:'/authuserdtl/:id',component:authuserdtl,name:'用户详情',hidden:true}
];

export default routes;