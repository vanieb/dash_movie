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
              <v-card-title v-else-if="status === 'review'">
                <v-icon left color="warning">visibility</v-icon>
                {{ $t("status.review") }} - {{ $t("articles.article") }}
              </v-card-title>
              <v-card-title v-else-if="status === 'publish'">
                <v-icon left color="success">publish</v-icon>
                {{ $t("actions.publish") }} - {{ $t("articles.article") }}
              </v-card-title>
              <v-card-title v-else>
                <v-icon left color="error">close</v-icon>
                {{ $t("actions.decline") }} - {{ $t("articles.article") }}
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
      </v-layout>
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
            :to="`/articles/${article.slug}/edit`"
            v-if="$root.permissions.includes('change_article_details')"
          >
            <v-icon left>edit</v-icon> &nbsp;{{ $t("actions.update") }}
          </v-btn>
        </v-layout>
      </v-layout>
      <v-card>
        <v-container>
          <v-banner single-line>
            <span class="title"
              ><strong>{{ article.title }}</strong></span
            >
            <template
              v-slot:actions
              v-if="
                $root.permissions.includes(
                  'change_article_submission_status'
                ) ||
                  $root.permissions.includes(
                    'change_article_status_approved'
                  ) ||
                  $root.permissions.includes('change_article_status_declined')
              "
            >
              <v-chip
                class="success lighten-1"
                dark
                small
                v-if="
                  article.status == 'review' &&
                    $root.permissions.includes(
                      'change_article_status_approved'
                    )
                "
                @click="openStatusDialog(article, 'approved')"
              >
                <v-icon left small>check</v-icon>
                {{ $t("actions.approve") }}
              </v-chip>
              <v-chip
                class="ml-1 error lighten-1"
                dark
                small
                v-if="
                  article.status === 'review' &&
                    $root.permissions.includes('change_article_status_declined')
                "
                @click="openStatusDialog(article, 'cancelled')"
              >
                <v-icon left small>close</v-icon>
                {{ $t("actions.decline") }}
              </v-chip>
              <!-- DRAFT -->
              <v-chip
                class="warning lighten-1"
                dark
                small
                v-if="
                  article.status === 'draft' &&
                    $root.permissions.includes(
                      'change_article_submission_status'
                    )
                "
                @click="openStatusDialog(article, 'review')"
              >
                <v-icon small left>visibility</v-icon>
                {{ $t("status.review") }}
              </v-chip>
              <v-chip
                class="success lighten-1"
                dark
                small
                v-if="
                  article.status === 'draft' &&
                    $root.permissions.includes('change_article_status_approved')
                "
                @click="openStatusDialog(article, 'publish')"
              >
                <v-icon small left>publish</v-icon>
                {{ $t("actions.publish") }}
              </v-chip>
              <!-- NO Permission -->
              <span class="success--text" v-if="article.status == 'approved'">
                {{ $t("status.published") }}
              </span>
              <span
                class="error--text"
                v-else-if="article.status == 'cancelled'"
              >
                {{ $t("status.declined") }}
              </span>
            </template>
          </v-banner>
          <v-row>
            <v-col cols="12" md="2">
              <v-img
                v-if="article.icon"
                :src="`${article.icon}`"
                class="my-1"
                contain
                height="100"
              />
              <v-avatar v-else class="profile ml-10" contain size="100" tile
                ><v-icon size="120">photo</v-icon>
              </v-avatar>
              <v-layout justify-center mb5 v-if="!article.icon">
                <small
                  >{{ $t("common.icon") }}:
                  {{ $t("system_msg.not_set") }}</small
                >
              </v-layout>
            </v-col>
            <v-col>
              <v-row class="mb-2">
                <span class="title"
                  ><strong>{{ article.title }}</strong></span
                >
              </v-row>
              <v-row>
                <v-icon left class="m-b-sm" small color="indigo"
                  >person_add</v-icon
                ><small
                  >{{ article.created_by }} |
                  {{
                    article.created_at | moment("YYYY-MM-DD HH:mm:ss")
                  }}</small
                >
              </v-row>
              <v-row>
                <v-icon left class="m-b-sm" small color="indigo">edit</v-icon
                ><small
                  >{{ article.updated_by || "-" }} |
                  {{
                    article.updated_at | moment("YYYY-MM-DD HH:mm:ss")
                  }}</small
                >
              </v-row>
              <v-row>
                <small
                  >{{ $t("common.remarks") }}: {{ article.memo || "-" }}</small
                >
              </v-row>
            </v-col>
            <v-col>
              <v-row>
                <v-icon color="warning" left>web</v-icon>
                <v-chip
                  class="ma-1"
                  color="warning"
                  outlined
                  small
                  v-for="website in article.websites"
                  :key="website.id"
                  >{{ website.name }}</v-chip
                >
                <br />
              </v-row>
              <v-row v-if="article.is_active">
                <v-icon color="success" left>check_box</v-icon>
                <v-chip class="ma-1" color="success" small>{{
                  $t("status.enabled")
                }}</v-chip>
                <br />
              </v-row>
              <v-row v-else>
                <v-icon color="gray" left>indeterminate_check_box</v-icon>
                <v-chip class="ma-1" color="gray" small>{{
                  $t("status.disabled")
                }}</v-chip>
                <br />
              </v-row>
              <v-row v-if="article.is_popular">
                <v-icon color="error" left>whatshot</v-icon>
                <v-chip class="ma-1" color="error" dark small>{{
                  $t("nav.popular_articles")
                }}</v-chip>
                <br />
              </v-row>
            </v-col>
          </v-row>
          <v-banner color="primary" dark>{{ $t("seo.seo_data") }}</v-banner>
          <v-flex>
            <v-card-title>{{ $t("seo.keywords") }}</v-card-title>
            <v-card-text>{{
              article.keywords || $t("system_msg.no_data")
            }}</v-card-text>
          </v-flex>
          <v-flex>
            <v-card-title>{{ $t("seo.subject") }}</v-card-title>
            <v-card-text>{{
              article.subject || $t("system_msg.no_data")
            }}</v-card-text>
          </v-flex>
          <v-flex>
            <v-card-title>{{ $t("seo.description") }}</v-card-title>
            <v-card-text>{{
              article.description || $t("system_msg.no_data")
            }}</v-card-text>
          </v-flex>
          <v-flex>
            <v-banner color="primary" dark>{{
              $t("articles.content")
            }}</v-banner>
            <v-card-text
              v-html="article.content || $t('system_msg.no_data')"
            ></v-card-text>
          </v-flex>
        </v-container>
      </v-card>
    </v-container>
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
import { ValidationObserver, ValidationProvider } from "vee-validate";
import SnackBar from "@/components/SnackBar";

export default {
  name: "ArticleDetails",
  components: {
    SnackBar,
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      file: "",
      article: {},
      articleApi: api.articles,
      snackbar: {
        color: "",
        text: "",
        show: false,
      },
      status: "",
      showUpdateStatusDialog: false,
      dialog: {},
      bread_crumbs: [
        {
          text: this.$t("nav.articles"),
          disabled: false,
          to: "/articles?website=1",
        },
        {
          text: this.$t("nav.article_details"),
          disabled: true,
        },
      ],
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      let id = to.params.articleId;
      vm.getArticleDetails(id);
    });
  },
  methods: {
    getArticleDetails(id) {
      this.$http.get(`${this.articleApi}${id}/`).then((response) => {
        this.article = response;
      });
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
      this.getArticleDetails(this.article.slug);
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
        this.$http.patch(`${this.articleApi}${item.slug}/`, statusResult).then(
          (response) => {
            let action_text =
              this.status === "cancelled"
                ? this.$t("status.declined")
                : this.status === "review"
                ? this.$t("status.review")
                : this.status === "publish"
                ? this.$t("status.published")
                : this.$t("status.approved");
            this.snackbar = {
              color: "success",
              show: true,
              text: `[${this.$t("articles.article")}]: ${action_text}`,
            };
            this.closeUpdateStatusDialog();
            this.getArticleDetails(response.slug);
          },
          (error) => {
            this.snackbar = {
              color: "error",
              show: true,
              text: `${this.$t("system_msg.error")}: ${error}`,
            };
            this.getArticleDetails(this.article.slug);
          }
        );
      }
    },
  },
};
</script>
