const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const { compare } = require('bcryptjs');

class SessionsController {
  async create(request, response) {
    const { email, password } = request.body;

    const user = await knex("users").where({ email }).first();

    if(!user) {
      throw new AppError("Email ou password inválidos");
    }

    const matchedPassword = compare(user.password, password); 

    if(!matchedPassword) {
      throw new AppError("Email ou password inválidos");
    }

    return response.json({ email, password });
  }
}

module.exports = SessionsController;