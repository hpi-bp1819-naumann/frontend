import Vue from "vue";
import App from "./App.vue";

import router from "./routes.js";
// import router from "./router";

import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
import Vuelidate from "vuelidate";

import './assets/css/dialog.css'

Vue.use(VueMaterial);
Vue.use(Vuelidate);

new Vue({
  el: "#app",
  router,
  template: "<App/>",
  components: { App }
});
