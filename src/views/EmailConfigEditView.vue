<template>
    <div>
        <el-form :model="formEmailConfig" label-width="120px">
            <el-form-item label="发件人邮箱">
                <el-input v-model="formEmailConfig.sender"
                          placeholder="你在亚马逊官网添加的'已认可的发件人电子邮箱',如'xxx@163.com'"></el-input>
            </el-form-item>
            <el-form-item label="密码/授权码">
                <el-input v-model="formEmailConfig.password" type="password" placeholder="发件邮箱对应的密码或授权码"></el-input>
            </el-form-item>
            <el-form-item label="SMTP主机地址">
                <el-input v-model="formEmailConfig.smtp_host" placeholder="发件邮箱的SMTP主机地址，如'smtp.163.com'"></el-input>
            </el-form-item>
            <el-form-item label="SMTP端口">
                <el-input v-model="formEmailConfig.smtp_port" placeholder="发件邮箱的SMTP端口，如465"></el-input>
            </el-form-item>
            <el-form-item label="收件人邮箱">
                <el-input v-model="formEmailConfig.recipient"
                          placeholder="你在亚马逊官网配置的〖发送至Kindle〗电子邮箱,如'xxx@kindle.cn'"></el-input>
            </el-form-item>
            <div style="text-align: center">
                <el-button type="primary" @click="submitEdit">提交</el-button>
                <el-button type="danger" @click="clearEdit">清空</el-button>
            </div>


        </el-form>
    </div>
</template>

<script>
    export default {
        name: "EmailConfigEditView",
        data() {
            return {
                formEmailConfig: {
                    ecid: 0,
                    sender: '',
                    password: '',
                    smtp_host: 'smtp.163.com',
                    smtp_port: 465,
                    recipient: ''
                }
            }
        },
        methods: {
            getEmailConfig: function () {
                const api_url = this.base_url + '/api/v1/email_config/';
                this.$axios.get(api_url)
                    .then((res) => {
                        this.formEmailConfig = res.data.email_config;
                    })
                    .catch((error) => {
                        console.error(error);
                        this.$notify.error('啊哦，出错了！');
                    })
            },
            clearEdit: function () {
                this.formEmailConfig = {
                    ecid: 0,
                    sender: '',
                    password: '',
                    smtp_host: '',
                    smtp_port: '',
                    recipient: ''
                }
            },
            submitEdit: function () {
                const api_url = this.base_url + '/api/v1/email_config/update/';
                this.$axios.post(api_url, this.formEmailConfig)
                    .then((res) => {
                        this.$notify.success(res.data.msg);
                    })
                    .catch((error) => {
                        console.log(error);
                        this.$notify.error('啊哦，出错了！');
                    })
            }
        },
        created() {
            this.getEmailConfig();
        }
    }
</script>

<style scoped>

</style>