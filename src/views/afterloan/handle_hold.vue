<template>
	<div>
		<el-card class="box-card">
			<div slot="header" class="header">
                <el-upload drag :action="uploadUrl+'/collection/repay/input/execl'" :data="{Merchant:merchant,Account:account,Token:token}" name="file" method:="post" :before-upload="addUpload" :on-success="handleSuccess" :show-file-list="false">
                    <template v-if="!fileName">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>上传文件</em></div>
                    </template>
                    <template>
                        <span style="line-height:150px;">{{fileName}}</span>
                    </template>
					<div class="el-upload__tip" slot="tip" style="font:13px/26px '微软雅黑'; display:inline-block;vertical-align: text-bottom;">
						<span style="display:inline-block; width:8px; height:8px; background:#999; border-radius:100%; margin:-2px 5px 0 30px;"></span>
						<span>支持文件类型</span>
						<span style="color:red;">xlsx</span> 
						<br />
						<span style="display:inline-block; width:8px; height:8px; background:#999; border-radius:100%; margin:-2px 5px 0 30px;"></span>
						<span>文件大小不得超过</span>
						<span style="color:red;">3MB</span>
					</div>
                </el-upload>
                <el-form ref="formLabelAlign" :label-position="labelPosition" label-width="120px" style="width:400px;" :model="formLabelAlign" :rules="rules">
                    <el-form-item prop="RepayNum" label="上传用户数：" style="padding-top:34px;">
                        <div style="display:inline-block;margin:0 18px;">{{formLabelAlign.RepayNum}}</div>
                        <el-button v-if="isShowCanncelBtn" type="text" size="mini" @click="cancelUpLoad">取消上传</el-button>
                    </el-form-item>
                    <el-form-item prop="ReturnMoney" label="代扣金额：" style="padding:20px 0;">
                        <el-input v-model="formLabelAlign.ReturnMoney" style="width:200px;" placeholder="输入代扣金额"></el-input> 元
                    </el-form-item>
                    <el-form-item >
                        <el-button type="primary" size="small" @click="submitBtn">确认代扣</el-button>
                    </el-form-item>
                </el-form>
			</div>
            <h3 style="margin-bottom:20px;">代扣记录</h3>
            <el-table :data="tableData"  element-loading-text="数据加载中..." border >
				<el-table-column prop="CreateTime" label="代扣日期" ></el-table-column>
				<el-table-column prop="ReturnMoney" label="代扣金额" ></el-table-column>
				<el-table-column prop="RepaymenSuccess" label="成功人数" ></el-table-column>
				<el-table-column prop="RepaymenFail" label="失败人数" ></el-table-column>
				<el-table-column prop="RepaymenConfirm" label="结果确认中" ></el-table-column>
				<el-table-column label="下载用户列表" min-width="150">
					<template slot-scope="scope">
						<el-button type="primary" plain size="mini" @click="exportexcel(scope.row,'SUCCESS')">成功用户</el-button>
						<el-button type="primary" plain size="mini" @click="exportexcel(scope.row,'FAIL')">失败用户</el-button>
						<el-button type="primary" plain size="mini" @click="exportexcel(scope.row),'CONFIRM'">确认用户</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
import http from "api/http.js";
import { morerepayment, morerepaymentlist} from 'api/api.js';
    export default {
        data() {
            return {
                fileName:'',
                uploadUrl:process.env.API_ROOT,
                merchant:JSON.parse(sessionStorage.getItem('userDtl')).Merchant,
				account:JSON.parse(sessionStorage.getItem('userDtl')).Account,
				token:sessionStorage.getItem('Token'),
                isShowCanncelBtn:false,
                formLabelAlign:{
                    RepayNum:0,
                    ReturnMoney:null,
                    RepayMoreLoanS:[],
                },
                rules:{
                     ReturnMoney: [
						{ validator:(rule, value, callback) => {
							if (value === '' || value === null) {
								callback(new Error('请输入代扣金额'));
							}else{
								if( /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)){
									callback();
								}else{
									callback(new Error('请输入正确的代扣金额'));
								}
							}
						}, trigger: 'blur' }
                    ],
                },
                tableData:[]
            }
        },
        mounted() {
            this.getmorerepaymentlist();
        },
        methods: {
            addUpload(file){
                const isLt2M = file.size / 1024 / 1024 < 3;
		        if( file.name.indexOf('.xlsx')==-1 ){
		        	this.$message.error('上传文件格式只能是.xlsx');
		        	return false;
                }
                if (!isLt2M) {
                    this.$message.error("上传文件大小不能超过 3MB!");
                    return false;
                }
            },
            exportexcel(row,state){ 
                window.location.href = `${process.env.API_ROOT}/export/more/repay/outexecl?merchant=${JSON.parse( sessionStorage.getItem('userDtl')).Merchant}&Account=${JSON.parse( sessionStorage.getItem('userDtl')).Account}&CreateTime=${row.CreateTime}&State=${state}`
		   	},
            handleSuccess(res,file){ 
	      		console.log(res);
	      		if( res.Ret==200 ){
	      			this.$message.success( res.Msg );
                    this.formLabelAlign.RepayNum = res.UserNum;
                    this.formLabelAlign.RepayMoreLoanS = res.RepayMoreLoanS;
                    this.fileName = res.FileName;
                    this.isShowCanncelBtn = true;

	      		}else{
	      			this.$message.error( res.Msg );
	      		}
            },
            submitBtn(){
                if( this.formLabelAlign.RepayNum<=0 ){
                    this.$message.error('请上传用户');
                    return false;
                }
                this.$refs.formLabelAlign.validate((valid) => {
                    if( valid ){
                        let params = {
                            RepayNum : this.formLabelAlign.RepayNum,
                            ReturnMoney : Number(this.formLabelAlign.ReturnMoney),
                            RepayMoreLoanS : this.formLabelAlign.RepayMoreLoanS
                        };
                        morerepayment(params).then(res=>{
                            if(res.Ret == 200){
                                this.$message.success(res.Msg);
                                this.$refs.formLabelAlign.resetFields();
                                this.fileName = '';
                                this.isShowCanncelBtn = false;
                                this.getmorerepaymentlist();
                                
                            }
                        })
                    }
                });
            },
            getmorerepaymentlist(){
                morerepaymentlist({}).then(res=>{
                    if(res.Ret == 200){
                        this.tableData = res.List || [];
                    }
                })
            },
            cancelUpLoad(){  //取消上传
                this.fileName = '';
                this.isShowCanncelBtn = false;
				this.formLabelAlign.RepayNum=0;
		   	}
        },
       
    }

</script>

<style scoped lang="scss">
	.header .el-form-item{ margin-bottom:0; }
</style>