const { Router } = require("express");

const routes = new Router();

routes.get("/", (req, resp) => {
  return resp.json({ message: "Ola Mundo" });
});

module.exports = routes;
