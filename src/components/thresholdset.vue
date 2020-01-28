<template>
    <section>
        <el-col class="title">
                <div class="title-text">{{title}}</div>
                <div class="bottom-line"></div>
        </el-col>
        <el-col class="item">
            <div class="label-title">
                {{subTitle}}
            </div>
            <div class="item-main">
                    <div class="list-msg">余额低于</div>
                    <div class="list-item"  v-for="(item, index) in list" :key="index" >
                        <el-input type="number" :min="0" maxlength="8" v-model.number="list[index]" @blur="handleBlur(index,list[index])"></el-input>
                        <span class="note" v-if="emptyIndexFunc(index)">金额不能为空</span>
                    </div>
                    <div class="list-msg">发送预警提醒</div>  
                    <div class="btns">
                        <el-button type="primary" plain size="small" style="width:100px;" @click="handleClick">添加阈值</el-button>
                        <el-button v-if="list.length>1" plain type="primary" size="small" style="width:100px;" @click="del">删除阈值</el-button>
                    </div>
            </div>
        </el-col>
    </section>    
</template>
<script>
export default {
  props: {
    list: {
      //input输入框的值
      type: Array,
      default: []
    },
    title: {
      //主标题
      type: String,
      default: ""
    },
    subTitle: {
      //副标题
      type: String,
      default: ""
    },
    metadata:{ //元数据
        type:Array
    },
    count:{
        type:Number,
        default:0
    }

  },
  data() {
    return {
        emptyIndex:[],//空值的idnex集合
    };
  },
  methods:{
      del(){ //删除阈值
        this.list.splice(this.list.length-1,1);
      },
      handleClick(){ //添加阈值
        if(this.list.length>=5){
            this.$message.error('最多可添加5个阈值');
            return;
        }
        this.list.push('');
      },
      emptyIndexFunc(index){
        return  this.emptyIndex.indexOf(index)>-1;
      },
      handleBlur(index,value){
        let flag = this.emptyIndex.includes(index);  //判断空值的idnex集合中是否含有当前丢失焦点的input 的index
          if(value ===''){   
              if(!flag){
                  this.emptyIndex.push(index);
              }
              
          }else{
            if(flag){
                let currentIndex = this.emptyIndex.findIndex(function(value, idx, arr) {
                        return value === index;
                        }); //在集合中的下表
                console.log('在集合中的下表',currentIndex);
                this.emptyIndex.splice(currentIndex,1);

            }
          }
          this.dataCompare();
      },
      dataCompare(){   //数据对比
      
        let metadata = this.metadata;  //不会更改的元数据
        let nowData = this.list;   //更新过的数据
        let mylength = this.metadata.length-this.list.length;
        let lengthCount = Math.abs(mylength);  //长度差的绝对值 
        
        this.count = lengthCount;
        console.log('不会更改的元数据:',metadata,'更新过的数据:',nowData,mylength,this.count);
        console.log('不会更改的元数据:',metadata)
        if(mylength>0){
            for(let i = 0; i<this.list.length;i++){
               if(this.list[i]!==this.metadata[i]){
                   this.count+=1;
               }
            }
        }else{
            for(let i = 0; i<this.metadata.length;i++){
               if(this.list[i]!==this.metadata[i]){
                   this.count+=1;
               }
            }
        }
        

      }
  },
  watch: {
    list: function() {
      this.$emit("update:list", this.list);
    },
    count:function () {
        this.$emit("update:count", this.count);
      }
  }

};
</script>
<style lang="scss" scoped>
.title{
    display: flex;
    display: -webkit-flex; 
    .title-text{
        font-size: 16px;
        color: #84909D;
        margin-right: 30px;
        vertical-align: text-bottom;
    }
    .bottom-line{
        flex: 1;
        -webkit-flex: 1;
        border-bottom:1px dashed #c5c9d0; 
         vertical-align: text-bottom;
    }
}
.item {
  display: flex;
  display: -webkit-flex;
  padding:28px 0 90px 0;  
  .label-title {
    color: #c5c9d0;
    font-size: 14px;
    line-height: 40px;
    margin-right: 80px;
    vertical-align: top;
  }
  .item-main {
    flex: 1;
    -webkit-flex: 1;
    vertical-align: top;
    .list-msg{
        display: inline-block;
        font-size: 14px;
        color: #84909D;
        line-height: 40px;
        vertical-align: top;
    }
    .btns{
        display: inline-block;
        height: 40px;
        line-height: 40px;
        padding-left:32px; 
    }
    .list-item{
        width: 110px;
        display: inline-block;
        margin:0 5px;
         vertical-align: top;
        .note{
            font-size: 12px;
            color: #E51C23;
        }
    }
  }
}
</style>




