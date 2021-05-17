<template>
  <v-layout justify-center row pt-5 mt-5>
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="3">
            <v-card class="elevation-12" color="blue-grey">
              <v-tabs
                background-color="transparent"
                color="white"
                centered
                v-model="active_tab"
              >
                <v-tab key="login">
                  {{ $t("nav.login") }}
                </v-tab>
                <v-tab>
                  {{ $t("nav.register") }}
                </v-tab>
                <v-tab-item>
                  <v-card-text style="padding-bottom:0px !important;">
                    <v-form>
                      <v-text-field
                        :label="`${this.$t('login.username')}`"
                        name="login"
                        prepend-icon="person"
                        type="text"
                        color="blue-grey"
                        :rules="[rules.required]"
                        v-model="user.username"
                      ></v-text-field>
                      <v-text-field
                        color="blue-grey"
                        v-model="user.password"
                        id="password"
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPassword ? 'text' : 'password'"
                        :label="`${this.$t('login.password')}`"
                        name="password"
                        prepend-icon="lock"
                        :rules="[rules.required]"
                        @click:append="showPassword = !showPassword"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-card-actions class="justify-center align-center">
                    <v-spacer></v-spacer>
                    <v-btn class="blue-grey white--text" @click="login">{{
                      $t("nav.login")
                    }}</v-btn>
                  </v-card-actions>
                </v-tab-item>
                <v-tab-item>
                  <v-card-text style="padding-bottom:0px !important;">
                    <v-form>
                      <v-text-field
                        :label="`${this.$t('login.username')}`"
                        name="registerUser"
                        prepend-icon="person"
                        type="text"
                        color="blue-grey"
                        :rules="[rules.required]"
                        v-model="register.username"
                      ></v-text-field>
                      <v-text-field
                        color="blue-grey"
                        v-model="register.password"
                        id="registerPassword"
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPassword ? 'text' : 'password'"
                        :label="`${this.$t('login.password')}`"
                        name="registerPassword"
                        prepend-icon="lock"
                        :rules="[rules.required]"
                        @click:append="showPassword = !showPassword"
                      ></v-text-field>
                      <v-text-field
                        color="blue-grey"
                        v-model="register.confirm_password"
                        id="password"
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPassword ? 'text' : 'password'"
                        :label="`${this.$t('login.confirm_password')}`"
                        name="registerConfirmPassword"
                        prepend-icon="enhanced_encryption"
                        :rules="[rules.required]"
                        @click:append="showPassword = !showPassword"
                      ></v-text-field>
                      <small v-if="!samePassword" class="error--text">{{
                        $t("errors.password_not_same")
                      }}</small>
                    </v-form>
                  </v-card-text>
                  <v-card-actions class="justify-center align-center">
                    <v-spacer></v-spacer>
                    <v-btn
                      class="blue-grey white--text"
                      @click="registerUser"
                      :disabled="!samePassword"
                      >{{ $t("nav.register") }}</v-btn
                    >
                  </v-card-actions>
                </v-tab-item>
              </v-tabs>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
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
// import qs from "qs";
import axios from "axios";
import SnackBar from "@/components/SnackBar";
export default {
  name: "Login",
  components: {
    SnackBar,
  },
  data() {
    return {
      user: {
        username: "",
        password: "",
        grant_type: "password",
        scope: "all",
      },
      active_tab: "login",
      register: {
        username: "",
        password: "",
        confirm_password: "",
      },
      showPassword: false,
      snackbar: {
        color: "",
        text: "",
        show: false,
      },
      rules: {
        required: (value) => !!value || this.$t("errors.required"),
      },
    };
  },
  computed: {
    samePassword() {
      return this.register.password == this.register.confirm_password;
    },
  },
  methods: {
    login() {
      let user = new window.FormData();
      user.set("grant_type", "password");
      user.set("scope", "all");
      user.set("username", this.user.username);
      user.set("password", this.user.password);


      this.$http.post(api.token, user).then(
        (data) => {
          var today = new Date();
          var dd = String(today.getDate()).padStart(2, "0");
          var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
          var yyyy = today.getFullYear();
          var current_time =
            yyyy +
            "-" +
            mm +
            "-" +
            dd +
            " " +
            today.getHours() +
            ":" +
            today.getMinutes() +
            ":" +
            today.getSeconds();
          var expiry_time = new Date(current_time);
          console.log(
            expiry_time.setSeconds(expiry_time.getSeconds() + data.expires_in)
          );

          if (data.access_token) {
            window.document.cookie =
              "access_token=" +
              data.access_token +
              ";path=/;expires=" +
              expiry_time.toGMTString();
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + data.access_token;
          }
          if (data.refresh_token) {
            window.document.cookie =
              "refresh_token=" +
              data.refresh_token +
              ";path=/;expires=" +
              expiry_time.toGMTString();
          }
          window.document.cookie = "username=" + this.user.username;
          // if (data.type) {
          //   window.document.cookie = "user_type=" + data.type;
          // }
          this.$root.getMy();
          let url = this.$route.query.next;
          url = url ? decodeURIComponent(url.split("?")[0]) : "/movies";
          this.$router.push(url);
        },
        () => {
          this.snackbar = {
            color: "red",
            show: true,
            text: "Invalid Credentials or User is deactivated. Please contact dashboard administrator.",
          };
        }
      );
      this.snackbar = {
        color: "",
        text: "",
        show: false,
      };
    },
    registerUser() {
      if (this.samePassword) {
        let newUser = Object({
          username: this.register.username,
          password: this.register.password,
        });
        axios.post(api.register, newUser).then(
          (data) => {
            this.active_tab = "login";
            this.user.username = data.username;
            this.user.password = data.password;
          },
          (error) => {
            this.snackbar = {
              color: "red",
              show: true,
              text: error,
            };
          }
        );
      } else {
        return;
      }
    },
  },
};
</script>
<style scoped lang="scss">
.form-title {
  background-color: #607d8b;
  color: white;
  height: 50px;
  padding: 10px 12px 10px;
}
</style>
