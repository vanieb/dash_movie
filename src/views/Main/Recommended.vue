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
      <v-tabs v-model="selected_tab" v-if="showTab">
        <v-tab
          v-for="type in app_types"
          :key="type.id">
          {{type.name}}
        </v-tab>
      </v-tabs>
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
            <tr v-for="(item, index) in filteredQuerySet" :key="item.id" >
              <td width="5%" class="px-0" v-if="mode"><strong class="primary--text">{{index + 1}}</strong>
                <v-btn icon v-if="mode">
                  <v-icon :color="iconColor">sort</v-icon>
                </v-btn>
              </td>
              <td v-else width="1%">{{index + 1}}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.website.name }}</td>
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
  name: 'Recommended',
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
      recommendedApi: `${api.websites}update_rank`,
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
          value: 'index'
        },
        {
          sortable: false,
          text: this.$t('common.name'),
          value: 'name'
        },
        {
          sortable: false,
          text: this.$t('apps.website'),
          value: 'website'
        },
      ]
    }
  },
  watch: {
    selected_tab(newObj) {
      this.getApps(newObj)
    },
    websites(newObj) {
      this.query.website = newObj
      this.getAppTypes()
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
      this.$http.get(`${this.typesApi}?limit=400&offset=0&website=${this.query.website}&is_active=true`).then(response => {
        this.app_types = response.results
        if (this.app_types.length == 0 ) {
          this.selected_tab = ''
          this.filteredQuerySet = []
          this.showTab = false
        } else {
          this.showTab = true
          this.selected_tab = 0
        }
      })
    },
    getApps(type) {
      this.type = this.app_types[type].id
      this.$http.get(`${this.appsApi}?ordering=recommended_rank&is_recommended=true&app_type=${this.type}&website=${this.query.website}`).then(response => {
        this.filteredQuerySet = response.results
        .sort((a, b) => {
          return a['recommended_rank'] - b['recommended_rank']
        })
        this.mode = false
      })
    },
    submitRank() {
      let rank = {}
      this.filteredQuerySet.map((p, index) => {
        rank[p.id] = index + 1
      })
      let sortResult = Object({
        recommend: true,
        rank: rank
      })
      this.$http.put(`${this.recommendedApi}/${this.type}/`, sortResult).then(() => {
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
      this.query.website = val
      this.getAppTypes()
    }
  }
}
</script>
