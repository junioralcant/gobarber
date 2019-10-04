const { object } = require("yup");
const { string } = require("yup");
const { ref } = require("yup");

const User = require("../models/User");

class UserController {
  async store(req, res) {
    //validação
    const schema = object().shape({
      name: string().required(),
      email: string()
        .email()
        .required(),
      password: string()
        .required()
        .min(6)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validação falhou" });
    }

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
    //validação
    const schema = object().shape({
      name: string(),
      email: string().email(),
      oldPassword: string().min(6),
      password: string()
        .min(6)
        .when("oldPassword", (oldPassword, field) => {
          // condicional para saber se oldPassword foi preenchida
          oldPassword ? field.required() : field;
        }),
      confirmPassword: string().when("password", (password, field) =>
        // ferifica se o campo de confirmação de senha corresponde
        password ? field.required().oneOf([ref("password")]) : field
      )
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validação falhou" });
    }

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
      return res.status(401).json({
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
