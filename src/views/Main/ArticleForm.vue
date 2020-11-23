<template>
  <v-layout wrap>
    <v-container v-if="loading">
      <v-layout justify-center align-center>
        <v-progress-circular indeterminate color="blue"></v-progress-circular>
      </v-layout>
    </v-container>
    <v-container v-else>
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
      <validation-observer ref="form">
        <v-card>
          <v-container mt5>
            <small>*{{ $t("errors.required") }}</small>
            <v-row class="ml-1 mr-8">
              <v-col cols="12" md="9">
                <v-row>
                  <validation-provider
                    style="width:748px;"
                    rules="required"
                    :name="$t('articles.title')"
                  >
                    <v-text-field
                      :error-messages="errors"
                      required
                      :label="`${$t('articles.title')}*`"
                      placeholder=" "
                      prepend-icon="title"
                      v-model="article.title"
                      slot-scope="{ errors }"
                      dense
                      outlined
                    >
                    </v-text-field>
                  </validation-provider>
                  <v-spacer></v-spacer>
                </v-row>
                <v-row>
                  <span
                    :style="{
                      width: '748px',
                      marginBottom: isUpdate ? '0px' : '20px',
                    }"
                  >
                    <websites
                      v-if="showWebsites"
                      style="margin-bottom: 20px;"
                      req="true"
                      :mode="'multiple'"
                      :website="article.websites"
                      @website-select-multiple="websiteSelectMultiple"
                    >
                    </websites>
                  </span>
                </v-row>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="12" md="3">
                <v-banner color="primary" dark>
                  {{ $t("actions.upload") }} - {{ $t("common.icon") }}
                </v-banner>
                <v-card>
                  <v-card-text>
                    <v-img
                      v-if="showImage"
                      :src="`${article.imageURI}`"
                      class="my-1"
                      contain
                      height="100"
                    ></v-img>
                  </v-card-text>
                  <v-card-actions>
                    <v-layout justify-center>
                      <v-btn color="primary" @click="$refs.inputUpload.click()">
                        <v-icon dark>cloud_upload</v-icon>
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
              </v-col>
            </v-row>
            <v-spacer></v-spacer>
            <v-banner color="primary" dark>{{ $t("seo.seo_data") }}</v-banner>
            <v-flex>
              <v-card-title>{{ $t("seo.subject") }}</v-card-title>
              <v-card-text>
                <small>{{ $t("system_notes.subject_memo") }}</small>
                <v-textarea
                  outlined
                  v-model="article.subject"
                  rows="2"
                ></v-textarea>
              </v-card-text>
              <v-card-title>{{ $t("seo.keywords") }}</v-card-title>
              <v-card-text>
                <v-textarea
                  outlined
                  v-model="article.keywords"
                  rows="2"
                ></v-textarea>
              </v-card-text>
              <v-card-title>{{ $t("seo.description") }}</v-card-title>
              <v-card-text>
                <v-textarea outlined v-model="article.description"></v-textarea>
              </v-card-text>
            </v-flex>
            <v-banner color="primary" dark
              >{{ $t("nav.articles") }} - {{ $t("articles.content") }}</v-banner
            >
            <v-flex>
              <v-card-title>{{ $t("articles.content") }}</v-card-title>
              <v-card-text>
                <tinymce
                  v-if="showTinyMce"
                  name="introduction"
                  :content="article.content"
                  :key="contentKey"
                  @change-content="changeContent"
                >
                </tinymce>
              </v-card-text>
            </v-flex>
            <v-flex>
              <v-card-title
                >{{ $t("articles.images") }}
                <v-layout class="justify-end">
                  <v-btn color="primary" @click="$refs.inputUploadImage.click()">
                    <v-icon dark>add_photo_alternate</v-icon>
                  </v-btn>
                  <input
                    v-show="false"
                    ref="inputUploadImage"
                    type="file"
                    accept="image/*"
                    @change="uploadImage"
                  />
                </v-layout>
              </v-card-title>
              <v-card-text>
                <small>{{ $t("system_notes.image_memo") }}</small>
              </v-card-text>
              <v-data-table
                item-key="id"
                :items="article.images"
                :headers="headers"
              >
                <template v-slot:item.image_url="{ item }">
                  <img
                    :src="item.image_url"
                    :alt="item.name"
                    height="100"
                    class="mt-2"
                  />
                </template>
                <template v-slot:item.action="{ item }">
                  <v-icon small @click="deleteImage(item)" color="red"
                    >delete</v-icon
                  >
                </template>
                <tbody>
                  <tr v-for="item in article.images" :key="item.id">
                    <td>
                      <img :src="item.image_url" height="100" class="mt-2" />
                    </td>
                    <td>{{ item.image_file }}</td>
                    <td>{{ item.action }}</td>
                  </tr>
                </tbody>
              </v-data-table>
            </v-flex>
            <v-layout justify-start mt-3>
              <v-btn
                color="grey"
                dark
                class="mr-2"
                :loading="submitting"
                v-if="article.status !== 'approved'"
                @click="saveArticle('draft')"
              >
                <v-icon left small>edit</v-icon>
                {{ $t("actions.save") }} {{ $t("status.draft") }}
              </v-btn>
              <v-btn
                color="primary"
                dark
                :loading="submitting"
                @click="saveArticle('approved')"
              >
                <v-icon left small>publish</v-icon>
                {{ $t("actions.publish") }}</v-btn
              >
            </v-layout>
          </v-container>
        </v-card>
      </validation-observer>
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
import tinymce from "../../components/tinymce";
import api from "@/api/apis";
import SnackBar from "@/components/SnackBar";
import Websites from "../../components/SelectWebsite.vue";
import $ from "../../utils/util";
import { ValidationObserver, ValidationProvider } from "vee-validate";

export default {
  name: "ArticleForm",
  components: {
    ValidationObserver,
    ValidationProvider,
    Websites,
    SnackBar,
    tinymce,
  },
  data() {
    return {
      id: "",
      website_removed_some: false,
      updateImages: true,
      showTinyMce: true,
      showWebsites: true,
      article_changed: "",
      showImage: false,
      lang: "",
      articleApi: api.articles,
      loading: false,
      submitting: false,
      snackbar: {
        color: "",
        text: "",
        show: false,
      },
      contentKey: false,
      bread_crumbs: [
        {
          text: this.$t("nav.articles"),
          disabled: false,
          to: "/articles?website=1",
        },
        {
          text: this.$route.meta.title,
          disabled: true,
        },
      ],
      article: {
        images: [],
      },
      uploadInstallerDialog: false,
      uploadLoading: false,
      // selectOne: ['app_type', 'category'],
      selectMultiple: ["websites"],
      nonRequired: ["content", "subject", "keywords", "description"],
      data: {
        websites: "",
      },
      headers: [
        {
          sortable: false,
          text: this.$t("articles.images"),
          value: "image_url",
        },
        {
          sortable: false,
          text: `${this.$t("articles.images")} URL`,
          value: "image_file",
        },
        {
          sortable: false,
          text: this.$t("common.action"),
          value: "action",
        },
      ],
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      let articleId = to.params.articleId;
      if (articleId) {
        vm.getArticleDetails(articleId);
      }
    });
  },
  computed: {
    isUpdate() {
      return this.id ? true : false;
    },
  },
  created() {
    this.lang = $.getLanguage() == "zh_CN" ? "zh-cn" : "";
  },
  methods: {
    getArticleDetails(id) {
      this.id = id;
      this.$http.get(`${this.articleApi}${id}/`).then(
        (response) => {
          this.article = response;
          this.images = this.article.images;
          this.showTinyMce = true;
          this.showWebsites = true;
          this.contentKey = true;
          if (this.article.icon) {
            this.showImage = true;
            this.article.imageURI = this.article.icon;
            this.change_icon = false;
          }
          this.selectMultiple.forEach((item) => {
            this.pushIDs(item, "Multiple");
          });
          // this.selectOne.forEach(item => {
          //   this.pushIDs(item, 'one')
          // })
        },
        (error) => {
          this.snackbar = {
            color: "red",
            show: true,
            text: error,
          };
        }
      );
      this.loading = false;
    },
    pushIDs(item, mode) {
      let val = [];
      if (mode == "Multiple") {
        if (this.article[item]) {
          this.article[item].forEach((item) => {
            if (item) {
              val.push(item.id);
            }
          });
        }
        this.data[item] = val.join(",");
      } else {
        if (this.article[item]) {
          val.push(this.article[item].id);
          this.data[item] = val;
        }
      }
    },
    uploadImage(e) {
      this.image_file = e.target.files[0];
      let formData = new window.FormData();
      formData.set("image_file", this.image_file);
      this.$http.post(`${this.articleApi}images/`, formData).then(
        (response) => {
          this.snackbar = {
            color: "success",
            show: true,
            text: `${this.$t("actions.upload")} - ${this.$t(
              "nav.articles"
            )} ${this.$t("articles.images")}: ${this.$t("status.success")}`,
          };
          if (this.article.images) {
            this.article.images.unshift(response);
          } else {
            this.article.images.push(response);
          }
        },
        (error) => {
          this.snackbar = {
            color: "red",
            show: true,
            text: error,
          };
        }
      );
    },
    deleteImage(article) {
      this.$http.delete(`${this.articleApi}images/${article.id}`).then(() => {
        this.snackbar = {
          color: "success",
          show: true,
          text: `${this.$t("actions.delete")}: ${this.$t("status.success")}`,
        };
        let itemIndex = this.article.images.indexOf(article);
        this.article.images.splice(itemIndex, 1);
      });
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
        this.article.imageURI = e.target.result;
        this.showImage = true;
      };
      fileRead.readAsDataURL(e.target.files[0]);

      this.article.icon = e.target.files[0];
      this.change_icon = true;
    },
    changeContent(val) {
      this.article.content = val;
    },
    websiteSelectMultiple(val) {
      if (val && val[0].name) {
        let newVal = [];
        this.article.websites.forEach((item) => {
          newVal.push(item.id);
        });
        // changed Removed
        if (this.data.websites != newVal.join(",")) {
          this.website_removed_some = true;
          this.article.website_removed = newVal.join(",");
          // unchanged
        } else {
          this.website_changed = false;
        }
        // Changed - Added
      } else {
        this.website_changed = true;
      }
      this.article.websites = val;
    },
    async saveArticle(status) {
      this.snackbar.show = false;
      const isValid = await this.$refs.form.validate();
      if (isValid) {
        let formData = new window.FormData();
        // Select Fields (Multiple) are added if value changed
        if (this.website_removed_some) {
          formData.set("websites", this.article.website_removed);
        } else if (this.website_changed) {
          formData.set("websites", this.article.websites);
        }
        // Select Fields (One) old values are sent if value did not change
        // this.selectOne.forEach(item => {
        //   if ((this.data[item] != this.article[item][0]) && !this.article[item].id) {
        //     formData.set(`${item}_id`, this.article[item])
        //   }
        // })
        if (this.change_icon) {
          formData.set("icon", this.article.icon);
        }
        // String Fields
        formData.set("title", this.article.title);
        this.nonRequired.forEach((item) => {
          formData.set(
            item,
            this.article[item] !== undefined ? this.article[item] : ""
          );
        });
        formData.set("is_active", status === "approved" ? true : false);
        formData.set(
          "is_popular",
          status === "approved" ? this.article.is_popular : false
        );
        formData.set("status", status);
        if (this.isUpdate) {
          this.$http
            .put(`${this.articleApi}${this.article.slug}/`, formData)
            .then(
              (response) => {
                this.snackbar = {
                  color: "success",
                  show: true,
                  text: `${this.$t("actions.update")} - ${this.$t(
                    "nav.article"
                  )}: ${this.$t("status.success")}`,
                };
                this.$router.push(`/articles/${response.slug}`);
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
          this.$http.post(this.articleApi, formData).then(
            (response) => {
              this.snackbar = {
                color: "success",
                show: true,
                text: `${this.$t("actions.add")} - ${this.$t(
                  "nav.article"
                )}: ${this.$t("status.success")}`,
              };
              this.$router.push(`/articles/${response.slug}`);
            },
            (error) => {
              this.snackbar = {
                color: "red",
                show: true,
                text: error,
              };
            }
          );
        }
      } else {
        window.scrollTo(500, 0);
      }
    },
  },
};
</script>
