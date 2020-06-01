'use strict'

// import env from '.env.development'
// const env = process.env.NODE_ENV === 'development'
//     ? config.dev.env
//     : config.build.env
const host =  process.env.VUE_APP_API_URL

const prefix = `${host}manage/`
const link = `${host}v1/manage/`

export default {
  login: `${prefix}login/`,
  my: `${link}my/`,
  changePassword: `${link}password/`,
  logout: `${host}logout/`,
  refresh_token: `${prefix}login/refresh/`,
  apps: `${link}websites/`,
  websites: `${link}categories/`,
  categories: `${link}categories/`,
  labels: `${link}categories/`,
  staff: `${link}staff/`
}
