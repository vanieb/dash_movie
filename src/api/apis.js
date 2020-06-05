'use strict'

// import env from '.env.development'
// const env = process.env.NODE_ENV === 'development'
//     ? config.dev.env
//     : config.build.env
const host =  process.env.VUE_APP_API_URL

const apps = `${host}apps/v1/`
const auth = `${host}authentication/v1/`

export default {
  login: `${auth}login`,
  my: `${auth}my`,
  changePassword: `${auth}password`,
  logout: `${auth}logout`,
  refresh_token: `${auth}login/refresh/`,
  apps: `${apps}`,
  upload: `${apps}upload/`,
  download_link: `${apps}download/`,
  websites: `${apps}websites/`,
  types: `${apps}types/`,
  categories: `${apps}categories/`,
  labels: `${apps}label`,
  staff: `${host}accounts/v1/staff/`
}
