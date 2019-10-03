const User = require("../models/User");

class UserController {
  async store(req, res) {
    const UserExists = await User.findOne({ where: { email: req.body.email } }); // verifica se o email informado já existe no bd

    if (UserExists) {
      return res
        .status(400)
        .json({ error: "Endereço de e-mail já existente." });
    }

    console.log(req.body);

    const { id, name, email, password_hash } = await User.create(req.body); //retorna só os dados informados, poderia retornar todos os dados do bd atribuindo eles a uma variável

    return res.json({
      id,
      name,
      email,
      password_hash
    });
  }
}

module.exports = new UserController();
