<template>
	<el-col class="main-item fk-item-set" :span="24">
		<el-table :data="tableData" border :row-class-name="tableRowClassName" :span-method="objectSpanMethod" @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave">
		<!-- <el-table :data="tableData" style="width:100%;" border :span-method="objectSpanMethod" > -->
			<el-table-column  label="冻结" width="150px" :render-header="renderHeader2">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.rule.rule_yn" active-text="" :active-value="0" inactive-text="" :inactive-value="1"></el-switch>
				</template>
			</el-table-column> 
			<el-table-column  label="策略集名称">
				<template slot-scope="scope">
					<span>{{scope.row.rule.rule_name}}</span>
				</template>
			</el-table-column>  
			<el-table-column label="命中结果" >
				<template slot-scope="scope">
						<el-select v-model="scope.row.rule.result_type" placeholder="请选择">
							<el-option v-for="(selectItem, index) in typeList" :key="index" :label="selectItem.result_type_zh" :value="selectItem.result_type"></el-option>
						
						</el-select>
				</template>
			</el-table-column>  
			<el-table-column  label="命中条件" >
				<template slot-scope="scope">
					<span>{{scope.row.rule_detail_list.param_zn}}</span>
				</template>    
			</el-table-column>  
			<el-table-column prop="opera_type" label="操作类型" >
					<template slot-scope="scope">
					<span>{{scope.row.is_enum?"":scope.row.rule_detail_list.opera_type}}</span>
				</template> 
			</el-table-column>  
			<el-table-column  label="值" >
				<template slot-scope="scope">
					<el-input v-if="!scope.row.is_enum" v-model="scope.row.rule_detail_list.param_value" placeholder="请输入" clearable></el-input>
				</template>    
			</el-table-column>
		</el-table> 
	</el-col>
</template>
<script>
export default {
    props:{
        tableData:{
            type:Array,
            default:[]
        },
        typeList:{
            type:Array,
            default:[]
        }
    },
    data(){
        return {
            spanArr:[],
            rowIndex: '-1',
            OrderIndexArr: [],  //
            hoverOrderArr: []
        }
    },
   
    mounted() {
            this.tableData.forEach((item,index) => {
                if( index === 0){
                    this.spanArr.push(1);
                    this.position = 0;
                    }else{
                        if(this.tableData[index].rule.rule_name === this.tableData[index-1].rule.rule_name ){
                            this.spanArr[this.position] += 1;
                            this.spanArr.push(0);
                        }else{
                            this.spanArr.push(1);
                            this.position = index;
                        }
                    }
            }) 
            this.getOrderNumber();

    },
    methods:{
        renderHeader2(h,{column,$index}){ //table表头自定义
				return h("div",{attrs:{style:"padding:0;"}},[
			        h("span",column.label),
			        h('el-tooltip',{props:{placement:'top'}},
						[
							h('p',{ slot:'content' },'冻结开启后，当条风控策略失效'),
				    		h('el-button',{ props:{ icon:'el-icon-info' },attrs:{style:"border:none;background:none"}},'')
				    	]
					)
			    ]);
			},
        // 获取相同编号的数组
        getOrderNumber: function () {
            let obj = { };
            for(let [ index,val] of this.tableData.entries()){
                val.rowIndex = index;
                if(obj[val.rule.rule_name]){
                    obj[val.rule.rule_name].push(index);
                }else{
                    obj[val.rule.rule_name] = [];
                    obj[val.rule.rule_name].push(index);
                }
            }
            let sameArr = [];
            for( let k in obj){
                sameArr.push(obj[k]);
            }
            this.OrderIndexArr = sameArr;
           
        },

        tableRowClassName: function ({row,rowIndex}) {
            var arr = this.hoverOrderArr;
            if(arr.includes(rowIndex)){
                 return 'success-row';
            }

        },
        cellMouseEnter: function (row, column, cell, event) {
            this.rowIndex = row.rowIndex;
            this.hoverOrderArr = [];
            this.OrderIndexArr.forEach(function (element) {
            if (element.indexOf(this.rowIndex) >= 0) {
                this.hoverOrderArr = element;
            }
            }, this);
      
        },
        cellMouseLeave: function (row, column, cell, event) {
          
            this.rowIndex = '-1';
            this.hoverOrderArr= [];
        },

        objectSpanMethod({ row, column, rowIndex, columnIndex }) {  //表格合并行
            if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
                const _row = this.spanArr[rowIndex];
                const _col = _row>0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
        },
    },
    watch:{
        tableData(){
            this.$emit('update:tableData',this.tableData);
        }
    }
}
</script>
<style lang="scss">
    .fk-item-set{ 
        .el-table .success-row{ background:#f5f7fa; }
        .el-table .success-fz{ background:red; } 
        .el-table__header tr>th{ background:#f8f8f8 !important; }
        .el-checkbox__input.is-checked .el-checkbox__inner{ background-color:#dcdfe6; border-color:#dcdfe6; }
        .el-checkbox__input.is-focus .el-checkbox__inner{ background-color:#dcdfe6; border-color:#dcdfe6; }
    }
</style>

