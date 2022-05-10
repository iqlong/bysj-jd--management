<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-table
                :data="tableData"
                highlight-current-row
                style="width: 100%">
                <el-table-column
                  type="index"
                  width="100">
                </el-table-column>
                <el-table-column
                  property="user_name"
                  label="用户姓名"
                  width="220">
                </el-table-column>
                <el-table-column
                    property="balance"
                    label="余额"
                    width="220">
                    <template v-slot:default="scope">{{scope.row.balance}}元</template>
                </el-table-column>
                <el-table-column
                  property="address"
                  label="地址">
                </el-table-column>
                <el-table-column
                    property="user_photo"
                    label="头像">
                    <template v-slot:default="scope">
                        <img style="width: 100px;height: 100px" :src="scope.row['user_photo']" alt="">
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="20"
                  layout="total, prev, pager, next"
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
                offset: 0,
                limit: 20,
                currentPage: 1,
            }
        },
    	components: {
    		headTop,
    	},
        computed:{
          count(){
              return this.tableData.length;
          }
        },
        created(){
            this.initData();
        },
        methods: {
            initData(){
                let uObj ={};
                if(window.sessionStorage.userInfo && sessionStorage.userInfo!=='undefined'){
                    let uObj = JSON.parse(window.sessionStorage.userInfo);
                    let useId = uObj.user_id;
                    this.$http.get('/userinfo').then((res)=>{
                        this.tableData = res.data;
                        console.log(this.uInfs);
                    },(err)=>{
                        console.log(err);
                    });
                }else{
                    // 没有登录就使用push方法，但是这样会导致 go(-1)出现问题
                    this.$router.push({
                        path:'/login',
                    })
                }
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.getUsers()
            },
            async getUsers(){
                const Users = await getUserList({offset: this.offset, limit: this.limit});
                this.tableData = [];
                Users.forEach(item => {
                    const tableData = {};
                    tableData.username = item.username;
                    tableData.registe_time = item.registe_time;
                    tableData.city = item.city;
                    this.tableData.push(tableData);
                })
            }
        },
    }
</script>

<style lang="less">
	@import '../style/mixin';
    .table_container{
        padding: 20px;
    }
</style>
