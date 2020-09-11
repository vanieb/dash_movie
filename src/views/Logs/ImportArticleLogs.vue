<template>
  <v-layout wrap>
    <v-container>
      <v-layout justify-end>
        <v-btn
          color="primary"
          dark @click="refresh">
          <v-icon>refresh</v-icon>
        </v-btn>
      </v-layout> 
      <v-data-table
        :headers="headers"
        :hide-default-footer="true"
        :items="querySet"
      >
      <template v-slot:body="{ items }">
        <span v-if="!items">{{items}}</span>
        <tbody>
          <tr v-for="item in querySet" :key="item.id">
            <td >{{ item.filename }}</td>
            <td class="align-center justify-center px-0" >
              <v-chip
                v-if="item.status == 0"
                class="ma-1"
                color="orange"
                text-color="white"
                style="height:20px; !important font-size:11px;">
                {{$t('status.ongoing')}}
              </v-chip>
              <v-chip
                v-else-if="item.status == 1"
                class="ma-1"
                color="green"
                text-color="white"
                style="height:20px;
                !important font-size:11px;">
                {{$t('status.success')}}
              </v-chip>
              <v-chip
                v-else-if="item.status == 2"
                class="ma-1"
                color="gray"
                style="height:20px;
                !important font-size:11px;">
                {{$t('status.canceled')}}
              </v-chip>
            </td>
            <td>{{ item.created_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
            <td>{{ item.updated_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
            <td v-html="item.memo" width="40%" style="word-break:break-all;" v-if="item.memo"></td>
            <td v-else>-</td>
            <td class="justify-center">
              <v-btn icon @click="goToArticles(item.created_at)" v-if="item.status == 1"> 
                <v-icon small color="blue" class="icon__flip">reply_all</v-icon>
              </v-btn>
              <span v-else class="ml-2">-</span>
            </td>
          </tr>
        </tbody>
        </template>
      </v-data-table>
    </v-container>
    <pagination
      :queryset="querySet"
      :api="importLogsApi"
      :query="query"
      ref="pulling"
      @query-data="queryData"
      @query-param="queryParam"
    >
    </pagination>
    <!-- SNACKBAR -->
    <snack-bar
      :show="snackbar.show"
      :color="snackbar.color"
      :text="snackbar.text" 
    >
    </snack-bar>
  </v-layout>    
</template>
<script>
import api from '@/api/apis'
import Pagination from '@/components/Pagination'
import SnackBar from '@/components/SnackBar'
import Vue from 'vue'

export default {
  components: {
    Pagination,
    SnackBar
  },
  name: 'ImportLogs',
  data() {
    return {
      submitting: false,
      importLogsApi: api.import_logs,
      querySet: [],
      query: {},
      snackbar: {
        color: '',
        text: '',
        show: false,
      },
      headers: [
        {
          sortable: false,
          text: this.$t('common.file'),
          value: 'filename',
          width: '20%'
        },
        {
          sortable: false,
          text: this.$t('common.status'),
          value: 'status',
          width: '7%'
        },
        {
          sortable: false,
          text: this.$t('common.created_at'),
          value: 'created_at',
          width: '12%'
        },
        {
          sortable: false,
          text: this.$t('common.updated_at'),
          value: 'updated_at',
          width: '12%'
        },
        {
          sortable: false,
          text: this.$t('common.remarks'),
          value: 'memo',
          width: '40%'
        },
        {
          sortable: false,
          text: this.$t('common.action')
        }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.$refs.pulling.rebase()
    })
  },
  methods: {
    queryData(queryset) {
      this.querySet = queryset
    },
    refresh() {
      this.$nextTick(() => {
        this.$refs.pulling.rebase()
      })
    },
    queryParam(query) {
      this.query = query
    },
    goToArticles(created_at) {
      let date = Vue.moment(created_at).format('YYYY-MM-DD')
      this.$router.push(`/articles/?&created_at_before=${date}&created_at_after=${date}`)
    }
  }
}
</script>
<style>
.icon__flip {
    -moz-transform: scaleX(-1);
    -o-transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
    transform: scaleX(-1);
    filter: FlipH;
    -ms-filter: "FlipH";
}
</style>