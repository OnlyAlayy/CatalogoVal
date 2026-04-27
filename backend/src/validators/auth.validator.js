const { body } = require('express-validator');

const loginValidator = [
  body('username')
    .isString()
    .withMessage('El nombre de usuario debe ser texto')
    .notEmpty()
    .withMessage('El nombre de usuario es obligatorio')
    .trim(),
  body('password')
    .isString()
    .withMessage('La contraseña debe ser texto')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
];

module.exports = {
  loginValidator
};
