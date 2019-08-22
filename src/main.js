import '@mdi/font/css/materialdesignicons.css'
import VueRouter from 'vue-router'
import 'buefy/dist/buefy.css'
import App from './App.vue'
import './assets/style.css'
import Buefy from 'buefy'
import Vue from 'vue'


Vue.config.productionTip = false
Vue.use(Buefy)
Vue.use(VueRouter)

const routes = [
  {
    path: '/:articleId',
    name: 'App',
    component: App,
  },
]

const router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
