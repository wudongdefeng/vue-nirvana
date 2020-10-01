import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/',
    hidden: true,
    children: [{
      path: 'xiaoxia/:id/:playCoding?',
      component: () => import('@/views/xiaoxia/index.vue'),
      name: 'xiaoxia',
      meta: {
        title: "小虾"
      }
    },
    {
      path: 'xiaoju/:id',
      component: () => import('@/views/xiaoju/index.vue'),
      name: 'xiaoju',
      meta: {
        title: "小橘"
      }
    },
    {
      path: 'history',
      component: () => import('@/views/history/index.vue'),
      name: 'history',
      meta: {
        title: "记录管理"
      }
    }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router