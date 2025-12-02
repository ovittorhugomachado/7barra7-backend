import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_TOKEN_SECRET || 'minha_chave_secreta_super_segura_acesso';

const JWT_REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_TOKEN_SECRET || 'minha_chave_secreta_super_segura_refresh';

export interface JwtPayloadData {
  userId: number;
}

export const generateAccessToken = (payload: JwtPayloadData) => {
  return jwt.sign({ data: payload }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (payload: JwtPayloadData) => {
  return jwt.sign({ data: payload }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: '90d',
  });
};

export const verifyAccessToken = (token: string): JwtPayload & { data: JwtPayloadData } => {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);

  if (typeof decoded === 'string') {
    throw new Error('Token inválido');
  }

  return decoded as JwtPayload & { data: JwtPayloadData };
};

export const verifyRefreshToken = (token: string): JwtPayload & { data: JwtPayloadData } => {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);

  if (typeof decoded === 'string') {
    throw new Error('Refresh token inválido');
  }

  return decoded as JwtPayload & { data: JwtPayloadData };
};

export const decodeAccessToken = (token: string) => {
  return jwt.decode(token) as (JwtPayload & { data: JwtPayloadData }) | null;
};
