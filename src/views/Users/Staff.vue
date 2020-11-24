<template>
  <v-layout wrap>
    <v-container>
      <v-layout justify-start>
        <v-btn
          color="primary"
          dark
          to="/staff/add"
          v-if="$root.permissions.includes('create_staff')"
        >
          <v-icon class="mr-3">person_add</v-icon> &nbsp;{{ $t("actions.add") }}
        </v-btn>
      </v-layout>
      <v-data-table
        :headers="headers"
        :hide-default-footer="true"
        :items="querySet"
      >
        <template v-slot:body="{ items }">
          <span v-if="!items">{{ items }}</span>
          <tbody>
            <tr v-for="item in querySet" :key="item.id">
              <td class="align-center text-center px-0">
                <v-icon left small color="success" v-if="item.is_logged_in"
                  >fiber_manual_record</v-icon
                >
                <v-icon left small v-else>fiber_manual_record</v-icon>
              </td>
              <td width="15%">
                <v-btn icon dense small color="info" :to="`/staff/${item.id}`">
                  <v-icon small>touch_app</v-icon>
                </v-btn>
                {{ item.user.username }}
              </td>
              <td
                class="align-center justify-center layout px-0"
                v-if="$root.permissions.includes('change_staff_status')"
              >
                <v-switch
                  value
                  v-model="item.status"
                  dense
                  @change="
                    toggleStatus(item.id, item.status, item.user.username)
                  "
                >
                </v-switch>
              </td>
              <td class="align-center justify-start" v-else>
                <v-chip v-if="item.status == true" class="success" small>{{
                  $t("status.enabled")
                }}</v-chip>
                <v-chip v-else small>{{ $t("status.disabled") }}</v-chip>
              </td>
              <td>
                {{ item.created_at | moment("YYYY-MM-DD HH:mm:ss") }} / <br />
                {{ item.updated_at | moment("YYYY-MM-DD HH:mm:ss") }}
              </td>
              <td width="40%" style="word-break:break-all;">
                {{ item.memo || "-" }}
              </td>
              <td
                class="align-center justify-center"
                v-if="
                  $root.permissions.includes('change_staff') ||
                    $root.permissions.includes('delete_staff')
                "
              >
                <v-btn
                  left
                  icon
                  small
                  :to="`/staff/${item.id}/edit`"
                  v-if="$root.permissions.includes('change_staff')"
                >
                  <v-icon small>edit</v-icon>
                </v-btn>
                <v-menu
                  offset-y
                  v-if="$root.permissions.includes('delete_staff')"
                >
                  <template v-slot:activator="{ on }">
                    <v-icon color="error" small v-on="on">delete</v-icon>
                  </template>
                  <v-list dark>
                    <v-list-item @click="deleteStaff(item.id, true, $event)">
                      <v-list-item-title>
                        <v-icon left color="warning">warning</v-icon>
                        {{ $t("system_msg.confirm_delete") }}
                        <strong>{{ item.user.username }}</strong>
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
      :api="staffApi"
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

export default {
  components: {
    Pagination,
    SnackBar,
  },
  name: "Staff",
  data() {
    return {
      submitting: false,
      username: "",
      staff: {
        id: "",
        username: "",
        password: "",
        memo: "",
      },
      staffApi: api.staff,
      querySet: [],
      query: {},
      showForm: false,
      snackbar: {
        color: "",
        text: "",
        show: false,
      },
      headers: [
        {
          sortable: false,
          text: this.$t("staff.login_status"),
          value: "is_logged_in",
          align: "center",
          width: "10%",
        },
        {
          sortable: false,
          text: this.$t("login.username"),
          value: "user.username",
          width: "15%",
        },
        {
          sortable: false,
          text: this.$t("common.status"),
          value: "status",
          width: "10%",
          align: this.$root.permissions.includes("change_staff")
            ? "center"
            : " d-none",
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
          text: this.$t("common.remarks"),
          value: "memo",
          width: "40%",
        },
        {
          sortable: false,
          text: this.$t("common.action"),
        },
      ],
    };
  },
  created() {
    this.$nextTick(() => {
      this.$refs.pulling.rebase();
    });
  },
  methods: {
    async saveStaff() {
      const isValid = await this.$refs.form.validate();
      let staffResult = Object({
        username: this.staff.username,
        email: this.staff.email,
        memo: this.staff.memo,
      });
      if (this.staff.password) {
        staffResult = Object({
          ...staffResult,
          password: this.staff.password,
        });
      }
      if (isValid) {
        if (this.staff.id) {
          this.$http.put(`${this.staffApi}${this.staff.id}/`, staffResult).then(
            () => {
              this.$refs.pulling.rebase();
              this.snackbar = {
                color: "success",
                show: true,
                text: `${this.$t("actions.update")} - ${this.$t(
                  "nav.staff"
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
          this.$http.post(this.staffApi, staffResult).then(
            () => {
              this.snackbar = {
                color: "success",
                show: true,
                text: `${this.$t("actions.add")} - ${this.$t(
                  "nav.staff"
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
    updateStaff(item) {
      Object.assign(this.staff, {
        id: item.id,
        username: item.user.username,
        password: item.password,
        memo: item.memo,
      });
      this.username = this.staff.username;
      this.showForm = true;
    },
    deleteStaff(id) {
      this.$http.delete(`${this.staffApi}${id}/`).then(() => {
        this.snackbar = {
          color: "success",
          show: true,
          text: `${this.$t("actions.delete")}: ${this.$t("status.success")}`,
        };
        this.$refs.pulling.rebase();
      });
    },
    toggleStatus(id, status, username) {
      this.toggleLoading = true;
      this.$http
        .put(`${this.staffApi}${id}/`, {
          username: username,
          status: status ? 1 : 0,
        })
        .then(
          (response) => {
            let status_text = response.status
              ? this.$t("status.enabled")
              : this.$t("status.disabled");
            this.snackbar = {
              color: "success",
              show: true,
              text: `[${this.$t("common.status")}]: ${status_text}`,
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
    close() {
      this.staff.id = "";
      this.staff.username = "";
      this.staff.password = "";
      this.staff.memo = "";
      this.username = "";
      this.submitting = false;
      this.$refs.form.reset();
      this.showForm = false;
    },
    queryData(queryset) {
      this.querySet = queryset;
    },
    queryParam(query) {
      this.query = query;
    },
  },
};
</script>
