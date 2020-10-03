import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/index.less' // global css
// import Vant from 'vant';
// import 'vant/lib/index.css';
// import '@vant/touch-emulator';
import './permission' // permission control
// import VTooltip from 'v-tooltip'

// Vue.use(Vant);
// Vue.use(VTooltip)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
