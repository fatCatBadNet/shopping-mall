<template>
  <div class="template_container">
    <el-col :span="24" style="position: relative;">
      <img style="width:100%;" src="https://static.****.com/static/img/loginbg10.png" alt="">
      <img class="logo_img" :src="imgUrl" alt="">
        <div class="form_container">
          <slot></slot>
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
  },
  mounted() {
    console.log(this.imgUrl);
  },
};
</script>

<style lang="scss" scoped>
.template_container {
  background: #e6e6e6;
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
    left: 8%;
    top: 11%;
  }
  .form_container {
    position: absolute;
    bottom: -150px;
    right:18%;
    background-color: rgb(255, 255, 255);
    padding: 40px 40px 30px;
    z-index: 6;
    border-radius: 6px;
    box-shadow: 0px 7px 29px 0px rgba(9, 32, 97, 0.1);
    border-radius: 30px;
  }
}
</style>

