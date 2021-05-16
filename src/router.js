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
      path: "/movies",
      name: "Overview",
      component: function(resolve) {
        require(["./views/Main/Movies.vue"], resolve);
      },
      meta: {
        icon: "videocam",
        title: i18n.t("nav.movies"),
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
      path: "/movies",
      name: "Movies",
      component: function(resolve) {
        require(["./views/Main/Movies.vue"], resolve);
      },
      meta: {
        icon: "description",
        auth: true,
        title: i18n.t("nav.movies"),
      },
    },
    {
      path: "/movies/add",
      name: "Add Movie",
      component: function(resolve) {
        require(["./views/Main/MovieForm.vue"], resolve);
      },
      meta: {
        auth: true,
        title: i18n.t("nav.add_movie"),
      },
    },
    {
      path: "/movies/:movieId/",
      name: "Movie Details",
      component: function(resolve) {
        require(["./views/Main/MovieDetails.vue"], resolve);
      },
      meta: {
        auth: true,
        title: i18n.t("nav.movie_details"),
      },
    },
    {
      path: "/movies/:movieId/edit",
      name: "Edit Movie",
      component: function(resolve) {
        require(["./views/Main/MovieForm.vue"], resolve);
      },
      meta: {
        auth: true,
        title: i18n.t("nav.edit_movie"),
      },
    },
    {
      path: "/artists",
      name: "Artists",
      component: function(resolve) {
        require(["./views/Main/Artists.vue"], resolve);
      },
      meta: {
        icon: "recent_actors",
        auth: true,
        title: i18n.t("nav.artists"),
      },
    },
    {
      path: "/global_settings",
      name: "GlobalSettings",
      component: function(resolve) {
        require(["./views/Main/GlobalSettings.vue"], resolve);
      },
      meta: {
        icon: "build",
        auth: true,
        title: i18n.t("nav.global_settings"),
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
        title: `${i18n.t("nav.import_logs")} - ${i18n.t("nav.movies")}`,
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
      },
    },
  ],
});
