const { object } = require("yup");
const { number } = require("yup");
const yup = require("yup");

const User = require("../models/User");
const Appointment = require("../models/Appointment");

class AppointmentController {
  async store(req, res) {
    //validação
    const schema = yup.object().shape({
      provider_id: yup.number().required(),
      date: yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validação falhou" });
    }

    const { provider_id, date } = req.body;

    // Verifica se o provider_id é um provedor
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    });

    if (!isProvider) {
      return res.status(401).json({
        error: "Você só pode criar agendamento com um provedor"
      });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date
    });

    return res.json(appointment);
  }
}

module.exports = new AppointmentController();
