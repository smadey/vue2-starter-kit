require('es6-promise').polyfill();

import Vue from 'vue';
import { sync } from 'vuex-router-sync';

import store from './store';
import router from './router';
import App from './containers/app.vue';

sync(store, router);

const app = new Vue({
  router,
  store,
  ...App,
});

store.replaceState(window.__INITIAL_STATE__);

app.$mount('#app');
