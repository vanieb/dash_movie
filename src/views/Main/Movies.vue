<template>
  <v-layout wrap>
    <v-container>
      <v-layout>
        <v-layout justify-start>
          <v-btn color="blue-grey" dark to="/movies/add">
            <v-icon class="mr-3">post_add</v-icon> &nbsp;{{ $t("actions.add") }}
          </v-btn>
        </v-layout>
      </v-layout>
      <v-card>
        <v-col
          cols="12"
          md="12"
          class="mt-2"
          style="padding: 20px 20px 10px 20px !important;"
        >
          <v-row>
            <div style="width:155px;" class="mr-2">
              <v-select
                small
                color="blue-grey"
                item-name="text"
                item-value="value"
                :items="statusOptions"
                :label="`${$t('common.status')}`"
                v-model="status"
                hide-details="true"
                placeholder=" "
                outlined
                dense
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
              <v-select
                small
                color="blue-grey"
                item-name="text"
                item-value="value"
                :items="typeOptions"
                :label="`${$t('movies.type')}`"
                v-model="type"
                hide-details="true"
                placeholder=" "
                outlined
                dense
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
                color="blue-grey"
                @input="search"
                :label="`${$t('movies.title')}`"
                v-model="query.title"
                hide-details="true"
                placeholder=" "
                outlined
                dense
              >
              </v-text-field>
            </div>
            <!-- <div style="width:300px;" class="mr-2">
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
                    color="blue-grey"
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
                  color="blue-grey"
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
            </div> -->
            <v-layout class="justify-end">
              <v-btn
                color="blue-grey"
                dark
                :loading="loading"
                @click="clearAll"
              >
                {{ $t("actions.clear") }}
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
                  :to="`/movies/${item.id}`"
                >
                  <v-icon>touch_app</v-icon>
                </v-btn>
              </td>
              <td
                class="align-center"
                width="30%"
                v-if="item.title.length > 30"
              >
                <strong>{{ item.title | truncate(30, "...") }}</strong>
                <br />
                <v-icon left small color="indigo">person</v-icon>
                <span>{{ item.created_by || "-" }}</span> <br />
                <v-icon left small color="indigo">event</v-icon>
                <span v-if="item.created_at">{{
                  item.created_at | moment("YYYY-MM-DD HH:mm:ss")
                }}</span>
                <span v-else>-</span>
              </td>
              <td class="align-center" width="30%" v-else>
                <strong>{{ item.title }}</strong>
                <br />
                <v-icon left small color="indigo">person</v-icon>
                <span>{{ item.created_by }}</span> <br />
                <v-icon left small color="indigo">event</v-icon>
                <span>{{
                  item.created_at | moment("YYYY-MM-DD HH:mm:ss")
                }}</span>
              </td>
              <td class="align-center justify-center">
                <v-switch
                  value
                  color="blue-grey"
                  v-model="item.status"
                  @change="toggle(item.id, item.status)"
                >
                </v-switch>
              </td>
              <td width="8%">
                {{ item.updated_by || "-" }} <br />
                <span class="grey--text" v-if="item.updated_at">{{
                  item.updated_at | moment("YYYY-MM-DD HH:mm:ss")
                }}</span>
              </td>
              <td width="10%" class="align-center justify-center">
                <v-layout>
                  <v-btn class="mr-2" icon :to="`/movies/${item.id}/edit`">
                    <v-icon small>edit</v-icon>
                  </v-btn>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                      <v-icon color="error" small v-on="on" icon>delete</v-icon>
                    </template>
                    <v-list dark>
                      <v-list-item @click="deleteMovie(item.id, true, $event)">
                        <v-list-item-title>
                          <v-icon left color="warning">warning</v-icon>
                          {{ $t("system_msg.confirm_delete") }}
                          <strong>{{ item.title }}</strong>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-layout>
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </v-container>
    <pagination
      :queryset="querySet"
      :api="moviesApi"
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
import date from "../../utils/date";
import $ from "../../utils/util";
import Pagination from "@/components/Pagination";
import SnackBar from "@/components/SnackBar";
import { debounce } from "lodash";

export default {
  name: "Movies",
  components: {
    Pagination,
    SnackBar,
  },
  data() {
    return {
      name: "",
      href: "",
      showForm: false,
      querySet: [],
      type: "",
      status: "",
      today: date.max_today,
      created_at: ["", ""],
      moviesApi: api.movies,
      movieApi: api.movie,
      loading: true,
      submitting: false,
      date_menu: false,
      statusOptions: [
        { text: this.$t("status.enabled"), value: 1 },
        { text: this.$t("status.disabled"), value: 0 },
      ],
      typeOptions: [
        { text: this.$t("movies.ongoing"), value: "ongoing" },
        { text: this.$t("movies.previous"), value: "previous" },
      ],
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
          text: this.$t("movies.title"),
          value: "title",
        },
        {
          sortable: false,
          text: this.$t("common.status"),
          value: "is_active",
          width: "10%",
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
    type(newObj) {
      this.query.type = newObj;
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
  created() {
    this.setQueryAll();
    this.$nextTick(() => {
      this.$refs.pulling.rebase();
      if (!this.query.created_at_before) {
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
      this.type = this.$route.query.type;
      this.status =
        this.$route.query.status === 1 ||
        this.$route.query.status === 0 ||
        this.$route.query.status === "1" ||
        this.$route.query.status === "0"
          ? JSON.parse(this.$route.query.status)
          : "";
      this.query = Object.assign({}, this.$route.query);
    },
    queryData(queryset) {
      this.loading = false;
      this.querySet = queryset;
    },
    queryParam(query) {
      this.query = Object.assign(this.query, query);
    },
    toggle(id, value) {
      this.snackbar.show = false;
      const formData = new window.FormData();
      formData.set("status", value ? 1 : 0);
      let action_title;

      action_title = this.$t("common.status");

      this.$http.put(`${this.movieApi}/${id}/status`, formData).then(
        (response) => {
          let action_text = response["status"]
            ? this.$t("status.enabled")
            : this.$t("status.disabled");
          this.snackbar = {
            color: "success",
            show: true,
            text: `[${action_title}]: ${action_text}`,
          };
          this.$refs.pulling.rebase();
        },
        (error) => {
          this.snackbar = {
            color: "error",
            show: true,
            text: `${this.$t("system_msg.error")}: ${error}`,
          };
          this.$refs.pulling.rebase();
          this.submit();
        }
      );
      this.snackbar.show = false;
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
      this.type = "";
      this.query = {};
      this.$nextTick(() => {
        this.$refs.pulling.submit();
      });
    },
    clearDateRange() {
      this.created_at = ["", ""];
      this.dateRangeText = "";
    },
    deleteMovie(id) {
      this.$http.delete(`${this.movieApi}/${id}`).then(
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
