<template>
  <v-layout wrap>
    <v-container>
      <v-layout justify-start class="mt-3">
        <div style="width:200px !important;" class="mr-2">
          <website
            type="filter"
            :mode="'one'"
            req="true"
            :website="query.website"
            @website-select-one="websiteSelectOne">
          </website>
        </div>
        <div style="width:200px !important;" class="mr-2">
          <types
            :mode="'one'"
            type="filter"
            req="true"
            :typeFilter="typeFilter"
            :types="query.types"
            @type-select-one="typeSelectOne">
          </types>
        </div>
      </v-layout>
      <v-card>
        <v-col cols="12" md="12" class="" style="padding: 20px 20px 10px 20px !important;">
          <v-row>
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
                clearable
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
                :label="`${$t('nav.leaderboard')}-${$t('common.status')}`"
                v-model="is_rank"
                hide-details="true"
                placeholder=" "
                outlined
                clearable
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
                :label="`${$t('nav.recommended')}-${$t('common.status')}`"
                v-model="is_recommended"
                hide-details="true"
                placeholder=" "
                outlined
                clearable
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
                :label="`${$t('common.name')}`"
                v-model="query.name_q"
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
              <v-btn class="mr-2" icon color="info" :to="`/apps/${item.slug}`">
                <v-icon>touch_app</v-icon>
              </v-btn>
            </td>
            <td class="align-center" width="20%">{{ item.name }}</td>
            <td class="align-center justify-center" width="10%" >
              <span>{{item.website ? item.website.name : '-' }}<br/></span>
            </td>
            <td class="align-center justify-start">
              <v-switch value v-model="item.is_active"
                @change="toggle(item.apptype_details.id, item.is_active, 'is_active')">
              </v-switch>
            </td>
            <td class="align-center justify-start">
              <v-switch value v-model="item.is_rank"
                @change="toggle(item.apptype_details.id, item.is_rank, 'is_rank')">
              </v-switch>
            </td>
            <td class="align-center justify-start">
              <v-switch value v-model="item.is_recommended"
                @change="toggle(item.apptype_details.id, item.is_recommended, 'is_recommended' )">
              </v-switch>
            </td>
            <td width="30%">{{ item.created_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
            <td width="30%" class="align-center justify-center">
              <v-layout>
                <v-btn class="mr-2" icon :to="`/apps/${item.slug}/edit`">
                  <v-icon small >edit</v-icon>
                </v-btn>
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-icon color="red" small v-on="on" icon>delete</v-icon>
                  </template>
                  <v-list dark>
                    <v-list-item @click="deleteApp(item.slug, true, $event)">
                      <v-list-item-title>
                        <v-icon class="mr-2" color="orange">warning</v-icon>
                        {{ $t('system_msg.confirm_delete') }}
                        <strong>{{ item.name }}</strong>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-layout>
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
import date from '../../utils/date'
import $ from '../../utils/util'
import Pagination from '@/components/Pagination'
import SnackBar from '@/components/SnackBar'
import { debounce } from 'lodash'
import Website from '../../components/SelectWebsite.vue'
import Types from '../../components/SelectType.vue'
import VueCookie from 'vue-cookie'

export default {
  name: 'Apps',
  components: {
    Pagination,
    SnackBar,
    Website,
    Types
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
      typeFilter: '',
      querySet: [],
      export_query: [],
      is_active: '',
      is_rank: '',
      is_recommended: '',
      today: date.max_today,
      created_at: ['', ''],
      website: 1,
      appsApi: `${api.apps}rankings/`,
      exportApi: `${api.apps}export/`,
      importApi: `${api.apps}import/`,
      loading: true,
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
    is_rank(newObj) {
      this.query.is_rank = newObj
      this.$refs.pulling.submit()
    },
    is_recommended(newObj) {
      this.query.is_recommended = newObj
      this.$refs.pulling.submit()
    },
    type(newObj) {
      this.query.types = newObj
      this.search()
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
  methods: {
    setQueryAll() {
      if (this.$route.query.created_at_after || this.$route.query.created_at_before) {
        this.created_at = [this.$route.query.created_at_after, this.$route.query.created_at_before]
      } else {
        this.created_at = [undefined, undefined]
      }
      this.website = this.$route.query.website || ''
      this.is_active = this.$route.query.is_active==true || this.$route.query.is_active==false ? this.$route.query.is_active : ''
      this.is_rank = this.$route.query.is_rank==true || this.$route.query.is_rank==false ? this.$route.query.is_rank : ''
      this.is_recommended = this.$route.query.is_recommended==true || this.$route.query.is_recommended==false ? this.$route.query.is_recommended : ''
      this.type = this.$route.query.types || ''
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
    typeSelectOne(val) {
      if (val) {
        this.query.types = val
        this.submit()
      }
    },
    websiteSetMultiple(val) {
      this.setWebsite = val
    },
    toggle(id, value, mode){
      let website_query = this.query.website
      this.snackbar.show = false
      let toggleResult = new window.FormData()
      let action_title
      if (mode == 'is_active') {
        toggleResult.set('is_active', value)
        action_title = this.$t('common.status')
      } else if (mode == 'is_rank') {
        toggleResult.set('is_rank', value)
        action_title = this.$t('nav.leaderboard')
      } else {
        toggleResult.set('is_recommended', value)
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
      this.typeFilter = this.query.website
      this.submit()
    },
    search:
      debounce(function() {
        this.submit()
      },
    700),
    clearAll() {
      this.created_at = ['','']
      this.query = {}
      this.query.website = 1
      this.query.types = this.$route.query.types
      this.$nextTick(() => {
        this.$refs.pulling.submit()
      })
    },
    clearDateRange() {
      this.created_at  = ['', '']
      this.dateRangeText = ''
    },
    deleteApp(id) {
      this.$http.delete(api.apps + id + '/').then(() => {
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
