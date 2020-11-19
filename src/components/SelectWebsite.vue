<template>
  <ValidationProvider
    :name="$t('apps.website')"
    :rules="`${req ? 'required' : ''}`"
  >
    <v-select
      v-if="mode === 'one'"
      :error-messages="errors"
      slot-scope="{ errors }"
      item-value="id"
      item-text="name"
      :items="websites"
      v-model="mywebsite"
      :disabled="!disabled"
      :label="elLabel"
      :outlined="elementType != 'modal' ? true : false"
      dense
      :hide-details="type === 'set' && elementType == 'modal' ? false : true"
      :prepend-icon="type === 'set' && elementType != 'modal' ? 'web' : ''"
      placeholder=" "
    >
    </v-select>
    <v-select
      v-else
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
      attach
      chips
      clearable
      multiple
      :prepend-icon="type === 'set' ? 'web' : ''"
      placeholder=" "
    >
      <template v-slot:selection="{ attrs, item, select, selected }">
        <v-chip
          small
          chip
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
import { ValidationProvider } from "vee-validate";
import api from "@/api/apis";
export default {
  components: {
    ValidationProvider,
  },
  props: {
    type: {
      default: "set",
    },
    req: {
      default: false,
    },
    website: {
      default: "",
    },
    mode: {
      default: "one",
    },
    disabled: {
      default: true,
    },
    elementType: {
      default: "",
    },
    action: {
      default: "update",
    },
  },
  data() {
    return {
      websites: [],
      mywebsite: this.website,
      elLabel: this.$t("apps.website"),
      rules: "",
    };
  },
  watch: {
    website() {
      this.mywebsite = this.website;
    },
    mywebsite(newObj) {
      if (newObj !== undefined) {
        this.$emit("website-select-one", newObj);
        this.$emit("website-select-multiple", this.mywebsite, this.index);
      }
    },
  },
  created() {
    if (this.req) {
      this.elLabel = `${this.$t("nav.websites")}*`;
    }
    this.getWebsites();
  },
  methods: {
    remove(item) {
      if (this.action !== "add") {
        let index = this.mywebsite.findIndex(
          (element) => element.id === item.id
        );
        this.mywebsite.splice(index, 1);
      } else {
        let index = this.mywebsite.findIndex((element) => element === item.id);
        this.mywebsite.splice(index, 1);
      }
    },
    async getWebsites() {
      await this.$http
        .get(api.websites + "?limit=400&offset=0")
        .then((response) => {
          this.websites = response.results.sort((a, b) => {
            return a["id"] - b["id"];
          });
          if (this.req && this.type == "filter") {
            this.mywebsite = this.websites[0].id;
          }
          let _this = this;
          setTimeout(function() {
            _this.mywebsite = _this.website;
          }, 100);
        });
    },
  },
};
</script>
