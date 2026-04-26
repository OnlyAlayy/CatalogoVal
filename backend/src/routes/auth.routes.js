const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { loginValidator } = require('../validators/auth.validator');

router.post('/login', loginValidator, validate, login);
router.get('/me', protect, getMe);

module.exports = router;
