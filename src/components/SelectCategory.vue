<template>
  <v-layout>
    <ValidationProvider :name="$t('nav.category')" style="width:338px;" :rules="`${req ? 'required' : ''}`" >
      <v-select
        v-if="mode==='one'"
        :error-messages="errors"
        slot-scope="{ errors }"
        item-value="id"
        item-text="name"
        :items="categories"
        v-model="mycategory"
        :value="mycategory.name"
        :disabled="!disabled"
        :label="elLabel"
        outlined
        dense
        prepend-icon="category"
        placeholder=" ">
      </v-select>
      <v-select v-else
        :error-messages="errors"
        slot-scope= {errors}
        item-value="id"
        item-text="name"
        :items="categories"
        v-model="mycategory"
        :disabled="!disabled"
        :label="elLabel"
        outlined
        dense
        attach
        chips
        multiple
        prepend-icon="category"
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
    req: {
      default: false
    },
    category: {
      default: ''
    },
    mode: {
      default: 'select'
    },
    disabled: {
      default: true
    }
  },
  data() {
    return {
      categories: [],
      mycategory: this.category,
      elLabel: this.$t('nav.category')
    }
  },
  watch: {
    category() {
      this.mycategory = this.category
    },
    mycategory(newObj) {
      if (newObj !== undefined) {
        this.$emit('category-select-one', newObj)
        this.$emit('category-select-multiple', this.mycategory, this.index)
      }
    }
  },
  created() {
    if (this.req) {
      this.elLabel = `${this.$t('nav.category')}*`
    }
    this.$http.get(api.categories + '?limit=400&offset=0').then(response => {
      this.categories = response.results
      let _this = this
        setTimeout(function() {
          _this.mycategory = _this.category[0]
        }, 100)
    })
  },
  methods: {
    remove (item) {
      this.mycategory.splice(this.mycategory.indexOf(item), 1)
      this.mycategory = [...this.mycategory]
    }
  }
}
</script>