<template>
    <div class="app-container">
        
        <el-form ref="form" :model="form" label-width="120px">
            <!-- <el-form-item label="">
              <el-input placeholder="请输入关键字搜索嘉宾" v-model="searchVal" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item> -->
            
            <!-- <el-form-item label="大会主席">
                <el-select v-model="form.events_speaker_main" multiple placeholder="请选择">
                  <el-option v-for="item in speakerList" :key="item.speaker_id" :value="item.speaker_id" :label="item.speaker_name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="特邀嘉宾">
                <el-select v-model="form.events_speaker_invite" multiple placeholder="请选择">
                  <el-option v-for="item in speakerList" :key="item.speaker_id" :value="item.speaker_id" :label="item.speaker_name"></el-option>
                </el-select>
            </el-form-item> -->

            <el-form-item label="嘉宾类目" v-for="(val,key) in form.events_speaker" :key="key">
              <el-col :span="4" class="small-input">
                <el-input :placeholder="key" v-model="form.events_speaker[key].speaker_type"></el-input>
              </el-col>
              <el-col class="line" :span="2" style="text-align: center;">嘉宾人员</el-col>
              <el-col :span="11">
                <!-- <el-select v-model="form.speaker[key].speaker_data" multiple placeholder="请选择">
                  <el-option v-for="item in speakerList" :key="item.speaker_id" :value="item.speaker_id" :label="item.speaker_name"></el-option>
                </el-select> -->
                <el-select v-model="form.events_speaker[key].speaker_data" @focus="currentKey=key" multiple filterable remote reserve-keyword placeholder="请输入关键词" :loading="searchLoading" :remote-method="fetchSpeakerList">
                  <el-option v-for="item in speakerList" :key="item.speaker_id" :value="item.speaker_id" :label="item.speaker_name"></el-option>
                </el-select>
              </el-col>
              <el-col class="line" :span="2">
                <el-button type="primary" @click="addType" size="small" v-show="form.events_speaker.length-1 === key">添加类目</el-button>
              </el-col>
              <el-col class="line" :span="2">
              </el-col>
              <el-col class="line" :span="2" v-show="form.events_speaker.length > 1">
                <el-button type="danger" size="small" @click="delType(key)">删除类目</el-button>
              </el-col>
            </el-form-item>

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
      searchLoading: false,
      addSpeakerData: "",
      speakerList: [],
      // queryData: "events_speaker_main,events_speaker_invite",
      queryData: "events_speaker",
      // sampleSpeaker: {
      //   id: 0,
      //   speaker_type: "",
      //   speaker_data: []
      // },
      form: {
        events_id: "",
        // events_speaker_main: [],
        // events_speaker_invite: [],
        events_speaker: [
          {
            speaker_type: "",
            speaker_data: []
          }
        ]
      },
      searchVal: [],
      currentKey: 0
    };
  },
  created() {
    this.currentRouter = this.$route.name;
    
    this.fetchSpeakerList('');
    this.getDetail(this.$route.query.events_id);
  },
  methods: {
    fetchSpeakerList(searchVal) {
      // if(this.searchVal === searchVal && searchVal !== ''){
      //   return;
      // }
      // console.log('------value----->',searchVal);
      // console.log('------key---->',this.currentKey);
      // return;
      this.searchLoading = true;
      this.searchVal[this.currentKey] = searchVal;
      // console.log(searchVal,key);
      let paramsData = { currentPage: 1, pageSize: 100, searchVal: this.searchVal[this.currentKey] };
      getSpeakerList(paramsData).then(response => {
        this.speakerList = response.resData.items;
      });
      this.searchLoading = false;
      // console.log(this.speakerList);
    },
    getDetail(events_id) {
      this.listLoading = true;
      let params = {
        events_id: events_id,
        query: this.queryData
      };
      getEventsInfo(params).then(response => {
        this.listLoading = false;
        // console.log('speaker-----',response);
        if (response.resCode === 200) {
          // response.resData.items[0].events_speaker_main = response.resData
          //   .items[0].events_speaker_main
          //   ? JSON.parse(response.resData.items[0].events_speaker_main)
          //   : [];
          // response.resData.items[0].events_speaker_invite = response.resData
          //   .items[0].events_speaker_invite
          //   ? JSON.parse(response.resData.items[0].events_speaker_invite)
          //   : [];
          // response.resData.items[0].events_speaker = 
          // response.resData.items[0].events_speaker? 
          // JSON.parse(response.resData.items[0].events_speaker) : [{speaker_type: "",speaker_data: []}];
          // this.form = response.resData.items[0];
          
          if(response.resData.items[0].events_speaker){
            this.form.events_speaker = JSON.parse(response.resData.items[0].events_speaker);
          }
          // console.log('form-----',this.form);
        }

      });
    },
    //添加类型
    addType() {
      let smallData = {
        speaker_type: "",
        speaker_data: []
      }; 
      this.form.events_speaker.push(smallData);
      // console.log(this.form);
      this.fetchSpeakerList('');
    },
    //删除
    delType(index){
      this.form.events_speaker.splice(index,1);
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
        this.form.events_id = this.$route.query.events_id;
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
  width: 80%;
} */
.el-textarea, .el-input {
    width: 100px;
}
.small-input .el-input {
  width: 160px;
}
</style>
