<template>
  <v-layout wrap>
    <v-container>
      <v-layout>
        <div d-inline-block>
          <v-layout justify-start>
            <v-btn
              color="primary"
              dark
              to="/apps/add"
              v-if="$root.permissions.includes('create_app')"
            >
              <v-icon left>library_add</v-icon> &nbsp;{{ $t("actions.add") }}
            </v-btn>
          </v-layout>
        </div>
      </v-layout>
      <v-layout justify-start class="mt-3">
        <div style="width:200px !important;" class="mr-2 mb-2">
          <website
            type="filter"
            :mode="'one'"
            req="true"
            :website="query.website"
            @website-select-one="websiteSelectOne"
          >
          </website>
        </div>
      </v-layout>
      <v-card>
        <v-col
          cols="12"
          md="12"
          class=""
          style="padding: 10px 20px 10px 20px !important;"
        >
          <v-row class="mt-2">
            <div style="width:200px !important;" class="mr-2">
              <types
                :mode="'one'"
                type="filter"
                :typeFilter="typeFilter"
                :types="query.types"
                @type-select-one="typeSelectOne"
              >
              </types>
            </div>
            <div style="width:200px;" class="mr-2">
              <v-text-field
                @input="search"
                :label="`${$t('common.name')}`"
                v-model="query.name_q"
                hide-details="true"
                placeholder=" "
                outlined
                dense
              >
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
                  :max="today"
                  range
                  landscape
                  smaller
                >
                </v-date-picker>
              </v-menu>
            </div>
            <v-layout class="justify-end">
              <v-btn color="primary" dark :loading="loading" @click="clearAll">
                <v-icon>clear_all</v-icon>{{ $t("actions.clear") }}
              </v-btn>
            </v-layout>
          </v-row>
        </v-col>
      </v-card>
      <v-spacer></v-spacer>
      <v-data-table
        :headers="headers"
        :hide-default-footer="true"
        :items="querySet"
      >
        <template v-slot:body="{ items }">
          <span v-if="!items">{{ items }}</span>
          <tbody>
            <tr v-for="item in querySet" :key="item.id">
              <td width="5%">
                <v-btn
                  class="mr-2"
                  icon
                  color="info"
                  :to="`/apps/${item.slug}`"
                >
                  <v-icon>touch_app</v-icon>
                </v-btn>
              </td>
              <td class="align-center" width="20%">
                <strong>{{ item.name }}</strong>
                <br />
                <v-icon left small color="grey lighten-1">view_compact</v-icon>
                <strong class="grey--text">{{ $t("status.draft") }}</strong>
                <br />
                <v-icon left small color="indigo">person</v-icon>
                <span>{{ item.created_by }}</span> <br />
                <v-icon left small color="indigo">event</v-icon>
                <span>{{
                  item.created_at | moment("YYYY-MM-DD HH:mm:ss")
                }}</span>
              </td>
              <td class="align-center text-center" width="10%">
                <span>{{ item.website ? item.website.name : "-" }}<br /></span>
              </td>
              <td class="text-center">
                <v-row class="justify-center">
                  <v-menu
                    offset-y
                    v-if="
                      $root.permissions.includes('change_app_submission_status')
                    "
                  >
                    <template v-slot:activator="{ on }">
                      <v-chip v-on="on" class="warning lighten-1 small mr-1">
                        <v-icon dark left small>visibility</v-icon>
                        {{ $t("status.review") }}
                      </v-chip>
                    </template>
                    <v-list>
                      <v-list-item
                        @click="changeAppStatus(item, 'review', true, $event)"
                      >
                        <v-list-item-title>
                          <v-icon left color="warning">warning</v-icon>
                          {{ $t("system_msg.confirm_review") }}
                          <strong>{{ item.name }}</strong>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <v-menu
                    offset-y
                    v-if="
                      $root.permissions.includes('change_app_status_approved')
                    "
                  >
                    <template v-slot:activator="{ on }">
                      <small
                        v-if="!item.keywords || item.keywords === 'undefined'"
                        class="error--text"
                        >{{ $t("seo.keywords") }}:

                        {{ $t("system_msg.not_set") }}</small
                      >
                      <v-chip
                        v-on="on"
                        class="success lighten-1 small"
                        :disabled="
                          !item.keywords || item.keywords === 'undefined'
                        "
                      >
                        <v-icon dark left small>publish</v-icon>
                        {{ $t("actions.publish") }}
                      </v-chip>
                    </template>
                    <v-list>
                      <v-list-item
                        @click="changeAppStatus(item, 'approved', true, $event)"
                      >
                        <v-list-item-title>
                          <v-icon left color="warning">warning</v-icon>
                          {{ $t("system_msg.confirm_publish") }}
                          <strong>{{ item.name }}</strong>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-row>
              </td>
              <td width="15%" class="align-center justify-center">
                {{ item.updated_by || "-" }} <br />
                <span class="grey--text">{{
                  item.updated_at | moment("YYYY-MM-DD HH:mm:ss")
                }}</span>
              </td>
              <td
                width="10%"
                class="text-center"
                v-if="
                  $root.permissions.includes('change_app') ||
                    $root.permissions.includes('delete_app')
                "
              >
                <v-layout>
                  <v-btn
                    class="mr-2"
                    icon
                    :to="`/apps/${item.slug}/edit`"
                    v-if="$root.permissions.includes('change_app')"
                  >
                    <v-icon small>edit</v-icon>
                  </v-btn>
                  <v-menu
                    offset-y
                    v-if="$root.permissions.includes('delete_app')"
                  >
                    <template v-slot:activator="{ on }">
                      <v-icon color="error" small v-on="on" icon>delete</v-icon>
                    </template>
                    <v-list dark>
                      <v-list-item @click="deleteApp(item.slug, true, $event)">
                        <v-list-item-title>
                          <v-icon left color="warning">warning</v-icon>
                          {{ $t("system_msg.confirm_delete") }}
                          <strong>{{ item.name }}</strong>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-layout>
              </td>
              <td v-else>-</td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </v-container>
    <pagination
      :queryset="querySet"
      :api="appsApi"
      :query="query"
      ref="pulling"
      @query-data="queryData"
      @query-param="queryParam"
      :persistent-query="{ status: 'draft' }"
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
import date from "../../utils/date";
import $ from "../../utils/util";
import Pagination from "@/components/Pagination";
import SnackBar from "@/components/SnackBar";
import { debounce } from "lodash";
import Website from "../../components/SelectWebsite.vue";
import Types from "../../components/SelectType.vue";

export default {
  name: "AppsDraft",
  components: {
    Pagination,
    SnackBar,
    Website,
    Types,
  },
  data() {
    return {
      query: {
        website: 1,
      },
      typeFilter: "",
      querySet: [],
      today: date.max_today,
      created_at: ["", ""],
      website: 1,
      appsApi: api.apps,
      loading: true,
      date_menu: false,
      snackbar: {
        color: "",
        text: "",
        show: false,
      },
      headers: [
        {
          sortable: false,
          text: "",
          value: "",
        },
        {
          sortable: false,
          text: this.$t("common.name"),
          value: "name",
          width: "30%",
        },
        {
          sortable: false,
          text: this.$t("nav.websites"),
          value: "website",
          width: "10%",
          align: "center",
        },
        {
          sortable: false,
          text: this.$t("common.action"),
          width: "20%",
          align: "center",
        },
        {
          sortable: false,
          text: this.$t("common.update_details"),
          value: "updated_at",
          width: "20%",
        },
        {
          sortable: false,
          text: this.$t("common.action"),
          width: "10%",
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
    type(newObj) {
      this.query.types = newObj;
      this.search();
    },
    website(newObj) {
      this.query.website = newObj;
      this.search();
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
  created() {
    this.setQueryAll();
    this.$nextTick(() => {
      this.$refs.pulling.rebase();
      this.query.website = 1;
      this.submit();
    });
    this.lang = $.getLanguage() == "zh_CN" ? "zh-cn" : "";
  },
  computed: {
    isQueryEmpty() {
      return $.compareQuery(this.query, {});
    },
    dateRangeText() {
      if (this.query.created_at_after || this.query.created_at_before) {
        return this.created_at.join(" ~ ");
      } else {
        return "";
      }
    },
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
      this.website = this.$route.query.website || "";
      this.type = this.$route.query.types || "";
      this.query = Object.assign({}, this.$route.query);
    },
    queryData(queryset) {
      this.loading = false;
      this.querySet = queryset;
    },
    queryParam(query) {
      this.query = Object.assign(this.query, query);
    },
    typeSelectOne(val) {
      if (val) {
        this.query.types = val;
        this.submit();
      }
    },
    submit() {
      if (!$.compareQuery(this.query, this.$route.query)) {
        this.$refs.pulling.submit();
      }
    },
    websiteSelectOne(val) {
      this.query.website = val;
      this.typeFilter = this.query.website;
      this.submit();
    },
    search: debounce(function() {
      this.submit();
    }, 700),
    clearAll() {
      this.created_at = ["", ""];
      this.query = {};
      this.query.website = 1;
      this.$nextTick(() => {
        this.$refs.pulling.submit();
      });
    },
    clearDateRange() {
      this.created_at = ["", ""];
      this.dateRangeText = "";
    },
    changeAppStatus(item, status) {
      let website_query = this.query.website;
      this.snackbar.show = false;
      let statusResult = {
        status: status,
        title: item.title,
      };
      if (status !== "review") {
        this.$http
          .put(`${this.appsApi}status/${item.slug}/`, statusResult)
          .then(
            () => {
              this.snackbar = {
                color: "success",
                show: true,
                text: `[${this.$t("nav.apps")}]: ${this.$t(
                  "status.published"
                )}`,
              };
              this.$router.push(`/apps_published?website=${website_query}`);
            },
            (error) => {
              this.snackbar = {
                color: "error",
                show: true,
                text: `${this.$t("system_msg.error")}: ${error}`,
              };
              this.$refs.pulling.rebase();
              this.query.website = website_query;
              this.submit();
            }
          );
      } else {
        this.$http.patch(`${this.appsApi}${item.slug}/`, statusResult).then(
          () => {
            this.snackbar = {
              color: "success",
              show: true,
              text: `[${this.$t("nav.apps")}]: ${this.$t("status.review")}`,
            };
            this.$router.push(`/apps_review?website=${website_query}`);
          },
          (error) => {
            this.snackbar = {
              color: "error",
              show: true,
              text: `${this.$t("system_msg.error")}: ${error}`,
            };
            this.$refs.pulling.rebase();
            this.query.website = website_query;
            this.submit();
          }
        );
      }
    },
    deleteApp(id) {
      this.snackbar.show = false;
      this.$http.delete(`${this.appsApi}${id}/`).then(
        () => {
          this.snackbar = {
            color: "success",
            show: true,
            text: `${this.$t("actions.delete")}: ${this.$t("status.success")}`,
          };
          this.$refs.pulling.rebase();
        },
        (error) => {
          this.snackbar = {
            color: "red",
            show: true,
            text: `${this.$t("system_msg.error")}: ${error}`,
          };
        }
      );
      this.snackbar.show = false;
    },
  },
};
</script>
<style scope lang="scss">
.v-date-picker-title__date {
  font-size: 20px !important;
}
</style>
