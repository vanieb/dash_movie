<template>
  <v-layout wrap>
    <v-container v-if="loading">
      <v-layout justify-center align-center>
        <v-progress-circular indeterminate color="blue"></v-progress-circular>
      </v-layout>
    </v-container>
    <v-container v-else>
      <v-layout justify-start>
        <v-breadcrumbs :items="bread_crumbs" style="padding:12px;">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item exact :to="item.to" :disabled="item.disabled">
              {{ item.text }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-layout>
      <validation-observer ref="form">
        <v-card>
          <v-container mt5>
            <small>*{{ $t("errors.required") }}</small>
            <v-row class="ml-1 mr-8">
              <v-col cols="12" md="8">
                <v-row>
                  <validation-provider
                    style="width:748px;"
                    rules="required"
                    :name="$t('common.name')"
                  >
                    <v-text-field
                      :error-messages="errors"
                      required
                      :label="`${$t('common.name')}*`"
                      placeholder=" "
                      prepend-icon="title"
                      v-model="website.name"
                      slot-scope="{ errors }"
                      dense
                      outlined
                    >
                    </v-text-field>
                  </validation-provider>
                  <v-spacer></v-spacer>
                </v-row>
                <v-row>
                  <validation-provider
                    style="width:740px;"
                    rules="max:50"
                    :name="$t('common.remarks')"
                  >
                    <v-textarea
                      prepend-icon="notes"
                      outlined
                      :counter="50"
                      v-model="website.memo"
                      rows="2"
                      placeholder=" "
                      :label="`${$t('common.remarks')}`"
                      dense
                    >
                    </v-textarea>
                  </validation-provider>
                  <v-spacer style="min-width: 232px !important; "></v-spacer>
                </v-row>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="12" md="3">
                <v-banner color="primary" dark>
                  {{ $t("actions.upload") }} - {{ $t("common.icon") }}
                </v-banner>
                <v-card>
                  <v-card-text>
                    <v-img
                      v-if="showImage"
                      :src="`${website.imageURI}`"
                      class="my-1"
                      contain
                      height="100"
                    ></v-img>
                  </v-card-text>
                  <v-card-actions>
                    <v-layout justify-center>
                      <v-btn color="blue" @click="$refs.inputUpload.click()">
                        <v-icon color="white">cloud_upload</v-icon>
                      </v-btn>
                      <input
                        v-show="false"
                        ref="inputUpload"
                        type="file"
                        accept="image/*"
                        @change="uploadIcon"
                      />
                    </v-layout>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
            <v-spacer></v-spacer>
            <v-layout justify-start mt-3>
              <v-btn
                color="primary"
                dark
                :loading="submitting"
                @click="saveWebsite"
                >{{ $t("actions.save") }}</v-btn
              >
            </v-layout>
          </v-container>
        </v-card>
      </validation-observer>
      <!-- SNACKBAR -->
      <snack-bar
        :show="snackbar.show"
        :color="snackbar.color"
        :text="snackbar.text"
      >
      </snack-bar>
    </v-container>
  </v-layout>
</template>
<script>
import api from "@/api/apis";
import SnackBar from "@/components/SnackBar";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "WebsiteForm",
  components: {
    ValidationObserver,
    ValidationProvider,
    SnackBar,
  },
  data() {
    return {
      id: "",
      showImage: false,
      lang: "",
      websiteApi: api.websites,
      loading: false,
      submitting: false,
      snackbar: {
        color: "",
        text: "",
        show: false,
      },
      bread_crumbs: [
        {
          text: this.$t("nav.websites"),
          disabled: false,
          to: "/websites",
        },
        {
          text: this.$route.meta.title,
          disabled: true,
        },
      ],
      website: {},
      uploadLoading: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      let websiteId = to.params.websiteId;
      if (websiteId) {
        vm.getWebsiteDetails(websiteId);
      }
    });
  },
  computed: {
    isUpdate() {
      return this.id ? true : false;
    },
  },
  methods: {
    getWebsiteDetails(id) {
      this.id = id;
      this.$http.get(`${this.websiteApi}${id}/`).then((response) => {
        this.website = response;
        if (this.website.icon) {
          this.showImage = true;
          this.website.imageURI = this.website.icon;
          this.change_icon = false;
        }
      });
      this.loading = false;
    },
    uploadIcon(e) {
      // file size must less than 1mb
      if (e.target.files[0].size > 1 * 1000 * 1000) {
        e.target.value = "";
        this.snackbar = {
          color: "red",
          show: true,
          text: `${this.$t("system_msg.error")}: ${this.$t(
            "system_msg.exceed_file_size"
          )}`,
        };
        return;
      }

      const fileRead = new FileReader();
      fileRead.onload = (e) => {
        this.showImage = false;
        this.website.imageURI = e.target.result;
        this.showImage = true;
      };
      fileRead.readAsDataURL(e.target.files[0]);

      this.website.icon = e.target.files[0];
      this.change_icon = true;
    },
    async saveWebsite() {
      this.snackbar.show = false;
      const isValid = await this.$refs.form.validate();
      if (isValid) {
        let formData = new window.FormData();
        if (this.change_icon) {
          formData.set("icon", this.website.icon);
        }
        // String Fields
        formData.set("name", this.website.name);
        formData.set(
          "memo",
          this.website.memo !== undefined ? this.website.memo : ""
        );
        if (this.isUpdate) {
          this.$http
            .put(`${this.websiteApi}${this.website.id}/`, formData)
            .then(
              () => {
                this.snackbar = {
                  color: "success",
                  show: true,
                  text: `${this.$t("actions.update")} - ${this.$t(
                    "nav.websites"
                  )}: ${this.$t("status.success")}`,
                };
                this.$router.push(`/websites`);
              },
              (error) => {
                this.snackbar = {
                  color: "red",
                  show: true,
                  text: error,
                };
              }
            );
        }
      } else {
        window.scrollTo(500, 0);
      }
    },
  },
};
</script>
