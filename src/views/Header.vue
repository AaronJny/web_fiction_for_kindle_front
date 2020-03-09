<template>
    <div>
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="5" :xl="5"><span style="font-size: 30px">Kindle网文助手</span></el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
                <div style="margin-top: 10px">
                    <div class="hidden-md-and-down" style="text-align: center">
                        <el-input v-model="fictionSearchForm.fictionName" style="width: 600px"
                                  placeholder="请输入待检索小说名称">
                            <el-button slot="append" @click="fictionSearch" icon="el-icon-search"
                                       :loading="searchLoading"></el-button>
                        </el-input>
                    </div>
                    <div class="hidden-lg-and-up">
                        <el-input v-model="fictionSearchForm.fictionName" style="width: 300px"
                                  placeholder="请输入待检索小说名称">
                            <el-button slot="append" @click="fictionSearch" icon="el-icon-search"
                                       :loading="searchLoading"></el-button>
                        </el-input>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="5" :xl="5" style="margin-top: 10px">
                <el-button type="primary" @click="dialogEmailConfigViewVisible=true">配置邮箱</el-button>
                <el-button type="primary" @click="dialogSpiderConfigViewVisible=true">配置爬虫</el-button>
            </el-col>
        </el-row>
        <el-dialog
                title="搜索结果"
                :visible.sync="dialogSearchResultVisible"
                :with-header="false">
            <SearchedFictionsView :searched-fictions="searchedFictions"></SearchedFictionsView>
        </el-dialog>
        <el-dialog
                title="爬虫配置"
                :visible.sync="dialogSpiderConfigViewVisible"
                :with-header="false"
                width="80%">
            <SpiderConfigEditView></SpiderConfigEditView>
        </el-dialog>
        <el-dialog
                title="邮箱配置"
                :visible.sync="dialogEmailConfigViewVisible"
                :with-header="false"
                width="80%">
            <EmailConfigEditView></EmailConfigEditView>
        </el-dialog>
    </div>
</template>


<script>
    import SearchedFictionsView from "./SearchedFictionsView";
    import SpiderConfigEditView from "./SpiderConfigEditView";
    import EmailConfigEditView from "./EmailConfigEditView";
    import 'element-ui/lib/theme-chalk/display.css';

    export default {
        name: "Header",
        components: {
            SearchedFictionsView,
            SpiderConfigEditView,
            EmailConfigEditView
        },
        data() {
            return {
                fictionSearchForm: {
                    fictionName: ''
                },
                searchedFictions: [],
                dialogSearchResultVisible: false,
                searchLoading: false,
                dialogSpiderConfigViewVisible: false,
                dialogEmailConfigViewVisible: false
            }
        },
        methods: {
            fictionSearch: function () {
                const data = {
                    fiction_name: this.fictionSearchForm.fictionName
                };
                this.searchLoading = true;
                this.$notify.info({
                        title: '',
                        message: '正在搜索中，请稍后...',
                        showClose: true,
                        duration: 4500
                    }
                );

                const api_url = this.base_url + '/api/v1/search/name/';
                this.$axios.post(api_url, data)
                    .then((res) => {
                        this.searchedFictions = res.data.fictions;
                        this.searchLoading = false;
                        this.$notify.success({
                            title: '',
                            message: '搜索完成！',
                            showClose: true,
                            duration: 3000
                        });
                        this.dialogSearchResultVisible = true;

                    })
                    .catch((error) => {
                        this.$notify.error('啊哦，出错了！');
                        console.error(error);
                    })
            }
        }
    }
</script>

<style scoped>

</style>