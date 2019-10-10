const { startOfDay } = require("date-fns");
const { endOfDay } = require("date-fns");
const { setHours } = require("date-fns");
const { setMinutes } = require("date-fns");
const { setSeconds } = require("date-fns");
const { format } = require("date-fns");
const { isAfter } = require("date-fns");

const { Op } = require("sequelize");

const Appointment = require("../models/Appointment");
class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Invalid date" });
    }

    const searchDate = Number(date);

    // retorna os agendamentos do provedor informado
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)]
        }
      }
    });

    // horários
    const schedule = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00"
    ];

    // formata a data, zera os minutos e os segundos
    const avaiable = schedule.map(time => {
      const [hour, minute] = time.split(":");
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxx"), // formata para 2019-10-08T00:00:00-03:00
        avaiable:
          isAfter(value, new Date()) && // verifca se a data é maior que a data atual
          !appointments.find(a => format(a.date, "HH:mm") == time) // formata para data e minuto e verifica se os agendamentos não estão dentro de appointments
      };
    });
    return res.json(avaiable);
  }
}

module.exports = new AvailableController();
