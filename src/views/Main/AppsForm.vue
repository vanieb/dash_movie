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
                  <app-types
                    req="true"
                    :mode="'one'"
                    :types="apps.types"
                    @type-select-one="typeSelectOne">
                  </app-types>
                </span>
                <v-spacer></v-spacer>
                <span style="width:338px;">
                  <categories
                    req="true"
                    :mode="'one'"
                    :category="apps.categories"
                    @category-select-one="categorySelectOne">
                  </categories>
                </span>
              </v-row>
              <v-row>
                <span style="width:748px;">
                   <websites
                    req="true"
                    :mode="'multiple'"
                    :website="apps.websites"
                    @website-select-multiple="websiteSelectMultiple">
                  </websites>
                </span>
              </v-row>
              <v-row>
                <labels
                  req="true"
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
    SnackBar,
    tinymce,
  },
  data() {
    return {
      level_changed: '',
      website_changed: '',
      showImage: false,
      lang: '',
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
        types: [],
        websites: [],
        categories: [],
        labels: [],
        icon: ''
      },
      uploadInstallerDialog: false,
      uploadLoading: false,
      file: '',
      selectOne: ['types', 'categories'],
      selectMultiple: ['labels', 'websites'],
      selectFields: ['types', 'categories', 'labels', 'websites'],
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
        console.log(this.apps.basic_introduction)
        if (this.apps.icon) {
          this.showImage = true
          this.apps.imageURI = this.apps.icon
          this.change_icon = false
        }
        this.selectFields.forEach(item => {
          this.pushIDs(item)
        })
      }, response => {
          if (('' + response.status).indexOf('4') === 0) {
              this.$router.push('/login?next=' + this.$route.path)
          }
      })
    },
    pushIDs(item){
      let val = []
      this.apps[item].forEach(item => {
        val.push(item.id)
      })
      this.data[item] = val.join(',')
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
      this.apps.types = val
    },
    websiteSelectMultiple(val) {
      if (val && val[0].name==undefined) {
        this.website_changed = true
      } else {
        this.website_changed = false
      }
      this.apps.websites = val
    },
    categorySelectOne(val) {
      this.apps.categories = val
    },
    labelSelectMultiple(val) {
      if (val && val[0].name==undefined) {
        this.level_changed = true
      } else {
        this.level_changed = false
      }
      this.apps.labels = val
    },
    async saveApp() {
      const isValid = await this.$refs.form.validate()
      if (isValid) {
        let formData = new window.FormData()
        // Select Fields (Multiple) are added if value changed
        if (this.level_changed) {
          formData.set('labels', this.apps.labels)
        }
        if (this.website_changed) {
          formData.set('websites', this.apps.websites)
        }
        // Select Fields (One) old values are sent if value did not change
        this.selectOne.forEach(item => {
          if (this.data[item]) {
            formData.set(item, this.data[item])
          } else {
            formData.set(item, this.apps[item])
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
        formData.set('features', this.apps.features)
        if (this.apps.id) {
          this.$http.put(`${this.appsApi}${this.apps.id}/`, formData).then(response => {
            this.snackbar = {
              color: 'success',
              show: true,
              text: `${this.$t('actions.update')} - ${this.$t('nav.staff')}: ${this.$t('status.success')}`
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
              text: `${this.$t('actions.update')} - ${this.$t('nav.staff')}: ${this.$t('status.success')}`
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
