import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      alias: "/anuncios",
      name: "anuncios",
      component: () => import("@components/AnunciosLista.vue")
    },
    {
      path: "/login",
      name: "Entre ou cadastre-se",
      component: () => import("@components/Login.vue")
    },
    {
      path: "/criar-anuncio",
      name: "Doar",
      component: () => import("@components/CriarAnuncio.vue")
    },
    {
      path: "/meu-perfil",
      name: "Área do usuário",
      component: () => import("@components/AreaUsuario.vue")
    },
    { 
      path: '/404', 
      name: '404',
      component: () => import("@src/404.vue") 
    },
    { 
      path: '/termos-de-uso-e-politica', 
      name: 'Termos de Uso e Política de Privacidade',
      component: () => import("@components/TermosDeUsoPoliticaPrivacidade.vue") 
    },   
    { 
      path: '*', 
      name: '',
      redirect: '/404', 
    },  
  ]
});
