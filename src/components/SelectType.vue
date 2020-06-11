<template>
    <ValidationProvider :name="$t('apps.type')" style="width:338px;" :rules="`${req ? 'required' : ''}`" >
      <v-select
        v-if="mode==='one'"
        :error-messages="errors"
        slot-scope="{ errors }"
        item-value="id"
        item-text="name"
        :items="app_types"
        v-model="mytypes"
        :disabled="!disabled"
        :label="elLabel"
        :outlined="elementType != 'modal' ? true : false"
        dense
        clearable
        :prepend-icon="type === 'set' ? 'new_releases' : '' "
        placeholder=" ">
      </v-select>
      <v-select v-else
        :error-messages="errors"
        slot-scope= {errors}
        item-value="id"
        item-text="name"
        :items="app_types"
        v-model="mytypes"
        :value="mytypes.id"
        :disabled="!disabled"
        :label="elLabel"
        :outlined="elementType != 'modal' ? true : false"
        dense
        attach
        chips
        clearable
        multiple
        :prepend-icon="type === 'set' ? 'new_releases' : '' "
        placeholder=" ">
        <template v-slot:selection="{ attrs, item, select, selected }">
          <v-chip
            small chip
            v-bind="attrs"
            :input-value="selected"
            close
            @click="select"
            @click:close="remove(item)"
            >{{ item.name }}
          </v-chip>
        </template>
      </v-select>
    </ValidationProvider>
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
      default: 'set'
    },
    req: {
      default: false
    },
    types: {
      default: ''
    },
    mode: {
      default: 'one'
    },
    disabled: {
      default: true
    },
    typeFilter: {
      default: true
    },
    elementType: {
      default: ''
    }
  },
  data() {
    return {
      app_types: [],
      mytypes: this.types,
      elLabel: this.$t('apps.type'),
      rules: ''
    }
  },
  watch: {
    types() {
      this.mytypes = this.types
    },
    mytypes(newObj) {
      this.$emit('type-select-one', newObj)
      this.$emit('type-select-multiple', this.mytypes, this.index)
    },
    typeFilter(newObj) {
      this.getFilteredAppTypes(newObj)
    }
  },
  created() {
    if (this.req) {
      this.elLabel = `${this.$t('apps.type')}*`
    }
    this.getFilteredAppTypes(this.typeFilter)
  },
  methods: {
    remove (item) {
      this.mytypes.splice(this.mytypes.indexOf(item), 1)
      this.mytypes = [...this.mytypes]
    },
    getFilteredAppTypes(typeFilter) {
      this.$http.get(`${api.types}?limit=400&offset=0&${typeFilter}`).then(response => {
        this.app_types = response.results
        let _this = this
        setTimeout(function() {
          _this.mytypes = _this.types
        }, 100)
      })
    }
  }
}
</script>
