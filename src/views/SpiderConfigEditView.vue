<template>
    <div>
        <el-table :data="spider_configs" v-if="showTable">
            <el-table-column property="site" label="网站"></el-table-column>
            <el-table-column property="domain" label="域名"></el-table-column>
            <el-table-column property="cls_name" label="爬虫类名"></el-table-column>
            <el-table-column label="爬虫状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.spider_status===1">开启</span>
                    <span v-else>关闭</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="openSpiderConfigEditForm(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-form v-else :model="formSpiderConfig" label-width="80px">
            <el-form-item label="网站">
                <el-input v-model="formSpiderConfig.site" disabled></el-input>
            </el-form-item>
            <el-form-item label="域名">
                <el-input v-model="formSpiderConfig.domain"></el-input>
            </el-form-item>
            <el-form-item label="爬虫类名">
                <el-input v-model="formSpiderConfig.cls_name" disabled></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-switch
                        v-model="formSpiderConfig.open_status"
                        active-text="开启"
                        inactive-text="关闭">
                </el-switch>
            </el-form-item>
            <div style="text-align: center">
                <el-button type="primary" @click="submitEdit">提交</el-button>
                <el-button type="info" @click="cancelEdit">取消</el-button>
            </div>


        </el-form>
    </div>

</template>

<script>
    export default {
        name: "SpiderConfigEditView",
        data() {
            return {
                spider_configs: [],
                showTable: true,
                formSpiderConfig: {
                    site: '',
                    domain: '',
                    cls_name: '',
                    open_status: true,
                    scid: 0
                }
            }
        },
        methods: {
            getAllSpiderConfigs: function () {
                const api_url = this.base_url + '/api/v1/spider_configs/all/';
                this.$axios.get(api_url)
                    .then((res) => {
                        this.spider_configs = res.data.spider_configs;
                    })
                    .catch((error) => {
                        console.error(error);
                        this.$notify.error('啊哦，出错了！');
                    })
            },
            openSpiderConfigEditForm: function (spider_config) {
                this.formSpiderConfig = {
                    site: spider_config.site,
                    domain: spider_config.domain,
                    cls_name: spider_config.cls_name,
                    open_status: spider_config.spider_status === 1,
                    scid: spider_config.scid
                };
                this.showTable = false;
            },
            cancelEdit: function () {
                this.getAllSpiderConfigs();
                this.showTable = true;
            },
            submitEdit: function () {
                // 先提交更新
                const data = {
                    scid: this.formSpiderConfig.scid,
                    domain: this.formSpiderConfig.domain,
                    open_status: this.formSpiderConfig.open_status
                };
                const api_url = this.base_url + '/api/v1/spider_configs/update/';
                this.$axios.post(api_url, data)
                    .then((res) => {
                        this.$notify.success(res.data.msg);
                    })
                    .catch((error) => {
                        console.error(error);
                        this.$notify.error('啊哦，出错了！');
                    });
                // 再刷新列表
                this.getAllSpiderConfigs();
                // 最后切换窗体
                this.showTable = true;
            }
        },
        created() {
            this.getAllSpiderConfigs();
        }
    }
</script>

<style scoped>

</style>