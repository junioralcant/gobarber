const Sequelize = require("sequelize");
const { Model } = require("sequelize");
const { isBefore } = require("date-fns");
const { subHours } = require("date-fns");

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          // retorna se a data e horário já passaram
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date()); // verifica de a dada é antes da dada atual,  se a data tiver passado vai retornar true
          }
        },
        cancelable: {
          // retorna se o agendamento pode ser cancelado ou não
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2)); // verifica se data atual é menor que data do agendamento, tirando 2 horas da data do agendamento
          }
        }
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
