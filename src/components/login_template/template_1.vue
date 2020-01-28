<template>
    <div class="template_container">
        <el-col :span="8" style="flex:0 0 400px; width:400px; height:100%;">
			<el-carousel :interval="4000" arrow="never" style="width:100%; height:100%;">
			    <el-carousel-item class="swiper1"></el-carousel-item>
			    <el-carousel-item class="swiper2"></el-carousel-item>
			</el-carousel>
		</el-col>
        <el-col :span="16" style="flex:1; height:100%; position:relative;">
            <div class="form_container">
                <slot></slot>
            </div>
        </el-col>
    </div>
</template>
<script>
export default {
    data() {
        return {
            
        }
    },
}
</script>

<style lang="scss" scoped>
    .template_container{
        display:flex; width:100%; height:100%; min-width:1200px; min-height:800px; position:relative; overflow:hidden;
        .swiper1{ height:100%; background:url(https://static.****.com/static/img/swiper1.png) no-repeat center center; background-size:cover; }
	    .swiper2{ height:100%; background:url(https://static.****.com/static/img/swiper2.png) no-repeat center center; background-size:cover; }
        .form_container{
             width:350px; padding:35px 35px 20px; position:absolute; top:29%; left:50%; margin-left:-175px; z-index:100;
	    }
    }
    
    
</style>

