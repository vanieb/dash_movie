import Vue from "vue";
import VueI18n from "vue-i18n";
import Router from "vue-router";
import locales from "./i18n/locales";

Vue.use(Router);
Vue.use(VueI18n);

let navLang = navigator.language || navigator.userLanguage;
if (navLang === "zh-CN" || navLang === "zh-cn") {
  Vue.config.lang = "cn";
} else if (navLang === "en-US" || navLang === "en-us") {
  Vue.config.lang = "en";
} else {
  Vue.config.lang = "cn";
}

const i18n = new VueI18n({
  locale: Vue.config.lang,
  fallbackLocale: "en",
  messages: locales,
});

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      name: "login",
      path: "/login",
      component: function(resolve) {
        require(["./views/Login.vue"], resolve);
      },
      meta: {
        title: i18n.t("nav.login"),
        auth: false,
      },
    },
    {
      path: "/apps",
      name: "Overview",
      component: function(resolve) {
        require(["./views/Main/Apps.vue"], resolve);
      },
      meta: {
        icon: "apps",
        title: i18n.t("nav.apps"),
      },
    },
    {
      path: "/change_password",
      name: "Change Password",
      component: function(resolve) {
        require(["./views/My/ChangePassword.vue"], resolve);
      },
      meta: {
        icon: "vpn_key",
        auth: true,
        title: i18n.t("nav.change_password"),
      },
    },
    {
      path: "/apps",
      name: "Apps",
      component: function(resolve) {
        require(["./views/Main/Apps.vue"], resolve);
      },
      meta: {
        icon: "apps",
        auth: true,
        title: i18n.t("nav.apps"),
      },
    },
    {
      path: "/apps_review",
      name: "AppsReview",
      component: function(resolve) {
        require(["./views/Main/AppsReview.vue"], resolve);
      },
      meta: {
        icon: "visibility",
        title: i18n.t("nav.apps_review"),
      },
    },
    {
      path: "/apps_draft",
      name: "AppsDraft",
      component: function(resolve) {
        require(["./views/Main/AppsDraft.vue"], resolve);
      },
      meta: {
        icon: "visibility",
        title: i18n.t("nav.apps_draft"),
      },
    },
    // {
    //   path: "/apps_published",
    //   name: "AppsPublished",
    //   component: function(resolve) {
    //     require(["./views/Main/AppsPublished.vue"], resolve);
    //   },
    //   meta: {
    //     icon: "publish",
    //     title: i18n.t("nav.apps_published"),
    //   },
    // },
    {
      path: "/app_settings",
      name: "AppSettings",
      component: function(resolve) {
        require(["./views/Main/AppSettings.vue"], resolve);
      },
      meta: {
        icon: "apps",
        auth: true,
        title: i18n.t("nav.apps"),
      },
    },
    {
      path: "/apps/add",
      name: "Add Apps",
      component: function(resolve) {
        require(["./views/Main/AppsForm.vue"], resolve);
      },
      meta: {
        auth: true,
        title: i18n.t("nav.add_apps"),
      },
    },
    {
      path: "/apps/:appsId/",
      name: "Apps Details",
      component: function(resolve) {
        require(["./views/Main/AppsDetails.vue"], resolve);
      },
      meta: {
        auth: true,
        title: i18n.t("nav.apps_detail"),
      },
    },
    {
      path: "/apps/:appsId/edit",
      name: "Edit Apps",
      component: function(resolve) {
        require(["./views/Main/AppsForm.vue"], resolve);
      },
      meta: {
        auth: true,
        title: i18n.t("nav.edit_apps"),
      },
    },
    {
      path: "/articles",
      name: "Articles",
      component: function(resolve) {
        require(["./views/Main/Article.vue"], resolve);
      },
      meta: {
        icon: "description",
        auth: true,
        title: i18n.t("nav.articles"),
      },
    },
    {
      path: "/articles_review",
      name: "Article Review",
      component: function(resolve) {
        require(["./views/Main/ArticleReview.vue"], resolve);
      },
      meta: {
        icon: "visibility",
        auth: true,
        title: i18n.t("nav.articles_review"),
      },
    },
    {
      path: "/articles_draft",
      name: "Article Draft",
      component: function(resolve) {
        require(["./views/Main/ArticleDraft.vue"], resolve);
      },
      meta: {
        icon: "edit",
        auth: true,
        title: i18n.t("nav.articles_draft"),
      },
    },
    {
      path: "/articles_published",
      name: "Article Publish",
      component: function(resolve) {
        require(["./views/Main/ArticlePublished.vue"], resolve);
      },
      meta: {
        icon: "publish",
        auth: true,
        title: i18n.t("nav.articles_published"),
      },
    },
    {
      path: "/articles/add",
      name: "Add Article",
      component: function(resolve) {
        require(["./views/Main/ArticleForm.vue"], resolve);
      },
      meta: {
        auth: true,
        title: i18n.t("nav.add_article"),
        permission: "create_article",
      },
    },
    {
      path: "/articles/:articleId/",
      name: "Article Details",
      component: function(resolve) {
        require(["./views/Main/ArticleDetails.vue"], resolve);
      },
      meta: {
        auth: true,
        title: i18n.t("nav.article_details"),
      },
    },
    {
      path: "/articles/:articleId/edit",
      name: "Edit Article",
      component: function(resolve) {
        require(["./views/Main/ArticleForm.vue"], resolve);
      },
      meta: {
        auth: true,
        title: i18n.t("nav.edit_article"),
        permission: "change_article_details",
      },
    },
    {
      path: "/keyword_link",
      name: "KeywordLink",
      component: function(resolve) {
        require(["./views/Main/KeywordLink.vue"], resolve);
      },
      meta: {
        icon: "link",
        auth: true,
        title: i18n.t("nav.keyword_link"),
      },
    },
    {
      path: "/websites",
      name: "Websites",
      component: function(resolve) {
        require(["./views/Main/Website.vue"], resolve);
      },
      meta: {
        icon: "web",
        auth: true,
        title: i18n.t("nav.websites"),
      },
    },
    {
      path: "/websites/:websiteId/edit",
      name: "Edit Website",
      component: function(resolve) {
        require(["./views/Main/WebsiteForm.vue"], resolve);
      },
      meta: {
        auth: true,
        title: i18n.t("nav.edit_website"),
      },
    },
    {
      path: "/friendship_link",
      name: "FriendshipLink",
      component: function(resolve) {
        require(["./views/Main/FriendshipLink.vue"], resolve);
      },
      meta: {
        icon: "compare_arrows",
        auth: true,
        title: i18n.t("nav.friendship_link"),
      },
    },
    {
      path: "/label",
      name: "Label",
      component: function(resolve) {
        require(["./views/Main/Label.vue"], resolve);
      },
      meta: {
        icon: "label",
        auth: true,
        title: i18n.t("nav.labels"),
      },
    },
    {
      path: "/category",
      name: "Category",
      component: function(resolve) {
        require(["./views/Main/Category.vue"], resolve);
      },
      meta: {
        icon: "category",
        auth: true,
        title: i18n.t("nav.category"),
      },
    },
    {
      path: "/types",
      name: "Types",
      component: function(resolve) {
        require(["./views/Main/Type.vue"], resolve);
      },
      meta: {
        icon: "new_releases",
        auth: true,
        title: i18n.t("nav.types"),
      },
    },
    {
      path: "/leaderboard",
      name: "Leaderboard",
      component: function(resolve) {
        require(["./views/Main/Leaderboard.vue"], resolve);
      },
      meta: {
        icon: "format_list_numbered",
        auth: true,
        title: i18n.t("nav.leaderboard"),
      },
    },
    {
      path: "/recommended",
      name: "Recommended",
      component: function(resolve) {
        require(["./views/Main/Recommended.vue"], resolve);
      },
      meta: {
        icon: "star_outline",
        auth: true,
        title: i18n.t("nav.recommended"),
      },
    },
    {
      path: "/popular",
      name: "Popular",
      component: function(resolve) {
        require(["./views/Main/PopularArticle.vue"], resolve);
      },
      meta: {
        icon: "whatshot",
        auth: true,
        title: i18n.t("nav.popular_articles"),
      },
    },
    {
      path: "/import_article_logs",
      name: "Import Article Logs",
      component: function(resolve) {
        require(["./views/Logs/ImportArticleLogs.vue"], resolve);
      },
      meta: {
        icon: "list_alt",
        auth: true,
        title: `${i18n.t("nav.import_logs")} - ${i18n.t("nav.articles")}`,
      },
    },
    {
      path: "/members",
      name: "Members",
      component: function(resolve) {
        require(["./views/Users/Members.vue"], resolve);
      },
      meta: {
        icon: "person",
        auth: true,
        title: i18n.t("nav.members"),
        permission: "list_member",
      },
    },
    {
      path: "/staff",
      name: "Staff",
      component: function(resolve) {
        require(["./views/Users/Staff.vue"], resolve);
      },
      meta: {
        icon: "supervised_user_circle",
        auth: true,
        title: i18n.t("nav.staff"),
        permission: "list_staff",
      },
    },
    {
      path: "/staff/add",
      name: "Add Staff",
      component: function(resolve) {
        require(["./views/Users/StaffForm.vue"], resolve);
      },
      meta: {
        auth: true,
        title: i18n.t("nav.add_staff"),
        permission: "create_staff",
      },
    },
    {
      path: "/staff/:staffId/",
      name: "Staff Details",
      component: function(resolve) {
        require(["./views/Users/StaffDetails.vue"], resolve);
      },
      meta: {
        auth: true,
        title: i18n.t("nav.staff_details"),
      },
    },
    {
      path: "/staff/:staffId/edit",
      name: "Edit Staff",
      component: function(resolve) {
        require(["./views/Users/StaffForm.vue"], resolve);
      },
      meta: {
        auth: true,
        title: i18n.t("nav.edit_staff"),
        permission: "change_staff",
      },
    },
    {
      path: "/no_permission",
      name: "NoPermission",
      component: function(resolve) {
        require(["./views/NoPermission.vue"], resolve);
      },
      meta: {
        auth: true,
        title: i18n.t("system_msg.error"),
      },
    },
  ],
});
