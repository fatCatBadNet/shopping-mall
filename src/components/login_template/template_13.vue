<template>
  <div class="template_container">
    <el-col class="top" :span="24">
      <img style="width:100%;" src="https://static.****.com/static/img/loginbg13.png">
      <div class="form_container" :style="{paddingTop: imgUrl ? '' : '40px'}">
        <img class="title" src="~@/assets/img/use.png" alt="">
        <div class="logo" v-if="imgUrl">
          <img :src="imgUrl" >
        </div>
        <div :class="{'border_radius':!imgUrl}" style="background-color: rgb(255, 255, 255); flex:1; padding: 40px 40px 30px; ">
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
  width: 100%;
  height: 100%;
  min-width: 1200px;
  min-height: 800px;
  position: relative;
  overflow: hidden;
  .top{
    position: relative;
    .form_container {
      position: absolute;
      left: 50%;
      top: 44%;
      transform: translateX(-50%);
      box-shadow: 0px 7px 29px 0px rgba(9, 32, 97, 0.1);
      border-radius: 6px;
      overflow: hidden;
      .title{
        display: block;
        margin: 0 auto 8px;
        width: 300px;
      }
      .logo {
        flex: 1;
        max-width: 460px;
        padding: 20px 0;
        text-align: center;
        background: rgba(34, 141, 253, 0.63);

      }
      .border_radius{
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
      }
    }
  }
  
}
</style>

