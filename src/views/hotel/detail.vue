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
        <!-- <el-input type="textarea" autosize placeholder="会议备注" v-model="form.hotel_remark" > </el-input> -->
      </el-form-item>
      <el-form-item label="酒店图片">
        <el-upload :action="uploadUrl" list-type="picture-card" :on-error="picError" :multiple="hotelMultiple" :limit='hotelPicLimit' 
        :on-exceed="overPicLimit" :on-success="hotelPicSuccess" :on-preview="handleHotelPictureCardPreview" :on-remove="handleHotelRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="到达指引">
        <!-- <el-input type="textarea" autosize placeholder="会议备注" v-model="form.hotel_remark" > </el-input> -->
      </el-form-item>
      <el-form-item label="到达地图图片">
        <!-- <el-input type="textarea" autosize placeholder="会议备注" v-model="form.hotel_remark" > </el-input> -->
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
export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      uploadUrl: '',
      hotelPicLimit: 4,
      hotelMultiple: true,
      selectedHotelPic: [],
      form: {
          hotel_name:'',
          isShow: '1',
          hotel_remark:'',
      }
    }
  },
  created(){
    console.log(process.env);
    this.uploadUrl = process.env.BASE_API + '?m=hotel&a=uploadFile';
  },
  methods: {
    handleHotelRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleHotelPictureCardPreview(file) {
      // this.dialogImageUrl = file.url;
      this.dialogImageUrl = process.env.BASE_TOTAL_API + 'uploads/hotel/' + file.response.resData.newname;
      // console.log(this.dialogImageUrl);
      this.dialogVisible = true;
    },
    hotelPicSuccess(response, file, fileList){
      console.log(response, file, fileList);
      if(response.resCode === 400){
        fileList.pop();
        this.$message({
          message: response.resData,
          type: 'warning'
        })
      }
    },
    overPicLimit(files, fileList){
      this.$message({
        message: '上传失败，最多可以上传' + this.hotelPicLimit + '张图片',
        type: 'warning'
      })
    },
    picError(){
      console.log(err, file, fileList);
      this.$message({
        message: '上传失败，请刷新页面后再上传',
        type: 'warning'
      })
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

