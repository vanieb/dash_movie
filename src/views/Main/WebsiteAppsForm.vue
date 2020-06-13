<template>
  <v-layout wrap>
    <v-container v-if="loading">
    <v-layout justify-center align-center >
      <v-progress-circular indeterminate color="blue"></v-progress-circular>
    </v-layout>
    </v-container>
    <v-container v-else>
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
                <validation-provider style="width:748px;" rules="required" :name="$t('common.name')">
                  <v-text-field
                    v-if="webapp.app"
                    :error-messages="errors"
                    required
                    :label="`${$t('common.name')}*`"
                    placeholder=" "
                    prepend-icon="apps"
                    v-model="webapp.app.name"
                    slot-scope="{ errors }"
                    dense
                    outlined>
                  </v-text-field>
                </validation-provider>
                <v-spacer></v-spacer>
              </v-row>
              <v-row>
                <validation-provider style="width:338px;" rules="required" :name="$t('apps.version')">
                  <v-text-field
                    v-if="webapp.app"
                    :error-messages="errors"
                    :label="`${$t('apps.version')}*`"
                    placeholder=" "
                    slot-scope="{ errors }"
                    dense
                    number
                    prepend-icon="view_week"
                    v-model.number="webapp.app.version"
                    outlined>
                  </v-text-field>
                </validation-provider>
                <v-spacer></v-spacer>
                <validation-provider style="width:338px;" rules="required|between:1,5" :name="$t('apps.rating')">
                  <v-text-field
                    v-if="webapp.app"
                    :error-messages="errors"
                    :label="`${$t('apps.rating')}*`"
                    placeholder=" "
                    slot-scope="{ errors }"
                    dense
                    number
                    prepend-icon="star"
                    v-model.number="webapp.app.star"
                    outlined>
                  </v-text-field>
                </validation-provider>
              </v-row>
              <v-row>
                <span style="width:338px;">
                  <types
                    v-if="webapp.types"
                    :typeFilter="`website=${websiteId}`"
                    req="true"
                    :mode="'one'"
                    :types="webapp.types"
                    @type-select-one="typeSelectOne">
                  </types>
                </span>
                <v-spacer></v-spacer>
                <span style="width:338px;">
                  <categories
                    v-if="showCategories"
                    :categoryFilter="categoryFilter"
                    req="true"
                    :mode="'one'"
                    :category="webapp.categories"
                    @category-select-one="categorySelectOne">
                  </categories>
                </span>
              </v-row>
              <!-- <v-row>
                <span style="width:748px;">
                   <websites
                    req="true"
                    :mode="'multiple'"
                    :website="apps.websites"
                    @website-select-multiple="websiteSelectMultiple">
                  </websites>
                </span>
              </v-row> -->
              <v-row>
                <labels
                  v-if="showLabels"
                  :labelFilter="labelFilter"
                  req="true"
                  :mode="'multiple'"
                  :label="webapp.labels"
                  @label-select-multiple="labelSelectMultiple">
                </labels>
              </v-row>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" md="3">
              <v-card>
                <v-card-text>
                 <v-img
                  v-if="showImage"
                  :src="`${webapp.app.imageURI}`"
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
          <v-spacer></v-spacer>
          <v-banner color="primary" dark>{{$t('apps.seo_data')}}</v-banner>
          <v-flex>
            <v-card-title>{{$t('apps.keywords')}}</v-card-title>
            <v-card-text>
              <v-textarea outlined v-if="webapp.app" v-model="webapp.app.keywords">Hello</v-textarea>
            </v-card-text>
          </v-flex>
          <v-flex>
            <v-card-title>{{$t('apps.basic_introduction')}}</v-card-title>
            <v-card-text>
              <v-textarea outlined v-if="webapp.app" v-model="webapp.app.basic_introduction">Hello</v-textarea>
            </v-card-text>
          </v-flex>
          <v-banner color="primary" dark>{{$t('apps.other_details')}}</v-banner>
          <v-flex>
            <v-card-title>{{$t('apps.introduction')}}</v-card-title>
            <v-card-text>
              <tinymce v-if="showTinyMce && webapp.app"
                name="introduction"
                :content="webapp.app.introduction"
                @change-content="changeIntroContent"
                >
              </tinymce>
            </v-card-text>
          </v-flex>
          <v-flex>
            <v-card-title>{{$t('apps.features')}}</v-card-title><v-card-text>
              <tinymce v-if="showTinyMce && webapp.app"
                name="features"
                :content="webapp.app.features"
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
import tinymce from '../../components/tinymce'
import api from '@/api/apis'
import SnackBar from '@/components/SnackBar'
import Categories from '../../components/SelectCategory.vue'
import Types from '../../components/SelectType.vue'
import Labels from '../../components/SelectLabel.vue'
// import Websites from '../../components/SelectWebsite.vue'
import $ from '../../utils/util'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
  name: 'AppsForm',
  components: {
    Categories,
    Labels,
    Types,
    // Websites,
    ValidationObserver,
    ValidationProvider,
    SnackBar,
    tinymce,
  },
  data() {
    return {
      showCategories: false,
      showLabels: true,
      showTinyMce: '',
      level_changed: '',
      website_changed: '',
      showImage: false,
      lang: '',
      mode: 1,
      errorMsg: '',
      links: [],
      websiteId: '',
      labelFilter: '',
      categoryFilter: '',
      types: '',
      filteredLinks: [],
      webAppsApi: api.webapps,
      loading: false,
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
      webapp: {
        app: {
          types: [],
          websites: [],
          categories: [],
          labels: [],
          icon: ''
        }
      },
      uploadInstallerDialog: false,
      uploadLoading: false,
      file: '',
      selectOne: ['types', 'categories'],
      selectMultiple: ['labels'],
      selectFields: ['types', 'categories', 'labels'],
      data: {
        websites: '',
        types: false,
        categories: false,
        labels: ''
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let appId = to.params.appsId
      let websiteId = to.params.websiteId
      if (appId) {
        vm.getAppDetails(appId, websiteId)
      }
    })
  },
  filters: {
    truncate: function(text, length, suffix) {
      return text.substring(0, length) + suffix
    }
  },
  watch: {
    types(newObj) {
      this.labelFilter = `website${this.websiteId}&type_label=${newObj}`
      this.categoryFilter = `website${this.websiteId}&type_category=${newObj}`
      this.showCategories = true
      this.showLabels = true
    }
  },
  created() {
    this.lang = $.getLanguage() == 'zh_CN' ? 'zh-cn' : ''
  },
  methods: {
    getAppDetails(id, websiteId) {
      this.$http.get(`${this.webAppsApi}${id }/`).then((response) => {
        this.webapp = response
        this.websiteId = websiteId
        this.showTinyMce = true
        this.showLabels = true
        this.showCategories = true
        this.labelFilter = `website${this.websiteId}&type_label=${this.webapp.types.id}`
        this.categoryFilter = `website${this.websiteId}&type_category=${this.webapp.types.id}`
        if (this.webapp.app.icon) {
          this.showImage = true
          this.webapp.app.imageURI = this.webapp.app.icon
          this.change_icon = false
        }
        this.selectMultiple.forEach(item => {
          this.pushIDs(item, 'multiple')
        })
        this.selectOne.forEach(item => {
          this.pushIDs(item, 'one')
        })
      }, response => {
          if (('' + response.status).indexOf('4') === 0) {
              this.$router.push('/login?next=' + this.$route.path)
          }
      })
      this.loading = false
    },
    pushIDs(item, mode){
      let val = []
      if (mode == 'Multiple') {
        this.webapp[item].forEach(item => {
          val.push(item.id)
        })
        this.data[item] = val.join(',')
      } else {
        val.push(this.webapp[item].id)
        this.data[item] = val
      }
      // this.data[item] = val.join(',')
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
        this.showImage = false
        this.webapp.app.imageURI = e.target.result
        this.showImage = true
      }
      fileRead.readAsDataURL(e.target.files[0])
      
      this.webapp.app.icon = e.target.files[0]
      this.change_icon = true
      // let formData = new window.FormData()
      // formData.set('icon', this.apps.icon)
      // this.$http.put(`${this.appsApi}${this.apps.id}/`, formData).then(() => {
      //   this.snackbar = {
      //     color: 'success',
      //     show: true,
      //     text: `${this.$t('actions.update')} - ${this.$t('apps.icon')}: ${this.$t('status.success')}`
      //   }
      // }, error => {
      //   this.snackbar = {
      //     color: 'red',
      //     show: true,
      //     text: error
      //   }
      // })
    },
    changeIntroContent(val) {
      this.webapp.app.introduction = val
    },
    changeFeaturesContent(val) {
      this.webapp.app.features = val
    },
    typeSelectOne(val) {
      this.webapp.types = val
      let type = val
      if (val && val.id) {
        type = val.id
      }
      console.log(val)
      this.labelFilter = `website${this.websiteId}&type_label=${type}`
      this.categoryFilter = `website${this.websiteId}&type_category=${type}`
    },
    websiteSelectMultiple(val) {
      if (val && val[0].name==undefined) {
        this.website_changed = true
      } else {
        this.website_changed = false
      }
      this.webapp.websites = val
    },
    categorySelectOne(val) {
      this.webapp.categories = val
    },
    labelSelectMultiple(val) {
      // console.log(val)
      if (val && val[0].name==undefined) {
        this.level_changed = true
      } else {
        this.level_changed = false
      }
      this.webapp.labels = val
    },
    async saveApp() {
      const isValid = await this.$refs.form.validate()
      if (isValid) {
        let formData = new window.FormData()
        // let appFormData = new window.FormData()
        // Select Fields (Multiple) are added if value changed
        if (this.level_changed) {
          formData.set('labels', this.webapp.labels)
        }
        if (this.website_changed) {
          formData.set('websites', this.webapp.websites)
        }
        // Select Fields (One) old values are sent if value did not change
        this.selectOne.forEach(item => {
          if (this.data[item]) {
            formData.set(item, this.data[item])
          } else {
            formData.set(item, this.webapp[item])
          }
        })
        if (this.change_icon) {
          formData.set('icon', this.webapp.icon)
        }
        // String Fields
        formData.set('name', this.webapp.app.name)
        formData.set('star', this.webapp.app.star)
        formData.set('version', this.webapp.app.version)
        formData.set('introduction', this.webapp.app.introduction)
        formData.set('basic_introduction', this.webapp.app.basic_introduction)
        formData.set('keywords', this.webapp.app.keywords)
        formData.set('features', this.webapp.app.features)
        if (this.webapp.id) {
          this.$http.put(`${this.webAppsApi}${this.webapp.id}/`, formData).then(response => {
            this.snackbar = {
              color: 'success',
              show: true,
              text: `${this.$t('actions.update')} - ${this.$t('nav.apps')}: ${this.$t('status.success')}`
            }
            this.$router.push(`/webapps/${response.id}/${response.website.id}/`)
          }, error => {
            this.snackbar = {
              color: 'red',
              show: true,
              text: error
            }
          })
        } else {
          this.$http.post(this.webAppsApi, formData).then(response => {
            this.snackbar = {
              color: 'success',
              show: true,
              text: `${this.$t('actions.update')} - ${this.$t('nav.apps')}: ${this.$t('status.success')}`
            }
            this.$router.push(`/apps/${response.id}`)
          }, error => {
            this.snackbar = {
              color: 'red',
              show: true,
              text: error
            }
          })
        }
        
      }
    }
  }
}
</script>
