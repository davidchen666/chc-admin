<template>
  <div class="app-container" v-loading.body="listLoading">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="全部会员(x1)">
        <el-upload :action="uploadUrl" list-type="picture-card" :file-list="memberPicList" :on-error="picError" :multiple="memberMultiple" :limit='memberPicLimit' 
        :on-exceed="overMemberPicLimit" :on-success="memberPicSuccess" :on-preview="handleMemberPictureCardPreview" :on-remove="handleMemberRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input type="textarea" autosize placeholder="" v-model="form.remark" > </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getPage, editPage } from '@/api/fetch'
export default {
  data() {
    return {
      allLoading: '',
      listLoading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl: '',
      currentRouter: '',
      memberMultiple: false,
      memberPicLimit: 1,
      memberPicList:[],
      form: {
        id: '5',
        remark: "",
        pic: ""
      }
    }
  },
  created(){
    //上传地址
    this.uploadUrl = process.env.BASE_API + "?m=alliance&a=uploadFile";
    this.init();
  },
  watch: {
    "$route.name": "init"
  },
  methods: {
    //初始化
    init() {
      this.getDetail();
    },
    getDetail() {
      // const self = this;
      this.listLoading = true;
      getPage({ id: this.form.id }).then(response => {
        this.listLoading = false;
        // console.log(response);
        if (response.resCode === 200) {
          this.form = response.resData[0];
          if (this.form.pic) {
            this.memberPicList = [
              {
                name: this.form.pic,
                url: process.env.BASE_TOTAL_API + "uploads/alliance/" + this.form.pic
              }
            ];
          }
        }
      });
    },
    //=========upload pic=====
    handleMemberRemove(file, fileList) {
      // console.log(file, fileList);
      this.reloadMemberPic(fileList);
    },
    handleMemberPictureCardPreview(file) {
      // this.dialogImageUrl = file.url;
      this.dialogImageUrl = process.env.BASE_TOTAL_API + 'uploads/alliance/' + file.name;
      // console.log(this.dialogImageUrl);
      this.dialogVisible = true;
    },
    memberPicSuccess(response, file, fileList){
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
      this.reloadMemberPic(fileList);
    },
    overMemberPicLimit(files, fileList){
      this.$message({
        message: '上传失败，最多可以上传' + this.memberPicLimit + '张图片',
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
    //重新计算member pic
    reloadMemberPic(fileList){
      // console.log(fileList);
      if(fileList && fileList.length && fileList[0].name){
        this.form.pic = fileList[0].name;
      }else{
        this.form.pic = '';
      }
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
      this.beginLoad();
      //编辑
      editPage(this.form).then(response => {
        console.log(response);
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

