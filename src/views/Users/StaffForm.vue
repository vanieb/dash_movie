<template>
  <v-layout wrap>
    <v-container>
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
      <v-card>
      <v-container>
        <validation-observer ref="form">
          <small class="error--text">*{{ $t('errors.required') }}</small>
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
                    v-model="staff.user.username"
                    outlined
                    dense
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
                    outlined
                    dense
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
                    outlined
                    dense
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
                    outlined
                    dense
                  ></v-textarea>
                </validation-provider>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-banner color="primary" dark v-if="$root.permissions.includes('change_staff_permission') && $root.role==='superadmin'">{{$t('staff.permissions')}}</v-banner>
          <v-layout class="ma-2" justify-end v-if="$root.permissions.includes('change_staff_permission') && $root.role==='superadmin'">
            <v-chip class="ma-1" :color="selectAllColor" @click="selectPermission('all')">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small class="ma-1">check_box</v-icon>
                  <span v-on="on">{{$t('staff.select_all')}}</span>
                </template>
                <span>{{$t('system_notes.select_all_permissions')}}</span>
              </v-tooltip>
              </v-chip>
            <v-chip class="ma-1" :color="deselectAllColor" @click="selectPermission('deselect')">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small class="ma-1">check_box_outline_blank</v-icon>
                  <span v-on="on">{{$t('staff.deselect_all')}}</span>
                </template>
                <span>{{$t('system_notes.deselect_all_permissions')}}</span>
              </v-tooltip>
            </v-chip>
            <v-chip class="ma-1" :color="superAdminColor" @click="excludePermission()">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small class="ma-1">supervised_user_circle</v-icon>
                  <span v-on="on">{{$t('staff.superadmin')}}</span>
                </template>
                <span>{{$t('system_notes.superadmin_def')}}</span>
              </v-tooltip>
            </v-chip>
            <v-chip class="ma-1" :color="adminColor" @click="excludePermission('staff')">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" small class="ma-1">person</v-icon>
                  <span v-on="on">{{$t('staff.admin')}}</span>
                </template>
                <span>{{$t('system_notes.admin_def')}}</span>
              </v-tooltip>
            </v-chip>
          </v-layout>
          <v-container v-show="$root.permissions.includes('change_staff_permission')">
            <template v-for="(list, index) in permissions">
              <v-checkbox
                :label="`${list.name}`"
                v-model="list.checked"
                :key="list.code"
                @click.native="selectAllPermissions(index)"
                hide-details=true>
              </v-checkbox>
              <span v-for="permission in list.permissions" :key="permission.code">
                <div v-if="permission.code == 'change_staff_permission' ">
                  <v-checkbox
                    v-show="$root.role==='superadmin' || !isUpdate"
                    class="ml-6 mb-0"
                    :label="`${permission.name} - ${permission.description} - ${permission.code}`"
                    v-model="permission.checked"
                    :key="permission.code"
                    hide-details=true>
                  </v-checkbox>
                </div>
                <div v-else>
                  <v-checkbox
                    class="ml-6 mb-0"
                    :label="`${permission.name} - ${permission.description} - ${permission.code}`"
                    v-model="permission.checked"
                    :key="permission.code"
                    hide-details=true>
                  </v-checkbox>
                </div>
              </span>
            </template>
          </v-container>
          <!-- BUTTONS -->
          <v-layout justify-start>
            <v-btn
              color="primary"
              dark
              :loading="submitting"
              @click="saveStaff"
            >{{ $t('actions.save') }}</v-btn>
          </v-layout>
        </validation-observer>
      </v-container>
      </v-card>
    </v-container>
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
import SnackBar from '@/components/SnackBar'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
    SnackBar
  },
  name: 'Staff',
  data() {
    return {
      submitting: false,
      id: '',
      permissions: [],
      staff: {
        id: '',
        user: {
          username: ''
        },
        password: '',
        memo: ''
      },
      selectAllColor: '',
      deselectAllColor: '',
      superAdminColor: '',
      adminColor: '',
      staffApi: api.staff,
      snackbar: {
        color: '',
        text: '',
        show: false,
      },
      bread_crumbs: [{
          text: this.$t('nav.staff'),
          disabled: false,
          to: '/staff'
        },
        {
          text: this.$route.meta.title,
          disabled: true
        }
      ]
    }
  },
  computed: {
    isUpdate() {
      return this.id ? true : false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let staffId = to.params.staffId
      if (staffId) {
        vm.getStaffDetails(staffId)
        vm.getStaffPermissions(staffId)
      } else {
        vm.getPermissionsList()
      }
    })
  },
  methods: {
    getStaffDetails(id) {
      this.id = id
      this.$http.get(`${this.staffApi}${id }/`).then((response) => {
        this.staff = response
      })
      this.loading = false
    },
    getPermissionsList () {
      this.$http.get(api.permissions + '?opt_expand=permissions').then((response) => {
        this.permissions = response.results
      })
    },
    getStaffPermissions(id) {
      this.$http.get(`${this.staffApi}permissions/${id}/?opt_expand=permissions`).then((response) => {
        this.permissions = response.permissions
      })
    },
    selectAllPermissions (list) {
      this.permissions[list].checked = this.permissions[list].checked ? true : false
      for (let index in this.permissions[list].permissions) {
        this.permissions[list].permissions[index].checked = this.permissions[list].checked ? true : false
      }
    },
    excludePermission (exclude='') {
      this.selectAllColor =  ''
      this.deselectAllColor = ''
      this.superAdminColor = !exclude ? 'primary lighten-1' : ''
      this.adminColor = exclude ? 'primary lighten-1' : ''
      for (let list in this.permissions) {
        if (exclude !== this.permissions[list].code) {
          this.permissions[list].checked = true
          for (let index in this.permissions[list].permissions) {
            this.permissions[list].permissions[index].checked = true
          }
        } else {
          this.permissions[list].checked = false
          for (let index in this.permissions[list].permissions) {
            this.permissions[list].permissions[index].checked = false
          }
        }
      }
    },
    selectPermission (mode='all') {
      this.superAdminColor = ''
      this.adminColor = ''
      for (let list in this.permissions) {
        this.permissions[list].checked = mode=='all' ? true : false
        this.selectAllColor = mode=='all' ? 'primary lighten-1' : ''
        this.deselectAllColor = mode !='all' ? 'primary lighten-1' : ''
        for (let index in this.permissions[list].permissions) {
          this.permissions[list].permissions[index].checked = mode=='all' ? true : false
        }
      }
    },
    getSelect () {
      let selectId = []
      for (let list in this.permissions) {
        for (let index in this.permissions[list].permissions) {
          if (this.permissions[list].permissions[index].checked) {
            selectId.push(this.permissions[list].permissions[index].id)
          }
        }
      }
      this.staff.permissions = selectId
    },
    async saveStaff() {
      const isValid = await this.$refs.form.validate()
      this.getSelect()
      let staffResult = Object({
        username: this.staff.user.username,
        memo: this.staff.memo,
        permissions: this.staff.permissions
      })
      if (this.staff.password) {
        staffResult = Object({
          ...staffResult,
          password: this.staff.password
        })
      }
      if (isValid) {
        if (this.staff.id) {
        this.$http.put(`${this.staffApi}${this.staff.id}/`, staffResult).then((response) => {
          this.snackbar = {
            color: 'success',
            show: true,
            text: `${this.$t('actions.update')} - ${this.$t('nav.staff')}: ${this.$t('status.success')}`
          }
          this.$router.push(`/staff/${response.id}`)
          this.$root.getPermissions()
        }, error => {
          this.snackbar = {
            color: 'red',
            show: true,
            text: error
          }
        })
      } else {
        this.$http.post(this.staffApi, staffResult).then((response) => {
          this.snackbar = {
            color: 'success',
            show: true,
            text: `${this.$t('actions.add')} - ${this.$t('nav.staff')}: ${this.$t('status.success')}`
          }
          this.$router.push(`/staff/${response.id}`)
        }, error => {
          this.snackbar = {
            color: 'red',
            show: true,
            text: error
          }
        })
        }
      }
      this.snackbar.show=false
    }
  }
}
</script>