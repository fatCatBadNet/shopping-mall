<template>
  <div class="template_container">
    <!-- <el-col class="left" :span="14"></el-col>
    <el-col class="right" :span="10">
      <div class="form_container" style="margin-top:250px;margin-right:1100px;">
        <slot></slot>
      </div>
    </el-col> -->
    <div class="form_container">
        <slot></slot>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.form_container {
      margin:0 auto !important;
      margin-top: 430px !important;
      background: url(../../assets/img/bg-login.png) no-repeat;
      width: 659px;
      height: 378px;
  }
.template_container {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 1200px;
  min-height: 800px;
  position: relative;
  overflow: hidden;
  .left {
    height: 100%;
    background: url(https://static.****.com/static/img/loginbg2.png) no-repeat center center;
    background-size: cover;
  }
  .right {
    flex: 1;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .form_container {
      margin:0 auto;
      margin-top: 500px;
    }
  }
}
</style>

