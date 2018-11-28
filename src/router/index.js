import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/frame/login'
import Org from  '@/views/org/orgTree'
import User from '@/views/user/userList'
import Manager from '@/views/frame/manager'
Vue.use(Router)

const router= new Router({
  base: '/wangbaoli-demo',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'manager',
      component: Manager,
      children: [{
        path: 'user',
        component: User,
        name: '用户管理'
      }, {
        path: 'org',
        component: Org,
        name: '组织机构',
      }]
    }


  ]
})
export default router
