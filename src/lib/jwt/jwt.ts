import jwt from 'jsonwebtoken';

const JWT_ACCESS_TOKEN_SECRET: string =
  process.env.JWT_ACCESS_TOKEN_SECRET || 'minha_chave_secreta_super_segura_acesso';
const JWT_REFRESH_TOKEN_SECRET: string =
  process.env.JWT_REFRESH_TOKEN_SECRET || 'minha_chave_secreta_super_segura_refresh';

export const generateAccessToken = (payload: number | null): string => {
  if (!payload) {
    throw new Error('Payload não pode ser nulo');
  }

  return jwt.sign({ data: payload }, JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15min' });
};

export const generateRefreshToken = (payload: number | null): string => {
  if (!payload) {
    throw new Error('Payload não pode ser nulo');
  }

  return jwt.sign({ data: payload }, JWT_REFRESH_TOKEN_SECRET, { expiresIn: '90d' });
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  } catch (error) {
    console.error('Erro ao verificar token JWT:', error);
    throw new Error('Token inválido ou expirado');
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
  } catch (error) {
    console.error('Erro ao verificar refresh token:', error);
    throw new Error('Refresh token inválido ou expirado');
  }
};

export const decodeAccessToken = (token: string) => {
  return jwt.decode(token);
};
