<template>
  <v-layout wrap>
    <v-container>
      <v-layout>
        <v-layout justify-start>
          <div style="width:200px !important;">
            <website
              type="filter"
              :mode="'one'"
              :website="query.website"
              @website-select-one="websiteSelectOne"
            >
            </website>
          </div>
        </v-layout>
        <v-layout justify-end>
          <validation-observer ref="form">
            <v-dialog v-model="showForm" persistent max-width="500">
              <template v-slot:activator="{ on }">
                <v-btn
                  color="primary"
                  dark
                  v-on="on"
                  v-show="
                    $root.permissions.includes('create_website_friendshiplink')
                  "
                  align-right
                >
                  <v-icon class="mr-3">add_box</v-icon> &nbsp;{{
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
                        :name="$t('common.display_name')"
                      >
                        <v-text-field
                          :error-messages="errors"
                          :label="`${$t('common.display_name')}*`"
                          placeholder=" "
                          required
                          slot-scope="{ errors }"
                          v-model="friendship_link.name"
                        ></v-text-field>
                      </validation-provider>
                    </v-flex>
                    <v-flex xs12>
                      <div width="452px;">
                        <website
                          :key="websiteKey"
                          elementType="modal"
                          type="select"
                          req="true"
                          :mode="'one'"
                          :website="friendship_link.website"
                          @website-select-one="websiteSetOne"
                        >
                        </website>
                      </div>
                    </v-flex>
                    <v-flex xs12>
                      <validation-provider
                        rules="required"
                        :name="$t('apps.link')"
                      >
                        <v-textarea
                          :error-messages="errors"
                          :label="`${$t('apps.link')}*`"
                          placeholder=" "
                          rows="4"
                          slot-scope="{ errors }"
                          v-model="friendship_link.link"
                        ></v-textarea>
                      </validation-provider>
                    </v-flex>
                  </v-layout>
                  <small color="red">*{{ $t("errors.required") }}</small>
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
                    color="primary"
                    dark
                    :loading="submitting"
                    @click="saveFriendshipLink"
                    >{{ $t("actions.save") }}</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </validation-observer>
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
                item-name="text"
                item-value="value"
                :items="statusOptions"
                :label="`${$t('common.status')}`"
                v-model="is_active"
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
                @input="search"
                :label="`${$t('common.display_name')}`"
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
                  range
                  :max="today"
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
              <td>{{ item.name }}</td>
              <td>{{ item.website ? item.website.name : "-" }}</td>
              <td
                class="align-center justify-start"
                v-if="
                  $root.permissions.includes(
                    'change_website_friendshiplink_status'
                  )
                "
              >
                <v-switch
                  value
                  v-model="item.is_active"
                  @change="toggleStatus(item.slug, item.is_active)"
                >
                </v-switch>
              </td>
              <td class="align-center justify-start" v-else>
                <v-chip v-if="item.is_active == true" class="success" small>{{
                  $t("status.enabled")
                }}</v-chip>
                <v-chip v-else small>{{ $t("status.disabled") }}</v-chip>
              </td>
              <td width="30%" style="word-break:break-all;">{{ item.link }}</td>
              <td>
                {{ item.created_at | moment("YYYY-MM-DD HH:mm:ss") }} / <br />
                {{ item.updated_at | moment("YYYY-MM-DD HH:mm:ss") }}
              </td>
              <td
                class="align-center justify-center"
                v-if="
                  $root.permissions.includes(
                    'change_website_friendshiplink_details'
                  ) ||
                    $root.permissions.includes('delete_website_friendshiplink')
                "
              >
                <v-btn
                  class="mr-2"
                  icon
                  @click="updateFriendshipLink(item)"
                  v-if="
                    $root.permissions.includes(
                      'change_website_friendshiplink_details'
                    )
                  "
                >
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-menu
                  offset-y
                  v-if="
                    $root.permissions.includes('delete_website_friendshiplink')
                  "
                >
                  <template v-slot:activator="{ on }">
                    <v-icon color="red" small v-on="on">delete</v-icon>
                  </template>
                  <v-list dark>
                    <v-list-item
                      @click="deleteFriendshipLink(item.slug, true, $event)"
                    >
                      <v-list-item-title>
                        <v-icon left color="orange">warning</v-icon>
                        {{ $t("system_msg.confirm_delete") }}
                        <strong>{{ item.name }}</strong>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
              <td v-else>-</td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </v-container>
    <pagination
      :queryset="querySet"
      :api="friendshipLinkApi"
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
import { ValidationObserver, ValidationProvider } from "vee-validate";
import Website from "../../components/SelectWebsite.vue";

export default {
  name: "FriendshipLink",
  components: {
    Pagination,
    SnackBar,
    ValidationObserver,
    ValidationProvider,
    Website,
  },
  data() {
    return {
      name: "",
      showForm: false,
      querySet: [],
      is_active: "",
      today: date.max_today,
      created_at: ["", ""],
      friendshipLinkApi: api.friendship_link,
      loading: true,
      submitting: false,
      date_menu: false,
      website: "",
      websiteKey: "",
      friendship_link: {
        name: "",
        website: "",
        link: "",
      },
      statusOptions: [
        { text: this.$t("status.enabled"), value: true },
        { text: this.$t("status.disabled"), value: false },
      ],
      snackbar: {
        color: "",
        text: "",
        show: false,
      },
      headers: [
        {
          sortable: false,
          text: this.$t("common.display_name"),
          value: "keyword",
          width: "15%",
        },
        {
          sortable: false,
          text: this.$t("apps.website"),
          value: "website",
        },
        {
          sortable: false,
          text: this.$t("common.status"),
          value: "status",
          width: "10%",
        },
        {
          sortable: false,
          text: this.$t("apps.link"),
          value: "link",
          width: "30%",
        },
        {
          sortable: false,
          text: `${this.$t("common.created_at")}/${this.$t(
            "common.updated_at"
          )}`,
          value: "created_at",
          width: "15%",
        },
        {
          sortable: false,
          text: this.$t("common.action"),
          width: "8%",
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
    is_active(newObj) {
      this.query.is_active = newObj;
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
    });
    this.lang = $.getLanguage() == "zh_CN" ? "zh-cn" : "";
  },
  computed: {
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
    cardIcon() {
      return this.isUpdate ? "edit" : "add_box";
    },
    cardTitle() {
      return this.isUpdate
        ? `${this.$t("actions.update")} - ${this.name}`
        : `${this.$t("actions.add")} - ${this.$t("nav.friendship_link")}`;
    },
    isUpdate() {
      return this.name.length > 0;
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
      this.is_active =
        this.$route.query.is_active === true ||
        this.$route.query.is_active === false ||
        this.$route.query.is_active === "true" ||
        this.$route.query.is_active === "false"
          ? JSON.parse(this.$route.query.is_active)
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
      this.query = {};
      this.$nextTick(() => {
        this.$refs.pulling.submit();
      });
    },
    clearDateRange() {
      this.created_at = ["", ""];
      this.dateRangeText = "";
    },
    websiteSelectOne(val) {
      this.query.website = val;
      this.submit();
    },
    websiteSetOne(val) {
      this.friendship_link.website = val;
    },
    toggleStatus(slug, is_active) {
      this.$http
        .put(`${this.friendshipLinkApi}${slug}/`, {
          is_active: is_active,
        })
        .then(
          (response) => {
            let status_text = response.is_active
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
    updateFriendshipLink(item) {
      Object.assign(this.friendship_link, {
        slug: item.slug,
        name: item.name,
        link: item.link,
        website: item.website.id,
      });
      this.name = item.name;
      this.showForm = true;
    },
    deleteFriendshipLink(slug) {
      this.snackbar.show = false;
      this.$http.delete(`${this.friendshipLinkApi}${slug}/`).then(() => {
        this.snackbar = {
          color: "success",
          show: true,
          text: `${this.$t("actions.delete")}: ${this.$t("status.success")}`,
        };
        this.$refs.pulling.rebase();
      });
    },
    async saveFriendshipLink() {
      const isValid = await this.$refs.form.validate();
      let friendshipLinkResult = Object({
        name: this.friendship_link.name,
        link: this.friendship_link.link,
        website: this.friendship_link.website,
      });
      if (isValid) {
        if (this.friendship_link.slug) {
          this.$http
            .put(
              `${this.friendshipLinkApi}${this.friendship_link.slug}/`,
              friendshipLinkResult
            )
            .then(
              () => {
                this.snackbar = {
                  color: "success",
                  show: true,
                  text: `${this.$t("actions.update")}-${this.$t(
                    "nav.friendship_link"
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
              }
            );
        } else {
          this.$http.post(this.friendshipLinkApi, friendshipLinkResult).then(
            () => {
              this.snackbar = {
                color: "success",
                show: true,
                text: `${this.$t("actions.add")}-${this.$t(
                  "nav.friendship_link"
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
    close() {
      this.friendship_link.slug = "";
      this.friendship_link.name = "";
      this.friendship_link.link = "";
      this.friendship_link.website = "";
      this.name = "";
      this.submitting = false;
      this.$refs.form.reset();
      this.showForm = false;
    },
  },
};
</script>
<style scope lang="scss">
.v-date-picker-title__date {
  font-size: 20px !important;
}
</style>
