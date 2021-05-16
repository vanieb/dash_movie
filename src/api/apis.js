"use strict";

// import env from '.env.development'
// const env = process.env.NODE_ENV === 'development'
//     ? config.dev.env
//     : config.build.env
const host = process.env.VUE_APP_API_URL;

const dashboard = `${host}dashboard/`;
// const api = `${host}api/`;
const auth = `${host}oauth/`;

export default {
  count: `${host}dashboard/header/counts/`,
  token: `${auth}token`,
  register: `${dashboard}register`,
  my: `${auth}my`,
  changePassword: `${dashboard}user/password`,
  logout: `${dashboard}oauth/token`,
  refresh_token: `${auth}login/refresh`,
  global_settings:  `${host}configsetting/v1/`,
  movies: `${dashboard}movies`,
  movie: `${dashboard}movie`,
  artists: `${dashboard}artists`,
  artist: `${dashboard}artist`,
  import_logs: `${host}articles/v1/import/`,
  users: `${dashboard}users`,
  user: `${dashboard}user`,
};
