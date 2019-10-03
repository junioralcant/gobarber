const Sequileze = require("sequelize");

const User = require("../app/models/User");

const dataBaseConfig = require("../config/database");

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequileze(dataBaseConfig); // conexão com bd

    models.map(model => model.init(this.connection));
  }
}

module.exports = new Database();
