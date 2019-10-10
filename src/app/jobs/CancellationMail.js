const { format } = require("date-fns");
const { parseISO } = require("date-fns");

const pt = require("date-fns/locale/pt");
const Mail = require("../../lib/Mail");

class CancellationMail {
  get key() {
    return "CancellationMail";
  }

  async handle({ data }) {
    const { appointment } = data;

    console.log("A fila executou");

    await Mail.sedMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: "Agendamento cancelado",
      template: "cancellation", // nome do tamplate
      context: {
        // variáveis que seram eviadas para o tamplate
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          // formatando a data
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'", // dia 08 de outubro, às 13:00h
          { locale: pt }
        )
      }
    });
  }
}

module.exports = new CancellationMail();
