import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueRouter from "vue-router";
import VueI18n from "vue-i18n";
import VeeValidate, { Validator } from "vee-validate";
import zhCN from "vee-validate/dist/locale/zh_CN";
import locales from "./i18n/locales";
import VueCookie from "vue-cookie";
import { handleError } from "@/utils/handleError";
import router from "./router";
import axios from "axios";

Vue.use(require("vue-moment"));

Vue.config.productionTip = false;
let url = window.location.href;
const HTTPS = process.env.HTTPS;
if (HTTPS && HTTPS.replace(/"/g, "") === "1") {
  if (window.location.protocol === "http:") {
    window.location.replace(url.replace(/http:/, "https:"));
  }
}

Vue.prototype.$http = axios;
Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.use(VueCookie);
Vue.use(VeeValidate);

const host = process.env.VUE_APP_API_URL;

axios.options.root = host;
axios.defaults.headers["Content-Type"] = "application/json;charset=UTF-8";

if (VueCookie.get("access_token")) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${VueCookie.get(
    "access_token"
  )}`;
} else {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Basic Zmlyc3QtY2xpZW50Om5vb25ld2lsbGV2ZXJndWVzcw==`;
}

axios.interceptors.response.use(
  (response) => {
    if (response.data.access_token) {
      return response.data;
    } else {
      if (response.data.status === "OK" && response.status == 200) {
        return response.data.data;
      } else if (response.status === 401) {
        router.push({
          path: "/login",
          query: {
            next: router.fullPath,
          },
        });
      } else {
        console.log(response)
        return Promise.reject(handleError(response.data.message));
      }
    }
  },
  (error) => {
    if (error.response.status === 401) {
      router.push({
        path: "/login",
        query: {
          next: router.fullPath,
        },
      });
    } else if (error.response.status === 404 || error.response.status === 500) {
      return Promise.reject(
        Vue.config.lang === "cn"
          ? "??????????????????????????????"
          : "An error occured. Please try again later."
      );
    } else {
      return Promise.reject(
        Vue.config.lang === "cn"
          ? "??????????????????????????????"
          : error.response.data.message
      );
    }
  },
  () => {
    return Promise.reject(
      Vue.config.lang === "cn"
        ? "??????????????????????????????"
        : "An error occured. Please try again later."
    );
  }
);

const navLang = navigator.language || navigator.userLanguage;
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

if (/(zh|cn)/gi.test(navLang)) {
  Validator.localize("zh_CN", zhCN);
}

router.beforeEach((to, from, next) => {
  if (to.meta.auth) {
    if (VueCookie.get("access_token")) {
      next();
    } else {
      let nextPage = to.fullPath;
      let target;
      if (nextPage.indexOf("/login?next=") >= 0) {
        target = from.query.next;
      } else {
        target = "/login?next=" + nextPage;
      }
      router.push(target);
    }
  } else {
    next();
  }
});

router.afterEach((route) => {
  document.title = route.meta.title;
});

const app = new Vue({
  router,
  vuetify,
  i18n,
  ...App,
}).$mount("#app");

export { app, router, i18n };
