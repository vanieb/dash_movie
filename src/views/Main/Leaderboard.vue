<template>
  <v-layout wrap>
    <v-container>
      <v-layout>
        <v-layout justify-start>
          <div style="width:200px !important;">
            <websites
              type="filter"
              :mode="'one'"
              :disabled="!mode"
              :website="query.website"
              @website-select-one="websiteSelectOne"
            >
            </websites>
          </div>
        </v-layout>
        <v-layout justify-end>
          <v-btn
            color="primary"
            dark
            @click="mode = true"
            v-if="
              !mode &&
                filteredQuerySet.length > 1 &&
                $root.permissions.includes('change_app_leaderboard_sort_order')
            "
          >
            <v-icon class="mr-3">sort</v-icon>
            {{ $t("actions.sort") }}
          </v-btn>
          <v-btn
            color="primary"
            dark
            class="mr-2"
            @click="submitRank"
            v-if="mode"
          >
            <v-icon class="mr-3">save</v-icon>
            {{ $t("actions.submit") }}
          </v-btn>
          <v-btn color="primary" dark @click="cancelSort" v-if="mode">
            <v-icon class="mr-3">close</v-icon>
            {{ $t("actions.cancel") }}
          </v-btn>
        </v-layout>
      </v-layout>
      <v-tabs v-model="selected_tab" v-if="showTab">
        <v-tab v-for="type in app_types" :key="type.id">
          {{ type.name }}
        </v-tab>
      </v-tabs>
      <v-layout justify-center v-if="loading">
        <v-progress-circular indeterminate color="blue"></v-progress-circular>
      </v-layout>
      <v-data-table
        v-else-if="showTab"
        :headers="filteredQuerySet.length > 0 ? headers : []"
        :hide-default-footer="true"
        :items="filteredQuerySet"
      >
        <template v-slot:body="{ items }">
          <draggable
            v-if="items.length"
            v-model="filteredQuerySet"
            :tag="'tbody'"
            :disabled="!mode"
          >
            <tr v-for="(item, index) in filteredQuerySet" :key="item.id">
              <td width="5%" class="px-0" v-if="mode">
                <strong class="primary--text">{{ index + 1 }}</strong>
                <v-btn icon v-if="mode">
                  <v-icon :color="iconColor">sort</v-icon>
                </v-btn>
              </td>
              <td v-else width="1%">{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.website.name }}</td>
            </tr>
          </draggable>

          <td colspan="2" v-else>
            <v-layout justify-center align-center>
              <span v-if="!loading">{{ $t("pagination.no_record") }}</span>
              <span v-else
                ><v-progress-circular
                  indeterminate
                  color="blue"
                ></v-progress-circular
              ></span>
            </v-layout>
          </td>
        </template>
      </v-data-table>
      <v-layout v-else justify-center align-center>
        <small>{{ $t("pagination.no_record") }}</small>
      </v-layout>
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
import draggable from "vuedraggable";
import SnackBar from "@/components/SnackBar";
import Websites from "../../components/SelectWebsite.vue";

export default {
  name: "Leaderboard",
  components: {
    draggable,
    SnackBar,
    Websites,
  },
  data() {
    return {
      selected_tab: "",
      mode: false,
      app_types: "",
      loading: false,
      querySet: [],
      query: { website: 1 },
      filteredQuerySet: [],
      typesApi: api.types,
      appsApi: api.apps,
      leaderboardsApi: `${api.apps}rankings/sort-orders/`,
      showTab: false,
      snackbar: {
        color: "",
        text: "",
        show: false,
      },
      headers: [
        {
          sortable: false,
          text: "",
          value: "index",
        },
        {
          sortable: false,
          text: this.$t("common.name"),
          value: "name",
        },
        {
          sortable: false,
          text: this.$t("apps.website"),
          value: "website",
        },
      ],
    };
  },
  watch: {
    selected_tab(newObj) {
      this.loading = true;
      this.getApps(newObj);
      this.showTab = true;
    },
    websites(newObj) {
      this.query.website = newObj;
      this.getAppTypes();
    },
  },
  created() {
    this.getAppTypes();
  },
  computed: {
    iconColor() {
      return this.mode ? "blue" : "gray";
    },
  },
  methods: {
    async getAppTypes() {
      this.loading = true;
      await this.$http
        .get(
          `${this.typesApi}?limit=400&offset=0&website=${this.query.website}&is_active=true`
        )
        .then((response) => {
          this.app_types = response.results;
          if (this.app_types.length == 0) {
            this.selected_tab = "";
            this.filteredQuerySet = [];
            this.showTab = false;
          } else {
            this.showTab = true;
            this.selected_tab = 0;
          }
        });
    },
    async getApps(type) {
      this.type = this.app_types[type].code;
      this.typeId = this.app_types[type].id;
      await this.$http
        .get(
          `${this.appsApi}rankings/?ordering=rank&is_rank=true&types=${this.type}&website=${this.query.website}`
        )
        .then((response) => {
          this.filteredQuerySet = response.results.sort((a, b) => {
            return a["rank"] - b["rank"];
          });
          this.mode = false;
          this.loading = false;
        });
    },
    submitRank() {
      let rank = {};
      this.filteredQuerySet.map((p, index) => {
        rank[p.apptype_details.id] = index + 1;
      });
      this.$http.post(`${this.leaderboardsApi}?field=rank`, rank).then(
        () => {
          this.snackbar = {
            color: "success",
            show: true,
            text: `${this.$t("actions.sort")}: ${this.$t("status.success")}`,
          };
        },
        (error) => {
          this.snackbar = {
            color: "warning",
            show: true,
            text: `${this.$t("system_msg.error")}: ${error}`,
          };
        }
      );
      this.mode = false;
      this.snackbar.show = false;
    },
    cancelSort() {
      this.mode = !this.mode;
    },
    websiteSelectOne(val) {
      this.query.website = val;
      this.getAppTypes();
    },
  },
};
</script>
