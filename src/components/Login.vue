<template id="login-form">
    <div class="m-0 p-0">
        <div v-show="!showRegister" class="login-wrapper" style="margin: auto;">
        <form class="login-right" @keypress="trataEventoTeclas">
            <div class="h2" style="color: orange;">Entrar</div>
            <div class="form-group">
            <input type="text" id="username" placeholder="Nome de usuário" v-model="username" @keypress="trataEventoTeclas">
            <!-- <label for="username">E-mail</label>     -->
            </div>
            <div class="form-group">
            <input type="password" id="Password" placeholder="Senha" v-model="password" @keypress="trataEventoTeclas">
            <!-- <label for="Password">Senha</label>     -->
            </div>
            <!-- <div class="checkbox-container">
            <input type="checkbox" v-model="rememberMe">
            <div class="text-checkbox">Remember me</div>
            </div>  -->
            <div class="button-area">
            <button 
              class="btn pull-right" style="background-color: white; color: orange; align-items: center; border: 1px solid orange;" 
              @click="toggleRegister"
              @keypress="trataEventoTeclas"
            >
                Criar conta
            </button>
            
            <button 
                class="btn pull-right" 
                style="background-color: orange; color: white; align-items: center;" 
                @click="login" 
            >
                Entrar
            </button>
            </div>
        </form>
        </div>
        <div v-show="showRegister" class="register-wrap" style="margin: auto;">
            <form class="login-right" @keypress="trataEventoTeclas">
            <div class="h2" style="color: orange;">Criar Conta</div>
            <div class="form-group">
                <!-- <input type="text" id="username" placeholder="Nome de usuário (será usado para o login)" v-model="username"> -->
                <b-form-input v-model="username" :state="validaUsuario" placeholder="Nome de usuário (será usado para o login)" @keydown.native="trataEventoTeclas"></b-form-input>
            </div>
            <div class="form-group">
                <!-- <input type="text" id="email" placeholder="E-mail" v-model="email"> -->
                <b-form-input v-model="email" :state="validaEmail" placeholder="E-mail" @keydown.native="trataEventoTeclas"></b-form-input>
            </div>
            <div class="form-group">
                <!-- <input type="password" id="senha" placeholder="Senha" v-model="password"> -->
                <b-form-input v-model="password" :state="validaSenha" placeholder="Senha (mínimo 8 caracteres)" type="password" @keydown.native="trataEventoTeclas"></b-form-input>
            </div>
            <div class="form-group">
                <!-- <input type="text" id="instagram" placeholder="Perfil do instagram (sem o '@')" v-model="instagramProfile"> -->
                <b-form-input v-model="instagramProfile" placeholder="Perfil do instagram (sem o '@')" @keydown.native="trataEventoTeclas"></b-form-input>
            </div>
            <div class="form-group">
                <!-- <input type="text" id="telefone" placeholder="Número de whatsapp (modelo: 21988887777)" v-model="number"> -->
                <b-form-input v-model="number" placeholder="Número de whatsapp (modelo: 21988887777)" @keydown.native="trataEventoTeclas"></b-form-input>
            </div>
            <b-row class="mb-2 text-center" style="margin-top: 40px;">
              <b-col class="mr-0 p-0" cols="10" style="margin-right: -2%;">
               <span>Concordo com os <a class="link-termos-de-uso" href="/termos-de-uso-e-politica" target="_blank">Termos de uso e Política de privacidade</a></span> 
              </b-col>
              <b-col class="d-flex justify-content-start ml-0 p-0" cols="2" style="margin-top: 2px;">
                <span class="m-0 p-0">
                  <b-form-checkbox v-model="concordoComOsTermos"></b-form-checkbox>
                </span> 
              </b-col>
            </b-row>
            <div class="button-area-register justify-content-between">
                <button 
                  class="btn pull-right" 
                  style="background-color: white; color: Orange; align-items: center; border: 1px solid orange;" 
                  @click="toggleRegister"
                >
                  Já tenho conta
                </button>

                <button 
                    class="btn pull-right" 
                    style="background-color: orange; color: white; align-items: center;" 
                    @click="checkRegister" 
                >
                    Criar conta
                </button>
            </div>
        </form>
        </div>
    </div>
  </template>
  
  <script>
  import UsuariosService from "../services/UsuariosService";

  export default {
    name: "LoginForm",
    template: "#login-form",
    data() {
      return {
        rememberMe: false,
        username: "",
        email: "",
        password: "",
        instagramProfile: "",
        number: "",
        showRegister: false,
        validaUsuario: null,
        validaEmail: null,
        validaSenha: null,
        concordoComOsTermos: false,
      };
    },
    beforeMount() {
      if(this.$store.getters.usuarioEstaAutenticado) { this.$router.push({ path: '/meu-perfil' }); }

      let init = 1000;
      setTimeout(function() {
        document.querySelector(".login-wrapper").classList.toggle("open");
        init = 300;
      }, init);
    },
    updated() {
      if(this.$store.getters.usuarioEstaAutenticado) { this.$router.push({ path: '/meu-perfil' }); }
    },
    methods: {
      isRememberMe() {
        return this.rememberMe === true;
      },
      login(event) {
        event.preventDefault();
        //we should handle errors in a more scalabe way, but this works for now
  
        // alert(this.username + " " + this.password + " " + this.rememberMe);
  
        UsuariosService.login({
              username: this.username,
              password: this.password
          })
          .then(async response => {
            if(response.status === 200) {
                await this.$store.dispatch('verificaUsuario');
                this.$router.push({ path: '/meu-perfil' });
            }
          })
          .catch(err => {
            alert(err.response.data.message);
          });
      },
      toggleRegister(event) {
        event.preventDefault();
        this.limparVariaveisFormulario();
        this.showRegister = !this.showRegister;
      },
      checkRegister(event) {
        event.preventDefault();

        this.validaUsuario = this.username ? true : false;
        this.validaSenha = this.password ? true : false;
        this.validaEmail = this.email ? true : false;

        if(!this.concordoComOsTermos) {
          alert('Para uma criar uma conta é necessário concordar com os termos de uso do site');
        }

        if(this.username && this.password && this.email && this.concordoComOsTermos) {
          this.register();
        }
      },
      register() {
        UsuariosService.criar({
              username: this.username,
              email: this.email,
              password: this.password,
              instagram: this.instagramProfile,
              number: this.number
          })
          .then(async response => {
            if(response.status === 200 || response.status === 201) {
                await this.$store.dispatch('verificaUsuario');
                this.$router.push({ path: '/meu-perfil' });
            }
          })
          .catch(err => {
            alert(err.response.data.message);
          });
      },
      limparVariaveisFormulario() {
        this.username = "";
        this.email = "";
        this.password = "";
        this.instagramProfile = "";
        this.number = "";
      },
      trataEventoTeclas(event) {
        if (event.key === 'Enter') {
          event.preventDefault();
        }
      }
    }
  };
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  * {
    box-sizing: border-box;
  }
  
  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  
  #sandbox {
    font-family: "Lato", sans-serif;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    flex-direction: row-reverse;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    background: linear-gradient(243.87deg, #22bf64 30.6%, #371933 130.6%);
    overflow: hidden;
  }
  
  input {
    font-family: inherit;
    /* -webkit-appearance: none; */
    /* -moz-appearance: none; */
    border: 0;
    font-size: 16px;
    color: #000;
    border-radius: 0;
    border-bottom: 0;
  }
  
  input[type="text"],
  input[type="password"] {
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #aaaaaa;
  }
  
  button,
  input:focus {
    outline: 0;
  }
  
  ::-webkit-input-placeholder {
    font-size: 16px;
    font-weight: 300;
    letter-spacing: -0.00933333em;
  }
  
  .form-group {
    position: relative;
    padding-top: 15px;
    margin-top: 10px;
  }
  
  label {
    position: absolute;
    top: 0;
    opacity: 1;
    -webkit-transform: translateY(5px);
    transform: translateY(5px);
    color: #aaa;
    font-weight: 300;
    font-size: 13px;
    letter-spacing: -0.00933333em;
    transition: all 0.2s ease-out;
  }
  
  input:placeholder-shown + label {
    opacity: 0;
    -webkit-transform: translateY(15px);
    transform: translateY(15px);
  }
  
  .h1 {
    color: #fff;
    opacity: 0.8;
    font-size: 20px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.2405em;
    transition: all 770ms cubic-bezier(0.51, 0.04, 0.12, 0.99);
    text-align: center;
    cursor: pointer;
    position: absolute;
    transform: translateY(-10px);
  }
  
  .open .h1 {
    -webkit-transform: translateX(200px) translateZ(0) translateY(-10px);
    transform: translateX(200px) translateZ(0) translateY(-10px);
  }
  
  .h2 {
    color: #000;
    font-size: 20px;
    letter-spacing: -0.00933333em;
    font-weight: 600;
    padding-bottom: 15px;
  }
  
  .login-wrapper, .register-wrap {
    width: 600px;
    height: 350px;
    background-color: #fff;
    box-shadow: 0px 1px 10px #ffe0b3;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .register-wrap {
    height: 620px;
  }
  
  /* .login-left {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 770ms cubic-bezier(0.51, 0.04, 0.12, 0.99);
    overflow: hidden;
  } */
  
  /*.login-left img {
    display: block;
    transition: all 770ms cubic-bezier(0.51, 0.04, 0.12, 0.99);
    object-position: left;
  } */
  
  .open /*.login-left*/ img {
    -webkit-transform: translateX(210px) translateZ(0);
    transform: translateX(210px) translateZ(0);
  }
  
  .open /*.login-left*/ {
    -webkit-transform: translateX(-400px) translateZ(0);
    transform: translateX(-400px) translateZ(0);
  }
  
  .login-right {
    padding: 40px;
    /* position: absolute;
    top: 0;
    right: 0; */
    /* width: 400px;
    -webkit-transform: translateX(400px) translateZ(0);
    transform: translateX(400px) translateZ(0);
    transition: all 770ms cubic-bezier(0.51, 0.04, 0.12, 0.99); */
  }
  
  .open /*.login-right*/ {
    -webkit-transform: translateX(0px) translateZ(0);
    transform: translateX(0px) translateZ(0);
  }
  
  .checkbox-container {
    display: flex;
    margin-top: 35px;
  }
  
  .text-checkbox {
    color: #aaa;
    font-size: 16px;
    letter-spacing: -0.00933333em;
    font-weight: 300;
    margin-left: 15px;
  }
  
  input[type="checkbox"] {
    cursor: pointer;
    margin: 0;
    height: 22px;
    position: relative;
    width: 22px;
    /* -webkit-appearance: none; */
    transition: all 180ms linear;
  }
  
  input[type="checkbox"]:before {
    border: 1px solid #aaa;
    background-color: #fff;
    content: "";
    width: 20px;
    height: 20px;
    display: block;
    border-radius: 2px;
    transition: all 180ms linear;
  }
  
  input[type="checkbox"]:checked:before {
    background: linear-gradient(198.08deg, #22bf64 45.34%, #e281e7 224.21%);
    border: 1px solid #22bf64;
  }
  
  input[type="checkbox"]:after {
    content: "";
    border: 2px solid #fff;
    border-right: 0;
    border-top: 0;
    display: block;
    height: 4px;
    left: 4px;
    opacity: 0;
    position: absolute;
    top: 6px;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    width: 12px;
    transition: all 180ms linear;
  }
  
  input[type="checkbox"]:checked:after {
    opacity: 1;
  }
  
  .button-area {
    display: flex;
    justify-content: space-between;
    margin-top: 60px;
  }

  .button-area-register {
    display: flex;
    justify-content: space-between;
    margin-top: 70px;
  }
  
  .btn {
    font-family: inherit;
    /* -webkit-appearance: none; */
    /* -moz-appearance: none; */
    background-color: transparent;
    border: none;
    border-radius: 2px;
    height: 40px;
    display: flex;
    padding: 0 35px;
    cursor: pointer;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: -0.00933333em;
  }
  
  .btn-primary {
    color: #fff;
    background: linear-gradient(198.08deg, #22bf64 45.34%, #e281e7 224.21%);
    box-shadow: 0px 2px 10px orange;
    text-align: right;
  }
  
  .btn-primary:hover,
  .btn-primary:focus {
    color: #fff;
    background: linear-gradient(198.08deg, #1b984f 45.34%, #e281e7 224.21%);
  }
  
  .btn-secondary {
    color: #22bf64;
  }
  .btn-secondary:focus,
  .btn-secondary:hover {
    color: #1b984f;
  }
  </style>
  