<template>
  <v-layout wrap>
    <v-container>
      <v-data-table
        :headers="headers"
        :hide-default-footer="true"
        :items="querySet"
      >
        <template v-slot:body="{ items }">
          <span v-if="!items">{{ items }}</span>
          <tbody>
            <tr v-for="(preference, index) in querySet" :key="preference.id">
              <td width="30%">
                {{ preference.display_name }}
                <span v-if="preference.config_type === 3">
                  <br />
                  <small class="info--text"
                    ><v-icon small class="info--text">info</v-icon>
                    {{ preference.note }}</small
                  >
                </span>
              </td>
              <td class="align-center justify-center" width="60%">
                <div
                  v-if="
                    preference.config_type === 1 &&
                      typeof preference.value === 'object'
                  "
                >
                  <span
                    v-for="(e, i) in preference.value"
                    :key="e.key"
                    class="m-b-0"
                  >
                    <span>{{ `${!i ? "" : " , "}${e.display_name}: ` }}</span>
                    <span
                      :class="e.value == 1 ? 'success' : 'danger'"
                      class="label"
                      v-if="e.config_type === 2"
                    >
                      {{
                        e.value ? $t("status.active") : $t("status.inactive")
                      }}
                    </span>
                    <span v-else>{{ e.value ? e.value : "-" }}</span>
                  </span>
                </div>
                <div v-else-if="preference.config_type === 2">
                  <img
                    v-if="preference.image"
                    :src="preference.image"
                    :alt="preference.display_name"
                  />
                  <span v-else>-</span>
                </div>
                <v-checkbox
                  dense
                  v-model="preference.value"
                  v-else-if="preference.config_type === 3"
                  :color="preference.value ? 'primary' : 'red'"
                  @change="handleChangeEvent(preference, index)"
                >
                  <template v-slot:label>
                    <span
                      :class="
                        preference.value ? 'primary--text' : 'error--text'
                      "
                      >{{
                        preference.value
                          ? $t("status.enabled")
                          : $t("status.disabled")
                      }}</span
                    >
                  </template>
                </v-checkbox>

                <span v-else>
                  <span v-if="preference.value.length > 100">{{
                    preference.value | truncate(120, "...")
                  }}</span>
                  <span v-else>{{
                    preference.value ? preference.value : "-"
                  }}</span>
                </span>
              </td>
              <td class="align-center justify-center">
                <v-icon
                  class="mr-2"
                  small
                  @click="openModal(index, preference)"
                  v-if="preference.config_type !== 3"
                  >edit</v-icon
                >
                <span v-else>-</span>
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
      <!-- preference update dialog -->
      <validation-observer ref="form">
        <v-dialog v-model="modal.showModal" persistent max-width="500">
          <v-card>
            <v-card-title class="headline">
              <v-icon class="mr-3">edit</v-icon> &nbsp;
              {{ $t("actions.update") }} - {{ modal.displayName }}
            </v-card-title>
            <v-card-text>
              <span v-if="modal.note">
                <v-icon small>info</v-icon>&nbsp;&nbsp;
                <small>{{ modal.note }}</small>
              </span>
            </v-card-text>
            <v-card-text>
              <div v-if="modal.config_type === 2" class="upload-qr-container">
                <v-banner class="primary" dark>
                  {{ $t("actions.upload") }} - {{ $t("common.image") }}
                  <template v-slot:actions>
                    <v-btn icon class="primary" @click="clearImage()">
                      <v-icon color="white">close</v-icon>
                    </v-btn>
                  </template>
                </v-banner>
                <v-card>
                  <v-card-text>
                    <v-img
                      v-if="showImage"
                      :src="`${modal.imageURI}`"
                      class="my-1"
                      contain
                      height="100"
                    ></v-img>
                  </v-card-text>
                  <v-card-actions>
                    <v-layout justify-center>
                      <v-btn
                        class="primary"
                        dark
                        @click="$refs.imageUpload.click()"
                      >
                        <v-icon color="white">cloud_upload</v-icon>
                      </v-btn>
                      <input
                        v-show="false"
                        ref="imageUpload"
                        type="file"
                        accept="image/*"
                        @change="uploadImage"
                      />
                    </v-layout>
                  </v-card-actions>
                </v-card>
              </div>
              <div v-else>
                <!-- Needs Update -->
                <div
                  v-if="
                    modal.config_type === 1 && typeof modal.value === 'object'
                  "
                >
                  <div
                    class="row m-t-xs"
                    v-for="(e, index) in modal.value"
                    :key="index"
                  >
                    <div class="col-sm-4 col-sm-offset-1 text-right">
                      <label class="form-control-label p-r-0 text-xs">
                        {{ e.display_name }}
                      </label>
                    </div>
                    <div class="col-sm-5">
                      <input
                        class="form-control"
                        v-model.trim="e.value"
                        v-if="e.type !== 2"
                      />
                      <span
                        class="label m-r-sm"
                        :class="e.value ? 'success' : 'danger'"
                        v-else-if="e.type === 2"
                      >
                        {{
                          e.value ? $t("status.enabled") : $t("status.disabled")
                        }}
                      </span>
                      <label class="md-switch m-r m-t-xs" v-if="e.type === 2">
                        <input type="checkbox" v-model="e.value" />
                        <i class="success" />
                      </label>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <v-textarea
                    class="form-control"
                    placeholder=" "
                    :label="$t('settings.parameter_value')"
                    outlined
                    v-model.trim="modal.value"
                    rows="8"
                    spellcheck="false"
                    ref="modalContent"
                    v-if="modal.config_type === 6"
                  ></v-textarea>
                  <validation-provider
                    rules="max:250"
                    :name="$t('settings.parameter_value')"
                    v-else
                  >
                    <v-text-field
                      :counter="modal.config_type == 4 ? false : 250"
                      :error-messages="errors"
                      slot-scope="{ errors }"
                      v-model.trim="modal.value"
                      spellcheck="false"
                      :type="modal.config_type == 4 ? 'number' : ''"
                      placeholder=" "
                      :label="$t('settings.parameter_value')"
                      ref="modalContent"
                    ></v-text-field>
                  </validation-provider>
                </div>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey lighten-1" @click="closeModal()"
                >{{
                  modal.loading ? $t("actions.cancel") : $t("actions.close")
                }}
              </v-btn>
              <v-btn
                class="primary"
                dark
                :disabled="modal.loading"
                @click="updatePreference(modal)"
                >{{ $t("actions.submit") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </validation-observer>
      <!-- SNACKBAR -->
      <snack-bar
        :show="snackbar.show"
        :color="snackbar.color"
        :text="snackbar.text"
      >
      </snack-bar>
    </v-container>
  </v-layout>
</template>
<script>
import api from "@/api/apis";
import SnackBar from "@/components/SnackBar";
// import $ from "@/utils/util";
import { ValidationObserver, ValidationProvider } from "vee-validate";

/*
TYPE_STR = 1
TYPE_IMAGE = 2
TYPE_BOOLEAN = 3
TYPE_INT = 4
TYPE_FLOAT = 5
TYPE_TEXT = 6
*/

export default {
  name: "GlobalSettings",
  components: {
    SnackBar,
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      showImage: "",
      image: "",
      imageURI: "",
      modal: {
        showModal: false,
        image: "",
        index: "",
        key: "",
        value: "",
        loading: false,
      },
      querySet: [],
      globalSettingsApi: api.global_settings,
      snackbar: {
        color: "",
        text: "",
        show: false,
      },
      headers: [
        {
          sortable: false,
          text: this.$t("settings.parameter"),
          value: "display_name",
        },
        {
          sortable: false,
          text: this.$t("settings.parameter_value"),
          value: "value",
        },
        {
          sortable: false,
          text: this.$t("common.action"),
          value: "",
        },
      ],
    };
  },
  watch: {
    selected_tab(newObj) {
      this.getApps(newObj);
    },
    websites(newObj) {
      this.query.website = newObj;
      this.getAppTypes();
    },
  },
  created() {
    this.getGlobalSettings();
  },
  filters: {
    truncate: function(text, length, suffix) {
      return text.substring(0, length) + suffix;
    },
  },
  computed: {
    iconColor() {
      return this.mode ? "blue" : "gray";
    },
  },
  methods: {
    getGlobalSettings() {
      this.$http
        .get(this.globalSettingsApi)
        .then((response) => {
          this.querySet = response.results;
          this.querySet.forEach(this.typeTransform);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    typeTransform(e) {
      if (e.config_type === 3) {
        Object.assign(e, {
          value: e.value === "True" || e.value === "true",
        });
      }
      // if ($.isJsonString(e.value)) {
      //   Object.assign(e, {
      //     value: JSON.parse(e.value),
      //   });
      //   e.value.forEach((element) => {
      //     element.value =
      //       element.config_type === 2 ? parseInt(element.value) : element.value;
      //   });
      // }
    },
    openModal(
      index,
      { display_name: displayName, key, image, value, config_type, note }
    ) {
      Object.assign(this.modal, {
        showModal: true,
        displayName,
        key,
        value,
        config_type,
        note,
        image,
        index,
        loading: false,
      });
      if (config_type === 1 && typeof value === "object") {
        this.modal.value = this.modal.value.map((e) => Object.assign({}, e));
      } else {
        this.$nextTick(() => {
          if (this.$refs.modalContent) {
            this.$refs.modalContent.focus();
          }
        });
      }
    },
    closeModal() {
      this.modal.showModal = false;
      this.modal.value = "";
      this.imageURI = "";
    },
    async updatePreference({
      image,
      index,
      key,
      value,
      displayName: display_name,
      config_type,
    }) {
      let result = {
        // display_name,
        value: "",
      };
      this.snackbar.show = false;
      const isValid = await this.$refs.form.validate();
      if (isValid) {
        if (config_type === 2) {
          if (!this.modal.imageURI && this.modal.image) {
            return this.closeModal();
          }

          if (!this.imageURI && !this.modal.image) {
            return (this.snackbar = {
              color: "red",
              show: true,
              text: `${this.$t("system_msg.error")}: ${this.$t(
                "error.required"
              )}`,
            });
          }

          result = new window.FormData();
          result.append("display_name", display_name);
          result.append("image", image);
        } else if (config_type === 1 && typeof value === "object") {
          result.value = JSON.stringify(
            Object.assign(
              {},
              ...value.map((e) => ({
                [e.key]: e.type === 2 ? (e.value ? "1" : "0") : e.value,
              }))
            )
          );
        } else if (config_type === 3) {
          result.value = value ? "true" : "false";
        } else {
          result.value = value;
        }
        this.modal.loading = true;

        this.$http
          .patch(this.globalSettingsApi + key + "/", result)
          .then(
            (response) => {
              this.snackbar = {
                color: "success",
                show: true,
                text: `${this.$t("actions.update")} - ${display_name} ${this.$t(
                  "nav.settings"
                )}: ${this.$t("status.success")}`,
              };
              this.typeTransform(response);
              Object.assign(this.querySet[index], response);
              this.closeModal();
            },
            (error) => {
              this.snackbar = {
                color: "red",
                show: true,
                text: error,
              };
            }
          )
          .finally(() => {
            this.modal.loading = false;
          });
      }
    },
    uploadImage(e) {
      // file size must less than 1mb
      if (e.target.files[0].size > 1 * 1000 * 1000) {
        e.target.value = "";
        this.snackbar = {
          color: "red",
          show: true,
          text: `${this.$t("system_msg.error")}: ${this.$t(
            "system_msg.exceed_file_size"
          )}`,
        };
        return;
      }

      const fileRead = new FileReader();
      fileRead.onload = (e) => {
        this.showImage = false;
        this.modal.imageURI = e.target.result;
        this.showImage = true;
      };
      fileRead.readAsDataURL(e.target.files[0]);

      this.modal.image = e.target.files[0];
      this.change_image = true;
    },
    clearImage() {
      this.modal.imageURI = "";
      this.modal.image = "";
      this.showImage = false;
      this.$refs.imageUpload.value = "";
    },
    handleChangeEvent(preference, index) {
      this.updatePreference(
        Object.assign({}, preference, {
          displayName: preference.display_name,
          index,
        })
      );
    },
  },
};
</script>
