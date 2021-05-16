<template>
  <div wrap v-if="showNav">
    <v-app-bar app clipped-left color="blue-grey white--text">
      <v-flex sm2>
        <v-app-bar-nav-icon
          @click="drawer = !drawer"
          color="white"
        ></v-app-bar-nav-icon>
        <span class="title ml-3"
          >{{ $t("title.title") }}&nbsp;
          <span class="font-weight-light">{{ $t("title.subtitle") }}</span>
        </span>
      </v-flex>
      <v-flex lg3>
        <span class="subtitle mr-2 white--text">
          <v-icon color="white">{{ $route.meta.icon }}</v-icon>
        </span>
        {{ $route.meta.title }}
      </v-flex>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on" color="white">mdi-chevron-down</v-icon>
          <span class="ml-2 mr-2">{{ username }}</span>
          <v-icon color="white">mdi-account-circle</v-icon>
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
            color="blue-grey"
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
                color="blue-grey"
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
      drawer: null,
      timer: "",
      items: [
        {
          icon: "mdi-chevron-up",
          "icon-alt": "mdi-chevron-down",
          text: this.$t("nav.movie_management"),
          model: true,
          children: [
            {
              text: this.$t("nav.movies"),
              path: "/movies",
              icon: "videocam",
            },
            {
              text: this.$t("nav.artists"),
              path: "/artists",
              icon: "recent_actors",
            },
          ],
        },
        // {
        //   icon: "mdi-chevron-up",
        //   "icon-alt": "mdi-chevron-down",
        //   text: this.$t("nav.settings"),
        //   model: false,
        //   children: [
        //     {
        //       icon: "build",
        //       text: this.$t("nav.global_settings"),
        //       path: "/global_settings",
        //     },
        //   ],
        // },
        // {
        //   icon: "mdi-chevron-up",
        //   "icon-alt": "mdi-chevron-down",
        //   text: this.$t("nav.logs"),
        //   model: false,
        //   children: [
        //     {
        //       icon: "list_alt",
        //       text: `${this.$t("nav.import_logs")} - ${this.$t(
        //         "nav.movies"
        //       )}`,
        //       path: "/import_article_logs",
        //     },
        //   ],
        // },
        {
          icon: "mdi-chevron-up",
          "icon-alt": "mdi-chevron-down",
          text: this.$t("nav.users"),
          model: true,
          children: [
            {
              icon: "supervised_user_circle",
              text: this.$t("nav.staff"),
              path: "/staff",
            },
          ],
        },
      ],
    };
  },
  methods: {
    logout() {
      this.$http.delete(api.logout).then(
        () => {
          this.$router.push("/login");
          this.$cookie.delete("access_token");
          this.$cookie.delete("refresh_token");
          this.$cookie.delete("user_type");
          this.$cookie.delete("username");
          clearInterval(this.timer);
        },
        (error) => {
          this.loading = false;
          this.errorMsg = error;
        }
      );
    },
  },
};
</script>
