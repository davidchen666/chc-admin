<template>
    <div class="app-container" v-loading.body="listLoading">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="关于会议">
                <el-input type="textarea" placeholder="请输入关于会议内容" autosize v-model="form.events_about"> </el-input>
                <span>简化版本，用于显示关于会议页</span>
            </el-form-item>
            <el-form-item label="关于会议(简化)">
                <el-input type="textarea" autosize placeholder="请输入关于会议内容" v-model="form.events_about_simple"> </el-input>
                <span>简化版本，用于显示会议首页，不输入表示会议首页不显示关于会议</span>
            </el-form-item>
            <el-form-item label="邀请企业">
                <el-input type="textarea" autosize placeholder="请输入邀请企业，回车输入多个" v-model="form.events_about_invite_company"> </el-input>
                <span>回车输入多个</span>
            </el-form-item>
            <el-form-item label="邀请机构">
                <el-input type="textarea" autosize placeholder="请输入邀请企业，回车输入多个" v-model="form.events_about_invite_disarmament"> </el-input>
                <span>回车输入多个</span>
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
      queryData:
        "events_about,events_about_simple,events_about_invite_company,events_about_invite_disarmament",
      form: {
        events_about: "",
        events_about_simple: "",
        events_about_invite_company: "",
        events_about_invite_disarmament: ""
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
