<template>
  <div class="template_container">
    <el-col class="right" :span="24">
      <div class="form_container">
        <div class="item">
            <slot></slot>
        </div>
        
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
    background: url(https://static.****.com/static/img/loginbg5.png)  no-repeat center center;
    background-size: cover;

    .form_container {
      background-color: rgba(90, 90, 255,.5);
      padding:  20px 30px ;
      z-index: 6;
      border-radius: 6px;
      box-shadow: 0px 7px 29px 0px rgba(9, 32, 97, 0.1);
      .item{
        background: #ffffff;
        padding:0 20px 20px;
      }

    }
  }
}
</style>

