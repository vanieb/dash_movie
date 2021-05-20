<template>
  <v-layout wrap>
    <v-container>
      <v-flex>
        <validation-observer ref="form">
          <v-dialog v-model="showForm" persistent max-width="500">
            <template v-slot:activator="{ on }">
              <v-btn color="blue-grey" dark v-on="on" align-right
                ><v-icon class="mr-3">add_box</v-icon> &nbsp;{{
                  $t("actions.add")
                }}
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
                  <v-flex xs12>
                    <validation-provider
                      rules="required"
                      :name="$t('common.link')"
                    >
                      <v-text-field
                        :counter="240"
                        :error-messages="errors"
                        color="blue-grey"
                        :label="`${$t('common.link')}*`"
                        placeholder=" "
                        slot-scope="{ errors }"
                        v-model="logo.website_link"
                      ></v-text-field>
                    </validation-provider>
                  </v-flex>
                  <v-flex xs12>
                    <v-banner color="blue-grey" dark>
                      {{ $t("actions.upload") }} -
                      {{ `${$t("common.image")}*` }}
                    </v-banner>
                    <v-card
                      color="blue-grey lighten-2"
                      flat
                      style="border-radius:0 !important;"
                    >
                      <v-card-text>
                        <v-img
                          v-if="showImage"
                          :src="`${logo.imageURI}`"
                          class="my-1"
                          contain
                          height="100"
                        ></v-img>
                      </v-card-text>
                      <v-card-actions>
                        <v-layout justify-center>
                          <v-btn
                            color="white"
                            dark
                            @click="$refs.inputUpload.click()"
                          >
                            <v-icon color="blue-grey">cloud_upload</v-icon>
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
                  </v-flex>
                  <br />
                </v-layout>
                <small color="error">*{{ $t("errors.required") }}</small>
              </v-card-text>
              <!-- BUTTONS -->
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="grey lighten-1"
                  :disabled="submitting"
                  @click="close"
                  >{{ $t("actions.close") }}</v-btn
                >
                <v-btn
                  color="blue-grey"
                  class="white--text"
                  :loading="submitting"
                  @click="saveLogo"
                  >{{ $t("actions.save") }}</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </validation-observer>
      </v-flex>
      <!-- <v-card>
        <v-col
          cols="12"
          md="12"
          class="mt-2"
          style="padding: 20px 20px 10px 20px !important;"
        >
          <v-row>
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
                dense
                color="blue-grey"
              >
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
                v-model="query.website_link"
                hide-details="true"
                placeholder=" "
                outlined
                dense
                color="blue-grey"
              >
              </v-text-field>
            </div>

            <v-layout class="justify-end">
              <v-btn
                color="blue-grey"
                dark
                :loading="loading"
                @click="clearAll"
              >
                <v-icon>clear_all</v-icon>{{ $t("actions.clear") }}
              </v-btn>
            </v-layout>
          </v-row>
        </v-col>
      </v-card> -->
      <v-data-table
        :headers="headers"
        :hide-default-footer="true"
        :items="querySet"
      >
        <template v-slot:body="{ items }">
          <span v-if="!items">{{ items }}</span>
          <tbody>
            <tr v-for="item in querySet" :key="item.id">
              <td>
                <v-row class="align-center">
                  <strong>{{ item.id }}</strong>
                  <v-card color="blue-grey lighten-2" class="ma-1 pa-1 ml-5">
                    <v-img
                      :src="`${host}${item.image_url}`"
                      height="100"
                      width="100"
                      contain
                    ></v-img>
                  </v-card>
                </v-row>
              </td>
              <td>
                <strong>{{ item.website_link }}</strong>
              </td>
              <td class="align-center justify-center">
                <v-switch
                  value
                  v-model="item.status"
                  @change="toggleStatus(item.id, item.status)"
                >
                </v-switch>
              </td>
              <td>
                {{ item.created_by }} <br />
                <span class="grey--text"
                  >{{ item.created_at | moment("YYYY-MM-DD HH:mm:ss") }}
                </span>
              </td>
              <td>
                {{ item.updated_by || "-" }} <br />
                <span class="grey--text"
                  >{{ item.updated_at | moment("YYYY-MM-DD HH:mm:ss") }}
                </span>
              </td>
              <td class="align-center justify-center px-0">
                <v-icon left small @click="updateLogo(item)">edit</v-icon>
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-icon color="error" small v-on="on">delete</v-icon>
                  </template>
                  <v-list dark>
                    <v-list-item @click="deleteLogo(item.id, true, $event)">
                      <v-list-item-title>
                        <v-icon left color="warning">warning</v-icon>
                        {{ $t("system_msg.confirm_delete") }}
                        <strong>{{ item.website_link }}</strong>
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
      :api="logosApi"
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
import api from "@/api/apis";
import Pagination from "@/components/Pagination";
import SnackBar from "@/components/SnackBar";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { debounce } from "lodash";
import $ from "../../utils/util";
import date from "../../utils/date";

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
    Pagination,
    SnackBar,
  },
  name: "Logos",
  data() {
    return {
      host: process.env.VUE_APP_API_URL.slice(0, -1),
      submitting: false,
      website_link: "",
      logo: {
        image: "",
        website_link: "",
      },
      date_menu: false,
      created_at: ["", ""],
      today: date.max_today,
      loading: true,
      status: "",
      showImage: false,
      logosApi: api.logos,
      logoApi: api.logo,
      querySet: [],
      query: {},
      showForm: false,
      snackbar: {
        color: "",
        text: "",
        show: false,
      },
      statusOptions: [
        { text: this.$t("status.enabled"), value: 1 },
        { text: this.$t("status.disabled"), value: 0 },
      ],
      headers: [
        {
          sortable: false,
          text: this.$t("common.logo"),
          value: "image_url",
        },
        {
          sortable: false,
          text: this.$t("common.link"),
          value: "website_link",
        },
        {
          sortable: false,
          text: this.$t("common.status"),
          value: "status",
          width: "10%",
        },
        {
          sortable: false,
          text: this.$t("common.created_at"),
          value: "created_at",
        },
        {
          sortable: false,
          text: this.$t("common.updated_at"),
          value: "updated_at",
        },

        {
          sortable: false,
          text: this.$t("common.action"),
        },
      ],
    };
  },
  watch: {
    $route: {
      handler() {
        this.loading = true;
        this.setQueryAll();
        this.$refs.pulling.rebase();
      },
      deep: true,
    },
    status(newObj) {
      this.query.status = newObj;
      this.$refs.pulling.submit();
    },
    created_at(newObj) {
      if (this.query.created_at_after > this.query.created_at_before) {
        this.snackbar = {
          color: "error",
          show: true,
          text: `[${this.$t("system_msg.error")}]: ${this.$t(
            "system_msg.date_error"
          )}`,
        };
        this.clearAll();
      } else {
        [this.query.created_at_after, this.query.created_at_before] = [
          ...newObj,
        ];
        this.search();
      }
    },
  },
  computed: {
    cardTitle() {
      return this.isUpdate
        ? `${this.$t("actions.update")}`
        : `${this.$t("actions.add")} - ${this.$t("nav.logos")}`;
    },
    cardIcon() {
      return this.isUpdate ? "edit" : "add_box";
    },
    isUpdate() {
      return this.website_link.length > 0;
    },
    isQueryEmpty() {
      return $.compareQuery(this.query, {});
    },
    dateRangeText() {
      if (this.query.created_at_after && this.query.created_at_before) {
        return this.created_at.join(" ~ ");
      } else {
        return "";
      }
    },
  },
  created() {
    this.setQueryAll();
    this.$nextTick(() => {
      this.$refs.pulling.rebase();
    });
    this.lang = $.getLanguage() == "zh_CN" ? "zh-cn" : "";
  },
  methods: {
    setQueryAll() {
      if (
        this.$route.query.created_at_after ||
        this.$route.query.created_at_before
      ) {
        this.created_at = [
          this.$route.query.created_at_after,
          this.$route.query.created_at_before,
        ];
      } else {
        this.created_at = [undefined, undefined];
      }
      this.status =
        this.$route.query.status === 1 ||
        this.$route.query.status === 0 ||
        this.$route.query.status === "1" ||
        this.$route.query.status === "0"
          ? JSON.parse(this.$route.query.status)
          : "";
      this.query = Object.assign({}, this.$route.query);
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
        this.logo.imageURI = e.target.result;
        this.showImage = true;
      };
      fileRead.readAsDataURL(e.target.files[0]);

      this.logo.image = e.target.files[0];
      this.change_image = true;
    },
    async saveLogo() {
      if (!this.logo.image && !this.isUpdate) {
        this.snackbar = {
          color: "red",
          show: true,
          text: `${this.$t("errors.required")}: ${this.$t(
            "common.logo"
          )} ${this.$t("common.image")}`,
        };
        return;
      }

      const isValid = await this.$refs.form.validate();

      let formData = new window.FormData();
      if (this.change_image) {
        formData.set("image", this.logo.image);
      }
      formData.set("website_link", this.logo.website_link);

      if (isValid) {
        if (this.logo.id) {
          this.$http.put(`${this.logoApi}/${this.logo.id}`, formData).then(
            () => {
              this.$refs.pulling.rebase();
              this.snackbar = {
                color: "success",
                show: true,
                text: `${this.$t("actions.update")} - ${this.$t(
                  "common.logo"
                )}: ${this.$t("status.success")}`,
              };
              this.close();
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
          this.$http.post(this.logoApi, formData).then(
            () => {
              this.snackbar = {
                color: "success",
                show: true,
                text: `${this.$t("actions.add")} - ${this.$t(
                  "common.logo"
                )}: ${this.$t("status.success")}`,
              };
              this.$refs.pulling.rebase();
              this.close();
            },
            (error) => {
              this.snackbar = {
                color: "red",
                show: true,
                text: error,
              };
              this.$refs.form.reset();
            }
          );
        }
      }
      this.snackbar.show = false;
    },
    updateLogo(item) {
      const host = process.env.VUE_APP_API_URL;
      const updatedHost = host.slice(0, -1);
      this.showImage = true;
      Object.assign(this.logo, {
        id: item.id,
        website_link: item.website_link,
        imageURI: `${updatedHost}${item.image_url}`,
      });
      this.website_link = this.logo.website_link;
      this.showForm = true;
    },
    deleteLogo(id) {
      this.$http.delete(`${this.logoApi}/${id}`).then(() => {
        this.snackbar = {
          color: "success",
          show: true,
          text: `${this.$t("actions.delete")}: ${this.$t("status.success")}`,
        };
        this.$refs.pulling.rebase();
      });
    },
    toggleStatus(id, status) {
      this.toggleLoading = true;
      const formData = new window.FormData();
      formData.set("status", status ? 1 : 0);
      this.$http.put(`${this.logoApi}/${id}/status`, formData).then(
        (response) => {
          let status_text = response.status
            ? this.$t("status.enabled")
            : this.$t("status.disabled");
          this.snackbar = {
            color: "success",
            show: true,
            text: `[${this.$t("common.status")}]: ${status_text}`,
          };
          this.$refs.pulling.rebase();
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
    close() {
      this.logo.id = "";
      this.logo.website_link = "";
      this.logo.image = "";
      this.logo.imageURI = "";
      this.website_link = "";
      this.submitting = false;
      this.$refs.form.reset();
      this.showForm = false;
    },
    queryData(queryset) {
      this.loading = false;
      this.querySet = queryset;
    },
    queryParam(query) {
      this.query = Object.assign(this.query, query);
    },
    submit() {
      if (!$.compareQuery(this.query, this.$route.query)) {
        this.$refs.pulling.submit();
      }
    },
    search: debounce(function() {
      this.submit();
    }, 700),
    clearAll() {
      this.created_at = ["", ""];
      this.status = "";
      this.query = {};
      this.$nextTick(() => {
        this.$refs.pulling.submit();
      });
    },
  },
};
</script>
