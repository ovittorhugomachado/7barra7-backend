import { generateAccessToken, generateRefreshToken } from '../lib/jwt/jwt';
import { Request, Response, Router } from 'express';

const router = Router();

router.post('/test-jwt', (req: Request, res: Response) => {
  const userId = 123;

  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 90 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    accessToken,
  });
});

export const testJwtRoutes = router;
