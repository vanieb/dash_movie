<template>
  <v-layout wrap>
    <v-container>
      <v-tabs v-model="selected_tab">
        <v-tab
          v-for="type in app_types"
          :key="type.id"
        >{{type.name}}
        </v-tab>
        <v-tab-item v-for="type in app_types" :key="type.id">{{type.id}}
        </v-tab-item>
      </v-tabs>
      
          <!-- {{type.id}}111
           <router-link :to="'/paymenttype/?type=0'"
                class="nav-link"
                :class="{'active': type === 0 }"
                ><b>{{$t('common.pc')}}</b>
            </router-link> -->
          <!-- </v-tab-item> --> 
      <!-- <v-tabs-items v-model="selected_tab">
      <v-tab-item
        v-for="i in 3"
        :key="i"
        :value="'mobile-tabs-5-' + i"
      >
        <v-card flat>
          <v-card-text v-text="text">hello</v-card-text>
        </v-card>
      </v-tab-item> -->
    <!-- </v-tabs-items> -->
      <!-- Add Websites -->
      <!-- Search -->
      <!-- <v-spacer></v-spacer>
      <v-data-table
        :headers="headers"
        :hide-default-footer="true"
        :items="querySet"
      >
      <template v-slot:body="{ items }">
        <span v-if="!items">{{items}}</span>
        <tbody>
          <tr v-for="item in querySet" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.code }}</td>
            <td>{{ item.created_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
            <td>{{ item.updated_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
            <td>{{ item.memo || '-'}}</td>
          </tr>
        </tbody>
        </template>
      </v-data-table> -->
    </v-container>
    <!-- <pagination
      :queryset="querySet"
      :api="websiteApi"
      :query="query"
      ref="pulling"
      @query-data="queryData"
    >
    </pagination> -->
  </v-layout>    
</template>
<script>
import api from '@/api/apis'
// import Pagination from '@/components/Pagination'

export default {
  name: 'Websites',
  // components: {
  //   Pagination
  // },
  data() {
    return {
      selected_tab: 1,
      app_types: '',
      querySet: [],
      typesApi: api.types,
      statusOptions: [
        { text: this.$t('status.enabled'),
          value: 1}, 
        { text: this.$t('status.disabled'),
          value: 2}],
      headers: [
        {
          sortable: false,
          text: this.$t('common.name'),
          value: 'name'
        },
        {
          sortable: false,
          text: this.$t('website.code'),
          value: 'code'
        },
        // {
        //   sortable: false,
        //   text: this.$t('common.status'),
        //   value: 'status',
        //   width: '10%'
        // },
        {
          sortable: false,
          text: this.$t('common.created_at'),
          value: 'created_at'
        },
        {
          sortable: false,
          text: this.$t('common.updated_at'),
          value: 'updated_at'
        },
        {
          sortable: false,
          text: this.$t('common.remarks'),
          value: 'memo'
        }
        // {
        //   sortable: false,
        //   text: this.$t('common.action')
        // }
      ]
    }
  },
  watch: {
      '$route.query.type': function (newType) {
        console.log(newType)
          this.changeType(parseInt(newType))
      },
      selected_tab(newObj) {
        console.log('selected_tab')
        console.log(newObj)
      }
  },
  created() {
    this.getAppTypes()
    // this.$nextTick(() => {
    //   this.$refs.pulling.rebase()
    // })
  },
  methods: {
    getAppTypes() {
      this.$http.get(this.typesApi + '?limit=400&offset=0').then(response => {
        this.app_types = response.results
        .sort((a, b) => {
          return a['id'] - b['id']
        })
      })
    },
    queryData(queryset) {
      this.querySet = queryset
    },
    changeType (type = this.type) {
        type && (this.type = type)
        this.type = type
        this.filteredAppTypes = this.app_types
        // .filter(element => element.platform === 2 || element.platform === this.type)
        // .filter(element => !this.mode || !this.status || parseInt(element.status) === parseInt(this.status))
        // .sort((a, b) => {
        //     let attribute = parseInt(this.type) ? 'rank' : 'rank'
        //     return a[attribute] - b[attribute]
        // })
        // .map(item => ({
        //     ...item,
        //     detail: item.detail.sort((a, b) => a.rank - b.rank)
        // }))
    }
  }
}
</script>
