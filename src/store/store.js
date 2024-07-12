import Vue from 'vue';
import Vuex from 'vuex';
import UsuarioService from '@services/UsuariosService';
import VueCookies from 'vue-cookies-reactive'
// import { hoje } from '@helpers/util.date.js';
 

/* VUEX e Cookies */
Vue.use(Vuex);
Vue.use(VueCookies);
 
export default new Vuex.Store({
  state: {},
  getters: {
    usuarioEstaAutenticado: () => {
      // função para o resultado desse getter nao ser cacheado
      return Vue.$cookies.get('usertoken') ? true : false;
    }
  },
  mutations: {
    // SUCESSO_AUTENTICACAO(state, username) {
    //
    // },
    FALHA_AUTENTICACAO() {
      Vue.$cookies.remove("usertoken", "/", ".doe-bel.site");
    },
  },
  actions: {
    async verificaUsuario(context) {
      try {
        await UsuarioService.verificaAutenticacao();
        return;
      } catch (e) {
        context.commit('FALHA_AUTENTICACAO');
        throw e;
      }
    },
    limpaUsuario({ commit }) {
      commit('FALHA_AUTENTICACAO');
    },
  }
});
 