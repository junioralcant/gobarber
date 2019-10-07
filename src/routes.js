const { Router } = require("express");
const multer = require("multer");
const multerConfig = require("./config/multer");

const UserController = require("./app/controllers/UserController");
const SessionController = require("./app/controllers/SessionController");
const FileController = require("./app/controllers/FileController");
const ProviderController = require("./app/controllers/ProviderController");
const AppointmentController = require("./app/controllers/AppointmentController");

const authMiddleware = require("./app/middleware/auth");

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);

routes.post("/users", UserController.store);
routes.put("/users", UserController.update);

routes.get("/providers", ProviderController.index);

routes.post("/appointments", AppointmentController.store);

routes.post("/files", upload.single("file"), FileController.store);

module.exports = routes;
