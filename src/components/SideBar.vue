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
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      color="grey lighten-4"
    >
      <v-list
        dense
        class="grey lighten-4"
      >
        <template align-center justify-center>
          <v-row justify="space-around">
            <v-avatar color="indigo">
              <v-icon dark>mdi-account-circle</v-icon>
            </v-avatar>
          </v-row>
          <v-layout justify-center mb5>
            <small>{{ username }}</small>
          </v-layout>
          <v-spacer></v-spacer>
          <v-layout justify-start>
            <v-list-item
              link
              to="/change_password"
            >
              <v-list-item-action>
                <v-icon>vpn_key</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title class="grey--text">
                  {{ $t('nav.change_password') }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-layout>
          <v-divider></v-divider>
        </template>
        <v-list dense>
          <template v-for="item in items">
            <v-row
              v-if="item.heading"
              :key="item.heading"
              align="center"
            >
              <v-col cols="6">
                <v-subheader v-if="item.heading">
                  {{ item.heading }}
                </v-subheader>
              </v-col>
              <v-col
                cols="6"
                class="text-center"
              >
                <a
                  href="#!"
                  class="body-2 black--text"
                >EDIT</a>
              </v-col>
            </v-row>
            <v-list-group
              v-else-if="item.children"
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
                :to="child.path"
              >
                <v-list-item-action v-if="child.icon">
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
      </v-list>
      <template v-slot:append>
        <div class="pb-10 pl-2 pr-2" >
          <v-btn
            dark
            block
            @click="logout()">
            <v-icon>power_settings_new</v-icon>
            <span class="ml-1">{{ $t('actions.logout') }}</span>
          </v-btn>
        </div>
      </template>
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
          { icon: 'apps', text: this.$t('nav.apps'), path: '/apps?website=1' },
          { icon: 'web', text: this.$t('nav.websites'), path: '/websites'},
          {
            icon: 'mdi-chevron-up',
            'icon-alt': 'mdi-chevron-down',
            text: this.$t('nav.website_view'),
            model: true,
            children: [
              { icon: 'description', text: this.$t('nav.articles'), path: '/articles'},
              { icon: 'new_releases', text: this.$t('nav.types'), path: '/types?website=1'},
              { icon: 'category', text: this.$t('nav.category'), path: '/category?website=1'},
              { icon: 'label', text: this.$t('nav.labels'), path: '/label?website=1'}
              ]
          }, {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          text: this.$t('nav.settings'),
          model: true,
          children: [
            { icon: 'format_list_numbered', text: this.$t('nav.leaderboard'), path: '/leaderboard'},
            { icon: 'star_outline', text: this.$t('nav.recommended'), path: '/recommended'},
            { icon: 'whatshot', text: this.$t('nav.popular_articles'), path: '/popular'}]
          }, {
          icon: 'mdi-chevron-up',
          'icon-alt': 'mdi-chevron-down',
          text: this.$t('nav.users'),
          model: true,
          children: [
            { icon: 'people', text: this.$t('nav.staff'), path: '/staff' }
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
