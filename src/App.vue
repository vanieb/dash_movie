<template>
  <v-app id="app">
    <side-bar :show-nav="showNav"></side-bar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import SideBar from './components/SideBar';
import $ from './utils/util'
import api from '@/api/apis'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    SideBar
  },
  computed: {
    showNav() {
      return this.$route.name !== 'login'
    }
  },
  created() {
    this.getMy()
  },
  methods: {
    setUpRouterHooks() {
      this.$router.beforeEach((to, from, next) => {
        this.routerLoading = true
        this.authErrors = []
        next()
      })
      this.$router.afterEach(() => {
        this.routerLoading = false
      })
    },
    setUpAuth() {
      let refreshTokenInterval
      // refresh access token every 5 mins
      $.setIndicator(() => {
        refreshTokenInterval = window.setInterval(() => {
          this.refresh()
        }, 300000)
      }, () => {
        window.clearInterval(refreshTokenInterval)
      })
    },
    getMy() {
      if (!this.$cookie.get('access_token')) {
        this.$http.get(api.my).then(response => {
          if (response) {
            this.username = response.username
            window.document.cookie = `username=${this.username}`
            this.setUpAuth()
            this.setUpRouterHooks()
          }
        })
      }
    },
    refresh() {
      let refreshToken = this.$cookie.get('refresh_token')
      if (!refreshToken) {
        return
      }
      this.$http.post(api.refresh_token, {
        refresh_token: this.$cookie.get('refresh_token')
      }).then(data => {
        let d = new Date(data.expires_in)
        // use access_token to access APIs
        window.document.cookie = 'access_token=' + data.access_token + ';path=/;expires=' + d.toGMTString()
        // use refresh_token to fetch new access_token
        window.document.cookie = 'refresh_token=' + data.refresh_token + ';path=/;expires=' + d.toGMTString()
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token
      })
    }
  }
};
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none
}
</style>
