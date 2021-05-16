<template>
  <v-layout wrap>
    <v-container>
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
          <v-btn color="blue-grey" dark :to="`/staff/${staff.id}/edit`">
            <v-icon class="mr-3">edit</v-icon> &nbsp;{{ $t("actions.update") }}
          </v-btn>
        </v-layout>
      </v-layout>
      <v-card>
        <v-container>
          <v-row>
            <v-col cols="12" md="2">
              <v-avatar color="indigo" size="80" class="profile ml-10">
                <v-icon dark size="60">mdi-account-circle</v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="12" md="3">
              <v-row class="mb-2">
                <span class="title"
                  ><strong>{{ staff.username }}</strong></span
                >
              </v-row>
              <v-row>
                <v-icon class="mr-2 m-b-sm" color="error">person_add</v-icon
                >{{ staff.created_by }}
              </v-row>
              <v-row>
                <v-icon class="mr-2 m-b-sm ml-8" color="success" small
                  >event</v-icon
                ><small>{{
                  staff.created_at | moment("YYYY-MM-DD HH:mm:ss")
                }}</small>
              </v-row>
              <v-row>
                <v-icon class="mr-2 m-b-sm">edit</v-icon
                >{{ staff.updated_by || "-" }}
              </v-row>
              <v-row>
                <v-icon class="mr-2 m-b-sm ml-8" color="success" small
                  >event</v-icon
                ><small v-if="staff.updated_at">{{
                  staff.updated_at | moment("YYYY-MM-DD HH:mm:ss")
                }}</small>
                <small v-else>-</small>
              </v-row>
            </v-col>
            <v-col cols="12" md="7">
              <span v-if="staff.status === 1">
                <v-icon color="success" left>check_box</v-icon>
                <v-chip class="ma-1" color="success" small>{{
                  $t("status.enabled")
                }}</v-chip>
                <br />
              </span>
              <span v-else>
                <v-icon color="gray" left>indeterminate_check_box</v-icon>
                <v-chip class="ma-1" small>{{ $t("status.disabled") }}</v-chip>
                <br />
              </span>
              <v-icon color="gray" class="ml-0 mr-2 m-b-sm">notes</v-icon>
              {{ staff.memo || "-" }}
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-container>
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
import SnackBar from "@/components/SnackBar";

export default {
  components: {
    SnackBar,
  },
  name: "Staff",
  data() {
    return {
      submitting: false,
      id: "",
      staff: {
        id: "",
        username: {},
        password: "",
        memo: "",
      },
      staffApi: api.user,
      snackbar: {
        color: "",
        text: "",
        show: false,
      },
      bread_crumbs: [
        {
          text: this.$t("nav.staff"),
          disabled: false,
          to: "/staff",
        },
        {
          text: this.$t("nav.staff_details"),
          disabled: true,
        },
      ],
    };
  },
  computed: {
    isUpdate() {
      return this.id ? true : false;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      let staffId = to.params.staffId;
      if (staffId) {
        vm.getStaffDetails(staffId);
      }
    });
  },
  methods: {
    getStaffDetails(id) {
      this.id = id;
      this.$http.get(`${this.staffApi}/${id}`).then((response) => {
        this.staff = response;
      });
      this.loading = false;
    },
  },
};
</script>
