import http from "../http-common";

class UsuariosService {
  buscarUsuario() {
    return http().get("/usuarios/meus-dados");
  }
  login(body) {
    return http().post("/usuarios/login", body);
  }
  criar(body) {
    return http().post("/usuarios/criar", body);
  }
  editar(body) {
    return http().put('/usuarios', body);
  }
  /* No front, usaremos esta rota no serviço de Usuários */
  async verificaAutenticacao() {
    return http().get('/autenticacao');
  }
}

export default new UsuariosService();
