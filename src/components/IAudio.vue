<template>
    <div>
         <el-dialog  v-if="showAble" title="录音" :visible="showAble" :close-on-click-modal="true" @close="handleClose" :center="true" v-dialogDrag custom-class="dialogclass" width="500px">
			<div style="text-align: center;">
                <audio controls="controls">  
                    <source :src="src">
                </audio> 
            </div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleClose">关闭</el-button>
			</div>
		</el-dialog>

    </div>    
</template>
<script>
export default {
    props:{
        src:{
            type:String,
            default:''
        },
        showAble:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return {

        }
    },
    methods: {
        handleClose(){
            this.showAble = false;
        }
    },
    watch: {
        showAble(){
            this.$emit('update:showAble',this.showAble);
        }
    },
}
</script>
<style lang="scss" scoped>

</style>



