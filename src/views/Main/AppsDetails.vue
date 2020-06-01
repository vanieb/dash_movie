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
                x-small dense color="orange" v-model="apps.ratings">
              </v-rating>
            </v-layout>
          </v-col>
          <v-col cols="12" md="2">
            <v-row>
              <span class="title"
              >{{apps.name}}
              </span>
            </v-row>
            <v-row>
              <span
              >{{$t('apps.installer_size')}}: {{apps.size}}
              </span>
            </v-row>
            <v-row>
              <span
              >{{$t('apps.version')}}: {{apps.version}}
              </span>
            </v-row>
            <v-row>
              <span
              >{{$t('apps.release_date')}}: {{apps.release_date}}
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
              </v-card-text>
              <v-card-text >
                <v-icon>category</v-icon> {{$t('apps.category')}}:
                {{apps.category}}
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
            <v-card-text >
              <v-icon>web</v-icon> {{$t('nav.websites')}}:
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
          <v-card-text>{{$t('apps.download_link')}}</v-card-text>
        </v-flex>
        <v-flex>
          <v-card-title>{{$t('apps.basic_introduction')}}</v-card-title>
          <v-card-text v-html="apps.basic_introduction"></v-card-text>
        </v-flex>
        <v-flex>
          <v-card-title>{{$t('apps.introduction')}}</v-card-title>
          <v-card-text v-html="apps.introduction"></v-card-text>
        </v-flex>
        <v-flex>
          <v-card-title>{{$t('apps.features')}}</v-card-title>
          <v-card-text v-html="apps.features"></v-card-text>
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
  name: 'App Details',
  components: {
    SnackBar
  },
  data() {
    return {
      mode: 1,
      links: [],
      status: '',
      appsApi: api.apps,
      snackbar: {
        color: '',
        text: '',
        show: false,
      },
      bread_crumbs: [
        {
          text: this.$t('nav.apps'),
          disabled: false,
          to: '/apps'
        },
        {
          text: this.$t('nav.apps_detail'),
          disabled: true
        }],
      apps: {
        name: 'GCash',
        ratings: 5,
        size: '12MB',
        type: 2,
        release_date:'2020-03-27T18:42:02.046828+08:00',
        version: '0.10',
        icon: '${require(../assets/logo.svg)}',
        imageURI: '',
        download_link: 'test',
        category: '守卫主公是',
        status: 1,
        basic_introduction: '<ul><li>守卫主公是一款以三国为背景的策略手游，拥有多种策略塔防玩法，数百位英雄武将供玩家选择。守卫主公还有四大职业给玩家选择，并且四大职业相互克制，是一款非常烧脑的策略手游。</li><li>守卫主公是一款以三国为背景的策略手游，拥有多种策略塔防玩法，数百位英雄武将供玩家选择。守卫主公还有四大职业给玩家选择，并且四大职业相互克制，是一款非常烧脑的策略手游。</li></ul>',
        introduction: '<ul><li>守卫主公是一款以三国为背景的策略手游，拥有多种策略塔防玩法，数百位英雄武将供玩家选择。守卫主公还有四大职业给玩家选择，并且四大职业相互克制，是一款非常烧脑的策略手游。</li><li>守卫主公是一款以三国为背景的策略手游，拥有多种策略塔防玩法，数百位英雄武将供玩家选择。守卫主公还有四大职业给玩家选择，并且四大职业相互克制，是一款非常烧脑的策略手游。</li></ul>',
        features: '<ul><li>守卫主公是一款以三国为背景的策略手游，拥有多种策略塔防玩法，数百位英雄武将供玩家选择。守卫主公还有四大职业给玩家选择，并且四大职业相互克制，是一款非常烧脑的策略手游。</li><li>守卫主公是一款以三国为背景的策略手游，拥有多种策略塔防玩法，数百位英雄武将供玩家选择。守卫主公还有四大职业给玩家选择，并且四大职业相互克制，是一款非常烧脑的策略手游。</li></ul>'
      }
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
        console.log(response)
        this.apps.release_date = new Date(this.apps.release_date).toISOString().substr(0, 10)
      }, response => {
          if (('' + response.status).indexOf('4') === 0) {
              this.$router.push('/login?next=' + this.$route.path)
          }
      })
    },
    // validateLink(link) {
    //   var pattern = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)
    //   return pattern.test(link)
    // },
  }
}
</script>
