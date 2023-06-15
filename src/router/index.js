import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/layout'
import store from '@/store'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 两级路由 的path 有两种写法
    // 1.绝对路径  需要加上斜杠 /
    // 2.相对路径  不要加斜杠  会自动加上上一级的path
    { path: '/login', component: () => import('@/views/login') },
    {
      path: '/', component: Layout,
      redirect: '/dashboard',
      children: [
        { path: '/dashboard', component: () => import('@/views/dashboard') },
        { path: '/article', component: () => import('@/views/article') },
      ]
    },

  ]
})

router.beforeEach((to, from, next) => {
  const { token } = store.state.user;
  // console.log(store);
  console.log(token);
  if (to.path !== '/login' && !token) return next('/login'); //如果去的不是登录页，且没有token，就跳转到登录页
  next();
})
export default router
