<template>
  <div class="template_container">
    <el-col class="right" :span="24">
      <div class="card">
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
    position: relative;
    display: flex;
    justify-content: flex-end;
    height: 100%;
    background: url(https://static.****.com/static/img/loginbg15.png) no-repeat;
    background-size: 100% 100%;

    .card{
      width: 38%;
      display: flex;
      background: rgba(0, 0, 0,.36);
      align-items: center;
      justify-content: center;
      .form_container {
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

