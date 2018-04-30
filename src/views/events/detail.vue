<template>
  <div class="app-container">
    <el-tabs>
        <el-tab-pane label="会议信息"><eventsInfo @changeShowMenu="changeShowMenu"></eventsInfo></el-tab-pane>
        <el-tab-pane label="关于会议" :disabled="menuList[1]['isClose']"><eventsAbout></eventsAbout></el-tab-pane>
        <el-tab-pane label="会议日程" :disabled="menuList[2]['isClose']"><eventsSchedule></eventsSchedule></el-tab-pane>
        <el-tab-pane label="会议嘉宾" :disabled="menuList[3]['isClose']"><eventsSpeaker></eventsSpeaker></el-tab-pane>
        <el-tab-pane label="支持媒体" :disabled="menuList[4]['isClose']"><eventsSupportMedia></eventsSupportMedia></el-tab-pane>
        <el-tab-pane label="历届会议" :disabled="menuList[5]['isClose']"><eventsPastEvents></eventsPastEvents></el-tab-pane>
        <el-tab-pane label="会议价格" :disabled="menuList[6]['isClose']"><eventsCost></eventsCost></el-tab-pane>
        <el-tab-pane label="路演项目" :disabled="menuList[7]['isClose']"><eventsRoadShow></eventsRoadShow></el-tab-pane>
        <!-- <span v-for="val in childrenMenuList" :key="val.menuId">
          <el-tab-pane :label="val.menuName">{{eventsInfo}}</el-tab-pane>
        </span> -->
    </el-tabs>
    <!-- <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Activity name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="Activity zone">
        <el-select v-model="form.region" placeholder="please select your zone">
          <el-option label="Zone one" value="shanghai"></el-option>
          <el-option label="Zone two" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Activity time">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="Pick a date" v-model="form.date1" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker type="fixed-time" placeholder="Pick a time" v-model="form.date2" style="width: 100%;"></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="Instant delivery">
        <el-switch v-model="form.delivery"></el-switch>
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
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form> -->
  </div>
</template>

<script>
import eventsInfo from './detail/info.vue' 
import eventsAbout from './detail/about.vue' 
import eventsCost from './detail/cost.vue' 
import eventsPastEvents from './detail/pastEvents.vue' 
import eventsRoadShow from './detail/roadShow.vue' 
import eventsSchedule from './detail/schedule.vue' 
import eventsSpeaker from './detail/speaker.vue' 
import eventsSupportMedia from './detail/supportMedia.vue' 
export default {
    components: {eventsInfo,eventsAbout,eventsCost,eventsPastEvents,eventsRoadShow,eventsSchedule,eventsSpeaker,eventsSupportMedia},
    data() {
        return { 
          menuList:[
            {
              menuId: '1',
              menuName: '会议首页',
              isClose: false,
            },
            {
              menuId: '2',
              menuName: '关于会议',
              isClose: true
            },
            {
              menuId: '3',
              menuName: '会议日程',
              isClose: true
            },
            {
              menuId: '4',
              menuName: '演讲嘉宾',
              isClose: true
            },
            {
              menuId: '5',
              menuName: '会议酒店',
              isClose: true
            },
            {
              menuId: '6',
              menuName: '历届回顾',
              isClose: true
            },
            {
              menuId: '7',
              menuName: '会议报名',
              isClose: true
            },
            {
              menuId: '8',
              menuName: '路演项目报名',
              isClose: true
            },
          ],
        }
  },
  created(){
    this.menuList.forEach(items => {
      items.isClose = false;
    });
  },
  methods: {
    changeShowMenu(mData){
      this.menuList.forEach(items => {
        items.isClose = true;
      });
      mData.forEach(element => {
        this.menuList[element-1].isClose = false;
      });
    }
    // onSubmit() {
    //   this.$message('submit!')
    // },
    // onCancel() {
    //   this.$message({
    //     message: 'cancel!',
    //     type: 'warning'
    //   })
    // }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

