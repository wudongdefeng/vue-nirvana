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
    }
    ]
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
  // },
  // {
  //   path: '/xiaoju',
  //   component: Layout,
  //   redirect: '/xiaoju',
  //   hidden: true,
  //   children: [{
  //     path: '/:id',
  //     component: () => import('@/views/xiaoju/index.vue'),
  //     name: 'xiaoju',
  //     meta: {
  //       title: "小橘"
  //     }
  //   }]
  // },
  // {
  //   path: '/hh/:id',
  //   name: 'Hh',
  //   component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
  // },
  // {
  //   path: '/juhui',
  //   name: 'Juhui',
  //   component: () => import('@/views/juhui')
  // },
  // {
  //   path: '/nangua',
  //   name: 'Nangua',
  //   component: () => import('@/views/nangua')
  // },
  // {
  //   path: '/hh/:id',
  //   name: 'Hh',
  //   component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router