<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px" v-loading.body="listLoading">
      <el-form-item label="酒店名称">
        <el-input v-model="form.hotel_name" placeholder="酒店名称"></el-input>
      </el-form-item>
      <el-form-item label="是否上线">
        <el-radio v-model="form.hotel_state" label="1">上线</el-radio>
        <el-radio v-model="form.hotel_state" label="-1">不上线</el-radio>
      </el-form-item>
      <el-form-item label="酒店介绍">
        <UE :defaultMsg=form.hotel_info :config=config :id=hotelInfo :ref=hotelInfo></UE>
      </el-form-item>
      <el-form-item label="酒店图片 (x4)">
        <el-upload :action="uploadUrl" list-type="picture-card" :file-list="hotelPicList" :on-error="picError" :multiple="hotelMultiple" :limit='hotelPicLimit' 
        :on-exceed="overHotelPicLimit" :on-success="hotelPicSuccess" :on-preview="handleHotelPictureCardPreview" :on-remove="handleHotelRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="到达指引">
        <UE :defaultMsg=form.arrive_info :config=config :id=arriveInfo :ref=arriveInfo></UE>
        <!-- <el-input type="textarea" autosize placeholder="会议备注" v-model="form.hotel_remark" > </el-input> -->
      </el-form-item>
      <el-form-item label="到达图片(x1)">
        <el-upload :action="uploadUrl" list-type="picture-card" :file-list="arrivePicList" :on-error="picError" :multiple="arriveMultiple" :limit='arrivePicLimit' 
        :on-exceed="overArrivePicLimit" :on-success="arrivePicSuccess" :on-preview="handleArrivePictureCardPreview" :on-remove="handleArriveRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input type="textarea" autosize placeholder="会议备注" v-model="form.hotel_remark" > </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
    <button @click="getUEContent()">获取内容</button>
    <button @click="getUEContentTxt()">获取无文本内容</button>
  </div>
</template>

<script>
import { getHotelList, addHotel, editHotel } from '@/api/fetch'
import UE from '../../components/Helper/uedit.vue';
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
      hotelPicLimit: 4,
      hotelMultiple: true,
      arriveMultiple: true,
      arrivePicLimit: 1,
      hotelPicList:[],
      arrivePicList:[],
      // selectedHotelPic: [],
      form: {
        hotel_name: '',
        hotel_state: '1',
        hotel_remark: '',
        hotel_info: '',
        arrive_info: '',
        hotel_pic: [],
        arrive_pic: ''
      },
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 250
      },
      hotelInfo: "hotelInfo", // 不同编辑器必须不同的id
      arriveInfo: "arriveInfo", // 不同编辑器必须不同的id
      // hotelDefaultMsg: '', //默认值
      // arriveDefaultMsg: '',
    }
  },
  created(){
    // console.log(process.env);
    //上传地址
    this.uploadUrl = process.env.BASE_API + '?m=hotel&a=uploadFile';
    this.currentRouter = this.$route.name;
    console.log(this.$route)
    //编辑页面,验证参数
    if(this.currentRouter === 'HotelDetail'){
      //将数据渲染到页面
      if(this.$route.query.hotel_id){
        // this.form = this.$route.query;
        this.getDetail(this.$route.query.hotel_id);
        // this.form.hotel_pic = JSON.parse(this.form.hotel_pic);
      }else{
        this.$message({
          showClose: true,
          message: '访问的地址不正确,正在返回...',
          type: 'error'
        });
        history.go(-1);
        return;
      }
    }
  },
  methods: {
    getDetail(hotel_id) {
      // const self = this;
      // this.listLoading = true
      getHotelList({hotelid: hotel_id}).then(response => {
        this.listLoading = false
        // console.log(response);
        if(response.resCode === 200){
          this.form =  response.resData.items[0];
          // let picData = self.form.hotel_pic;
          // console.log(picData);
          this.form.hotel_pic = JSON.parse(this.form.hotel_pic);
          this.form.hotel_pic.forEach(element => {
            this.hotelPicList.push({
              name: element,
              url: process.env.BASE_TOTAL_API + 'uploads/hotel/' + element
            }) 
          });
          this.arrivePicList=[{
            name: this.form.arrive_pic,
            url: process.env.BASE_TOTAL_API + 'uploads/hotel/' + this.form.arrive_pic
          }];
          console.log('arrivePicList',this.arrivePicList);
        }
      })
    },
    handleHotelRemove(file, fileList) {
      // console.log(file, fileList);
      this.reloadHotelPic(fileList);
    },
    handleHotelPictureCardPreview(file) {
      // console.log(file)
      // this.dialogImageUrl = file.url;
      // let fileName = file.response && file.response.resData ? file.response.resData.newname : file.name;
      this.dialogImageUrl = process.env.BASE_TOTAL_API + 'uploads/hotel/' + file.name;
      // console.log(this.dialogImageUrl);
      this.dialogVisible = true;
    },
    hotelPicSuccess(response, file, fileList){
      // console.log(response, file, fileList);
      if(response.resCode === 400){
        fileList.pop();
        this.$message({
          message: response.resData,
          type: 'warning'
        })
      }else{
        file.name = response.resData.newname;
      }
      // console.log(response, file, fileList);
      this.reloadHotelPic(fileList);
    },
    overHotelPicLimit(files, fileList){
      this.$message({
        message: '上传失败，最多可以上传' + this.hotelPicLimit + '张图片',
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
    //重新计算hotelpic
    reloadHotelPic(fileList){
      if(this.form.hotel_pic.length !== fileList.length){
        this.form.hotel_pic = [];
        fileList.forEach(element => {
          // if(element.response && element.response.resData){
            this.form.hotel_pic.push(element.name);
          // }
        });
      }
      console.log(this.form.hotel_pic);
    },
    //=========arrive=====
    handleArriveRemove(file, fileList) {
      // console.log(file, fileList);
      this.reloadArrivePic(fileList);
    },
    handleArrivePictureCardPreview(file) {
      // this.dialogImageUrl = file.url;
      this.dialogImageUrl = process.env.BASE_TOTAL_API + 'uploads/hotel/' + file.name;
      // console.log(this.dialogImageUrl);
      this.dialogVisible = true;
    },
    arrivePicSuccess(response, file, fileList){
      // console.log(response, file, fileList);
      if(response.resCode === 400){
        fileList.pop();
        this.$message({
          message: response.resData,
          type: 'warning'
        })
      }else{
        file.name = response.resData.newname;
      }
      this.reloadArrivePic(fileList);
    },
    overArrivePicLimit(files, fileList){
      this.$message({
        message: '上传失败，最多可以上传' + this.arrivePicLimit + '张图片',
        type: 'warning'
      })
    },
    //重新计算arrive pic
    reloadArrivePic(fileList){
      console.log(fileList);
      if(fileList && fileList.length && fileList[0].name){
        this.form.arrive_pic = fileList[0].name;
      }else{
        this.form.arrive_pic = '';
      }
      console.log(this.form.arrive_pic);
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
      return content
    },
    getUEContentTxt(obj) {
      // let content = this.$refs.ue.getUEContentTxt(); // 调用子组件方法
      this.$notify({
        title: '获取成功，可在控制台查看！',
        message: content,
        type: 'success'
      });
      console.log(content)
    },
    beginLoad(){
      this.allLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    onSubmit() {
      console.log(this.$route.name)
      this.form.hotel_info = this.getUEContent(this.hotelInfo)
      this.form.arrive_info = this.getUEContent(this.arriveInfo)
      console.log(this.form)
      this.beginLoad()
      //添加
      if(this.currentRouter === 'HotelAdd'){
        addHotel(this.form).then(response => {
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
      if(this.currentRouter === 'HotelDetail'){
        editHotel(this.form).then(response => {
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
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
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

