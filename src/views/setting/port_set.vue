<template>
    <section class="page-set">
        
            <el-form ref="form" :model="form" label-width="120px" label-position="right" :rules="rules" v-loading="loading">
                
                 <el-card style="box-shadow:none; box-sizing:border-box; border:1px solid #EAEAEA; padding:0 10px; margin-bottom:10px;">
                     <div slot="header" class="clearfix" style="color:#101010;">
                    <span class="header-left">填写参数</span>
                    </div>
                    <el-form-item prop="Appname">
                        <div slot="label" class="label-slot">
                            <span>APP名称：</span>
                        </div>
                        <el-input v-model="form.Appname" placeholder="请输入" auto-complete="off" style="width:200px;" @blur="handleBlur"></el-input>
                    </el-form-item>
                    <el-form-item prop="Name">
                        <div slot="label" class="label-slot">
                            <span>公司全称：</span>
                        </div>
                        <el-input v-model="form.Name" placeholder="请输入" auto-complete="off" style="width:200px;" @blur="handleBlur"></el-input>
                    </el-form-item>
                    <el-form-item prop="Ipgp">
                        <div slot="label" class="label-slot">
                            <span>公司简称：</span>
                        </div>
                        <el-input v-model="form.Ipgp" placeholder="请输入" auto-complete="off" style="width:200px;" @blur="handleBlur"></el-input>
                    </el-form-item>
                    <el-form-item prop="OpenBankAcntname">
                        <div slot="label" class="label-slot">
                            <span>开户银行户名：</span>
                        </div>
                        <el-input v-model="form.OpenBankAcntname" placeholder="请输入" auto-complete="off" style="width:200px;" @blur="handleBlur"></el-input>
                    </el-form-item>
                    <el-form-item prop="OpenBankAccount">
                        <div slot="label" class="label-slot">
                            <span>开户银行账号：</span>
                        </div>
                        <el-input v-model="form.OpenBankAccount" placeholder="请输入" auto-complete="off" style="width:200px;" @blur="handleBlur"></el-input>
                    </el-form-item>
                    <el-form-item prop="OpenBank">
                        <div slot="label" class="label-slot">
                            <span>开户银行：</span>
                        </div>
                        <el-input v-model="form.OpenBank" placeholder="请输入" auto-complete="off" style="width:200px;" @blur="handleBlur"></el-input>
                        <span style="color:#84909D;"> (如"中国工商银行温州城西支行")</span>
                    </el-form-item>
                    <el-form-item prop="AlipayAccount">
                        <div slot="label" class="label-slot">
                            <span>支付宝账号：</span>
                        </div>
                        <el-input v-model="form.AlipayAccount" placeholder="请输入" auto-complete="off" style="width:200px;" @blur="handleBlur"></el-input>
                        <span style="color:#84909D;">（便于借款用户使用支付宝进行还款）</span>
                    </el-form-item>
                    <el-form-item prop="CustserPhone">
                        <div slot="label" class="label-slot">
                            <span>客服电话：</span>
                        </div>
                        <el-input v-model="form.CustserPhone" placeholder="请输入" auto-complete="off" style="width:200px;" @blur="handleBlur"></el-input>
                        
                    </el-form-item>
                    <el-form-item prop="CustserQq">
                        <div slot="label" class="label-slot">
                            <span>客服QQ：</span>
                        </div>
                        <el-input v-model="form.CustserQq" placeholder="请输入" auto-complete="off" style="width:200px;" @blur="handleBlur"></el-input>
                        
                    </el-form-item>   
                 </el-card>
                
               

                <el-card v-if="count<=0 && form.Name" style="box-shadow:none; box-sizing:border-box; border:1px solid #EAEAEA; padding:0 10px; margin-bottom:10px;">
                    <div slot="header" class="clearfix" style="color:#101010;">
                        <span class="header-left">点击预览页面</span>
                    </div>
                    <div style=" text-align:center;">
                        <div class="link-item" >
                            <a v-for="(item,index) in Protols" :key="index" :href="item.Url" target="_blank" >{{item.Name}}</a>
                         
                        </div>
                    </div>
                        
                        
                    

                </el-card>
            </el-form>
            
       
        <div style="height:80px; background:rgba(255,255,255,1); text-align:center; font:16px/80px '微软雅黑'; box-shadow:0 0 10px #ddd; position:fixed; bottom:20px; right:35px; left:165px; z-index:10;">
			<label style="color:#999;">修改了 &nbsp;&nbsp;<b class="editwordSty">{{count}}</b>项配置</label>
			<el-button type="primary" size="medium" @click="handleUpdate" style="margin:0 20px;">立即应用</el-button>
			<span class="editwordSty" @click="resizeData">放弃修改</span>
		</div>


    </section>
</template>
<script>
import { protsetinfo, proteditset } from "api/api.js";
import UpLoad from "@/components/upload.vue";
let timer;
export default {
  data() {
    return {
      loading: false,
      merchant: JSON.parse(sessionStorage.getItem("userDtl")).Merchant,
      uploadUrl: process.env.API_ROOT,
      Protols: [],
      form: {
        Appname:'',//APP名称
        Name:'',//公司全称
        Ipgp:'',//公司简称
        OpenBankAcntname:'',//开户银行户名
        OpenBankAccount:'',//开户银行账号
        OpenBank:'',//开户银行
        AlipayAccount:'',//支付宝账号
        CustserPhone:'',//客服电话
        CustserQq:'',//客服QQ
      },
      rules: {
        Appname: [
          { required: true, message: "请输入APP名称", trigger: "blur" }
        ],
        Name: [
          { required: true, message: "请输入公司全称", trigger: "blur" }
        ],
        Ipgp: [
          { required: true, message: "请输入公司简称", trigger: "blur" }
        ],
        OpenBankAcntname: [
          { required: true, message: "请输入开户银行户名", trigger: "blur" }
        ],
        OpenBankAccount: [
          { required: true, message: "请输入开户银行账号", trigger: "blur" }
        ],
        OpenBank: [
          { required: true, message: "请输入开户银行", trigger: "blur" }
        ],
        AlipayAccount: [
          { required: true, message: "请输入支付宝账号", trigger: "blur" }
        ],
        CustserPhone: [
          { required: true, message: "请输入客服电话", trigger: "blur" }
        ],
        CustserQq: [{ required: true, message: "请输入客服QQ", trigger: "blur" }],

        
      },
      realCopyData: {},
      count: 0
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    handleChange() {
      this.count = this.getUpdateCount(this.realCopyData, this.form);
    },
    handleLoadData() {
      this.count = this.getUpdateCount(this.realCopyData, this.form);
    },
    handleUpdate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          clearTimeout(timer);      
          this.loading = true;
          proteditset(this.form).then(res => {
            timer = setTimeout(()=>{
              this.loading = false;
            },300);
            
            if (res.Ret == 200) {
              this.$message.success(res.Msg);

              this.getDetail();
              this.count = 0;
            }
          });
        }
      });
    },

    getDetail() {
      protsetinfo({}).then(res => {
        console.log('详情',res);
        if (res.Ret == 200) {
          this.form = res.Result;
          this.Protols = res.Protols || [];
          this.realCopyData = JSON.parse(JSON.stringify(res.Result));
        }
      });
    },

    handleBlur() {
      this.count = this.getUpdateCount(this.realCopyData, this.form);
    },
    getUpdateCount(copyData, nowData) {
      // 深拷贝的元数据     更改过后的数据
      let count = 0;
      for (let [item, value] of Object.entries(copyData)) {
        if (value == nowData[item]) {
          continue;
        } else {
          count++;
        }
      }

      return count;
    },
    resizeData() {
      this.form = JSON.parse(JSON.stringify(this.realCopyData));
      this.$refs.form.resetFields();
      this.count = 0;
    }
  },
  components: {
    UpLoad
  }
};
</script>

<style lang="scss">
.page-set {
    padding-bottom:100px; 
  .arc {
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 1px solid #ff0000;
    border-radius: 50%;
    line-height: 24px;
    text-align: center;
    color: #ff0000;
    font-size: 12px;
  }
  .note {
    display: inline-block;
    margin-left: 10px;
    vertical-align: top;
    color: #84909d;
  }
  .label-slot {
    display: inline-block;
    color: #bbbbbb;
  }
  .example {
    text-align: center;
    .img-title {
      font-size: 14px;
      margin-bottom: 10px;
      display: block;
    }
    .img-example {
      width: 576px;
    }
    .btn-example {
      font-size: 14px;
      display: block;
      margin: 0 auto;
    }
  }
  .radioDIY {
    position: relative;
    .el-radio__inner {
      display: none !important;
    }
    .el-radio__label {
      padding: 0;
    }
    .thumbnail {
      width: 65px;
      height: 142px;
      background: #84909d;
    }
    .checked-active {
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.5);
      width: 100%;
      height: 100%;
      display: none;
      span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        color: #ffffff !important;
      }
    }
  }
  .radioDIY:hover .checked-active {
    display: block !important;
  }
  .is-checked {
    .checked-active {
      display: block !important;
    }
  }
  .link-item{
  
      a{
        margin-right: 100px;
      }
  }

}
</style>


