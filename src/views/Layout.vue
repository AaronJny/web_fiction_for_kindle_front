<template>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <Header></Header>
        </div>
        <MainBody></MainBody>
    </el-card>
</template>

<script>
import Header from './Header.vue'
import MainBody from "./MainBody"
    export default {
        name: "Layout",
        components:{
            Header,
            MainBody
        }
    }
</script>

<style scoped>

</style>