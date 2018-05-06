import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'example', icon: 'example' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },
  {
    path: '/events',
    component: Layout,
    redirect: '/events/list',
    name: 'Events',
    meta: { title: '会议管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'EventsList',
        component: () => import('@/views/events/index'),
        meta: { title: '会议列表', icon: 'table' }
      },
      {
        path: 'detail',
        name: 'EventsDetail',
        component: () => import('@/views/events/detail'),
        meta: { title: '会议详情', icon: 'table' },
        hidden: true
      },
      {
        path: 'add',
        name: 'EventsAdd',
        component: () => import('@/views/events/detail'),
        meta: { title: '添加会议', icon: 'table' },
        // redirect: '/events/add/info',
        // children: [  
        //   { 
        //     path: "info", 
        //     name: 'EventsInfo',
        //     component: () => import('@/views/events/detail/info'), 
        //     meta: { title: '添加会议信息', icon: 'table' },
        //     hidden: true
        //   }  
        // ] 
      },
      
    ]
  },

  //酒店管理
  {
    path: '/hotel',
    component: Layout,
    redirect: '/hotel/list',
    name: 'Hotel',
    meta: { title: '酒店管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'HotelList',
        component: () => import('@/views/hotel/index'),
        meta: { title: '酒店列表', icon: 'table' }
      },
      {
        path: 'add',
        name: 'HotelAdd',
        component: () => import('@/views/hotel/detail'),
        meta: { title: '添加酒店', icon: 'tree' }
      },
      {
        path: 'detail',
        name: 'HotelDetail',
        component: () => import('@/views/hotel/detail'),
        meta: { title: '酒店详情', icon: 'table' },
        hidden: true
      },
    ]
  },

  //嘉宾管理
  {
    path: '/speaker',
    component: Layout,
    redirect: '/speaker/list',
    name: 'Speaker',
    meta: { title: '嘉宾管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'SpeakerList',
        component: () => import('@/views/speaker/index'),
        meta: { title: '嘉宾列表', icon: 'table' }
      },
      {
        path: 'add',
        name: 'SpeakerAdd',
        component: () => import('@/views/speaker/detail'),
        meta: { title: '添加嘉宾', icon: 'tree' }
      },
      {
        path: 'detail',
        name: 'SpeakerDetail',
        component: () => import('@/views/speaker/detail'),
        meta: { title: '嘉宾详情', icon: 'table' },
        hidden: true
      },
    ]
  },

  //媒体管理
  {
    path: '/media',
    component: Layout,
    redirect: '/media/list',
    name: 'Media',
    meta: { title: '媒体管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'MediaList',
        component: () => import('@/views/media/index'),
        meta: { title: '媒体列表', icon: 'table' }
      },
      {
        path: 'add',
        name: 'MediaAdd',
        component: () => import('@/views/media/detail'),
        meta: { title: '添加媒体', icon: 'tree' }
      },
      {
        path: 'detail',
        name: 'MediaDetail',
        component: () => import('@/views/media/detail'),
        meta: { title: '媒体详情', icon: 'table' },
        hidden: true
      },
    ]
  },

  //会议报名管理
  {
    path: '/eventsRegister',
    component: Layout,
    redirect: '/eventsRegister/list',
    name: 'EventsRegister',
    meta: { title: '会议报名管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'EventsRegisterList',
        component: () => import('@/views/eventsRegister/index'),
        meta: { title: '会议报名列表', icon: 'table' }
      },
      // {
      //   path: 'add',
      //   name: 'EventsRegisterAdd',
      //   component: () => import('@/views/eventsRegister/detail'),
      //   meta: { title: '添加会议报名', icon: 'tree' }
      // },
      // {
      //   path: 'detail',
      //   name: 'EventsRegisterDetail',
      //   component: () => import('@/views/eventsRegister/detail'),
      //   meta: { title: '会议报名详情', icon: 'table' },
      //   hidden: true
      // },
    ]
  },

  //路演项目管理
  {
    path: '/roadShow',
    component: Layout,
    redirect: '/roadShow/list',
    name: 'RoadShow',
    meta: { title: '路演项目管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'RoadShowList',
        component: () => import('@/views/roadShow/index'),
        meta: { title: '路演项目列表', icon: 'table' }
      },
      {
        path: 'add',
        name: 'RoadShowAdd',
        component: () => import('@/views/roadShow/detail'),
        meta: { title: '添加路演项目', icon: 'tree' }
      },
      {
        path: 'detail',
        name: 'RoadShowDetail',
        component: () => import('@/views/roadShow/detail'),
        meta: { title: '路演项目详情', icon: 'table' },
        hidden: true
      },
      {
        path: 'registerList',
        name: 'RoadShowRegisterList',
        component: () => import('@/views/roadShow/registerList'),
        meta: { title: '路演报名列表', icon: 'table' }
      },
    ]
  },

  //新闻管理
  {
    path: '/news',
    component: Layout,
    redirect: '/news/list',
    name: 'News',
    meta: { title: '新闻管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'NewsList',
        component: () => import('@/views/news/index'),
        meta: { title: '新闻列表', icon: 'table' }
      },
      {
        path: 'add',
        name: 'NewsAdd',
        component: () => import('@/views/news/detail'),
        meta: { title: '添加新闻', icon: 'tree' }
      },
      {
        path: 'detail',
        name: 'NewsDetail',
        component: () => import('@/views/news/detail'),
        meta: { title: '新闻详情', icon: 'table' },
        hidden: true
      },
    ]
  },

  //咨询服务
  {
    path: '/services',
    component: Layout,
    redirect: '/services/person',
    name: 'Services',
    meta: { title: '咨询服务', icon: 'example' },
    children: [
      {
        path: 'person',
        name: 'ServicesPerson',
        component: () => import('@/views/services/person'),
        meta: { title: '精准人才', icon: 'table' }
      },
      {
        path: 'register',
        name: 'ServicesRegister',
        component: () => import('@/views/services/register'),
        meta: { title: '产品注册', icon: 'table' }
      },
      {
        path: 'plan',
        name: 'ServicesPlan',
        component: () => import('@/views/services/plan'),
        meta: { title: '园区规划', icon: 'table' }
      },
    ]
  },

  //关于我们
  {
    path: '/about',
    component: Layout,
    redirect: '/about/detail',
    name: 'About',
    meta: { title: '关于我们', icon: 'example' },
    children: [
      {
        path: 'detail',
        name: 'AboutDetail',
        component: () => import('@/views/about/detail'),
        meta: { title: '关于我们', icon: 'table' }
      },
    ]
  },

  //管理员管理
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/list',
    name: 'Admin',
    meta: { title: '管理员管理', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'AdminList',
        component: () => import('@/views/admin/index'),
        meta: { title: '管理员管理', icon: 'table' }
      }
    ]
  },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history', //后端支持可开
  base: '/chc-admin/',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

