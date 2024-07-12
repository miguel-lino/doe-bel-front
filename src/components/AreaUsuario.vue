<template>
    <div class="m-0 p-0 w-100 mt-4">
        <b-row>
            <b-col class="doacoes-usuario-wrapper" cols="8" style="overflow-y: scroll;">
                <b-row class="m-0 p-0">
                    <h4 style="color: orange;">Meus itens para doação</h4>
                </b-row>
                <b-row v-if="!usuarioTemAnuncio" class="d-flex justify-content-center mt-4" style="padding-left: 25px; padding-top: 25px;">
                    <h5 class="m-0 p-0 text-center mb-2" style="color: orange;">Parece que você não tem nada anunciado...</h5> 
                    <b-button class="botao-cadastro text-center" @click="doar">Doar</b-button>
                </b-row>

                <div v-if="usuarioTemAnuncio" class="mt-4 p-1">
                    <b-table
                        striped 
                        hover 
                        :fields="colunasTabela"
                        :items="anunciosUsuario"
                    >
                    <template v-slot:cell(item_descricao)="linhaDescricao">
                        <div v-if="!linhaDescricao.item.sendoEditado">
                            {{ linhaDescricao.item.item_descricao }}
                        </div>
                        <div v-if="linhaDescricao.item.sendoEditado">
                            <b-form-input size="sm" v-model="linhaDescricao.item.item_descricao" :state="estadoDescricao"></b-form-input>
                        </div>
                    </template>

                    <template v-slot:cell(item_montado)="linhaMontado">
                        <div v-if="!linhaMontado.item.sendoEditado">
                            {{ linhaMontado.item.item_montado }}
                        </div>
                        <div v-if="linhaMontado.item.sendoEditado">
                            <b-form-select size="sm" v-model="linhaMontado.item.item_montado" :options="listaSimNao"></b-form-select>
                        </div>
                    </template>

                    <template v-slot:cell(item_conserto)="linhaConserto">
                        <div v-if="!linhaConserto.item.sendoEditado">
                            {{ linhaConserto.item.item_conserto}}
                        </div>
                        <div v-if="linhaConserto.item.sendoEditado">
                            <b-form-select size="sm" v-model="linhaConserto.item.item_conserto" :options="listaSimNao"></b-form-select>
                        </div>
                    </template>

                    <template v-slot:cell(item_retirada)="linhaRetirada">
                        <div v-if="!linhaRetirada.item.sendoEditado">
                            {{ linhaRetirada.item.item_retirada }}
                        </div>
                        <div v-if="linhaRetirada.item.sendoEditado">
                            <b-form-select size="sm" v-model="linhaRetirada.item.item_retirada" :options="listaSimNao"></b-form-select>
                        </div>
                    </template>

                    <template v-slot:cell(item_conservacao)="linhaConservacao">
                        <div v-if="!linhaConservacao.item.sendoEditado">
                            {{ linhaConservacao.item.item_conservacao }}
                        </div>
                        <div v-if="linhaConservacao.item.sendoEditado">
                            <b-form-select size="sm" v-model="linhaConservacao.item.item_conservacao" :options="listaEstadoConservacao"></b-form-select>
                        </div>
                    </template>

                    <template v-slot:cell(item_doado)="linhaDoado">
                        <div v-if="!linhaDoado.item.sendoEditado">
                            {{ linhaDoado.item.item_doado }}
                        </div>
                        <div v-if="linhaDoado.item.sendoEditado">
                            <b-form-select size="sm" v-model="linhaDoado.item.item_doado" :options="listaSimNao"></b-form-select>
                        </div>
                    </template>

                    <template v-slot:cell(acao)="linhaAcao">

                        <b-row v-if="!linhaAcao.item.sendoEditado" class="m-0 p-0">
                          <b-col class="p-0" cols="4" style="margin-right: 25%"><i class="fas fa-pencil pointer" @click="toggleEdicaoAnuncio(linhaAcao.item.id)"></i></b-col>  
                          <b-col class="p-0" cols="4"><i class="fas fa-trash pointer text-danger" @click="excluirAnuncio(linhaAcao.item)"></i></b-col>  
                        </b-row>

                        <b-row v-if="linhaAcao.item.sendoEditado" class="m-0 p-0">
                          <b-col class="p-0" style="margin-left: 25%"><i class="fas fa-save pointer text-success" @click="checkEdicao(linhaAcao.item)"></i></b-col>  
                        </b-row>

                    </template>
                    </b-table>
            </div>
            </b-col>
            <b-col class="dados-usuario-wrapper" cols="3">
                <h4 style="color: orange;">Meu perfil</h4>
                <b-row style="margin-top: 8%;">
                    <p class="label-perfil mb-0">Nome de usuário</p>
                    <span >{{ nomeUsuario }}</span>
                </b-row>
                <b-row>
                    <p class="label-perfil mb-0 mt-3">E-mail</p>
                    <span v-if="!modoEdicaoCardPerfil" class="ellipsis">{{ emailUsuario }}</span>
                    <b-form-input v-if="modoEdicaoCardPerfil" size="sm" class="input-usuario" v-model="novoEmailUsuario"></b-form-input>
                </b-row>
                <b-row>
                    <p class="label-perfil mb-0 mt-3">Perfil do Instagram</p>
                    <span v-if="!modoEdicaoCardPerfil">{{ instagramUsuario || 'Não fornecido' }}</span>
                    <b-form-input v-if="modoEdicaoCardPerfil" size="sm" class="input-usuario" v-model="novoInstagramUsuario"></b-form-input>
                </b-row>
                <b-row>
                    <p class="label-perfil mb-0 mt-3">Número de Whatsapp</p>
                    <span v-if="!modoEdicaoCardPerfil">{{ numeroUsuario || 'Não fornecido' }}</span>
                    <b-form-input v-if="modoEdicaoCardPerfil" size="sm" class="input-usuario" v-model="novoNumeroUsuario"></b-form-input>
                </b-row>
                <b-row v-if="!modoEdicaoCardPerfil" class="button-area d-flex justify-content-between p-2" style="margin-top: 15%">
                    <b-col class="m-0 p-0" cols="6">
                        <b-button class="btn-sair" @click="logoff">Sair</b-button>
                    </b-col>
                    <b-col class="m-0 p-0 d-flex justify-content-end" cols="6">
                        <b-button class="btn-editar" @click="toggleEditarDadosUsuario">Editar dados</b-button>
                    </b-col>
                </b-row>
                <b-row v-if="modoEdicaoCardPerfil" class="button-area d-flex justify-content-between mt-4 p-2">
                    <b-col class="m-0 p-0" cols="6">
                        <b-button variant="danger" @click="toggleEditarDadosUsuario">Cancelar</b-button>
                    </b-col>
                    <b-col class="m-0 p-0 d-flex justify-content-end" cols="6">
                        <b-button variant="success" @click="editaDadosUsuario">Salvar</b-button>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import AnunciosService from '../services/AnunciosService';
import UsuariosService from "../services/UsuariosService";

export default {
    name: 'AreaUsuario',
    data() {
        return {
            nomeUsuario: '',
            emailUsuario: '',
            instagramUsuario: '',
            numeroUsuario: '',
            anunciosUsuario: [],
            colunasTabela: [
                { key: 'item_descricao', label: 'Item'},
                { key: 'item_local', label: 'Local'},
                { key: 'item_montado', label: 'Montado'},
                { key: 'item_conserto', label: 'Requer conserto'},
                { key: 'item_retirada', label: 'Retirada obrigatória'},
                { key: 'item_conservacao', label: 'Estado de conservação'},
                { key: 'item_doado', label: 'Doado' },
                { key: 'acao', label: 'Ação' }
            ],
            modoEdicaoCardPerfil: false,
            novoEmailUsuario: '',
            novoInstagramUsuario: '',
            novoNumeroUsuario: '',
            listaSimNao: [
                { value: 'Sim', text: 'Sim' },
                { value: 'Não', text: 'Não' },
            ],
            listaEstadoConservacao: [
                { value: 'Quase novo', text: 'Quase novo' },
                { value: 'Antigo', text: 'Antigo' },
                { value: 'Quebra-galho', text: 'Quebra-galho' },
            ],
            estadoDescricao: null,
        }
    },
    beforeMount() {
        if(this.$store.getters.usuarioEstaAutenticado) {
            this.init();
        } 
        else {
            this.$router.push({ path: '/login' });
        }
    },
    computed: {
        usuarioTemAnuncio() {
            return this.anunciosUsuario && this.anunciosUsuario.length > 0;
        },
        anunciosUsuarioComputed() {
            return this.anunciosUsuario;
        }
    },
    methods: {
        async init() {
            await this.buscaDadosUsuario();
            await this.buscaAnunciosUsuario();
            this.resetaVariaveisEdicao();
        },
        async buscaDadosUsuario() {
            UsuariosService.buscarUsuario().then(response => {
            const retornoUsr = response.data.data.retornoUsr;
            this.nomeUsuario = retornoUsr.username;
            this.emailUsuario = retornoUsr.email;
            this.instagramUsuario = retornoUsr.instagram;
            this.numeroUsuario = retornoUsr.number;

            // FIXME: Como beforeMount() as vezes não é ativado por mudança na rota, vamos redirecionar usuário aqui nesta função também
                if(response.status == 401) {
                    this.$store.dispatch('limpaUsuario');
                    this.$router.push({ path: '/login' });
                }
            })
        },
        async buscaAnunciosUsuario() {
            this.anunciosUsuario = [];
            AnunciosService.buscarAnunciosUsuario().then(response => {
                this.parseiaAnuncios(response.data.data.retornoAnuncios);
                this.ordenaAnuncios();
                this.resetaVariaveisEdicao();
            });
        },
        editaDadosUsuario() {
            const body = {
                email: this.novoEmailUsuario,
                instagram: this.novoInstagramUsuario,
                number: this.novoNumeroUsuario
            }

            UsuariosService.editar(body).then(response => {
                this.atualizaVariaveisAposEdicao(response.data.data.body);
                this.toggleEditarDadosUsuario();
                alert('Dados editados com sucesso!');
            })
        },
        parseiaAnuncios(anuncios) {
            let obj = {}
            for (const anuncio of anuncios) {
                obj = {}
                obj.id = anuncio.id;
                obj.item_local = anuncio.item_bairro + ' - ' + anuncio.item_cidade;
                obj.item_descricao = anuncio.item_descricao;
                obj.item_conservacao = anuncio.item_conservacao;
                obj.item_montado = anuncio.item_montado ? 'Sim' : 'Não';
                obj.item_conserto = anuncio.item_conserto ? 'Sim' : 'Não';
                obj.item_retirada = anuncio.item_retirada ? 'Sim' : 'Não';
                obj.item_doado = anuncio.item_doado ? 'Sim' : 'Não';
                obj.item_nome_usuario = anuncio.item_nome_usuario;
                obj.sendoEditado = false;
                obj.criacao_anuncio = new Date(anuncio.createdAt);

                this.anunciosUsuario.push(obj);
            }
        },
        ordenaAnuncios() {
            this.anunciosUsuario = this.ordenaPorData(this.anunciosUsuario);
        },
        logoff() {
            if(window.confirm('Deseja mesmo sair?')) {
                this.$store.dispatch('limpaUsuario');
                this.$router.push({ path: '/'});
            }
        },
        doar() {
            this.$router.push({ path: '/criar-anuncio' });
        },
        excluirAnuncio(item) {
            if(window.confirm('Deseja mesmo excluir o anúncio?')){
                AnunciosService.excluirAnuncio(item.id).then(
                    this.excluiItemTabela(item.id)
                ); 
            }
        },
        toggleEditarDadosUsuario() {
            this.resetaVariaveisEdicao();
            this.modoEdicaoCardPerfil = !this.modoEdicaoCardPerfil;
        },
        resetaVariaveisEdicao() {
            this.novoEmailUsuario = this.emailUsuario;
            this.novoInstagramUsuario = this.instagramUsuario;
            this.novoNumeroUsuario = this.numeroUsuario;
        },
        atualizaVariaveisAposEdicao(respostBd) {
            this.emailUsuario = respostBd.email;
            this.instagramUsuario = respostBd.instagram;
            this.numeroUsuario = respostBd.number;
        },
        excluiItemTabela(id) {
            this.anunciosUsuario = this.anunciosUsuario.filter((x) => x.id !== id);
        },
        toggleEdicaoAnuncio(id) {
            const index = this.anunciosUsuario.findIndex((x) => x.id === id);
            this.anunciosUsuario[index].sendoEditado = !this.anunciosUsuario[index].sendoEditado;
        },
        checkEdicao(item) {
           this.estadoDescricao = item.item_descricao && item.item_descricao.trim() !== '' ? null : false;
           if(this.estadoDescricao === false) { 
            alert('Verifique todos os campos');
           } else {
            this.editaAnuncio(item);
           }
        },
        editaAnuncio(item) {
            AnunciosService.editarAnuncio(item.id, item).then(response => {
                this.toggleEdicaoAnuncio(item.id);
                alert('Anúncio atualizado com sucesso!');
            })
        },
        ordenaPorData(array) {
            const arrayOrdenado = array.sort(({criacao_anuncio: a}, {criacao_anuncio: b}) => a < b ? 1 : a > b ? -1 : 0);
            return arrayOrdenado;
        }
    }
}

</script>
<style>
.doacoes-usuario-wrapper {
    height: 600px;
    /* width: 65%; */
    box-shadow: 0px 1px 10px #f3b251;
    border-radius: 4px;
    margin-right: 2%;
    padding: 20px 40px;
}
.dados-usuario-wrapper {
    height: 430px;
    box-shadow: 0px 1px 10px #f3b251;
    border-radius: 4px;
    margin-left: 2%;
    padding: 20px;
}
.label-perfil {
    color: orange;
}
.btn-editar, .btn-editar:hover {
    background-color: orange;
    border: 0px;
}
.btn-sair, .btn-sair:hover {
    background-color: white;
    color: orange;
    border: 1px solid orange;
}
.botao-cadastro, .botao-cadastro:hover {
    width: 15%;
    background-color: orange;
    border: 0px;
}
.pointer {
    cursor: pointer;
}
.input-usuario {
    width: 90%;
    margin-left: 10px;
}
.ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    display: block;
    overflow: hidden
}
</style>