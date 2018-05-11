<template>
    <div class="app-container">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="主办方">
                <el-select v-model="form.events_organizer_organizer" multiple filterable remote reserve-keyword placeholder="请输入关键词" :loading="searchLoading" :remote-method="fetchList">
                    <el-option v-for="item in listData" :key="item.media_id" :value="item.media_id" :label="item.media_name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="协办方">
                <el-select v-model="form.events_organizer_co_organizer" multiple filterable remote reserve-keyword placeholder="请输入关键词" :loading="searchLoading" :remote-method="fetchList">
                    <el-option v-for="item in listData" :key="item.media_id" :value="item.media_id" :label="item.media_name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="战略伙伴">
                <el-select v-model="form.events_organizer_starategic_partner" multiple filterable remote reserve-keyword placeholder="请输入关键词" :loading="searchLoading" :remote-method="fetchList">
                    <el-option v-for="item in listData" :key="item.media_id" :value="item.media_id" :label="item.media_name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="媒体支持">
                <el-select v-model="form.events_organizer_media_support" multiple filterable remote reserve-keyword placeholder="请输入关键词" :loading="searchLoading" :remote-method="fetchList">
                    <el-option v-for="item in listData" :key="item.media_id" :value="item.media_id" :label="item.media_name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveInfo">保存</el-button>
                <el-button @click="back">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { getEventsInfo, editEventsInfo, getMediaList } from '@/api/fetch'
export default{
    data(){
        return{
            autoSize: { minRows: 2, maxRows: 4},
            currentRouter: '',
            listLoading: false,
            allLoading: '',
            searchLoading: false,
            listData: [],
            queryData: 'events_organizer_organizer,events_organizer_co_organizer,events_organizer_starategic_partner,events_organizer_media_support',
            form: {
                events_id: '',
                events_organizer_organizer: [],
                events_organizer_co_organizer: [],
                events_organizer_starategic_partner: [],
                events_organizer_media_support: [],
            }
        }
    },
    created(){
        this.currentRouter = this.$route.name;
        this.fetchList('');
        this.getDetail(this.$route.query.events_id);
    },
    methods:{
        fetchList(searchVal) {
            let paramsData = {currentPage:1,pageSize:100,searchVal:searchVal};
            this.searchLoading = true;
            getMediaList(paramsData).then(response => {
                this.listData = response.resData.items
                // console.log(this.listData);
                this.searchLoading = false;
            })
        },
        getDetail(events_id) {
            this.listLoading = true
            let params = {
                events_id: events_id,
                query:this.queryData
            };
            getEventsInfo(params).then(response => {
                this.listLoading = false
                // console.log(response);
                if(response.resCode === 200){
                    response.resData.items[0].events_organizer_organizer = 
                        response.resData.items[0].events_organizer_organizer ? JSON.parse(response.resData.items[0].events_organizer_organizer):[];
                    response.resData.items[0].events_organizer_co_organizer = 
                        response.resData.items[0].events_organizer_co_organizer ? JSON.parse(response.resData.items[0].events_organizer_co_organizer):[];
                    response.resData.items[0].events_organizer_starategic_partner = 
                        response.resData.items[0].events_organizer_starategic_partner ? JSON.parse(response.resData.items[0].events_organizer_starategic_partner):[];
                    response.resData.items[0].events_organizer_media_support = 
                        response.resData.items[0].events_organizer_media_support ? JSON.parse(response.resData.items[0].events_organizer_media_support):[];
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
        saveInfo(){
            //编辑
            if(this.currentRouter === 'EventsDetail'){
                this.beginLoad();
                this.form.query = this.queryData;
                editEventsInfo(this.form).then(response => {
                // console.log(response)
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
            }else{
                this.$message({
                    message: '操作失败！请先保存会议信息。',
                    type: 'success'
                });
            }
        },
        back(){
            history.go(-1);
        }
    }
}
</script>
<style>
.el-textarea,.el-input{
    width: 500px;
}
</style>
