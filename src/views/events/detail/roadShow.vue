<template>
    <div class="app-container">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="关联路演项目">
                <el-select v-model="form.events_road_id" placeholder="请选择">
                    <el-option value="0" label="--无--"></el-option>
                    <el-option v-for="item in listData" :key="item.road_id" :value="item.road_id" :label="item.road_name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveInfo">保存</el-button>
                <el-button @click="back">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { getEventsInfo, editEventsInfo, getRoadShowList } from "@/api/fetch";
export default {
  data() {
    return {
      autoSize: { minRows: 2, maxRows: 4 },
      currentRouter: "",
      listLoading: false,
      allLoading: "",
      listData: [],
      queryData: "events_road_id",
      form: {
        events_id: "",
        events_road_id: ""
      }
    };
  },
  created() {
    this.currentRouter = this.$route.name;
    this.fetchList();
    if (this.currentRouter === "EventsDetail") {
      this.getDetail(this.$route.query.events_id);
    }
  },
  methods: {
    fetchList() {
      let paramsData = { currentPage: 1, pageSize: 100 };
      getRoadShowList(paramsData).then(response => {
        this.listData = response.resData.items;
        // console.log(this.listData);
      });
    },
    getDetail(events_id) {
      this.listLoading = true;
      let params = {
        events_id: events_id,
        query: this.queryData
      };
      getEventsInfo(params).then(response => {
        this.listLoading = false;
        // console.log(response);
        if (response.resCode === 200) {
          this.form = response.resData.items[0];
        }
      });
    },
    //======loading======
    beginLoad() {
      this.allLoading = this.$loading({
        lock: true,
        text: "请求中，请稍等...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    saveInfo() {
      //编辑
      if (this.currentRouter === "EventsDetail") {
        this.beginLoad();
        this.form.query = this.queryData;
        editEventsInfo(this.form).then(response => {
          // console.log(response)
          if (response && response.resCode === 200 && response.resData) {
            this.$message({
              message: "修改成功。",
              type: "success"
            });
            this.allLoading.close();
          } else {
            this.allLoading.close();
          }
        });
      } else {
        this.$message({
          message: "操作失败！请先保存会议信息。",
          type: "success"
        });
      }
    },
    back() {
      history.go(-1);
    }
  }
};
</script>
<style>
.el-textarea,
.el-input {
  width: 500px;
}
</style>
