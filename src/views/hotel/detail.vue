<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="酒店名称">
        <el-input v-model="form.hotel_name" placeholder="酒店名称"></el-input>
      </el-form-item>
      <el-form-item label="是否上线">
        <el-radio v-model="form.isShow" label="1">上线</el-radio>
        <el-radio v-model="form.isShow" label="-1">不上线</el-radio>
      </el-form-item>
      <el-form-item label="酒店介绍">
        <!-- <UE :defaultMsg=defaultMsg :config=config ref="ue"></UE> -->
        <!-- <VueUEditor></VueUEditor> -->
        <!-- <el-input type="textarea" autosize placeholder="会议备注" v-model="form.hotel_remark" > </el-input> -->
      </el-form-item>
      <el-form-item label="酒店图片 (x4)">
        <el-upload :action="uploadUrl" list-type="picture-card" :on-error="picError" :multiple="hotelMultiple" :limit='hotelPicLimit' 
        :on-exceed="overHotelPicLimit" :on-success="hotelPicSuccess" :on-preview="handleHotelPictureCardPreview" :on-remove="handleHotelRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="到达指引">
        <!-- <el-input type="textarea" autosize placeholder="会议备注" v-model="form.hotel_remark" > </el-input> -->
      </el-form-item>
      <el-form-item label="到达图片(x1)">
        <el-upload :action="uploadUrl" list-type="picture-card" :on-error="picError" :multiple="arriveMultiple" :limit='arrivePicLimit' 
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
  </div>
</template>

<script>
// import VueUEditor from 'vue-ueditor'
// import UE from '../../components/Helper/uedit.vue';
export default {
  // components: {
  //   UE
  // },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl: '',
      hotelPicLimit: 4,
      hotelMultiple: true,
      arriveMultiple: true,
      arrivePicLimit: 1,
      // selectedHotelPic: [],
      form: {
        hotel_name: '',
        isShow: '1',
        hotel_remark: '',
        hotel_pic: [],
        arrive_pic:' ',
      },
      defaultMsg: '这里是UE测试',
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350
      }
    }
  },
  created(){
    // console.log(process.env);
    this.uploadUrl = process.env.BASE_API + '?m=hotel&a=uploadFile';
  },
  methods: {
    handleHotelRemove(file, fileList) {
      // console.log(file, fileList);
      this.reloadHotelPic(fileList);
    },
    handleHotelPictureCardPreview(file) {
      // this.dialogImageUrl = file.url;
      this.dialogImageUrl = process.env.BASE_TOTAL_API + 'uploads/hotel/' + file.response.resData.newname;
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
      }
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
          if(element.response && element.response.resData){
            this.form.hotel_pic.push(element.response.resData.newname);
          }
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
      this.dialogImageUrl = process.env.BASE_TOTAL_API + 'uploads/hotel/' + file.response.resData.newname;
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
      if(fileList && fileList.length && fileList[0].response && fileList[0].response.resCode === 200){
        this.form.arrive_pic = fileList[0].response.resData.newname;
      }else{
        this.form.arrive_pic = '';
      }
      console.log(this.form.arrive_pic);
    },
    getUEContent() {
      let content = this.$refs.ue.getUEContent();
      this.$notify({
        title: '获取成功，可在控制台查看！',
        message: content,
        type: 'success'
      });
      console.log(content)
    },
    onSubmit() {
      this.$message('submit!')
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

