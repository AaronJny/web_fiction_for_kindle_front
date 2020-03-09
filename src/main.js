import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import axios from 'axios'

Vue.prototype.$axios = axios;
// Vue.prototype.base_url = 'http://localhost:7777';
Vue.prototype.base_url = '';

Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount('#app')
