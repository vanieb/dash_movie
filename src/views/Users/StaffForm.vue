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
      staff: {
        id: '',
        user: {
          username: ''
        },
        password: '',
        memo: ''
      },
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