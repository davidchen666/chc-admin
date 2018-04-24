<template>
    <div class="app-container">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="会议日程标题">
                <el-input placeholder="请输入会议日程标题" v-model="form.schedule_title"> </el-input>
                <!-- <el-input v-model="form.about_contents" placeholder="请输入关于会议内容"></el-input> -->
            </el-form-item>
            <el-form-item label="会议日程内容">
                <el-input type="textarea" autosize placeholder="9:00-9:10->会议签到" v-model="form.schedule_contents"> </el-input>
                <span>请输入关于会议日程内容，回车换行新增，格式如 9:00-9:10->会议签到</span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">保存</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                autoSize: { minRows: 2, maxRows: 4},
                form: {
                    shcedule_title:'',
                    schedule_contents:'',
                }
            }
        },
        methods:{
            resetForm() {
                this.$refs[this.form].resetFields();
            }
        }
    }
</script>
<style>
.el-textarea,.el-input{
    width: 500px;
}
</style>
