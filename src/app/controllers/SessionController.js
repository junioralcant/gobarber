const jwt = require("jsonwebtoken");
const { object } = require("yup");
const { string } = require("yup");

const User = require("../models/User");
const authConfig = require("../../config/auth");

class SessionController {
  async store(req, res) {
    //validação
    const schema = object().shape({
      email: string()
        .email()
        .required(),
      password: string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validação falhou" });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrato" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ erro: "Senha inválida" });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    });
  }
}

module.exports = new SessionController();
