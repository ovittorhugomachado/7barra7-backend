import { Request, Response, NextFunction } from 'express';
import { generateAccessToken, verifyRefreshToken, verifyAccessToken } from '../lib/jwt/jwt';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers['authorization']?.split(' ')[1] || null;
  const refreshToken = req.cookies?.refreshToken || null;

  if (accessToken) {
    try {
      const decoded = verifyAccessToken(accessToken);

      req.user = decoded.data;
      return next();
    } catch (error) {
      console.log('Access token expirado. Tentando usar refresh...', error);
    }
  }

  if (refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      const newAccessToken = generateAccessToken(decoded.data);

      res.setHeader('Authorization', `Bearer ${newAccessToken}`);

      req.user = decoded.data;

      return next();
    } catch (error) {
      console.log('Refresh token inválido ou expirado.', error);
    }
  }

  return res.status(401).json({ message: 'Não autorizado. Tokens inválidos ou ausentes.' });
};
