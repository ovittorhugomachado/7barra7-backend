import { Request, Response } from 'express';
import { loginService, testAuthenticateJwtService } from './tests.service';
import { generateAccessToken, generateRefreshToken } from '../../lib/jwt/jwt';

export const testAuthenticateJwtController = async (req: Request, res: Response) => {
  const userId = req.body;
  const user = await testAuthenticateJwtService(userId);

  return res.json({ user });
};

export const loginController = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await loginService(email, password);

  if (!user) {
    return res.status(401).json({ message: 'Email ou senha inválidos' });
  }

  const accessToken = generateAccessToken(user.userId);
  const refreshToken = generateRefreshToken(user.userId);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 dias
  });

  return res.json({
    message: 'Login realizado com sucesso',
    user,
    accessToken,
  });
};
