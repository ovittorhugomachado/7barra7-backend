import { encryptPassword } from '../../lib/bcrypt/bcrypt';
import { prisma } from '../../lib/prisma/prisma';
import { UserData } from '../../types/user-data';
import { ValidationError } from '../../utils/error-handler';
import { sendNotificationFunction } from '../../utils/notification-sender';
import { stripNonDigits } from '../../utils/strip-formating';
import { confirmEmailTokenGenerator } from '../../utils/token-generator';

export const createUserService = async (data: UserData) => {
  if (!data.email.includes('@')) throw new ValidationError('Email inválido');
  if (data.password.length < 8) throw new ValidationError('Senha fraca');
  if (data.password.length > 72) throw new ValidationError('Senha muito longa');
  if (!/[A-Z]/.test(data.password)) throw new ValidationError('Senha sem letra maiúscula');
  if (!/[0-9]/.test(data.password)) throw new ValidationError('Senha sem número');

  const rawPhoneNumber = stripNonDigits(data.phone);

  const existingEmailUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingEmailUser) throw new ValidationError('Email já cadastrado');

  const existingPhoneUser = await prisma.user.findUnique({ where: { phone: rawPhoneNumber } });
  if (existingPhoneUser) throw new ValidationError('Celular já cadastrado');

  const hashedPassword = await encryptPassword(data.password);

  const { activeEmailToken } = confirmEmailTokenGenerator({ email: data.email });

  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      cpf: data.cpf,
      email: data.email,
      phone: rawPhoneNumber,
      password: hashedPassword,
      role: data.role,
      isActive: data.isActive,
      updatedAt: new Date(),
      emailConfirmationToken: activeEmailToken,
      emailConfirmationSentAt: new Date(),
    },
  });

  await sendNotificationFunction({
    userId: 1,
    tag: 'AWARD',
    title: 'Bem-vindo!',
    text: 'Você deu o passo mais importante para uma vida mais saudável',
  });

  return newUser;
};

export const getUserDataByIdService = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      cpf: true,
      phone: true,
      email: true,
      emailConfirmed: true,
      createdAt: true,
    },
  });

  if (!user) throw new ValidationError('Usuário não encontrado');

  return user;
};

export const updateUserService = async (userId: number, data: Partial<UserData>) => {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    throw new ValidationError('Usuário não encontrado');
  }

  if (data.email) {
    const existingEmailUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingEmailUser && existingEmailUser.id !== userId) {
      throw new ValidationError('Email já cadastrado');
    }
  }

  if (data.phone) {
    const rawPhoneNumber = stripNonDigits(data.phone);
    const existingPhoneUser = await prisma.user.findUnique({ where: { phone: rawPhoneNumber } });
    if (existingPhoneUser && existingPhoneUser.id !== userId) {
      throw new ValidationError('Celular já cadastrado');
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name || existingUser.name,
      cpf: data.cpf || existingUser.cpf,
      email: data.email || existingUser.email,
      phone: data.phone ? stripNonDigits(data.phone) : existingUser.phone,
      updatedAt: new Date(),
    },
    select: {
      id: true,
      name: true,
      cpf: true,
      email: true,
      phone: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};
