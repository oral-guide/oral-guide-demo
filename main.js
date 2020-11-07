import Vue from 'vue';
import App from './App';
import store from './store';
import util from './utils/main';
Vue.config.productionTip = false;

import Dialog from './wxcomponents/vant/dialog/dialog.js';

Vue.use(Dialog);

import userCard from './components/UserCard';
Vue.component("userCard",userCard)


Vue.prototype.$util = util;

App.mpType = 'app';

const app = new Vue({
    store,
    ...App
})
app.$mount()
