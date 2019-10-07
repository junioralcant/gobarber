const Sequileze = require("sequelize");
const mongoose = require("mongoose");

const User = require("../app/models/User");
const File = require("../app/models/File");
const Appointment = require("../app/models/Appointment");

const dataBaseConfig = require("../config/database");

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequileze(dataBaseConfig); // conexão com bd

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models)); // executa o metodo associate se o mesmo existir em algum model
  }

  // conexão com mongodb
  mongo() {
    this.mongoConnection = mongoose.connect(
      "mongodb://localhost:27017/gobarber",
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true
      }
    );
  }
}

module.exports = new Database();
