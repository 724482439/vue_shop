import Vue from 'vue'
import VueRouter from 'vue-router'
import MyLogin from '../components/MyLogin'
import TheHome from '../components/TheHome'
import TheWelcome from '../components/TheWelcome'
import TheUsers from '../components/user/TheUsers'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // 重定向到login页面
    redirect: '/login',
  },
  {
    path: '/login',
    component: MyLogin
  },
  {
    path: '/home',
    component: TheHome,
    redirect:'/welcome',
    children: [
      {path:'/welcome',component:TheWelcome},
      {path:'/users',component:TheUsers},
    ]
  }
]

const router = new VueRouter({
  routes
})

// 为路由对象，配置路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  // 用户访问的不是登录页，则需校验用户token
  const tokenStr = window.sessionStorage.getItem('token')
  // 用户token为空，则强制跳转到登录页面
  if (!tokenStr) return next('/login')
  next();
})

export default router
