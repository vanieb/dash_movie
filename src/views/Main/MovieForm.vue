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
            <small class="error--text">*{{ $t("errors.required") }}</small>
            <v-row class="ml-1 mr-8">
              <v-col cols="12" md="9">
                <v-row>
                  <validation-provider
                    style="width:748px;"
                    rules="required"
                    :name="$t('movies.title')"
                  >
                    <v-text-field
                      color="blue-grey"
                      :error-messages="errors"
                      required
                      :label="`${$t('movies.title')}*`"
                      placeholder=" "
                      prepend-icon="title"
                      v-model="movie.title"
                      slot-scope="{ errors }"
                      dense
                      outlined
                    >
                    </v-text-field>
                  </validation-provider>
                  <v-spacer></v-spacer>
                </v-row>
                <v-row>
                  <validation-provider
                    style="width:338px;"
                    rules="required"
                    :name="$t('movies.year')"
                  >
                    <v-text-field
                      :error-messages="errors"
                      :label="`${$t('movies.year')}*`"
                      placeholder=" "
                      slot-scope="{ errors }"
                      dense
                      number
                      color="blue-grey"
                      prepend-icon="calendar_today"
                      v-model.number="movie.year"
                      outlined
                    >
                    </v-text-field>
                  </validation-provider>
                  <v-spacer style="max-width:75px !important;"></v-spacer>
                  <validation-provider
                    style="width:338px;"
                    rules="required"
                    :name="$t('movies.director')"
                  >
                    <v-text-field
                      :error-messages="errors"
                      :label="`${$t('movies.director')}*`"
                      placeholder=" "
                      slot-scope="{ errors }"
                      dense
                      prepend-icon="person"
                      v-model="movie.director"
                      color="blue-grey"
                      outlined
                    >
                    </v-text-field>
                  </validation-provider>
                </v-row>
                <v-row>
                  <validation-provider
                    style="width:748px;"
                    rules="required"
                    :name="$t('movies.actors')"
                  >
                    <v-text-field
                      :error-messages="errors"
                      color="blue-grey"
                      :label="`${$t('movies.actors')}*`"
                      placeholder=" "
                      slot-scope="{ errors }"
                      dense
                      prepend-icon="people"
                      v-model="movie.actors"
                      outlined
                    >
                    </v-text-field>
                  </validation-provider>
                </v-row>
                <v-row>
                  <span
                    :style="{
                      width: '748px',
                      marginBottom: isUpdate ? '0px' : '0px',
                    }"
                  >
                    <awards
                      v-if="showAwards"
                      style="margin-bottom: 20px;"
                      req="true"
                      :mode="'multiple'"
                      :award="movie.awards"
                      @award-select-multiple="awardSelectMultiple"
                    >
                    </awards>
                  </span>
                </v-row>
                <v-row>
                  <validation-provider
                    style="width:338px;"
                    rules="required"
                    :name="$t('movies.type')"
                  >
                    <v-select
                      color="blue-grey"
                      item-name="text"
                      item-value="value"
                      :items="typeOptions"
                      :label="`${$t('movies.type')}`"
                      v-model="movie.type"
                      placeholder=" "
                      prepend-icon="category"
                      outlined
                      dense
                      :error-messages="errors"
                      slot-scope="{ errors }"
                    >
                      <template slot="selection" slot-scope="data">
                        <span class="ml-3">{{ data.item.text }}</span>
                      </template>
                      <template slot="item" slot-scope="data">
                        <span class="ml-3">{{ data.item.text }}</span>
                      </template>
                    </v-select>
                  </validation-provider>
                  <v-spacer style="max-width:35px !important;"></v-spacer>
                  <!-- <validation-provider
                    style="width:118px;"
                    :name="$t('movies.confidential')"
                  > -->
                  <v-checkbox
                    class="align-middle"
                    :disabled="movie.type !== 'ongoing'"
                    color="blue-grey"
                    v-model="movie.confidential"
                    :label="`${$t('movies.confidential')}*`"
                  ></v-checkbox>
                  <!-- </validation-provider> -->
                  <v-spacer style="max-width:35px !important;"></v-spacer>
                  <validation-provider
                    style="width:225;"
                    rules="required|between:1,10"
                    :name="$t('movies.imdb_score')"
                  >
                    <v-text-field
                      :error-messages="errors"
                      :label="`${$t('movies.imdb_score')}*`"
                      placeholder=" "
                      slot-scope="{ errors }"
                      dense
                      number
                      prepend-icon="star"
                      v-model.number="movie.imdb_score"
                      outlined
                      color="blue-grey"
                    >
                    </v-text-field>
                  </validation-provider>
                </v-row>
                <v-row>
                  <validation-provider
                    style="width:225px;"
                    rules="required|numeric"
                    :name="$t('movies.investment')"
                  >
                    <v-text-field
                      :error-messages="errors"
                      :label="`${$t('movies.investment')}*`"
                      placeholder=" "
                      slot-scope="{ errors }"
                      dense
                      prepend-icon="monetization_on"
                      v-model="movie.investment"
                      outlined
                      color="blue-grey"
                    >
                    </v-text-field>
                  </validation-provider>
                  <v-spacer style="max-width:35px !important;"></v-spacer>
                  <validation-provider
                    style="width:225px;"
                    rules="required|numeric"
                    :name="$t('movies.return')"
                  >
                    <v-text-field
                      :error-messages="errors"
                      :label="`${$t('movies.return')}*`"
                      placeholder=" "
                      slot-scope="{ errors }"
                      dense
                      prepend-icon="show_chart"
                      v-model="movie.return"
                      outlined
                      color="blue-grey"
                    >
                    </v-text-field>
                  </validation-provider>
                  <v-spacer style="max-width:35px !important;"></v-spacer>
                  <validation-provider
                    style="width:230px;"
                    rules="required"
                    :name="$t('movies.payback_period')"
                  >
                    <v-text-field
                      :error-messages="errors"
                      :label="`${$t('movies.payback_period')}*`"
                      placeholder=" "
                      slot-scope="{ errors }"
                      dense
                      number
                      prepend-icon="history"
                      v-model.number="movie.payback"
                      outlined
                      color="blue-grey"
                    >
                    </v-text-field>
                  </validation-provider>
                </v-row>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="12" md="3">
                <v-banner color="blue-grey" dark>
                  {{ $t("actions.upload") }} -
                  {{ `${$t("common.icon")}*` }}
                </v-banner>
                <v-card>
                  <v-card-text>
                    <v-img
                      v-if="showImage"
                      :src="`${movie.imageURI}`"
                      class="my-1"
                      contain
                      height="100"
                    ></v-img>
                  </v-card-text>
                  <v-card-actions>
                    <v-layout justify-center>
                      <v-btn
                        color="blue-grey"
                        @click="$refs.inputUpload.click()"
                      >
                        <v-icon color="white">cloud_upload</v-icon>
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
            <v-banner color="blue-grey" dark
              >{{ $t("actions.upload") }} - {{ $t("movies.trailer") }}</v-banner
            >
            <v-flex>
              <v-card-text>
                <span>{{ $t("movies.trailer") }}: {{ movie.video_url }}</span>
              </v-card-text>
              <v-card-text>
                <validation-provider
                  style="width:310px;"
                  :name="$t('common.file')"
                >
                  <v-file-input
                    outlined
                    dense
                    clearable
                    v-model="movie.video"
                    :error-messages="errors"
                    :label="
                      `${movie.video_url}`
                        ? `${$t('movies.trailer')}`
                        : `${$t('movies.trailer')}*`
                    "
                    placeholder=" "
                    color="blue-grey"
                    slot-scope="{ errors }"
                  ></v-file-input>
                </validation-provider>
              </v-card-text>
            </v-flex>
            <v-banner color="blue-grey" dark
              >{{ $t("nav.movies") }} - {{ $t("movies.content") }}</v-banner
            >
            <v-flex>
              <v-card-title>
                {{ $t("movies.content") }}
              </v-card-title>
              <v-card-text>
                <tinymce
                  v-if="showTinyMce"
                  name="introduction"
                  :content="movie.content"
                  :key="contentKey"
                  @change-content="changeContent"
                >
                </tinymce>
              </v-card-text>
            </v-flex>
            <!-- <v-flex>
              <v-card-title
                >{{ $t("movies.images") }}
                <v-layout class="justify-end">
                  <v-btn
                    color="blue-grey"
                    @click="$refs.inputUploadImage.click()"
                  >
                    <v-icon color="white">add_photo_alternate</v-icon>
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
                :items="movie.images"
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
                  <v-icon small @click="deleteImage(item)" color="error"
                    >delete</v-icon
                  >
                </template>
                <tbody>
                  <tr v-for="item in movie.images" :key="item.id">
                    <td>
                      <img :src="item.image_url" height="100" class="mt-2" />
                    </td>
                    <td>{{ item.image_file }}</td>
                    <td>{{ item.action }}</td>
                  </tr>
                </tbody>
              </v-data-table>
            </v-flex> -->
            <v-layout justify-start mt-3>
              <v-dialog v-model="uploadDialog" persistent max-width="600">
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="blue-grey"
                    dark
                    v-on="on"
                    :loading="submitting"
                    @click="saveMovie()"
                  >
                    <v-icon left small>save</v-icon>
                    {{ $t("actions.save") }}
                  </v-btn>
                </template>
                <v-card-title class="blue-grey" dark v-if="movie.video">{{
                  $t("system_notes.uploading")
                }}</v-card-title>
                <v-progress-linear
                  v-if="uploadLoading"
                  color="blue-grey"
                  height="25"
                  v-model="uploadPercentage"
                  striped
                >
                  <template v-slot="{ value }">
                    <strong>{{ Math.ceil(value) }}%</strong>
                  </template>
                </v-progress-linear>
              </v-dialog>
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
import $ from "../../utils/util";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import Awards from "../../components/SelectAward.vue";
import axios from "axios";

export default {
  name: "MovieForm",
  components: {
    ValidationObserver,
    ValidationProvider,
    SnackBar,
    tinymce,
    Awards,
  },
  data() {
    return {
      id: "",
      award_removed_some: false,
      updateImages: true,
      showTinyMce: true,
      movie_changed: "",
      change_video: true,
      showAwards: false,
      showImage: false,
      lang: "",
      movieApi: api.movie,
      loading: false,
      submitting: false,
      selectMultiple: ["awards"],
      snackbar: {
        color: "",
        text: "",
        show: false,
      },
      data: [],
      contentKey: false,
      bread_crumbs: [
        {
          text: this.$t("nav.movies"),
          disabled: false,
          to: "/movies",
        },
        {
          text: this.$route.meta.title,
          disabled: true,
        },
      ],
      movie: {
        images: [],
      },
      typeOptions: [
        { text: this.$t("movies.ongoing"), value: "ongoing" },
        { text: this.$t("movies.previous"), value: "previous" },
      ],
      uploadPercentage: 0,
      uploadDialog: false,
      uploadLoading: false,
      nonRequired: ["content"],
      headers: [
        {
          sortable: false,
          text: this.$t("movies.images"),
          value: "image_url",
        },
        {
          sortable: false,
          text: `${this.$t("movies.images")} URL`,
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
      let movieId = to.params.movieId;
      if (movieId) {
        vm.getMovieDetails(movieId);
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
    if (this.$route.name == "Add Movie") {
      this.showAwards = true;
    }
  },
  methods: {
    getMovieDetails(id) {
      this.id = id;
      const host = process.env.VUE_APP_API_URL;
      const updatedHost = host.slice(0, -1);
      this.$http.get(`${this.movieApi}/${id}`).then(
        (response) => {
          this.movie = response;
          this.images = this.movie.images;
          this.showTinyMce = true;
          this.showAwards = true;
          this.contentKey = true;
          if (this.movie.image_url) {
            this.showImage = true;
            this.movie.imageURI = `${updatedHost}${this.movie.image_url}`;
            this.change_image = false;
          }
          if (this.movie.video_url) {
            this.movie.video_url = `${updatedHost}${this.movie.video_url}`;
            this.change_video = false;
          }
          this.selectMultiple.forEach((item) => {
            this.pushIDs(item, "Multiple");
          });
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
        if (this.movie[item]) {
          this.movie[item].forEach((item) => {
            if (item) {
              val.push(item.id);
            }
          });
        }
        this.data[item] = val.join(",");
      } else {
        if (this.movie[item]) {
          val.push(this.movie[item].id);
          this.data[item] = val;
        }
      }
    },
    awardSelectMultiple(val) {
      if (val && val[0].text) {
        let newVal = [];
        // this.movie.awards.forEach((item) => {
        //   newVal.push(item.id);
        // });
        // changed Removed
        if (this.data.awards != newVal.join(",")) {
          this.award_removed_some = true;
          this.movie.award_removed = newVal.join(",");
          // unchanged
        } else {
          this.award_changed = false;
        }
        // Changed - Added
      } else {
        this.award_changed = true;
      }
      this.movie.awards = val;
    },
    async uploadFile() {
      this.snackbar.show = false;
      const isValid = await this.$refs.uploadFileform.validate();
      if (isValid) {
        this.uploadLoading = true;
      }
    },
    uploadImage(e) {
      this.image_file = e.target.files[0];
      let formData = new window.FormData();
      formData.set("image_file", this.image_file);
      this.$http.post(`${this.movieApi}images/`, formData).then(
        (response) => {
          this.snackbar = {
            color: "success",
            show: true,
            text: `${this.$t("actions.upload")} - ${this.$t(
              "nav.movies"
            )} ${this.$t("movies.images")}: ${this.$t("status.success")}`,
          };
          if (this.movie.images) {
            this.movie.images.unshift(response);
          } else {
            this.movie.images.push(response);
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
    deleteImage(movie) {
      this.$http.delete(`${this.movieApi}images/${movie.id}`).then(() => {
        this.snackbar = {
          color: "success",
          show: true,
          text: `${this.$t("actions.delete")}: ${this.$t("status.success")}`,
        };
        let itemIndex = this.movie.images.indexOf(movie);
        this.movie.images.splice(itemIndex, 1);
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
        this.movie.imageURI = e.target.result;
        this.showImage = true;
      };
      fileRead.readAsDataURL(e.target.files[0]);

      this.movie.image = e.target.files[0];
      this.change_image = true;
    },
    changeContent(val) {
      this.movie.content = val;
    },
    async saveMovie() {
      this.snackbar.show = false;
      const isValid = await this.$refs.form.validate();
      if (isValid) {
        if (!this.movie.image && !this.isUpdate) {
          this.snackbar = {
            color: "red",
            show: true,
            text: `${this.$t("errors.required")}: ${this.$t(
              "movies.movie"
            )} ${this.$t("common.icon")}`,
          };
          this.uploadLoading = false;
          this.uploadDialog = false;
          return;
        }
        let formData = new window.FormData();
        if (this.award_removed_some) {
          formData.set("awards", this.movie.award_removed);
        } else if (this.award_changed) {
          formData.set("awards", this.movie.awards);
        }
        if (this.movie.image) {
          formData.set("image", this.movie.image);
        }
        if (this.movie.video) {
          formData.set("video", this.movie.video);
        }
        // String Fields
        formData.set(
          "confidential",
          this.movie.confidential ? this.movie.confidential : "false"
        );
        formData.set("title", this.movie.title);
        formData.set("year", this.movie.year);
        formData.set("director", this.movie.director);
        formData.set("actors", this.movie.actors);
        formData.set("imdb_score", this.movie.imdb_score);
        formData.set("investment", this.movie.investment);
        formData.set("return", this.movie.return);
        formData.set("type", this.movie.type);
        formData.set("payback", this.movie.payback);
        this.nonRequired.forEach((item) => {
          formData.set(
            item,
            this.movie[item] !== undefined ? this.movie[item] : ""
          );
        });
        this.uploadLoading = true;
        if (this.isUpdate) {
          axios
            .put(`${this.movieApi}/${this.movie.id}`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
              onUploadProgress: function(progressEvent) {
                this.uploadPercentage = parseInt(
                  Math.round((progressEvent.loaded / progressEvent.total) * 100)
                );
              }.bind(this),
            })
            .then(
              (response) => {
                this.snackbar = {
                  color: "success",
                  show: true,
                  text: `${this.$t("actions.update")} - ${this.$t(
                    "nav.movies"
                  )}: ${this.$t("status.success")}`,
                };
                this.$router.push(`/movies/${response.id}`);
              },
              (error) => {
                this.snackbar = {
                  color: "red",
                  show: true,
                  text: error,
                };
                this.uploadLoading = false;
                this.uploadDialog = false;
              }
            );
        } else {
          this.$http
            .post(this.movieApi, formData, {
              headers: { "Content-Type": "multipart/form-data" },
              onUploadProgress: function(progressEvent) {
                this.uploadPercentage = parseInt(
                  Math.round((progressEvent.loaded / progressEvent.total) * 100)
                );
              }.bind(this),
            })
            .then(
              (response) => {
                this.snackbar = {
                  color: "success",
                  show: true,
                  text: `${this.$t("actions.add")} - ${this.$t(
                    "nav.movies"
                  )}: ${this.$t("status.success")}`,
                };
                this.$router.push(`/movies/${response.id}`);
              },
              (error) => {
                this.snackbar = {
                  color: "red",
                  show: true,
                  text: error,
                };
                this.uploadLoading = false;
                this.uploadDialog = false;
              }
            );
        }
      } else {
        window.scrollTo(500, 0);
        this.uploadLoading = false;
        this.uploadDialog = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.no-p-b {
  padding-bottom: 0px !important ;
}
</style>
