<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="会议标题">
        <el-input v-model="form.events_name" placeholder="会议标题"></el-input>
      </el-form-item>
      <el-form-item label="会议URL">
        <el-input v-model="form.events_url" placeholder="会议URL 自动生成" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="会议日期">
        <el-date-picker v-model="form.events_date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="举办城市">
        <el-input v-model="form.events_city" placeholder="举办城市"></el-input>
      </el-form-item>
      <el-form-item label="举办酒店">
        <el-select v-model="form.events_hotel" placeholder="举办酒店">
          <el-option label="请选择" value=""></el-option>
          <el-option v-for="val in hotelOptions" :key="val.hotelId" :label="val.hotelName" :value="val.hotelId"></el-option>
          <!-- <el-option label="Zone two" value="beijing"></el-option> -->
        </el-select>
        <span> <a> * 如信息有变更，请修改或新增酒店信息</a></span>
      </el-form-item>
      <el-form-item label="导航显示">
        <el-checkbox-group v-model="form.events_menu">
          <el-checkbox v-for=" item in childrenMenuList" :key="item.menuId" :label="item.menuName" name="type"></el-checkbox>
          <!-- <el-checkbox label="Promotion activities" name="type"></el-checkbox>
          <el-checkbox label="Offline activities" name="type"></el-checkbox>
          <el-checkbox label="Simple brand exposure" name="type"></el-checkbox> -->
        </el-checkbox-group>
        <span> * 如勾选显示相关导航，请完善相关内容</span>
      </el-form-item>
      <el-form-item label="会议标签">
        <el-input v-model="form.events_tag" placeholder="会议标签"></el-input>
      </el-form-item>
      <el-form-item label="是否上线">
        <el-switch v-model="form.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="会议备注">
        <el-input type="textarea" autosize placeholder="会议备注" v-model="form.events_remark"  :autosize="{ minRows: 2, maxRows: 4}"> </el-input>
      </el-form-item>

      <!-- <el-form-item label="Activity time">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="Pick a date" v-model="form.date1" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker type="fixed-time" placeholder="Pick a time" v-model="form.date2" style="width: 100%;"></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="Instant delivery">
        <el-switch v-model="form.events_state"></el-switch>
      </el-form-item>
      <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type"></el-checkbox>
          <el-checkbox label="Promotion activities" name="type"></el-checkbox>
          <el-checkbox label="Offline activities" name="type"></el-checkbox>
          <el-checkbox label="Simple brand exposure" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor"></el-radio>
          <el-radio label="Venue"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Activity form">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item> -->

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
        hotelOptions:[
            {
                hotelId: '1',
                hotelName: '上海环球东亚酒店',
            },
            {
                hotelId: '2',
                hotelName: '上海和平饭店',
            },
            {
                hotelId: '3',
                hotelName: '建国宾馆',
            }
        ],
        childrenMenuList:[
            {
                menuId: '1',
                menuName: '会议首页',
            },
            {
                menuId: '2',
                menuName: '关于会议',
            },
            {
                menuId: '3',
                menuName: '会议日程',
            },
            {
                menuId: '4',
                menuName: '演讲嘉宾',
            },
            {
                menuId: '5',
                menuName: '会议酒店',
            },
            {
                menuId: '6',
                menuName: '历届回顾',
            },
            {
                menuId: '7',
                menuName: '会议报名',
            },
            {
                menuId: '8',
                menuName: '路演项目报名',
            },
        ],
        form: {
            events_name:'',
            events_url:'',
            events_date:'',
            events_name:'',
            events_city:'',
            events_hotel: '',
            events_menu: '',
            events_tag: '',
            events_remark: '',
            events_state: false,

            name: '',
            region: '',
            date1: '',
            date2: '',
            delivery: false,
            type: [],
            resource: '',
            desc: ''
        }
    }
  },
  methods: {
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
.el-range-separator{
  width: 10%;
}
.el-input,.el-textarea{
  width: 350px;
}
</style>

