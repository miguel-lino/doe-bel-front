import http from "../http-common";

class AnuncioService {
  buscarTodos() {
    return http().get("/anuncios");
  }
  criarAnuncio(body) {
    return http().post("/anuncios/criar", body);
  }
  buscarAnunciosUsuario() {
    return http().get(`/anuncios/minhas-doacoes`);
  }
  excluirAnuncio(id) {
    return http().delete(`/anuncios/${id}`);
  }
  editarAnuncio(id, body) {
    return http().put(`/anuncios/${id}`, body);
  }
}

export default new AnuncioService();
