const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.model');
const { sendError } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.admin = await Admin.findById(decoded.id).select('-password');
      
      if (!req.admin) {
        return sendError(res, 'No autorizado, usuario no encontrado', 401);
      }

      next();
    } catch (error) {
      console.error(error);
      return sendError(res, 'No autorizado, token falló', 401);
    }
  }

  if (!token) {
    return sendError(res, 'No autorizado, no hay token', 401);
  }
};

module.exports = { protect };
