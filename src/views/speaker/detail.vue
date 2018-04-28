<template>
  <div class="app-container" v-loading.body="listLoading">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="嘉宾姓名">
        <el-input v-model="form.speaker_name" placeholder="嘉宾姓名"></el-input>
      </el-form-item>
      <el-form-item label="嘉宾头像(x1)">
        <el-upload :action="uploadUrl" list-type="picture-card" :file-list="speakerPicList" :on-error="picError" :multiple="speakerMultiple" :limit='speakerPicLimit' 
        :on-exceed="overSpeakerPicLimit" :on-success="speakerPicSuccess" :on-preview="handleSpeakerPictureCardPreview" :on-remove="handleSpeakerRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="嘉宾头衔">
        <el-input v-model="form.speaker_honor" placeholder="嘉宾头衔"></el-input>
      </el-form-item>
      <el-form-item label="公司+身份">
        <el-input v-model="form.speaker_identity" placeholder="公司+身份"></el-input>
      </el-form-item>
      <el-form-item label="是否显示"  v-loading.body="listLoading" element-loading-text="加载中">
        <el-radio v-model="form.speaker_state" label="1">上线</el-radio>
        <el-radio v-model="form.speaker_state" label="-1">不上线</el-radio>
      </el-form-item>
      <!-- speaker_identity, speaker_simple_intro, speaker_detail_intro, speaker_state, speaker_remark -->
      <el-form-item label="简短介绍">
        <el-input type="textarea" autosize placeholder="简短介绍" v-model="form.speaker_simple_intro" > </el-input>
      </el-form-item>
      <el-form-item label="嘉宾介绍">
        <el-input type="textarea" autosize placeholder="嘉宾介绍" v-model="form.speaker_detail_intro" > </el-input>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input type="textarea" autosize placeholder="备注信息" v-model="form.speaker_remark" > </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getSpeakerList, addSpeaker, editSpeaker } from '@/api/fetch'
export default {
  data() {
    return {
      allLoading: '',
      listLoading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl: '',
      currentRouter: '',
      speakerMultiple: false,
      speakerPicLimit: 1,
      speakerPicList:[],
      form: {
        speaker_name: '',
        speaker_pic: '',
        speaker_honor: '',
        speaker_identity: '',
        speaker_simple_intro: '',
        speaker_detail_intro: '',
        speaker_state: '1',
        speaker_remark: ''
      }
    }
  },
  created(){
    //上传地址
    this.uploadUrl = process.env.BASE_API + '?m=speaker&a=uploadFile';
    this.init();
  },
  watch: {
    "$route.name": "init"
  },
  methods: {
    init(){
      this.currentRouter = this.$route.name;
      //编辑页面,验证参数
      if(this.currentRouter === 'SpeakerDetail'){
        //将数据渲染到页面
        if(this.$route.query.speaker_id){
          this.getDetail(this.$route.query.speaker_id);
        }else{
          this.$message({
            showClose: true,
            message: '访问的地址不正确,正在返回...',
            type: 'error'
          });
          history.go(-1);
          return;
        }
      }else{
        this.speakerPicList = [];
        this.form = {
          speaker_name: '',
          speaker_pic: '',
          speaker_honor: '',
          speaker_identity: '',
          speaker_simple_intro: '',
          speaker_detail_intro: '',
          speaker_state: '1',
          speaker_remark: ''
        };
      }
    },
    getDetail(speaker_id) {
      this.listLoading = true
      getSpeakerList({speakerid: speaker_id}).then(response => {
        this.listLoading = false
        // console.log(response);
        if(response.resCode === 200){
          this.form =  response.resData.items[0];
          if(this.form.speaker_pic){
            this.speakerPicList=[{
              name: this.form.speaker_pic,
              url: process.env.BASE_TOTAL_API + 'uploads/speaker/' + this.form.speaker_pic
            }];
          }
        }
      })
    },
    //=========upload pic=====
    handleSpeakerRemove(file, fileList) {
      // console.log(file, fileList);
      this.reloadSpeakerPic(fileList);
    },
    handleSpeakerPictureCardPreview(file) {
      // this.dialogImageUrl = file.url;
      this.dialogImageUrl = process.env.BASE_TOTAL_API + 'uploads/speaker/' + file.name;
      // console.log(this.dialogImageUrl);
      this.dialogVisible = true;
    },
    speakerPicSuccess(response, file, fileList){
      console.log(response, file, fileList);
      if(response.resCode === 400){
        fileList.pop();
        this.$message({
          message: response.resData,
          type: 'warning'
        })
      }else{
        file.name = response.resData.newname;
      }
      this.reloadSpeakerPic(fileList);
    },
    overSpeakerPicLimit(files, fileList){
      this.$message({
        message: '上传失败，最多可以上传' + this.speakerPicLimit + '张图片',
        type: 'warning'
      })
    },
    picError(){
      // console.log(err, file, fileList);
      this.$message({
        message: '上传失败，请刷新页面后再上传',
        type: 'warning'
      })
    },
    //重新计算speaker pic
    reloadSpeakerPic(fileList){
      console.log(fileList);
      if(fileList && fileList.length && fileList[0].name){
        this.form.speaker_pic = fileList[0].name;
      }else{
        this.form.speaker_pic = '';
      }
      console.log(this.form.speaker_pic);
    },
    //======loading======
    beginLoad(){
      this.allLoading = this.$loading({
        lock: true,
        text: '请求中，请稍等...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    //======submit======
    onSubmit() {
      this.beginLoad()
      //添加
      if(this.currentRouter === 'SpeakerAdd'){
        addSpeaker(this.form).then(response => {
          console.log(response)
          if(response && response.resCode === 200 && response.resData){
            this.$message({
              message: '添加成功。',
              type: 'success'
            });
            this.allLoading.close();
          }else{
            this.allLoading.close();
          }
        })
      }
      //编辑
      if(this.currentRouter === 'SpeakerDetail'){
        editSpeaker(this.form).then(response => {
          console.log(response)
          if(response && response.resCode === 200 && response.resData){
            this.$message({
              message: '修改成功。',
              type: 'success'
            });
            this.allLoading.close();
          }else{
            this.allLoading.close();
          }
        })
      }
      // this.$message('submit!')
    },
    onCancel() {
      history.go(-1);
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.el-date-editor .el-range-separator{
  width: 10%;
  padding: 0 0px;
}
.el-input,.el-textarea,
.el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner 
{
  width: 400px;
}
</style>

