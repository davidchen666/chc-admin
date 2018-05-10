<template>
    <div class="app-container">
        
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="">
              <el-input placeholder="请输入关键字搜索嘉宾" v-model="searchVal" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
            
            <el-form-item label="大会主席">
                <el-select v-model="form.events_speaker_main" multiple placeholder="请选择">
                  <el-option v-for="item in speakerList" :key="item.speaker_id" :value="item.speaker_id" :label="item.speaker_name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="特邀嘉宾">
                <el-select v-model="form.events_speaker_invite" multiple placeholder="请选择">
                  <el-option v-for="item in speakerList" :key="item.speaker_id" :value="item.speaker_id" :label="item.speaker_name"></el-option>
                </el-select>
            </el-form-item>
<!-- {{form.speaker}} -->
            <div v-for="(val,key) in form.speaker" :key="key">
              <el-form-item label="嘉宾类目">
                <el-col :span="4" class="small-input">
                  <el-input :placeholder="val"></el-input>
                </el-col>
                <el-col class="line" :span="2">嘉宾人员</el-col>
                <el-col :span="10">
                  <el-select v-model="form.events_speaker_invite" multiple placeholder="请选择">
                    <el-option v-for="item in speakerList" :key="item.speaker_id" :value="item.speaker_id" :label="item.speaker_name"></el-option>
                  </el-select>
                </el-col>
                <el-col class="line" :span="5">
                  <el-button type="primary" @click="addType">添加新类目</el-button>
                </el-col>
              </el-form-item>
            </div>

            <el-form-item>
                <el-button type="primary" @click="saveInfo">保存</el-button>
                <el-button @click="back">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { getEventsInfo, editEventsInfo, getSpeakerList } from "@/api/fetch";
export default {
  data() {
    return {
      autoSize: { minRows: 2, maxRows: 4 },
      currentRouter: "",
      listLoading: false,
      allLoading: "",
      addSpeakerData: "",
      speakerList: [],
      queryData: "events_speaker_main,events_speaker_invite",
      sampleSpeaker: {
        speaker_type: "",
        speaker_data: []
      },
      form: {
        events_id: "",
        events_speaker_main: [],
        events_speaker_invite: [],
        speaker: []
      },
      searchVal: ""
    };
  },
  created() {
    this.currentRouter = this.$route.name;
    
    this.fetchSpeakerList();
    this.getDetail(this.$route.query.events_id);
  },
  methods: {
    fetchSpeakerList() {
      let paramsData = { currentPage: 1, pageSize: 100 };
      getSpeakerList(paramsData).then(response => {
        this.speakerList = response.resData.items;
        // console.log(this.speakerList);
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
          response.resData.items[0].events_speaker_main = response.resData
            .items[0].events_speaker_main
            ? JSON.parse(response.resData.items[0].events_speaker_main)
            : [];
          response.resData.items[0].events_speaker_invite = response.resData
            .items[0].events_speaker_invite
            ? JSON.parse(response.resData.items[0].events_speaker_invite)
            : [];
          this.form = response.resData.items[0];
        }
        this.form.speaker = [];
        this.form.speaker.push(this.sampleSpeaker);
      });
    },
    //
    addType() {
      this.form.speaker.push(this.sampleSpeaker);
      // this.form.speaker.push(this.sampleSpeaker);
//       var _data = ["Banana", "Orange", "Apple", "Mango"];
//       // _data.push(this.sampleSpeaker);
// _data.push("Kiwi")
      console.log(this.form);
      // console.log(_data);
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
/* .el-textarea,
.el-input {
  width: 500px;
} */
.small-input .el-input {
  width: 160px;
}
</style>
