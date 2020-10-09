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
            :to="`/staff/${staff.id}/edit`"
            v-if="$root.permissions.includes('change_staff')"
            >
            <v-icon class="mr-3">edit</v-icon> &nbsp;{{ $t('actions.update') }}
          </v-btn>
        </v-layout>
      </v-layout>
      <v-card>
        <v-container>
          <v-row>
            <v-col cols="12" md="2">
              <v-avatar color="indigo" size="80" class="profile ml-10">
                <v-icon dark size="60">mdi-account-circle</v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="12" md="3">
              <v-row class="mb-2">
                <span class="title"><strong>{{staff.user.username}}</strong></span>
              </v-row>
              <v-row>
                <v-icon class="mr-2 m-b-sm" color="error">person_add</v-icon>{{staff.created_by }}
              </v-row>
              <v-row>
                <v-icon class="mr-2 m-b-sm ml-8" color="success" small>event</v-icon><small >{{staff.created_at | moment("YYYY-MM-DD HH:mm:ss") }}</small>
              </v-row>
              <v-row>
                <v-icon class="mr-2 m-b-sm" color="primary lighten-1">edit</v-icon>{{staff.updated_by }}
              </v-row>
              <v-row>
                <v-icon class="mr-2 m-b-sm ml-8" color="success" small>event</v-icon><small >{{staff.updated_at | moment("YYYY-MM-DD HH:mm:ss") }}</small>
              </v-row>
            </v-col>
            <v-col cols="12" md="7">
              <span v-if="staff.status===1">
                <v-icon color="success" class="mr-2">check_box</v-icon>
                <v-chip class="ma-1" color="success" small>{{$t('status.enabled')}}</v-chip>
                <br/>
              </span>
              <span v-else>
                <v-icon color="gray" class="mr-2">indeterminate_check_box</v-icon>
                <v-chip class="ma-1" small>{{$t('status.disabled')}}</v-chip>
                <br/>
              </span>
                <v-icon color="gray" class="ml-0 mr-2 m-b-sm">notes</v-icon>
                {{staff.memo || "-"}}
            </v-col>
          </v-row>
          <v-banner color="primary" dark>{{$t('staff.permissions')}}</v-banner>
          <ul v-for="permission in permissions" :key="permission.id" v-show="showPermissions">
            <!-- <div d-inline-block>
              <v-checkbox
                :label="`${permission.name} - ${permission.code}`"
                v-model="permission.checked"
                :key="permission.code"
                disabled
                hide-details=true>
              </v-checkbox>
              <span>{{ `${permission.name} - ${permission.code}`}}</span>
            </div> -->
            <v-card-title
              v-if="permission.checked"
              :key="permission.code"
              v-text="permission.name"
            ></v-card-title>
              <ul v-for="item in permission.permissions" :key="item.code" >
                <li class="ml-6" v-if="item.checked">
                <!-- <v-checkbox
                  class="ml-6 mb-0"
                  :label="`${item.name} - ${item.description} - ${item.code}`"
                  v-model="item.checked"
                  :key="item.code"
                  disabled
                  hide-details=true>
                </v-checkbox> -->
                <span>{{item.name}}</span> -
                <strong class="grey--text">{{item.description}} - {{item.code}}</strong>
                </li>
            </ul>
          </ul>
          <v-layout v-show="!showPermissions" class="align-center justify-center ma-2">
            <span class="grey--text" small>{{$t('system_msg.no_permission_set')}}</span>
          </v-layout>
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
// import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
  components: {
    // ValidationObserver,
    // ValidationProvider,
    SnackBar
  },
  name: 'Staff',
  data() {
    return {
      submitting: false,
      id: '',
      staff: {
        id: '',
        user: {
          username: ''
        },
        password: '',
        memo: ''
      },
      permissions: [],
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
          text: this.$t('nav.staff_details'),
          disabled: true
        }
      ]
    }
  },
  computed: {
    isUpdate() {
      return this.id ? true : false
    },
    showPermissions() {
      for (let list in this.permissions) {
        for (let index in this.permissions[list].permissions) {
          if (this.permissions[list].permissions[index].checked) {
           return true
          }
        }
      }
      return false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let staffId = to.params.staffId
      if (staffId) {
        vm.getStaffDetails(staffId)
        vm.getStaffPermissions(staffId)
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
    getStaffPermissions(id) {
      this.$http.get(`${this.staffApi}permissions/${id}/?opt_expand=permissions`).then((response) => {
        this.permissions = response.permissions
      })
    },
    async saveStaff() {
      const isValid = await this.$refs.form.validate()
      let staffResult = Object({
        username: this.staff.user.username,
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
        this.$http.put(`${this.staffApi}${this.staff.id}/`, staffResult).then((response) => {
          this.snackbar = {
            color: 'success',
            show: true,
            text: `${this.$t('actions.update')} - ${this.$t('nav.staff')}: ${this.$t('status.success')}`
          }
          this.$router.push(`/staff/${response.id}`)
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