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
              :src="`${apps.icon}`"
              class="my-1"
              contain
              height="100"
            />
            <v-layout justify-center mb5>
              <v-rating
                x-small dense color="orange" v-model="apps.star">
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
            <!-- <v-row>
              <span
              >{{$t('apps.release_date')}}: {{apps.created_at | moment("YYYY-MM-DD HH:mm:ss") }}
              </span>
            </v-row> -->
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
              <v-card-text px-0>
                <v-icon>new_releases</v-icon> {{$t('apps.type')}}:
                <span v-if="apps.types">
                  <span v-for="type in apps.types" :key="type.name">
                    <v-chip class="ma-1" color="red" outlined>{{type.name}}</v-chip>
                  </span>
                </span>
                <span v-else> {{ $t('system_msg.no_data') }}</span>
              </v-card-text>
              <v-card-text >
                <v-icon>web</v-icon> {{$t('nav.websites')}}:
                <span v-if="apps.websites">
                  <span v-for="website in apps.websites" :key="website.id">
                    <v-chip class="ma-1" color="orange" outlined>{{website.name}}</v-chip>
                  </span>
                </span>
                <span v-else> {{ $t('system_msg.no_data') }}</span>
             </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-text >
                <v-icon>category</v-icon> {{$t('nav.category')}}:
                <span v-if="apps.categories">
                  <span v-for="category in apps.categories" :key="category.name">
                    <v-chip class="ma-1" color="green" outlined>{{category.name}}</v-chip>
                  </span>
                </span>
                <span v-else> {{ $t('system_msg.no_data') }}</span>
              </v-card-text>
             <v-card-text >
              <v-icon>label</v-icon> {{$t('nav.labels')}}:
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
        <v-flex>
          <v-card class="mb-5">
            <v-card-text>
            <v-dialog v-model="uploadInstallerDialog" persistent max-width="350">
            <template v-slot:activator="{ on }">
               <v-btn
                  color="primary"
                  dark
                  class="mr-3"
                  v-on="on">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <span v-on="on"> {{$t('actions.change_file')}}</span>
                    </template>
                    <span>{{$t('system_notes.upload_one_installer_memo')}}</span>
                  </v-tooltip>
                </v-btn>
              </template>
            <v-card>
              <validation-observer ref="uploadFileform">
                <v-card-title>
                  <!-- <v-icon class="mr-3">cloud_upload</v-icon> -->
                    &nbsp;{{$t('actions.change_file')}}
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
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="grey lighten-1"
                    @click="uploadInstallerDialog = false">{{ $t('actions.close') }}
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    :loading="uploadLoading"
                    @click="uploadFile()">{{ $t('actions.submit') }}
                  </v-btn>
                </v-card-actions>
              </validation-observer>
            </v-card>
          </v-dialog>
            <!-- <v-icon>cloud_upload</v-icon>&nbsp;&nbsp; -->
            <span>{{ $t('apps.download_link')}}: {{ apps.download_link || $t('system_msg.no_data') }}</span>
             </v-card-text>
          </v-card>
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
import { ValidationObserver, ValidationProvider } from 'vee-validate'

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
      uploadInstallerDialog: false,
      uploadLoading: false,
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
      })
    },
    async uploadFile() {
      const isValid = await this.$refs.uploadFileform.validate()
      if (isValid) {
        this.uploadLoading = true
        const formData = new window.FormData()
        formData.set('app_file', this.file)
        this.$http.put(`${api.apps}${this.apps.id}/`, formData).then(() => {
          this.snackbar = {
            color: 'success',
            show: true,
            text: `${this.$t('actions.change_file')}: ${this.$t('status.success')}`
          }
          this.uploadLoading = false
          this.uploadInstallerDialog = false
        })
      }
    }
  }
}
</script>
