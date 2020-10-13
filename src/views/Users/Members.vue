<template>
  <v-layout wrap>
    <v-container>
      <v-flex>
        <validation-observer ref="form">
          <v-dialog v-model="showForm" persistent max-width="500">
            <template v-slot:activator="{ on }">
              <v-btn
                color="primary"
                dark
                v-on="on"
                v-show="$root.permissions.includes('create_member')"
                align-right><v-icon class="mr-3">person_add</v-icon> &nbsp;{{ $t('actions.add') }}
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline">
                <v-icon class="mr-3">{{ cardIcon }}</v-icon> &nbsp;
                {{ cardTitle }}
              </v-card-title>
              <!-- FORM INPUTS -->
              <v-card-text>
                <v-layout wrap>
                  <v-flex xs12 >
                    <validation-provider rules="required|max:15" :name="$t('login.username')">
                      <v-text-field
                        :counter="15"
                        :error-messages="errors"
                        :label="`${$t('login.username')}*`"
                        placeholder=" "
                        slot-scope="{ errors }"
                        v-model="member.username"
                      ></v-text-field>
                    </validation-provider>
                  </v-flex>
                  <v-flex xs12>
                    <validation-provider rules="required|max:15" :name="$t('login.password')" v-if="!isUpdate">
                      <v-text-field
                        :counter="15"
                        :error-messages="errors"
                        :label="`${$t('login.password')}*`"
                        placeholder=" "
                        required
                        type="password"
                        slot-scope="{ errors }"
                        v-model="member.password"
                      ></v-text-field>
                    </validation-provider>
                    <validation-provider rules="max:15" :name="$t('login.password')" v-else>
                      <v-text-field
                        :counter="15"
                        :error-messages="errors"
                        :label="`${$t('login.password')}`"
                        placeholder=" "
                        type="password"
                        slot-scope="{ errors }"
                        v-model="member.password"
                      ></v-text-field>
                    </validation-provider>
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
                        v-model="member.memo"
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
                  color="blue darken-1"
                  :loading="submitting"
                  @click="saveMember"
                >{{ $t('actions.save') }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </validation-observer>
      </v-flex>
      <v-card>
        <v-col cols="12" md="12" class="mt-2" style="padding: 20px 20px 10px 20px !important;">
          <v-row>
            <div style="width:155px;" class="mr-2">
              <v-select
                item-name="text"
                item-value="value"
                :items="loginStatusOptions"
                :label="`${$t('staff.login_status')}`"
                v-model="login_status"
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
                :label="`${$t('common.status')}`"
                v-model="status"
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
                :label="`${$t('common.name')}`"
                v-model="query.username_q"
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
                  :max="today"
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
      <v-data-table
        :headers="headers"
        :hide-default-footer="true"
        :items="querySet"
      >
        <template v-slot:body="{ items }">
          <span v-if="!items">{{items}}</span>
          <tbody>
            <tr v-for="item in querySet" :key="item.id">
              <td class="align-center text-center px-0">
                <v-icon class="mr-2" small color="green" v-if="item.is_logged_in">fiber_manual_record</v-icon>
                <v-icon class="mr-2" small v-else>fiber_manual_record</v-icon>
              </td>
              <td >{{ item.user.username }}</td>
              <td class="align-center justify-center layout px-0" v-if="$root.permissions.includes('change_member_status')">
                <v-switch value v-model="item.status"
                  @change="toggleStatus(item.id, item.status, item.user.username)">
                </v-switch>
              </td>
              <td class="align-center justify-start" v-else>
                <v-chip v-if="item.status == true" class="success" small>{{ $t('status.enabled') }}</v-chip>
                <v-chip v-else small>{{ $t('status.disabled') }}</v-chip>
              </td>
              <td>{{ item.created_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
              <td>{{ item.updated_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
              <td>{{ item.memo || '-'}}</td>
              <td class="align-center justify-center px-0" v-if="$root.permissions.includes('change_member_details') || $root.permissions.includes('delete_member')">
                <v-icon class="mr-2" small @click="updateMember(item)" v-if="$root.permissions.includes('change_member_details')">edit</v-icon>
                <v-menu offset-y v-if="$root.permissions.includes('delete_member')">
                  <template v-slot:activator="{ on }">
                    <v-icon color="red" small v-on="on">delete</v-icon>
                  </template>
                  <v-list dark>
                    <v-list-item @click="deleteMember(item.id, true, $event)">
                      <v-list-item-title>
                        <v-icon class="mr-2" color="orange">warning</v-icon>
                        {{ $t('system_msg.confirm_delete') }}
                        <strong>{{ item.user.username }}</strong>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
              <td v-else>-</td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </v-container>
    <pagination
      :queryset="querySet"
      :api="memberApi"
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
import Pagination from '@/components/Pagination'
import SnackBar from '@/components/SnackBar'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { debounce } from 'lodash'
import $ from '../../utils/util'
import date from '../../utils/date'

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
    Pagination,
    SnackBar
  },
  name: 'Members',
  data() {
    return {
      submitting: false,
      username: '',
      member: {
        id: '',
        username: '',
        password: '',
        memo: ''
      },
      date_menu: false,
      created_at: ['', ''],
      today: date.max_today,
      loading: true,
      status: '',
      login_status: '',
      memberApi: api.members,
      querySet: [],
      query: {},
      showForm: false,
      snackbar: {
        color: '',
        text: '',
        show: false,
      },
      statusOptions: [
        { text: this.$t('status.enabled'),
          value: 1},
        { text: this.$t('status.disabled'),
          value: 0}],
      loginStatusOptions: [
        { text: this.$t('staff.online'),
          value: true},
        { text: this.$t('staff.offline'),
          value: false}],
      headers: [
        {
          sortable: false,
          text: this.$t('staff.login_status'),
          value: 'is_logged_in'
        },
        {
          sortable: false,
          text: this.$t('login.username'),
          value: 'user.username'
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
          text: this.$t('common.updated_at'),
          value: 'updated_at'
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
    login_status(newObj) {
      this.query.login_status = newObj
      this.$refs.pulling.submit()
    },
    status(newObj) {
      this.query.status = newObj
      this.$refs.pulling.submit()
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
  computed: {
    cardTitle() {
      return this.isUpdate ? `${this.$t('actions.update')} - ${this.username}` : `${this.$t('actions.add')} - ${this.$t('nav.members')}`
    },
    cardIcon() {
      return this.isUpdate ? 'edit' : 'person_add'
    },
    isUpdate() {
      return this.username.length > 0
    },
    isQueryEmpty() {
      return $.compareQuery(this.query, {})
    },
    dateRangeText () {
      if (this.query.created_at_after && this.query.created_at_before ) {
        return this.created_at.join(' ~ ')
      } else {
        return ''
      }
    }
  },
  created() {
    this.setQueryAll()
    this.$nextTick(() => {
      this.$refs.pulling.rebase()
    })
    this.lang = $.getLanguage() == 'zh_CN' ? 'zh-cn' : ''
  },
  methods: {
    setQueryAll() {
      if (this.$route.query.created_at_after || this.$route.query.created_at_before) {
        this.created_at = [this.$route.query.created_at_after, this.$route.query.created_at_before]
      } else {
        this.created_at = [undefined, undefined]
      }
      this.status = this.$route.query.status===1 || this.$route.query.status===0 || this.$route.query.status==='1' || this.$route.query.status==='0' ? JSON.parse(this.$route.query.status) : ''
      this.login_status = this.$route.query.login_status===true || this.$route.query.login_status===false || this.$route.query.login_status==='true' || this.$route.query.login_status==='false' ? JSON.parse(this.$route.query.login_status) : ''
      this.query = Object.assign({}, this.$route.query)
    },
    async saveMember() {
      const isValid = await this.$refs.form.validate()
      let memberResult = Object({
        username: this.member.username,
        email: this.member.email,
        memo: this.member.memo,
      })
      if (this.member.password) {
        memberResult = Object({
          ...memberResult,
          password: this.member.password
        })
      }
      if (isValid) {
        if (this.member.id) {
        this.$http.put(`${this.memberApi}${this.member.id}/`, memberResult).then(() => {
          this.$refs.pulling.rebase()
          this.snackbar = {
            color: 'success',
            show: true,
            text: `${this.$t('actions.update')} - ${this.$t('nav.members')}: ${this.$t('status.success')}`
          }
          this.close()
        }, error => {
          this.snackbar = {
            color: 'red',
            show: true,
            text: error
          }
        })
      } else {
        this.$http.post(this.memberApi, memberResult).then(() => {
          this.snackbar = {
            color: 'success',
            show: true,
            text: `${this.$t('actions.add')} - ${this.$t('nav.members')}: ${this.$t('status.success')}`
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
    updateMember(item) {
      Object.assign(this.member, {
        id: item.id,
        username: item.user.username,
        password: item.password,
        memo: item.memo
      })
      this.username = this.member.username
      this.showForm = true
    },
    deleteMember(id) {
      this.$http.delete(`${this.memberApi}${id}/`).then(() => {
        this.snackbar = {
          color: 'success',
          show: true,
          text: `${this.$t('actions.delete')}: ${this.$t('status.success')}`
        }
        this.$refs.pulling.rebase()
      })
    },
    toggleStatus(id, status, username) {
      this.toggleLoading = true
      this.$http.put(`${this.memberApi}${id}/`, {
        username: username,
        status: status ? 1 : 0
      }).then((response) => {
        let status_text = response.status ? this.$t('status.enabled') : this.$t('status.disabled')
        this.snackbar = {
          color: 'success',
          show: true,
          text: `[${this.$t('common.status')}]: ${status_text}`
        }
      }, error => {
        this.snackbar = {
          color: 'error',
          show: true,
          text: `${this.$t('system_msg.error')}: ${error}`
        }
      })
      this.snackbar.show = false
    },
    close() {
      this.member.id = ''
      this.member.username = ''
      this.member.password=''
      this.member.memo = ''
      this.username = ''
      this.submitting = false
      this.$refs.form.reset()
      this.showForm = false
    },
    queryData(queryset) {
      this.loading = false
      this.querySet = queryset
    },
    queryParam(query) {
      this.query = Object.assign(this.query, query)
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
      this.created_at = ['','']
      this.status = ''
      this.query = {}
      this.$nextTick(() => {
        this.$refs.pulling.submit()
      })
    }
  }
}
</script>