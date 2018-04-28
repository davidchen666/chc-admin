<template>
  <div class="app-container">
    <div style="margin-bottom:20px;">
      <el-row>
        <el-col :span="6"><el-input placeholder="输入关键字，按回车键字搜索" v-model="listQuery.searchVal" style="width:80%" @keyup.enter.native="fetchData(currentPage = 1)"/></el-col>
        <el-col :span="4">
          <el-select v-model="listQuery.events_id" placeholder="会议" @change="fetchData(currentPage = 1)">
            <el-option label="请选择" value=""></el-option>
            <span v-for="item in eventsList" :key="item.events_id">
              <el-option :label="item.events_name" :value="item.events_id"></el-option>
            </span>
          </el-select>
        </el-col>
        <el-col :span="3"><el-button icon="el-icon-search" @click="fetchData(currentPage = 1)">搜索</el-button></el-col>
        <el-col :span="6">
          <router-link to="add">
            <el-button type="success"> 下载excel</el-button>
          </router-link>
        </el-col>
      </el-row>
    </div>
    <!-- com_id    events_id   com_name    com_Invoices_title  com_duty_num    com_phone  
     com_fax com_postal_addr com_postal_code com_field   com_from    c_date -->
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='报名ID' width="95">
        <template slot-scope="scope">
          {{scope.row.com_id}}
        </template>
      </el-table-column>
      <el-table-column label="公司名称" align="center">
        <template slot-scope="scope">
          {{scope.row.com_name}}
        </template>
      </el-table-column>
      <el-table-column label="会议名称" align="center">
        <template slot-scope="scope">
          {{scope.row.events_id}}
        </template>
      </el-table-column>
      <el-table-column label="公司电话" align="center">
        <template slot-scope="scope">
          {{scope.row.com_phone}}
        </template>
      </el-table-column>
      <!-- <el-table-column class-name="status-col" label="媒体状态" width="100" align="center" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.media_state | statusFilter">
            <span v-if="scope.row.media_state == '1'" >上线 </span>
            <span v-if="scope.row.media_state == '-1'" >下线 </span>
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column align="center" prop="created_at" label="报名时间" width="180">
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
      <el-table-column align="center" prop="created_at" label="查看/编辑" >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看/编辑信息" placement="top">
            <!-- <router-link :to="{name:'MediaDetail',query:{media_id:scope.row.media_id}}"> -->
              <el-button type="primary" icon="el-icon-edit-outline" circle size='mini'></el-button>
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
import { getEventsRegisterList, getEventsList, editMediaState } from '@/api/fetch'

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
      dialogFormVisible: false,
      formLabelWidth: '120px',
      allLoading: ''
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
      getEventsRegisterList(this.listQuery).then(response => {
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
        text: '请稍等,请求中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    //更改状态
    changeState(dData,needState){
      let stateStr = dData.media_state == '1'? ' 设置为下线状态，将在会议设置中不显示该媒体':' 设置为上线状态，将在会议设置中显示该媒体';
      this.$confirm('此操作将把'+ dData.media_name + stateStr +', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.beginLoad();
        let params = {
          mediaid: dData.media_id,
          state: needState
        }
        editMediaState(params).then(response => {
          if(response && response.resCode === 200 && response.resData){
            this.$message({
              message: '状态修改成功。',
              type: 'success'
            });
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
  }
}
</script>
<style>
.el-input{
  width: 80%;
}
</style>

