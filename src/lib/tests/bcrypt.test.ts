import bcrypt from 'bcrypt';
import { encryptPassword, comparePassword } from '../bcrypt';

jest.mock('bcrypt');

describe('Bcrypt Helper', () => {
  const mockPassword = 'minhaSenha123';
  const mockHash = '$2b$12$hashedPassword123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  //TESTE CRIPTOGRAFIA SENHA------------------------------
  describe('encryptPassword', () => {
    it('deve criptografar a senha com sucesso', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

      const result = await encryptPassword(mockPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 12);
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockHash);
    });

    it('deve lançar erro quando a criptografia falhar', async () => {
      const mockError = new Error('Falha na criptografia');
      (bcrypt.hash as jest.Mock).mockRejectedValue(mockError);

      await expect(encryptPassword(mockPassword)).rejects.toThrow('Falha na criptografia');
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 12);
    });

    it('deve criptografar senhas diferentes com hashes diferentes', async () => {
      const password1 = 'senha1';
      const password2 = 'senha2';
      const hash1 = 'hash1';
      const hash2 = 'hash2';

      (bcrypt.hash as jest.Mock)
        .mockResolvedValueOnce(hash1)
        .mockResolvedValueOnce(hash2);

      const result1 = await encryptPassword(password1);
      const result2 = await encryptPassword(password2);

      expect(result1).toBe(hash1);
      expect(result2).toBe(hash2);
      expect(result1).not.toBe(result2);
    });
  });

  //TESTE COMPARAÇÃO SENHA COM HASH------------------------
  describe('comparePassword', () => {
    it('deve retornar true para senha e hash correspondentes', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await comparePassword(mockPassword, mockHash);

      expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHash);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('deve retornar false para senha e hash não correspondentes', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await comparePassword('senhaErrada', mockHash);

      expect(bcrypt.compare).toHaveBeenCalledWith('senhaErrada', mockHash);
      expect(result).toBe(false);
    });

    it('deve lançar erro quando a comparação falhar', async () => {
      const mockError = new Error('Falha na comparação');
      (bcrypt.compare as jest.Mock).mockRejectedValue(mockError);

      await expect(comparePassword(mockPassword, mockHash))
        .rejects.toThrow('Falha na comparação');
    });

    it('deve comparar corretamente com hash gerado pelo encryptPassword', async () => {
      const originalPassword = 'senhaOriginal';
      const generatedHash = 'hashGerado';
      
      (bcrypt.hash as jest.Mock).mockResolvedValue(generatedHash);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const hash = await encryptPassword(originalPassword);
      const isValid = await comparePassword(originalPassword, hash);

      expect(hash).toBe(generatedHash);
      expect(isValid).toBe(true);
      expect(bcrypt.hash).toHaveBeenCalledWith(originalPassword, 12);
      expect(bcrypt.compare).toHaveBeenCalledWith(originalPassword, generatedHash);
    });
  });
});