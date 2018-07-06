<template>
  <div class="app-container">
    <div style="margin-bottom:20px;">
      <el-row>
        <el-col :span="6"><el-input placeholder="输入关键字，按回车键搜索" v-model="listQuery.searchVal" style="width:80%" @keyup.enter.native="fetchData(currentPage = 1)"/></el-col>
        <el-col :span="4">
          <el-select v-model="listQuery.status" placeholder="新闻状态" @change="fetchData(currentPage = 1)">
            <el-option
              v-for="item in userStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="listQuery.newstype" placeholder="新闻类型" @change="fetchData(currentPage = 1)">
            <el-option
              v-for="item in typeStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3"><el-button icon="el-icon-search" @click="fetchData(currentPage = 1)">搜索</el-button></el-col>
        <el-col :span="6">
          <router-link to="add">
            <el-button type="success"> 添加新闻</el-button>
          </router-link>
        </el-col>
      </el-row>
    </div>
    
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.row.news_id}}
        </template>
      </el-table-column>
      <el-table-column label="新闻标题" align="center">
        <template slot-scope="scope">
          {{scope.row.news_title}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="新闻类型" width="100" align="center" >
        <template slot-scope="scope">
          <span v-if="scope.row.news_type == '1'" >联盟新闻 </span>
          <span v-if="scope.row.news_type == '2'" >行业新闻 </span>
        </template>
      </el-table-column>
      <el-table-column label="新闻作者" align="center">
        <template slot-scope="scope">
          {{scope.row.news_auther}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="新闻状态" width="100" align="center" >
        <template slot-scope="scope">
          <el-tag :type="scope.row.news_state | statusFilter">
            <span v-if="scope.row.news_state == '1'" >上线 </span>
            <span v-if="scope.row.news_state == '-1'" >下线 </span>
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
            <router-link :to="{name:'NewsDetail',query:{news_id:scope.row.news_id}}">
              <el-button type="primary" icon="el-icon-edit-outline" circle size='mini'></el-button>
            </router-link>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="更改状态" placement="top">
            <span v-if="scope.row.news_state == '1'">
              <el-button type="warning" icon="el-icon-arrow-down" circle size='mini' @click="changeState(scope.row,'-1')"></el-button>
            </span>
            <span v-if="scope.row.news_state == '-1'">
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
import { getNewsList, editNewsState } from "@/api/fetch";

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        searchVal: "",
        status: "",
        newstype: ""
      },
      currentPage: 1,
      pageSize: 10,
      totalData: 0,
      userStatus: [
        {
          value: "",
          label: "全部新闻状态"
        },
        {
          value: "1",
          label: "上线"
        },
        {
          value: "-1",
          label: "下线"
        }
      ],
      typeStatus: [
        {
          value: "",
          label: "全部新闻类型"
        },
        {
          value: "1",
          label: "联盟新闻"
        },
        {
          value: "2",
          label: "行业新闻"
        }
      ],
      showType: null,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      allLoading: ""
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        "1": "success",
        "-1": "gray"
        // deleted: 'danger'
      };
      return statusMap[status];
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    //加载表格
    fetchData() {
      this.listLoading = true;
      this.listQuery.currentPage = this.currentPage;
      this.listQuery.pageSize = this.pageSize;
      getNewsList(this.listQuery).then(response => {
        this.list = response.resData.items;
        this.totalData = parseInt(response.resData.page.total);
        this.listLoading = false;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    beginLoad() {
      this.allLoading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    //更改状态
    changeState(dData, needState) {
      let stateStr =
        dData.news_state == "1"
          ? " 设置为下线状态，将在会议设置中不显示该新闻"
          : " 设置为上线状态，将在会议设置中显示该新闻";
      this.$confirm(
        "此操作将把" + dData.news_name + stateStr + ", 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.beginLoad();
          let params = {
            newsid: dData.news_id,
            state: needState
          };
          editNewsState(params)
            .then(response => {
              if (response && response.resCode === 200 && response.resData) {
                this.$message({
                  message: "状态修改成功。",
                  type: "success"
                });
                this.fetchData();
                this.allLoading.close();
              } else {
                this.allLoading.close();
              }
            })
            .catch(() => {
              this.allLoading.close();
            });
        })
        .catch(() => {});
    }
  }
};
</script>
<style>
.el-input {
  width: 80%;
}
</style>

