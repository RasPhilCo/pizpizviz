import Vue from 'vue';
import App from './App.vue';
import store from './store';
import Vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

new Vue({
  store,
  vuetify: Vuetify,
  render: (h) => h(App),
}).$mount('#app');
