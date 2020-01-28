import http from "api/http.js"
export const loginconf = params => { return http.post('/conf/loginconf', params); };  //获取商户信息
export const userLogin = params => { return http.post('/sysuser/login', params); };  //系统用户登录
export const mainauth = params => { return http.post('/conf/mainauth', params); };  //系统
export const validauthconf = params => { return http.post('/valid/authconf', params); };  //判断是否需要极验验证
export const validregist = params => { return http.post('/valid/regist', params); };  //极验参数获取
export const validverify = params => { return http.post('/valid/verify', params); };  //极验验证
export const updatepwd = params => { return http.post('/sysuser/updatepwd', params); };  //修改密码
export const getmenulist = params => { return http.post('/sysmenu/menutree', params) };  //系统左侧菜单列表
export const buttonctl = params => { return http.post('/sysmenu/buttonctl', params) };  //获取系统按钮权限
export const domainprefix = params => { return http.post('/index/domainprefix', params) };  //获取copyUrl
export const indexdtl = params => { return http.post('/index/', params) };  //主页详情
export const toggledatascreen = params => { return http.post('/index/toggledatascreen', params) };  //日月数据切换
export const syncdata = params => { return http.post('/index/syncdata', params) };  //实时数据
export const balancemonitor = params => { return http.post('/index/balancemonitor', params) };  //余额监控
export const financialdata = params => { return http.post('/index/financialdata', params) };  //财务数据

export const sysrolelist = params => { return http.post('/sysrole/list', params) };   //角色列表
export const jurisdictionMenutree = params => { return http.post('/jurisdiction/menutree', params) };   //获取角色权限设置树
export const buttonlist = params => { return http.post('/jurisdiction/buttonlist', params) };   //获取菜单树按钮权限数据
export const sysroleadd = params => { return http.post('/sysrole/addedit', params) };   //新增角色
export const sysroledel = params => { return http.post('/sysrole/del', params) };   //删除角色
export const jurisdictionAdd = params => { return http.post('/jurisdiction/add', params) };   //新增岗位
export const getjurisdictioninfo = params => { return http.post('/jurisdiction/info', params) };   //获取岗位信息
export const jurisdictionEdit = params => { return http.post('/jurisdiction/edit', params) };   //编辑岗位
export const jurisdictionDelete = params => { return http.post('/jurisdiction/delete', params) };   //删除岗位
export const sysuserList = params => { return http.post('/sysuser/list', params) };   //系统用户列表
export const sysuserIsused = params => { return http.post('/sysuser/isused', params) };   //系统用户(禁用和启用)
export const sysuserAdd = params => { return http.post('/sysuser/add', params) };   //系统用户(新增账号)
export const sysuserEdit = params => { return http.post('/sysuser/edit', params) };   //系统用户(编辑账号)
export const sysuserInfo = params => { return http.post('/sysuser/info', params) };   //系统用户(岗位信息)
export const sysuserDel = params => { return http.post('/sysuser/del', params) };   //系统用户(删除账号)
export const inituserpwd = params => { return http.post('/sysuser/inituserpwd', params) };   //系统用户(重置密码)
export const sysuserUserInfo = params => { return http.post('/sysuser/userinfo', params) };   //系统用户(用户信息)
export const stationtree = params => { return http.post('/jurisdiction/stationtree', params) };   //获取岗位菜单树信息
export const appsetcmpninfo = params => { return http.post('/appset/cmpninfo', params) };   //企业信息
export const appsetinfo = params => { return http.post('/appset/info', params) };   //app配置
export const appsetbackstginfo = params => { return http.post('/appset/backstginfo', params) };   //后台配置
export const getfirstbalance = params => { return http.post('/appset/firstbalance', params) };   //获取首借额度
export const setfirstbalance = params => { return http.post('/appset/setfirstbalance', params) };   //设置首借额度
export const getwhitebalance = params => { return http.post('/appset/whitebalance', params) };   //获取白名单首借额度
export const setwhitebalance = params => { return http.post('/appset/setwhitebalance', params) };   //设置白名单首借额度
export const getdayscheme = params => { return http.post('/appset/dayscheme', params) };   //获取放款计划
export const setdayscheme = params => { return http.post('/appset/setdayscheme', params) };   //设置放款计划
export const getrenewalswitch = params => { return http.post('/appset/renewalswitch', params) };   //获取续期开关
export const setrenewalswitch = params => { return http.post('/appset/setrenewalswitch', params) };   //设置续期开关
export const getoverduecostceil = params => { return http.post('/appset/overduecostceil', params) };   //获取逾期费用上限
export const setoverduecostceil = params => { return http.post('/appset/setoverduecostceil', params) };   //设置逾期费用上限
export const getcustomertel = params => { return http.post('/appset/customertel', params) };   //获取客服联系方式
export const setcustomertel = params => { return http.post('/appset/setcustomertel', params) };   //设置客服联系方式
export const getblsupperlimit = params => { return http.post('/appset/blsupperlimit', params) };   //获取授信额度上限
export const setblsupperlimit = params => { return http.post('/appset/setblsupperlimit', params) };   //设置授信额度上限
export const getloanmarket = params => { return http.post('/appset/loanmarket', params) };   //获取尾量转化
export const setloanmarket = params => { return http.post('/appset/editloanmarket', params) };   //设置尾量转化
export const getincrinfo = params => { return http.post('/appset/incrinfo', params) };   //获取提额
export const setincrinfo = params => { return http.post('/appset/setincrinfo', params) };   //设置提额
export const getbizmode = params => { return http.post('/appset/bizmode', params) };   //获取app业务模式
export const setbizmode = params => { return http.post('/appset/setbizmode', params) };   //设置app业务模式
export const getautowithhold = params => { return http.post('/appset/autowithhold', params) };   //获取自动代扣
export const setautowithhold = params => { return http.post('/appset/setautowithhold', params) };   //设置自动代扣
export const getloanstrategy = params => { return http.post('/appset/loanstrategyinfo', params) };   //获取放款策略
export const setloanstrategy = params => { return http.post('/appset/motifyloanstrategy', params) };   //设置放款策略
export const getgooauth = params => { return http.post('/appset/gooauthinfo', params) };   //获取谷歌验证器开关
export const setgooauth = params => { return http.post('/appset/motifygooauth', params) };   //设置谷歌验证器开关
export const getbalanceparm = params => { return http.post('/appset/balanceparm', params) };   //获取额度参数
export const setbalanceparm = params => { return http.post('/appset/setbalanceparm', params) };   //设置额度参数

export const getorganizationtree = params => { return http.post('/sysorg/getorganizationtree', params) };   //获取组织架构信息树
export const addorganization = params => { return http.post('/sysorg/addorganization', params) };   //添加组织架构树节点
export const editorganization = params => { return http.post('/sysorg/editorganization', params) };   //编辑组织架构树节点
export const jurisdictionlist = params => { return http.post('/jurisdiction/list', params) };   //组织岗位列表
export const rolelistall = params => { return http.post('/sysrole/listall', params) };   //岗位角色列表

export const reguserlist = params => { return http.post('/user/list',params) };   //获取注册用户列表
export const authuserlist = params => { return http.post('/usersmetadata/list',params) };   //获取认证用户列表
export const authuserdtl = params => { return http.post('/usersmetadata/detail',params) };   //认证用户详情
export const livinginit = params => { return http.post('/usersmetadata/livinginit',params) };   //初始化人脸
export const addressbookinit = params => { return http.post('/usersmetadata/addressbookinit',params) };   //初始化通讯录
export const adviselist = params => { return http.post('/advise/list',params) };   //获取意见反馈列表
export const addadvise = params => { return http.post('/advise/updateremark',params) };   //添加备注
export const viplist = params => { return http.post('/vip/list',params) };   //获取报告购买记录
export const userscreditlist = params => { return http.post('/usersmetadata/userscreditlist',params) };   //获取授信用户列表
export const reguserdel = params => { return http.post('/user/del',params) };   //删除注册用户

export const loginrecords = params => { return http.post('/usersmetadata/loginrecords',params) };   //登录历史（组件）
export const reportbuyrecord = params => { return http.post('/usersmetadata/reportbuyrecord',params) };   //报告购买记录（组件）
export const messagecenter = params => { return http.post('/usersmetadata/messagecenter',params) };   //报告购买记录（组件）
export const repaymentrecord = params => { return http.post('/usersmetadata/repaymentrecord',params) };   //还款记录（组件）
export const loanrecord = params => { return http.post('/usersmetadata/loanrecord',params) };   //借款记录（组件）
export const repaymentschedule = params => { return http.post('/usersmetadata/repaymentschedule',params) };   //还款计划（弹窗）
export const usersbankcard = params => { return http.post('/usersmetadata/usersbankcard',params) };   //银行卡（组件）
export const modifyphonenum = params => { return http.post('/usersmetadata/modifyphonenum',params) };   //修改银行预留手机号（弹窗）
export const unwrapusersbankcard = params => { return http.post('/usersmetadata/unwrapusersbankcard',params) };  //解绑银行卡操作
export const invitationrecord = params => { return http.post('/usersmetadata/invitationrecord',params) };   //邀请记录（组件）
export const identify = params => { return http.post('/usersmetadata/identify',params) };   //实名认证（组件）
export const institutiondata = params => { return http.post('/usersmetadata/institutiondata',params) };   //实名认证（机构数据）
export const phonelinkman = params => { return http.post('/usersmetadata/phonelinkman',params) };   //联系人&通讯录（组件）
export const operatormxdata = params => { return http.post('/usersmetadata/operatormxdata',params) }; // 手机运营商（新增）
export const operatordata = params => { return http.post('/usersmetadata/operatordata',params) };   //手机运营商（组件）
export const datacomparison = params => { return http.post('/mobilerelation/datacomparison',params) };   //数据比对（弹窗）
export const operatorrpt = params => { return http.post('/usersmetadata/operatorrpt',params) };   //手机运营商（组件）
export const operatorrptcalllog = params => { return http.post('/usersmetadata/operatorrptcalllog',params) };   //手机运营商通话记录
export const connrecord = params => { return http.post('/usersmetadata/connrecord',params) };   //联系历史（组件）
export const fkadvicedtl = params => { return http.post('/riskmgr/fkadvicedtl',params) };   //风控报告（组件）
export const simplefkadvicedtl = params => { return http.post('/riskmgr/simplefkadvicedtl',params) };   //精简版风控报告（组件）

export const getFKFKCreditReport = params => { return http.post('/riskmgr/getfkcreditreport',params) };   //　信用报告

export const tjtaobaoreport = params => { return http.post('/usersmetadata/tjtaobaoreport',params) };   //天机淘宝报告（组件）

export const configproList = params => { return http.post('/product/list',params) };   //获取配置产品列表
export const setproisused = params => { return http.post('/product/isused',params) };   //产品状态改变(启用/禁用)
export const getconfigproinfo = params => { return http.post('/product/info',params) };   //通过id获取配置产品的信息
export const addconfigPro = params => { return http.post('/product/addedit',params) };   //添加/编辑配置产品
export const addeditrenewal = params => { return http.post('/product/addeditrenewal',params) };   //添加和编辑续期
export const deleterenewal = params => { return http.post('/product/deleterenewal',params) };   //产品续期配置删除
export const creditrpt = params => { return http.post('/product/creditrpt',params) };   //获取信用报告定价
export const setcreditrpt = params => { return http.post('/product/setcreditrpt',params) };   //设置信用报告价格
export const productrenewal = params => { return http.post('/product/renewal',params) };   //获取续期开关状态
export const productsetrenewal = params => { return http.post('/product/setrenewal',params) };   //设置续期开关状态
export const loanlimitList = params => { return http.post('/loanlimit/list',params) };   //获取放款计划列表
export const loanlimitedit = params => { return http.post('/loanlimit/edit',params) };   //修改单日放款金额
export const loanlimitadd = params => { return http.post('/loanlimit/add',params) };   //批量增加单日放款金额
export const bizcontrollist = params => { return http.post('/bizcontrol/list',params) };   //业务控制列表
export const bizcontrolisused = params => { return http.post('/bizcontrol/isused',params) };   //业务控制开关
export const bizcontroledit = params => { return http.post('/bizcontrol/edit',params) };   //业务控制编辑配置
export const smstemplatelist = params => { return http.post('/smstemplate/list',params) };   //获取短信模版列表
export const smstemplateisused = params => { return http.post('/smstemplate/isused',params) };   //短信模版状态改变（冻结）
export const smstemplateedit = params => { return http.post('/smstemplate/edit',params) };   //短信模版编辑
export const sysmsgtpllist = params => { return http.post('/sysmsgtpl/list',params) };   //获取系统消息内容列表
export const sysmsgtplisused = params => { return http.post('/sysmsgtpl/isused',params) };   //系统消息短信模版状态改变（冻结）
export const sysmsgtpledit = params => { return http.post('/sysmsgtpl/edit',params) };   //系统消息短信模版编辑
export const apppushtpllist = params => { return http.post('/apppushtpl/list',params) };   //获取app推送内容列表
export const apppushtplisused = params => { return http.post('/apppushtpl/isused',params) };   //app推送短信模版状态改变（冻结）
export const apppushtpledit = params => { return http.post('/apppushtpl/edit',params) };   //app推送短信模版编辑
export const varcontrast = params => { return http.post('/smstemplate/varcontrast',params) };   //短信变量对照表
export const bizalertlist = params => { return http.post('/bizalert/list',params) };   //业务预警列表
export const bizalertinfo = params => { return http.post('/bizalert/info',params) };   //获取单条业务预警信息
export const bizalerteditadd = params => { return http.post('/bizalert/editadd',params) };   //业务预警新增编辑
export const bizalertdel = params => { return http.post('/bizalert/del',params) };   //业务预警删除
export const loanstrategydetail = params => { return http.post('/loanstrategy/detail',params) };   //获取放款策略信息
export const motifyloanstrategy = params => { return http.post('/loanstrategy/motifyloanstrategy',params) };   //编辑放款策略
export const getdisguise = params => { return http.post('/loanstrategy/disguise',params) };   //获取应用市场伪装开关
export const editdisguise = params => { return http.post('/loanstrategy/editdisguise',params) };   //设置应用市场伪装开关

export const getwebsetinfo = params => { return http.post('/ofc/websetinfo',params) };   //获取官网配置信息
export const editwebset = params => { return http.post('/ofc/editwebset',params) };   //编辑官网信息
export const nameliblist = params => { return http.post('/namelib/list',params) };   //获取黑白名单列表
export const namelibdelete = params => { return http.post('/namelib/delete',params) };   //白名单移除
export const blacknamelibdelete = params => { return http.post('/namelib/back/delete',params) };   //黑名单移除

export const dailytotaldata = params => { return http.post('/financedata/dailytotaldata',params) };   //获取总数据列表
export const dailyusersdata = params => { return http.post('/financedata/dailyusersdata',params) };   //用户数据列表
export const dailyloandata = params => { return http.post('/financedata/dailyloandata',params) };   //放款数据列表
export const dailyreturndata = params => { return http.post('/financedata/dailyreturndata',params) };   //还款数据列表
export const dailyoverduedata = params => { return http.post('/financedata/dailyoverduedata',params) };   //逾期数据列表
export const traderecordlist = params => { return http.post('/loan/traderecordlist',params) };   //统计数据列表
export const saasusersconverdaily = params => { return http.post('/financedata/saasusersconverdaily',params) };   //流程转化率数据列表
export const findailyusersdata = params => { return http.post('/financedata/dailyusersdata',params) };   //通过率数据列表
export const saasexpireoverdueratedaily = params => { return http.post('/financedata/saasexpireoverdueratedaily',params) };   //首逾数据列表
export const findailyloandata = params => { return http.post('/financedata/dailyloandata',params) };   //借款分析数据列表
export const saasdailyoperating = params => { return http.post('/financedata/saasdailyoperating',params) };   //渠道分析数据列表
export const saasdailyincome = params => { return http.post('/financedata/saasdailyincome',params) };   //收入分析数据列表
export const saasdailyrepayment = params => { return http.post('/financedata/saasdailyrepayment',params) };   //还款分析数据列表
export const saasdailybill = params => { return http.post('/financedata/saasdailybill',params) };   //账单分析数据列表
export const saasoverduestaic = params => { return http.post('/financedata/saasoverduestaic',params) };   //逾期汇总
export const saasreturnafterloandalily = params => { return http.post('/financedata/saasreturnafterloandalily',params) };   //复借分析

export const channellist = params => { return http.post('/channelmanagement/list',params) };   //渠道管理列表
export const jiachannellist = params => { return http.h5post('/v1/data/channelmanagement/list',params) };   //渠道管理列表(甲方链接)
export const companyinfo = params => { return http.h5post('/v1/data/channelmanagement/companyinfo',params) };   //渠道管理列表(甲方链接)获取公司名称
export const dessourcename = params => { return http.h5post('/v1/data/channelmanagement/dessourcename',params) };   //渠道管理列表(渠道链接)获取渠道名称
export const lookreg = params => { return http.h5post('/v1/data/channelmanagement/look',params) };   //查看注册
export const companyselect = params => { return http.post('/channelmanagement/companyselect',params) };   //渠道管理公司下拉
export const addoreditsource = params => { return http.post('/channelmanagement/addoreditsource',params) };   //添加、编辑渠道管理
export const chansetlist = params => { return http.post('/chanset/list',params) };   //渠道配置列表
export const chansetupdatestate = params => { return http.post('/chanset/updatestate',params) };   //渠道配置状态修改（冻结）
export const chansetinfo = params => { return http.post('/chanset/info',params) };   //获取渠道配置详情
export const chansetaddedit = params => { return http.post('/chanset/addedit',params) };   //添加、编辑渠道配置
export const sourceadd = params => { return http.post('/chanset/sourceadd',params) };   //新增渠道
export const companysourcelist = params => { return http.post('/chanset/companysourcelist',params) };   //展开获取公司渠道列表
export const sourcestateupdate = params => { return http.post('/chanset/sourcestateupdate',params) };   //更新渠道状态
//export const qrcode = params => { return http.get('/down/qrcode',params) };   //生成二维码链接
export const activitylist = params => { return http.post('/activity/list',params) };   //活动广告管理列表
export const activityinfo = params => { return http.post('/activity/info',params) };   //获取活动广告内容
export const activityeditadd = params => { return http.post('/activity/editadd',params) };   //新增编辑活动广告内容
export const repaymentlist = params => { return http.post('/repayment/list',params) };   //还款记录列表
export const loantermcount = params => { return http.post('/product/loantermcount',params) };   //获取产品期数
export const renewlist = params => { return http.post('/renew/list',params) };   //续期管理列表
export const financemanagelist = params => { return http.post('/financemanage/list',params) };   //回款管理列表
export const financemanagedetail = params => { return http.post('/financemanage/detail',params) };   //回款管理详情
export const repayment = params => { return http.post('/usersmetadata/repayment',params) };   //还款录入(还款记录代扣)
export const handrenew = params => { return http.post('/financemanage/handrenew',params) };   //手动续期

export const smsbilllist = params => { return http.post('/bill/smsbill',params) };   //短信账单列表
export const FkBill = params => { return http.post('/bill/fkbill',params) };   //风控账单列表
export const fkvars = params => { return http.post('/bill/fkvars',params) };   //风控产品列表（账单页面下拉选项）
export const chargelist = params => { return http.post('/bill/chargelist',params) };   //充值记录

export const riskmgrlist = params => { return http.post('/riskmgr/list',params) };   //风控列表
export const loaninfo = params => { return http.post('/loan/info',params) };   //风控借款信息
export const loangiveout = params => { return http.post('/loan/giveout',params) };   //风控放款审核
export const auditlist = params => { return http.post('/riskmgr/auditlist',params) };   //风控授信管理列表
export const auditdtl = params => { return http.post('/riskmgr/auditdtl',params) };   //风控授信管理详情
export const auditedit = params => { return http.post('/riskmgr/auditedit',params) };   //风控授信提交
export const loanrewrite = params => { return http.post('/loan/loanrewrite',params) };   //风控修改放款金额
export const refuselist = params => { return http.post('/loan/refuselist',params) };   //借款拒绝列表
export const loanlist = params => { return http.post('/riskmgr/loanlist',params) };   //风控借款管理列表
export const loanallocate = params => { return http.post('/riskmgr/loanallocate',params) };   //风控借款管理分配操作
export const getuserloginstate = params => { return http.post('sysuser/getuserloginstate',params) };   //查询用户借款审核的状态
export const updateuserloginstate = params => { return http.post('/sysuser/updateuserloginstate',params) };   //设置用户借款审核的状态
export const creditmanagerlist = params => { return http.post('/riskmgr/creditmanagerlist',params) };   //风控授信管理列表
export const creditallocate = params => { return http.post('/riskmgr/creditallocate',params) };   //风控授信管理分配操作
export const loanrewriteandgiveout = params => { return http.post('/loan/loanrewriteandgiveout',params) };   //风控-修改金额和同意放款
export const fkcreditaudit = params => { return http.post('/riskmgr/fkcreditaudit',params) };   //风控授信审核(同意、关闭)
export const updatecreditamount = params => { return http.post('/riskmgr/updatecreditamount',params) };   //风控授信审核(修改额度)

export const fkresultconfig = params => { return http.post('/riskmgr/fkresultconfig',params) };   //风控结果配置
export const updatefkresultconfig = params => { return http.post('/riskmgr/updatefkresultconfig',params) };   //修改风控结果配置

export const threshold = params => { return http.post('/bizalert/threshold',params) };   //获取阈值
export const editthreshold = params => { return http.post('/bizalert/editthreshold',params) };   //设置阈值

export const collectionlist = params => { return http.post('/collection/list',params) };   //获取催收列表
export const collectionhandle = params => { return http.post('/collection/handle',params) };   //添加催记
export const collectionallow = params => { return http.post('/collection/list/allow',params) };   //催收批量分配
export const colloperatordata = params => { return http.post('/collection/operatordata',params) };   //常用联系人（运营商数据）
export const signlinkman = params => { return http.post('/collection/signlinkman',params) };   //紧急联系人标记
export const signtelephone = params => { return http.post('/collection/signtelephone',params) };   //手机通讯录标记
export const signcommonlinkman = params => { return http.post('/collection/signcommonlinkman',params) };   //常用联系人标记
export const usertoblack = params => { return http.post('/collection/add/user/to/back',params) };   //提交入黑
export const repaymentuserinfo = params => { return http.post('/collection/repayment/userinfo',params) };   //获取全局代扣信息

export const ofccmpninfo = params => { return http.post('/ofc/cmpninfo',params) };   //商户信息-企业信息
export const websetappinfo = params => { return http.post('/ofc/websetappinfo',params) };   //商户信息产品标识详情
export const editwebsetapp = params => { return http.post('/ofc/editwebsetapp',params) };   //编辑商户信息产品标识

export const websetpageinfo = params => { return http.post('/ofc/websetpageinfo',params) };   //官网设置详情
export const editwebsetpage = params => { return http.post('/ofc/editwebsetpage',params) };   //编辑官网配置

export const collectionreturnlist = params => { return http.post('/collection/return/list',params) };   //获取催回查看列表

export const calllist = params => { return http.post('/usersmetadata/call/list',params) };   //获取客服列表
export const calllinkrecord = params => { return http.post('/usersmetadata/call/link/record',params) };   //客服联系历史
export const callremark = params => { return http.post('/usersmetadata/call/remark',params) };   //客服备注

export const callallow = params => { return http.post('/usersmetadata/call/allow',params) };   //客服分配

export const protsetinfo = params => { return http.post('/prot/setinfo',params) };   //协议配置详情
export const proteditset = params => { return http.post('/prot/editset',params) };   //编辑协议配置

export const fkshowtemplate = params => { return http.post('/fk/showtemplate',params) };   //显示模板
export const fksavetemplate = params => { return http.post('/fk/savetemplate',params) };   //保存模板
export const fkresettemplate = params => { return http.post('/fk/resettemplate',params) };   //重置模板

export const loglist = params => { return http.post('/updatelog/loglist',params) };   //更新日志list

export const ispermission = params => { return http.post('/sysuser/ispermission',params) };   //账号管理重置密码按钮权限

export const setcall = params => { return http.post('/product/set/call',params) };   //AI智能语音催收设置
export const callswitch = params => { return http.post('/product/call/switch',params) };   //获取AI智能语音催收设置

export const collectioncall = params => { return http.post('/collection/call',params) };   //AI智能语音催收列表
export const collectioncallorder = params => { return http.post('/collection/call/order',params) };   //AI智能语音话费账单

export const lossuserlist = params => { return http.post('/usersmetadata/loss/user/list',params) };   //流失用户list

export const sourcedata = params => { return http.post('/channelmanagement/sourcedata',params) };   //运营-渠道数据
export const sourceoverduedata = params => { return http.post('/channelmanagement/sourceoverduedata',params) };   //运营-渠道逾期
export const loanswitch = params => { return http.post('/appset/no/loan/switch',params) };   //AI智能语音从未借款
export const setloanswitch = params => { return http.post('/appset/set/no/loan/switch',params) };   //AI智能语音从未借款设置

export const aiexplain = params => { return http.post('/appset/aiexplain',params) };   //AI智能语音介绍

export const  indexpost= params => { return http.post('/updatelog/have',params) };   //获取更新日志UpdateLogId
export const  logdetail= params => { return http.post('/updatelog/logdetail',params) };   //获取更新日志明细
export const  updatenotice= params => { return http.post('/sysuser/updatenotice',params) };   //功能日志更新为已读
export const oneadd = params => { return http.post('/namelib/oneadd',params) };   //单条黑或白名单加入

export const loginlog = params => { return http.post('/sysuser/login/log',params) };   //登录日志列表
export const aishow = params => { return http.post('/sysuser/aishow',params) };   //AI LOGO是否显示
export const morerepayment = params => { return http.post('/collection/more/repayment',params) };   //批量代扣
export const morerepaymentlist = params => { return http.post('/collection/more/repayment/list',params) };   //批量代扣list



