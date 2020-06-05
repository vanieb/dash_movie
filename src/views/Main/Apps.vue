<template>
  <v-layout wrap>
    <v-container>
      <v-layout>
        <div d-inline-block>
          <v-layout justify-start>
            <v-btn
              color="primary"
              dark to="/apps/add">
              <v-icon class="mr-3">library_add</v-icon> &nbsp;{{ $t('actions.add') }}
            </v-btn>
          </v-layout> 
        </div>
        <v-layout justify-end>
          <!-- Installer Upload -->
          <v-dialog v-model="uploadInstallerDialog" persistent max-width="350">
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
                <!-- <v-icon class="mr-3">dynamic_feed</v-icon>&nbsp;{{ $t('actions.create_multiple') }} -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                  <v-icon v-on="on">dynamic_feed</v-icon><!-- {{ $t('actions.upload') }} -->

                  </template>
                  <span>{{$t('system_notes.add_multiple_apps_memo')}}</span>
                </v-tooltip>
              </v-btn>
            </template>
            <v-card>
              <validation-observer ref="form">
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
                      v-model="file">    
                    </v-file-input>
                  </validation-provider>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="grey lighten-1"
                    @click="createAppDialog = false">{{ $t('actions.close') }}
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    @click="uploadFile('add')">{{ $t('actions.submit') }}
                  </v-btn>
                </v-card-actions>
              </validation-observer>
            </v-card>
          </v-dialog>
          <!-- Export Apps -->

          <v-dialog v-model="createAppDialog" persistent max-width="350">
            <template v-slot:activator="{ on }">

              <v-btn
                color="primary"
                dark 
                
                v-on="on">
                <!-- <v-icon class="mr-3">dynamic_feed</v-icon>&nbsp;{{ $t('actions.create_multiple') }} -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                  <v-icon v-on="on">cloud_download</v-icon><!-- {{ $t('actions.upload') }} -->

                  </template>
                  <span>{{$t('system_notes.add_multiple_apps_memo')}}</span>
                </v-tooltip>
              </v-btn>
            </template>
            <v-card>
              <validation-observer ref="form">
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
                      v-model="file">    
                    </v-file-input>
                  </validation-provider>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="grey lighten-1"
                    @click="createAppDialog = false">{{ $t('actions.close') }}
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    @click="uploadFile('add')">{{ $t('actions.submit') }}
                  </v-btn>
                </v-card-actions>
              </validation-observer>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-layout>
      <v-card>
        <v-col cols="12" md="12" class="mt-2">
          <v-row class="ml-1 mt-5">
            <div style="width:200px;" class="mr-2">
              <v-select
                item-name="text"
                item-value="value"
                :items="statusOptions"
                :label="`${$t('common.status')}`"
                v-model="status"
                placeholder=" "
                clearable
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
            <div style="width:200px;" class="mr-2">
              <websites
                type="filter"
                :mode="'one'"
                :website="query.website"
                @website-select-multiple="websiteSelectMultiple">
              </websites>
            </div>
            <div style="width:200px;" class="mr-2">
              <v-text-field
                @input="search"
                :label="`${$t('common.name')}`"
                v-model="query.name"
                placeholder=" "
                outlined
                clearable
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
            <v-layout class="justify-end mr-5">
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
            <td>
              <v-btn class="mr-2" icon color="info" :to="`/apps/${item.id}`">
                <v-icon>touch_app</v-icon>
              </v-btn>
            </td>
            <td class="align-center">{{ item.name }}</td>
            <td class="align-center">{{ item.website || '-' }}</td>
            <td class="align-center justify-start layout">
              <v-switch value v-model="item.status"
                @change="toggleStatus(item.id, item.status)">
              </v-switch>
            </td>
            <td>{{ item.created_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
            <td>{{ item.memo || '-'}}</td>
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
import Websites from '../../components/SelectWebsite.vue'
import { debounce } from 'lodash'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
  name: 'Apps',
  components: {
    Websites,
    Pagination,
    SnackBar,
    ValidationObserver,
    ValidationProvider
  },
  data() {
    return {
      // dateRangeText: [],
      file: null,
      uploadLoading: false,
      query: {},
      querySet: [],
      status: '',
      created_at: ['', ''],
      appsApi: api.apps,
      loading: true,
      uploadInstallerDialog: false,
      createAppDialog: false,
      date_menu: false,
      apps: {
        mode: '',
        linkId: '',
        name: '',
        link: 'http://',
        category: '',
        country: '',
        description: ''
      },
      statusOptions: [
        { text: this.$t('status.enabled'),
          value: 1}, 
        { text: this.$t('status.disabled'),
          value: 2}],
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
          text: this.$t('common.created_at'),
          value: 'created_at'
        },
        {
          sortable: false,
          text: this.$t('common.remarks'),
          value: 'memo'
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
    websites(newObj) {
      this.query.websites = newObj
      this.submit()
    },
    status(newObj) {
      this.query.status = newObj
      this.submit()
    },
    created_at(newObj) {
      [this.query.created_at_after, this.query.created_at_before] = [...newObj]
      this.submit()
    }
  },
  created() {
    this.setQueryAll()
    this.$nextTick(() => {
      this.$refs.pulling.rebase()
    })
    this.lang = $.getLanguage() == 'zh_CN' ? 'zh-cn' : ''
  },
  filters: {
    truncate: function(text, length, suffix) {
      return text.substring(0, length) + suffix
    }
  },
  computed: {
    isQueryEmpty() {
      return $.compareQuery(this.query, {})
    },
    dateRangeText () {
      console.log()
      if (this.query.created_at_after || this.query.created_at_before ) {
        return this.created_at.join(' ~ ')
      } else {
        return ''
      }
    }
  },
  methods: {
    setQueryAll() {
      if (this.$route.query.created_at_after || this.$route.query.created_at_before) {
        this.created_at = [this.$route.query.created_at_after, this.$route.query.created_at_before]
      } else {
        this.created_at = [undefined, undefined]
      }
      this.status = this.$route.query.status || ''
      this.websites = this.$route.query.websites || ''
      this.query = Object.assign({}, this.$route.query)

    },
    queryData(queryset) {
      this.loading = false
      this.querySet = queryset
    },
    queryParam(query) {
      this.query = Object.assign(this.query, query)
    },
    async uploadFile(mode) {
      const isValid = await this.$refs.form.validate()
      if (isValid) {
        if (mode == 'upload') {
          this.uploadLoading = true
          const formData = new window.FormData()
          formData.set('app_file', this.file)
          this.$http.post(api.upload, formData).then(() => {
            this.snackbar = {
              color: 'success',
              show: true,
              text: `${this.$t('actions.upload')}: ${this.$t('status.success')}`
            }
            this.uploadLoading = false
            this.uploadInstallerDialog = false
          })
        // insert api
        } else {
        // insert api
          // this.uploadFile = this.file
        }
      }
    },
    websiteSelectMultiple(val) {
      this.query.websites = val
    },
    toggleStatus(){
      // insert api
    },
    submit() {
      if (!$.compareQuery(this.query, this.$route.query)) {
        this.$refs.pulling.submit()
      }
    },
    search:
      debounce(function() {
        this.submit()
      },
    700),
    clearAll() {
      this.query = {}
      this.$nextTick(() => {
        this.submit()
      })
    },
    clearDateRange() {
      this.created_at  = ['', '']
      this.dateRangeText = ''
    }
  }
}
</script>
<style scope lang="scss">
  .v-date-picker-title__date {
    font-size: 20px !important; 
  }
</style>

