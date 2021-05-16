<template>
  <v-layout wrap>
    <v-container>
      <v-flex>
        <validation-observer ref="form">
          <!-- FORM INPUTS -->
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12>
                <validation-provider
                  rules="required|min:6|max:15"
                  :name="$t('change_password.old_password')"
                >
                  <v-text-field
                    :counter="15"
                    :error-messages="errors"
                    :label="`${$t('change_password.old_password')}*`"
                    placeholder=" "
                    required
                    outlined
                    clearable
                    dense
                    color="blue-grey"
                    :append-icon="show.old_password ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show.old_password ? 'text' : 'password'"
                    @click:append="show.old_password = !show.old_password"
                    clear-icon="close"
                    slot-scope="{ errors }"
                    v-model="user.old_password"
                  ></v-text-field>
                </validation-provider>
              </v-flex>
              <v-flex xs12>
                <validation-provider
                  rules="required|min:6|max:15"
                  :name="$t('change_password.new_password')"
                >
                  <v-text-field
                    color="blue-grey"
                    :counter="15"
                    :error-messages="errors"
                    :label="`${$t('change_password.new_password')}*`"
                    placeholder=" "
                    required
                    outlined
                    clearable
                    dense
                    :append-icon="show.new_password ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show.new_password ? 'text' : 'password'"
                    @click:append="show.new_password = !show.new_password"
                    clear-icon="close"
                    slot-scope="{ errors }"
                    v-model="user.new_password"
                  ></v-text-field>
                </validation-provider>
                <validation-provider
                  rules="required|min:6|max:15"
                  :name="$t('change_password.confirm_password')"
                >
                  <v-text-field
                    :counter="15"
                    :error-messages="errors"
                    :label="`${$t('change_password.confirm_password')}*`"
                    placeholder=" "
                    required
                    outlined
                    dense
                    clearable
                    color="blue-grey"
                    :append-icon="
                      show.confirm_password ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    :type="show.confirm_password ? 'text' : 'password'"
                    @click:append="
                      show.confirm_password = !show.confirm_password
                    "
                    clear-icon="close"
                    slot-scope="{ errors }"
                    v-model="user.confirm_password"
                  ></v-text-field>

                </validation-provider>
                <small v-if="!samePassword" class="error--text">{{$t("errors.password_not_same")}}</small>
              </v-flex>
            </v-layout>
            <small color="error">*{{ $t("errors.required") }}</small>
          </v-card-text>
          <!-- BUTTONS -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey lighten-1" @click="clear">{{
              $t("actions.clear")
            }}</v-btn>
            <v-btn
              color="blue-grey"
              class="white--text"
              :loading="loading"
              :disabled="!samePassword"
              @click="changePassword()"
              >{{ $t("actions.reset") }}</v-btn
            >
          </v-card-actions>
        </validation-observer>
      </v-flex>
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
import api from "@/api/apis";
import SnackBar from "@/components/SnackBar";
// import VueCookie from "vue-cookie";
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  components: {
    ValidationObserver,
    ValidationProvider,
    SnackBar,
  },
  data() {
    return {
      changePasswordApi: api.changePassword,
      loading: false,
      user: {
        old_password: "",
        new_password: "",
        confirm_password: "",
      },
      snackbar: {
        color: "",
        text: "",
        show: false,
      },
      show: {
        old_password: false,
        new_password: false,
        confirm_password: false,
      },
    };
  },
  computed: {
    samePassword() {
      return this.user.new_password == this.user.confirm_password
    }
  },
  methods: {
    changePassword() {
      let formData = new window.FormData();
      formData.set('old_password', this.user.old_password)
      formData.set('new_password', this.user.new_password)
      this.$http.put(this.changePasswordApi, formData).then(
        () => {
          setTimeout(() => {
            this.$router.push("/login");
            this.$cookie.delete("access_token");
            this.$cookie.delete("refresh_token");
            this.$cookie.delete("username");
          }, 2000);
          this.snackbar = {
            color: "success",
            show: true,
            text: `${this.$t("actions.reset")} ${this.$t(
              "login.password"
            )}: ${this.$t("status.success")}`,
          };
        },
        (error) => {
          this.snackbar = {
            color: "error",
            show: true,
            text: `${this.$t("system_msg.error")}: ${error}`,
          };
        }
      );
      this.snackbar.show = false;
    },
    clear() {
      this.user.old_password = "";
      this.user.new_password = "";
      this.user.confirm_password = "";
      this.$refs.form.reset();
    },
  },
};
</script>
