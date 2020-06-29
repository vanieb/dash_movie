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
            <v-img v-if="apps.icon"
              :src="`${apps.icon}`"
              class="my-1"
              contain
              height="100"
            />
            <v-avatar
              v-else
              class="profile ml-10"
              contain
              size="100"
              tile><v-icon size="120">photo</v-icon>
            </v-avatar>
            <v-layout justify-center mb5 v-if="!apps.icon">
              <small>{{$t('apps.icon')}}: {{$t('system_msg.not_set')}}</small>
            </v-layout>
            <v-layout justify-center mb5>
              <v-rating
                x-small dense color="orange" v-model="apps.star" disabled="true">
              </v-rating>
            </v-layout>
            <small><v-icon>event</v-icon> {{apps.created_at | moment("YYYY-MM-DD HH:mm:ss") }}
            </small>
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
              <v-chip
                v-if="apps.is_active"
                class="ma-1"
                color="green"
                text-color="white"
                style="height:20px; !important font-size:11px;">
                {{$t('status.enabled')}}
              </v-chip>
              <v-chip
                v-else
                class="ma-1"
                color="gray"
                style="height:20px;
                !important font-size:11px;">
                {{$t('status.disabled')}}
              </v-chip>
            </v-row>
            <v-row>
              <v-chip
                v-if="apps.is_rank"
                class="ma-1"
                color="red"
                text-color="white"
                style="height:20px; !important font-size:11px;">
                {{$t('nav.leaderboard')}}
              </v-chip>
              <v-chip
                v-if="apps.is_recommended"
                class="ma-1"
                color="red"
                text-color="white"
                style="height:20px; !important font-size:11px;">
                {{$t('nav.recommended')}}
              </v-chip>
            </v-row>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-text>
                <v-icon color="orange">web</v-icon> {{$t('nav.websites')}}:
                  <v-chip class="ma-1" color="orange" outlined v-if="apps.website">{{apps.website.name}}</v-chip>
                <span v-else> {{ $t('system_msg.no_data') }}</span>
                <br/>
                <v-icon color="red" >new_releases</v-icon> {{$t('apps.type')}}:
                <span v-if="apps.app_type">
                  <v-chip class="ma-1" color="red" outlined>{{ apps.app_type.name }}</v-chip>
                </span>
                <span v-else> {{ $t('system_msg.no_data') }}</span>
                <br/>
                <v-icon color="green">category</v-icon> {{$t('nav.category')}}:
                  <v-chip v-if="apps.category" class="ma-1" color="green" outlined >{{apps.category.name}}</v-chip>
                <span v-else> {{ $t('system_msg.no_data') }}</span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
             <v-card-text>
              <v-icon color="blue">label</v-icon> {{$t('nav.labels')}}:
              <span v-if="apps.labels">
                  <span v-for="label in apps.labels" :key="label.name">
                    <v-chip class="ma-1" color="blue" outlined>{{label.name}}</v-chip>
                  </span>
                </span>
                <span v-else> {{ $t('system_msg.no_data') }}</span>
              </v-card-text>
            </v-card>
          </v-col>          
        </v-row>
        <v-card-title>{{$t('apps.download_link')}}</v-card-title>
        <v-banner color="primary" dark>{{$t('apps.download_link')}}</v-banner>
        <v-flex>
          <!-- <v-card class="mb-5"> -->
            <v-card-text>
              <v-dialog v-model="uploadInstallerDialog" persistent max-width="350">
              <template v-slot:activator="{ on }">
                <v-btn
                  color="blue lighten-2"
                  dark
                  class="mr-3"
                  v-on="on">
                  <v-icon>android</v-icon>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <span v-on="on"> {{$t('actions.change_file')}}</span>
                    </template>
                    <span>{{$t('system_notes.upload_one_installer_memo')}}</span>
                  </v-tooltip>
                </v-btn>
              </template>
              <v-card :loading="uploadLoading">
                <validation-observer ref="uploadFileform">
                  <v-card-title>
                    <v-icon class="mr-3">android</v-icon>
                      &nbsp;{{$t('actions.change_file')}} - Android
                  </v-card-title>
                  <v-card-text>
                    <v-icon small>info</v-icon>&nbsp;&nbsp;
                    <small>{{ $t('system_notes.upload_one_installer_memo') }}</small>
                  </v-card-text>
                  <v-card-text>
                    <v-spacer></v-spacer>
                    <validation-provider style="width:310px;" rules="required" :name="$t('common.file')">
                      <v-file-input
                        outlined
                        dense
                        clearable
                        :error-messages="errors"
                        required
                        slot-scope="{ errors }"
                        v-model="file">    
                      </v-file-input>
                    </validation-provider>
                    <v-progress-linear
                      v-if="uploadLoading"
                      color="light-blue"
                      height="25"
                      v-model="uploadPercentage"
                      striped
                    >
                      <template v-slot="{ value }">
                        <strong>{{ Math.ceil(value) }}%</strong>
                      </template>
                    </v-progress-linear>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="grey lighten-1"
                      :disabled="uploadLoading"
                      @click="uploadInstallerDialog = false">{{ $t('actions.close') }}
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      :disabled="uploadLoading"
                      @click="uploadFile('apk')">{{ $t('actions.submit') }}
                    </v-btn>
                  </v-card-actions>
                </validation-observer>
              </v-card>
            </v-dialog>
            <span>{{ $t('apps.android_download_link')}}: {{ apps.app_file || $t('system_msg.no_data') }}</span>
          </v-card-text>
          <!-- <v-card-text>
            <v-dialog v-model="uploadiOSInstallerDialog" persistent max-width="350">
            <template v-slot:activator="{ on }">
               <v-btn
                  color="blue lighten-2"
                  dark
                  class="mr-3"
                  v-on="on">
                  <v-icon>phone_iphone</v-icon>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <span v-on="on"> {{$t('actions.change_file')}}</span>
                    </template>
                    <span>{{$t('system_notes.upload_one_installer_memo')}}</span>
                  </v-tooltip>
                </v-btn>
              </template>
            <v-card :loading="uploadLoading">
              <validation-observer ref="uploadFileform">
                <v-card-title>
                  <v-icon class="mr-3">phone_iphone</v-icon>
                    &nbsp;{{$t('actions.change_file')}} - iOS
                </v-card-title>
                <v-card-text>
                  <v-icon small>info</v-icon>&nbsp;&nbsp;
                  <small>{{ $t('system_notes.upload_one_installer_memo') }}</small>
                </v-card-text>
                <v-card-text>
                  <v-spacer></v-spacer>
                  <validation-provider style="width:310px;" rules="required" :name="$t('common.file')">
                    <v-file-input
                      outlined
                      dense
                      clearable
                      :error-messages="errors"
                      required
                      slot-scope="{ errors }"
                      v-model="file">    
                    </v-file-input>
                  </validation-provider>
                  <v-progress-linear
                    v-if="uploadLoading"
                    color="light-blue"
                    height="25"
                    v-model="uploadPercentage"
                    striped
                  >
                    <template v-slot="{ value }">
                      <strong>{{ Math.ceil(value) }}%</strong>
                    </template>
                  </v-progress-linear>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="grey lighten-1"
                    :disabled="uploadLoading"
                    @click="uploadiOSInstallerDialog = false">{{ $t('actions.close') }}
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    :disabled="uploadLoading"
                    @click="uploadFile('ios')">{{ $t('actions.submit') }}
                  </v-btn>
                </v-card-actions>
              </validation-observer>
            </v-card>
          </v-dialog> -->
            <!-- <v-icon>cloud_upload</v-icon>&nbsp;&nbsp; -->
            <!-- <span>{{ $t('apps.ios_download_link')}}: {{ apps.ios_file || $t('system_msg.no_data') }}</span>
             </v-card-text> -->
          <!-- </v-card> -->
        </v-flex>
        <v-banner color="primary" dark>{{$t('apps.external_download_link')}}</v-banner>
        <v-card-text>
         <span>{{ $t('apps.android_download_link')}}: {{ apps.download_link || $t('system_msg.no_data') }}</span><br/>
         <span>{{ $t('apps.ios_download_link')}}: {{ apps.ios_download_link || $t('system_msg.no_data') }}</span>
        </v-card-text>
         <v-banner color="primary" dark>{{$t('apps.seo_data')}}</v-banner>
         <v-flex>
          <v-card-title>{{$t('apps.keywords')}}</v-card-title>
          <v-card-text>{{ apps.keywords  || $t('system_msg.no_data')}}</v-card-text>
        </v-flex>
        <v-flex>
          <v-card-title>{{$t('apps.basic_introduction')}}</v-card-title>
          <v-card-text v-html="apps.basic_introduction  || $t('system_msg.no_data')"></v-card-text>
        </v-flex>
        <v-banner color="primary" dark>{{$t('apps.other_details')}}</v-banner>
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
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import axios from 'axios'

export default {
  name: 'AppDetails',
  components: {
    SnackBar,
    ValidationObserver,
    ValidationProvider
  },
  data() {
    return {
      file: '',
      apps: {},
      appsApi: api.apps,
      uploadPercentage: 0,
      uploadInstallerDialog: false,
      uploadiOSInstallerDialog: false,
      uploadLoading: false,
      snackbar: {
        color: '',
        text: '',
        show: false,
      },
      bread_crumbs: [{
          text: this.$t('nav.apps'),
          disabled: false,
          to: '/apps?website=1'
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
      })
    },
    async uploadFile(installerType) {
      this.snackbar.show = false
      const isValid = await this.$refs.uploadFileform.validate()
      if (isValid) {
        this.uploadLoading = true
        const formData = new window.FormData()
        if (installerType == 'apk') {
          formData.set('app_file', this.file)
        } else{
          formData.set('ios_app_file', this.file)
        }
        await axios.put(`${api.apps}${this.apps.id}/`,
          formData,
          { headers: {'Content-Type': 'multipart/form-data'},
          onUploadProgress: function( progressEvent ) {
            this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded / progressEvent.total ) * 100 ))
          }.bind(this)
        }).then(() => {
          this.getAppDetails(this.apps.id)
          this.snackbar = {
            color: 'success',
            show: true,
            text: `${this.$t('actions.change_file')}: ${this.$t('status.success')}`
          }
        }, error => {
          this.snackbar = {
            color: 'red',
            show: true,
            text: `${this.$t('system_msg.error')}: ${error}`
          }
          this.uploadLoading = false
          return
        }).catch(function(){
        })
      }
    }
  }
}
</script>
