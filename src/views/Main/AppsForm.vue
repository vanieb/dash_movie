<template>
  <v-layout wrap>
    <v-container>
      <v-layout justify-start>
        <v-breadcrumbs :items="bread_crumbs" style="padding:12px;">
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item
              exact
              :to="item.to"
              :disabled="item.disabled"
            >
              {{ item.text }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-layout>
      <validation-observer ref="form">
      <v-card>
      <v-container mt5>
        <small>*{{$t('errors.required')}}</small>
          <v-row class="ml-1 mr-8">
            <v-col cols="12" md="8">
              <v-row>
                <validation-provider style="width:338px;" rules="required" :name="$t('common.name')">
                  <v-text-field
                    :error-messages="errors"
                    required
                    :label="`${$t('common.name')}*`"
                    placeholder=" "
                    prepend-icon="apps"
                    v-model="apps.name"
                    slot-scope="{ errors }"
                    dense
                    outlined>
                  </v-text-field>
                </validation-provider>
                <v-spacer></v-spacer>
                <validation-provider style="width:338px;" rules="required" :name="$t('apps.version')">
                  <v-text-field
                    :error-messages="errors"
                    :label="`${$t('apps.version')}*`"
                    placeholder=" "
                    slot-scope="{ errors }"
                    dense
                    number
                    prepend-icon="view_week"
                    v-model.number="apps.version"
                    outlined>
                  </v-text-field>
                </validation-provider>
                
              </v-row>
              <v-row>
                <validation-provider style="width:338px;" rules="required" :name="$t('apps.release_date')">
                  <v-menu
                    ref="menu1"
                    v-model="date_menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                    :error-messages="errors"
                    slot-scope="{ errors }"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="apps.release_at"
                        :label="`${$t('apps.release_date')}*`"
                        persistent-hint
                        placeholder=" "
                        dense
                        outlined
                        prepend-icon="event"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="apps.release_date"
                      no-title
                      :locale="lang"
                      @input="date_menu = false">
                    </v-date-picker>
                  </v-menu>
                </validation-provider>
                <v-spacer></v-spacer>
                <validation-provider style="width:338px;" rules="required|between:1,5" :name="$t('apps.rating')">
                  <v-text-field
                    :error-messages="errors"
                    :label="`${$t('apps.rating')}*`"
                    placeholder=" "
                    slot-scope="{ errors }"
                    dense
                    number
                    prepend-icon="star"
                    v-model.number="apps.star"
                    outlined>
                  </v-text-field>
                </validation-provider>
              </v-row>
              <v-row>
                <validation-provider style="width:338px;" rules="required" :name="$t('apps.type')">
                  <app-types
                    req="true"
                    :mode="'one'"
                    :types="apps.types"
                    @type-select-one="typeSelectOne">
                  </app-types>
                </validation-provider>
                <v-spacer></v-spacer>
                <validation-provider style="width:338px;" rules="required" :name="$t('nav.category')">
                  <categories
                    req="true"
                    :mode="'one'"
                    :category="apps.categories"
                    @category-select-one="categorySelectOne">
                  </categories>
                </validation-provider>
              </v-row>
              <v-row>
                <validation-provider style="width:748px;" rules="required" :name="$t('nav.websites')">
                  <websites
                    req="true"
                    :mode="'multiple'"
                    :website="apps.websites"
                    @website-select-multiple="websiteSelectMultiple">
                  </websites>
                </validation-provider>
              </v-row>
              <v-row>
                <validation-provider style="width:748px;" rules="required" :name="$t('nav.labels')">
                  <labels
                    req="true"
                    :mode="'multiple'"
                    :label="apps.labels"
                    @label-select-multiple="labelSelectMultiple">
                  </labels>
                </validation-provider>
              </v-row>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" md="3">
              <v-card>
                <v-card-text>
                 <v-img
                  v-if="showImage"
                  :src="`${apps.imageURI}`"
                  class="my-1"
                  contain
                  height="100"></v-img>
                </v-card-text>
                <v-card-actions>
                  <v-layout justify-center>
                    <v-btn color="blue" @click="$refs.inputUpload.click()">
                      <v-icon color="white">cloud_upload</v-icon>
                    </v-btn>
                    <input
                      v-show="false"
                      ref="inputUpload"
                      type="file"
                      accept="image/*"
                      @change="uploadIcon" >
                  </v-layout>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-card class="mb-5">
            <v-card-text>
            <v-dialog v-model="uploadInstallerDialog" persistent max-width="350">
            <template v-slot:activator="{ on }">
               <v-btn
                  color="primary"
                  dark
                  class="mr-3"
                  v-on="on">
                 
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <span v-on="on"> {{$t('actions.change_file')}}</span>
                    </template>
                    <span>{{$t('system_notes.upload_one_installer_memo')}}</span>
                  </v-tooltip>
                </v-btn>
              </template>
            <v-card>
              <validation-observer ref="uploadFileform">
                <v-card-title>
                  <!-- <v-icon class="mr-3">cloud_upload</v-icon> -->
                    &nbsp;{{$t('actions.change_file')}}
                </v-card-title>
                <v-card-text>
                  <v-icon small>info</v-icon>&nbsp;&nbsp;
                  <small>{{ $t('system_notes.upload_one_installer_memo') }}</small>
                </v-card-text>
                <v-card-text>
                  <v-spacer></v-spacer>
                  <validation-provider style="width:310px;" rules="required" :name="$t('common.file')">
                    <v-file-input
                      outlined
                      dense
                      clearable
                      :error-messages="errors"
                      required
                      slot-scope="{ errors }"
                      v-model="file">    
                    </v-file-input>
                  </validation-provider>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="grey lighten-1"
                    @click="uploadInstallerDialog = false">{{ $t('actions.close') }}
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    :loading="uploadLoading"
                    @click="uploadFile()">{{ $t('actions.submit') }}
                  </v-btn>
                </v-card-actions>
              </validation-observer>
            </v-card>
          </v-dialog>
            <!-- <v-icon>cloud_upload</v-icon>&nbsp;&nbsp; -->
            <span>{{ $t('apps.download_link')}}: {{ apps.download_link || $t('system_msg.no_data') }}</span>
             </v-card-text>
          </v-card>
          <v-spacer></v-spacer>
          <v-banner style="color:blue;">{{$t('apps.other_details')}}</v-banner>
          <v-flex>
            <v-card-title>{{$t('apps.basic_introduction')}}</v-card-title>
            <v-card-text>
              <tinymce
                name="basic"
                :content="apps.basic_introduction"
                @change-content="changeBasicContent"
                >
              </tinymce>
            </v-card-text>
          </v-flex>
          <v-flex>
            <v-card-title>{{$t('apps.introduction')}}</v-card-title>
            <v-card-text>
              <tinymce
                name="introduction"
                :content="apps.introduction"
                @change-content="changeIntroContent"
                >
              </tinymce>
            </v-card-text>
          </v-flex>
          <v-flex>
            <v-card-title>{{$t('apps.features')}}</v-card-title><v-card-text>
              <tinymce
                name="features"
                :content="apps.introduction"
                @change-content="changeFeaturesContent"
                >
              </tinymce>
            </v-card-text>
          </v-flex>
          <v-layout justify-start mt-3>
          <v-btn
              color="blue darken-1"
              :loading="submitting"
              @click="saveApp"
            >{{ $t('actions.save') }}</v-btn>
          </v-layout>
        </v-container>
      </v-card>
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
import api from '@/api/apis'
import SnackBar from '@/components/SnackBar'
import tinymce from '../../components/tinymce'
import Categories from '../../components/SelectCategory.vue'
import AppTypes from '../../components/SelectType.vue'
import Labels from '../../components/SelectLabel.vue'
import Websites from '../../components/SelectWebsite.vue'
import $ from '../../utils/util'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
  name: 'AppsForm',
  components: {
    Categories,
    Labels,
    AppTypes,
    Websites,
    ValidationObserver,
    ValidationProvider,
    tinymce,
    SnackBar
  },
  data() {
    return {
      showImage: false,
      lang: '',
      date_menu: false,
      dateFormatted: '',
      mode: 1,
      errorMsg: '',
      links: [],
      filteredLinks: [],
      appsApi: api.apps,
      loading: true,
      submitting: false,
      snackbar: {
        color: '',
        text: '',
        show: false,
      },
      bread_crumbs: [
        {
          text: this.$t('nav.apps'),
          disabled: false,
          to: '/'
        },
        {
          text: this.$route.meta.title,
          disabled: true
        }],
      apps: {
        types: '',
        labels: '',
        icon: '',
        imageURI: ''
      },
      uploadInstallerDialog: false,
      uploadLoading: false,
      file: '',
      data: {
        types: '',
        categories: ''
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let appId = to.params.appsId
      if (appId) {
        vm.getAppDetails(appId)
      }
    })
  },
  filters: {
    truncate: function(text, length, suffix) {
      return text.substring(0, length) + suffix
    }
  },
  created() {
    this.lang = $.getLanguage() == 'zh_CN' ? 'zh-cn' : ''
  },
  computed: {

  },
  methods: {
    getAppDetails(id) {
      this.$http.get(`${this.appsApi}${id }/`).then((response) => {
        this.apps = response
        if (this.apps.icon) {
          this.showImage = true
          this.apps.imageURI = this.apps.icon
        }
        if (this.apps.types.length > 0) {
          this.data.types = this.apps.types[0].id
        }
        if (this.apps.categories.length > 0) {
          this.data.categories = this.apps.categories[0].id
        }
        // needed to display date properly
        this.apps.release_at = this.apps.release_at ? new Date(this.apps.release_at.toISOString().substr(0, 10)) : ''
      }, response => {
          if (('' + response.status).indexOf('4') === 0) {
              this.$router.push('/login?next=' + this.$route.path)
          }
      })
    },
    async uploadFile() {
      const isValid = await this.$refs.uploadFileform.validate()
      if (isValid) {
        this.uploadLoading = true
        const formData = new window.FormData()
        formData.set('app_file', this.file)
        this.$http.put(`${api.apps}${this.apps.id}/`, formData).then(() => {
          this.snackbar = {
            color: 'success',
            show: true,
            text: `${this.$t('actions.upload')}: ${this.$t('status.success')}`
          }
          this.uploadLoading = false
          this.uploadInstallerDialog = false
        })
        // insert api
      }
    },
    uploadIcon (e) {
      // file size must less than 1mb
      if (e.target.files[0].size > 1 * 1000 * 1000) {
        e.target.value = ''
        this.snackbar = {
          color: 'red',
          show: true,
          text: `${this.$t('system_msg.error')}: ${this.$t('system_msg.exceed_file_size')}`
        }
        return
      }

      const fileRead = new FileReader()
      fileRead.onload = (e) => {
        this.showImage = true
        this.apps.imageURI = e.target.result
        console.log(this.apps.imageURI)
      }
      fileRead.readAsDataURL(e.target.files[0])
      this.apps.icon = e.target.files[0]
      console.log(this.apps.icon)
    },
    changeBasicContent(val) {
      this.apps.basic_introduction = val
    },
    changeIntroContent(val) {
      this.apps.introduction = val
    },
    changeFeaturesContent(val) {
      this.apps.features = val
    },
    typeSelectOne(val) {
      this.apps.types = val
    },
    websiteSelectMultiple(val) {
      this.apps.websites = val
    },
    categorySelectOne(val) {
      this.apps.categories = val
    },
    labelSelectMultiple(val) {
      console.log(val)
      this.apps.labels = val
      console.log(this.apps.labels)
    },
    async saveApp() {
      // const isValid = await this.$refs.form.validate()
      // console.log(isValid)
      console.log('data to send')
      console.log(this.apps)
      let formData = new window.FormData()
      formData.set('name', this.apps.name)
      formData.set('websites', this.apps.websites)
      console.log('data types')
      console.log(this.data.types)
      if (this.data.types){
        formData.set('types', this.data.types)
      } else {
        formData.set('types', this.apps.types)
      }
      if (this.data.categories){
        formData.set('categories', this.data.categories)
      } else {
        formData.set('categories', this.apps.categories)
      }
      formData.set('icon', this.apps.icon)
      formData.set('star', this.apps.star)
      formData.set('labels', this.apps.labels)
      formData.set('version', this.apps.version)
      formData.set('introduction', this.apps.introduction)
      formData.set('basic_introduction', this.apps.basic_introduction)
      formData.set('feature', this.apps.features)
      // formData.set('release_at', this.apps.release_date)
      this.$http.put(`${api.apps}${this.apps.id}/`, formData).then(() => {
          this.$refs.pulling.rebase()
          this.snackbar = {
            color: 'success',
            show: true,
            text: `${this.$t('actions.update')} - ${this.$t('nav.staff')}: ${this.$t('status.success')}`
          }
          this.close()
        }, error => {
          this.snackbar = {
            color: 'red',
            show: true,
            text: error
          }
        })
      // formData.set('apps', this.apps)
      console.log(formData)
      // validate link
      // insert api
    }
  }
}
</script>
