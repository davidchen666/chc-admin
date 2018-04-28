<template>
  <div class="app-container" v-loading.body="listLoading">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="媒体名称">
        <el-input v-model="form.media_name" placeholder="媒体名称"></el-input>
      </el-form-item>
      <el-form-item label="媒体LOGO(x1)">
        <el-upload :action="uploadUrl" list-type="picture-card" :file-list="mediaPicList" :on-error="picError" :multiple="mediaMultiple" :limit='mediaPicLimit' 
        :on-exceed="overMediaPicLimit" :on-success="mediaPicSuccess" :on-preview="handleMediaPictureCardPreview" :on-remove="handleMediaRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="所属公司">
        <el-input v-model="form.media_company" placeholder="所属公司"></el-input>
      </el-form-item>
      <el-form-item label="公司简称">
        <el-input v-model="form.media_company_simple" placeholder="公司简称"></el-input>
      </el-form-item>
      <el-form-item label="是否上线"  v-loading.body="listLoading" element-loading-text="加载中">
        <el-radio v-model="form.media_state" label="1">上线</el-radio>
        <el-radio v-model="form.media_state" label="-1">不上线</el-radio>
      </el-form-item>
      <el-form-item label="媒体简介">
        <el-input type="textarea" autosize placeholder="媒体简介" v-model="form.media_intro" > </el-input>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input type="textarea" autosize placeholder="备注信息" v-model="form.media_remark"> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getMediaList, addMedia, editMedia } from '@/api/fetch'
export default {
  data() {
    return {
      allLoading: '',
      listLoading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl: '',
      currentRouter: '',
      mediaMultiple: false,
      mediaPicLimit: 1,
      mediaPicList:[],
      //media_id, media_name, media_company, media_company_simple, media_intro, media_remark, media_pic, media_state,
      form: {
        media_id: '',
        media_name: '',
        media_company: '',
        media_company_simple: '',
        media_intro: '',
        media_pic: '',
        media_detail_intro: '',
        media_state: '1',
        media_remark: ''
      }
    }
  },
  created(){
    // console.log(process.env);
    //上传地址
    this.uploadUrl = process.env.BASE_API + '?m=media&a=uploadFile';
    this.init();
  },
  watch: {
    "$route.name": "init"
  },
  methods: {
    init(){
      this.currentRouter = this.$route.name;
      //编辑页面,验证参数
      if(this.currentRouter === 'MediaDetail'){
        //将数据渲染到页面
        if(this.$route.query.media_id){
          this.getDetail(this.$route.query.media_id);
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
        this.mediaPicList = [];
        this.form = {
          media_id: '',
          media_name: '',
          media_company: '',
          media_company_simple: '',
          media_intro: '',
          media_pic: '',
          media_detail_intro: '',
          media_state: '1',
          media_remark: ''
        }
      }
      
    },
    getDetail(media_id) {
      this.listLoading = true
      getMediaList({mediaid: media_id}).then(response => {
        this.listLoading = false
        // console.log(response);
        if(response.resCode === 200){
          this.form =  response.resData.items[0];
          if(this.form.media_pic){
            this.mediaPicList=[{
              name: this.form.media_pic,
              url: process.env.BASE_TOTAL_API + 'uploads/media/' + this.form.media_pic
            }];
          }
        }
      })
    },
    //=========upload pic=====
    handleMediaRemove(file, fileList) {
      // console.log(file, fileList);
      this.reloadMediaPic(fileList);
    },
    handleMediaPictureCardPreview(file) {
      // this.dialogImageUrl = file.url;
      this.dialogImageUrl = process.env.BASE_TOTAL_API + 'uploads/media/' + file.name;
      // console.log(this.dialogImageUrl);
      this.dialogVisible = true;
    },
    mediaPicSuccess(response, file, fileList){
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
      this.reloadMediaPic(fileList);
    },
    overMediaPicLimit(files, fileList){
      this.$message({
        message: '上传失败，最多可以上传' + this.mediaPicLimit + '张图片',
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
    //重新计算Media pic
    reloadMediaPic(fileList){
      console.log(fileList);
      if(fileList && fileList.length && fileList[0].name){
        this.form.media_pic = fileList[0].name;
      }else{
        this.form.media_pic = '';
      }
      console.log(this.form.media_pic);
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
      if(this.currentRouter === 'MediaAdd'){
        addMedia(this.form).then(response => {
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
      if(this.currentRouter === 'MediaDetail'){
        editMedia(this.form).then(response => {
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

