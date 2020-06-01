<template>
  <v-layout>
    <ValidationProvider :name="$t('nav.websites')" style="width:338px;" :rules="`${req ? 'required' : ''}`" >
      <v-select
        v-if="mode==='one'"
        :error-messages="errors"
        slot-scope="{ errors }"
        item-value="id"
        item-text="name"
        :items="websites"
        v-model="mywebsite"
        :disabled="!disabled"
        :label="elLabel"
        outlined
        dense
        prepend-icon="web"
        placeholder=" ">
      </v-select>
      <v-select v-else
        :error-messages="errors"
        slot-scope= {errors}
        item-value="id"
        item-text="name"
        :items="websites"
        v-model="mywebsite"
        :disabled="!disabled"
        :label="elLabel"
        outlined
        dense
        attach
        chips
        clearable
        multiple
        prepend-icon="web"
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
    website: {
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
      websites: [],
      mywebsite: this.website,
      elLabel: this.$t('nav.websites'),
      rules: ''
    }
  },
  watch: {
    website() {
      this.mywebsite = this.website
    },
    mywebsite(newObj) {
      if (newObj !== undefined) {
        this.$emit('website-select-one', newObj)
        this.$emit('website-select-multiple', this.mywebsite, this.index)
      }
    }
  },
  created() {
    console.log(this.req)
    if (this.req) {
      this.elLabel = `${this.$t('nav.websites')}*`
    }
    this.$http.get(api.websites + '?limit=400&offset=0').then(response => {
      this.websites = response.results
      if (this.default) {
        this.website = this.default
      }
      let _this = this
      setTimeout(function() {
        _this.mywebsite = _this.website
      }, 100)
    })
  },
  methods: {
    remove (item) {
      this.mywebsite.splice(this.mywebsite.indexOf(item), 1)
      this.mywebsite = [...this.mywebsite]
    }
  }
}
</script>
