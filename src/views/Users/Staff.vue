<template>
  <v-layout wrap>
    <v-container>
      <v-flex>
        <validation-observer ref="form">
          <v-dialog v-model="showForm" persistent max-width="500">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark v-on="on" align-right><v-icon class="mr-3">person_add</v-icon> &nbsp;{{ $t('actions.add') }}</v-btn>
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
                      v-model="staff.username"
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
                      v-model="staff.password"
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
                      v-model="staff.password"
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
                      v-model="staff.memo"
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
                @click="saveStaff"
              >{{ $t('actions.save') }}</v-btn>
            </v-card-actions>
            </v-card>
          </v-dialog>
      </validation-observer>
      </v-flex>
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
            <td class="align-center justify-center layout px-0">
              <v-switch value v-model="item.status"
                @change="toggleStatus(item.id, item.status, item.user.username)">
              </v-switch>
            </td>
            <td>{{ item.created_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
            <td>{{ item.updated_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
            <td>{{ item.memo || '-'}}</td>
            <td class="align-center justify-center px-0">
              <v-icon class="mr-2" small @click="updateStaff(item)">edit</v-icon>
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-icon color="red" small v-on="on">delete</v-icon>
                </template>
                <v-list dark>
                  <v-list-item @click="deleteStaff(item.id, true, $event)">
                    <v-list-item-title>
                      <v-icon class="mr-2" color="orange">warning</v-icon>
                      {{ $t('system_msg.confirm_delete') }}
                      <strong>{{ item.user.username }}</strong>
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
      :api="staffApi"
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

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
    Pagination,
    SnackBar
  },
  name: 'Staff',
  data() {
    return {
      submitting: false,
      username: '',
      staff: {
        id: '',
        username: '',
        password: '',
        memo: ''
      },
      staffApi: api.staff,
      querySet: [],
      query: {},
      showForm: false,
      snackbar: {
        color: '',
        text: '',
        show: false,
      },
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
  computed: {
    cardTitle() {
      return this.isUpdate ? `${this.$t('actions.update')} - ${this.username}` : `${this.$t('actions.add')} - ${this.$t('nav.staff')}`
    },
    cardIcon() {
      return this.isUpdate ? 'edit' : 'person_add'
    },
    isUpdate() {
      return this.username.length > 0
    }
  },
  created() {
    this.$nextTick(() => {
      this.$refs.pulling.rebase()
    })
  },
  methods: {
    async saveStaff() {
      const isValid = await this.$refs.form.validate()
      let staffResult = Object({
        username: this.staff.username,
        email: this.staff.email,
        memo: this.staff.memo,
      })
      if (this.staff.password) {
        staffResult = Object({
          ...staffResult,
          password: this.staff.password
        })
      }
      if (isValid) {
        if (this.staff.id) {
        this.$http.put(`${api.staff}${this.staff.id}/`, staffResult).then(() => {
          this.$refs.pulling.rebase()
          this.snackbar = {
            color: 'success',
            show: true,
            text: `${this.$t('actions.update')} - ${this.$t('nav.staff')}: ${this.$t('status.success')}`
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
        this.$http.post(api.staff, staffResult).then(() => {
          this.snackbar = {
            color: 'success',
            show: true,
            text: `${this.$t('actions.add')} - ${this.$t('nav.staff')}: ${this.$t('status.success')}`
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
    updateStaff(item) {
      Object.assign(this.staff, {
        id: item.id,
        username: item.user.username,
        password: item.password,
        memo: item.memo
      })
      this.username = this.staff.username
      this.showForm = true
    },
    deleteStaff(id) {
      this.$http.delete(api.staff + id + '/').then(() => {
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
      this.$http.put(api.staff + id + '/', {
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
      this.staff.id = ''
      this.staff.username = ''
      this.staff.password=''
      this.staff.memo = ''
      this.username = ''
      this.submitting = false
      this.$refs.form.reset()
      this.showForm = false
    },
    queryData(queryset) {
      this.querySet = queryset
    },
    queryParam(query) {
      this.query = query
    }
  }
}
</script>