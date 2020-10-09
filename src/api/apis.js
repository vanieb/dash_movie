'use strict'

// import env from '.env.development'
// const env = process.env.NODE_ENV === 'development'
//     ? config.dev.env
//     : config.build.env
const host =  process.env.VUE_APP_API_URL

const apps = `${host}apps/v1/`
const auth = `${host}authentication/v1/`
const websites = `${host}websites/v1/`
const accounts = `${host}accounts/v1/`

export default {
  login: `${auth}login`,
  my: `${auth}my`,
  userPermissions: `${accounts}permissions/user/`,
  permissions: `${accounts}permissions/`,
  changePassword: `${auth}password`,
  logout: `${auth}logout`,
  refresh_token: `${auth}login/refresh`,
  apps: `${apps}`,
  classification: `${apps}classification`,
  upload: `${apps}upload/`,
  download_link: `${apps}download/`,
  websites: `${websites}`,
  webapps:  `${websites}apps/`,
  articles: `${host}articles/v1/`,
  keywords: `${host}articles/v1/keywords/`,
  friendship_link: `${websites}friendship-links/`,
  types: `${websites}types/`,
  categories: `${websites}categories/`,
  labels: `${websites}labels/`,
  import_logs: `${host}articles/v1/import/`,
  staff: `${accounts}staff/`,
  members: `${accounts}members/`
}
