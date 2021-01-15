// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import { Icon, Button} from "vant";
import VueClipboard from 'vue-clipboard2'
import "amfe-flexible";
import "normalize.css/normalize.css";
import "./assets/font/FZXIANGSU16.css";

Vue.config.productionTip = false;
Vue.use(Button);
Vue.use(Icon);
Vue.use(VueClipboard)

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
