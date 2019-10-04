const Sequelize = require("sequelize");
const { Model } = require("sequelize");

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          // retorna o avatar para o frontend
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3333/files/${this.path}`;
          }
        }
      },
      {
        sequelize
      }
    );
    return this;
  }
}

module.exports = File;
