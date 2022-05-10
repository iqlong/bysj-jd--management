<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-table
                :data="tableData"
                highlight-current-row
                style="width: 100%">

                <el-table-column
                    property="shop_id"
                    label="商铺id"
                    width="420">
                </el-table-column>
                <el-table-column
                    property="shop_name"
                    label="商铺名字"
                    min-width="220">
                </el-table-column>
                <el-table-column
                    property="shop_address"
                    label="地址">
                </el-table-column>
                <!--<el-table-column-->
                <!--    property="category_id"-->
                <!--    label="闲置字段">-->
                <!--</el-table-column>-->
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 50, 100, 200]"
                    :page-size="limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="count">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import headTop from '../components/headTop'
export default {
    data(){
        return {
            tableData: [],
            currentRow: null,
            limit: 10,
            currentPage: 1,
            count: 0
        }
    },
    components: {
        headTop,
    },
    created(){
        this.initData();
    },
    methods: {
        initData(){
            this.$http.get('/shop',{
                params:{
                    num: this.currentPage,
                    size: this.limit
                }
            }).then((res)=>{
                let state;
                if(res.data.status==='00'){
                    this.tableData = res.data.data;
                    state='success'
                }else if(res.data.status==='01'){
                    this.tableData=[];
                    state='success'
                }else {
                    state='error';
                }
                this.count=res.data.allDataLen;
                this.$durationMes[state]({
                    message: res.data.msg||'失败'
                })
            },(err)=>{
                console.log(err);
            });

        },
        handleSizeChange(val) {
            this.limit = val;
            // this.offset = (val - 1)*this.limit;
            this.initData()
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            // this.offset = (val - 1)*this.limit;
            this.initData()
        },
    },
}
</script>

<style lang="less">
@import '../style/mixin';
.table_container{
    padding: 20px;
}
</style>
