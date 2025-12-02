import { UnauthorizedError } from '../../utils/error-handler';
import { generateTokensPassword } from '../../utils/token-generator';
import { prisma } from '../../lib/prisma/prisma';
import bcrypt from 'bcrypt';

export const loginService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError('Email ou senha inválidos');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new UnauthorizedError('Email ou senha inválidos');
  }

  const payload = {
    userId: user.id,
  };

  const { accessToken7barra7, refreshAccessToken7barra7 } = generateTokensPassword(payload);

  await prisma.refreshToken.deleteMany({
    where: {
      userId: user.id,
      expiresAt: { lt: new Date() },
    },
  });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshAccessToken7barra7,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken7barra7, refreshAccessToken7barra7 };
};

export const logouService = async (refreshToken: string) => {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
};
