import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeAccessToken,
  JwtPayloadData,
} from './jwt';

jest.mock('jsonwebtoken');

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('JWT Helper', () => {
  const mockUserId: JwtPayloadData = { userId: 123 };;
  const mockAccessToken = 'mock.access.token';
  const mockRefreshToken = 'mock.refresh.token';

  const mockAccessSecret = 'jwt_seguro_para_teste_local_1234';
  const mockRefreshSecret = 'jwt_seguro_para_teste_local_1234';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  describe('generateAccessToken', () => {
    it('deve gerar access token com sucesso', () => {
      (jwt.sign as jest.Mock).mockReturnValue(mockAccessToken);

      const result = generateAccessToken(mockUserId);

      expect(jwt.sign).toHaveBeenCalledWith({ data: mockUserId }, mockAccessSecret, {
        expiresIn: '15m',
      });
      expect(result).toBe(mockAccessToken);
    });

    it('deve lançar erro quando payload for nulo', () => {
      expect(() => generateAccessToken(null)).toThrow('Payload não pode ser nulo');
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('deve usar secret válido', () => {
      (jwt.sign as jest.Mock).mockReturnValue(mockAccessToken);

      generateAccessToken(mockUserId);

      expect(jwt.sign).toHaveBeenCalledWith({ data: mockUserId }, expect.any(String), {
        expiresIn: '15m',
      });
    });
  });

  describe('generateRefreshToken', () => {
    it('deve gerar refresh token com sucesso', () => {
      (jwt.sign as jest.Mock).mockReturnValue(mockRefreshToken);

      const result = generateRefreshToken(mockUserId);

      expect(jwt.sign).toHaveBeenCalledWith({ data: mockUserId }, mockRefreshSecret, {
        expiresIn: '90d',
      });
      expect(result).toBe(mockRefreshToken);
    });

    it('deve lançar erro quando payload for nulo', () => {
      expect(() => generateRefreshToken(null)).toThrow('Payload não pode ser nulo');
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });

  describe('verifyAccessToken', () => {
    it('deve verificar access token com sucesso', () => {
      const mockDecoded = { data: mockUserId, iat: 123, exp: 456 };
      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const result = verifyAccessToken(mockAccessToken);

      expect(jwt.verify).toHaveBeenCalledWith(mockAccessToken, mockAccessSecret);
      expect(result).toEqual(mockDecoded);
    });

    it('deve lançar erro quando token for inválido', () => {
      const mockError = new Error('Token inválido');
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw mockError;
      });

      expect(() => verifyAccessToken('token.invalido')).toThrow('Token inválido ou expirado');

      expect(console.error).toHaveBeenCalledWith('Erro ao verificar token JWT:', mockError);
    });
  });

  describe('verifyRefreshToken', () => {
    it('deve verificar refresh token com sucesso', () => {
      const mockDecoded = { data: mockUserId, iat: 123, exp: 456 };
      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const result = verifyRefreshToken(mockRefreshToken);

      expect(jwt.verify).toHaveBeenCalledWith(mockRefreshToken, mockRefreshSecret);
      expect(result).toEqual(mockDecoded);
    });

    it('deve lançar erro quando refresh token for inválido', () => {
      const mockError = new Error('Refresh token inválido');
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw mockError;
      });

      expect(() => verifyRefreshToken('refresh.token.invalido')).toThrow(
        'Refresh token inválido ou expirado',
      );

      expect(console.error).toHaveBeenCalledWith('Erro ao verificar refresh token:', mockError);
    });
  });

  describe('decodeAccessToken', () => {
    it('deve decodificar token sem verificação', () => {
      const mockDecoded = { data: mockUserId, iat: 123, exp: 456 };
      (jwt.decode as jest.Mock).mockReturnValue(mockDecoded);

      const result = decodeAccessToken(mockAccessToken);

      expect(jwt.decode).toHaveBeenCalledWith(mockAccessToken);
      expect(result).toEqual(mockDecoded);
    });

    it('deve retornar null para token inválido na decodificação', () => {
      (jwt.decode as jest.Mock).mockReturnValue(null);

      const result = decodeAccessToken('token.invalido');

      expect(result).toBeNull();
    });
  });

  describe('Integração entre geração e verificação', () => {
    it('deve gerar e verificar access token corretamente', () => {
      const mockDecoded = { data: mockUserId, iat: 123, exp: 456 };

      (jwt.sign as jest.Mock).mockReturnValue(mockAccessToken);
      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const token = generateAccessToken(mockUserId);
      const decoded = verifyAccessToken(token);

      expect(token).toBe(mockAccessToken);
      expect(decoded).toEqual(mockDecoded);
      expect(jwt.sign).toHaveBeenCalledWith({ data: mockUserId }, mockAccessSecret, {
        expiresIn: '15m',
      });
      expect(jwt.verify).toHaveBeenCalledWith(mockAccessToken, mockAccessSecret);
    });

    it('deve gerar tokens com expirações e chaves diferentes', () => {
      const calls: { secret: string; expiresIn: string }[] = [];

      (jwt.sign as jest.Mock).mockImplementation((payload, secret, options) => {
        calls.push({ secret, expiresIn: options.expiresIn });
        return `token-${options.expiresIn}`;
      });

      const accessToken = generateAccessToken(mockUserId);
      const refreshToken = generateRefreshToken(mockUserId);

      expect(calls).toContainEqual({
        secret: mockAccessSecret,
        expiresIn: '15m',
      });
      expect(calls).toContainEqual({
        secret: mockRefreshSecret,
        expiresIn: '90d',
      });
      expect(accessToken).toBe('token-15m');
      expect(refreshToken).toBe('token-90d');
    });
  });
});
