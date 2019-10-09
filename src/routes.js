const { Router } = require("express");
const multer = require("multer");
const multerConfig = require("./config/multer");

const UserController = require("./app/controllers/UserController");
const SessionController = require("./app/controllers/SessionController");
const FileController = require("./app/controllers/FileController");
const ProviderController = require("./app/controllers/ProviderController");
const AppointmentController = require("./app/controllers/AppointmentController");
const ScheduleController = require("./app/controllers/ScheduleController");
const NotificationController = require("./app/controllers/NotificationController");

const authMiddleware = require("./app/middleware/auth");

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/sessions", SessionController.store);
routes.post("/users", UserController.store);

routes.use(authMiddleware);

routes.put("/users", UserController.update);

routes.get("/providers", ProviderController.index);

routes.get("/appointments", AppointmentController.index);
routes.post("/appointments", AppointmentController.store);
routes.delete("/appointments/:id", AppointmentController.delete);

routes.get("/notifications", NotificationController.index);
routes.put("/notifications/:id", NotificationController.update);

routes.get("/schedules", ScheduleController.index);

routes.post("/files", upload.single("file"), FileController.store);

module.exports = routes;
