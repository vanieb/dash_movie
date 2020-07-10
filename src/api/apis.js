'use strict'

// import env from '.env.development'
// const env = process.env.NODE_ENV === 'development'
//     ? config.dev.env
//     : config.build.env
const host =  process.env.VUE_APP_API_URL

const apps = `${host}apps/v1/`
const auth = `${host}authentication/v1/`
const websites = `${host}websites/v1/`

export default {
  login: `${auth}login`,
  my: `${auth}my`,
  changePassword: `${auth}password`,
  logout: `${auth}logout`,
  refresh_token: `${auth}login/refresh`,
  apps: `${apps}`,
  upload: `${apps}upload/`,
  download_link: `${apps}download/`,
  websites: `${websites}`,
  webapps:  `${websites}apps/`,
  articles: `${host}articles/v1/`,
  types: `${websites}types/`,
  categories: `${websites}categories/`,
  labels: `${websites}labels/`,
  import_logs: `${host}articles/v1/import/`,
  staff: `${host}accounts/v1/staff/`
}
