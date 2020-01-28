<template>
    <section style="display:inline-block;">
        <el-upload class="avatar-uploader" :action="actionUrl" :data="data" name="file" :show-file-list="false" :before-upload="addUpload" :on-success="handleAvatarSuccess">
            <img v-if="imgUrl" :src="imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </section>
</template>
<script>
export default {
  props: {
    imgUrl: {
      type: String,
      default: ""
    },
    actionUrl: {
      type: String,
      defalut: ""
    },
    data: {
      type: Object,
      defalut: {}
    },
    limtSize: {
      type: Boolean,
      defalut:false
    },
    imgWidth:{
      type:Number,
      defalutL:100
    },
    imgHeight:{
      type:Number,
      defalutL:100
    },
  },
  data() {
    return {};
  },
  methods: {
    addUpload(file) {
     
      let that = this;
      const isJPG = file.type === "image/jpeg";
      const isIcon = file.type === "image/x-icon";
      const ispng = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 3;
      if (!isJPG && !ispng && !isIcon) {
        this.$message.error("上传banner图片只能是 jpg/png/ico 图片格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传banner图片大小不能超过 3MB!");
        return false;
      }
      if (this.limtSize) {
        return new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.onload = e => {
            let data = e.target.result;
            //加载图片获取图片真实宽度和高度
            let image = new Image();
            image.onload = () => {
              let width = image.width;
              let height = image.height;
              if (width != this.imgWidth || height != this.imgHeight) {
                this.$message.error(`请上传${this.imgWidth}*${this.imgHeight}大小的图片`);
                reject();
              } else {
                resolve();
              }
            };
            image.src = data;
          };
          reader.readAsDataURL(file);
        });
      }
    },

    handleAvatarSuccess(res, file) {
      if (res.Ret == 200) {
        this.$message.success(res.Msg);
        this.imgUrl = res.Url;
       
      }
    }
  },
  watch:{
      imgUrl(){
           this.$emit('update:imgUrl',this.imgUrl);
           this.$emit('loadData');
      }
  }
};
</script>
<style lang="scss" scoped>
    .avatar-uploader{display: inline-block;}
    .avatar-uploader .el-upload{ border:1px dashed #d9d9d9; border-radius:6px; cursor:pointer; position:relative; overflow:hidden; width: 90px;height: 90px; }
  	.avatar-uploader .el-upload:hover{ border-color:#409EFF; }
  	.avatar-uploader-icon{ font:28px/90px "微软雅黑"; color:#8c939d; min-width:90px; height:90px; text-align:center; border:1px dotted #ccc; }
  	.avatar{ width:90px; height:90px; display:block; border: 1px solid #e3e3e3; }
    
</style>

