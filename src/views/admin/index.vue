<template>
  <div class="app-container">
    <div style="margin-bottom:20px;">
      <el-row>
        <el-col :span="6"><el-input placeholder="输入关键字，按回车键字搜索" v-model="listQuery.searchVal" style="width:80%" @keyup.enter.native="fetchData"/></el-col>
        <!-- <el-col :span="2"> 11</el-col> -->
        <el-col :span="4">
          <el-select v-model="listQuery.status" placeholder="会议状态" @change="fetchData">
            <el-option
              v-for="item in userStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3"><el-button icon="el-icon-search" @click="fetchData">搜索</el-button></el-col>
        <el-col :span="6"><el-button type="success" @click="dialogFormVisible = true"> 添加管理员</el-button></el-col>
      </el-row>
    </div>
    
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='管理员ID' width="95">
        <template slot-scope="scope">
          {{scope.row.user_id}}
        </template>
      </el-table-column>
      <el-table-column label="管理员账号">
        <template slot-scope="scope">
          {{scope.row.user_name}}
        </template>
      </el-table-column>
      <el-table-column label="管理员姓名" width="200" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.user_realname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机" width="200" align="center">
        <template slot-scope="scope">
          {{scope.row.user_mobile}}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="200" align="center">
        <template slot-scope="scope">
          {{scope.row.user_mail}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="账号状态" width="200" align="center" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.user_state | statusFilter">
            <span v-if="scope.row.user_state == '1'" >正常 </span>
            <span v-if="scope.row.user_state == '-1'" >冻结 </span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.c_date}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="更新时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.u_date}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="编辑" width="200">
        <template slot-scope="scope">
          <router-link :to="'detail?id=' + scope.row.user_id"><i class="el-icon-edit"></i></router-link>
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
    <el-dialog title="添加管理员" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input v-model="form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
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
import { getAdminList } from '@/api/fetch'

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
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        username: '',
        password: '',
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
    this.fetchData()
  },
  methods: {
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
    saveInfo(){
      console.log(this.form);
      this.dialogFormVisible = false;
    }
  }
}
</script>
<style>
.el-input{
  width: 80%;
}
</style>

