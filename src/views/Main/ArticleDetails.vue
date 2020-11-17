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
              <v-breadcrumbs-item
                exact
                :to="item.to"
                :disabled="item.disabled"
              >
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
            <v-icon class="mr-3">edit</v-icon> &nbsp;{{ $t('actions.update') }}
          </v-btn>
        </v-layout>
      </v-layout>
      <v-card>
      <v-container>
        <v-row>
          <v-col cols="12" md="2">
            <v-img v-if="article.icon"
              :src="`${article.icon}`"
              class="my-1"
              contain
              height="100"
            />
            <v-avatar
              v-else
              class="profile ml-10"
              contain
              size="100"
              tile><v-icon size="120">photo</v-icon>
            </v-avatar>
            <v-layout justify-center mb5 v-if="!article.icon">
              <small>{{$t('common.icon')}}: {{$t('system_msg.not_set')}}</small>
            </v-layout>
          </v-col>
          <v-col>
            <v-row class="mb-2">
              <span class="title"><strong>{{article.title}}</strong></span>
            </v-row>
            <v-row>
              <v-icon class="mr-2 m-b-xs" color="green">event</v-icon> {{article.created_at | moment("YYYY-MM-DD HH:mm:ss") }}
            </v-row>
            <v-row>
              <v-icon class="mr-2 m-b-sm" color="error">person</v-icon>{{article.created_by }}
            </v-row>
          </v-col>
          <v-col>
            <v-row>
              <v-icon color="orange">web</v-icon>
              <v-chip class="ma-1" color="orange" outlined small v-for="website in article.websites" :key="website.id">{{website.name}}</v-chip>
              <br/>
            </v-row>
            <v-row v-if="article.is_active">
              <v-icon color="success" class="mr-2">check_box</v-icon>
              <v-chip class="ma-1" color="success" small>{{$t('status.enabled')}}</v-chip>
              <br/>
            </v-row>
            <v-row v-else>
              <v-icon color="gray" class="mr-2">indeterminate_check_box</v-icon>
              <v-chip class="ma-1" color="gray" small>{{$t('status.disabled')}}</v-chip>
              <br/>
            </v-row>
            <v-row v-if="article.is_popular">
              <v-icon color="red" class="mr-2">whatshot</v-icon>
              <v-chip class="ma-1" color="red" dark small>{{$t('nav.popular_articles')}}</v-chip>
              <br/>
            </v-row>
          </v-col>
        </v-row>
        <v-banner color="primary" dark>{{$t('seo.seo_data')}}</v-banner>
        <v-flex>
          <v-card-title>{{$t('seo.subject')}}</v-card-title>
          <v-card-text>{{ article.subject  || $t('system_msg.no_data')}}</v-card-text>
        </v-flex>
        <v-flex>
          <v-card-title>{{$t('seo.keywords')}}</v-card-title>
          <v-card-text>{{ article.keywords  || $t('system_msg.no_data')}}</v-card-text>
        </v-flex>
        <v-flex>
          <v-card-title>{{$t('seo.description')}}</v-card-title>
          <v-card-text v-html="article.description  || $t('system_msg.no_data')"></v-card-text>
        </v-flex>
        <v-flex>
          <v-banner color="primary" dark>{{$t('articles.content')}}</v-banner>
          <v-card-text v-html="article.content  || $t('system_msg.no_data')"></v-card-text>
        </v-flex>
      </v-container>
      </v-card>
    </v-container>
  </v-layout>
</template>
<script>
import api from '@/api/apis'

export default {
  name: 'ArticleDetails',
  data() {
    return {
      file: '',
      article: {},
      articleApi: api.articles,
      snackbar: {
        color: '',
        text: '',
        show: false,
      },
      bread_crumbs: [{
          text: this.$t('nav.articles'),
          disabled: false,
          to: '/articles?website=1'
        },
        {
          text: this.$t('nav.article_details'),
          disabled: true
        }
      ]
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let id = to.params.articleId
      vm.getArticleDetails(id)
    })
  },
  methods: {
    getArticleDetails(id) {
      this.$http.get(`${this.articleApi}${id }/`).then((response) => {
        this.article = response
      })
    }
  }
}
</script>
