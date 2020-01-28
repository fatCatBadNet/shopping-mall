<template>
	<div>
		<el-tabs v-model="activeName">
			<!-- <el-tab-pane label="风控配置" name="风控配置">
				<riskmgrset></riskmgrset>
			</el-tab-pane> -->
			<el-tab-pane label="配置管理" name="配置管理" v-if="false">
				<giveoutset></giveoutset>
			</el-tab-pane>
		    <el-tab-pane label="短信配置" name="短信配置">
				<msgset></msgset>
		    </el-tab-pane>
			<el-tab-pane label="系统消息" name="系统消息">
				<systemmsg></systemmsg>
			</el-tab-pane>
			<el-tab-pane label="推送配置" name="推送配置" v-if="false">
				<apppush></apppush>
			</el-tab-pane>
			<el-tab-pane label="业务控制" name="业务控制">
				<operacontrol></operacontrol>
			</el-tab-pane>
			<el-tab-pane label="风控结果配置" name="风控结果配置" v-if="false">
				<fkconfig></fkconfig>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import riskmgrset from '@/views/setting/risksetting/risksetting.vue';
	import giveoutset from '@/views/setting/giveoutset.vue';
	import msgset from '@/views/setting/sms_template.vue';
	import systemmsg from '@/views/setting/system_msg.vue';
	import apppush from '@/views/setting/app_push.vue';
	import operacontrol from '@/views/setting/opera_control.vue';
	import fkconfig from '@/views/risk_manage/fkconfig.vue';
	export default {
		data() {
			return {
				activeName:"短信配置"
			}
		},
		mounted() {
			
		},
		methods: {
			
		},
		components:{ riskmgrset,giveoutset,msgset,systemmsg,apppush,operacontrol,fkconfig }
	}
</script>

<style scoped lang="scss"></style>