<template>
  <div class="template_container">
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
    background: url(https://static.****.com/static/img/loginbg7.png) no-repeat;
    background-size: 100% 100% ;

    .form_container {
      background-color: rgb(255, 255, 255);
      padding: 0 40px 30px;
      z-index: 6;
      border-radius: 6px;
      box-shadow: 0px 7px 29px 0px rgba(9, 32, 97, 0.1);
    }
  }
}
</style>

