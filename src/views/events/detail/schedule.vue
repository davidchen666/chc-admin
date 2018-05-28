<template>
    <div class="app-container">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="会议日程标题">
                <el-input placeholder="请输入会议日程标题" v-model="form.events_schedule_title"> </el-input>
            </el-form-item>
            <el-form-item label="内容(简化)">
                <el-input type="textarea" autosize placeholder="9:00-9:10->会议签到" v-model="form.events_schedule_content_simple"> </el-input>
                <span>显示于首页，若不填写，首页将不显示会议日程。回车换行新增，格式如 9:00-9:10->会议签到</span>
            </el-form-item>
            <el-form-item label="内容(完全版)">
                <!-- <el-input type="textarea" autosize placeholder="9:00-9:10->会议签到" v-model="form.events_schedule_content"> </el-input>
                <span>请输入关于会议日程内容，回车换行新增，格式如 9:00-9:10->会议签到</span> -->
                <UE :defaultMsg=form.events_schedule_content :config=config :id=scheduleInfo :ref=scheduleInfo></UE>
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
import UE from "../../../components/Helper/uedit.vue";
export default {
  components: {
    UE
  },
  data() {
    return {
      autoSize: { minRows: 2, maxRows: 4 },
      currentRouter: "",
      listLoading: false,
      allLoading: "",
      queryData: "events_schedule_title,events_schedule_content,events_schedule_content_simple",
      form: {
        events_schedule_title: "",
        events_schedule_content: "",
        events_schedule_content_simple: "",
      },
      scheduleInfo: "scheduleInfo", // 不同编辑器必须不同的id
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 250
      }
    };
  },
  created() {
    this.currentRouter = this.$route.name;
    if (this.currentRouter === "EventsDetail") {
      this.getDetail(this.$route.query.events_id);
    }
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
          this.setUEContent(this.scheduleInfo, this.form.events_schedule_content);
        }
      });
    },
    //======== ueditor 编辑器 =======
    getUEContent(name) {
      // let content = this.$refs.ue.getUEContent(); // 调用子组件方法
      let content = this.$refs[name].getUEContent(); // 调用子组件方法
      // this.$notify({
      //   title: '获取成功，可在控制台查看！',
      //   message: content,
      //   type: 'success'
      // });
      // console.log(content)
      return content;
    },
    getUEContentTxt(obj) {
      // let content = this.$refs.ue.getUEContentTxt(); // 调用子组件方法
      this.$notify({
        title: "获取成功，可在控制台查看！",
        message: content,
        type: "success"
      });
      console.log(content);
    },
    setUEContent(name, content) {
      // let content = this.$refs.ue.getUEContent(); // 调用子组件方法
      // let content = this.$refs[name].setUEContent(); // 调用子组件方法
      return this.$refs[name].setUEContent(content);
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
        this.form.events_schedule_content = this.getUEContent(this.scheduleInfo);
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
