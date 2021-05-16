<template>
  <ValidationProvider
    :name="$t('movies.awards')"
    :rules="`${req ? 'required' : ''}`"
  >
    <v-select
      v-if="mode === 'one'"
      :error-messages="errors"
      slot-scope="{ errors }"
      item-value="id"
      item-text="name"
      :items="awards"
      v-model="myaward"
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
      item-text="text"
      :items="awards"
      v-model="myaward"
      :disabled="!disabled"
      :label="elLabel"
      outlined
      dense
      attach
      chips
      clearable
      multiple
      color="blue-grey"
      :prepend-icon="type === 'set' ? 'emoji_events' : ''"
      placeholder=" "
    >
      <template v-slot:selection="{ attrs, item, select, selected }">
        <v-chip
          small
          chip
          v-bind="attrs"
          :input-value="selected"
          close
          color="blue-grey"
          @click="select"
          @click:close="remove(item)"
          dark
          ><v-img :src="item.image" contain height="20" width="20"></v-img
          >
          {{ !item.image ? item.text : "" }}
        </v-chip>
      </template>
      <template v-slot:item="item">
        <v-chip small chip color="blue-grey" dark>
          <v-img :src="item.item.image" contain height="20" width="20"></v-img>
          {{ !item.item.image ? item.item.text : "" }}
        </v-chip>
      </template>
    </v-select>
  </ValidationProvider>
</template>
<script>
import { ValidationProvider } from "vee-validate";
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
    award: {
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
      awards: [],
      myaward: this.award,
      elLabel: this.$t("movies.awards"),
      rules: "",
      awardsOptions: [
        {
          id: 0,
          text: this.$t("movies.no_award"),
          value: 0,
          image: "",
        },
        {
          id: 1,
          text: this.$t("movies.award_1"),
          value: 1,
          image: require("@/assets/images/a1.png"),
        },
        {
          id: 2,
          text: this.$t("movies.award_2"),
          value: 2,
          image: require("@/assets/images/a2.png"),
        },
        {
          id: 3,
          text: this.$t("movies.award_3"),
          value: 3,
          image: require("@/assets/images/a3.png"),
        },
        {
          id: 4,
          text: this.$t("movies.award_4"),
          value: 4,
          image: require("@/assets/images/a4.png"),
        },
      ],
    };
  },
  watch: {
    award() {
      this.myaward = this.award;
    },
    myaward(newObj) {
      if (newObj !== undefined) {
        this.$emit("award-select-one", newObj);
        this.$emit("award-select-multiple", this.myaward, this.index);
      }
    },
  },
  created() {
    if (this.req) {
      this.elLabel = `${this.$t("movies.awards")}*`;
    }
    this.awards = this.awardsOptions;
    this.setAwards();
  },
  methods: {
    remove(item) {
      if (this.action !== "add") {
        let index = this.myaward.findIndex((element) => element === item.id);
        this.myaward.splice(index, 1);
      } else {
        let index = this.myaward.findIndex((element) => element === item.id);
        this.myaward.splice(index, 1);
      }
    },
    setAwards() {
      let _this = this;
      setTimeout(function() {
        this.myaward = _this.award;
      }, 100);
      if (this.award.length == 0 && this.award) {
        this.myaward = this.awardsOptions[0].id;
      } else {
        this.myaward = this.myaward.map((i) => Number(i));
      }
    },
  },
};
</script>
