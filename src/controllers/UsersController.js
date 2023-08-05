const { hash, compare } = require("bcryptjs");
const AppError = require('../utils/AppError');
const knex = require('../database/knex');

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body

    if (!name) {
      throw new AppError('O nome é obrigatório');
    }

    const userExists = await knex("users").select(["*"]).where("users.email", email)
    if (userExists.length > 0) {
      throw new AppError('Este email já está em uso!');
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({ name, email, password: hashedPassword });

    return response.json({ name, email, password: hashedPassword });
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const [user] = await knex("users").select("*").where({ id: user_id });

    if (!user) {
      throw new AppError("Usuário não encontrado.");
    }

    const [userWithUpdatedEmail] = await knex("users").select("*").where({ email: email });

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {      
      throw new AppError("Este email já está em uso.");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga.");
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("Senha antiga não confere.");
      }

      user.password = await hash(password, 8);
    }

    await knex("users").update({
      name: user.name,
      email: user.email,
      password: user.password,
      updated_at: knex.fn.now()
    })
    .where({ id: user.id});

    return response.json();
  }
}

module.exports = UsersController;