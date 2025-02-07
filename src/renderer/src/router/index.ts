import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: {
      depth: 0
    },
    children: [
      {
        path: '/',
        name: 'Index',
        component: () => import('@/views/Index.vue'),
        meta: {
          depth: 1
        }
      },
      {
        // HostsEditor
        path: '/hosts-editor',
        name: 'HostsEditor',
        component: () => import('@/views/HostsEditor/Index.vue'),
        meta: {
          depth: 1
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
