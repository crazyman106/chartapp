import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import webExcel from '../views/webExcel.vue'

import fileList from '../views/fileList.vue'
import fileList1 from '../views/fileList1.vue'
Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'webExcel',
    component: webExcel
  },
	{
		path: '/fileList',
		name: 'fileList',
		component: fileList
	},
	{
		path: '/webExcel',
		name: 'webExcel',
		component: webExcel
	},
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
