<template>
  <div class="app-container" v-loading.body="listLoading">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="路演项目名称">
        <el-input v-model="form.road_name" placeholder="路演项目名称"></el-input>
      </el-form-item>
      <el-form-item label="项目标题">
        <el-input v-model="form.road_title" placeholder="项目标题"></el-input>
      </el-form-item>
      <el-form-item label="项目副标题">
        <el-input v-model="form.road_second_title" placeholder="项目副标题"></el-input>
      </el-form-item>
      <el-form-item label="项目介绍">
        <el-input type="textarea" autosize placeholder="项目介绍" v-model="form.road_intro"> </el-input>
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
      <el-form-item label="是否上线"  v-loading.body="listLoading" element-loading-text="加载中">
        <el-radio v-model="form.road_state" label="1">上线</el-radio>
        <el-radio v-model="form.road_state" label="-1">不上线</el-radio>
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
export default {
  data() {
    return {
      allLoading: '',
      listLoading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      currentRouter: '',
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
        road_state: '1',
        road_remark: ''
      }
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
          road_state: '1',
          road_remark: ''
        }
      }
      
    },
    getDetail(road_id) {
      this.listLoading = true
      getRoadShowList({roadid: road_id}).then(response => {
        this.listLoading = false
        // console.log(response);
        if(response.resCode === 200){
          this.form =  response.resData.items[0];
        }
      })
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

