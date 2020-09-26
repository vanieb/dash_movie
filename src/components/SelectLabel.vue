<template>
  <v-layout>
    <ValidationProvider :name="$t('nav.labels')" style="width:748px;" :rules="`${req ? 'required' : ''}`" v-if="mode==='one'">
      <v-select
        :error-messages="errors"
        slot-scope="{ errors }"
        item-value="id"
        item-text="name"
        :items="labels"
        v-model="mylabel"
        :value="mylabel ? mylabel.name : ''"
        :disabled="!disabled"
        :label="elLabel"
        outlined
        dense
        prepend-icon="label"
        placeholder=" ">
      </v-select>
    </ValidationProvider>
    <v-flex v-else>
      <strong>Selected {{ $t('nav.labels') }}*</strong>
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel :disabled="labels.length == 0">
            <v-expansion-panel-header>
              <small>Selected Items: {{selected.length}}</small><br/>
              <span
                v-if="labels.length == 0 && !loading"
                class="error--text">{{ $t('system_notes.select_type') }}<br/>
              </span>
              <span
                v-if="loading"
                class="error--text"><v-progress-circular indeterminate color="info" dense></v-progress-circular><br/>
              </span>
              <span
                v-if="selected.length == 0 && labels.length > 0"
                class="error--text">{{$t('errors.required')}}: {{  $t('nav.labels') }}
              </span>
            </v-expansion-panel-header>
            <v-row class="ma-1">
              <span v-for="label in selected" :key="label.id">
                <v-chip
                  small chip
                  close
                  class="ma-1"
                  @click:close="remove(label)"
                  color="info"
                  outlined>{{label.name}}
                </v-chip>
              </span>
            </v-row>
            <v-expansion-panel-content>
              <v-data-table
                v-model="selected"
                :headers="headers"
                :items="labels"
                :loading="loading"
                :items-per-page="20"
                :single-select="false"
                hide-default-footer
                item-key="id"
                show-select
                class="elevation-1 mt-1">
              </v-data-table>
              <v-pagination
                v-if="labels.length > 0"
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
    labelFilter: {
      default: false
    },
    websiteFilter: {
      default: false
    },
    req: {
      default: false
    },
    label: {
      default: ''
    },
    mode: {
      default: 'one'
    }
  },
  data() {
    return {
      labels: [],
      mylabel: this.label,
      elLabel: this.$t('nav.labels'),
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
          text: this.$t('nav.labels'),
          value: 'name'
        }]
    }
  },
  watch: {
    label() {
      this.mylabel = this.label
    },
    mylabel(newObj) {
      if (newObj !== undefined) {
        this.$emit('label-select-one', newObj)
      }
    },
    labelFilter(newObj) {
      this.labels = []
      this.selected = []
      if (newObj != '') {
        this.loading = true
        this.getFilteredLabels(newObj)
      }
    },
    selected(newObj) {
      if (newObj != []) {
        this.$emit('label-select-multiple', newObj)
      }
    },
    page(newObj) {
      if (newObj !== this.newObj) {
        this.newObj = newObj
        let offset = parseInt(this.limit) * (parseInt(newObj) - 1)
        this.offset = offset
        this.getFilteredLabels(this.labelFilter)
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
      this.elLabel = `${this.$t('nav.labels')}*`
    }
    if (this.type == 'set') {
      if (this.labelFilter) {
        this.getFilteredLabels(this.labelFilter, 'created')
      }
    }
  },
  methods: {
    remove (item) {
      let index = this.selected.findIndex(element => element.id === item.id)
      this.selected.splice(index, 1)
    },
    async getFilteredLabels(labelFilter='', mode='') {
      this.loading = true
      await this.$http.get(`${api.labels}?limit=${this.limit}&offset=${this.offset}&types=${labelFilter}`).then(response => {
        this.labels = response.results
        this.count = response.count
        this.getPage()
        if (mode == 'created') {
          let _this = this
          setTimeout(function() {
            _this.selected = _this.label
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