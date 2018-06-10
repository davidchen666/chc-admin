<template>
  <div class="app-container">
    <div style="margin-bottom:20px;">
      <el-row>
        <el-col :span="6"><el-input placeholder="输入关键字，按回车键搜索" v-model="listQuery.searchVal" style="width:80%" @keyup.enter.native="fetchData(currentPage = 1)"/></el-col>
        <el-col :span="3"><el-button icon="el-icon-search" @click="fetchData(currentPage = 1)">搜索</el-button></el-col>
        <el-col :span="6">
          <el-button type="success" @click="downData"> 下载数据 </el-button>
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
      <el-table-column align="center" label="公司从事业务">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="公司从事业务" width="200" trigger="hover" :content="scope.row.com_business">
            <span slot="reference">
              {{scope.row.com_business.length<= 28 ?scope.row.com_business:scope.row.com_business.substring(0,28) + '...'}}
            </span>
          </el-popover>
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
      <!-- <el-table-column align="center" prop="created_at" label="下载计划书" >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="下载计划书" placement="top">
            <a :href="downUrl + scope.row.file_name">
              <el-button type="primary" icon="el-icon-download" circle size='mini'></el-button>
            </a>
          </el-tooltip>
        </template>
      </el-table-column> -->
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
import { getAllianceRegisterList } from '@/api/fetch'
import CsvExportor from 'csv-exportor'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery:{
        searchVal: '',
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
      form:{
        id: '',
        com_name: '',
        user_name: '',
        user_job: '',
        user_mobile: '',
        user_email: '',
        com_business: '',
        remark: ''
      }
    }
  },
  // filters: {
  //   statusFilter(status) {
  //     const statusMap = {
  //       '1': 'success',
  //       '-1': 'gray',
  //       // deleted: 'danger'
  //     }
  //     return statusMap[status]
  //   }
  // },
  created() {
    this.fetchData();
  },
  methods: {
    //加载表格
    fetchData() {
      this.listLoading = true
      this.listQuery.currentPage = this.currentPage;
      this.listQuery.pageSize = this.pageSize;
      getAllianceRegisterList(this.listQuery).then(response => {
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
    downData(){
      this.$confirm('此操作将下载报名表,请使用主流浏览器（chrome、firefox、360等,不要使用IE），时间可能较长，请耐心等待， 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.exportCsv();
      }).catch(() => {
               
      });
    },
    exportCsv() {
      this.beginLoad();
      this.listQuery.currentPage = this.currentPage;
      this.listQuery.pageSize = this.pageSize;
      let myParams = {
        currentPage: 1,
        pageSize: this.totalData,
        searchVal: this.listQuery.searchVal
      };
      let tableData = '';
      let header = ['报名ID','公司名称', '联系人姓名', '职务', '电话/手机', '邮箱','报名时间', '公司从事业务'];
      getAllianceRegisterList(myParams).then(response => {
        let totalTableData = [];
        // totalTableData = response.resData.items;
        response.resData.items.forEach(element => {
          totalTableData.push({id:element.id,com_name:element.com_name,user_name:element.user_name,user_job:element.user_job,user_mobile:element.user_mobile,user_email:element.user_email,create_date:element.create_date,com_business:element.com_business});
        });
        console.log(totalTableData);
        CsvExportor.downloadCsv(totalTableData, { header }, '报名表.csv');
        this.allLoading.close();
        this.$message({
          type: 'success',
          message: '下载成功!'
        });
      })
      // let tableData = [["a","b","c"],["d","e","f"]];
      
    }
  }
}
</script>
<style>
.el-input{
  width: 80%;
}
</style>

