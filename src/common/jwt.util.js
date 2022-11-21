import jwt from 'jsonwebtoken';

const secret = 'top-secret';

export const generateToken = payload => new Promise((resolve, reject) => {
  jwt.sign(payload, secret, { expiresIn: '1h' }, (error, token) => {
    if (error) {
      return reject(error);
    }
    resolve(token);
  });
});

export const checkToken = token => new Promise((resolve, reject) => {
  jwt.verify(token, secret, (error, token) => {
    if (error) {
      return reject(error);
    }
    resolve(token);
  });
});
