import Vue from 'vue'
import Router from 'vue-router'
import Layout from './views/Layout/Layout.vue'
import store from "./store";

import Login from './views/Login.vue'
import NotFound from './views/403.vue'
import Welcome from './views/Welcome'

import Table from './views/User/Users.vue'
import Roles from './views/User/Roles.vue'

import Module from './views/Permission/Module.vue'
import Permission from './views/Permission/Permission.vue'
import Assign from './views/Permission/Assign.vue'

import Form from './views/Form/Form.vue'
import Charts from './views/Form/Charts.vue'


import Blogs from './views/Blog/Blogs.vue'
import Bugs from './views/Tibug/Bugs.vue'

import Thanks from './views/Thanks'


Vue.use(Router)


const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/403', component: NotFound, name: 'NotFound',
            meta: {
                title: '首页',
                NoTabPage: true,
                requireAuth: false
            },
            hidden: true
        },
        {
            path: '/Thanks', component: Thanks, name: 'Thanks',
            meta: {
                title: 'Thanks',
                requireAuth: false
            },
            hidden: true
        },
        {
            path: '/',
            component: Welcome,
            name: 'QQ欢迎页',
            iconCls: 'fa-qq',//图标样式class
            // hidden: true,
            meta: {
                title: 'QQ欢迎页',
                requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
            }
        },
        {
            path: '/login',
            component: Login,
            name: 'login',
            iconCls: 'fa-address-card',//图标样式class
            meta: {
                title: '登录',
                NoTabPage: true,
                NoNeedHome: true // 添加该字段，表示不需要home模板
            },
            hidden: true
        },
        {
            path: '/',
            component: Layout,
            name: '用户角色管理',
            iconCls: 'fa-users',//图标样式class
            children: [
                {
                    path: '/Admin/Users', component: Table, name: '用户管理',
                    meta: {
                        title: '用户管理',
                        requireAuth: true
                    }
                },
                {
                    path: '/Admin/Roles', component: Roles, name: '角色管理',
                    meta: {
                        title: '角色管理',
                        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
            ]
        },
        {
            path: '/',
            component: Layout,
            name: '菜单权限管理',
            iconCls: 'fa-sitemap',//图标样式class
            children: [
                {
                    path: '/Permission/Modules', component: Module, name: '接口管理',
                    meta: {
                        title: '接口管理',
                        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: '/Permission/Menu', component: Permission, name: '菜单管理',
                    meta: {
                        title: '菜单管理',
                        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: '/Permission/Assign', component: Assign, name: '权限分配',
                    meta: {
                        title: '权限分配',
                        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
            ]
        },
        {
            path: '/',
            component: Layout,
            name: '报表管理',
            iconCls: 'fa-line-chart ',//图标样式class
            children: [
                {
                    path: '/Chart/From', component: Form, name: '表单Form',
                    meta: {
                        title: '表单Form',
                        requireAuth: true
                    }
                },
                {
                    path: '/Chart/Charts', component: Charts, name: '图表Chart',
                    meta: {
                        title: '图表Chart',
                        requireAuth: true
                    }
                },
            ]
        },
        {
            path: '/Tibug',
            component: Bugs,
            name: '问题管理',
            iconCls: ' fa-bug',//图标样式class
            // hidden: true,
            meta: {
                title: '问题管理',
                requireAuth: false // 添加该字段，表示进入这个路由是需要登录的
            }
        },
        {
            path: '/Blogs',
            component: Blogs,
            name: '博客管理',
            iconCls: ' fa-file-word-o',//图标样式class
            // hidden: true,
            meta: {
                title: '博客管理',
                requireAuth: false // 添加该字段，表示进入这个路由是需要登录的
            }
        },
        {
            path: '*',
            hidden: true,
            redirect: {path: '/404'}
        }
    ]
})

var storeTemp = store;
router.beforeEach((to, from, next) => {

    if (!storeTemp.state.token) {
        storeTemp.commit("saveToken", window.localStorage.Token)
    }
    if (!storeTemp.state.tokenExpire) {
        storeTemp.commit("saveTokenExpire", window.localStorage.TokenExpire)
    }

    var nowtime = new Date();
    var lastRefreshtime = window.localStorage.refreshtime ? new Date(window.localStorage.refreshtime) : new Date(-1);
    if (lastRefreshtime >= nowtime) {
        nowtime.setMinutes(nowtime.getMinutes() + 20);//滑动
        window.localStorage.refreshtime = nowtime;
    }else {

        window.localStorage.refreshtime = new Date(-1);
    }

    var refreshtime = new Date(Date.parse(window.localStorage.refreshtime))

    if (to.meta.requireAuth) {
        // 判断该路由是否需要登录权限
        var curTime = new Date()
        var expiretime = new Date(Date.parse(window.localStorage.TokenExpire))


        if (storeTemp.state.token && storeTemp.state.token != "undefined") {

            // 通过vuex state获取当前的token是否存在
            next();
        } else {

            store.commit("saveToken", "");
            store.commit("saveTokenExpire", "");
            store.commit("saveTagsData", "");
            window.localStorage.removeItem('user');
            window.localStorage.removeItem('NavigationBar');

            next({
                path: "/login",
                query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
            });
        }
    } else {
        next();
    }
});

export default router;
