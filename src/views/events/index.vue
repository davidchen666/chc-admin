<template>
  <div class="app-container">
    <div style="margin-bottom:20px;">
      <el-row>
        <el-col :span="6"><el-input placeholder="输入关键字，按回车键字搜索" v-model="listQuery.searchVal" style="width:80%" @keyup.enter.native="fetchData"/></el-col>
        <!-- <el-col :span="2"> 11</el-col> -->
        <el-col :span="4">
          <el-select v-model="listQuery.eventStatus" placeholder="会议状态" @change="fetchData">
            <el-option
              v-for="item in eventStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3"><el-button icon="el-icon-search" @click="fetchData">搜索</el-button></el-col>
        <el-col :span="6"><router-link to="add"><el-button type="success" > 添加会议</el-button></router-link></el-col>
      </el-row>
    </div>
    
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='会议ID' width="95">
        <template slot-scope="scope">
          <!-- {{scope.$index}} -->
          {{scope.row.events_id}}
        </template>
      </el-table-column>
      <el-table-column label="会议名称">
        <template slot-scope="scope">
          {{scope.row.events_name}}
        </template>
      </el-table-column>
      <el-table-column label="会议时间" width="150" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.events_date}}</span>
        </template>
      </el-table-column>
      <el-table-column label="会议城市" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.events_city}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="会议状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.events_state | statusFilter">
            <span v-if="scope.row.events_state == '1'" >已上线 </span>
            <span v-if="scope.row.events_state == '-1'" >已下线 </span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="会议链接" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.events_url}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.c_date}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="查看" width="200">
        <template slot-scope="scope">
          <router-link :to="'detail?id=' + scope.row.events_id"><i class="el-icon-edit"></i></router-link>
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
import { getList } from '@/api/fetch'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery:{
        searchVal: '',
        eventStatus: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalData: 0,
      eventStatus: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '上线'
        }, {
          value: '-1',
          label: '下线'
        }],
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
      getList(this.listQuery).then(response => {
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
    }
  }
}
</script>
