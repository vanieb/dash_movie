<template>
  <v-layout>
    <ValidationProvider :name="$t('apps.category')" style="width:748px;" :rules="`${req ? 'required' : ''}`" v-if="mode==='one'">
      <v-select
        :error-messages="errors"
        slot-scope="{ errors }"
        item-value="id"
        item-text="name"
        :items="categories"
        v-model="mycategory"
        :value="mycategory ? mycategory.name : ''"
        :disabled="!disabled"
        :label="elLabel"
        outlined
        dense
        prepend-icon="category"
        placeholder=" ">
      </v-select>
    </ValidationProvider>
    <v-flex v-else>
      <strong>{{ $t('common.selected') }} {{ $t('nav.category') }}*</strong>
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel :disabled="categories.length == 0">
            <v-expansion-panel-header>
              <small>{{ $t('common.selected') }} {{ $t('pagination.items') }}: {{selected.length}}</small><br/>
              <span
                v-if="categories.length == 0 && !loading"
                class="error--text">{{ $t('system_notes.select_type') }}<br/>
              </span>
              <span
                v-if="loading"
                class="error--text"><v-progress-circular indeterminate color="info" dense></v-progress-circular><br/>
              </span>
              <span
                v-if="selected.length == 0 && categories.length > 0"
                class="error--text">{{$t('errors.required')}}: {{  $t('nav.category') }}
              </span>
            </v-expansion-panel-header>
            <v-row class="ma-1">
              <span v-for="category in selected" :key="category.id">
                <v-chip
                  small chip
                  close
                  class="ma-1"
                  @click:close="remove(category)"
                  color="success"
                  outlined>{{category.name}}
                </v-chip>
              </span>
            </v-row>
            <v-expansion-panel-content>
              <v-data-table
                v-model="selected"
                :headers="headers"
                :items="categories"
                :loading="loading"
                :items-per-page="20"
                :single-select="false"
                hide-default-footer
                item-key="id"
                show-select
                class="elevation-1 mt-1">
              </v-data-table>
              <v-pagination
                v-if="categories.length > 0"
                v-model="page"
                :length="countPage"
                :total-visible="7"
                small>
              </v-pagination>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-flex>
  </v-layout>
</template>
<script>
import { ValidationProvider } from "vee-validate"
import api from '@/api/apis'
export default {
  components: {
    ValidationProvider
  },
  props: {
    type: {
      default: 'select'
    },
    categoryFilter: {
      default: false
    },
    websiteFilter: {
      default: false
    },
    req: {
      default: false
    },
    category: {
      default: ''
    },
    mode: {
      default: 'one'
    }
  },
  data() {
    return {
      categories: [],
      mycategory: this.category,
      elLabel: this.$t('nav.category'),
      loading: false,
      selected: [],
      limit: 20,
      offset: 0,
      countPage: 0,
      count: 0,
      page: 1,
      search: '',
      headers: [
        {
          sortable: false,
          text: this.$t('nav.category'),
          value: 'name'
        }]
    }
  },
  watch: {
    category() {
      this.mycategory = this.category
    },
    mycategory(newObj) {
      if (newObj !== undefined) {
        this.$emit('category-select-one', newObj)
      }
    },
    categoryFilter(newObj) {
      this.categories = []
      this.selected = []
      if (newObj != '') {
        this.loading = true
        this.getFilteredCategories(newObj)
      }
    },
    selected(newObj) {
      if (newObj != []) {
        this.$emit('category-select-multiple', newObj)
      }
    },
    page(newObj) {
      if (newObj !== this.newObj) {
        this.newObj = newObj
        let offset = parseInt(this.limit) * (parseInt(newObj) - 1)
        this.offset = offset
        this.getFilteredCategories(this.categoryFilter)
      }
      this.changePage = true
    },
    limit() {
      this.loading = true
      this.getPage()
    }
  },
  created() {
    if (this.req) {
      this.elLabel = `${this.$t('apps.category')}*`
    }
    if (this.type == 'set') {
      if (this.categoryFilter) {
        this.getFilteredCategories(this.categoryFilter, 'created')
      }
    }
  },
  methods: {
    remove (item) {
      let index = this.selected.findIndex(element => element.id === item.id)
      this.selected.splice(index, 1)
    },
    async getFilteredCategories(categoryFilter='', mode='') {
      this.loading = true
      await this.$http.get(`${api.categories}?limit=${this.limit}&offset=${this.offset}&website=${this.websiteFilter}&types=${categoryFilter}&active=true`).then(response => {
        this.categories = response.results
        this.count = response.count
        this.getPage()
        if (mode == 'created') {
          let _this = this
          setTimeout(function() {
            _this.selected = _this.category
          }, 100)
        }
        this.loading = false
      })
    },
    getPage() {
      this.countPage = Math.ceil(this.count / this.limit)
    }
  }
}
</script>