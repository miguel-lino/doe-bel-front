<template>
  <div id="app" class="d-flex flex-column fonte-doe-bel">
    <b-row class="d-flex" style="background-color: orange; width: 100%; height: 8%;">
      <b-col class="d-flex justify-content-start" style="width: 70%; margin: auto;">
        <router-link to="/anuncios" class="navbar-brand" style="margin-left: 5%; font-size: 30px; color: white;">DoeBel</router-link>
      </b-col>
      <b-col class="d-flex justify-content-end" style="width: 25%; margin: auto 2% auto 0;">
          <button class="botao-quero-doar" style="margin-right: 1%; font-size: 16px" @click="redirecionaQueroDoar">
            <!-- <router-link to="/criar-anuncio" style="text-decoration: none; color: inherit;"> -->
              QUERO DOAR
            <!-- </router-link> -->
          </button> 
        <button class="botao-perfil text-center" style="margin-left: 1%;" @click="redirecionaLogin">
          <i class="fa-solid fa-user" style="font-size: 16px"></i>
        </button>
      </b-col>
    </b-row>

    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {}
  },
  beforeMount() {
    this.init();
  },
  methods: {
    async init() {
      await this.$store.dispatch('verificaUsuario');
    },
    redirecionaLogin() {
      this.$router.push({ path: 'meu-perfil' });
    },
    redirecionaQueroDoar() {
      this.$router.push({ path: 'criar-anuncio' });
    },
  }
};
</script>

<style>
/* Fonte */
@import url(https://fonts.googleapis.com/css?family=Bree+Serif);

html, body, #app, .container {
  height: 100%;
}
.fonte-doe-bel {
  font-family: 'Bree Serif', serif
}
.botao-quero-doar {
  background-color: white;
  border: 0px;
  border-radius: 5px;
  color: orange;
  padding: 5px 8px;
  height: 70%;
}
.botao-perfil {
  background-color: white;
  border: 0px;
  border-radius: 20%;
  color: orange;
  padding: 5px 8px;
  height: 100%;
  width: 5%;
}
</style>
