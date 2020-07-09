<template>
  <v-layout wrap>
    <v-container >
      <v-layout>
        <v-layout justify-start>
          <div style="width:200px !important;">
            <websites
              type="filter"
              :mode="'one'"
              :disabled="!mode"
              :website="query.website"
              @website-select-one="websiteSelectOne">
            </websites>
          </div>
        </v-layout>
        <v-layout justify-end>
          <v-btn
            color="primary"
            dark
            @click="mode=true"
            v-if="!mode && filteredQuerySet.length > 1">
            <v-icon class="mr-3">sort</v-icon>
            {{ $t('actions.sort') }}
          </v-btn>
          <v-btn
            color="primary"
            dark
            class="mr-2"
            @click="submitRank"
            v-if="mode">
            <v-icon class="mr-3">save</v-icon>
            {{$t('actions.submit')}}
          </v-btn>
          <v-btn
            color="primary"
            dark
            @click="cancelSort"
            v-if="mode">
            <v-icon class="mr-3">close</v-icon>
            {{$t('actions.cancel')}}
          </v-btn>
        </v-layout>
      </v-layout>
      <v-data-table
        v-if="showTab"
        :headers="filteredQuerySet.length > 0 ? headers : []"
        :hide-default-footer="true"
        :items="filteredQuerySet">
        <template v-slot:body="{ items }">
          <td v-if="items.length <= 0" colspan="2">
            <v-layout justify-center align-center>
              {{$t('pagination.no_record')}}
            </v-layout>
          </td>
          <draggable
            v-else
            v-model="filteredQuerySet"
            :tag="'tbody'"
            :disabled="!mode">
            <tr v-for="(item, index) in filteredQuerySet" :key="item.id">
              <td width="1%">{{index + 1}}</td>
              <td width="5%">
                <v-btn :color ="iconColor" icon>
                  <v-icon>sort</v-icon>
                </v-btn>
              </td>
              <td>{{ item.title }}</td>
            </tr>
          </draggable>
        </template>
      </v-data-table>
      <v-layout v-else justify-center align-center>
        <small>{{$t('pagination.no_record')}}</small>
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
import api from '@/api/apis'
import draggable from 'vuedraggable'
import SnackBar from '@/components/SnackBar'
import Websites from '../../components/SelectWebsite.vue'

export default {
  name: 'Popular',
  components: {
    draggable,
    SnackBar,
    Websites
  },
  data() {
    return {
      selected_tab: '',
      mode: false,
      app_types: '',
      querySet: [],
      query: {website: 1},
      filteredQuerySet: [],
      typesApi: api.types,
      articleApi: api.articles,
      popularApi: `${api.articles}popular/ordering/?ordering=popular`,
      showTab: true,
      snackbar: {
        color: '',
        text: '',
        show: false,
      },
      headers: [
        {
          sortable: false,
          text: '',
          value: 'mode'
        },
        {
          sortable: false,
          text: '',
          value: 'index'
        },
        {
          sortable: false,
          text: this.$t('articles.title'),
          value: 'title'
        }
      ]
    }
  },
  watch: {
    websites(newObj) {
      this.query.website = newObj
      this.getAppTypes()
    }
  },
  created() {
    this.getArticles()
  },
  computed: {
    iconColor() {
      return this.mode ? 'blue' : 'gray'
    }
  },
  methods: {
    getArticles() {
      this.$http.get(`${this.articleApi}?&website=${this.query.website}&popular=true&active=true`).then(response => {
        this.filteredQuerySet = response.results
        .sort((a, b) => {
          return a['popular_order'] - b['popular_order']
        })
        this.mode = false
      })
    },
    submitRank() {
      let rank = {}
      this.filteredQuerySet.map((p, index) => {
        rank[p.id] = index + 1
      })
      this.$http.post(`${this.popularApi}/`, rank).then(() => {
        this.getArticles()
        this.snackbar = {
          color: 'success',
          show: true,
          text: `${this.$t('actions.sort')}: ${this.$t('status.success')}`
        }
      }, error => {
        this.snackbar = {
          color: 'warning',
          show: true,
          text: `${this.$t('system_msg.error')}: ${error}`
        }
      })
      this.mode = false
      this.snackbar.show = false
    },
    cancelSort() {
      this.mode = !this.mode
    },
    websiteSelectOne(val) {
      this.query.website = val
      this.getArticles()
    }
  }
}
</script>
