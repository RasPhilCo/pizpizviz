import Vue from 'vue';
import App from './App.vue';
import store from './store';
import Vuetify from './plugins/vuetify';
// import 'roboto-fontface/css/roboto/roboto-fontface.css';
// import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;

// Vue.use(Vuetify);

new Vue({
  store,
  vuetify: Vuetify,
  render: (h) => h(App),
}).$mount('#app');
