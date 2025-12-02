import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_TOKEN_SECRET || 'jwt_seguro_para_teste_local_1234';

const JWT_REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_TOKEN_SECRET || 'jwt_seguro_para_teste_local_1234';

export interface JwtPayloadData {
  userId: number;
}

export const generateAccessToken = (payload: JwtPayloadData | null) => {
  if (!payload) {
    throw new Error('Payload não pode ser nulo');
  }

  return jwt.sign({ data: payload }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (payload: JwtPayloadData | null) => {
  if (!payload) {
    throw new Error('Payload não pode ser nulo');
  }

  console.log('ACCESS TOKEN SECRET:', JWT_ACCESS_TOKEN_SECRET);
  console.log('REFRESH TOKEN SECRET:', JWT_REFRESH_TOKEN_SECRET);

  return jwt.sign({ data: payload }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: '90d',
  });
};

export const verifyAccessToken = (token: string): JwtPayload & { data: JwtPayloadData } => {
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
    if (typeof decoded === 'string') {
      throw new Error('Token inválido ou expirado');
    }
    return decoded as JwtPayload & { data: JwtPayloadData };
  } catch (error) {
    console.error('Erro ao verificar token JWT:', error);
    throw new Error('Token inválido ou expirado');
  }
};

export const verifyRefreshToken = (token: string): JwtPayload & { data: JwtPayloadData } => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
    if (typeof decoded === 'string') {
      throw new Error('Refresh token inválido ou expirado');
    }
    return decoded as JwtPayload & { data: JwtPayloadData };
  } catch (error) {
    console.error('Erro ao verificar refresh token:', error);
    throw new Error('Refresh token inválido ou expirado');
  }
};

export const decodeAccessToken = (token: string) => {
  return jwt.decode(token) as (JwtPayload & { data: JwtPayloadData }) | null;
};
