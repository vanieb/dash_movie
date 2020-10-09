<template>
  <v-layout wrap>
    <v-container>
      <v-layout>
        <v-layout justify-start>
          <v-btn
            color="primary"
            dark to="/articles/add"
            v-if="$root.permissions.includes('create_article')"
            >
            <v-icon class="mr-3">post_add</v-icon> &nbsp;{{ $t('actions.add') }}
          </v-btn>
        </v-layout>
        <v-layout justify-end>
          <!-- Doc Import -->
           <v-dialog v-model="importDocDialog" persistent max-width="600">
            <template v-slot:activator="{ on }">
               <v-btn
                  color="primary"
                  dark
                  class="mr-3"
                  v-on="on"
                  v-show="$root.permissions.includes('create_article')"
                  >
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">cloud_upload</v-icon>
                    </template>
                    <span>{{$t('system_notes.import_article_docx_memo')}}</span>
                  </v-tooltip>
                </v-btn>
              </template>
            <v-card :loading="importLoading">
              <validation-observer ref="form">
                <v-card-title>
                  <v-icon class="mr-3">cloud_upload</v-icon>
                    &nbsp;{{ $t('actions.upload') }}
                </v-card-title>
                <v-card-text>
                  <v-icon small>info</v-icon>&nbsp;&nbsp;
                  <small>{{ $t('system_notes.import_article_docx_memo') }}</small>
                  <small>{{ $t('system_notes.import_article_docx_memo_format') }}</small>
                </v-card-text>
                <v-card-text>
                  <website
                    type="set"
                    :mode="'multiple'"
                    :action="'add'"
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
                      v-model="importFile">
                    </v-file-input>
                  </validation-provider>
                  <v-progress-linear
                    v-if="importLoading"
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
                    @click="closeImportDoc()"
                    >{{ importLoading ? $t('actions.cancel') : $t('actions.close') }}
                  </v-btn>
                  <v-btn
                    color="primary"
                    dark
                    :disabled="importLoading"
                    @click="uploadFile('upload')">{{ $t('actions.submit') }}
                  </v-btn>
                </v-card-actions>
              </validation-observer>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-layout>
      <v-card>
        <v-col cols="12" md="12" class="mt-2" style="padding: 20px 20px 10px 20px !important;">
          <v-row>
            <div style="width:155px !important;" class="mr-2">
              <website
                type="filter"
                :mode="'one'"
                :website="query.website"
                @website-select-one="websiteSelectOne">
              </website>
            </div>
            <div style="width:155px;" class="mr-2">
              <v-select
                item-name="text"
                item-value="value"
                :items="statusOptions"
                :label="`${$t('common.status')}`"
                v-model="active"
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
            <div style="width:155px;" class="mr-2">
              <v-select
                item-name="text"
                item-value="value"
                :items="statusOptions"
                :label="`${$t('nav.popular_articles')}`"
                v-model="popular"
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
            <div style="width:200px;" class="mr-2">
              <v-text-field
                @input="search"
                :label="`${$t('articles.title')}`"
                v-model="query.title_q"
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
                  :max="today"
                  range
                  landscape
                  smaller
                  >
                </v-date-picker>
              </v-menu>
            </div>
            <v-layout class="justify-end">
              <v-btn
                color="primary"
                dark
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
              <v-btn class="mr-2" icon color="info" :to="`/articles/${item.slug}`">
                <v-icon>touch_app</v-icon>
              </v-btn>
            </td>
            <td class="align-center" width="30%" v-if="item.websites.length == 1 && item.title.length > 20">{{ item.title | truncate(20, '...') }}</td>
            <td class="align-center" width="30%" v-else>{{ item.title }}</td>
            <td class="align-center justify-center" width="10%">
              <span  v-for="website in item.websites" :key="website.id">{{website.name }}<br/></span>
            </td>
            <td class="align-center justify-start">
              <v-switch value v-model="item.is_active"
                @change="toggle(item.slug, item.is_active, 'is_active', item.title)">
              </v-switch>
            </td>
            <td class="align-center justify-start" v-if="$root.permissions.includes('change_article_popular_status')">
              <v-switch value v-model="item.is_popular"
                @change="toggle(item.slug, item.is_popular, 'is_popular', item.title)">
              </v-switch>
            </td>
            <td class="align-center justify-start" v-else>
              <v-chip v-if="item.is_popular = true" class="error" small>{{ $t('nav.popular_articles') }}</v-chip>
              <span v-else>-</span>
            </td>
            <td width="15%">{{ item.created_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
            <td width="10%" class="align-center justify-center" v-if="$root.permissions.includes('change_article') || $root.permissions.includes('delete_article')">
              <v-layout>
                <v-btn class="mr-2" icon :to="`/articles/${item.slug}/edit`" v-if="$root.permissions.includes('change_article')">
                  <v-icon small >edit</v-icon>
                </v-btn>
                <v-menu offset-y v-if="$root.permissions.includes('delete_article')">
                  <template v-slot:activator="{ on }">
                    <v-icon color="red" small v-on="on" icon>delete</v-icon>
                  </template>
                  <v-list dark>
                    <v-list-item @click="deleteArticle(item.slug, true, $event)">
                      <v-list-item-title>
                        <v-icon class="mr-2" color="orange">warning</v-icon>
                        {{ $t('system_msg.confirm_delete') }}
                        <strong>{{ item.title }}</strong>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-layout>
            </td>
            <td v-else>-</td>
          </tr>
        </tbody>
        </template>
      </v-data-table>
    </v-container>
    <pagination
      :queryset="querySet"
      :api="articleApi"
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
import axios from 'axios'
import date from '../../utils/date'
import $ from '../../utils/util'
import Pagination from '@/components/Pagination'
import SnackBar from '@/components/SnackBar'
import { debounce } from 'lodash'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import Website from '../../components/SelectWebsite.vue'

export default {
  name: 'Article',
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
      active: '',
      popular: '',
      today: date.max_today,
      created_at: ['', ''],
      website: 1,
      articleApi: api.articles,
      importApi: `${api.articles}import/`,
      loading: true,
      importLoading: false,
      importArticlesDialog: false,
      importDocDialog: false,
      submitting: false,
      date_menu: false,
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
          text: this.$t('articles.title'),
          value: 'title'
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
          text: this.$t('nav.popular_articles'),
          value: 'is_popular',
          width: '10%'
        },
        {
          sortable: false,
          text: this.$t('common.created_at'),
          value: 'created_at',
          width: '15%'
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
    popular(newObj) {
      this.query.popular = newObj
      this.$refs.pulling.submit()
    },
    active(newObj) {
      this.query.active = newObj
      this.$refs.pulling.submit()
    },
    website(newObj) {
      this.query.website = newObj
      this.search()
    },
    created_at(newObj) {
      if (this.query.created_at_after > this.query.created_at_before){
        this.snackbar = {
          color: 'error',
          show: true,
          text: `[${this.$t('system_msg.error')}]: ${this.$t('system_msg.date_error')}`
        }
        this.clearAll()
      } else {
        [this.query.created_at_after, this.query.created_at_before] = [...newObj]
        this.search()
      }
    }
  },
  created() {
    this.setQueryAll()
    this.$nextTick(() => {
      this.$refs.pulling.rebase()
      if (!this.query.created_at_before) {
        this.query.website = 1
        this.submit()
      }
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
    }
  },
  filters: {
    truncate: function(text, length, suffix) {
      return text.substring(0, length) + suffix
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
      this.active = this.$route.query.active==true || this.$route.query.active==false ? this.$route.query.active : ''
      this.popular = this.$route.query.popular==true || this.$route.query.popular==false ? this.$route.query.popular : ''
      this.query = Object.assign({}, this.$route.query)
    },
    queryData(queryset) {
      this.loading = false
      this.querySet = queryset
    },
    queryParam(query) {
      this.query = Object.assign(this.query, query)
    },
    async uploadFile() {
      this.snackbar.show = false
      const isValid = await this.$refs.form.validate()
      if (isValid) {
        this.importLoading = true
        const formData = new window.FormData()
        formData.set('websites', this.setWebsite)
        formData.set('upload_file', this.importFile)
        await axios.post(`${this.articleApi}?upload=docx`,
          formData,
          { headers: {'Content-Type': 'multipart/form-data'},
          onUploadProgress: function( progressEvent ) {
            this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded / progressEvent.total ) * 100 ))
          }.bind(this)
        }).then(() => {
          if (this.importFile.name.split('.').pop() !== 'zip') {
            this.$refs.pulling.rebase()
          } else {
            this.$router.push('/import_article_logs')
          }
          this.closeImportDoc()
          this.snackbar = {
            color: 'success',
            show: true,
            text: `${this.$t('actions.import')} - ${this.$t('nav.articles')}: ${this.$t('status.success')}`
          }
        }, error => {
          this.snackbar = {
            color: 'red',
            show: true,
            text: `${this.$t('system_msg.error')}: ${error}`
          }
          this.importLoading = false
          return
        }).catch(function(){

        })
      }
    },
    async importCsv() {
      const isValid = await this.$refs.importForm.validate()
      if (isValid) {
        this.importLoading = true
        const formData = new window.FormData()
        formData.set('import_file', this.importFile)
        this.$http.post(`${this.importApi}`, formData).then(() => {
          this.$router.push('/import_article_logs')
          this.snackbar = {
            color: 'success',
            show: true,
            text: `${this.$t('actions.import')} - ${this.$t('nav.articles')}: ${this.$t('status.success')}`
          }
          this.closeImport()
        }, error => {
          this.snackbar = {
            color: 'red',
            show: true,
            text: `${this.$t('system_msg.error')}: ${error}`
          }
        })
      }
    },
    toggle(id, value, mode, title){
      let website_query = this.query.website
      this.snackbar.show = false
      let toggleResult
      let action_title
      if (mode == 'is_active') {
        toggleResult = {
          is_active: value,
          title: title
        }
        action_title = this.$t('common.status')
      } else if (mode == 'is_popular') {
        toggleResult = {
          is_popular: value,
          title: title
        }
        action_title = this.$t('nav.popular_articles')
      }
      this.$http.put(`${this.articleApi}${id}/`, toggleResult).then((response) => {
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
    websiteSetMultiple(val) {
      this.setWebsite = val
    },
    search:
      debounce(function() {
        this.submit()
      },
    700),
    clearAll() {
      this.created_at = ['','']
      this.active = ''
      this.popular = ''
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
    closeImport() {
      this.importFile = null
      this.importLoading = false
      this.importArticlesDialog = false
      this.$refs.importForm.reset()
    },
    closeImportDoc() {
      this.setWebsite = ''
      this.importFile = null
      this.importLoading = false
      this.importDocDialog = false
      this.$refs.form.reset()
    },
    deleteArticle(id) {
      this.$http.delete(`${this.articleApi}${id}/`).then(() => {
        this.snackbar = {
          color: 'success',
          show: true,
          text: `${this.$t('actions.delete')}: ${this.$t('status.success')}`
        }
        this.$refs.pulling.rebase()
      }, error => {
         this.snackbar = {
          color: 'red',
          show: true,
          text: `${this.$t('system_msg.error')}: ${error}`
        }
      })
      this.snackbar.show = false
    }
  }
}
</script>
<style scope lang="scss">
  .v-date-picker-title__date {
    font-size: 20px !important;
  }
</style>
