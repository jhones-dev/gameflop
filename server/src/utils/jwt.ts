import jwt from 'jsonwebtoken';

type JwtArgs = { subject: number | string; payload: object };

const isDevelopment = process.env.NODE_ENV === 'development';
const secretOrPrivateKey = isDevelopment
  ? process.env.JWT_SECRET_DEV
  : process.env.JWT_SECRET_PROD;

export const generateJwt = ({ subject, ...payload }: JwtArgs) => {
  if (!secretOrPrivateKey) return;

  return jwt.sign(payload, secretOrPrivateKey, {
    subject: String(subject),
    expiresIn: '1h',
  });
};

export const verifyJwt = (token: string) => {
  if (!secretOrPrivateKey || !token) return;

  return jwt.verify(token, secretOrPrivateKey);
};
