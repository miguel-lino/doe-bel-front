<template>
    <div class="m-0 p-0">
        <div class="form">
                <b-row class="mt-4 mb-4"><h2 style="color: orange;">Cadastrar item para Doação</h2></b-row>
                <b-row style="margin-top: 3%; margin-bottom: 3%">
                    <b-col cols="4">
                        <span class="titulo-input">Descrição do item</span>
                        <b-form-input size="sm" v-model="itemDescricao" :state="estadoDescricao"></b-form-input>
                    </b-col>
                    <b-col cols="4">
                        <span class="titulo-input">Bairro onde está localizado</span>
                        <b-form-input size="sm" v-model="itemBairro" :state="estadoBairro"></b-form-input>
                    </b-col>
                    <b-col cols="4">
                        <span class="titulo-input">Cidade onde está localizado</span>
                        <b-form-input size="sm" v-model="itemCidade" :state="estadoCidade"></b-form-input>
                    </b-col>
                </b-row>
                <b-row style="margin-top: 5%;">
                    <b-col cols="3">
                        <span class="titulo-input">Item está montado?</span> 
                        <br>
                        <b-form-select :class="[estadoMontado === false ? 'select-invalido' : '', 'w-100']" size="sm" :options="listaSimNao" v-model="itemMontado" required></b-form-select>
                    </b-col>
                    <b-col cols="3">
                        <span class="titulo-input">Item precisa de conserto?</span> 
                        <br>
                        <b-form-select :class="[estadoConserto === false ? 'select-invalido' : '', 'w-100']" size="sm" :options="listaSimNao" v-model="itemConserto"></b-form-select>
                    </b-col>
                    <b-col cols="3">
                        <span class="titulo-input">Retirada no seu endereço?</span> 
                        <br>
                        <b-form-select :class="[estadoRetirada === false ? 'select-invalido' : '', 'w-100']" size="sm" :options="listaSimNao" v-model="itemRetirada" :state="estadoRetirada"></b-form-select>
                    </b-col>
                    <b-col cols="3">
                        <span class="titulo-input">Estado de conservação:</span> 
                        <br>
                        <b-form-select :class="[estadoConservacao === false ? 'select-invalido' : '', 'w-100']" size="sm" :options="listaEstadoConservacao" v-model="itemEstadoConservacao" :state="estadoConservacao"></b-form-select>
                    </b-col>
                </b-row>
                <b-row class="m-0 p-0 d-flex justify-content-end" style="margin-top: 8% !important;">
                    <b-button class="botao-cadastro text-center" @click="checkAnuncio">Cadastrar</b-button>
                </b-row>
        </div>
    </div>

</template>
<script>
import AnunciosService from "../services/AnunciosService";

export default {
    name: 'CriarAnuncio',
    data () {
        return {
            listaSimNao: [
                { value: true, text: 'Sim' },
                { value: false, text: 'Não' },
            ],
            listaEstadoConservacao: [
                { value: 'Quase novo', text: 'Quase novo' },
                { value: 'Antigo', text: 'Antigo' },
                { value: 'Quebra-galho', text: 'Quebra-galho' },
            ],
            itemDescricao: '',
            itemBairro: '',
            itemCidade: '',
            itemMontado: null,
            itemConserto: null,
            itemRetirada: null,
            itemEstadoConservacao: '',
            /**/
            estadoDescricao: null,
            estadoBairro: null,
            estadoCidade: null,
            estadoMontado: null,
            estadoConserto: null,
            estadoRetirada: null,
            estadoConservacao: null

        }
    },
    beforeMount() {
        if (!this.$store.getters.usuarioEstaAutenticado) {
            this.$router.push({ path: '/login'});
        }
    },
    methods: {
        checkAnuncio() {
            this.estadoDescricao = this.itemDescricao && this.itemDescricao.trim() !== '' ? true : false;
            this.estadoBairro = this.itemBairro && this.itemBairro.trim() !== '' ? true : false;
            this.estadoCidade = this.itemCidade && this.itemCidade.trim() !== '' ? true : false;
            this.estadoMontado = this.itemMontado !== null && this.itemMontado !== '' ? true : false;
            this.estadoConserto = this.itemConserto !== null && this.itemConserto !== '' ? true : false;
            this.estadoRetirada = this.itemRetirada !== null && this.itemRetirada !== '' ? true : false;
            this.estadoConservacao = this.itemEstadoConservacao !== null && this.itemEstadoConservacao !== '' ? true : false;

            if (
                this.estadoDescricao !== false 
                && this.estadoBairro !== false
                && this.estadoCidade !== false
                && this.estadoMontado !== false
                && this.estadoConserto !== false
                && this.estadoRetirada !== false
                && this.estadoConservacao !== false
            ) {
                this.criarAnuncio();
            } else {
                alert('Verifique o preenchimento dos campos');
            }
        },
        criarAnuncio() {
            AnunciosService.criarAnuncio({
            item_descricao: this.itemDescricao,
            item_bairro: this.itemBairro,
            item_cidade: this.itemCidade,
            item_montado: this.itemMontado,
            item_conserto: this.itemConserto,
            item_retirada: this.itemRetirada,
            item_conservacao: this.itemEstadoConservacao,
            item_nome_usuario: this.username
          })
          .then(response => {
            if(response.status === 200 || response.status === 201)
            alert('Anúncio criado com sucesso!');
            this.$router.push({ path: '/meu-perfil' });
            this.limpaCampos();
          })
          .catch(err => {
            alert(err.response.data.message);
          });
        },
        limpaCampos() {
            this.itemDescricao = '',
            this.itemBairro = '',
            this.itemCidade = '',
            this.itemMontado = null,
            this.itemConserto = null,
            this.itemRetirada = null,
            this.itemEstadoConservacao = ''
        }
    }
}

</script>
<style scoped>
.form {
    width: 95%;
    height: 450px;
    margin: auto;
    background-color: #fff;
    box-shadow: 0px 1px 10px #f3b251;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    padding: 20px 100px;
}
.botao-cadastro, .botao-cadastro:hover {
    width: 10%;
    background-color: orange;
    border: 0px;
    font-size: 0.9vw;
}
.titulo-input {
    color: orange;
}
/* .select {
    width: 100%;
} */
 .select-invalido {
    border: 1px solid red;
 }
</style>