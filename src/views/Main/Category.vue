<template>
  <v-layout wrap>
    <v-container>
      <v-layout>
        <v-layout justify-start>
          <div style="width:200px !important;">
            <website
              type="filter"
              :mode="'one'"
              :website="query.website"
              @website-select-one="websiteSelectOne">
            </website>
          </div>
        </v-layout>
        <v-layout justify-end>
          <v-dialog v-model="showForm" persistent max-width="500">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark v-on="on" align-right><v-icon class="mr-3">add_box</v-icon> &nbsp;{{ $t('actions.add') }}</v-btn>
            </template>
            <v-card>
              <validation-observer ref="form">
                <v-card-title class="headline">
                  <v-icon class="mr-3">{{ cardIcon }}</v-icon> &nbsp;
                  {{ cardTitle }}
                </v-card-title>
                <!-- FORM INPUTS -->
                <v-card-text>
                  <v-layout wrap>
                    <v-flex xs12 >
                      <validation-provider rules="required|max:15" :name="$t('common.name')">
                        <v-text-field
                          :counter="15"
                          :error-messages="errors"
                          :label="`${$t('common.name')}*`"
                          placeholder=" "
                          required
                          slot-scope="{ errors }"
                          v-model="category.name"
                        ></v-text-field>
                      </validation-provider>
                    </v-flex>
                    <!-- <v-flex xs12 >
                      <validation-provider rules="required|max:50" :name="$t('common.code')">
                        <v-text-field
                          :counter="50"
                          :error-messages="errors"
                          :label="`${$t('common.code')}*`"
                          placeholder=" "
                          required
                          slot-scope="{ errors }"
                          v-model="category.code"
                        ></v-text-field>
                      </validation-provider>
                    </v-flex> -->
                    <v-flex xs12>
                      <div width="452px;">
                        <types
                          :typeFilter="query.website"
                          elementType="modal"
                          type="set"
                          req="true"
                          :key="reload"
                          :mode="'multiple'"
                          :types="category.types"
                          @type-select-multiple="typeSetMultiple">
                        </types>
                      </div>
                    </v-flex>
                    <v-flex xs12>
                      <validation-provider rules="max:50" :name="$t('common.remarks')">
                        <v-textarea
                          :counter="50"
                          :error-messages="errors"
                          :label="$t('common.remarks')"
                          placeholder=" "
                          rows="1"
                          slot-scope="{ errors }"
                          v-model="category.memo"
                        ></v-textarea>
                      </validation-provider>
                    </v-flex>
                  </v-layout>
                  <small color="red">*{{ $t('errors.required') }}</small>
                </v-card-text>
                <!-- BUTTONS -->
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="grey lighten-1"
                    :disabled="submitting"
                    @click="close"
                  >{{ $t('actions.close') }}</v-btn>
                  <v-btn
                    color="primary"
                    dark
                    :loading="submitting"
                    @click="saveCategory"
                  >{{ $t('actions.save') }}</v-btn>
                </v-card-actions>
              </validation-observer>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-layout>
      <!-- SEARCH -->
      <v-card>
        <v-col cols="12" md="12" class="mt-2" style="padding: 20px 20px 10px 20px !important;">
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
              <types
                :typeFilter="query.website"
                :mode="'one'"
                type="'filter'"
                :types="query.types"
                @type-select-one="typeSelectOne">
              </types>
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
                    hide-details="true"
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
                @click="clearAll">
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
            <td>{{ item.name }}</td>
            <td class="align-center justify-start">
              <v-switch value v-model="item.is_active"
                @change="toggleStatus(item.id, item.is_active)">
              </v-switch>
            </td>
            <td>{{ item.code }}</td>
            <td><span v-for="item in item.types " :key="item.id">{{ item.name }}<br/></span></td>
            <td>{{ item.created_at | moment("YYYY-MM-DD HH:mm:ss")}} / <br/>
            {{ item.updated_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
            <td>{{ item.memo || '-'}}</td>
            <td class="align-center justify-center">
              <v-btn class="mr-1" icon @click="updateCategory(item)">
                <v-icon small>edit</v-icon>
              </v-btn>
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-icon color="red" small v-on="on">delete</v-icon>
                </template>
                <v-list dark>
                  <v-list-item @click="deleteCategory(item.id, true, $event)">
                    <v-list-item-title>
                      <v-icon class="mr-2" color="orange">warning</v-icon>
                      {{ $t('system_msg.confirm_delete') }}
                      <strong>{{ item.name }}</strong>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
        </template>
      </v-data-table>
    </v-container>
    <pagination
      :queryset="querySet"
      :api="categoriesApi"
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
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import Types from '../../components/SelectType.vue'
import Website from '../../components/SelectWebsite.vue'

export default {
  name: 'Category',
  components: {
    Pagination,
    SnackBar,
    Types,
    ValidationObserver,
    ValidationProvider,
    Website
  },
  data() {
    return {
      name: '',
      showForm: false,
      query: {
        website: 1
      },
      querySet: [],
      is_active: '',
      reload: false,
      today: date.max_today,
      created_at: ['', ''],
      categoriesApi: api.categories,
      loading: true,
      website: 1,
      submitting: false,
      date_menu: false,
      data: {
        types: false
      },
      category: {
        name: '',
        types: '',
        // code: '',
        memo: ''
      },
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
          text: this.$t('common.name'),
          value: 'name'
        },
        {
          sortable: false,
          text: this.$t('common.status'),
          value: 'status',
          width: '10%'
        },
        {
          sortable: false,
          text: this.$t('common.code'),
          value: 'code',
          width: '10%'
        },
        {
          sortable: false,
          text: this.$t('nav.types'),
          value: 'types',
          width: '10%'
        },
        {
          sortable: false,
          text: `${this.$t('common.created_at')} / ${this.$t('common.updated_at')}`,
          value: 'created_at',
          width: '20%'
        },
        {
          sortable: false,
          text: this.$t('common.remarks'),
          value: 'memo'
        },
        {
          sortable: false,
          text: this.$t('common.action'),
          width: '8%'
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
    type(newObj) {
      this.query.types = newObj
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
    cardIcon() {
      return this.isUpdate ? 'edit' : 'add_box'
    },
    cardTitle() {
      return this.isUpdate ? `${this.$t('actions.update')} - ${this.name}` : `${this.$t('actions.add')} - ${this.$t('nav.category')}`
    },
    isUpdate() {
      return this.name.length > 0
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
    toggleStatus(id, is_active){
      this.$http.put(this.categoriesApi + id + '/', {
        is_active: is_active
      }).then((response) => {
        let status_text = response.is_active ? this.$t('status.enabled') : this.$t('status.disabled')
        this.snackbar = {
          color: 'success',
          show: true,
          text: `[${this.$t('common.status')}]: ${status_text}`
        }
        this.$refs.pulling.rebase()
      }, error => {
        this.snackbar = {
          color: 'error',
          show: true,
          text: `${this.$t('system_msg.error')}: ${error}`
        }
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
    typeSelectOne(val) {
      this.query.types = val
      this.submit()
    },
    typeSetMultiple(val) {
      if (val && val[0].name) {
        let newVal = []
        this.category.types.forEach(item => {
          newVal.push(item.id)
        })
        // changed Removed
        if (this.data.types != newVal.join(',')) {
          this.types_removed_some = true
          this.category.types_removed = newVal.join(',')
        // unchanged
        } else {
          this.types_changed = false
        }
      // Changed - Added
      } else {
        this.types_changed = true
      }
      this.category.types = val
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
    updateCategory(item) {
      Object.assign(this.category, {
        id: item.id,
        name: item.name,
        memo: item.memo,
        // code: item.code,
        types: item.types
      })
      let val = []
      this.category.types.forEach(item => {
        if (item) {
          val.push(item.id)
        }
        this.data[item] = val.join(',')
      })
      this.name = item.name
      this.showForm = true
    },
    deleteCategory(id) {
      this.snackbar.show=false
      this.$http.delete(this.categoriesApi + id + '/').then(() => {
        this.snackbar = {
          color: 'success',
          show: true,
          text: `${this.$t('actions.delete')}: ${this.$t('status.success')}`
        }
        this.$refs.pulling.rebase()
      })
    },
    async saveCategory() {
      const isValid = await this.$refs.form.validate()
      if (isValid) {
        let categoryResult = new window.FormData()
        categoryResult.set('name', this.category.name)
        // categoryResult.set('code', this.category.code)
        if (this.category.memo || this.category.memo == '') {
          categoryResult.set('memo', this.category.memo)
        }
        if (this.types_removed_some) {
          categoryResult.set('types', this.category.types_removed)
        } else if (this.types_changed) {
          categoryResult.set('types', this.category.types)
        }
        if (this.category.id) {
          this.$http.put(`${this.categoriesApi}${this.category.id}/`, categoryResult).then(() => {
            this.snackbar = {
              color: 'success',
              show: true,
              text: `${this.$t('actions.update')}-${this.$t('nav.category')}: ${this.$t('status.success')}`
            }
            this.$refs.pulling.rebase()
            this.reload=true
            this.close()
          }, error => {
            this.snackbar = {
              color: 'red',
              show: true,
              text: error
            }
          })
        } else {
          categoryResult.set('website', this.query.website)
          this.$http.post(this.categoriesApi, categoryResult).then(() => {
            this.snackbar = {
              color: 'success',
              show: true,
              text: `${this.$t('actions.add')}-${this.$t('nav.category')}: ${this.$t('status.success')}`
            }
            this.$refs.pulling.rebase()
            this.close()
          }, error => {
            this.snackbar = {
              color: 'red',
              show: true,
              text: error
            }
            this.$refs.form.reset()
          })
        }
      }
      this.snackbar.show=false
    },
    close() {
      this.category.id = ''
      this.category.name = ''
      // this.category.code = ''
      this.category.memo=''
      this.category.types = []
      this.name = ''
      this.submitting = false
      this.$refs.form.reset()
      this.showForm = false
    }
  }
}
</script>
<style scope lang="scss">
  .v-date-picker-title__date {
    font-size: 20px !important; 
  }
</style>
