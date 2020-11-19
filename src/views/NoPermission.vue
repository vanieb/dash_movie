<template>
  <v-flex class="align-center justify-center">
    <v-banner color="error" dark class="ma-2">{{
      $t("errors.no_access")
    }}</v-banner>
    <v-btn class="ml-2 primary" dark :to="'/apps'">{{ $t("nav.apps") }}</v-btn>
  </v-flex>
</template>
