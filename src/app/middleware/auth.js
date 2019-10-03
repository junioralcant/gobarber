const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const authConfig = require("../../config/auth");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não enviado" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id; // cria uma variável no meu req e adiciona o id

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
