import Vue from 'vue';
import VueRouter from 'vue-router';

import { API, Home, ESI, Types } from './components';
import Main from './Main.vue';

Vue.use(VueRouter);

// Routes
const routes = [
  { path: '/', component: Main, children: [
    { path: '', component: Home },
    { path: 'api', component: API },
    { path: 'esi', component: ESI },
    { path: 'types', component: Types }
  ]}
];
const router = new VueRouter({mode: 'hash', routes});

// Launch
new Vue({
  router,
  el: '#app',
  render: function(createElement) {
    return createElement('router-view');
  }
});
