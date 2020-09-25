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
                    prepend-icon="view_week"
                    v-model="apps.version"
                    outlined>
                  </v-text-field>
                </validation-provider>
                <v-spacer style="max-width:75px !important;"></v-spacer>
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
                <span :style="{width:'748px', marginBottom: isUpdate ? '0px' :'20px' } ">
                   <websites
                    style="margin-bottom: 20px;"
                    v-if="!isUpdate"
                    req="true"
                    :mode="'one'"
                    :website="apps.websites"
                    @website-select-one="websiteSelectOne">
                  </websites>
                </span>
              </v-row>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" md="3">
              <v-banner color="primary" dark dense>
                {{$t('actions.upload')}} - {{$t('common.icon')}}
              </v-banner>
              <v-card>
                <v-img
                v-if="showImage"
                :src="`${apps.imageURI}`"
                class="my-1"
                contain
                height="100"></v-img>
                <v-card-actions>
                  <v-layout justify-center>
                    <v-btn color="blue" small @click="$refs.inputUpload.click()">
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
          <v-layout v-show="isUpdate">
            <v-card-title>{{$t('apps.classification')}}</v-card-title>
            <v-layout justify-end>
              <validation-observer ref="classForm">
                <v-dialog v-model="showForm" persistent max-width="500">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      color="primary"
                      small
                      dark v-on="on"
                      align-right>
                      <v-icon small left>add_box</v-icon> &nbsp;{{ $t('actions.add') }}
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="headline">
                      <v-icon class="mr-3">{{ cardIcon }}</v-icon> &nbsp;
                      {{ cardTitle }}
                    </v-card-title>
                    <!-- FORM INPUTS -->
                    <v-card-text>
                      <v-layout wrap>
                        <v-flex xs12 >
                          <types
                            :key="showType"
                            :typeFilter="typeFilter"
                            :disabled="!isUpdateClass"
                            type="set"
                            :mode="'one'"
                            req=true
                            :types="app_classification.type"
                            @type-select-one="typeSelectOne">
                          </types>

                        </v-flex>
                        <v-flex xs12>
                          <categories
                            :key="showCategories"
                            :categoryFilter="categoryFilter"
                            :mode="'multiple'"
                            :disabled="disableCatLab"
                            req=true
                            type="set"
                            :category="app_classification.categories"
                            @category-select-multiple="categorySelectMultiple">
                          </categories>
                        </v-flex>
                        <v-flex xs12>
                            <labels
                            :key="showLabels"
                            :labelFilter="labelFilter"
                            :disabled="disableCatLab"
                            type="set"
                            req=true
                            :mode="'multiple'"
                            :label="app_classification.labels"
                            @label-select-multiple="labelSelectMultiple">
                          </labels>
                        </v-flex>
                    </v-layout>
                    <small color="error-text">*{{ $t('errors.required') }}</small>
                  </v-card-text>
                    <!-- BUTTONS -->
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="grey lighten-1"
                      :disabled="submitting"
                      @click="close"
                    >{{ $t('actions.close') }}</v-btn>
                    <v-btn
                      color="primary"
                      dark
                      :loading="submitting"
                      @click="saveClass"
                    >{{ $t('actions.save') }}</v-btn>
                  </v-card-actions>
                  </v-card>
                </v-dialog>
              </validation-observer>
            </v-layout>
          </v-layout>
          <v-simple-table v-if="isUpdate && !loadingClass">
            <thead>
              <tr>
                <th width="15%">{{$t('apps.type')}}</th>
                <th width="30%">{{$t('nav.category')}}</th>
                <th width="30%">{{$t('nav.labels')}}</th>
                <th width="8%">{{$t('common.action')}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="classification in classifications" :key="classification.id" >
                <td>{{classification.name}}</td>
                <td v-if="classification.categories">
                  <span v-for="category in classification.categories" :key="category.id">
                    <v-chip color="success" small outlined class="ma-1">{{category.name}}</v-chip>
                  </span>
                </td>
                <td v-else>-</td>
                <td v-if="classification.labels">
                  <span v-for="label in classification.labels" :key="label.id">
                    <v-chip color="info" small outlined class="ma-1">{{label.name}}</v-chip>
                  </span>
                </td>
                <td v-else>-</td>
                <td>
                  <v-icon small @click="editClass(classification)" class="mr-2" >edit</v-icon>&nbsp;
                  <v-icon small @click="deleteClass(classification.id)" color="red">delete</v-icon>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-layout justify-center v-else-if="loadingClass">
          <v-progress-circular indeterminate color="blue" small></v-progress-circular>
          </v-layout>
          <v-spacer></v-spacer>
          <v-layout>
            <v-card-title>{{$t('apps.download_link')}}</v-card-title>
          </v-layout>
          <v-banner color="primary" dark><v-icon small>android</v-icon> {{$t('apps.android_download_link')}}
            <template v-slot:actions>
              <span class="mr-2">{{$t('apps.use_download_link')}} </span>
              <v-switch
                class="ma-0"
                color="white"
                :key="switchKey"
                v-model="apps.use_android_link"
                :disabled="!isUpdate"
                @change="checkLinks()"
                hide-details>
              </v-switch>
            </template>
          </v-banner>
          <v-flex>
            <v-card-text>
              <li>
              <span>{{ $t('apps.android_download_link')}}: {{ apps.app_file || $t('system_msg.no_data') }}</span>
              </li>
              <v-row>
                <v-col>
                  <validation-provider style="width:338px;" :rules="`${apps.use_android_link ? 'required' : ''}`" :name="`${$t('apps.external_download_link')}(Android)`">
                    <v-text-field
                      :label="`${$t('apps.external_download_link')}(Android)`"
                      :error-messages="errors"
                      slot-scope="{ errors }"
                      placeholder=" "
                      dense
                      prepend-icon="android"
                      v-model="apps.download_link"
                      outlined>
                    </v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>
            </v-card-text>
          </v-flex>
          <v-banner color="primary" dark><v-icon small>phone_iphone</v-icon> {{$t('apps.ios_download_link')}}
          </v-banner>
          <v-flex>
            <v-card-text>
              <v-row>
                <v-col>
                    <v-text-field
                      :label="`${$t('apps.external_download_link')}(iOS)`"
                      placeholder=" "
                      dense
                      prepend-icon="phone_iphone"
                      v-model="apps.ios_download_link"
                      outlined>
                    </v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-flex>
          <v-banner color="primary" dark>{{$t('seo.seo_data')}}</v-banner>
          <v-flex>
            <v-card-title>{{$t('seo.keywords')}}</v-card-title>
            <v-card-text>
              <v-textarea outlined v-model="apps.keywords">Hello</v-textarea>
            </v-card-text>
          </v-flex>
          <v-flex>
            <v-card-title>{{$t('seo.basic_introduction')}}</v-card-title>
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
                :key="introKey"
                @change-content="changeIntroContent"
                >
              </tinymce>
            </v-card-text>
          </v-flex>
          <v-flex>
            <v-card-title>{{$t('apps.features')}}</v-card-title><v-card-text>
              <tinymce v-if="showTinyMce"
                name="features"
                :key="featuresKey"
                :content="apps.features"
                @change-content="changeFeaturesContent"
                >
              </tinymce>
            </v-card-text>
          </v-flex>
          <v-flex>
            <v-card-title>{{$t('apps.editors_comment')}}</v-card-title><v-card-text>
              <tinymce v-if="showTinyMce"
                name="editors_comment"
                :key="commentKey"
                :content="apps.editors_comment"
                @change-content="changeCommentContent"
                >
              </tinymce>
            </v-card-text>
          </v-flex>
          <v-layout justify-start mt-3>
          <v-btn
              color="primary"
              dark
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
import Websites from '../../components/SelectWebsite.vue'
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
    Websites,
    SnackBar,
    tinymce,
  },
  data() {
    return {
      id: '',
      isUpdate: true,
      disableCatLab: true,
      types: '',
      isUpdateClass:false,
      showCategories: false,
      showLabels: false,
      showType: false,
      showForm: false,
      showTinyMce: true,
      label_changed: '',
      category_changed: '',
      showImage: false,
      classifications: [],
      lang: '',
      appsApi: api.apps,
      classApi: api.classification,
      typeFilter: '',
      labelFilter: '',
      categoryFilter: '',
      loading: false,
      submitting: false,
      loadingClass: false,
      snackbar: {
        color: '',
        text: '',
        show: false,
      },
      introKey: false,
      featuresKey: false,
      commentKey: false,
      switchKey: false,
      bread_crumbs: [
        {
          text: this.$t('nav.apps'),
          disabled: false,
          to: '/apps?website=1'
        },
        {
          text: this.$route.meta.title,
          disabled: true
        }],
      app_classification: {},
      apps: {
        use_android_link: true
      },
      uploadInstallerDialog: false,
      uploadLoading: false,
      selectOne: ['type'],
      selectMultiple: ['labels', 'categories'],
      nonRequired: ['basic_introduction', 'features', 'introduction', 'keywords', 'editors_comment', 'ios_download_link', 'download_link'],
      data: {
        app_type: false,
        category: false,
        labels: ''
      },
      headers: [
        {
          sortable: false,
          text: this.$t('apps.type'),
          value: 'image_url'
      },
      {
          sortable: false,
          text: `${this.$t('apps.category')}`,
          value: 'image_file'
      },
      {
          sortable: false,
          text: this.$t('nav.labels'),
          value: 'action'
      },
      {
          sortable: false,
          text: this.$t('common.action'),
          value: 'action'
      }
      ]
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let appId = to.params.appsId
      if (appId) {
        vm.getAppDetails(appId)
        vm.getAppClassDetails(appId)
      } else {
        vm.isUpdate = false
      }
    })
  },
  computed: {
    cardTitle() {
      return this.isUpdateClass ? `${this.$t('actions.update')} - ${this.$t('apps.classification')} ` : `${this.$t('actions.add')} - ${this.$t('apps.classification')}`
    },
    cardIcon() {
      return this.isUpdateClass ? 'edit' : 'add_box'
    },
  },
  created() {
    this.lang = $.getLanguage() == 'zh_CN' ? 'zh-cn' : ''
  },
  methods: {
    async getAppDetails(id) {
      this.loading = true
      this.id = id
      await this.$http.get(`${this.appsApi}${id }/`).then((response) => {
        this.apps = response
        this.showTinyMce = true
        this.introKey = true
        this.featuresKey = true
        this.commentKey = true
        this.typeFilter = `website=${this.apps.website.id}`
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
    async getAppClassDetails(id) {
      this.loadingClass = true
      await this.$http.get(`${this.classApi}/${id }/`).then((response) => {
        this.classifications = response
      })
      this.loadingClass = false
    },
    pushIDs(item, mode){
      let val = []
      if (mode == 'Multiple') {
        if (this.app_classification[item]) {
          this.app_classification[item].forEach(item => {
          if (item) {
            val.push(item.id)
          }
        })
        }
        this.data[item] = val.join(',')
      } else {
        if (this.app_classification[item]) {
          val.push(this.app_classification[item].id)
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
    changeCommentContent(val) {
      this.apps.editors_comment = val
    },
    typeSelectOne(val) {
      this.app_classification.type = val
      let type = val
      if (val && val.id) {
        type = val.code
      }
      let websiteFilter = this.isUpdate ? this.apps.website.id : this.apps.website
      this.labelFilter = `website=${websiteFilter}&types=${type}`
      this.categoryFilter = `website=${websiteFilter}&types=${type}`
      this.disableCatLab = type ? false : true
      this.showCategories = true
      this.showLabels = true
    },
    websiteSelectOne(val) {
      this.apps.website = val
      this.typeFilter = `website=${this.apps.website}`
    },
    categorySelectMultiple(val) {
      this.app_classification.categories = val
      if (val && val[0].name) {
        let newVal = []
        this.app_classification.categories.forEach(item => {
          newVal.push(item.id)
        })
        // changed Removed
        if (this.data.categories != newVal.join(',')) {
          this.category_removed_some = true
          this.app_classification.category_removed = newVal.join(',')
        // unchanged
        } else {
          this.category_changed = false
        }
      // Changed - Added
      } else {
        this.category_changed = true
      }
      this.app_classification.categories = val
    },
    labelSelectMultiple(val) {
      if (val && val[0].name) {
        let newVal = []
        this.app_classification.labels.forEach(item => {
          newVal.push(item.id)
        })
        // changed Removed
        if (this.data.labels != newVal.join(',')) {
          this.label_removed_some = true
          this.app_classification.label_removed = newVal.join(',')
        // unchanged
        } else {
          this.label_changed = false
        }
      // Changed - Added
      } else {
        this.label_changed = true
      }
      this.app_classification.labels = val
    },
    checkLinks() {
      this.snackbar.show = false
      if (!this.apps.use_android_link) {
        if (this.apps.download_link && !this.apps.app_file) {
          this.snackbar = {
            color: 'error',
            show: true,
            text: `${this.$t('system_msg.error')} - ${this.$t('errors.switch_error')}`
          }
          this.switchKey = true
          this.apps.use_android_link = true
        } else if (!this.apps.download_link && !this.apps.app_file) {
          this.snackbar = {
            color: 'error',
            show: true,
            text: `${this.$t('system_msg.error')} - ${this.$t('errors.switch_error')}`
          }
          this.switchKey = true
          this.apps.use_android_link = true
        }
      }
    },
    close() {
      this.showForm = false
      this.isUpdateClass = false
      this.app_classification = {}
      this.$refs.classForm.reset()
    },
    async saveClass() {
      this.loadingClass = true
      const isValid = await this.$refs.classForm.validate()
      if (isValid) {
        let formData = new window.FormData()
        // Select Fields (Multiple) are added if value changed
        if (this.label_removed_some) {
          formData.set('labels', this.app_classification.label_removed)
        } else if (this.label_changed) {
          formData.set('labels', this.app_classification.labels)
        } 
        if (this.category_removed_some) {
          formData.set('categories', this.app_classification.category_removed)
        } else if (this.category_changed) {
          formData.set('categories', this.app_classification.categories)
        }
        // Select Fields (One) old values are sent if value did not change
        await this.$http.get(`${api.types}?limit=400&offset=0&${this.typeFilter}`).then(response => {
          this.types = response.results
        })
        this.class_type = this.types.filter(element => element.code == this.app_classification.type)
        if (this.isUpdateClass) {
          formData.set('type', this.app_classification.type.id)
        } else {
          formData.set('type', this.class_type[0].id)
        }
        this.$http.put(`${this.classApi}/${this.apps.id}/`, formData).then(response => {
          this.getAppClassDetails(response.id)
          this.close()
        }, error => {
            this.snackbar = {
              color: 'red',
              show: true,
              text: error
            }
        })
      }
    },
    deleteClass(id) {
      this.$http.delete(`${this.appsApi}types/${id}/`).then(() => {
        this.snackbar = {
          color: 'success',
          show: true,
          text: `${this.$t('actions.delete')}: ${this.$t('status.success')}`
        }
        this.getAppDetails(this.id)
      })
    },
    editClass(item) {
      this.isUpdateClass = true
      this.labelFilter = `website=${this.apps.website.id}&types=${item.code}`
      this.categoryFilter = `website=${this.apps.website.id}&types=${item.code}`
      Object.assign(this.app_classification, {
        type: item,
        categories: item.categories,
        labels: item.labels
      })
      this.showCategories = true
      this.showLabels = true
      this.disableCatLab = false
      this.showForm = true
    },
    async saveApp() {
      this.snackbar.show = false
      const isValid = await this.$refs.form.validate()
      if (isValid) {
        let formData = new window.FormData()    
        if (this.change_icon) {
          formData.set('icon', this.apps.icon)
        }
        // String Fields
        formData.set('name', this.apps.name)
        formData.set('star', this.apps.star)
        formData.set('version', this.apps.version)
        formData.set('use_android_link', this.apps.use_android_link)
        this.nonRequired.forEach(item => {
          formData.set(item, this.apps[item] !== undefined ? this.apps[item] : '')
        })
        if (this.isUpdate) {
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
          formData.set('website_id', this.apps.website)
          this.$http.post(this.appsApi, formData).then(response => {
            this.snackbar = {
              color: 'success',
              show: true,
              text: `${this.$t('actions.create')} - ${this.$t('nav.apps')}: ${this.$t('status.success')}`
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
