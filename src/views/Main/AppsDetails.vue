<template>
  <v-layout wrap>
    <v-container>
      <v-layout>
        <v-layout justify-start>
          <v-breadcrumbs :items="bread_crumbs" style="padding:12px;">
            <template v-slot:divider>
              <v-icon>mdi-chevron-right</v-icon>
            </template>
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item
                exact
                :to="item.to"
                :disabled="item.disabled"
              >
                {{ item.text }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
      </v-layout>
      <v-layout justify-end>
          <v-btn
            color="primary"
            dark
            :to="`/apps/${apps.id}/edit`"
            >
            <v-icon class="mr-3">edit</v-icon> &nbsp;{{ $t('actions.update') }}
          </v-btn>
        </v-layout>
      </v-layout>
      <v-card>
      <v-container>
        <v-row class="ml-3">
          <span class="title"
          >{{apps.name}}
          </span>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
            <v-img
              :src="require('../../assets/logo.svg')"
              class="my-1"
              contain
              height="100"
            />
            <v-layout justify-center mb5>
              <v-rating
                x-small dense color="orange" v-model="apps.star">
              </v-rating>
            </v-layout>
          </v-col>
          <v-col cols="12" md="2">
            <v-row>
              <span
              >{{$t('apps.installer_size')}}: {{apps.size_mb}} MB
              </span>
            </v-row>
            <v-row>
              <span
              >{{$t('apps.version')}}: {{apps.version || $t('system_msg.no_data')}}
              </span>
            </v-row>
            <v-row>
              <span
              >{{$t('apps.release_date')}}: {{apps.release_at  || $t('system_msg.no_data')}}
              </span>
            </v-row>
            <v-row>
              <span
              >{{$t('common.status')}}: {{apps.status}}
              </span>
            </v-row>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-text px-0>
                <v-icon>new_releases</v-icon> {{$t('apps.type')}}:
                <span  v-if="apps.type==1">
                <v-icon color="orange">sports_esports</v-icon> {{$t('apps.games')}}</span>
                <span  v-if="apps.type==2">
                <v-icon color="green">android</v-icon> {{$t('apps.software')}}</span>
                <span  v-if="apps.type==3">
                <v-icon color="red">whatshot</v-icon> {{$t('apps.hot')}}</span>
                <span v-else> {{ $t('system_msg.no_data') }}</span>
              </v-card-text>
              <v-card-text >
                <v-icon>web</v-icon> {{$t('nav.websites')}}:
             </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-text >
                <v-icon>category</v-icon> {{$t('nav.category')}}:
                {{apps.category}}
              </v-card-text>
             <v-card-text >
              <v-icon>label</v-icon> {{$t('nav.labels')}}:
            </v-card-text>
            </v-card>
          </v-col>          
        </v-row>
        <v-flex>
          <v-card-title> {{$t('apps.download_link')}}
            <v-icon color="blue" justify-end>file_copy</v-icon>
          </v-card-title>
          <v-card-text>{{ apps.download_link || $t('system_msg.no_data') }}</v-card-text>
        </v-flex>
        <v-flex>
          <v-card-title>{{$t('apps.basic_introduction')}}</v-card-title>
          <v-card-text v-html="apps.basic_introduction  || $t('system_msg.no_data')"></v-card-text>
        </v-flex>
        <v-flex>
          <v-card-title>{{$t('apps.introduction')}}</v-card-title>
          <v-card-text v-html="apps.introduction  || $t('system_msg.no_data')"></v-card-text>
        </v-flex>
        <v-flex>
          <v-card-title>{{$t('apps.features')}}</v-card-title>
          <v-card-text v-html="apps.features  || $t('system_msg.no_data')"></v-card-text>
        </v-flex>
        </v-container>
      </v-card>
      <!-- SNACKBAR -->
      <snack-bar
        :show="snackbar.show"
        :color="snackbar.color"
        :text="snackbar.text" 
      >
      </snack-bar>
    </v-container>
  </v-layout>    
</template>
<script>
import api from '@/api/apis'
import SnackBar from '@/components/SnackBar'
// import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
  name: 'AppDetails',
  components: {
    SnackBar
  },
  data() {
    return {
      mode: 1,
      links: [],
      status: '',
      apps: {},
      appsApi: api.apps,
      downloadLinkApi: api.download_link,
      snackbar: {
        color: '',
        text: '',
        show: false,
      },
      bread_crumbs: [{
          text: this.$t('nav.apps'),
          disabled: false,
          to: '/apps'
        },
        {
          text: this.$t('nav.apps_detail'),
          disabled: true
        }
      ]
    }
  },
  beforeRouteEnter (to, from, next) {
      next(vm => {
          let id = to.params.appsId
          vm.getAppDetails(id)
      })
  },
  methods: {
    getAppDetails(id) {
      this.$http.get(`${this.appsApi}${id }/`).then((response) => {
        this.apps = response
        this.apps.release_date = new Date(this.apps.created_at).toISOString().substr(0, 10)
      }, response => {
          if (('' + response.status).indexOf('4') === 0) {
              this.$router.push('/login?next=' + this.$route.path)
          }
      })
    }
    // validateLink(link) {
    //   var pattern = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)
    //   return pattern.test(link)
    // },
  }
}
</script>
