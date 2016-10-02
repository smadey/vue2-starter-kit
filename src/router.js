import Vue from 'vue';
import Router from 'vue-router';

import hello from './containers/hello.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/top', component: hello },
    { path: '/new', component: hello },
    { path: '/show', component: hello },
    { path: '/ask', component: hello },
    { path: '/job', component: hello },
    { path: '*', redirect: '/top' },
  ],
});
