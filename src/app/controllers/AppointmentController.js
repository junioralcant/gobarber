const Yup = require("yup");
const { startOfHour } = require("date-fns");
const { parseISO } = require("date-fns");
const { isBefore } = require("date-fns");
const { format } = require("date-fns");
const { subHours } = require("date-fns");
const pt = require("date-fns/locale/pt");

const User = require("../models/User");
const Appointment = require("../models/Appointment");
const File = require("../models/File");
const Notification = require("../Schema/Notification");
const Mail = require("../../lib/Mail");

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null
      },
      order: ["date"], // ordena a listagem por data
      attributes: ["id", "date"],
      limit: 20, // limite de registro por página
      offset: (page - 1) * 20, // para ir para a próxima página
      include: [
        // listagem dos relacionamentos
        {
          model: User, // mostra os dados do provedor
          as: "provider",
          attributes: ["id", "name"],
          include: [
            {
              model: File, // mostra os dados do avatar
              as: "avatar",
              attributes: ["id", "path", "url"]
            }
          ]
        }
      ]
    });

    return res.json(appointments);
  }

  async store(req, res) {
    //validação
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
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

    // verificação para não permitir que o provedor marque agendamendo com ele mesmo
    if (provider_id == req.userId) {
      return res.status(400).json({
        error: "O provedor não pode marcar um agendamento consigo mesmo"
      });
    }

    const hourStart = startOfHour(parseISO(date));

    // verifica se a data informada é menor que a do dia atual
    if (isBefore(hourStart, new Date())) {
      return res
        .status(400)
        .json({ error: "Datas passadas não são permitidas" });
    }

    // checa se há algum agendamento na quele mesmo horário
    const checekAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    });

    if (checekAvailability) {
      return res
        .status(400)
        .json({ error: "Já existe um agendamento para esse mesmo horário" });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date
    });

    // Notifica prestador de serviço se a um novo agendamento
    const user = await User.findByPk(req.userId); // recupera o usuário logado
    const formatedDate = format(
      // formatando a data
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'", // dia 08 de outubro, às 13:00h
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formatedDate} `,
      user: provider_id
    });

    return res.json(appointment);
  }

  // Cancela o agendamento
  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        // inclui os dados do provedor
        {
          model: User,
          as: "provider",
          attributes: ["name", "email"]
        }
      ]
    });

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "Você não tem permissão para cancelar o agendamento."
      });
    }

    // remove 2 horas do horário do agendamento, agendamento só pode ser cancelado com no máximo 2 horas antes
    const dateWithSub = subHours(appointment.date, 2);

    //verifica se a data do cancelamento é antes da data atual
    if (isBefore(dateWithSub, new Date())) {
      return res
        .status(401)
        .json(
          "Você só pode cancelar o agendamento com no máximo 2 horas antes."
        );
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Mail.sedMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: "Agendamento cancelado",
      text: "Você tem um novo cancelamento"
    });

    return res.json(appointment);
  }
}

module.exports = new AppointmentController();
