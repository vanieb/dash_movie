<template>
  <v-layout wrap>
    <v-container>
      <v-layout>
        <div d-inline-block>
          <v-layout justify-start>
            <v-btn
              color="primary"
              dark to="/articles/add">
              <v-icon class="mr-3">library_add</v-icon> &nbsp;{{ $t('actions.add') }}
            </v-btn>
          </v-layout> 
        </div>
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
            <div style="width:155px;" class="mr-2">
              <v-select
                item-name="text"
                item-value="value"
                :items="statusOptions"
                :label="`${$t('nav.popular_articles')}`"
                v-model="is_popular"
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
            <td class="align-center justify-start">
              <v-switch value v-model="item.is_popular"
                @change="toggle(item.slug, item.is_popular, 'is_popular')">
              </v-switch>
            </td>
            <!-- <td class="align-center justify-start">
              <v-switch value v-model="item.is_recommended"
                @change="toggle(item.id, item.is_recommended, 'is_recommended' )">
              </v-switch>
            </td> -->
            <td width="30%">{{ item.created_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
            <td width="30%" class="align-center justify-center">
              <v-layout>
              <v-btn class="mr-2" icon :to="`/articles/${item.slug}/edit`">
                <v-icon small >edit</v-icon>
              </v-btn>
              <v-menu offset-y>
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
              <!-- <v-btn class="mr-2" icon :to="`/apps/${item.id}/edit`">
                <v-icon color="red" small>delete</v-icon>
              </v-btn> -->
              </v-layout>
              
            </td>
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
import date from '../../utils/date'
import $ from '../../utils/util'
import Pagination from '@/components/Pagination'
import SnackBar from '@/components/SnackBar'
import { debounce } from 'lodash'
// import { ValidationObserver, ValidationProvider } from 'vee-validate'
import Website from '../../components/SelectWebsite.vue'
// import axios from 'axios'
import VueCookie from 'vue-cookie'

export default {
  name: 'Article',
  components: {
    Pagination,
    SnackBar,
    // ValidationObserver,
    // ValidationProvider,
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
      today: date.max_today,
      created_at: ['', ''],
      website: 1,
      articleApi: api.articles,
      // exportApi: `${api.apps}export/`,
      // importApi: `${api.apps}import/`,
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
        // {
        //   sortable: false,
        //   text: this.$t('nav.recommended'),
        //   value: 'is_recommended',
        //   width: '10%'
        // },
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
    is_popular(newObj) {
      this.query.is_popular = newObj
      this.$refs.pulling.submit()
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
      this.is_active = this.$route.query.is_active==true || this.$route.query.is_active==false ? this.$route.query.is_active : ''
      this.is_popular = this.$route.query.is_popular==true || this.$route.query.is_popular==false ? this.$route.query.is_popular : ''
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
    // async uploadFile(mode) {
    //   const isValid = await this.$refs.form.validate()
    //   let continueUpload = true
    //   console.log('11')
    //   console.log(this.file.name.split('.').pop())
    //   if (isValid) {
    //     if (this.file.name.split('.').pop() !== 'zip') {
    //       await this.$http.get(`${api.upload}?website=${this.website}&filename=${this.file.name}`).then(response => {
    //         this.count = response.length !== 0 ? response.length : false
    //         if (this.count) {
    //           continueUpload = window.confirm(this.$t('system_msg.confirm_upload',{ count: this.count}))
    //           if (!continueUpload) {
    //             return
    //           }
    //         }
    //       })
    //     }
    //     if (continueUpload) {
    //       if (mode == 'upload') {
    //         this.uploadLoading = true
    //         const formData = new window.FormData()
    //         formData.set('app_file', this.file)
    //         formData.set('website', this.setWebsite)
    //         await axios.post(api.upload, 
    //           formData, 
    //           { headers: {'Content-Type': 'multipart/form-data'},
    //           onUploadProgress: function( progressEvent ) {
    //             this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded / progressEvent.total ) * 100 ))
    //           }.bind(this)
    //         }).then(() => {
    //           this.$refs.pulling.rebase()
    //           this.close()
    //           this.snackbar = {
    //             color: 'success',
    //             show: true,
    //             text: `${this.$t('actions.upload')}: ${this.$t('status.success')}`
    //           }
    //         }, error => {
    //           this.snackbar = {
    //             color: 'red',
    //             show: true,
    //             text: `${this.$t('system_msg.error')}: ${error}`
    //           }
    //           this.uploadLoading = false
    //           return
    //         }).catch(function(){
              
    //         })
    //       }
    //     }
    //   }
    // },
    // async importCsv() {
    //   const isValid = await this.$refs.importForm.validate()
    //   if (isValid) {
    //     this.importLoading = true
    //     const formData = new window.FormData()
    //     formData.set('import_file', this.importFile)
    //     this.$http.post(`${this.importApi}?import_type=app_details`, formData).then(() => {
    //       this.$refs.pulling.rebase()
    //       this.snackbar = {
    //         color: 'success',
    //         show: true,
    //         text: `${this.$t('actions.create_multiple')}: ${this.$t('status.success')}`
    //       }
    //       this.closeImport()
    //     }, error => {
    //       this.snackbar = {
    //         color: 'red',
    //         show: true,
    //         text: `${this.$t('system.msg')}: ${error}`
    //       }
    //     })
    //   }
    // },
    // websiteSetMultiple(val) {
    //   this.setWebsite = val
    // },
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
          is_popular: value
        }
        action_title = this.$t('nav.popular_articles')
      } else {
        toggleResult = {
          is_recommended: value
        }
        action_title = this.$t('nav.recommended')
      }
      this.$http.put(this.articleApi + id + '/', toggleResult).then((response) => {
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
      this.created_at = ['','']
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
    },
    deleteArticle(id) {
      this.$http.delete(this.articleApi + id + '/').then(() => {
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
