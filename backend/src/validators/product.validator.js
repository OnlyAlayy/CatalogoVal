const { body } = require('express-validator');

const productValidator = [
  body('name')
    .notEmpty()
    .withMessage('El nombre del producto es obligatorio')
    .trim(),
  body('category')
    .notEmpty()
    .withMessage('La categoría es obligatoria'),
  body('price')
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('El precio debe ser un número'),
  body('variants')
    .optional()
    .isArray()
    .withMessage('Las variantes deben ser un arreglo'),
  body('advanceHours')
    .optional()
    .isNumeric()
    .withMessage('Las horas de anticipación deben ser un número')
];

module.exports = {
  productValidator
};
