import axios from "axios";

/* .ENV */
const url_api = process.env.VUE_APP_URL_API;

/* Cookie */
import Vue from 'vue'
import VueCookies from 'vue-cookies-reactive'
Vue.use(VueCookies);

export default function() {
  return axios.create({
      baseURL: url_api,
      headers: {
        "Content-type": "application/json",
        "Authorization" : `Bearer ${Vue.$cookies.get('usertoken')}`
      },
      withCredentials: true
    });
}