<template>
  <v-layout wrap>
    <v-container>
      <!-- Add Websites -->
      <!-- Search -->
      <v-spacer></v-spacer>
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
            <!-- <td class="align-center justify-start layout">
              <v-switch value v-model="item.status"
                @change="toggleStatus(item.id, item.status)">
              </v-switch>
            </td> -->
            <td>{{ item.created_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
            <td>{{ item.updated_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
            <td>{{ item.memo || '-'}}</td>
            <!-- <td class="align-center justify-center">
              <v-btn class="mr-2" icon :to="`/apps/${item.id}/edit`">
                <v-icon>edit</v-icon>
              </v-btn>
            </td> -->
          </tr>
        </tbody>
        </template>
      </v-data-table>
    </v-container>
    <pagination
      :queryset="querySet"
      :api="websiteApi"
      :query="query"
      ref="pulling"
      @query-data="queryData"
    >
    </pagination>
  </v-layout>    
</template>
<script>
import api from '@/api/apis'
import Pagination from '@/components/Pagination'

export default {
  name: 'Websites',
  components: {
    Pagination
  },
  data() {
    return {
      query: {},
      querySet: [],
      websiteApi: api.websites,
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
  created() {
    this.$nextTick(() => {
      this.$refs.pulling.rebase()
    })
  },
  methods: {
    queryData(queryset) {
      this.querySet = queryset
    }
  }
}
</script>
