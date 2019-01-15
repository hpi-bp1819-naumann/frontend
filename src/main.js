import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
import Vuelidate from 'vuelidate'
import VModal from 'vue-js-modal'

Vue.use(VueMaterial);
Vue.use(Vuelidate);
Vue.use(VModal, { dynamic: true });

new Vue({
  el: "#app",
  router,
  template: "<App/>",
  components: { App }
});
