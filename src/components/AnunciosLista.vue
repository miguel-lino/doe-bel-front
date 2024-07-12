<template>
    <div class="wrapper">
        <b-row style="color: orange;">
           <h2>As pessoas estão doando</h2> 
        </b-row>
        <b-row class="wrapper-filtros-tabela">
          <b-row class="card-filtros m-0 p-0">
            <!-- <div class="card-filtros m-0 p-0"> -->
            <b-row class="d-flex justify-content-center" style="margin-top: 1.5%;">
              <b-col style="width: 20%;">
                <p class="label-filtro">Pesquisar itens</p>
                <!-- <input class="input-filtro"> -->
                 <b-form-input class="input-sm" v-model="filtroItens"></b-form-input>
              </b-col>
              <b-col style="width: 20%;">
                <p class="label-filtro">Pesquisar locais</p>
                <!-- <input class="input-filtro"> -->
                <b-form-input size="sm" v-model="filtroLocal"></b-form-input>
              </b-col>
              <b-col style="width: 20%;">
                <p class="label-filtro">Item montado?</p>
                <!-- <input class="input-filtro"> -->
                <b-form-select class="select" size="sm" :options="listaSimNao" v-model="filtroMontado"></b-form-select>
              </b-col>
              <b-col style="width: 20%; margin-left: 2%;">
                <p class="label-filtro">Estado de conservação</p>
                <!-- <input class="input-filtro"> -->
                <b-form-select class="select" size="sm" :options="listaEstadoConservacao" v-model="filtroEstadoConservacao"></b-form-select>
              </b-col>
            </b-row>
          <!-- </div> -->
          </b-row>
          <b-row class="m-0 p-0 h-100" style="width: 80%;">
            <div class="m-0 p-0" v-if="tamanhoTabelaAnuncios < 1" style="margin-top: 7% !important">
              <div class="m-0 p-0 text-center" v-show="!usuarioEstaFiltrando">
                <h3 style="color: orange;">Ainda não há nada para doação :/</h3>
                <b-button class="botao-cadastro text-center" @click="doar">Doar</b-button>
              </div>
              <div class="m-0 p-0 text-center" v-show="usuarioEstaFiltrando">
                <h3 style="color: orange;">Sem resultados para os filtros selecionados</h3>
              </div>
             </div>
            <div class="m-0 p-0 mt-4" v-show="tamanhoTabelaAnuncios > 0">
              <b-table
                striped 
                hover 
                :fields="colunasTabela"
                :items="anunciosFiltradosOrdenados"
              >
              <template v-slot:cell(contatos)="linhaContatos">
                <div>
                  <b-row class="m-0 p-0">
                    <b-col class="m-0 p-0" v-show="linhaContatos.item.anunciante_possui_email">
                      <i class="fa-solid fa-envelope pointer" @click="abreSoftwareEmail(linhaContatos.item.email)"></i>
                    </b-col>
                    <b-col class="m-0 p-0" v-show="linhaContatos.item.anunciante_possui_instagram">
                      <a :href="linhaContatos.item.instagram" target="_blank" class="link-icone"><i class="fa-brands fa-instagram pointer"></i></a> 
                    </b-col>
                    <b-col class="m-0 p-0" v-show="linhaContatos.item.anunciante_possui_telefone">
                      <a :href="linhaContatos.item.whatsapp" target="_blank" class="link-icone"><i class="fa-brands fa-whatsapp pointer"></i></a> 
                    </b-col>
                  </b-row>
                </div>
              </template>
              </b-table>
            </div>
          </b-row>
        </b-row>
    </div>
</template>

<script>
import AnunciosService from "../services/AnunciosService";

export default {
  name: "AnunciosLista",
  data() {
    return {
        colunasTabela: [
          { key: 'item_descricao', label: 'Item'},
          { key: 'item_local', label: 'Local'},
          { key: 'item_montado', label: 'Montado'},
          { key: 'item_necessita_conserto', label: 'Requer conserto'},
          { key: 'item_retirada_obrigatoria', label: 'Retirada obrigatória'},
          { key: 'item_estado_conservacao', label: 'Estado de conservação'},
          { key: 'contatos', label: 'Contatos'},
        ],
        anuncios: [],
        filtroItens: '',
        filtroLocal: '',
        filtroMontado: '',
        filtroEstadoConservacao: '',
        listaSimNao: [
            { value: '', text: '' },
            { value: 'SIM', text: 'Sim' },
            { value: 'NÃO', text: 'Não' },
        ],
        listaEstadoConservacao: [
            { value: '', text: '' },
            { value: 'Quase novo', text: 'Quase novo' },
            { value: 'Antigo', text: 'Antigo' },
            { value: 'Quebra-galho', text: 'Quebra-galho' },
        ],
    }
  },
  mounted() {
    this.buscaAnuncios();
  },
  computed: {
    anunciosFiltradosOrdenados() {
      let tabelaFiltrada = 
        this.anuncios.filter((x) => x.item_descricao.toLowerCase().includes(this.filtroItens.toLowerCase()))
        .filter((x) => x.item_local.toLowerCase().includes(this.filtroLocal.toLowerCase()))
        .filter((x) => x.item_montado === this.filtroMontado || this.filtroMontado === '')
        .filter((x) => x.item_estado_conservacao === this.filtroEstadoConservacao || this.filtroEstadoConservacao === '');

      tabelaFiltrada = this.ordenaPorData(tabelaFiltrada);
      return tabelaFiltrada;
    }, 
    tamanhoTabelaAnuncios() {
      return this.anunciosFiltradosOrdenados.length;
    },
    usuarioEstaFiltrando() {
      const usuarioEstaFiltrando = this.filtroItens !== '' || this.filtroLocal !== '' || this.filtroMontado !== '' || this.filtroEstadoConservacao !== '';
      return usuarioEstaFiltrando;
    }
  },
  methods: {
    async buscaAnuncios() {
        AnunciosService.buscarTodos()
        .then(response => {
          this.parseiaAnuncios(response.data.data.anuncios);
        })
        .catch(e => {
          console.log(e);
        });
    },
    parseiaAnuncios(anuncios) {
      let obj = {}
      for (const anuncio of anuncios) {
        obj = {}

        /* Propriedades do item */
        obj.item_local = anuncio.item_bairro + ' - ' + anuncio.item_cidade;
        obj.item_descricao = anuncio.item_descricao;
        obj.item_estado_conservacao = anuncio.item_conservacao;
        obj.item_montado = anuncio.item_montado ? 'SIM' : 'NÃO';
        obj.item_necessita_conserto = anuncio.item_necessita_conserto ? 'SIM' : 'NÃO';
        obj.item_retirada_obrigatoria = anuncio.item_retirada_obrigatoria ? 'SIM' : 'NÃO';
        obj.criacao_anuncio = new Date(anuncio.createdAt);

        /* Contatos do anunciante */
        obj.anunciante_possui_email = anuncio.email ? true : false;
        obj.email = anuncio.email;

        obj.anunciante_possui_instagram = anuncio.instagram ? true : false;
        obj.instagram = 'https://instagram.com/' + anuncio.instagram;

        obj.anunciante_possui_telefone = anuncio.number ? true : false;
        obj.whatsapp = 'https://wa.me/' + '55' + anuncio.number;

        this.anuncios.push(obj);
      }
    },
    // buscaContatosInsereAnuncio(objAnuncio) {
    //   UsuariosService.buscarUsuario()
    //   .then(response => {
    //     const retornoUsr = response.data.data.retornoUsr;

    //     objAnuncio.anunciante_possui_email = retornoUsr.email ? true : false; 
    //     objAnuncio.email = retornoUsr.email;

    //     objAnuncio.anunciante_possui_telefone = retornoUsr.number ? true : false; 
    //     objAnuncio.whatsapp = 'https://wa.me/' + '55' + retornoUsr.number;

    //     objAnuncio.anunciante_possui_instagram = retornoUsr.instagram ? true : false; 
    //     objAnuncio.instagram = 'https://instagram.com/' + retornoUsr.instagram;

    //     this.anuncios.push(objAnuncio);
    //   })
    //   .catch(e => {
    //     console.log(e);
    //   });
    // },
    abreSoftwareEmail(email) {
      window.open(`mailto:${email}`);
    },
    ordenaPorData(array) {
      const arrayOrdenado = array.sort(({criacao_anuncio: a}, {criacao_anuncio: b}) => a < b ? 1 : a > b ? -1 : 0);
      return arrayOrdenado;
    },
    doar() {
      this.$router.push({ path: '/criar-anuncio' });
    },
  
  }
};
</script>

<style>
.wrapper {
  height: 100%;
  margin-top: 4%;
}
.wrapper-filtros-tabela {
  height: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2%;
}
.card-filtros {
  background-color: orange;
  width: 80%;
  height: 80px;
  border-radius: 5px;
}
.label-filtro {
  margin-bottom: 0;
  padding-bottom: 0;
  color: white;
}
.input-filtro {
  border-radius: 5px;
  box-shadow: none;
  width: 80%;
  height: 40%;
}
.pointer {
  cursor: pointer;
}
.input-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
.select {
    width: 100%;
    height: 48%;
}
/* a, a:hover{
  text-decoration: none;
  color: inherit;
} */
.link-icone {
  text-decoration: none;
  color: inherit;
}
.botao-cadastro, .botao-cadastro:hover {
  margin-top: 1%;
  width: 10%;
  background-color: orange;
  border: 0px;
  font-size: 18px;
}
</style>