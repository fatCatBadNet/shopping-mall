<template>
	<div id="container">
		<div id="header">
			<el-tooltip effect="light" content="返回首页" placement="top">
				<div class="logo" :class="collapsed?'logo-collapse-width':'logo-width'" @click="backmain" v-show="!collapsed">
					<!-- <img :src="HomeLogo"> -->
					<h4 style="margin-top:10px;">商户后台管理</h4>
				</div> 
			</el-tooltip>
			<!--<div class="logo" :class="collapsed?'logo-collapse-width':'logo-width'" @click="backmain">{{collapsed?'':sysName}}</div>-->
			<div class="logoright">
				<div class="tools" @click.prevent="collapse"><i class="fa fa-align-left"></i></div>
				<div class="userinfo">
					<el-tooltip effect="dark" content="更改系统主题色" placement="top">
						<el-color-picker class="theme-picker" size="small" popper-class="theme-picker-dropdown" :predefine="predefineColors" v-model="themeVal"></el-color-picker>
					</el-tooltip>
					<el-tooltip class="item" effect="dark" content="更新日志" placement="top">
						<i class="el-icon-date log_btn" style="font-size:22px; vertical-align:middle; cursor:pointer; margin-right:20px;" @click="goDataLog"></i>
					</el-tooltip> 
					<el-dropdown trigger="hover">
						<span class="el-dropdown-link userinfo-inner"><img src="../assets/img/userLogo.png" />{{sysUserName}}</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item divided @click.native="resetpwd">修改密码</el-dropdown-item>
							<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</div>
		</div>
		<div id="main">
			<aside :class="[collapsed?'menu-collapsed':'menu-expanded',issafariBrowser?'safariStyle':'']" style="margin-top: -40px;">
				<!--导航菜单-->
				<el-menu style="padding-bottom:130px;" background-color="#344058" text-color="#fff" :default-active="$route.matched[1].path" theme="light" unique-opened router class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect" v-if="!collapsed" ref="expandmenu">
					<template v-for="(item,index) in navlists" v-if="item.hidden==0">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.ico"></i><span style="display:inline-block; width:96px; text-align:left; padding-left:10px; box-sizing:border-box;">{{item.name}}</span></template>
							<el-menu-item v-for="child in item.children" :index="child.path" :path="child.path" :key="child.path" v-if="child.hidden==0">{{child.name.toUpperCase()}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconcls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
				<!--导航菜单-折叠后-->
				<ul class="el-menu el-menu-vertical-demo collapsed" ref="menuCollapsed" v-if="collapsed" style="padding-bottom:130px;">
					<li v-for="(item,index) in navlists" v-if="item.hidden==0" class="el-submenu item">
						<template>
							<div class="el-submenu__title" style="padding-left:20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.ico"></i></div>
							<ul class="el-menu submenu" style="background:#fff; box-shadow:0 0 8px #344058 inset; overflow:hidden;" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)" @click="showMenu(index,false)"> 
								<li style="width:100%; font:16px/50px '微软雅黑'; text-align:center; color:#409EFF; border-bottom:1px solid #eaeaea; position:absolute; top:0;">{{item.name}}</li>
								<li v-for="child in item.children" v-if="child.hidden==0" :key="child.path" class="el-menu-item" :class="$route.matched[1].path==child.path?'is-active':''" @click="$router.push(child.path)" style="padding-left:40px;">{{child.name.toUpperCase()}}</li>
							</ul>
						</template>
					</li>
				</ul>
				<div v-if="Count == 2 && !Flag && !collapsed" class="AI_enter">
					<img src="~@/assets/img/banner.png" alt="" @click="handleView">
					<div class="click_btn" @click="getaishow({State:'OFF'})"></div>
				</div>
				<div v-if="Count == 2 && !Flag && collapsed" class="AI_enter AI_enter2">
					<img src="~@/assets/img/banner.png" alt="" @click="handleView">
					<div class="click_btn" @click="getaishow({State:'OFF'})"></div>
				</div>
			</aside>
			<section class="content-container" id="displayMain" ref="displayMain">
				<el-row class="grid-content bg-purple-light content" style="min-width:1600px;">
					<el-col :span="24" class="breadcrumb-container" style="position:relative;">
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path" :to="{path:item.path}">{{ item.name.toUpperCase() }}</el-breadcrumb-item>
						</el-breadcrumb>
						<div class="note_entrance" v-if="!Flag">
							<!-- <img src="~@/assets/img/horn.png" alt=""> -->
							<!-- <div id="ICarousel">
								<ul class="inner-container">
									<li @click="handleView" :style="{lineHeight:'44px'}" v-for="(item,index) in contextList" :key="index">{{item}}</li>
									<li @click="handleView" :style="{lineHeight:'44px'}" >{{contextList[0]}}</li>
								</ul>
							</div> -->
						</div>
					</el-col>
					<el-col :span="24" style="display:none;" :class="breadcrumbFixed&&collapsed==false?'breadFixed':breadcrumbFixed&&collapsed==true?'breadCollapsedFixed':''" id="breadcrumb">
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path" :to="{path:item.path}">{{ item.name.toUpperCase() }}</el-breadcrumb-item>
						</el-breadcrumb>
						<div class="note_entrance" v-if="!Flag">
							<!-- <img src="~@/assets/img/horn.png" alt=""> -->
							<!-- <div id="ICarouselFixed">
								<ul class="inner-container">
									<li @click="handleView" :style="{lineHeight:'40px'}" v-for="(item,index) in contextList" :key="index">{{item}}</li>
									<li @click="handleView" :style="{lineHeight:'40px'}" >{{contextList[0]}}</li>
								</ul>
							</div> -->
						</div>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</el-row>
			</section>
			<!-- 新功能提醒 -->
			<el-dialog title="新功能提醒" :visible.sync="showNoteDetail" :close-on-click-modal="true" :center="true" v-dialogDrag custom-class="dialogclass" width="600px">
				<div v-html="noteDetail">

				</div>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click.native="infoSubmit">我知道了</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import { getnavlist,loginconf,indexpost, logdetail, updatenotice, aishow } from "api/api.js"
	import http from "api/http.js"
	import MenuUtils from 'utils/MenuUtils.js'
	import theme from "@/mixins/theme.js";
	export default {
		mixins:[theme()],
		data() {
			return {
				Count:1,// 显示剩余次数 2-显示AI 1-不显示
				Flag:false, //ture-支持AI语音 fasle-不支持AI语音
				contextList:['快速提高用户按时还款率的秘诀>>','通话账单用于显示语音机器人的提醒记录，点击了解语音机器人>>'],
				showNoteDetail:false,//是否显示日志明细弹出
				noteDetail:'',
				HomeLogo:'首页',
				predefineColors:['#409EFF','#ff4500','#ff8c00','#ffd700','#90ee90','#00ced1','#c71585'],
				chalk: "",
				breadcrumbFixed:false,  //吸顶固定
				sysName:'管理系统',
				collapsed: false,
				issafariBrowser:/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
				sysUserName:'',
				sysUserAvatar:'',
				form:{
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				navlists:this.$router.options.routes
			}
		},
		created(){
			loginconf({Domain:window.location.href}).then(res => {
				if( res.Ret==200 ){
					if( res.Rst.Title ){
						document.title=res.Rst.Title;
					}
					if( res.Rst.AppIconUrl ){
						document.getElementById('icon').href=res.Rst.AppIconUrl;
					}
					if( res.Rst.HomeLogo ){
						this.HomeLogo=res.Rst.HomeLogo;
					}
					sessionStorage.setItem('rst',JSON.stringify(res.Rst));
				}
			});
			let isLoadNodes = sessionStorage.getItem('isLoadNodes');
			if( !isLoadNodes ){
				let data = JSON.parse(window.sessionStorage.getItem('menudata'));
				sessionStorage.setItem('isLoadNodes','true');
			}
		},
		mounted() {
			if( screen.width<=1024 ){  //移动端适配
				this.collapsed=true;
			}
			var user = sessionStorage.getItem('userDtl');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user.Account || '';
				this.sysUserAvatar = "../assets/user.png";
			}
			document.getElementById("displayMain").addEventListener('scroll',this.handleScroll);
			this.getUpdateLogId();
			this.getaishow();
		},
		methods: {
		getaishow(params = {}){
			aishow(params).then(res=>{
				if(res.Ret == 200 ){
					// this.Count = res.Count;
					// this.Flag = res.Flag;
				}
			})
		},
		handleView(){
				let {href} = this.$router.resolve({path:`/robotIntroduction`});
				window.open(href,'_blank');
			},
		getUpdateLogId(){
			indexpost({}).then(res=>{
					if(res.Ret == 200){
						if(res.UpdateLogId > 0){
							console.log(11111111111);
							this.getlogdetail(res.UpdateLogId)
						}

					}
				})
			},
			getlogdetail(id){
				logdetail({Id:id}).then(res=>{
					console.log(222222,res);
					if(res.Ret == 200){
						this.noteDetail = res.Data.UpdateContent;
						this.showNoteDetail = true;
					}
				})
			},
			infoSubmit(){
				updatenotice({}).then(res=>{
					if(res.Ret == 200){
						this.showNoteDetail = false;
					}
				})
			},
			goDataLog(){ //跳转到更新日志页面
				this.$router.push({path:'/datalog'});
			},
		    historyBack(){  //返回上一页
		    	if( sessionStorage.historyUrl ){
		    		this.$router.replace( sessionStorage.historyUrl );
		    	}
		    },
		    backmain(){  //回到首页
		    	this.$router.push({path:'/main'});
		    },
		    resetpwd(){  //修改密码
		    	this.$router.push({path:'/resetpsd'});
		    },
			onSubmit(){  },
			handleopen(){  },
			handleclose(){  },
			handleselect:function(a,b){ 
//				console.log( a,b,this.$router.history.current.fullPath );
				if( a==this.$router.history.current.fullPath ){
					window.location.reload();
				}
			},
			logout:function(){  //退出登录
				var that = this;
//				this.$confirm('确认退出吗?','提示',{
//					type:'warning'
//				}).then(() => {
					sessionStorage.removeItem('userDtl');
					sessionStorage.removeItem('meundata');
					sessionStorage.removeItem('Xtn');
					sessionStorage.removeItem('isLoadNodes');
					sessionStorage.removeItem('Token');
					that.$router.push('/login');
//				}).catch(() => {  });
			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			//折叠导航栏状态，控制副导航显示消失
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			},
			handleScroll(){  //页面滚动监听
				let mainDiv=document.getElementById("displayMain");
				var scrollTop = mainDiv.scrollTop;
				if( scrollTop>80 ){
		        	this.breadcrumbFixed = true;
		        }else{
		        	this.breadcrumbFixed = false;
		        }
			}
		}
	}
</script>

<style scoped lang="scss">
	#container{ width:100%; position:absolute; top:0px; bottom:0px;
		#header{ display:flex; width:100%; height:59px; line-height:59px; background:#fff; color:#000; border-bottom:1px solid #eaeaea;
			.logo{ height:60px; color:#fff; text-align:center; background:#333f54; overflow:hidden;
				img{ height:38px; margin:15px auto 0; }
			}
			.logo-width{ flex:0 0 148px; width:148px; font:16px/60px "微软雅黑"; cursor:pointer; }
			.logo-collapse-width{ flex:0 0 58px; width:58px; }
			.logoright{ flex:1; overflow:hidden;
				.tools{ float:left; padding:0px 23px; width:14px; height:60px; line-height:60px; cursor:pointer; }
				.userinfo{ float:right; width:300px; height:60px; text-align:right; overflow:hidden; position:relative; margin-right:4%;
					.theme-picker{ position:absolute; top:14px; left:0px; }
					.item{ padding:4px; position:absolute; top:14px; left:110px; border:1px solid #ccc; border-radius:4px; }
					.item:hover{ color:#409EFF; }
					.userinfo-inner{ cursor:pointer; color:#000; overflow:hidden;
						img{ width:40px; height:40px; border-radius:20px; margin:10px; float:left; }
					}
					.userinfo-inner:hover{ color:#409EFF; }
				}
			}
		}
		#main{ display:flex; width:100%; position:absolute; top:60px; bottom:0px; background:none; overflow:hidden;
			aside{ height:100%; text-align:center; z-index:10; margin-left:-1px;
				.el-menu{ width:150px; height:100%; padding-top:49px; box-sizing:border-box; }
				.collapsed{ width:59px; background:#344058;
					.item{ position:relative; }
					.submenu{ position:absolute; top:0px; left:58px; z-index:99999; height:auto; display:none; }
				}
			}
			.menu-expanded{ flex:0 0 149px; width:149px; overflow:hidden; }
			.menu-expanded>.el-menu-vertical-demo{ width:210px; height:100%; overflow-y:scroll; margin-left:-15px; }
			.menu-collapsed{ flex:0 0 60px; width:60px; }
			.safariStyle{ border-right:none; margin-left:-1px; }
			.content-container{ flex:1; width:100%; background:#f9f9f9; overflow-y:scroll; position:relative;
				.content{ width:100%; overflow:auto;
					.breadcrumb-container{ padding:12px 20px; box-sizing:border-box; line-height:18px; border-bottom:1px solid #eaeaea; margin-bottom:10px; 
						.title{ width:150px; color:#475669; float:left; }
						.breadcrumb-inner{ font:14px/19px "微软雅黑"; }
					}
					.breadFixed{ display:block !important; background:rgb(255,255,255); border-bottom:1px solid #eaeaea; padding:13px 245px 12px 20px; box-sizing:border-box; position:fixed; top:60px; left:150px; right:0; z-index:10; overflow:hidden; }
					.breadCollapsedFixed{ display:block !important; background:rgb(255,255,255); border-bottom:1px solid #eaeaea; padding:15px 105px 15px 25px; box-sizing:border-box; position:fixed; top:60px; left:60px; right:0; z-index:10; }
					.content-wrapper{ width:100%; padding:0 12px 20px; box-sizing:border-box; overflow:auto; }
					.note_entrance{ display:inline-block; position:absolute; right:20px; top:50%; height:100%; transform:translateY(-50%);
						>img{ width:20px; margin-right:5px; vertical-align:middle; }
					}
				}
			}
		}
	}
	#ICarousel{ display:inline-block; width:auto; height:100%; overflow:hidden; position:relative; vertical-align:middle;
		.inner-container{ animation:myMove1 6s linear infinite; animation-fill-mode:forwards; cursor:pointer; }
		.inner-container:hover{ animation-play-state:paused; }
		@keyframes myMove1{  /*文字停顿滚动*/
			0%{ transform:translateY(0); }
			25%{ transform:translateY(-44px); }
			50%{ transform:translateY(-44px); }
			75%{ transform:translateY(-88px); }
			100%{ transform:translateY(-88px); }
		}
	}
	#ICarouselFixed{ display:inline-block; width:600px; height:40px; margin-top:1px; overflow:hidden; position:relative; vertical-align:middle;
		.inner-container{ animation:myMove2 6s linear infinite; animation-fill-mode:forwards; cursor:pointer; }
		.inner-container:hover{ animation-play-state:paused; }
		@keyframes myMove2{  /*文字停顿滚动*/
			0%{ transform:translateY(0); }
			25%{ transform:translateY(-40px); }
			50%{ transform:translateY(-40px); }
			75%{ transform:translateY(-80px); }
			100%{ transform:translateY(-80px); }
		}
	}
	.AI_enter{ width:148px; cursor:pointer; position:absolute; bottom:-2px; left:0; z-index:10;
		img{ width:100%; }
		.click_btn{ position:absolute; top:0; right:0; padding:10px; }
	}
	.AI_enter2{ width:57px; position:absolute; bottom:-2px; left:0; z-index:10; }
</style>