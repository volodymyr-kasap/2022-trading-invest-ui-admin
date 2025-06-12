import { createRouter, createWebHistory } from 'vue-router'
import {
  initMiddlewareService,
  getAuthMiddlewares,
} from '@/middleware'

const SUCCESS_REDIRECT = 'TariffList'
const ERROR_REDIRECT = 'Auth'

const {
  fetchMe,
  isAuth,
  redirectIfAuthenticated,
} = getAuthMiddlewares(
  SUCCESS_REDIRECT,
  ERROR_REDIRECT,
)

const routes = [
  {
    name: 'TariffList',
    path: '/tariffs',
    meta: {
      middleware: [
        fetchMe,
        isAuth,
      ],
      section: 'tariffs',
    },
    component: () => import('@/pages/tariffs/TariffList.vue'),
  },
  {
    name: 'TariffAdd',
    path: '/tariffs/add',
    meta: {
      middleware: [
        fetchMe,
        isAuth,
      ],
      section: 'tariffs',
    },
    component: () => import('@/pages/tariffs/TariffAdd.vue'),
  },
  {
    name: 'TariffView',
    path: '/tariffs/:id',
    meta: {
      middleware: [
        fetchMe,
        isAuth,
      ],
      section: 'tariffs',
    },
    component: () => import('@/pages/tariffs/TariffView.vue'),
  },

  {
    name: 'DepositList',
    path: '/deposits',
    meta: {
      middleware: [
        fetchMe,
        isAuth,
      ],
      section: 'deposits',
    },
    component: () => import('@/pages/deposits/DepositList.vue'),
  },
  {
    name: 'DepositView',
    path: '/deposits/:id',
    meta: {
      middleware: [
        fetchMe,
        isAuth,
      ],
      section: 'deposits',
    },
    component: () => import('@/pages/deposits/DepositView.vue'),
  },

  {
    name: 'ClientList',
    path: '/clients',
    meta: {
      middleware: [
        fetchMe,
        isAuth,
      ],
      section: 'clients',
    },
    component: () => import('@/pages/clients/ClientList.vue'),
  },
  {
    name: 'ClientView',
    path: '/clients/:id',
    meta: {
      section: 'clients',
    },
    component: () => import('@/pages/clients/ClientView.vue'),
  },

  {
    name: 'PayoutList',
    path: '/payouts',
    meta: {
      middleware: [
        fetchMe,
        isAuth,
      ],
      section: 'payouts',
    },
    component: () => import('@/pages/payouts/PayoutList.vue'),
  },
  {
    name: 'PayoutView',
    path: '/payouts/:id',
    meta: {
      middleware: [
        fetchMe,
        isAuth,
      ],
      section: 'payouts',
    },
    component: () => import('@/pages/payouts/PayoutView.vue'),
  },

  {
    name: 'ProfitPlan',
    path: '/profit-plan',
    meta: {
      middleware: [
        fetchMe,
        isAuth,
      ],
      section: 'profits',
    },
    component: () => import('@/pages/ProfitPlanPage.vue'),
  },

  {
    name: 'TransactionList',
    path: '/transactions',
    meta: {
      middleware: [
        fetchMe,
        isAuth,
      ],
      section: 'transactions',
    },
    component: () => import('@/pages/transactions/TransactionList.vue'),
  },
  {
    name: 'TransactionAdd',
    path: '/transactions/add',
    meta: {
      middleware: [
        fetchMe,
        isAuth,
      ],
      section: 'transactions',
    },
    component: () => import('@/pages/transactions/TransactionAdd.vue'),
  },
  {
    name: 'TransactionView',
    path: '/transactions/:id',
    meta: {
      middleware: [
        fetchMe,
        isAuth,
      ],
      section: 'transactions',
    },
    component: () => import('@/pages/transactions/TransactionView.vue'),
  },

  {
    name: 'Auth',
    path: '/auth',
    meta: {
      middleware: [
        fetchMe,
        redirectIfAuthenticated,
      ],
    },
    component: () => import('@/pages/AuthPage.vue'),
  },

  {
    path: '/:catchAll(.*)',
    redirect: {
      name: 'Auth',
    },
  },
]

const initMiddlewares = initMiddlewareService()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(initMiddlewares)

export default router
