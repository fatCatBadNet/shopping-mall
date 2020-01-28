<template>
  <div class="template_container">
    <el-col class="right" :span="24">
      <div class="top">
          <div>HI</div>
          <span>Welcome  to  System</span>
      </div>
      <div class="card">
        <div class="card_left">
            <img  :src="imgUrl" alt="">
        </div>
        <div class="form_container">
          <div class="title">Login</div>
          <slot></slot>
        </div>
      </div>
    </el-col>
  </div>
</template>
<script>
export default {
  props: {
    imgUrl: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.template_container {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 1200px;
  min-height: 800px;
  position: relative;
  overflow: hidden;
  .right {
    flex: 1;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url(https://static.****.com/static/img/loginbg14.png) no-repeat;
    background-size: 100% 100%;
    .top{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      background: #ffffff;
      height: 74px;
      box-sizing: border-box;
      padding: 20px 0 0 270px;
      div{
        padding: 10px;
        vertical-align: middle;
        display: inline-block;
        margin-right: 18px;
        border:1px solid rgb(51, 51, 51);
      }
      span{
        vertical-align: middle;

      }
    }
    .card{
      display: flex;
      flex-direction: row;
      .card_left{
        width: 356px;
        height: 454px;
        background: url('~@/assets/img/login_14.png') no-repeat;
        background-size: 100% 100%;
        text-align: center;
        box-sizing: border-box;
        padding-top: 40px;
      }
      .form_container {
        display: flex;
        justify-content: center;
        flex-direction: column;
        background-color: rgb(255, 255, 255);
        box-shadow: 0px 10px 16px 0px rgba(0, 32, 152, 0.08);
        padding: 0 40px 30px;
        z-index: 6;
        .title{
          font-size: 40px;
          color: #6691e9;
          margin-bottom: 35px;
        }
      }
    }
    
  }
}
</style>

