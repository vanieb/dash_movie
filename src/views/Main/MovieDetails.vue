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
          <v-btn color="blue-grey" dark :to="`/movies/${movie.id}/edit`">
            <v-icon left>edit</v-icon> &nbsp;{{ $t("actions.update") }}
          </v-btn>
        </v-layout>
      </v-layout>
      <v-card>
        <v-container>
          <v-banner single-line>
            <span class="title"
              ><strong>{{ movie.title }} ({{ movie.year }})</strong></span
            >
          </v-banner>
          <v-row>
            <v-col cols="12" md="2">
              <v-img
                v-if="movie.image_url"
                :src="`${movie.image_url}`"
                class="my-1"
                contain
                height="100"
              />
              <v-avatar v-else class="profile ml-10" contain size="100" tile
                ><v-icon size="120">photo</v-icon>
              </v-avatar>
              <v-layout justify-center mb5 v-if="!movie.icon">
                <small
                  >{{ $t("common.icon") }}:
                  {{ $t("system_msg.not_set") }}</small
                >
              </v-layout>
            </v-col>
            <v-col>
              <v-row class="mb-2">
                <span class="title"
                  ><strong>{{ movie.title }}</strong></span
                >
              </v-row>
              <v-row>
                <v-icon left class="m-b-sm" small color="indigo"
                  >person_add</v-icon
                ><small
                  >{{ movie.created_by }} |
                  {{ movie.created_at | moment("YYYY-MM-DD HH:mm:ss") }}</small
                >
              </v-row>
              <v-row>
                <v-icon left class="m-b-sm" small color="indigo">edit</v-icon
                ><small
                  >{{ movie.updated_by || "-" }} |
                  {{ movie.updated_at | moment("YYYY-MM-DD HH:mm:ss") }}</small
                >
              </v-row>
            </v-col>
            <v-col>
              <v-row v-if="movie.status === 1">
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
              <v-row v-if="movie.type == 'ongoing'">
                <v-icon color="warning" left>category</v-icon>
                <v-chip color="warning" small>{{
                  $t("movies.ongoing")
                }}</v-chip>
                <br />
              </v-row>
              <v-row v-else>
                <v-icon color="blue" left>category</v-icon>
                <v-chip color="warning" small>{{
                  $t("movies.previous")
                }}</v-chip>
                <br />
              </v-row>
              <v-row v-if="movie.confidential" class="mt-1">
                <v-icon color="error" left>shield</v-icon>
                <v-chip small color="error"
                  >{{ $t("movies.confidential") }} <br
                /></v-chip>
              </v-row>
              <v-row v-if="movie.imdb_score">
                {{ $t("movies.imdb_score") }}: {{ movie.imdb_score }}
              </v-row>
            </v-col>
            <v-col>
              <v-row v-if="movie.investment">
                {{ $t("movies.investment") }}/{{ $t("movies.return") }}:
                {{ movie.investment }}/{{ movie.return }}
              </v-row>
              <v-row v-if="movie.return_rate">
                {{ $t("movies.return_rate") }}: {{ movie.return_rate }}
              </v-row>
              <v-row v-if="movie.payback_period">
                {{ $t("movies.payback_period") }}: {{ movie.payback_period }}
              </v-row>
            </v-col>
          </v-row>
          <v-flex>
            <v-card-title>{{ $t("movies.director") }}</v-card-title>
            <v-card-text>{{
              movie.director || $t("system_msg.no_data")
            }}</v-card-text>
          </v-flex>
          <v-flex>
            <v-card-title>{{ $t("movies.actors") }}</v-card-title>
            <v-card-text>{{
              movie.actors || $t("system_msg.no_data")
            }}</v-card-text>
          </v-flex>
          <v-flex>
            <v-card-title>{{ $t("movies.awards") }}</v-card-title>
            <v-card-text>
              <v-row v-if="movie.awards.length > 0">
                <v-col>
                  <v-chip
                    v-for="i in 4"
                    :key="i"
                    color="primary lighten-2"
                    small
                    class="mr-2"
                  >
                    <v-img
                      :src="require(`@/assets/images/a${i}.png`)"
                      height="20"
                      width="20"
                      contain
                    >
                    </v-img
                    ><v-spacer></v-spacer>
                  </v-chip>
                </v-col>
              </v-row>
              <span v-else>{{ $t("movies.no_award") }}</span>
            </v-card-text>
          </v-flex>
          <v-flex>
            <v-banner color="blue-grey" dark>{{
              $t("movies.trailer")
            }}</v-banner>
            <v-card-text>
              <video :src="movie.video_url"></video>
            </v-card-text>
          </v-flex>
          <v-flex>
            <v-banner color="blue-grey" dark>{{
              $t("movies.content")
            }}</v-banner>
            <v-card-text
              v-html="movie.content || $t('system_msg.no_data')"
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
import SnackBar from "@/components/SnackBar";

export default {
  name: "MovieDetails",
  components: {
    SnackBar,
  },
  data() {
    return {
      file: "",
      movie: {},
      movieApi: api.movie,
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
          text: this.$t("nav.movies"),
          disabled: false,
          to: "/movies",
        },
        {
          text: this.$t("nav.movie_details"),
          disabled: true,
        },
      ],
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      let id = to.params.movieId;
      vm.getMovieDetails(id);
    });
  },
  methods: {
    getMovieDetails(id) {
      const host = process.env.VUE_APP_API_URL;
      const updatedHost = host.slice(0, -1);
      this.$http.get(`${this.movieApi}/${id}`).then((response) => {
        this.movie = response;
        this.movie.image_url = `${updatedHost}${this.movie.image_url}`;
        this.movie.video_url = `${updatedHost}${this.movie.video_url}`;
      });
    },
  },
};
</script>
