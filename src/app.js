const express = require("express");
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
  }

  routes() {
    this.server.use(routes); // importa as rotas
  }
}

module.exports = new App().server;
