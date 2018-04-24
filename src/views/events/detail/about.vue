<template>
    <div class="app-container">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="关于会议">
                <el-input placeholder="请输入关于会议内容" v-model="form.about_contents"> </el-input>
            </el-form-item>
            <el-form-item label="关于会议(简化)">
                <el-input type="textarea" autosize placeholder="请输入关于会议内容" v-model="form.about_contents"> </el-input>
                <span>简化版本，用于显示会议首页，不输入不输入表示显示以上内容</span>
            </el-form-item>
            <el-form-item label="邀请企业">
                <el-input type="textarea" autosize placeholder="请输入邀请企业，回车输入多个" v-model="form.inviteCompany"> </el-input>
                <span>回车输入多个</span>
            </el-form-item>
            <el-form-item label="邀请机构">
                <el-input type="textarea" autosize placeholder="请输入邀请企业，回车输入多个" v-model="form.inviteDisarmament"> </el-input>
                <span>回车输入多个</span>
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
                    about_contents:'',
                    inviteCompany:'',
                    inviteDisarmament:'',
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
