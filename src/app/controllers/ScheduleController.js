const { startOfDay } = require("date-fns");
const { endOfDay } = require("date-fns");
const { parseISO } = require("date-fns");

const { Op } = require("sequelize");

const User = require("../models/User");
const Appointment = require("../models/Appointment");

class ScheduleController {
  async index(req, res) {
    // retorna os usuário logados que sejam provedor
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true }
    });

    if (!checkUserProvider) {
      return res.status(400).json({ error: "O usuário não é um provedor" });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    // retornar os agendamentos da data informada
    const appointment = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          // query para listar os agendamentos do início do dia ao final
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)]
        }
      },
      order: ["date"]
    });

    return res.json(appointment);
  }
}

module.exports = new ScheduleController();
