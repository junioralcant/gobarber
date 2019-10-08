const Notification = require("../Schema/Notification");
const User = require("../models/User");

class NotificationController {
  async index(req, res) {
    // verifica se o usuario logado é um provedor
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true }
    });

    if (!checkIsProvider) {
      return res.status(400).json({
        error: "Apénas provedores de serviço podem ver as notificações"
      });
    }

    const notification = await Notification.find({
      user: req.userId
    })
      .sort({ createdAt: "desc" })
      .limit(20);

    return res.json(notification);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

module.exports = new NotificationController();
