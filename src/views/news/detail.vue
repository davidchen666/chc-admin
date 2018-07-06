<template>
  <div class="app-container" v-loading.body="listLoading">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="新闻标题">
        <el-input v-model="form.news_title" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="新闻类型"  v-loading.body="listLoading" element-loading-text="加载中">
        <el-radio v-model="form.news_type" label="1">联盟新闻</el-radio>
        <el-radio v-model="form.news_type" label="2">行业新闻</el-radio>
      </el-form-item>
      <el-form-item label="新闻缩略图(x1)">
        <el-upload :action="uploadUrl" list-type="picture-card" :file-list="newsPicList" :on-error="picError" :multiple="newsMultiple" :limit='newsPicLimit' 
        :on-exceed="overNewsPicLimit" :on-success="newsPicSuccess" :on-preview="handleNewsPictureCardPreview" :on-remove="handleNewsRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="新闻内容">
        <UE :defaultMsg=form.news_content :config=config :id=newsInfo :ref=newsInfo></UE>
      </el-form-item>
      <el-form-item label="新闻作者">
        <el-input v-model="form.news_auther" placeholder="新闻作者"></el-input>
      </el-form-item>
      <el-form-item label="是否上线"  v-loading.body="listLoading" element-loading-text="加载中">
        <el-radio v-model="form.news_state" label="1">上线</el-radio>
        <el-radio v-model="form.news_state" label="-1">不上线</el-radio>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input type="textarea" autosize placeholder="备注信息" v-model="form.news_remark" > </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getNewsList, addNews, editNews } from '@/api/fetch'
import UE from "../../components/Helper/uedit.vue";
export default {
  components: {
    UE
  },
  data() {
    return {
      allLoading: '',
      listLoading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl: '',
      currentRouter: '',
      newsMultiple: false,
      newsPicLimit: 1,
      newsPicList:[],
      form: {
        news_title: '',
        news_pic: '',
        news_author: '',
        news_content: '',
        news_state: '1',
        news_type: '',
        news_remark: ''
      },
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 250
      },
      newsInfo: "newsInfo" // 不同编辑器必须不同的id
    }
  },
  created(){
    //上传地址
    this.uploadUrl = process.env.BASE_API + '?m=news&a=uploadFile';
    this.init();
  },
  watch: {
    "$route": "init"
  },
  methods: {
    init(){
      console.log(this.$route);
      this.currentRouter = this.$route.name;
      //编辑页面,验证参数
      if(this.currentRouter === 'NewsDetail'){
        //将数据渲染到页面
        if(this.$route.query.news_id){
          this.getDetail(this.$route.query.news_id);
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
        this.newsPicList = [];
        this.form = {
          news_title: '',
          news_pic: '',
          news_author: '',
          news_content: '',
          news_state: '1',
          news_type: '',
          news_remark: ''
        };
        this.setUEContent(this.newsInfo, '');
      }
    },
    getDetail(news_id) {
      this.listLoading = true
      getNewsList({newsid: news_id}).then(response => {
        this.listLoading = false
        // console.log(response);
        if(response.resCode === 200){
          this.form =  response.resData.items[0];
          if(this.form.news_pic){
            this.newsPicList=[{
              name: this.form.news_pic,
              url: process.env.BASE_TOTAL_API + 'uploads/news/' + this.form.news_pic
            }];
          }
          this.setUEContent(this.newsInfo, this.form.news_content);
        }
      })
    },
    //=========upload pic=====
    handleNewsRemove(file, fileList) {
      // console.log(file, fileList);
      this.reloadNewsPic(fileList);
    },
    handleNewsPictureCardPreview(file) {
      // this.dialogImageUrl = file.url;
      this.dialogImageUrl = process.env.BASE_TOTAL_API + 'uploads/news/' + file.name;
      // console.log(this.dialogImageUrl);
      this.dialogVisible = true;
    },
    newsPicSuccess(response, file, fileList){
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
      this.reloadNewsPic(fileList);
    },
    overNewsPicLimit(files, fileList){
      this.$message({
        message: '上传失败，最多可以上传' + this.newsPicLimit + '张图片',
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
    //重新计算news pic
    reloadNewsPic(fileList){
      console.log(fileList);
      if(fileList && fileList.length && fileList[0].name){
        this.form.news_pic = fileList[0].name;
      }else{
        this.form.news_pic = '';
      }
      console.log(this.form.news_pic);
    },
    //======= UE =====
    setUEContent(name, content) {
      // let content = this.$refs.ue.getUEContent(); // 调用子组件方法
      // let content = this.$refs[name].setUEContent(); // 调用子组件方法
      return this.$refs[name].setUEContent(content);
    },
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
      this.form.news_content = this.getUEContent(this.newsInfo);
      console.log(this.form);
      //添加
      if(this.currentRouter === 'NewsAdd'){
        console.log(111);
        addNews(this.form).then(response => {
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
      if(this.currentRouter === 'NewsDetail'){
        editNews(this.form).then(response => {
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

