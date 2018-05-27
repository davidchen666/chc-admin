<template>
  <div class="app-container" v-loading.body="listLoading">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="路演项目名称">
        <el-input v-model="form.road_name" placeholder="路演项目名称"></el-input>
      </el-form-item>
      <el-form-item label="项目日期">
        <el-date-picker v-model="road_date" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="项目标题">
        <el-input v-model="form.road_title" placeholder="项目标题"></el-input>
      </el-form-item>
      <el-form-item label="项目副标题">
        <el-input v-model="form.road_second_title" placeholder="项目副标题"></el-input>
      </el-form-item>
      <el-form-item label="项目介绍">
        <!-- <el-input type="textarea" autosize placeholder="项目介绍" v-model="form.road_intro"> </el-input> -->
        <UE :defaultMsg=form.road_intro :config=config :id=roadInfo :ref=roadInfo></UE>
      </el-form-item>
      <el-form-item label="活动宗旨">
        <el-input type="textarea" autosize placeholder="活动宗旨" v-model="form.road_target"> </el-input>
      </el-form-item>
      <el-form-item label="专业指导">
        <el-input type="textarea" autosize placeholder="专业指导" v-model="form.road_guide"> </el-input>
      </el-form-item>
      <el-form-item label="课程安排">
        <el-input type="textarea" autosize placeholder="课程安排" v-model="form.road_course"> </el-input>
      </el-form-item>
      <el-form-item label="项目报名介绍">
        <el-input type="textarea" autosize placeholder="项目报名介绍" v-model="form.road_signup_intro"> </el-input>
      </el-form-item>
      <el-form-item label="您将获得">
        <el-input type="textarea" autosize placeholder="" v-model="form.road_achieve"> </el-input>
      </el-form-item>
      <el-form-item label="报名注意事项">
        <el-input type="textarea" autosize placeholder="" v-model="form.road_warn"> </el-input>
      </el-form-item>
      <el-form-item label="是否上线"  v-loading.body="listLoading" element-loading-text="加载中">
        <el-radio v-model="form.road_state" label="1">上线</el-radio>
        <el-radio v-model="form.road_state" label="-1">不上线</el-radio>
      </el-form-item>
      <el-form-item label="重命名活动宗旨">
        <el-input type="textarea" autosize placeholder="默认显示 活动宗旨" v-model="form.road_target_rename"> </el-input>
        <span>*若不填写则显示 活动宗旨</span>
      </el-form-item>
      <el-form-item label="重命名专业指导">
        <el-input type="textarea" autosize placeholder="默认显示 专业指导" v-model="form.road_guide_rename"> </el-input>
        <span>*若不填写则显示 专业指导</span>
      </el-form-item>
      <el-form-item label="重命名课程安排">
        <el-input type="textarea" autosize placeholder="默认显示 课程安排" v-model="form.road_course_rename"> </el-input>
        <span>*若不填写则显示 课程安排</span>
      </el-form-item>
      <el-form-item label="重命名路演项目报名">
        <el-input type="textarea" autosize placeholder="默认显示 路演项目报名" v-model="form.road_signup_intro_rename"> </el-input>
        <span>*若不填写则显示 路演项目报名</span>
      </el-form-item>
      <el-form-item label="重命名您将获得">
        <el-input type="textarea" autosize placeholder="默认显示 您将获得" v-model="form.road_achieve_rename"> </el-input>
        <span>*若不填写则显示 您将获得</span>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input type="textarea" autosize placeholder="备注信息" v-model="form.road_remark"> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getRoadShowList, addRoadShow, editRoadShow } from '@/api/fetch'
import { formatDateTime } from '@/utils/index'
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
      currentRouter: '',
      road_date:[],
      //road_id,road_name,road_title,road_second_title,road_intro,road_target road_guide,road_course,
      //road_signup_intro,road_achieve,road_remark,create_date,update_date,road_state
      form: {
        road_id: '',
        road_name: '',
        road_title: '',
        road_second_title: '',
        road_intro: '',
        road_target: '',
        road_guide: '',
        road_course: '',
        road_signup_intro: '',
        road_achieve: '',
        road_target_rename: '',
        road_guide_rename: '',
        road_course_rename: '',
        road_signup_intro_rename: '',
        road_achieve_rename: '',
        road_warn: '',
        road_begin_date:'',
        road_end_date:'',
        road_state: '1',
        road_remark: ''
      },
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 250
      },
      roadInfo: "roadInfo" // 不同编辑器必须不同的id
    }
  },
  created(){
    this.init();
  },
  watch: {
    "$route.name": "init"
  },
  methods: {
    init(){
      this.currentRouter = this.$route.name;
      //编辑页面,验证参数
      if(this.currentRouter === 'RoadShowDetail'){
        //将数据渲染到页面
        if(this.$route.query.road_id){
          this.getDetail(this.$route.query.road_id);
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
        this.form = {
          road_id: '',
          road_name: '',
          road_title: '',
          road_second_title: '',
          road_intro: '',
          road_target: '',
          road_guide: '',
          road_course: '',
          road_signup_intro: '',
          road_achieve: '',
          road_target_rename: '',
          road_guide_rename: '',
          road_course_rename: '',
          road_signup_intro_rename: '',
          road_achieve_rename: '',
          road_warn: '',
          road_begin_date:'',
          road_end_date:'',
          road_state: '1',
          road_remark: ''
        };
        this.road_date = [];
      }
      
    },
    getDetail(road_id) {
      this.listLoading = true
      getRoadShowList({roadid: road_id}).then(response => {
        this.listLoading = false
        // console.log(response);
        if(response.resCode === 200){
          this.form =  response.resData.items[0];
          if(this.form.road_begin_date && this.form.road_end_date){
            this.road_date = [this.form.road_begin_date,this.form.road_end_date]
          }
          this.setUEContent(this.roadInfo, this.form.road_intro);
        }
      })
    },
    changeDate(){
      if(this.road_date && this.road_date.length === 2){
        // console.log(this.road_date);
        this.form.road_begin_date = formatDateTime(this.road_date[0]);
        this.form.road_end_date = formatDateTime(this.road_date[1]);
        // console.log(this.form);
      }
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
      this.form.road_intro = this.getUEContent(this.roadInfo);
      //添加
      if(this.currentRouter === 'RoadShowAdd'){
        addRoadShow(this.form).then(response => {
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
      if(this.currentRouter === 'RoadShowDetail'){
        editRoadShow(this.form).then(response => {
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

