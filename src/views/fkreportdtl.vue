<template>
	<div id="fkreportdtl">
		<div id="content">
			<h1>详细报告</h1>
			<a id="a1" name="1"></a>
			<identify :uid="uid"></identify>
			<a id="a2" name="2"></a>
			<!-- <fkreport :uid="uid"></fkreport> -->
			<a id="a3" name="3"></a>
			<phoneoperators :uid="uid" style="padding-top:40px;"></phoneoperators>
			<a id="a4" name="4"></a>
			<tjtaobao :uid="uid" @isshowtaobao="isshowtaobao" style="padding-top:40px;"></tjtaobao>
			<div class='time'>
				<div class='text-content'>
					<div class='time-line'>
						<div v-for='item in testList' :key="item.key" class='time-line-div'>
							<p><i class="fa fa-hand-o-right" aria-hidden="true" v-if="item.key==stepActive"></i></p>
							<p ref='circular' :style="{background:item.key==stepActive?'#5CB85C':'#ccc'}"></p>
							<p :style="{background:item.key==stepActive?'#317EF3':'#ccc'}" @click="goSection(item.key)">{{item.text}}</p>
						</div>
						<div class='img-dotted' ref='dotted'></div>
					</div>
					<button @click="goSection(1)" style="border:none; position:absolute; left:130px; padding:10px; color:#fff; border-radius:5px; cursor:pointer; background:green;">返回顶部</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import identify from '@/components/userDtl/identify.vue';
	import fkreport from '@/components/userDtl/oldfkreport.vue';
	import phoneoperators from '@/components/userDtl/phoneoperatorsNew.vue';
	import tjtaobao from '@/components/userDtl/tjtaobao.vue';
	export default {
		props:['uid'],
		data() {
			return {
				// uid:this.$route.params.id,
				stepActive:1,
				testList:[
					{key:'1',time:'',text:'实名认证'},
					// {key:'2',time:'',text:'风控报告'},
					{key:'3',time:'',text:'运营商报告'},
					// {key:'4',time:'',text:'淘宝报告'}
				]
			}
		},
		mounted() {
			let that=this;
			this.$refs.dotted.style.left = this.$refs.circular[0].offsetLeft - 12 + 'px'
			document.getElementById("fkreportdtl").addEventListener('scroll',function(){
				let mainDiv=document.getElementById("fkreportdtl");
				let a1=document.getElementById("a1").offsetTop-screen.height/3;
				let a2=document.getElementById("a2").offsetTop-screen.height/3;
				let a3=document.getElementById("a3").offsetTop-screen.height/3;
				let a4=document.getElementById("a4").offsetTop-screen.height/3;
				var scrollTop = mainDiv.scrollTop;
				if( scrollTop<a2 ){
					that.stepActive=1;
				}else if( scrollTop>=a2&&scrollTop<a3 ){
					that.stepActive=2;
				}else if( scrollTop>=a3&&scrollTop<a4 ){
					that.stepActive=3;
				}else if( scrollTop>=a4 ){
					that.stepActive=4;
				}
				// console.log( a1,a2,a3,scrollTop,that.stepActive );
			});
		},
		components:{ identify,fkreport,phoneoperators,tjtaobao },
		methods:{
			isshowtaobao(){
				this.testList.push({key:'4',time:'',text:'淘宝报告'});
			},
			goSection:function(step){
				this.stepActive=step;
				document.getElementById("fkreportdtl").scrollTo(0,document.getElementById("a"+step).offsetTop); 
			}
		}
	}
</script>

<style scoped lang="scss">
	#fkreportdtl{ width:100%; min-width:1100px; height:100%; min-height:100%; overflow-y:scroll;
		#content{ padding:20px 8%; background:#fff; position:relative; overflow:auto;
			>h1{ font:24px "楷体"; color:red; text-align:center; }
			.time{ width:240px; height:300px; position:fixed; right:20px; top:50%; margin-top:-150px; z-index:100; }
			.time-line{ position:relative; width:240px; margin:0 auto; }
			.time-line-div{ position:relative; min-height:85px; }
			.time-line-div>p:nth-child(1){ position:absolute; left:0; width:100px; text-align:right; font:26px/40px '微软雅黑';
				>i{ margin-right:5px; }
			}
			.time-line-div>p:nth-child(2){ position:absolute; top:10px; left:100px; width:15px; height:15px; border-radius:50%; z-index:10; }
			.time-line-div>p:nth-child(3){ position:absolute; left:130px; padding:10px; color:#fff; border-radius:5px; cursor:pointer; }
			.img-dotted{ position:absolute; width:20px; height:100%; top:0; z-index:1; background:url('~@/assets/img/dotted.png'); }
		}
	}
</style>