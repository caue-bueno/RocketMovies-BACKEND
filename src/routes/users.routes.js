const { Router } = require('express');
const UsersController = require('../controllers/UsersController');
const usersRoutes = Router();
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

const usersController = new UsersController();

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);

module.exports = usersRoutes;