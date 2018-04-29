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
          {{scope.row.events_name}}
        </template>
      </el-table-column>
      <el-table-column label="报名人数" align="center">
        <template slot-scope="scope">
          {{scope.row.users.length}}
        </template>
      </el-table-column>
      <el-table-column label="公司电话" align="center">
        <template slot-scope="scope">
          {{scope.row.com_phone}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="报名时间" width="180">
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
      <el-table-column align="center" prop="created_at" label="查看/编辑" >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看/编辑信息" placement="top">
            <!-- <router-link :to="{name:'MediaDetail',query:{media_id:scope.row.media_id}}"> -->
              <el-button type="primary" icon="el-icon-edit-outline" circle size='mini' @click="dialogFormVisible = true, form=scope.row"></el-button>
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
    
    <!-- 对话框 -->
    <el-dialog title="详情信息及及录入" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="报名ID" :label-width="formLabelWidth">
          <el-input  v-model="form.com_id" :disabled="inputState"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" :label-width="formLabelWidth">
          <el-input v-model="form.com_name" auto-complete="off" :disabled="inputState"></el-input>
        </el-form-item>
        <el-form-item label="参加人数" :label-width="formLabelWidth">
          <el-input v-model="form.users.length" auto-complete="off" :disabled="inputState"></el-input>
        </el-form-item>
        <el-form-item label="报名人姓名" :label-width="formLabelWidth">
          <span v-for="val in form.users" :key="val.user_id"> {{val.user_name}} </span>
        </el-form-item>
        <el-form-item label="公司发票抬头" :label-width="formLabelWidth">
          <el-input v-model="form.com_invoices_title" auto-complete="off" :disabled="inputState"></el-input>
        </el-form-item>
        <el-form-item label="公司税号" :label-width="formLabelWidth">
          <el-input v-model="form.com_duty_num" auto-complete="off" :disabled="inputState"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.com_phone" auto-complete="off" :disabled="inputState"></el-input>
        </el-form-item>
        <el-form-item label="传真" :label-width="formLabelWidth">
          <el-input v-model="form.com_fax" auto-complete="off" :disabled="inputState"></el-input>
        </el-form-item>
        <el-form-item label="邮政地址" :label-width="formLabelWidth">
          <el-input v-model="form.com_postal_addr" auto-complete="off" :disabled="inputState"></el-input>
        </el-form-item>
        <el-form-item label="邮编" :label-width="formLabelWidth">
          <el-input v-model="form.com_postal_code" auto-complete="off" :disabled="inputState"></el-input>
        </el-form-item>
        <el-form-item label="付费价格" :label-width="formLabelWidth">
          <el-input v-model="form.pay_price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="付费渠道" :label-width="formLabelWidth">
          <el-input v-model="form.pay_method" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="发票" :label-width="formLabelWidth">
          <el-radio v-model="form.invoice_state" label="1">已开</el-radio>
          <el-radio v-model="form.invoice_state" label="-1">未开</el-radio>
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
import { getEventsRegisterList, getEventsList, editEventsRegister } from '@/api/fetch'

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
      allLoading: '',
      inputState: true,
      form:{
        com_id: '',
        com_invoices_title: '',
        com_name: '',
        com_phone: '',
        com_postal_addr: '',
        com_postal_code: '',
        create_date: '',
        events_id: '',
        users: '',
        com_duty_num: '',
        // com_id: '',
        // com_id: '',
        // com_id: ''
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
    saveInfo(){
      this.beginLoad();
      //editEventsRegister
      editEventsRegister(this.form).then(response => {
        if(response.resCode === 200 && response.resData){
          this.fetchData();
          this.dialogFormVisible = false;
          this.allLoading.close();
          this.$message({
            message: '信息添加成功',
            type: 'success'
          });
        }else{
          this.allLoading.close();
        }
        this.allLoading.close();
      })
    }
    //更改状态
    // changeState(dData,needState){
    //   let stateStr = dData.media_state == '1'? ' 设置为下线状态，将在会议设置中不显示该媒体':' 设置为上线状态，将在会议设置中显示该媒体';
    //   this.$confirm('此操作将把'+ dData.media_name + stateStr +', 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.beginLoad();
    //     let params = {
    //       mediaid: dData.media_id,
    //       state: needState
    //     }
    //     editMediaState(params).then(response => {
    //       if(response && response.resCode === 200 && response.resData){
    //         this.$message({
    //           message: '状态修改成功。',
    //           type: 'success'
    //         });
    //         this.fetchData();
    //         this.allLoading.close();
    //       }else{
    //         this.allLoading.close();
    //       }
    //     }).catch(() => {
    //       this.allLoading.close();
    //     })     
    //   }).catch(() => {
              
    //   });
    // },
  }
}
</script>
<style>
.el-input{
  width: 80%;
}
</style>

