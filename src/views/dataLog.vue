<template>
    <div>
        <div class="box-card">
            <el-card style="width:1000px;margin:0 auto;margin-bottom:20px;" v-for="(item,index) in tableData" :key="index">
                <div class="card-container">
                    <h1 class="title" v-if="index === 0">更新日志</h1>   
                    <div class="item" v-html="item.UpdateContent"></div>
                    <!-- <el-dropdown class="edit-btn">
                        <span class="el-dropdown-link">
                            <i class="edit-icon el-icon-more el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="editBtn(item.Id)">编辑</el-dropdown-item>
                                <el-dropdown-item v-if="tableData.length >1" @click.native="delBtn(item.Id)">删除</el-dropdown-item>

                            <el-dropdown-item @click.native="addBtn(item.SortIndex)">新增日志（从前）</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown> -->
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
import { loglist,dellog } from '@/api/api';
export default {
    data(){
        return {
            tableData:[]
        }
    },
    mounted() {
        this.getloglist()
    },
    methods: {
        getloglist(){
            loglist({}).then((res) => {
				if(res.Ret == 200){
                	this.tableData = res.Data == null? [] : res.Data;
                }
			});
        },
        editBtn(id){
            this.$router.push({
                path:`/updatelogdetail/${id}`
            })
        },
        delBtn(id){
            this.$confirm('是否删除当前日志?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                dellog({Id:id}).then((res) => {
                    if(res.Ret == 200){
                        this.$message.success(res.Msg);
                        this.getloglist();
                    }
                });
            }).catch(() => {});
        },
        addBtn(SortIndex){
            this.$router.push({
                path:`/addlogdetail/${SortIndex}`
                
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .box-card{
        .card-container{
            position: relative;
            padding: 14px;
            .title{
                padding-bottom:30px; 
            }
            .item{
                box-sizing: border-box;
                padding-right: 30px;
            }
            .edit-btn{
                position: absolute;
                bottom:20px;
                right: 30px; 
                .edit-icon{
                    transform: rotate(90deg);
                }
            }
            .el-dropdown-link {
                cursor: pointer;
            }
            
        }
    }
</style>