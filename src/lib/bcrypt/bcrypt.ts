import bcrypt from 'bcrypt';

type EncryptPassword = (password: string) => Promise<string>;
type ComparePassword = (password: string, hash: string) => Promise<boolean>;

export const encryptPassword: EncryptPassword = async (password) => {
  return bcrypt.hash(password, 12);
};

export const comparePassword: ComparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
