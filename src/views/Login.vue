<template>
  <v-layout justify-center row pt-5 mt-5>
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="blue lighten-2"
                dark
                flat
              >
                <v-toolbar-title>{{ $t('login.login') }}</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    :label="`${this.$t('nav.login')}`"
                    name="login"
                    prepend-icon="person"
                    type="text"
                    :rules="[rules.required]"
                    v-model="user.username"
                  ></v-text-field>

                  <v-text-field
                    v-model="user.password"
                    id="password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    :label="`${this.$t('login.password')}`"
                    name="password"
                    prepend-icon="lock"
                    :rules="[rules.required]"
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue lighten-2" @click="login">{{ $t('nav.login') }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <!-- SNACKBAR -->
    <snack-bar
      :show="snackbar.show"
      :color="snackbar.color"
      :text="snackbar.text" 
    >
    </snack-bar>
  </v-layout>
</template>
<script>
import api from '@/api/apis'
import qs from 'qs'
import axios from 'axios'
import SnackBar from '@/components/SnackBar'
export default {
  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      showPassword: false,
      snackbar: {
        color: '',
        text: '',
        show: false
      },
      rules: {
        required: value => !!value || this.$t('errors.required')
      }
    }
  },
  methods: {
    login() {
      this.$http.post(api.login, qs.stringify(this.user)).then(data => {
        let d = new Date(data.expires_in)
        if (data.access_token) {
          window.document.cookie = 'access_token=' + data.access_token + ';path=/;expires=' + d.toGMTString()
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token
        }
        if (data.refresh_token) {
          window.document.cookie = 'refresh_token=' + data.refresh_token + ';path=/;expires=' + d.toGMTString()
        }
        if (data.type) {
          window.document.cookie = 'user_type=' + data.type
        }
        this.$root.getMy()
        let url = this.$route.query.next
        url = url ? decodeURIComponent(url.split('?')[0]) : '/'
        this.$router.push(url)
      }, error => {
        this.snackbar = {
          color: 'red',
          show: true,
          text: error
        }
      })
    }
  },
  components: {
    SnackBar
  }
}
</script>