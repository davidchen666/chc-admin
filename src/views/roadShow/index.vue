<template>
  <div class="app-container">
    <div style="margin-bottom:20px;">
      <el-row>
        <el-col :span="6"><el-input placeholder="输入关键字，按回车键搜索" v-model="listQuery.searchVal" style="width:80%" @keyup.enter.native="fetchData(currentPage = 1)"/></el-col>
        <el-col :span="4">
          <el-select v-model="listQuery.status" placeholder="状态" @change="fetchData(currentPage = 1)">
            <el-option
              v-for="item in userStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3"><el-button icon="el-icon-search" @click="fetchData(currentPage = 1)">搜索</el-button></el-col>
        <el-col :span="6">
          <router-link to="add">
            <el-button type="success"> 添加路演项目</el-button>
          </router-link>
        </el-col>
      </el-row>
    </div>
    
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.row.road_id}}
        </template>
      </el-table-column>
      <el-table-column label="路演项目名称" align="center">
        <template slot-scope="scope">
          {{scope.row.road_name}}
        </template>
      </el-table-column>
      <el-table-column label="路演项目标题" align="center">
        <template slot-scope="scope">
          {{scope.row.road_title}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="路演项目状态" width="100" align="center" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.road_state | statusFilter">
            <span v-if="scope.row.road_state == '1'" >上线 </span>
            <span v-if="scope.row.road_state == '-1'" >下线 </span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.create_date}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="更新时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.update_date}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="编辑" >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑信息" placement="top">
            <router-link :to="{name:'RoadShowDetail',query:{road_id:scope.row.road_id}}">
              <el-button type="primary" icon="el-icon-edit-outline" circle size='mini'></el-button>
            </router-link>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="更改状态" placement="top">
            <span v-if="scope.row.road_state == '1'">
              <el-button type="warning" icon="el-icon-arrow-down" circle size='mini' @click="changeState(scope.row,'-1')"></el-button>
            </span>
            <span v-if="scope.row.road_state == '-1'">
              <el-button type="warning" icon="el-icon-arrow-up" circle size='mini' @click="changeState(scope.row,'1')"></el-button>
            </span>
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
      
  </div>
</template>

<script>
import { getRoadShowList, editRoadShowState } from '@/api/fetch'

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
          label: '上线'
        }, {
          value: '-1',
          label: '下线'
        }],
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
    this.fetchData();
  },
  methods: {
    //加载表格
    fetchData() {
      this.listLoading = true
      this.listQuery.currentPage = this.currentPage;
      this.listQuery.pageSize = this.pageSize;
      getRoadShowList(this.listQuery).then(response => {
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
      let stateStr = dData.road_state == '1'? ' 设置为下线状态，将在会议设置中不显示该路演项目':' 设置为上线状态，将在会议设置中显示该路演项目';
      this.$confirm('此操作将把'+ dData.road_name + stateStr +', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.beginLoad();
        let params = {
          roadid: dData.road_id,
          state: needState
        }
        editRoadShowState(params).then(response => {
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

