<template>
  <div wrap v-if="showNav">
    <v-app-bar app clipped-left color="blue lighten-3">
      <v-flex sm2>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="title ml-3 mr-5"
          >{{ $t("title.title") }}&nbsp;
          <span class="font-weight-light">{{ $t("title.subtitle") }}</span>
        </span>
      </v-flex>
      <v-flex lg3>
        <span class="subtitle mr-2">
          <v-icon>{{ $route.meta.icon }}</v-icon>
        </span>
        {{ $route.meta.title }}
      </v-flex>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on">mdi-chevron-down</v-icon>
          <span class="ml-2 mr-2">{{ username }}</span>
          <v-icon>mdi-account-circle</v-icon>
          <v-badge
            overlap
            color="error"
            :content="article_review_count"
            v-show="article_review_count > 0"
            class="mr-5"
            blink
            ><v-chip
              @click="redirect('articles')"
              light
              :disabled="article_review_count == '0'"
              >{{ $t("nav.articles_review") }}</v-chip
            ></v-badge
          >
          <v-badge
            overlap
            v-show="app_review_count > 0"
            color="error"
            :content="app_review_count"
            class="mr-5"
            blink
            ><v-chip
              @click="redirect('apps')"
              light
              :disabled="app_review_count == '0'"
              >{{ $t("nav.apps_review") }}</v-chip
            ></v-badge
          >
        </template>
        <v-list>
          <v-list-item link to="/change_password">
            <v-list-item-title>
              <v-icon left color="grey">vpn_key</v-icon>
              {{ $t("nav.change_password") }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout()">
            <v-list-item-title>
              <v-icon left color="grey">power_settings_new</v-icon>
              {{ $t("actions.logout") }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app clipped color="grey lighten-4">
      <v-list dense>
        <!-- Main: Level 1 -->
        <template v-for="item in items">
          <v-list-group
            v-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <!-- Level 2 -->
            <template v-for="(subItem, j) in item.children">
              <v-list-item
                v-if="!subItem.submenu"
                class="ml-3"
                :key="`subheader-${j}`"
                v-show="
                  subItem.visible
                    ? $root.permissions.includes(subItem.visible)
                    : true
                "
                :to="subItem.path"
              >
                <v-list-item-icon class="mr-4">
                  <v-icon v-text="subItem.icon" />
                </v-list-item-icon>
                <v-list-item-title class="ml-0">
                  {{ subItem.text }}
                </v-list-item-title>
              </v-list-item>
              <v-list-group
                v-else
                class="ml-1"
                :key="`submenu-${j}`"
                sub-group
                prepend-icon="mdi-chevron-down"
                :append-icon="subItem.icon"
              >
                <template #activator>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ subItem.text }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
                <template v-for="(subSubItem, k) in subItem.submenu">
                  <v-list-item
                    :key="`subheader-${k}`"
                    color="indigo"
                    class="ml-5"
                    :value="true"
                    :to="subSubItem.path"
                  >
                    <v-list-item-icon>
                      <v-icon>{{ subSubItem.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{ subSubItem.text }}</v-list-item-title>
                  </v-list-item>
                </template>
              </v-list-group>
            </template>
          </v-list-group>
          <v-list-item v-else :key="item.text" link :to="item.path">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
import api from "@/api/apis";
export default {
  name: "SideBar",
  props: {
    showNav: {
      default: true,
    },
    username: {
      default: "",
    },
  },
  data() {
    return {
      app_review_count: 0,
      article_review_count: 0,
      drawer: null,
      timer: "",
      items: [
        {
          icon: "mdi-chevron-up",
          "icon-alt": "mdi-chevron-down",
          model: false,
          text: this.$t("nav.apps_management"),
          children: [
            {
              icon: "apps",
              text: this.$t("nav.apps"),
              path: "/apps?website=1",
              submenu: [
                {
                  text: this.$t("nav.apps_review"),
                  path: "/apps_review",
                  icon: "visibility",
                },
                {
                  text: this.$t("nav.apps_draft"),
                  path: "/apps_draft",
                  icon: "edit",
                },
                {
                  text: this.$t("nav.apps_published"),
                  path: "/apps_published",
                  icon: "publish",
                },
                {
                  text: this.$t("nav.apps"),
                  path: "/apps",
                  icon: "apps",
                },
              ],
            },
            {
              icon: "settings",
              text: `${this.$t("nav.apps")} ${this.$t("nav.settings")}`,
              path: "/app_settings?website=1&types=1",
            },
            // app application
            {
              icon: "new_releases",
              text: this.$t("nav.types"),
              path: "/types?website=1",
            },
            {
              icon: "category",
              text: this.$t("nav.category"),
              path: "/category?website=1",
            },
            {
              icon: "label",
              text: this.$t("nav.labels"),
              path: "/label?website=1",
            },
            {
              icon: "format_list_numbered",
              text: this.$t("nav.leaderboard"),
              path: "/leaderboard",
            },
            {
              icon: "star_outline",
              text: this.$t("nav.recommended"),
              path: "/recommended",
            },
          ],
        },
        {
          icon: "mdi-chevron-up",
          "icon-alt": "mdi-chevron-down",
          text: this.$t("nav.article_management"),
          model: false,
          children: [
            {
              icon: "description",
              text: this.$t("nav.articles"),
              submenu: [
                {
                  text: this.$t("nav.articles_review"),
                  path: "/articles_review",
                  icon: "visibility",
                },
                {
                  text: this.$t("nav.articles_draft"),
                  path: "/articles_draft",
                  icon: "edit",
                },
                {
                  text: this.$t("nav.articles_published"),
                  path: "/articles_published",
                  icon: "publish",
                },
                {
                  text: this.$t("nav.articles"),
                  path: "/articles",
                  icon: "description",
                },
              ],
            },
            {
              icon: "link",
              text: this.$t("nav.keyword_link"),
              path: "/keyword_link",
            },
            {
              icon: "whatshot",
              text: this.$t("nav.popular_articles"),
              path: "/popular",
            },
          ],
        },
        {
          icon: "mdi-chevron-up",
          "icon-alt": "mdi-chevron-down",
          text: this.$t("nav.settings"),
          model: false,
          children: [
            {
              icon: "build",
              text: this.$t("nav.global_settings"),
              path: "/global_settings",
            },
            {
              icon: "compare_arrows",
              text: this.$t("nav.friendship_link"),
              path: "/friendship_link",
            },
            { icon: "web", text: this.$t("nav.websites"), path: "/websites" },
          ],
        },
        {
          icon: "mdi-chevron-up",
          "icon-alt": "mdi-chevron-down",
          text: this.$t("nav.logs"),
          model: false,
          children: [
            {
              icon: "list_alt",
              text: `${this.$t("nav.import_logs")} - ${this.$t(
                "nav.articles"
              )}`,
              path: "/import_article_logs",
            },
          ],
        },
        {
          icon: "mdi-chevron-up",
          "icon-alt": "mdi-chevron-down",
          text: this.$t("nav.users"),
          model: false,
          children: [
            {
              icon: "person",
              text: this.$t("nav.members"),
              path: "/members",
              visible: "list_member",
            },
            {
              icon: "supervised_user_circle",
              text: this.$t("nav.staff"),
              path: "/staff",
              visible: "list_staff",
            },
          ],
        },
      ],
    };
  },
  created() {
    this.getCount();
    this.timer = setInterval(this.getCount, 10000);
  },
  watch: {
    app_review_count(newObj) {
      this.app_review_count = newObj
    },
    article_review_count(newObj) {
      this.article_review_count = newObj
    }
   },
  methods: {
    logout() {
      this.$http.post(api.logout).then(
        () => {
          this.$router.push("/login");
          this.$cookie.delete("access_token");
          this.$cookie.delete("refresh_token");
          this.$cookie.delete("user_type");
          this.$cookie.delete("username");
          clearInterval(this.timer)
        },
        (error) => {
          this.loading = false;
          this.errorMsg = error;
        }
      );
    },
    redirect(page) {
      this.$router.push(`${page}_review?website=1`);
    },
    getCount() {
      this.$http.get(api.count).then(
        (response) => {
          this.app_review_count = response.app_review_count;
          this.article_review_count = response.article_review_count;
        },
        (error) => {
          this.loading = false;
          this.errorMsg = error;
          clearInterval(this.timer)
        }
      );
    },
  },
};
</script>
