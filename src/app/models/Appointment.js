const Sequelize = require("sequelize");
const { Model } = require("sequelize");

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE
      },
      {
        sequelize
      }
    );
    return this;
  }

  // relacionamentos, dois relacionamentos com a mesma tabela
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.belongsTo(models.User, { foreignKey: "provider_id", as: "provider" });
  }
}

module.exports = Appointment;
