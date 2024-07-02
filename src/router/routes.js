const routes = [
  {
    path: '/',
    children: [
      { path: '', name: "index", component: () => import('pages/IndexPage.vue') },
      { path: '/login', name: "login", component: () => import('pages/login/Login.vue') },
      { path: '/join', name: "join", component: () => import('pages/login/Join.vue') },
      { path: '/isVerified', name: "isVerified", component: () => import('pages/login/IsVerified.vue') },
      { path: '/updateEmail', name: "updateEmail", component: () => import('pages/login/UpdateEmail.vue') },
      { path: '/findId', name: "findId", component: () => import('pages/login/FindId.vue') },
      { path: '/findPassword', name: "findPassword", component: () => import('pages/login/FindPassword.vue') },
      { path: '/newPassword', name: "newPassword", component: () => import('pages/login/NewPassword.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
