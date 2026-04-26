const { body } = require('express-validator');

const categoryValidator = [
  body('name')
    .notEmpty()
    .withMessage('El nombre de la categoría es obligatorio')
    .trim()
    .isLength({ max: 50 })
    .withMessage('El nombre no puede superar los 50 caracteres'),
  body('description')
    .optional()
    .trim(),
  body('emoji')
    .optional()
    .trim(),
  body('order')
    .optional()
    .isNumeric()
    .withMessage('El orden debe ser un número')
];

module.exports = {
  categoryValidator
};
