const Admin = require('../models/Admin.model');
const generateToken = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (admin && (await admin.comparePassword(password))) {
      admin.lastLogin = Date.now();
      await admin.save();

      sendSuccess(res, {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email
        },
        token: generateToken(admin._id)
      });
    } else {
      sendError(res, 'Credenciales inválidas', 401);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (admin) {
      sendSuccess(res, admin);
    } else {
      sendError(res, 'Administrador no encontrado', 404);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getMe
};
