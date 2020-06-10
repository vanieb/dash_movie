<template>
  <v-layout wrap>
    <v-container >
      <v-layout>
        <v-layout justify-start>
          <websites
            type="filter"
            :mode="'one'"
            :website="query.website"
            @website-select-one="websiteSelectOne">
          </websites>
        </v-layout>
      <v-layout justify-end>
        <v-btn
          color="primary"
          dark
          @click="mode=true"
          v-if="!mode">
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
      <v-tabs v-model="selected_tab">
        <v-tab
          v-for="type in app_types"
          :key="type.id">
          {{type.name}}
        </v-tab>
      </v-tabs>
      <v-data-table
        :headers="headers"
        :hide-default-footer="true"
        :items="filteredQuerySet">
        <template v-slot:body="{ items }">
          <span v-if="!items">{{items}}</span>
          <draggable
            v-model="filteredQuerySet"
            :tag="'tbody'"
            :disabled="!mode">
            <tr v-for="item in filteredQuerySet" :key="item.id">
              <td width="5%">
                <v-btn :color ="iconColor" icon>
                  <v-icon>sort</v-icon>
                </v-btn>
              </td>
              <td>{{ item.name }}</td>
            </tr>
          </draggable>
        </template>
      </v-data-table>
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
  name: 'Leaderboard',
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
      appsApi: api.apps,
      leaderboardsApi: `${api.websites}update_rank`,
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
          text: this.$t('common.name'),
          value: 'name'
        }
      ]
    }
  },
  watch: {
    selected_tab(newObj) {
      this.getApps(newObj + 1)
    },
    websites(newObj) {
      this.query.website = newObj
      this.getAppsTypes()
    }
  },
  created() {
    this.getAppTypes()
  },
  computed: {
    iconColor() {
      return this.mode ? 'blue' : 'gray'
    }
  },
  methods: {
    getAppTypes() {
      this.$http.get(this.typesApi + '?limit=400&offset=0').then(response => {
        this.app_types = response.results
        .sort((a, b) => {
          return a['id'] - b['id']
        })
        this.selected_tab = 0
      })
    },
    getApps(type) {
      this.type = type
      this.$http.get(`${this.appsApi}?ordering=rank&is_rank=true&types=${type}&website=${this.query.website}`).then(response => {
        this.filteredQuerySet = response.results
        .sort((a, b) => {
          return a['rank'] - b['rank']
        })
        this.mode = false
      })
    },
    submitRank() {
      let rank = {}
      this.filteredQuerySet.map((p, index) => {
        rank[p.id] = index +1
      })
      let sortResult = Object({
        rank: rank
      })
      this.$http.put(`${this.leaderboardsApi}/${this.type}/`, sortResult).then(() => {
        this.getApps(this.type)
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
      this.query.websites = val
    }
  }
}
</script>
