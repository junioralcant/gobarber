const express = require("express");
const path = require("path");
const Sentry = require("@sentry/node");
const Youch = require("youch");
require("express-async-errors"); // permite que o express capti erros async

const sentryConfig = require("./config/sentry");
const routes = require("./routes");

require("./databese"); // importa a conexão com bd,

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json()); // informa que ira retornar dados em json
    // faz com que a rota /files tenha acesso a pasta uploads sem autenticação
    this.server.use(
      "/files",
      express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
    );
  }

  routes() {
    this.server.use(routes); // importa as rotas
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();

      return res.status(500).json(errors);
    });
  }
}

module.exports = new App().server;
