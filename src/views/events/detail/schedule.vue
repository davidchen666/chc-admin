<template>
    <div class="app-container">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="会议日程标题">
                <el-input placeholder="请输入会议日程标题" v-model="form.events_schedule_title"> </el-input>
            </el-form-item>
            <el-form-item label="会议日程内容">
                <el-input type="textarea" autosize placeholder="9:00-9:10->会议签到" v-model="form.events_schedule_content"> </el-input>
                <span>请输入关于会议日程内容，回车换行新增，格式如 9:00-9:10->会议签到</span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveInfo">保存</el-button>
                <el-button @click="back">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { getEventsInfo, editEventsInfo } from "@/api/fetch";
export default {
  data() {
    return {
      autoSize: { minRows: 2, maxRows: 4 },
      currentRouter: "",
      listLoading: false,
      allLoading: "",
      queryData: "events_schedule_title,events_schedule_content",
      form: {
        events_schedule_title: "",
        events_schedule_content: ""
      }
    };
  },
  created() {
    this.currentRouter = this.$route.name;
    this.getDetail(this.$route.query.events_id);
  },
  methods: {
    getDetail(events_id) {
      this.listLoading = true;
      let params = {
        events_id: events_id,
        query: this.queryData
      };
      getEventsInfo(params).then(response => {
        this.listLoading = false;
        console.log(response);
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
