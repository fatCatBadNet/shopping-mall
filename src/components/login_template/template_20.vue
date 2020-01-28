<template>
  <div class="template_container">
    <el-col class="right" :span="24">
      <div class="form_div">
        <img class="logo"  :src="imgUrl" alt="">
        <img style="height:600px;" src="~@/assets/img/login_20.png" alt="">
        <div class="form_container">
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
    background-color: #a6b9d3;
    .form_div{
      position: relative;
      .logo{
        position: absolute;
        top: 230px;
        left:230px ;
      
      }
      .form_container {
        position: absolute;
        top: 170px;
        right: 98px;
        padding: 0 40px 30px;
        z-index: 6;
        border-radius: 6px;
        
      }

    }
    
  }
}
</style>

