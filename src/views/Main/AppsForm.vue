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
              </v-row>
              <v-row>
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
                <span style="width:338px;">
                  <types
                    v-if="showType"
                    :typeFilter="`website=${apps.website.id}`"
                    type="set"
                    :mode="'one'"
                    req=true
                    :types="apps.app_type"
                    @type-select-one="typeSelectOne">
                  </types>
                </span>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <span style="width:338px;">
                  <categories
                    v-if="showCategories"
                    :categoryFilter="categoryFilter"
                    :mode="'one'"
                    req=true
                    type="set"
                    :category="apps.category"
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
                  type="set"
                  req=true
                  :mode="'multiple'"
                  :label="apps.labels"
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
          <v-spacer></v-spacer>
          <v-banner color="primary" dark>{{$t('apps.seo_data')}}</v-banner>
          <v-flex>
            <v-card-title>{{$t('apps.keywords')}}</v-card-title>
            <v-card-text>
              <v-textarea outlined v-model="apps.keywords">Hello</v-textarea>
            </v-card-text>
          </v-flex>
          <v-flex>
            <v-card-title>{{$t('apps.basic_introduction')}}</v-card-title>
            <v-card-text>
              <v-textarea outlined v-model="apps.basic_introduction">Hello</v-textarea>
            </v-card-text>
          </v-flex>
          <v-banner color="primary" dark>{{$t('apps.other_details')}}</v-banner>
          <v-flex>
            <v-card-title>{{$t('apps.introduction')}}</v-card-title>
            <v-card-text>
              <tinymce v-if="showTinyMce"
                name="introduction"
                :content="apps.introduction"
                @change-content="changeIntroContent"
                >
              </tinymce>
            </v-card-text>
          </v-flex>
          <v-flex>
            <v-card-title>{{$t('apps.features')}}</v-card-title><v-card-text>
              <tinymce v-if="showTinyMce"
                name="features"
                :content="apps.features"
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
    ValidationObserver,
    ValidationProvider,
    SnackBar,
    tinymce,
  },
  data() {
    return {
      showCategories: false,
      showLabels: false,
      showType: false,
      showTinyMce: '',
      label_changed: '',
      showImage: false,
      lang: '',
      appsApi: api.apps,
      labelFilter: '',
      categoryFilter: '',
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
      apps: {},
      uploadInstallerDialog: false,
      uploadLoading: false,
      selectOne: ['app_type', 'category'],
      selectMultiple: ['labels'],
      data: {
        app_type: false,
        category: false,
        labels: ''
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
  created() {
    this.lang = $.getLanguage() == 'zh_CN' ? 'zh-cn' : ''
  },
  methods: {
    getAppDetails(id) {
      this.$http.get(`${this.appsApi}${id }/`).then((response) => {
        this.apps = response
        this.showTinyMce = true
        this.showLabels = true
        this.showType = true
        this.showCategories = true
        if (this.apps.app_type) {
          this.labelFilter = `website=${this.apps.website.id}&type_label=${this.apps.app_type.id}`
          this.categoryFilter = `website=${this.apps.website.id}&type_category=${this.apps.app_type.id}`
        }
        if (this.apps.icon) {
          this.showImage = true
          this.apps.imageURI = this.apps.icon
          this.change_icon = false
        }
        this.selectMultiple.forEach(item => {
          this.pushIDs(item, 'Multiple')
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
        if (this.apps[item]) {
          this.apps[item].forEach(item => {
          if (item) {
            val.push(item.id)
          }
        })
        }
        
        this.data[item] = val.join(',')
      } else {
        if (this.apps[item]) {
          val.push(this.apps[item].id)
          this.data[item] = val
        }
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
        this.showImage = false
        this.apps.imageURI = e.target.result
        this.showImage = true
      }
      fileRead.readAsDataURL(e.target.files[0])
      
      this.apps.icon = e.target.files[0]
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
      this.apps.app_type = val
      let type = val
      if (val && val.id) {
        type = val.id
      }
      this.labelFilter = `website=${this.apps.website.id}&type_label=${type}`
      this.categoryFilter = `website=${this.apps.website.id}&type_category=${type}`
      this.apps.category = ''
      this.apps.labels = []
    },
    categorySelectOne(val) {
      this.apps.category = val
    },
    labelSelectMultiple(val) {
      if (val && val[0].name) {
        let newVal = []
        this.apps.labels.forEach(item => {
          newVal.push(item.id)
        })
        // changed Removed
        if (this.data.labels != newVal.join(',')) {
          this.label_removed_some = true
          this.apps.label_removed = newVal.join(',')
        // unchanged
        } else {
          this.label_changed = false
        }
      // Changed - Added
      } else {
        this.label_changed = true
      }
      this.apps.labels = val
    },
    async saveApp() {
      const isValid = await this.$refs.form.validate()
      if (isValid) {
        let formData = new window.FormData()
        // Select Fields (Multiple) are added if value changed
        if (this.label_changed) {
          formData.set('label_ids', this.apps.labels)
        } else if (this.label_removed_some) {
          formData.set('label_ids', this.apps.label_removed)
        }
        // Select Fields (One) old values are sent if value did not change
        this.selectOne.forEach(item => {
          if ((this.data[item] != this.apps[item][0]) && !this.apps[item].id) {
            formData.set(`${item}_id`, this.apps[item])
          }
        })
        if (this.change_icon) {
          formData.set('icon', this.apps.icon)
        }
        // String Fields
        formData.set('name', this.apps.name)
        formData.set('star', this.apps.star)
        formData.set('version', this.apps.version)
        formData.set('introduction', this.apps.introduction)
        formData.set('basic_introduction', this.apps.basic_introduction)
        formData.set('keywords', this.apps.keywords)
        formData.set('features', this.apps.features)
        if (this.apps.id) {
          this.$http.put(`${this.appsApi}${this.apps.id}/`, formData).then(response => {
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
        } else {
          this.$http.post(this.appsApi, formData).then(response => {
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
      } else {
        window.scrollTo(500, 0)
      }
    }
  }
}
</script>
