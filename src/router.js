import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Router from 'vue-router'
import locales from './i18n/locales'

Vue.use(Router)
Vue.use(VueI18n)

let navLang = navigator.language || navigator.userLanguage
if (navLang === 'zh-CN' || navLang === 'zh-cn') {
  Vue.config.lang = 'cn'
} else if (navLang === 'en-US' || navLang === 'en-us') {
  Vue.config.lang = 'en'
} else {
  Vue.config.lang = 'cn'
}

const i18n = new VueI18n({
  locale: Vue.config.lang,
  fallbackLocale: 'en',
  messages: locales
})


export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      name: 'login',
      path: '/login',
      component: function(resolve) {
        require(['./views/Login.vue'], resolve)
      },
      meta: {
        title: i18n.t('nav.login'),
        auth: false
      }
    },
    {
      path: '/',
      name: 'Overview',
      component: function(resolve) {
        require(['./views/Main/Apps.vue'], resolve)
      },
      meta: {
        icon: 'apps',
        title: i18n.t('nav.apps')
      }
    },
    {
      path: '/change_password',
      name: 'Change Password',
      component: function(resolve) {
        require(['./views/My/ChangePassword.vue'], resolve)
      },
      meta: {
        icon: 'vpn_key',
        auth: true,
        title: i18n.t('nav.change_password')
      }
    },
    {
      path: '/apps',
      name: 'Apps',
      component: function(resolve) {
        require(['./views/Main/Apps.vue'], resolve)
      },
      meta: {
        icon: 'apps',
        auth: true,
        title: i18n.t('nav.apps')
      }
    },
    {
        path: '/apps/add',
        name: 'Add Apps',
        component: function (resolve) {
            require(['./views/Main/AppsForm.vue'], resolve)
        },
        meta: {
          auth: true,
          title: i18n.t('nav.add_apps'),
        }
    },
    {
        path: '/apps/:appsId/',
        name: 'Apps Details',
        component: function (resolve) {
            require(['./views/Main/AppsDetails.vue'], resolve)
        },
        meta: {
          auth: true,
          title: i18n.t('nav.apps_detail'),
        }
    },
    {
        path: '/apps/:appsId/edit',
        name: 'Edit Apps',
        component: function (resolve) {
            require(['./views/Main/AppsForm.vue'], resolve)
        },
        meta: {
          auth: true,
          title: i18n.t('nav.edit_apps'),
        }
    },
    {
      path: '/webapps',
      name: 'WebsiteApps',
      component: function(resolve) {
        require(['./views/Main/WebsiteApps.vue'], resolve)
      },
      meta: {
        icon: 'apps',
        auth: true,
        title: i18n.t('nav.apps')
      }
    },
    {
      path: '/webapps/:appsId/:websiteId/edit',
      name: 'Edit Web Apps',
      component: function (resolve) {
          require(['./views/Main/WebsiteAppsForm.vue'], resolve)
      },
      meta: {
        auth: true,
        title: i18n.t('nav.edit_apps'),
      }
    },
    {
      path: '/webapps/:appsId/:websiteId/',
      name: 'Web Apps Details',
      component: function (resolve) {
          require(['./views/Main/WebsiteAppsDetails.vue'], resolve)
      },
      meta: {
        auth: true,
        title: i18n.t('nav.apps_detail'),
      }
    },
    {
      path: '/websites',
      name: 'Websites',
      component: function(resolve) {
        require(['./views/Main/Website.vue'], resolve)
      },
      meta: {
        icon: 'web',
        auth: true,
        title: i18n.t('nav.websites')
      }
    },
    {
      path: '/label',
      name: 'Label',
      component: function(resolve) {
        require(['./views/Main/Label.vue'], resolve)
      },
      meta: {
        icon: 'label',
        auth: true,
        title: i18n.t('nav.labels')
      }
    },
    {
      path: '/category',
      name: 'Category',
      component: function(resolve) {
        require(['./views/Main/Category.vue'], resolve)
      },
      meta: {
        icon: 'category',
        auth: true,
        title: i18n.t('nav.category')
      }
    },
    {
      path: '/types',
      name: 'Types',
      component: function(resolve) {
        require(['./views/Main/Type.vue'], resolve)
      },
      meta: {
        icon: 'new_releases',
        auth: true,
        title: i18n.t('nav.types')
      }
    },
    {
      path: '/leaderboard',
      name: 'Leaderboard',
      component: function(resolve) {
        require(['./views/Main/Leaderboard.vue'], resolve)
      },
      meta: {
        icon: 'format_list_numbered',
        auth: true,
        title: i18n.t('nav.leaderboard')
      }
    },
    {
      path: '/recommended',
      name: 'Recommended',
      component: function(resolve) {
        require(['./views/Main/Recommended.vue'], resolve)
      },
      meta: {
        icon: 'star_outline',
        auth: true,
        title: i18n.t('nav.recommended')
      }
    },
    {
      path: '/staff',
      name: 'Staff',
      component: function(resolve) {
        require(['./views/Users/Staff.vue'], resolve)
      },
      meta: {
        icon: 'people',
        auth: true,
        title: i18n.t('nav.staff')
      }
    }
  ]
})
