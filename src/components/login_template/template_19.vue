<template>
  <div class="template_container">
    <el-col class="right" :span="24">
      <div class="logo" v-if="imgUrl">
          <img :src="imgUrl" alt="">
        </div>
      <div class="form_container">
        <img style="flex:1;height:450px; " src="~@/assets/img/login_19.png" alt="">
        <div style="flex:1; padding: 80px 40px 30px; ">
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
    height: 100%;
    background: #e6e6e6;
    flex-direction: column;
    .logo{
      margin-bottom: 70px;
    }
    .form_container {
      display: flex;
      background-color: rgb(255, 255, 255);
      z-index: 6;
      border-radius: 6px;
      box-shadow: 0px 7px 29px 0px rgba(9, 32, 97, 0.1);
      border-radius: 10px;
      overflow: hidden;
      
    }
  }
}
</style>

