<template>
    <div class="w-100 mt-4 nao-encontrado">
        <p class="m-0 p-0"> Página não encontrada :/</p>
        <b-button class="mt-3 btn-pagina-principal" @click="voltar">
            Voltar
        </b-button>
    </div>
</template>

<script>
export default {
  name: "NotFound",
  data() {
    return {}
  },
  methods: {
    voltar() {
        this.$router.push({ path: '/' });
    }
  }
}
</script>
<style scoped>
.nao-encontrado {
    font-size: 30px;
    text-align: center;
    color: orange;
}
.btn-pagina-principal, .btn-pagina-principal:hover {
    background-color: orange;
    border: 1px solid orange;
    color: white;
    font-size: 16px;
}
</style>