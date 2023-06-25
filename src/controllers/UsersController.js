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

    await knex("users").insert({ name, email, password });

    response.json({ name, email, password });
  }
}

module.exports = UsersController;