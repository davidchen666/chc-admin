<template>
  <div class="app-container" v-loading.body="listLoading">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="是否上线"  v-loading.body="listLoading" element-loading-text="加载中">
        <el-radio v-model="form.state" label="1">上线</el-radio>
        <el-radio v-model="form.state" label="-1">不上线</el-radio>
      </el-form-item>
      <el-form-item label="banner图片 (x1)">
        <el-upload :action="uploadUrl" list-type="picture-card" :file-list="aboutPicList" :on-error="picError" :multiple="aboutMultiple" :limit='aboutPicLimit' 
        :on-exceed="overAboutPicLimit" :on-success="aboutPicSuccess" :on-preview="handleAboutPictureCardPreview" :on-remove="handleAboutRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="内容">
        <UE :defaultMsg=form.content :config=config :id=aboutInfo :ref=aboutInfo></UE>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input type="textarea" autosize placeholder="" v-model="form.remark" > </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
    <!-- <button @click="getUEContent()">获取内容</button>
    <button @click="getUEContentTxt()">获取无文本内容</button> -->
  </div>
</template>

<script>
import { getPage, editPage } from "@/api/fetch";
import UE from "../../components/Helper/uedit.vue";
export default {
  components: {
    UE
  },
  data() {
    return {
      allLoading: "",
      listLoading: false,
      dialogImageUrl: "",
      dialogVisible: false,
      uploadUrl: "",
      currentRouter: "",
      aboutPicLimit: 1,
      aboutMultiple: true,
      aboutPicList: [],
      arrivePicList: [],
      form: {
        id: '3',
        state: "",
        remark: "",
        content: "",
        pic: ""
      },
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 250
      },
      aboutInfo: "aboutInfo" // 不同编辑器必须不同的id
    };
  },
  created() {
    // console.log(process.env);
    //上传地址
    this.uploadUrl = process.env.BASE_API + "?m=about&a=uploadFile";
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
            this.aboutPicList = [
              {
                name: this.form.pic,
                url: process.env.BASE_TOTAL_API + "uploads/about/" + this.form.pic
              }
            ];
          }
          this.setUEContent(this.aboutInfo, this.form.content);
          // console.log('arrivePicList',this.arrivePicList);
        }
      });
    },
    handleAboutRemove(file, fileList) {
      // console.log(file, fileList);
      this.reloadAboutPic(fileList);
    },
    handleAboutPictureCardPreview(file) {
      console.log(file);
      // this.dialogImageUrl = file.url;
      // let fileName = file.response && file.response.resData ? file.response.resData.newname : file.name;
      this.dialogImageUrl =
        process.env.BASE_TOTAL_API + "uploads/about/" + file.name;
      // console.log(this.dialogImageUrl);
      this.dialogVisible = true;
    },
    aboutPicSuccess(response, file, fileList) {
      console.log(response, file, fileList);
      if (response.resCode === 400) {
        fileList.pop();
        this.$message({
          message: response.resData,
          type: "warning"
        });
      } else {
        console.log(response.resData);
        file.name = response.resData.newname;
        this.reloadAboutPic(fileList);
        // console.log(response, file, fileList);
      }
    },
    overAboutPicLimit(files, fileList) {
      this.$message({
        message: "上传失败，最多可以上传" + this.aboutPicLimit + "张图片",
        type: "warning"
      });
    },
    picError() {
      // console.log(err, file, fileList);
      this.$message({
        message: "上传失败，请刷新页面后再上传",
        type: "warning"
      });
    },
    //重新计算 about pic
    reloadAboutPic(fileList) {
      console.log(fileList);
      if (fileList && fileList.length && fileList[0].name) {
        this.form.pic = fileList[0].name;
      } else {
        this.form.pic = "";
      }
      console.log(this.form.pic);
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
    beginLoad() {
      this.allLoading = this.$loading({
        lock: true,
        text: "请求中，请稍等...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    onSubmit() {
      console.log(this.$route.name);
      this.form.content= this.getUEContent(this.aboutInfo);
      console.log(this.form);
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
};
</script>

<style scoped>
.line {
  text-align: center;
}
.el-date-editor .el-range-separator {
  width: 10%;
  padding: 0 0px;
}
.el-input,
.el-textarea,
.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-date-editor--timerange.el-input,
.el-date-editor--timerange.el-input__inner {
  width: 400px;
}
</style>

