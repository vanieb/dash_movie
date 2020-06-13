<template>
  <v-layout>
    <ValidationProvider :name="$t('nav.labels')" style="width:733px;" :rules="`${req ? 'required' : ''}`" >
      <v-select
        v-if="mode==='one'"
        :error-messages="errors"
        slot-scope="{ errors }"
        item-value="id"
        item-text="name"
        :items="labels"
        v-model="mylabel"
        :disabled="!disabled"
        :label="elLabel"
        outlined
        dense
        prepend-icon="label"
        placeholder=" ">
      </v-select>
      <v-select v-else
        :error-messages="errors"
        slot-scope= {errors}
        item-value="id"
        item-text="name"
        :items="labels"
        v-model="mylabel"
        :disabled="!disabled"
        :label="elLabel"
        outlined
        dense
        attach
        chips
        multiple
        prepend-icon="label"
        placeholder=" ">
        <template v-slot:selection="{ attrs, item, select, selected }">
          <v-chip
            small chip
            v-bind="attrs"
            :input-value="selected"
            close
            @click="select"
            @click:close="remove(item)"
            >{{ item ? item.name : 0 }}
          </v-chip>
        </template>
      </v-select>
    </ValidationProvider>
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
      default: ''
    },
    req: {
      default: false
    },
    label: {
      default: ''
    },
    mode: {
      default: 'one'
    },
    disabled: {
      default: true
    }
  },
  data() {
    return {
      labels: [],
      mylabel: this.label,
      elLabel: this.$t('nav.labels'),
    }
  },
  watch: {
    label() {
      this.mylabel = this.label
    },
    mylabel(newObj) {
      if (newObj !== undefined) {
        this.$emit('label-select-one', newObj)
        this.$emit('label-select-multiple', this.mylabel, this.index)
      }
    },
    labelFilter(newObj) {
      this.labels = []
      // this.mylabel = ''
      this.getFilteredLabels(newObj)
    }
  },
  created() {
    if (this.req) {
      this.elLabel = `${this.$t('nav.labels')}*`
    }
    if (this.type == 'set') {
      this.getFilteredLabels()
    }
    
  },
  methods: {
    remove (item) {
      this.mylabel.splice(this.mylabel.indexOf(item), 1)
      this.mylabel = [...this.mylabel]
    },
    getFilteredLabels(labelFilter='') {
      this.$http.get(`${api.labels}?limit=400&offset=0&${labelFilter}`).then(response => {
        this.labels = response.results
        if (this.default) {
          this.label = this.default
        }
        let _this = this
        setTimeout(function() {
          _this.mylabel = _this.label
        }, 100)
      })
    }
  }
}
</script>