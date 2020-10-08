<template>
  <div wrap v-if="showNav">
    <v-app-bar
      app
      clipped-left
      color="blue lighten-3"
    >
      <v-flex sm2>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="title ml-3 mr-5">{{$t('title.title')}}&nbsp;
          <span class="font-weight-light">{{$t('title.subtitle')}}</span>
        </span>
      </v-flex>
      <v-flex lg3>
      <span class="subtitle mr-2">
        <v-icon>{{$route.meta.icon}}</v-icon>
      </span>
      {{$route.meta.title}}
      </v-flex>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on">mdi-chevron-down</v-icon>&nbsp;&nbsp;&nbsp;
          <span class="ml-2 mr-2">{{ username }}</span>
          <v-icon>mdi-account-circle</v-icon>&nbsp;&nbsp;
          <!-- <v-badge overlap color="red" :content="ongoing" class="mr-5" ><v-chip @click="goToBonusRequest()" light :disabled="ongoing=='0'">{{$t('nav.member_bonus_application')}}</v-chip></v-badge> -->
        </template>
        <v-list>
          <v-list-item link to="/change_password">
            <v-list-item-title >
              <v-icon class="mr-2" color="grey">vpn_key</v-icon>
              {{$t('nav.change_password')}}
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout()">
            <v-list-item-title>
              <v-icon class="mr-2" color="grey">power_settings_new</v-icon>
              {{$t('actions.logout')}}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      color="grey lighten-4"
    >
      <v-list dense>
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
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              link
              v-show="child.visible ? $root.permissions.includes(child.visible) : true"
              :to="child.path"
            >
              <v-row
                v-if="child.heading"
                :key="child.heading"
                align="center"
              >
                <v-col cols="6" style="padding: 5px 12px 0px 12px;">
                  <v-subheader v-if="child.heading">
                    {{ child.heading }}
                  </v-subheader>
                </v-col>
              </v-row>
              <v-list-item-action>
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="item.text"
            link
            :to="item.path"
          >
            <v-list-item-action v-if="child.icon">
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
  import api from '@/api/apis'
  export default {
    name: 'SideBar',
    props: {
      showNav: {
        default: true
      },
      username: {
        default: ''
      }
    },
    data() {
      return {
        drawer: null,
        items: [
          { icon: 'mdi-chevron-up',
            'icon-alt': 'mdi-chevron-down',
            text: this.$t('nav.apps_management'),
            children: [
              { icon: 'apps', text: this.$t('nav.apps'), path: '/apps?website=1'},
              { icon: 'settings', text: `${this.$t('nav.apps')} ${this.$t('nav.settings')}` , path: '/app_settings?website=1&types=1'},
              // app application
              { icon: 'new_releases', text: this.$t('nav.types'), path: '/types?website=1'},
              { icon: 'category', text: this.$t('nav.category'), path: '/category?website=1'},
              { icon: 'label', text: this.$t('nav.labels'), path: '/label?website=1'},
              { icon: 'format_list_numbered', text: this.$t('nav.leaderboard'), path: '/leaderboard'},
              { icon: 'star_outline', text: this.$t('nav.recommended'), path: '/recommended'}
            ]
          }, {
            icon: 'mdi-chevron-up',
            'icon-alt': 'mdi-chevron-down',
            text: this.$t('nav.article_management'),
            model: true,
            children: [
              { icon: 'description', text: this.$t('nav.articles'), path: '/articles'},
              { icon: 'link', text: this.$t('nav.keyword_link'), path: '/keyword_link'},
              { icon: 'whatshot', text: this.$t('nav.popular_articles'), path: '/popular'}
              ]
          }, {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          text: this.$t('nav.settings'),
          model: true,
          children: [
            { icon: 'compare_arrows', text: this.$t('nav.friendship_link'), path: '/friendship_link'},
            { icon: 'web', text: this.$t('nav.websites'), path: '/websites'}]
          }, {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          text: this.$t('nav.logs'),
          model: true,
          children: [
            { icon: 'list_alt', text: `${this.$t('nav.import_logs')} - ${this.$t('nav.articles')}`, path: '/import_article_logs' }
          ]}, {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          text: this.$t('nav.users'),
          model: true,
          children: [
            { icon: 'person', text: this.$t('nav.members'), path: '/members' },
            { icon: 'supervised_user_circle', text: this.$t('nav.staff'), path: '/staff', visible: 'list_staff'}
          ]
        }]
    }},
    methods: {
      logout() {
        this.$http.post(api.logout).then(() => {
          this.$router.push('/login')
          this.$cookie.delete('access_token')
          this.$cookie.delete('refresh_token')
          this.$cookie.delete('user_type')
          this.$cookie.delete('username')
        }, (error) => {
          this.loading = false
          this.errorMsg = error
        })
      }
    }
  }
</script>
