<template>
  <div class="template_container">
    <el-col class="right" :span="24">
      <div class="form_container" :style="{paddingTop: imgUrl ? '' : '40px'}">
        <div class="logo" v-if="imgUrl">
          <img :src="imgUrl" alt="">
        </div>
        <div style="flex:1; padding: 0 40px 30px; ">
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
    background: url(https://static.****.com/static/img/loginbg12.png) no-repeat;
    background-size: 100% 100%;

    .form_container {
      display: flex;
      flex-direction: column;
      background-color: rgb(255, 255, 255);
      z-index: 6;
      border-radius: 6px;
      box-shadow: 0px 7px 29px 0px rgba(9, 32, 97, 0.1);
      .logo{
        flex:1; 
        max-width:460px;
        margin-bottom:40px;
        padding:30px 0; 
        text-align: center;
        background: rgba(34, 141, 253, 0.2);
        
      }

    }
  }
}
</style>

