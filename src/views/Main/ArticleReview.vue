<template>
  <v-layout wrap>
    <v-container>
      <v-layout>
        <validation-observer ref="form">
          <v-dialog v-model="showUpdateStatusDialog" persistent max-width="600">
            <v-card>
              <v-card-title v-if="status === 'approved'">
                <v-icon left color="success">check</v-icon>
                {{ $t("actions.approve") }} - {{ $t("articles.article") }}
              </v-card-title>
              <v-card-title v-else-if="status === 'cancelled'">
                <v-icon left color="error">close</v-icon>
                {{ $t("actions.decline") }} - {{ $t("articles.article") }}
              </v-card-title>
              <v-card-title v-else>
                <v-icon left color="grey">edit</v-icon>
                {{ $t("actions.update") }} - {{ $t("common.remarks") }}
              </v-card-title>
              <v-card-text>
                <div class="black--text">
                  <strong>{{ dialog.title }}</strong>
                </div>
                <v-icon left small color="indigo">person</v-icon>
                <span>{{ dialog.created_by }}</span> <br />
                <v-icon left small color="indigo">event</v-icon>
                <span>{{
                  dialog.created_at | moment("YYYY-MM-DD HH:mm:ss")
                }}</span>
              </v-card-text>
              <v-card-text>
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
                    v-model="memo"
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
      </v-layout>
      <v-card>
        <v-col
          cols="12"
          md="12"
          class="mt-2"
          style="padding: 20px 20px 10px 20px !important;"
        >
          <v-row>
            <div style="width:155px !important;" class="mr-2">
              <website
                type="filter"
                :mode="'one'"
                :website="query.website"
                @website-select-one="websiteSelectOne"
              >
              </website>
            </div>
            <div style="width:200px;" class="mr-2">
              <v-text-field
                @input="search"
                :label="`${$t('articles.title')}`"
                v-model="query.title_q"
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
                  :to="`/articles/${item.slug}`"
                >
                  <v-icon>touch_app</v-icon>
                </v-btn>
              </td>
              <td
                class="align-center"
                width="30%"
                v-if="item.title.length > 20"
              >
                <strong>{{ item.title | truncate(20, "...") }} </strong>
                <br />
                <v-icon left small color="warning lighten-1"
                  >view_compact</v-icon
                >
                <strong class="warning--text">{{ $t("status.review") }}</strong>
                <br />
                <v-icon left small color="indigo">person</v-icon>
                <span>{{ item.created_by }}</span> <br />
                <v-icon left small color="indigo">event</v-icon>
                <span>{{
                  item.created_at | moment("YYYY-MM-DD HH:mm:ss")
                }}</span>
              </td>
              <td class="align-center" width="30%" v-else>
                <strong>{{ item.title }}</strong>
                <br />
                <v-icon left small color="warning lighten-1"
                  >view_compact</v-icon
                >
                <strong class="warning--text">{{ $t("status.review") }}</strong>
                <br />
                <v-icon left small color="indigo">person</v-icon>
                <span>{{ item.created_by }}</span> <br />
                <v-icon left small color="indigo">event</v-icon>
                <span>{{
                  item.created_at | moment("YYYY-MM-DD HH:mm:ss")
                }}</span>
              </td>
              <td class="text-center" width="10%">
                <span v-for="website in item.websites" :key="website.id"
                  >{{ website.name }}<br
                /></span>
              </td>
              <td class="text-center">
                <v-chip
                  v-if="
                    $root.permissions.includes('change_article_details')
                    && !(
                      item.keywords &&
                      item.description &&
                      item.content &&
                      item.icon
                    )
                  "
                  :to="`/articles/${item.slug}/edit`"
                  class="info mr-2"
                >
                  <v-icon dark left x-small>edit</v-icon>
                  {{ $t("actions.update") }}
                </v-chip>
                <v-chip
                  v-if="
                    $root.permissions.includes(
                      'change_article_status_approved'
                    ) &&
                      (
                        item.keywords &&
                        item.description &&
                        item.content &&
                        item.icon
                      )
                  "
                  @click="openStatusDialog(item, 'approved', item.memo)"
                  class="success lighten-1 mr-2 "
                >
                  <v-icon dark left x-small dense>check</v-icon>
                  {{ $t("actions.approve") }}
                </v-chip>
                <v-chip
                  v-if="
                    $root.permissions.includes('change_article_status_declined')
                  "
                  @click="openStatusDialog(item, 'cancelled', item.memo)"
                  class="error"
                >
                  <v-icon dark left x-small>close</v-icon>
                  {{ $t("actions.decline") }}
                </v-chip>
                <span v-else>-</span>
                <br />
                <small
                  v-if="
                    !(
                      item.keywords &&
                      item.description &&
                      item.content &&
                      item.icon
                    )
                  "
                  class="error--text"
                  >{{ $t("errors.incomplete_details") }}</small
                >
              </td>
              <td width="15%" class="align-center justify-center">
                {{ item.updated_by || "-" }} <br />
                <span class="grey--text">{{
                  item.updated_at | moment("YYYY-MM-DD HH:mm:ss")
                }}</span>
              </td>
              <td class="text-center" :key="item.id">
                <v-chip
                  class="primary lighten-1 mt-1"
                  @click="openStatusDialog(item, 'memo', item.memo)"
                  v-if="$root.permissions.includes('change_article_details')"
                  dark
                  small
                >
                  <v-icon x-small left>edit</v-icon>
                  {{ $t("actions.update") }}
                </v-chip>
                <br />
                {{ item.memo || "-" }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </v-container>
    <pagination
      :queryset="querySet"
      :api="articleApi"
      :query="query"
      ref="pulling"
      @query-data="queryData"
      @query-param="queryParam"
      :persistent-query="{ status: 'review' }"
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
import { ValidationObserver, ValidationProvider } from "vee-validate";
import Website from "../../components/SelectWebsite.vue";

export default {
  name: "ArticleReview",
  components: {
    Pagination,
    SnackBar,
    ValidationObserver,
    ValidationProvider,
    Website,
  },
  data() {
    return {
      query: {
        website: 1,
      },
      querySet: [],
      today: date.max_today,
      created_at: ["", ""],
      date_menu: false,
      website: 1,
      articleApi: api.articles,
      loading: true,
      showUpdateStatusDialog: false,
      dialog: {},
      status: "",
      memo: "",
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
          text: this.$t("articles.title"),
          value: "title",
        },
        {
          sortable: false,
          text: this.$t("nav.websites"),
          value: "website",
          align: "center",
        },
        {
          sortable: false,
          text: this.$t("common.action"),
          value: "",
          width: "30%",
          align: "center",
        },
        {
          sortable: false,
          text: this.$t("common.update_details"),
          value: "updated_at",
          width: "5%",
        },
        {
          sortable: false,
          text: this.$t("common.remarks"),
          value: "memo",
          align: "center",
          width: "20%",
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
      if (!this.query.created_at_before) {
        this.query.website = 1;
        this.submit();
      }
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
  filters: {
    truncate: function(text, length, suffix) {
      return text.substring(0, length) + suffix;
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
      this.query = Object.assign({}, this.$route.query);
    },
    queryData(queryset) {
      this.loading = false;
      this.querySet = queryset;
    },
    queryParam(query) {
      this.query = Object.assign(this.query, query);
    },
    openStatusDialog(item, status = "", memo = "") {
      this.dialog = item;
      this.status = status;
      this.memo = memo;
      this.showUpdateStatusDialog = true;
    },
    async updateStatus(item) {
      this.snackbar.show = false;
      let website_query = this.query.website;
      const isValid = await this.$refs.form.validate();
      if (isValid) {
        this.snackbar.show = false;
        let statusResult;
        if (this.status === "memo") {
          statusResult = {
            title: item.title,
            memo: this.memo,
          };
        } else {
          statusResult = {
            status: this.status,
            is_active: this.status == "approved" ? true : false,
            title: item.title,
            memo: this.memo,
          };
        }
        this.$http.put(`${this.articleApi}${item.slug}/`, statusResult).then(
          (response) => {
            let action_text =
              response.status === "approved"
                ? this.$t("status.approved")
                : this.$t("status.declined");
            this.snackbar = {
              color: "success",
              show: true,
              text:
                this.status === "memo"
                  ? `[${this.$t("actions.update")} ${this.$t(
                      "common.remarks"
                    )}]: ${this.$t("status.success")}`
                  : `[${this.$t("articles.article")}]: ${action_text}`,
            };
            this.closeUpdateStatusDialog();
            if (this.status === "approved") {
              this.$router.push("articles_published?website=1");
            } else if (this.status === "cancelled") {
              this.$router.push("articles?website=1");
            } else {
              this.$refs.pulling.rebase();
            }
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
    submit() {
      if (!$.compareQuery(this.query, this.$route.query)) {
        this.$refs.pulling.submit();
      }
    },
    websiteSelectOne(val) {
      this.query.website = val;
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
    closeUpdateStatusDialog() {
      this.dialog = {};
      this.showUpdateStatusDialog = false;
      this.$refs.form.reset();
    },
  },
};
</script>
<style scope lang="scss">
.v-date-picker-title__date {
  font-size: 20px !important;
}
</style>
