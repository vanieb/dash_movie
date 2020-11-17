<template>
  <v-layout wrap>
    <v-container>
      <v-layout justify-start>
        <v-btn
          color="primary"
          dark
          to="/articles/add"
          v-if="$root.permissions.includes('create_article')"
        >
          <v-icon class="mr-3">post_add</v-icon> &nbsp;{{ $t("actions.add") }}
        </v-btn>
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
                v-if="item.websites.length == 1 && item.title.length > 20"
              >
                <strong>{{ item.title | truncate(20, "...") }} </strong>
                <br />
                <v-icon left small color="grey lighten-1">view_compact</v-icon>
                <strong class="grey--text">{{ $t("status.draft") }}</strong>
                <br />
                <v-icon left small color="warning lighten-1">person</v-icon>
                <span>{{ item.created_by }}</span> <br />
                <v-icon left small color="warning lighten-1">event</v-icon>
                <span>{{
                  item.created_at | moment("YYYY-MM-DD HH:mm:ss")
                }}</span>
              </td>
              <td class="align-center" width="30%" v-else>
                <strong>{{ item.title }}</strong>
                <br />
                <v-icon left small color="grey lighten-1">view_compact</v-icon>
                <strong class="grey--text">{{ $t("status.draft") }}</strong>
                <br />
                <v-icon left small color="warning lighten-1">person</v-icon>
                <span>{{ item.created_by }}</span> <br />
                <v-icon left small color="warning lighten-1">event</v-icon>
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
                <v-menu
                    offset-y
                    v-if="$root.permissions.includes('delete_article')"
                  >
                    <template v-slot:activator="{ on }">
                      <v-chip v-on="on"
                  class="success lighten-1 small"
                >
                  <v-icon dark left small>publish</v-icon>
                  {{ $t("actions.publish") }}
                </v-chip>
                    </template>
                    <v-list>
                      <v-list-item
                        @click="publishArticle(item, true, $event)"
                      >
                        <v-list-item-title>
                          <v-icon class="mr-2" color="orange">warning</v-icon>
                          {{ $t("system_msg.confirm_publish") }}
                          <strong>{{ item.title }}</strong>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
              </td>
              <td width="15%" class="align-center justify-center">
                {{ item.updated_by || "-" }} <br />
                <span class="grey--text">{{
                  item.updated_at | moment("YYYY-MM-DD HH:mm:ss")
                }}</span>
              </td>
              <td
                width="10%"
                class="align-center justify-center"
                v-if="
                  $root.permissions.includes('change_article_details') ||
                    $root.permissions.includes('delete_article')
                "
              >
                <v-layout>
                  <v-btn
                    icon
                    :to="`/articles/${item.slug}/edit`"
                    v-if="$root.permissions.includes('change_article_details')"
                  >
                    <v-icon small>edit</v-icon>
                  </v-btn>
                  <v-menu
                    offset-y
                    v-if="$root.permissions.includes('delete_article')"
                  >
                    <template v-slot:activator="{ on }">
                      <v-icon color="red" small v-on="on" icon>delete</v-icon>
                    </template>
                    <v-list dark>
                      <v-list-item
                        @click="deleteArticle(item.slug, true, $event)"
                      >
                        <v-list-item-title>
                          <v-icon class="mr-2" color="orange">warning</v-icon>
                          {{ $t("system_msg.confirm_delete") }}
                          <strong>{{ item.title }}</strong>
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
      :api="articleApi"
      :query="query"
      ref="pulling"
      @query-data="queryData"
      @query-param="queryParam"
      :persistent-query="{status: 'draft'}"
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

export default {
  name: "Article",
  components: {
    Pagination,
    SnackBar,
    Website,
  },
  data() {
    return {
      name: "",
      href: "",
      uploadPercentage: 0,
      showForm: false,
      query: {
        website: 1,
      },
      querySet: [],
      active: "",
      popular: "",
      today: date.max_today,
      created_at: ["", ""],
      website: 1,
      articleApi: api.articles,
      loading: true,
      submitting: false,
      date_menu: false,
      confirmDialog: false,
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
          value: "status",
          width: "10%",
          align: "center",
        },
        {
          sortable: false,
          text: `${this.$t("common.update_details")}`,
          value: "updated_at",
          width: "15%",
        },
        {
          sortable: false,
          text: this.$t("common.action"),
          value: ""
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
    publishArticle(item) {
      let website_query = this.query.website;
        this.snackbar.show = false;
        let statusResult = {
          status: 'approve',
          is_active: true
        };
        this.$http.put(`${this.articleApi}${item.id}/`, statusResult).then(
          () => {
            this.snackbar = {
              color: "success",
              show: true,
              text: `[${this.$t("articles.article")}]: ${this.$t("status.published")}`,
            };
            this.$router.push(`/articles_published?website=${website_query}`)
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
    },
    deleteArticle(id) {
      this.snackbar.show = false;
      this.$http.delete(`${this.articleApi}${id}/`).then(
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
