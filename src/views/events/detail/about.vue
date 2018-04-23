<template>
    <div class="app-container">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="关于会议">
                <el-input type="textarea" autosize placeholder="请输入关于会议内容" v-model="form.about_contents"  
                :rules="[{ required: true, message: '年龄不能为空'},{ type: 'number', message: '年龄必须为数字值'}]"
                > </el-input>
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
.el-textarea{
    width: 500px;
}
</style>
