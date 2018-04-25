<template>
  <div class="app-container">
    <div style="margin-bottom:20px;">
      <el-row>
        <el-col :span="6"><el-input placeholder="输入关键字，按回车键字搜索" v-model="listQuery.searchVal" style="width:80%" @keyup.enter.native="fetchData(currentPage = 1)"/></el-col>
        <!-- <el-col :span="2"> 11</el-col> -->
        <el-col :span="4">
          <el-select v-model="listQuery.status" placeholder="管理员状态" @change="fetchData(currentPage = 1)">
            <el-option
              v-for="item in userStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3"><el-button icon="el-icon-search" @click="fetchData(currentPage = 1)">搜索</el-button></el-col>
        <el-col :span="6"><el-button type="success" @click="showDialog('add',null)"> 添加管理员</el-button></el-col>
      </el-row>
    </div>
    
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.row.user_id}}
        </template>
      </el-table-column>
      <el-table-column label="账号" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.user_name}}
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.user_realname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机" width="120" align="center">
        <template slot-scope="scope">
          {{scope.row.user_mobile}}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="200" align="center">
        <template slot-scope="scope">
          {{scope.row.user_mail}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="账号状态" width="100" align="center" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.user_state | statusFilter">
            <span v-if="scope.row.user_state == '1'" >正常 </span>
            <span v-if="scope.row.user_state == '-1'" >冻结 </span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.c_date}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="更新时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.u_date}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="编辑" >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑信息" placement="top">
            <el-button type="primary" icon="el-icon-edit-outline" circle size='mini' @click="showDialog('edit',scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="重置密码" placement="top">
            <el-button type="warning" icon="el-icon-edit" circle size='mini' @click="resetPwd(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除管理员" placement="top">
            <el-button type="danger" icon="el-icon-delete" circle size='mini'  @click="delAdmin(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding-top:20px;text-align:right;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalData">
      </el-pagination>
    </div>

    <!-- 对话框 -->
    <el-dialog :title="showType==='add'?'添加管理员':'修改管理员'" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <!-- 修改时显示id -->
        <span v-show="showType==='edit'">
          <el-form-item label="管理员ID" :label-width="formLabelWidth">
            <el-input  v-model="form.userid" :disabled="showType==='edit'"></el-input>
          </el-form-item>
        </span>
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input auto-complete="off" v-model="form.username" :disabled="showType==='edit'"></el-input>
        </el-form-item>
        <span v-show="showType === 'add'">
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
          </el-form-item>
        </span>
        <span v-show="showType === 'edit'">
          <el-form-item label="账号状态" :label-width="formLabelWidth">
            <el-select v-model="form.state" placeholder="管理员状态">
              <span v-for="item in userStatus" :key="item.value" v-if="item.value">
                <el-option :label="item.label" :value="item.value"></el-option>
              </span>
            </el-select>
          </el-form-item>
        </span>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.realname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveInfo">确 定</el-button>
      </div>
    </el-dialog>
      
  </div>
</template>

<script>
import { getAdminList, addAdmin, editAdmin, editAdminPwd, delAdmin } from '@/api/fetch'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery:{
        searchVal: '',
        status: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalData: 0,
      userStatus: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '正常'
        }, {
          value: '-1',
          label: '冻结'
        }],
      showType: null,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      allLoading: '',
      form: {
        username: '',
        password: '',
        state: '',
        realname: '',
        mobile: '',
        email: '',
        remark: ''
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '-1': 'gray',
        // deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    //加载表格
    fetchData() {
      this.listLoading = true
      this.listQuery.currentPage = this.currentPage;
      this.listQuery.pageSize = this.pageSize;
      getAdminList(this.listQuery).then(response => {
        this.list = response.resData.items
        this.totalData = parseInt(response.resData.page.total)
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    beginLoad(){
      this.allLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    showDialog(type,dData){
      this.showType = type;
    //   console.log(type,dData);
      if(this.showType === 'edit'){
        this.form = {
          userid: dData.user_id,
          username: dData.user_name,
          password: '',
          state: dData.user_state,
          realname: dData.user_realname,
          mobile: dData.user_mobile,
          email: dData.user_mail,
          remark: dData.user_remark
        };
      }else if(this.showType === 'add'){
        this.form = {
          userid: '',
          username: '',
          password: '',
          state: '',
          realname: '',
          mobile: '',
          email: '',
          remark: ''
        };
      }
      this.dialogFormVisible = true;
    },
    //保存信息；1----添加管理员；2----修改信息
    saveInfo(){
      // console.log(this.form);
      this.beginLoad();
      //添加用戶
      if(this.showType === 'add'){
          addAdmin(this.form).then(response => {
            // console.log(response);
            if(response && response.resCode === 200 && response.resData){
              this.allLoading.close();
              this.$message({
                message: '添加成功',
                type: 'success'
              });
              this.dialogFormVisible = false;
              this.fetchData();
            }else{
              this.allLoading.close();
            }
          // this.list = response.resData.items
          // this.dialogFormVisible = false;
        })
      }
      //編輯用戶
      if(this.showType === 'edit'){
          editAdmin(this.form).then(response => {
            // console.log(response);
            if(response && response.resCode === 200 && response.resData){
              this.allLoading.close();
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.dialogFormVisible = false;
              this.fetchData();
            }else{
              this.allLoading.close();
            }
          // this.list = response.resData.items
          // this.dialogFormVisible = false;
        })
      }
      
    },
    //刪除管理員
    delAdmin(dData){
      this.$confirm('此操作将删除用户('+ dData.user_name +'), 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.beginLoad();
        let params = {
          userid: dData.user_id,
          username: dData.user_name,
        }
        delAdmin(params).then(response => {
          if(response && response.resCode === 200 && response.resData){
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
            this.dialogFormVisible = false;
            this.fetchData();
            this.allLoading.close();
          }else{
            this.allLoading.close();
          }
        }).catch(() => {
          this.allLoading.close();
        })     
      }).catch(() => {
              
      });
    },
    //重置密碼
    resetPwd(dData){
      this.$prompt('请输入新密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[0-9A-Za-z_]{6,15}$/,
          inputErrorMessage: '密码格式不正确（6-15位）'
        }).then(({ value }) => {
          this.beginLoad();
          let params = {
            userid: dData.user_id,
            username: dData.user_name,
            password: value,
          }
          editAdminPwd(params).then(response => {
            if(response && response.resCode === 200 && response.resData){
              this.allLoading.close();
              this.$message({
                message: '密码重置成功',
                type: 'success'
              });
              this.dialogFormVisible = false;
            }else{
              this.allLoading.close();
            }
          }).catch(() => {
            this.allLoading.close();
          })     
        });
    }
  }
}
</script>
<style>
.el-input{
  width: 80%;
}
</style>

