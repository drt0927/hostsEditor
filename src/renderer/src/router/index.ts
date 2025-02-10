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
          depth: 1,
          title: ''
        }
      },
      {
        // HostsEditor
        path: '/hosts-editor',
        name: 'HostsEditor',
        component: () => import('@/views/HostsEditor/Index.vue'),
        meta: {
          depth: 1,
          title: 'Hosts 🔮'
        }
      },
      {
        // ParkingSearch
        path: '/parking-search',
        name: 'ParkingSearch',
        component: () => import('@/views/ParkingSearch/Index.vue'),
        meta: {
          depth: 1,
          title: '🅿️주차장🅿️ 검색'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((_to, _from, next) => {
  document.title = `Hoe${_to.meta.title ? ` - ${_to.meta.title}` : ''}`
  next()
})

export default router
