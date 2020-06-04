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
                <validation-provider style="width:338px;" rules="required" :name="$t('apps.type')">
                  <v-select
                    :error-messages="errors"
                    slot-scope="{ errors }"
                    :items="app_types"
                    :label="`${$t('apps.type')}*`"
                    prepend-icon="new_releases"
                    v-model="apps.type"
                    outlined dense
                    placeholder=" ">
                    <template slot="selection" slot-scope="data">
                      <v-icon :color="data.item.color">{{ data.item.icon }}</v-icon>
                      <span class="ml-3">{{ data.item.text }}</span>
                    </template>
                    <template slot="item" slot-scope="data">
                      <v-icon :color="data.item.color">{{ data.item.icon }}</v-icon>
                      <span class="ml-3">{{ data.item.text }}</span>
                    </template>
                  </v-select>
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
                        v-model="apps.release_date"
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
                    v-model.number="apps.rating"
                    outlined>
                  </v-text-field>
                </validation-provider>
              </v-row>
              <v-row>
                <validation-provider style="width:338px;" rules="required" :name="$t('apps.category')">
                  <categories
                    req="true"
                    :category="apps.category"
                    @category-select-one="categorySelectOne">
                  </categories>
                </validation-provider>
                
                <v-spacer></v-spacer>
                <validation-provider style="width:338px;" rules="required" :name="$t('nav.websites')">
                  <websites
                    req="true"
                    :mode="'multiple'"
                    :website="apps.website"
                    @website-select-multiple="websiteSelectMultiple">
                  </websites>
                </validation-provider>
              </v-row>
              <v-row>
                <validation-provider style="width:748px;" rules="required" :name="$t('nav.labels')">
                  <labels
                    req="true"
                    :mode="'multiple'"
                    :label="apps.label"
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
                  v-if="apps.icon"
                  :src="apps.imageURI"
                  class="my-1"
                  contain
                  height="100"/>
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
            <v-flex>
              <validation-provider style="width:748px;" rules="required" :name="$t('apps.download_link')">
                <v-text-field
                  @keyup="validateLink(apps.download_link)"
                  :error-messages="errors"
                  slot-scope="{ errors }"
                  :label="`${$t('apps.download_link')}*`"
                  dense
                  outlined
                  clear-icon="close"
                  clearable
                  v-model="apps.download_link">
                </v-text-field>
                <!-- <span>{{ invalid_link }}</span> -->
              </validation-provider>
            </v-flex>
          </v-row>
          <small>*{{$t('errors.required')}}</small>
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
import Labels from '../../components/SelectLabel.vue'
import Websites from '../../components/SelectWebsite.vue'
import $ from '../../utils/util'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

export default {
  name: 'AppsForm',
  components: {
    Categories,
    Labels,
    Websites,
    ValidationObserver,
    ValidationProvider,
    tinymce,
    SnackBar
  },
  data() {
    return {
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
      app_types: [
        { icon: 'sports_esports',
          text: this.$t('apps.games'),
          color: 'orange',
          value: 1}, 
        { icon: 'android',
          text: this.$t('apps.software'),
          color: 'green',
          value: 2},
        { icon: 'whatshot',
          text: this.$t('apps.hot'),
          color: 'red',
          value: 3}],
      apps: {
        name: 'GCash',
        ratings: 5,
        size: '12MB',
        type: 2,
        release_date:'2020-03-27T18:42:02.046828+08:00',
        version: '0.10',
        icon: '${require(../assets/logo.svg)}',
        imageURI: '',
        download_link: 'test',
        basic_introduction: '守卫主公是一款以三国为背景的策略手游，拥有多种策略塔防玩法，数百位英雄武将供玩家选择。守卫主公还有四大职业给玩家选择，并且四大职业相互克制，是一款非常烧脑的策略手游。',
        introduction: '守卫主公是一款以三国为背景的策略手游，拥有多种策略塔防玩法，数百位英雄武将供玩家选择。守卫主公还有四大职业给玩家选择，并且四大职业相互克制，是一款非常烧脑的策略手游。',
        features: '<p>守卫主公是一款以三国为背景的策略手游，拥有多种策略塔防玩法，数百位英雄武将供玩家选择。守卫主公还有四大职业给玩家选择，并且四大职业相互克制，是一款非常烧脑的策略手游。</p>'
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
        console.log(response)
        this.appId = response.id
        console.log(this.appId)
        // needed to display date properly
        this.apps.release_date = new Date(this.apps.release_date).toISOString().substr(0, 10)
      }, response => {
          if (('' + response.status).indexOf('4') === 0) {
              this.$router.push('/login?next=' + this.$route.path)
          }
      })
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
        this.apps.imageURI = e.target.result
      }

      fileRead.readAsDataURL(e.target.files[0])
      this.apps.icon = e.target.files[0]
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
    websiteSelectMultiple(val) {
      this.apps.websites = val
    },
    categorySelectOne(val) {
      this.apps.category = val
    },
    labelSelectMultiple(val) {
      this.apps.label = val
    },
    validateLink(link) {
      var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      // }
      // this.invalid_link = !!pattern.test(link)
      // console.log(!!pattern.test(link))
      return !!pattern.test(link);
    },
    async saveApp() {
      const isValid = await this.$refs.form.validate()
      console.log(isValid)
      console.log(this.apps)
      let formData = new window.FormData()
      formData.set('apps', this.apps)
      console.log(formData)
      // validate link
      // insert api
    }
  }
}
</script>
