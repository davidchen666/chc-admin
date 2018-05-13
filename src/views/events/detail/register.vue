<template>
    <div class="app-container">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="报名价格">
                <el-input type="textarea" autosize placeholder="价格名称->价格->描述信息" v-model="form.events_register_cost"> </el-input>
                <span>请输入关于报名价格，回车换行新增，格式如: 早鸟价->180元/人->3月1日前报名并付费</span>
            </el-form-item>
            <el-form-item label="注意事项">
                <el-input type="textarea" autosize placeholder="请输入注意事项内容" v-model="form.events_register_attention"> </el-input>
            </el-form-item>
            <el-form-item label="付费及开票">
                <el-input type="textarea" autosize placeholder="请输入内容" v-model="form.events_register_cost_intro"> </el-input>
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
        "events_register_cost,events_register_attention,events_register_cost_intro",
      form: {
        events_register_cost: "",
        events_register_attention: "",
        events_register_cost_intro: ""
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
