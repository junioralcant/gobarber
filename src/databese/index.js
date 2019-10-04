const Sequileze = require("sequelize");

const User = require("../app/models/User");
const File = require("../app/models/File");

const dataBaseConfig = require("../config/database");

const models = [User, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequileze(dataBaseConfig); // conexão com bd

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models)); // executa o metodo associate se o mesmo existir em algum model
  }
}

module.exports = new Database();
