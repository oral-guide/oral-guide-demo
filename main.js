import Vue from 'vue';
import App from './App';
import store from './store';
import util from './utils/main';
Vue.config.productionTip = false;

import Dialog from './wxcomponents/vant/dialog/dialog';

Vue.use(Dialog);

Vue.prototype.$util = util;

App.mpType = 'app';

const app = new Vue({
    store,
    ...App
})
app.$mount()
