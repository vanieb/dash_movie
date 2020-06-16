<template>
  <v-layout wrap>
    <v-container>
      <v-layout>
        <div d-inline-block>
          <!-- <v-layout justify-start>
            <v-btn
              color="primary"
              dark to="/apps/add">
              <v-icon class="mr-3">library_add</v-icon> &nbsp;{{ $t('actions.add') }}
            </v-btn>
          </v-layout>  -->
        </div>
        <v-layout justify-end>
          <!-- Installer Upload -->
          <v-dialog v-model="uploadInstallerDialog" persistent max-width="600">
            <template v-slot:activator="{ on }">
               <v-btn
                  color="primary"
                  dark
                  class="mr-3"
                  v-on="on">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">cloud_upload</v-icon>
                    </template>
                    <span>{{$t('system_notes.upload_installer_memo')}}</span>
                  </v-tooltip>
                </v-btn>
              </template>
            <v-card>
              <validation-observer ref="form">
                <v-card-title>
                  <v-icon class="mr-3">cloud_upload</v-icon>
                    &nbsp;{{ $t('actions.upload') }}
                </v-card-title>
                <v-card-text>
                  <v-icon small>info</v-icon>&nbsp;&nbsp;
                  <small>{{ $t('system_notes.upload_installer_memo') }}</small>
                </v-card-text>
                <v-card-text>
                  <website
                    type="set"
                    :mode="'multiple'"
                    :website="setWebsite"
                    req="true"
                    @website-select-multiple="websiteSetMultiple">
                  </website>
                  <v-spacer></v-spacer>
                  <validation-provider style="width:310px;" rules="required" :name="$t('common.file')">
                    <v-file-input
                      outlined
                      dense
                      clearable
                      :error-messages="errors"
                      :label="`${$t('common.file')}*`"
                      placeholder=" "
                      slot-scope="{ errors }"
                      required
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
                    @click="close()"
                    :disabled="uploadLoading">{{ $t('actions.close') }}
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    :loading="uploadLoading"
                    @click="uploadFile('upload')">{{ $t('actions.submit') }}
                  </v-btn>
                </v-card-actions>
              </validation-observer>
            </v-card>
          </v-dialog>
          <!-- Create Multiple Apps -->
          <v-dialog v-model="createAppDialog" persistent max-width="350">
            <template v-slot:activator="{ on }">

              <v-btn
                color="primary"
                dark 
                
                class="mr-3"
                v-on="on">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                  <v-icon v-on="on">dynamic_feed</v-icon>

                  </template>
                  <span>{{$t('system_notes.add_multiple_apps_memo')}}</span>
                </v-tooltip>
              </v-btn>
            </template>
            <v-card>
              <validation-observer ref="importForm">
                <v-card-title>
                  <v-icon class="mr-3">dynamic_feed</v-icon>
                    &nbsp;{{ $t('actions.create_multiple') }}
                </v-card-title>
                <v-card-text>
                  <v-icon small>info</v-icon>
                  <small>{{ $t('system_notes.add_multiple_apps_memo') }}</small>
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
                      accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      v-model="importFile">    
                    </v-file-input>
                  </validation-provider>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="grey lighten-1"
                    @click="closeImport()">{{ $t('actions.close') }}
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    :loading="importLoading"
                    @click="importCsv()">{{ $t('actions.submit') }}
                  </v-btn>
                </v-card-actions>
              </validation-observer>
            </v-card>
          </v-dialog>
          <!-- Export Apps -->
          <v-btn
            color="primary"
            :href="href"
            v-if="querySet.length"
            :getReport="getReport"
            dark>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">cloud_download</v-icon>
              </template>
              <span>{{$t('system_notes.add_multiple_apps_memo')}}</span>
            </v-tooltip>
          </v-btn>
        </v-layout>
      </v-layout>
      <v-card>
        <v-col cols="12" md="12" class="mt-2" style="padding: 20px 20px 10px 20px !important;">
          <v-row>
            <div style="width:200px;" class="mr-2">
              <v-select
                item-name="text"
                item-value="value"
                :items="statusOptions"
                :label="`${$t('common.status')}`"
                v-model="is_active"
                hide-details="true"
                placeholder=" "
                outlined
                dense>
                <template slot="selection" slot-scope="data">
                  <span class="ml-3">{{ data.item.text }}</span>
                </template>
                <template slot="item" slot-scope="data">
                  <span class="ml-3">{{ data.item.text }}</span>
                </template>
              </v-select>
            </div>
            <div style="width:200px !important;" class="mr-2">
              <website
                type="filter"
                :mode="'one'"
                :website="query.website"
                @website-select-one="websiteSelectOne">
              </website>
            </div>
            <div style="width:200px;" class="mr-2">
              <v-text-field
                @input="search"
                :label="`${$t('common.name')}`"
                v-model="query.name"
                hide-details="true"
                placeholder=" "
                outlined
                dense>
              </v-text-field>
            </div>
            <div style="width:300px;" class="mr-2">
              <v-menu
                ref="menu1"
                v-model="date_menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="450px"
                >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="dateRangeText"
                    :label="`${$t('common.created_at')}`"
                    placeholder=" "
                    outlined
                    dense
                    v-on="on"
                    readonly
                    hide-details="true"
                    clearable
                    @click:clear="clearDateRange()"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="created_at"
                  :locale="lang"
                  :selected-items-text="dateRangeText"
                  range
                  landscape
                  smaller
                  >
                </v-date-picker>
              </v-menu>
            </div>
            <v-layout class="justify-end">
              <v-btn
                color="blue"
                :loading="loading"
                @click="clearAll"
              >
                <v-icon>clear_all</v-icon>{{ $t('actions.clear') }}
              </v-btn>
            </v-layout>
          </v-row>
        </v-col>
      </v-card>
      <v-spacer></v-spacer>
      <v-data-table
        :headers="headers"
        :hide-default-footer="true"
        :items="querySet"
      >
      <template v-slot:body="{ items }">
        <span v-if="!items">{{items}}</span>
        <tbody>
          <tr v-for="item in querySet" :key="item.id">
            <td width="5%">
              <v-btn class="mr-2" icon color="info" :to="`/apps/${item.id}`">
                <v-icon>touch_app</v-icon>
              </v-btn>
            </td>
            <td class="align-center" width="20%">{{ item.name }}</td>
            <td class="align-center justify-center" width="50%" >
              <span>{{item.website ? item.website.name : '-' }}<br/></span>
            </td>
            <td class="align-center justify-start">
              <v-switch value v-model="item.is_active"
                @change="toggle(item.id, item.is_active, 'is_active')">
              </v-switch>
            </td>
            <td class="align-center justify-start">
              <v-switch value v-model="item.is_rank"
                @change="toggle(item.id, item.is_rank, 'is_rank')">
              </v-switch>
            </td>
            <td class="align-center justify-start">
              <v-switch value v-model="item.is_recommended"
                @change="toggle(item.id, item.is_recommended, 'is_recommended' )">
              </v-switch>
            </td>
            <td width="50%">{{ item.created_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
            <td class="align-center justify-center">
              <v-btn class="mr-2" icon :to="`/apps/${item.id}/edit`">
                <v-icon>edit</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
        </template>
      </v-data-table>
    </v-container>
    <pagination
      :queryset="querySet"
      :api="appsApi"
      :query="query"
      ref="pulling"
      @query-data="queryData"
      @query-param="queryParam"
    >
    </pagination>
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
import $ from '../../utils/util'
import Pagination from '@/components/Pagination'
import SnackBar from '@/components/SnackBar'
import { debounce } from 'lodash'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import Website from '../../components/SelectWebsite.vue'
import axios from 'axios'
import VueCookie from 'vue-cookie'

export default {
  name: 'Apps',
  components: {
    Pagination,
    SnackBar,
    ValidationObserver,
    ValidationProvider,
    Website
  },
  data() {
    return {
      name: '',
      href: '',
      uploadPercentage: 0,
      showForm: false,
      query: {
        website: 1
      },
      querySet: [],
      export_query: [],
      is_active: '',
      created_at: ['', ''],
      website: 1,
      appsApi: api.apps,
      exportApi: `${api.apps}export/`,
      importApi: `${api.apps}import/`,
      loading: true,
      uploadLoading: false,
      importLoading: false,
      uploadInstallerDialog: false,
      createAppDialog: false,
      submitting: false,
      date_menu: false,
      file: null,
      importFile: null,
      setWebsite: '',
      statusOptions: [
        { text: this.$t('status.enabled'),
          value: true},
        { text: this.$t('status.disabled'),
          value: false}],
      snackbar: {
        color: '',
        text: '',
        show: false,
      },
      headers: [
        {
          sortable: false,
          text: '',
          value: ''
        },
        {
          sortable: false,
          text: this.$t('common.name'),
          value: 'name'
        },
        {
          sortable: false,
          text: this.$t('nav.websites'),
          value: 'website'
        },
        {
          sortable: false,
          text: this.$t('common.status'),
          value: 'status',
          width: '10%'
        },
        {
          sortable: false,
          text: this.$t('nav.leaderboard'),
          value: 'is_rank',
          width: '10%'
        },
        {
          sortable: false,
          text: this.$t('nav.recommended'),
          value: 'is_recommended',
          width: '10%'
        },
        {
          sortable: false,
          text: this.$t('common.created_at'),
          value: 'created_at'
        },
        {
          sortable: false,
          text: this.$t('common.action')
        }
      ]
    }
  },
  watch: {
    '$route': {
      handler() {
        this.loading = true
        this.setQueryAll()
        this.$refs.pulling.rebase()
      },
      deep: true
    },
    is_active(newObj) {
      this.query.is_active = newObj
      this.$refs.pulling.submit()
    },
    website(newObj) {
      this.query.website = newObj
      this.search()
    },
    created_at(newObj) {
      [this.query.created_at_after, this.query.created_at_before] = [...newObj]
      this.search()
    },
    
  },
  created() {
    this.setQueryAll()
    this.$nextTick(() => {
      this.$refs.pulling.rebase()
      this.query.website = 1
      this.submit()
    })
    this.lang = $.getLanguage() == 'zh_CN' ? 'zh-cn' : ''
  },
  computed: {
    isQueryEmpty() {
      return $.compareQuery(this.query, {})
    },
    dateRangeText () {
      if (this.query.created_at_after || this.query.created_at_before ) {
        return this.created_at.join(' ~ ')
      } else {
        return ''
      }
    },
    getReport() {
      // this.$refs.pulling.getExportQuery()
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.href = `${this.exportApi}?token=${VueCookie.get('access_token')}&website=${this.query.website}`
      return this.querySet.length
    }
  },
  methods: {
    setQueryAll() {
      if (this.$route.query.created_at_after || this.$route.query.created_at_before) {
        this.created_at = [this.$route.query.created_at_after, this.$route.query.created_at_before]
      } else {
        this.created_at = [undefined, undefined]
      }
      this.website = this.$route.query.website || ''
      this.is_active = this.$route.query.is_active==true || this.$route.query.is_active==false ? this.$route.query.is_active : ''
      this.query = Object.assign({}, this.$route.query)
    },
    queryData(queryset) {
      this.loading = false
      this.querySet = queryset
    },
    queryParam(query) {
      this.query = Object.assign(this.query, query)
    },
    // exportQuery(expor) {
    //   this.export_query = expor
    // },
    async uploadFile(mode) {
      const isValid = await this.$refs.form.validate()
      if (isValid) {
        if (mode == 'upload') {
          this.uploadLoading = true
          const formData = new window.FormData()
          formData.set('app_file', this.file)
          formData.set('website', this.setWebsite)
          await axios.post(api.upload, 
            formData, 
            { headers: {'Content-Type': 'multipart/form-data'},
            onUploadProgress: function( progressEvent ) {
              this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded / progressEvent.total ) * 100 ))
            }.bind(this)
          }).then(() => {
            this.$refs.pulling.rebase()
            this.close()
            this.snackbar = {
              color: 'success',
              show: true,
              text: `${this.$t('actions.upload')}: ${this.$t('status.success')}`
            }
          }).catch(function(){
            
          })
        // insert api
        }
      }
    },
    async importCsv() {
      const isValid = await this.$refs.importForm.validate()
      if (isValid) {
        this.importLoading = true
        const formData = new window.FormData()
        formData.set('import_file', this.importFile)
        this.$http.post(`${this.importApi}?import_type=app_details`, formData).then(() => {
          this.$refs.pulling.rebase()
          this.snackbar = {
            color: 'success',
            show: true,
            text: `${this.$t('actions.create_multiple')}: ${this.$t('status.success')}`
          }
          this.closeImport()
        }, error => {
          this.snackbar = {
            color: 'red',
            show: true,
            text: `${this.$t('system.msg')}: ${error}`
          }
        })
      }
    },
    websiteSetMultiple(val) {
      this.setWebsite = val
    },
    toggle(id, value, mode){
      let website_query = this.query.website
      this.snackbar.show = false
      let toggleResult
      let action_title
      if (mode == 'is_active') {
        toggleResult = {
          is_active: value
        }
        action_title = this.$t('common.status')
      } else if (mode == 'is_rank') {
        toggleResult = {
          is_rank: value
        }
        action_title = this.$t('nav.leaderboard')
      } else {
        toggleResult = {
          is_recommended: value
        }
        action_title = this.$t('nav.recommended')
      }
      this.$http.put(this.appsApi + id + '/', toggleResult).then((response) => {
        let action_text = response[mode] ? this.$t('status.enabled') : this.$t('status.disabled')
        this.snackbar = {
          color: 'success',
          show: true,
          text: `[${action_title}]: ${action_text}`
        }
      }, error => {
        this.snackbar = {
          color: 'error',
          show: true,
          text: `${this.$t('system_msg.error')}: ${error}`
        }
        this.$refs.pulling.rebase()
        this.query.website = website_query
        this.submit()
      })
      this.snackbar.show = false
    },
    submit() {
      if (!$.compareQuery(this.query, this.$route.query)) {
        this.$refs.pulling.submit()
      }
    },
    websiteSelectOne(val) {
      this.query.website = val
      this.submit()
    },
    search:
      debounce(function() {
        this.submit()
      },
    700),
    clearAll() {
      this.is_active = ''
      this.query = {}
      this.query.website = 1
      this.$nextTick(() => {
        this.$refs.pulling.submit()
      })
    },
    clearDateRange() {
      this.created_at  = ['', '']
      this.dateRangeText = ''
    },
    close() {
      this.setWebsite = ''
      this.file = null
      this.uploadInstallerDialog = false
      this.uploadLoading = false
      this.$refs.form.reset()
    },
    closeImport() {
      this.importFile = null
      this.createAppDialog = false
      this.importLoading = false
      this.$refs.importForm.reset()
    }
  }
}
</script>
<style scope lang="scss">
  .v-date-picker-title__date {
    font-size: 20px !important;
  }
</style>
