<template>
  <div class="app-container" v-loading.body="listLoading">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="会议标题">
        <el-input v-model="form.events_name" placeholder="会议标题"></el-input>
      </el-form-item>
      <el-form-item label="会议URL" v-if="currentRouter === 'EventsDetail'">
        <!-- <el-input v-model="form.events_url" placeholder="会议URL 自动生成" :disabled="true"></el-input> -->
        <a :href="baseUrl+this.$route.query.events_id" target="_blank">{{baseUrl+this.$route.query.events_id}}</a>
      </el-form-item>
      <el-form-item label="会议日期">
        <el-date-picker v-model="events_date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="举办城市">
        <el-input v-model="form.events_city" placeholder="举办城市"></el-input>
      </el-form-item>
      <!-- <el-form-item label="举办酒店">
        <el-select v-model="form.events_hotel" placeholder="举办酒店">
          <el-option label="请选择" value=""></el-option>
          <el-option v-for="val in hotelOptions" :key="val.hotelId" :label="val.hotelName" :value="val.hotelId"></el-option>
        </el-select>
        <span> <a> * 如信息有变更，请修改或新增酒店信息</a></span>
      </el-form-item> -->
      <el-form-item label="导航显示">
        <el-checkbox-group v-model="form.events_menu">
          <el-checkbox v-for="item in menuList" :key="item.id" :label="item.id" name="type">{{item.name}}</el-checkbox>
        </el-checkbox-group>
        <span> * 如勾选显示相关导航，请完善相关内容</span>
      </el-form-item>
      <!-- <el-form-item label="会议标签">
        <el-input v-model="form.events_tag" placeholder="会议标签"></el-input>
      </el-form-item> -->
      <el-form-item label="是否上线">
        <el-radio v-model="form.events_state" label="1">上线</el-radio>
        <el-radio v-model="form.events_state" label="-1">不上线</el-radio>
      </el-form-item>
      <el-form-item label="会议图片(x1)">
        <el-upload :action="uploadUrl" list-type="picture-card" :file-list="eventsPicList" :on-error="picError" :multiple="eventsMultiple" :limit='eventsPicLimit' 
        :on-exceed="overEventsPicLimit" :on-success="eventsPicSuccess" :on-preview="handleEventsPictureCardPreview" :on-remove="handlEventsRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="会议备注">
        <el-input type="textarea" autosize placeholder="会议备注" v-model="form.events_remark" > </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getEventsList, addEvents, editEvents, getEventsMenuList } from '@/api/fetch'
import { formatDate } from '@/utils/index'
export default {
  data() {
    return {
      listLoading: false,
      dialogVisible: false,
      currentRouter: '',
      uploadUrl: '',
      baseUrl:'',
      eventsPicList:[],
      eventsMultiple: false,
      eventsPicLimit: 1,
      dialogImageUrl: '',
      menuList: [],
      events_date:[],
      form: {
          events_name:'',
          events_begin_date:'',
          events_end_date:'',
          events_city:'',
          events_pic:'',
          events_menu: ['1','2','3','4','5','6','7','8'],
          events_remark: '',
          events_state: '-1'
      }
    }
  },
  created(){
    this.uploadUrl = process.env.BASE_API + '?m=events&a=uploadFile';
    this.baseUrl = process.env.BASE_URL + '?m=events&a=detail&events_id=';
    this.init();
  },
  watch: {
    "$route.name": "init"
  },
  methods: {
    init(){
      this.currentRouter = this.$route.name;
      this.getMenu();
      //编辑页面,验证参数
      if(this.currentRouter === 'EventsDetail'){
        //将数据渲染到页面
        if(this.$route.query.events_id){
          this.getDetail(this.$route.query.events_id);
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
        this.eventsPicList = [];
        this.events_date = [];
        this.form = {
          events_name:'',
          events_begin_date:'',
          events_end_date:'',
          events_city:'',
          events_pic:'',
          events_menu: ['1','2','3','4','5','6','7','8'],
          events_remark: '',
          events_state: '-1'
      };
      }
    },
    getMenu(){
      getEventsMenuList(null).then(response => {
        this.listLoading = false
        // console.log(response);
        if(response.resCode === 200){
          this.menuList =  response.resData.items;
        }
      })
    },
    getDetail(events_id) {
      this.listLoading = true
      getEventsList({eventsid: events_id}).then(response => {
        this.listLoading = false
        console.log(response);
        if(response.resCode === 200){
          this.form =  response.resData.items[0];
          this.form.events_menu = this.form.events_menu ?  JSON.parse(this.form.events_menu):[];
          if(this.form.events_begin_date && this.form.events_end_date){
            this.events_date = [this.form.events_begin_date,this.form.events_end_date]
          }
          if(this.form.events_pic){
            this.eventsPicList=[{
              name: this.form.events_pic,
              url: process.env.BASE_TOTAL_API + 'uploads/events/' + this.form.events_pic
            }];
          }
        }
      })
    },
    changeDate(){
      if(this.events_date && this.events_date.length === 2){
        this.form.events_begin_date = formatDate(this.events_date[0]);
        this.form.events_end_date = formatDate(this.events_date[1]);
      }
    },
    //=========upload pic=====
    handlEventsRemove(file, fileList) {
      // console.log(file, fileList);
      this.reloadEventsPic(fileList);
    },
    handleEventsPictureCardPreview(file) {
      // this.dialogImageUrl = file.url;
      this.dialogImageUrl = process.env.BASE_TOTAL_API + 'uploads/events/' + file.name;
      // console.log(this.dialogImageUrl);
      this.dialogVisible = true;
    },
    eventsPicSuccess(response, file, fileList){
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
      this.reloadEventsPic(fileList);
    },
    overEventsPicLimit(files, fileList){
      this.$message({
        message: '上传失败，最多可以上传' + this.eventsPicLimit + '张图片',
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
    //重新计算 pic
    reloadEventsPic(fileList){
      console.log(fileList);
      if(fileList && fileList.length && fileList[0].name){
        this.form.events_pic = fileList[0].name;
      }else{
        this.form.events_pic = '';
      }
      console.log(this.form.events_pic);
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
    // changeMenu(){
    //   this.$emit('changeShowMenu',this.form.events_menu);
    // },
    onSubmit() {
      // this.$message('submit!')
      if(!this.form.events_name){
        this.$message({
          message: '会议标题不能为空，请填写会议标题',
          type: 'warning'
        })
        return;
      }
      console.log(this.form);
      this.beginLoad();
      //添加
      if(this.currentRouter === 'EventsAdd'){
        addEvents(this.form).then(response => {
          console.log(response)
          if(response && response.resCode === 200 && response.resData){
            this.$message({
              message: '添加成功。',
              type: 'success'
            });
            this.$router.push({name:'EventsDetail',query:{events_id: response.resData.events_id}});
            this.allLoading.close();
          }else{
            this.allLoading.close();
          }
        })
      }
      //编辑
      if(this.currentRouter === 'EventsDetail'){
        editEvents(this.form).then(response => {
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

