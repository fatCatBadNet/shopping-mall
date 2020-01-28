<template>
  <div class="template_container">
    <el-col :span="24" style="position: relative;">
      <img style="width:100%;" src="https://static.****.com/static/img/loginbg6.png" alt="">
    </el-col>
    <el-col class="right" :span="24">
      
      <div class="form_container">
        <slot></slot>
      </div>
    </el-col>
  </div>
</template>
<script>
export default {

  data() {
    return {};
  },
  mounted() {
    console.log(this.imgUrl);
  },
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
  flex-direction: column;
  .logo_img{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  .right {
    flex: 1;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .form_container {
      position: absolute;
      // top: -100px;
      background:#fff;
      padding:25px 40px 30px;
      z-index: 6;
      border-radius: 6px;
      box-shadow: 0px 7px 29px 0px rgba(9, 32, 97, 0.1);
    }
  }
}
</style>

