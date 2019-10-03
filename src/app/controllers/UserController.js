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

    const { id, name, email, provider } = await User.create(req.body); //retorna só os dados informados, poderia retornar todos os dados do bd atribuindo eles a uma variável

    return res.json({
      id,
      name,
      email,
      provider
    });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId); // busca o usuário pa PK

    if (email != user.email) {
      const userExists = await User.findOne({ where: { email } }); // verifica se o email informado já existe no bd

      if (userExists) {
        return res
          .status(400)
          .json({ error: "Endereço de e-mail não encontrado." });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res
        .status(401)
        .json({
          error: "A senha informada não corresponde com a antiga senha"
        });
    }
    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider
    });
  }
}

module.exports = new UserController();
