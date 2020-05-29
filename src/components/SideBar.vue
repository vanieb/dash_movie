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
      <v-spacer></v-spacer>
      </template>
        <template v-for="(item, i) in items">
          <v-row
            v-if="item.heading"
            :key="i"
            align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
          </v-row>
          <v-divider
            v-else-if="item.divider"
            :key="i"
            dark
            class="my-4"
          ></v-divider>
          <v-list-item
            v-else
            :key="i"
            link
            :to="item.path"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
      <v-divider></v-divider>
      <v-layout align-end justify-center>
      <v-list-item
            @click="logout()"
          >
            <v-list-item-action>
              <v-icon>power_settings_new</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">
                {{ $t('actions.logout') }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          </v-layout>
    </v-navigation-drawer>
  </div>
</template>

<script>
  import VueCookie from 'vue-cookie'
  import api from '@/api/apis'
  export default {
    name: 'SideBar',
    props: {
      showNav: {
        default: true
      }
    },
    data() {
      return {
        drawer: null,
        items: [
          { icon: 'apps', text: 'Apps' },
          { icon: 'web', text: 'Websites' },
          { heading: 'Users' },
          { icon: 'people', text: this.$t('nav.staff'), path: '/staff' },
          { heading: 'Settings' },
          { icon: 'label', text: 'Labels' },
          { icon: 'settings', text: 'Settings' }
        ]
    }},
    computed: {
      username() {
        return VueCookie.get('username')
      }
    },
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

