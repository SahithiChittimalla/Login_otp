const jwt = require('jsonwebtoken');
const SECRET = '4c99fdd54f6dffb9c3db7f4d6b4a4a6ab2e7fda8a63ab4e597b0f90f290bc4a6'; // Use env vars in production

exports.generateToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
};
