<template>
    <el-container v-loading="searchViewLoading">
        <div v-if="searchedFictions.length>0">
            <div v-for="(fiction,index) in searchedFictions" :key="index">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                        <div>
                            <el-link :underline="false" :href="fiction.origin_url" target="_blank"><h3>
                                {{fiction.fiction_name}}</h3></el-link>
                        </div>
                        <el-image
                                style="width: 111px; height: 148px"
                                :src="fiction.image_url"
                                fit="fill"></el-image>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
                        <br>
                        <p>{{fiction.introduction}}</p>
                        <el-row>
                            <el-col :xs="24" :xl="20">
                                <ul>
                                    <li>作者：{{fiction.author}}</li>
                                    <li>更新日期：{{fiction.update_date}}</li>
                                    <li>最新章节：{{fiction.latest_chapter}}</li>
                                    <li>来源站点：{{fiction.site}}</li>
                                </ul>
                            </el-col>
                            <el-col :xs="24" :xl="4">
                                <br>
                                <el-button type="primary" @click="addFiction(fiction)">导入书籍
                                </el-button>
                            </el-col>
                        </el-row>

                    </el-col>
                    <el-col :xs="24" :sm="24" :md="2" :lg="2" :xl="2"></el-col>
                </el-row>
                <el-divider></el-divider>
            </div>

        </div>
        <div v-else>
            <h2>无搜索结果！</h2>
        </div>

    </el-container>
</template>

<script>
    export default {
        name: "SearchedFictionsView",
        props: ['searchedFictions'],
        data() {
            return {
                fictionId: 0,
                addButtonLoading: false,
                searchViewLoading: false
            }
        },
        methods: {
            addFiction: function (fiction) {
                // 组织数据
                const data = {
                    fiction_name: fiction.fiction_name,
                    fiction_author: fiction.author,
                    fiction_url: fiction.origin_url,
                    site: fiction.site,
                    origin_id: fiction.origin_id,
                    image_url: fiction.image_url
                };
                // 拼接api地址
                const api_url = this.base_url + '/api/v1/fictions/add/';
                // 进入加载状态
                this.searchViewLoading = true;
                // 发起请求，先将小说加入到数据库中
                this.$axios.post(api_url, data)
                    .then((res) => {
                        // 从返回结果中提取小说编号
                        this.fictionId = res.data.fiction_id;
                        // this.$notify.success('小说添加成功！编号'+this.fictionId);
                        // 准备发起小说更新请求
                        this.updateFiction(this.fictionId);
                        this.searchViewLoading = false;
                    })
                    .catch((error) => {
                        console.error(error);
                        this.searchViewLoading = false;
                    })
            },
            updateFiction: function (fiction_id) {
                this.$notify.info('正在发起更新请求，请稍等...');
                const data = {
                    fiction_id: fiction_id
                };
                const api_url = this.base_url + '/api/v1/fictions/update/';
                this.$axios.post(api_url, data)
                    .then((res) => {
                        console.log(res);
                        this.$notify.success('请求成功！待更新章节数：' + res.data.uncached_chapters);
                        window.location.href = '/';
                    })
                    .catch((error) => {
                        console.error(error)
                    })
            }
        }
    }
</script>

<style scoped>

</style>