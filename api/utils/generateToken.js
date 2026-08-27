import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'bookcart_default_jwt_secret_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

export default generateToken;
