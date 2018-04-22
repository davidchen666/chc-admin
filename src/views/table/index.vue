<template>
  <div class="app-container">
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
      <el-table-column label="会议时间" width="110" align="center">
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
            <span v-if="scope.row.events_state == '1'" >上线 </span>
            <span v-if="scope.row.events_state == '-1'" >下线 </span>
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
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  data() {
    return {
      list: null,
      listLoading: true
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
      getList(this.listQuery).then(response => {
        this.list = response.resData.items
        this.listLoading = false
      })
    }
  }
}
</script>
