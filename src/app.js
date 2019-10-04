const express = require("express");
const path = require("path");
const routes = require("./routes");

require("./databese"); // importa a conexão com bd,

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json()); // informa que ira retornar dados em json
    // faz com que a rota /files tenha acesso a pasta uploads sem autenticação
    this.server.use(
      "/files",
      express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
    );
  }

  routes() {
    this.server.use(routes); // importa as rotas
  }
}

module.exports = new App().server;
