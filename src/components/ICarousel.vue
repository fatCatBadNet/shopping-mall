<template>
	<div id="ICarousel" :style="{width:width+'px'}">
		<ul class="inner-container">
			<li :style="{lineHeight:height+'px'}" v-for="(item,index) in contextList" :key="index">{{item}}</li>
			<li :style="{lineHeight:height+'px'}" >{{contextList[0]}}</li>
		</ul>
	</div>
</template>
<script>
let timers;
export default {
    props:{
        contextList:{
            type:Array,
            default:['快速提高用户按时还款率的秘诀>>11111','快速提高用户按时还款率的秘诀>>22222']
        },
        width:{
            type:Number,
            default:300
        },
        height:{
            type:Number,
            default:44
        },
        autoPlay:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return {
			
        }
    },
    mounted() {
		
    },
    methods: {
		
    },
}
</script>
<style lang="scss" scoped>
    #ICarousel{ display:inline-block;  height:100%; overflow:hidden; position:relative;
		.inner-container{
			animation:myMove2 3s linear infinite;
			animation-fill-mode:forwards;
			cursor:pointer;
		}
		.inner-container:hover{
			animation-play-state:paused;
		}
		/*文字停顿滚动*/
		@keyframes myMove2{
			0%{ transform:translateY(0); }
			25%{ transform:translateY(-44px); }
			50%{ transform:translateY(-44px); }
			75%{ transform:translateY(-88px); }
			100%{ transform:translateY(-88px); }
		}
    }
</style>
