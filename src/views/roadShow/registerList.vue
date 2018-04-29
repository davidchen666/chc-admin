<template>
  <div class="app-container">
    <div style="margin-bottom:20px;">
      <el-row>
        <el-col :span="6"><el-input placeholder="输入关键字，按回车键搜索" v-model="listQuery.searchVal" style="width:80%" @keyup.enter.native="fetchData(currentPage = 1)"/></el-col>
        <el-col :span="4">
          <el-select v-model="listQuery.events_id" placeholder="请选择会议" @change="fetchData(currentPage = 1)">
            <span v-for="item in eventsList" :key="item.events_id">
              <el-option :label="item.events_name" :value="item.events_id"></el-option>
            </span>
          </el-select>
        </el-col>
        <el-col :span="3"><el-button icon="el-icon-search" @click="fetchData(currentPage = 1)">搜索</el-button></el-col>
        <el-col :span="6">
          <router-link to="add">
            <!-- <el-button type="success"> 下载excel</el-button> -->
          </router-link>
        </el-col>
      </el-row>
    </div>
    <!-- id    com_name    user_name   user_job    user_mobile user_email  file_name   road_id remark  create_date update_date -->
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='报名ID' width="95">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="公司名称" align="center">
        <template slot-scope="scope">
          {{scope.row.com_name}}
        </template>
      </el-table-column>
      <el-table-column label="联系人姓名" align="center">
        <template slot-scope="scope">
          {{scope.row.user_name}}
        </template>
      </el-table-column>
      <el-table-column label="职务" align="center">
        <template slot-scope="scope">
          {{scope.row.user_job}}
        </template>
      </el-table-column>
      <el-table-column label="电话/手机" align="center">
        <template slot-scope="scope">
          {{scope.row.user_mobile}}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">
          {{scope.row.user_email}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="报名时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.create_date}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" prop="created_at" label="更新时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.update_date}}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" prop="created_at" label="下载计划书" >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="下载计划书" placement="top">
            <!-- file_name -->
            <a :href="downUrl + scope.row.file_name">
              <el-button type="primary" icon="el-icon-download" circle size='mini'></el-button>
            </a>
            <!-- <router-link :to="{name:'MediaDetail',query:{media_id:scope.row.media_id}}"> -->
              <!-- <el-button type="primary" icon="el-icon-edit-outline" circle size='mini' @click="dialogFormVisible = true, form=scope.row"></el-button> -->
            <!-- </router-link> -->
          </el-tooltip>
          <!-- <el-tooltip class="item" effect="dark" content="更改状态" placement="top">
            <span v-if="scope.row.media_state == '1'">
              <el-button type="warning" icon="el-icon-arrow-down" circle size='mini' @click="changeState(scope.row,'-1')"></el-button>
            </span>
            <span v-if="scope.row.media_state == '-1'">
              <el-button type="warning" icon="el-icon-arrow-up" circle size='mini' @click="changeState(scope.row,'1')"></el-button>
            </span>
          </el-tooltip> -->
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
  </div>
</template>

<script>
import { getRoadShowRegisterList, getEventsList } from '@/api/fetch'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery:{
        searchVal: '',
        events_id: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalData: 0,
      eventsList: [],
      showType: null,
      formLabelWidth: '120px',
      allLoading: '',
      downUrl: '',
      inputState: true,
      // id    com_name    user_name   user_job    user_mobile user_email  file_name   road_id remark  create_date update_date
      form:{
        id: '',
        com_name: '',
        user_name: '',
        user_job: '',
        user_mobile: '',
        user_email: '',
        file_name: '',
        events_id: '',
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
    this.downUrl = process.env.BASE_TOTAL_API + 'uploads/roadShow/';
    this.fetchEventsList();
    this.fetchData();
  },
  methods: {
    //加载会议列表
    fetchEventsList(){
      let params = {
        currentPage: 1,
        pageSize: 100,
      };
      getEventsList(params).then(response => {
        this.eventsList = response.resData.items
      })
    },
    //加载表格
    fetchData() {
      this.listLoading = true
      this.listQuery.currentPage = this.currentPage;
      this.listQuery.pageSize = this.pageSize;
      getRoadShowRegisterList(this.listQuery).then(response => {
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
  }
}
</script>
<style>
.el-input{
  width: 80%;
}
</style>

