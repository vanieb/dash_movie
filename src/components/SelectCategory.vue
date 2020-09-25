<template>
  <v-layout>
    <ValidationProvider :name="$t('apps.category')" style="width:748px;" :rules="`${req ? 'required' : ''}`" >
      <v-select
        v-if="mode==='one'"
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
      <v-select v-else
        :error-messages="errors"
        slot-scope= {errors}
        item-value="id"
        item-text="name"
        :items="categories"
        v-model="mycategory"
        :disabled="loading || disabled"
        :messages="showMessage"
        :label="elLabel"
        outlined
        dense
        attach
        chips
        multiple
        :loading="loading"
        loader-height="4"
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
    type: {
      default: 'select'
    },
    categoryFilter: {
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
    },
    disabled: {
      default: false
    }
  },
  data() {
    return {
      categories: [],
      mycategory: this.category,
      elLabel: this.$t('nav.category'),
      loading: false
    }
  },
  computed: {
    showMessage() {
      return this.disabled && !this.loading ? this.$t('system_notes.select_type') : ''
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
    },
    categoryFilter(newObj) {
      this.categories = []
      console.log(newObj)
      console.log(this.categories)
      this.loading = true
      this.getFilteredCategories(newObj)
    }
  },
  created() {
    if (this.req) {
      this.elLabel = `${this.$t('apps.category')}*`
    }
    if (this.type == 'set') {
      if (this.categoryFilter) {
        this.getFilteredCategories(this.categoryFilter)
      }
    }
  },
  methods: {
    remove (item) {
      let index = this.mycategory.findIndex(element => element.id === item.id)
      this.mycategory.splice(index, 1)
    },
    async getFilteredCategories(categoryFilter='') {
      this.loading = true
      await this.$http.get(`${api.categories}?limit=400&offset=0&${categoryFilter}`).then(response => {
        this.categories = response.results
        console.log(this.categories)
        let _this = this
          setTimeout(function() {
            _this.mycategory = _this.category
          }, 100)
        this.loading = false
      })
    }
  }
}
</script>