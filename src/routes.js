const { Router } = require("express");
const multer = require("multer");
const multerConfig = require("./config/multer");

const UserController = require("./app/controllers/UserController");
const SessionController = require("./app/controllers/SessionController");
const FileController = require("./app/controllers/FileController");

const authMiddleware = require("./app/middleware/auth");

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);

routes.post("/users", UserController.store);
routes.put("/users", UserController.update);

routes.post("/files", upload.single("file"), FileController.store);

module.exports = routes;
