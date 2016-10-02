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

export default context => {
  router.push(context.url);

  return Promise.all(router.getMatchedComponents().map(component => {
    if (component.preFetch) {
      return component.preFetch(store);
    }
  })).then(() => {
    context.initialState = store.state;
    return app;
  });
};
