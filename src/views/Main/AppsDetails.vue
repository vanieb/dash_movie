<template>
  <v-layout wrap>
    <validation-observer ref="form">
      <v-dialog v-model="showUpdateStatusDialog" persistent max-width="600">
        <v-card>
          <v-card-title v-if="status === 'approved'">
            <v-icon left color="success">check</v-icon>
            {{ $t("actions.approve") }} - {{ $t("nav.apps") }}
          </v-card-title>
          <v-card-title v-else-if="status === 'review'">
            <v-icon left color="warning">visibility</v-icon>
            {{ $t("status.review") }} - {{ $t("nav.apps") }}
          </v-card-title>
          <v-card-title v-else-if="status === 'publish'">
            <v-icon left color="success">publish</v-icon>
            {{ $t("actions.publish") }} - {{ $t("nav.apps") }}
          </v-card-title>
          <v-card-title v-else>
            <v-icon left color="error">close</v-icon>
            {{ $t("actions.decline") }} - {{ $t("nav.apps") }}
          </v-card-title>
          <v-card-text>
            <div class="black--text">
              <strong>{{ dialog.title }}</strong>
            </div>
            <v-icon left small color="indigo">person</v-icon>
            <span>{{ dialog.created_by }}</span> <br />
            <v-icon left small color="indigo">event</v-icon>
            <span>{{ dialog.created_at | moment("YYYY-MM-DD HH:mm:ss") }}</span>
          </v-card-text>
          <v-card-text v-if="status != 'publish' && status != 'review'">
            <small v-if="status === 'cancelled'"
              >{{ $t("system_notes.decline_memo") }}
            </small>
            <validation-provider
              :rules="{
                max: 50,
                required: status === 'cancelled' ? true : false,
              }"
              :name="$t('common.remarks')"
            >
              <v-textarea
                outlined
                :error-messages="errors"
                :label="
                  status === 'approved'
                    ? `${$t('common.remarks')}`
                    : `${$t('common.remarks')}*`
                "
                slot-scope="{ errors }"
                v-model="dialog.memo"
                placeholder=""
                :counter="50"
              >
              </v-textarea>
            </validation-provider>
            <small v-if="status !== 'approved'" class="error--text"
              >* Required</small
            >
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="grey lighten-1" @click="closeUpdateStatusDialog()"
              >{{ $t("actions.cancel") }}
            </v-btn>
            <v-btn color="primary" dark @click="updateStatus(dialog)">
              <span>{{ $t("actions.submit") }}</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </validation-observer>
    <v-container v-if="loading">
      <v-layout justify-center align-center>
        <v-progress-circular indeterminate color="blue"></v-progress-circular>
      </v-layout>
    </v-container>
    <v-container v-else>
      <v-layout>
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
        <v-layout justify-end>
          <v-btn
            color="primary"
            dark
            :to="`/apps/${apps.slug}/edit`"
            v-if="$root.permissions.includes('change_app')"
          >
            <v-icon left>edit</v-icon> &nbsp;{{ $t("actions.update") }}
          </v-btn>
        </v-layout>
      </v-layout>
      <v-card>
        <v-container>
          <v-banner single-line>
            <span class="title"
              ><strong>{{ apps.name }}</strong></span
            >
            <template
              v-slot:actions
              v-if="
                $root.permissions.includes('change_app_submission_status') ||
                  $root.permissions.includes('change_app_status_approved') ||
                  $root.permissions.includes('change_app_status_declined')
              "
            >
              <v-chip
                class="success lighten-1"
                dark
                small
                v-if="
                  apps.status === 'review' &&
                    $root.permissions.includes('change_app_status_approved')
                "
                :disabled="!apps.keywords || apps.keywords === 'undefined'"
                @click="openStatusDialog(apps, 'approved')"
              >
                <v-icon left small>check</v-icon>
                {{ $t("actions.approve") }}
              </v-chip>
              <v-chip
                class="ml-1 error lighten-1"
                dark
                small
                v-if="
                  apps.status === 'review' &&
                    $root.permissions.includes('change_app_status_declined')
                "
                @click="openStatusDialog(apps, 'cancelled')"
              >
                <v-icon left small>close</v-icon>
                {{ $t("actions.decline") }}
              </v-chip>
              <v-chip
                class="warning lighten-1"
                dark
                small
                v-if="
                  apps.status == 'draft' &&
                    $root.permissions.includes('change_app_submission_status')
                "
                @click="openStatusDialog(apps, 'review')"
              >
                <v-icon small left>visibility</v-icon>
                {{ $t("status.review") }}
              </v-chip>
              <v-chip
                class="ml-2 success lighten-1"
                dark
                small
                v-if="
                  apps.status == 'draft' &&
                    $root.permissions.includes('change_app_status_approved')
                "
                @click="openStatusDialog(apps, 'publish')"
              >
                <v-icon small left>publish</v-icon>
                {{ $t("actions.publish") }}
              </v-chip>
              <span class="success--text" v-else-if="apps.status == 'approved'">
                {{ $t("status.published") }}
              </span>
              <span class="error--text" v-else-if="apps.status == 'cancelled'">
                {{ $t("status.declined") }}
              </span>
            </template>
            <v-layout>
              <small
                class="error--text"
                v-if="!apps.keywords || apps.keywords == 'undefined'"
                >{{ $t("seo.keywords") }}: {{ $t("system_msg.not_set") }}</small
              >
            </v-layout>
          </v-banner>
          <v-row>
            <v-col cols="12" md="2">
              <v-img
                v-if="apps.icon"
                :src="`${apps.icon}`"
                class="my-1"
                contain
                height="100"
              />
              <v-avatar v-else class="profile ml-10" contain size="100" tile
                ><v-icon size="120">photo</v-icon>
              </v-avatar>
              <v-layout justify-center mb5 v-if="!apps.icon">
                <small
                  >{{ $t("common.icon") }}:
                  {{ $t("system_msg.not_set") }}</small
                >
              </v-layout>
              <v-layout justify-center mb5>
                <v-rating
                  x-small
                  dense
                  color="warning"
                  v-model="apps.star"
                  disabled="true"
                  >{{ apps.star }}
                </v-rating>
              </v-layout>
            </v-col>
            <v-col cols="12" md="4">
              <v-row>
                <strong class="title" style="font-weight=0px; !important"
                  >{{ apps.name }}
                </strong>
              </v-row>
              <v-row class="mb-1">
                <small
                  >{{ $t("apps.version") }}:
                  {{ apps.version || $t("system_msg.no_data") }} |
                  {{ apps.size_mb }} MB</small
                >
              </v-row>
              <v-row>
                <v-icon left class="m-b-sm" small color="indigo"
                  >person_add</v-icon
                ><small
                  >{{ apps.created_by || "-" }} |
                  {{ apps.created_at | moment("YYYY-MM-DD HH:mm:ss") }}</small
                >
              </v-row>
              <v-row>
                <v-icon left class="m-b-sm" small color="indigo">edit</v-icon
                ><small
                  >{{ apps.updated_by || "-" }} |
                  {{ apps.updated_at | moment("YYYY-MM-DD HH:mm:ss") }}</small
                >
              </v-row>
              <!-- <v-row class="mb-1">
                <small
                  ><v-icon left dense>event</v-icon
                  >{{ apps.created_at | moment("YYYY-MM-DD HH:mm:ss") }}</small
                >
              </v-row>
              <v-row class="mb-1">
                <small
                  ><v-icon left dense>person</v-icon
                  >{{ apps.created_by || "-" }}</small
                >
              </v-row> -->
              <!-- Will be added after likes and comments feature implementation -->
              <!-- <v-row>
              <v-chip small class="ma-1" outlined color="primary lighten-1"><v-icon left small>thumb_up</v-icon>6</v-chip>
              <v-chip small class="ma-1" outlined color="primary lighten-1"><v-icon small>comments</v-icon>6</v-chip>
            </v-row> -->
            </v-col>
            <v-col cols="12" md="4">
              <v-icon color="warning" left>web</v-icon>{{ $t("apps.website") }}:
              <v-chip
                class="ma-1"
                color="warning"
                outlined
                v-if="apps.website"
                small
                >{{ apps.website.name }}</v-chip
              >
              <span v-else> {{ $t("system_msg.no_data") }}</span>
              <br />
              <v-icon color="grey" left>notes</v-icon
              >{{ $t("common.remarks") }}:
              <span>{{ apps.memo || "-" }}</span>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
          <v-layout>
            <v-card-title>{{ $t("apps.classification") }}</v-card-title>
          </v-layout>
          <v-simple-table v-if="classification">
            <thead>
              <tr>
                <th width="20%">{{ $t("apps.type") }}</th>
                <th width="30%">{{ $t("nav.category") }}</th>
                <th width="30%">{{ $t("nav.labels") }}</th>
                <th width="10%">{{ $t("common.status") }}</th>
                <th width="30%">
                  {{ $t("nav.leaderboard") }}/{{ $t("nav.recommended") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in classification" :key="item.id">
                <td>{{ item.name }}</td>
                <td v-if="item.categories.length > 0">
                  <span v-for="category in item.categories" :key="category.id">
                    <v-chip color="success" small outlined class="ma-1">{{
                      category.name
                    }}</v-chip>
                  </span>
                </td>
                <td v-else>-</td>
                <td v-if="item.labels.length > 0">
                  <span v-for="label in item.labels" :key="label.id">
                    <v-chip color="info" small outlined class="ma-1">{{
                      label.name
                    }}</v-chip>
                  </span>
                </td>
                <td v-else>-</td>
                <td>
                  <span v-if="item.apptype_details">
                    <v-chip
                      v-if="item.apptype_details.is_active"
                      class="ma-1"
                      color="success"
                      dark
                      style="height:20px; !important font-size:11px;"
                    >
                      {{ $t("status.enabled") }}
                    </v-chip>
                    <v-chip
                      v-else
                      class="ma-1"
                      style="height:20px;
                    !important font-size:11px;"
                    >
                      {{ $t("status.disabled") }}
                    </v-chip>
                  </span>
                </td>
                <td class="text-center">
                  <span v-if="item.apptype_details">
                    <v-chip
                      v-if="item.apptype_details.is_rank"
                      class="ma-1"
                      color="error"
                      dark
                      small
                    >
                      <v-icon small left>format_list_numbered</v-icon>
                      {{ $t("nav.leaderboard") }}
                    </v-chip>
                    <span
                      v-if="
                        !item.apptype_details.is_recommended &&
                          !item.apptype_details.is_rank
                      "
                      >-</span
                    >
                    <v-chip
                      v-if="item.apptype_details.is_recommended"
                      class="ma-1"
                      color="error"
                      dark
                      small
                    >
                      <v-icon small left>star_outline</v-icon>
                      {{ $t("nav.recommended") }}
                    </v-chip>
                  </span>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-layout v-else justify-center align-center
            ><small>{{ $t("pagination.no_record") }}</small></v-layout
          >
          <v-layout>
            <v-card-title>{{ $t("apps.download_link") }}</v-card-title>
          </v-layout>
          <v-banner color="primary" dark
            ><v-icon small>android</v-icon>
            {{ $t("apps.android_download_link") }}
            <template v-slot:actions>
              <span class="mr-2">{{ $t("apps.use_download_link") }} </span>
              <v-switch
                class="ma-0"
                dark
                v-model="apps.use_android_link"
                :disabled="!apps.app_file || !apps.download_link"
                @change="
                  toggle(apps.id, apps.use_android_link, 'use_android_link')
                "
                hide-details
              >
              </v-switch>
            </template>
          </v-banner>
          <v-flex>
            <v-card-text>
              <li>
                {{ $t("apps.external_download_link") }}:
                {{ apps.download_link || $t("system_msg.no_data") }}<br />
              </li>
              <li>
                <v-dialog
                  v-model="uploadInstallerDialog"
                  persistent
                  max-width="350"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn color="blue lighten-2" dark class="mr-3" v-on="on">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <span v-on="on">
                            {{ $t("actions.change_file") }}</span
                          >
                        </template>
                        <span>{{
                          $t("system_notes.upload_one_installer_memo")
                        }}</span>
                      </v-tooltip>
                    </v-btn>
                  </template>
                  <v-card :loading="uploadLoading">
                    <validation-observer ref="uploadFileform">
                      <v-card-title>
                        <v-icon class="mr-3">android</v-icon>
                        &nbsp;{{ $t("actions.change_file") }} - Android
                      </v-card-title>
                      <v-card-text>
                        <v-icon small>info</v-icon>&nbsp;&nbsp;
                        <small>{{
                          $t("system_notes.upload_one_installer_memo")
                        }}</small>
                      </v-card-text>
                      <v-card-text>
                        <v-spacer></v-spacer>
                        <validation-provider
                          style="width:310px;"
                          rules="required"
                          :name="$t('common.file')"
                        >
                          <v-file-input
                            outlined
                            dense
                            clearable
                            :error-messages="errors"
                            required
                            slot-scope="{ errors }"
                            v-model="file"
                          >
                          </v-file-input>
                        </validation-provider>
                        <v-progress-linear
                          v-if="uploadLoading"
                          color="light-blue"
                          height="25"
                          v-model="uploadPercentage"
                          striped
                        >
                          <template v-slot="{ value }">
                            <strong>{{ Math.ceil(value) }}%</strong>
                          </template>
                        </v-progress-linear>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="grey lighten-1"
                          :disabled="uploadLoading"
                          @click="uploadInstallerDialog = false"
                          >{{ $t("actions.close") }}
                        </v-btn>
                        <v-btn
                          color="blue darken-1"
                          :disabled="uploadLoading"
                          @click="uploadFile('apk')"
                          >{{ $t("actions.submit") }}
                        </v-btn>
                      </v-card-actions>
                    </validation-observer>
                  </v-card>
                </v-dialog>
                <span
                  >{{ $t("apps.android_download_link") }}:
                  {{ apps.app_file || $t("system_msg.no_data") }}</span
                >
              </li>
            </v-card-text>
          </v-flex>
          <v-banner color="primary" dark
            ><v-icon small>phone_iphone</v-icon>
            {{ $t("apps.ios_download_link") }}</v-banner
          >
          <v-card-text>
            <li>
              <span
                >{{ $t("apps.ios_download_link") }}:
                {{ apps.ios_download_link || $t("system_msg.no_data") }}</span
              >
            </li>
          </v-card-text>
          <v-banner color="primary" dark>{{ $t("seo.seo_data") }}</v-banner>
          <v-flex>
            <v-card-title>{{ $t("seo.keywords") }}</v-card-title>
            <v-card-text>{{
              apps.keywords || $t("system_msg.no_data")
            }}</v-card-text>
          </v-flex>
          <v-flex>
            <v-card-title>{{ $t("seo.basic_introduction") }}</v-card-title>
            <v-card-text
              v-html="apps.basic_introduction || $t('system_msg.no_data')"
            ></v-card-text>
          </v-flex>
          <v-banner color="primary" dark>{{
            $t("apps.other_details")
          }}</v-banner>
          <v-flex>
            <v-card-title>{{ $t("apps.introduction") }}</v-card-title>
            <v-card-text
              v-html="apps.introduction || $t('system_msg.no_data')"
            ></v-card-text>
          </v-flex>
          <v-flex>
            <v-card-title>{{ $t("apps.features") }}</v-card-title>
            <v-card-text
              v-html="apps.features || $t('system_msg.no_data')"
            ></v-card-text>
          </v-flex>
          <v-flex>
            <v-card-title>{{ $t("apps.editors_comment") }}</v-card-title>
            <v-card-text
              v-html="apps.editors_comment || $t('system_msg.no_data')"
            ></v-card-text>
          </v-flex>
        </v-container>
      </v-card>
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
import axios from "axios";

export default {
  name: "AppDetails",
  components: {
    SnackBar,
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      file: "",
      dialog: "",
      memo: "",
      status: "",
      showUpdateStatusDialog: false,
      apps: {},
      classification: [],
      appsApi: api.apps,
      loading: true,
      classApi: api.classification,
      uploadPercentage: 0,
      uploadInstallerDialog: false,
      uploadiOSInstallerDialog: false,
      uploadLoading: false,
      snackbar: {
        color: "",
        text: "",
        show: false,
      },
      bread_crumbs: [
        {
          text: this.$t("nav.apps"),
          disabled: false,
          to: "/apps?website=1",
        },
        {
          text: this.$t("nav.apps_detail"),
          disabled: true,
        },
      ],
      headers: [
        {
          sortable: false,
          text: this.$t("apps.type"),
          value: "name",
        },
        {
          sortable: false,
          text: `${this.$t("apps.category")}`,
          value: "categories",
        },
        {
          sortable: false,
          text: this.$t("nav.labels"),
          value: "",
        },
      ],
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      let id = to.params.appsId;
      vm.getAppDetails(id);
      vm.getAppClassDetails(id);
    });
  },
  methods: {
    async getAppDetails(slug) {
      await this.$http.get(`${this.appsApi}${slug}/`).then((response) => {
        this.apps = response;
        this.loading = false;
      });
    },
    async getAppClassDetails(id) {
      await this.$http.get(`${this.classApi}/${id}/`).then((response) => {
        this.classification = response;
      });
    },
    toggle(id, value, mode) {
      this.snackbar.show = false;
      let toggleResult;
      let action_title;
      if (mode == "use_android_link") {
        toggleResult = {
          use_android_link: value,
        };
        action_title = this.$t("apps.use_download_link");
      }
      this.$http.put(`${this.appsApi}${id}/`, toggleResult).then(
        (response) => {
          let action_text = response[mode]
            ? this.$t("status.enabled")
            : this.$t("status.disabled");
          this.snackbar = {
            color: "success",
            show: true,
            text: `[${action_title}]: ${action_text}`,
          };
          this.getAppDetails(this.apps.id);
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
    openStatusDialog(item, status = "") {
      this.dialog = item;
      this.status = status;
      this.showUpdateStatusDialog = true;
    },
    closeUpdateStatusDialog() {
      this.dialog = {};
      this.showUpdateStatusDialog = false;
      this.$refs.form.reset();
      this.getAppDetails(this.apps.slug);
    },
    async updateStatus(item) {
      this.snackbar.show = false;
      const isValid = await this.$refs.form.validate();
      if (isValid) {
        this.snackbar.show = false;
        let statusResult = {
          status: this.status === "publish" ? "approved" : this.status,
          title: item.title,
          memo: item.memo,
        };
        if (this.status !== 'review') {
          this.$http.put(`${this.appsApi}status/${item.slug}/`, statusResult).then(
          (response) => {
            let action_text =
              this.status === "cancelled"
                ? this.$t("status.declined")
                : this.status === "publish"
                ? this.$t("status.published")
                : this.$t("status.approved");
            this.snackbar = {
              color: "success",
              show: true,
              text: `[${this.$t("nav.apps")}]: ${action_text}`,
            };
            this.closeUpdateStatusDialog();
            this.getAppDetails(response.slug);
          },
          (error) => {
            this.snackbar = {
              color: "error",
              show: true,
              text: `${this.$t("system_msg.error")}: ${error}`,
            };
            this.getAppDetails(this.apps.slug);
          }
        );
        } else {
          this.$http.patch(`${this.appsApi}${item.slug}/`, statusResult).then(
          (response) => {
            this.snackbar = {
              color: "success",
              show: true,
              text: `[${this.$t("nav.apps")}]: ${this.$t("status.review")}`,
            };
            this.closeUpdateStatusDialog();
            this.getAppDetails(response.slug);
          },
          (error) => {
            this.snackbar = {
              color: "error",
              show: true,
              text: `${this.$t("system_msg.error")}: ${error}`,
            };
            this.getAppDetails(this.apps.slug);
          })
        }
      }
    },
    async uploadFile(installerType) {
      this.snackbar.show = false;
      const isValid = await this.$refs.uploadFileform.validate();
      if (isValid) {
        this.uploadLoading = true;
        const formData = new window.FormData();
        if (installerType == "apk") {
          formData.set("app_file", this.file);
        } else {
          formData.set("ios_app_file", this.file);
        }
        await axios
          .put(`${this.appsApi}${this.apps.id}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: function(progressEvent) {
              this.uploadPercentage = parseInt(
                Math.round((progressEvent.loaded / progressEvent.total) * 100)
              );
            }.bind(this),
          })
          .then(
            () => {
              this.getAppDetails(this.apps.id);
              this.uploadInstallerDialog = false;
              this.uploadLoading = false;
              this.file = null;
              this.$refs.uploadFileform.reset();
              this.snackbar = {
                color: "success",
                show: true,
                text: `${this.$t("actions.change_file")}: ${this.$t(
                  "status.success"
                )}`,
              };
            },
            (error) => {
              this.snackbar = {
                color: "error",
                show: true,
                text: `${this.$t("system_msg.error")}: ${error}`,
              };
              this.uploadLoading = false;
              return;
            }
          )
          .catch(function() {});
      }
    },
  },
};
</script>
