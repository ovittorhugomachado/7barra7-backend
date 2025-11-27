import { prisma } from "../../lib/prisma/prisma";

export const testAuthenticateJwtService = async (userId: number) => {
  const user = await prisma.user.findMany({ where: { id: userId } });
  return user;
};

export const loginService = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({ where: { email, password } });

  if (!user) {
    return null;
  }

  // const isPasswordValid = await bcrypt.compare(password, user.password);

  // if (!isPasswordValid) {
  //     return null;
  // }

  return { userId: user.id, userName: user.name, userEmail: user.email };
};
