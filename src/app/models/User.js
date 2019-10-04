const Sequelize = require("sequelize");
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // o VIRTUAL informa que esse campo não ira ser criado no bd
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN
      },
      {
        sequelize
      }
    );

    this.addHook("beforeSave", async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8); // criptografa o passwod e add ao password_hash
      }
    });

    return this;
  }

  // associa o id da imagem no campo avatar_id
  static associate(models) {
    this.belongsTo(models.File, { foreignKey: "avatar_id" });
  }

  checkPassword(password) {
    // compara a senha informada com a do bd
    return bcrypt.compare(password, this.password_hash);
  }
}

module.exports = User;
