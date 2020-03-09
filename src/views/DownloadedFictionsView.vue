<template>
    <div v-loading="downloadedViewLoading">
        <div v-if="total>0">
            <el-row>
                <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="4"
                        v-for="fiction in fictions" :key="fiction.fid">
                    <el-row>
                        <el-col :span="2"></el-col>
                        <el-col :span="20">
                            <el-card class="box-card" shadow="hover">
                                <div slot="header" class="clearfix">
                                    <span style="text-align:center;display: block">{{fiction.fiction_name}}</span>
                                </div>
                                <el-row>
                                    <el-col :span="10">
                                        <el-image
                                                style="width: 120px; height: 180px"
                                                :src="fiction.image_url"
                                                fit="fill"></el-image>

                                    </el-col>

                                    <!--                                    <el-col :span="4"></el-col>-->
                                    <el-col :offset="4" :span="10">
                                        <!--                                        <el-button>下载</el-button>-->
                                        <div class="button-margin">
                                            <el-button type="primary"
                                                       @click="updateFiction(fiction.fid)">
                                                更新
                                            </el-button>
                                        </div>
                                        <div class="button-margin">
                                            <el-button type="primary"
                                                       @click="downloadFictionConfirm(fiction)">
                                                导出
                                            </el-button>
                                        </div>
                                        <div class="button-margin">
                                            <el-button type="success"
                                                       @click="sendFictionConfirm(fiction.fid)">
                                                推送
                                            </el-button>
                                        </div>
                                        <div class="button-margin">
                                            <el-button type="danger"
                                                       @click="deleteFiction(fiction.fid)">
                                                删除
                                            </el-button>
                                        </div>

                                    </el-col>

                                </el-row>
                                <el-row>
                                    <el-col :span="20">
                                        <div>
                                            <el-progress :text-inside="true" :show-text="true" :stroke-width="24"
                                                         :percentage="fiction.cached_percentage"
                                                         status="primary"></el-progress>
                                        </div>
                                        <div style="text-align: center">
                                            <span>{{fiction.cached_chapters_number}}/{{fiction.fiction_chapters_total}}</span>
                                        </div>
                                    </el-col>

                                </el-row>
                            </el-card>
                        </el-col>
                        <el-col :span="2"></el-col>
                    </el-row>
                </el-col>
            </el-row>
            <div style="text-align: center">
                <el-pagination
                        background
                        layout="prev, pager, next"
                        :current-page="cur_page"
                        :page-size="page_size"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <div v-else>
            <h1 style="text-align: center">暂无缓存书籍，快去添加吧！</h1>
        </div>

    </div>
</template>

<script>
    export default {
        name: "DownloadedFictionView",
        data() {
            return {
                fictionCols: 6,
                fictions: [],
                cur_page: 1,
                page_size: 18,
                downloadedViewLoading: false,
                total: 0
            };
        },
        mounted: function () {
            this.$nextTick(function () {
                this.autoRefresh();
            });
        },
        methods: {
            getAllFictions: function () {
                this.downloadedViewLoading = true;
                const data = {
                    cur_page: this.cur_page,
                    page_size: this.page_size
                };
                const api_url = this.base_url + '/api/v1/fictions/all/';
                this.$axios.post(api_url, data)
                    .then((res) => {
                        this.fictions = res.data.fictions;
                        this.total = res.data.total;
                        this.downloadedViewLoading = false;
                    })
                    .catch((error) => {
                        console.error(error);
                        this.$notify.error('啊哦，出错了！');
                        this.downloadedViewLoading = false;
                    })
            },
            updateFiction: function (fiction_id) {
                this.$notify.info('正在发起更新请求，请稍等...');
                const data = {
                    fiction_id: fiction_id
                };
                const api_url = this.base_url + '/api/v1/fictions/update/';
                this.downloadedViewLoading = true;
                this.$axios.post(api_url, data)
                    .then((res) => {
                        console.log(res);
                        this.$notify.success('请求成功！待更新章节数：' + res.data.uncached_chapters);
                        this.getAllFictions();
                        this.downloadedViewLoading = false;
                    })
                    .catch((error) => {
                        console.error(error);
                        this.$notify.error('啊哦，出错了！');
                        this.downloadedViewLoading = false;
                    });

            },
            deleteFiction: function (fiction_id) {
                this.$confirm('删除小说会同时删除此小说的所有章节，确认删除吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.downloadedViewLoading = true;
                    const api_url = this.base_url + '/api/v1/fictions/delete/' + fiction_id;
                    this.$axios.get(api_url)
                        .then((res) => {
                            this.$notify.success(res.data.msg);
                            this.getAllFictions();
                            this.downloadedViewLoading = false;
                        })
                        .catch((error) => {
                            console.error(error);
                            this.$notify.error('啊哦，出错了！');
                            this.downloadedViewLoading = false;
                        })
                })
            },
            downloadFiction: function (fiction_id) {
                this.downloadedViewLoading = true;
                this.$notify.info('正在生成小说文件，请稍等……');
                const api_url = this.base_url + '/api/v1/fictions/download/' + fiction_id;
                window.open(api_url, '_blank');
                this.downloadedViewLoading = false;
            },
            downloadFictionConfirm: function (fiction) {
                if (fiction.cached_chapters_number < fiction.fiction_chapters_total) {
                    this.$confirm('小说的全部章节可能没有缓存完成，确认导出小说文件到本地吗？', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.downloadFiction(fiction.fid);
                    });
                } else {
                    this.$confirm('即将导出小说文件到本地，确认执行吗？', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.downloadFiction(fiction.fid);
                    });
                }
            },
            sendFictionConfirm: function (fiction_id) {
                this.$confirm('即将通过邮箱推送小说到kindle，确认推送吗？(请确保已正确配置邮箱信息，否则无法成功推送)', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.downloadedViewLoading = true;
                    this.$notify.info('正在发起推送请求，请稍等……');
                    const api_url = this.base_url + '/api/v1/fictions/send/' + fiction_id;
                    this.$axios.get(api_url)
                        .then((res) => {
                            if (res.data.code === 0) {
                                this.$notify.success(res.data.msg);
                            } else {
                                this.$notify.error(res.data.msg);
                            }
                            this.downloadedViewLoading = false;
                        })
                        .catch((error) => {
                            console.error(error);
                            this.$notify.error('啊哦，出错了！');
                            this.downloadedViewLoading = false;
                        })
                })
            },
            autoRefresh: function () {
                setInterval(this.getAllFictions, 5000);
            }
        },
        created() {
            this.getAllFictions();
        }
    }
</script>

<style scoped>
    .button-margin {
        margin-top: 4px;
        margin-bottom: 4px;
    }
</style>