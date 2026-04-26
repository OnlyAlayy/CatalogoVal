const { body } = require('express-validator');

const loginValidator = [
  body('username')
    .notEmpty()
    .withMessage('El nombre de usuario es obligatorio')
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
];

module.exports = {
  loginValidator
};
