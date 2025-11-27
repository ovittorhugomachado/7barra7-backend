import { Request, Response, NextFunction } from 'express';
import { authenticateToken } from './authenticate-token';
import { generateAccessToken, verifyRefreshToken, verifyAccessToken } from '../lib/jwt/jwt';

jest.mock('../lib/jwt/jwt');

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      cookies: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn()
    };
    nextFunction = jest.fn();
    
    jest.clearAllMocks();
  });

    afterAll(() => {
    mockConsoleError.mockRestore();
    mockConsoleLog.mockRestore();
  });

  describe('authenticateToken', () => {
    it('deve permitir acesso com access token válido', () => {
      const mockAccessToken = 'valid.access.token';
      const mockDecoded = { data: 123, iat: 100, exp: 200 };
      
      mockRequest.headers = {
        authorization: `Bearer ${mockAccessToken}`
      };

      (verifyAccessToken as jest.Mock).mockReturnValue(mockDecoded);

      authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(verifyAccessToken).toHaveBeenCalledWith(mockAccessToken);
      expect(mockRequest.user).toEqual(mockDecoded);
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.setHeader).not.toHaveBeenCalled();
    });

    it('deve renovar access token com refresh token válido', () => {
      const mockRefreshToken = 'valid.refresh.token';
      const mockNewAccessToken = 'new.access.token';
      const mockDecoded = { data: 123, iat: 100, exp: 200 };
      
      mockRequest.cookies = {
        refreshToken: mockRefreshToken
      };

      (verifyAccessToken as jest.Mock).mockImplementation(() => {
        throw new Error('Token expirado');
      });
      
      (verifyRefreshToken as jest.Mock).mockReturnValue(mockDecoded);
      (generateAccessToken as jest.Mock).mockReturnValue(mockNewAccessToken);

      authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(verifyRefreshToken).toHaveBeenCalledWith(mockRefreshToken);
      expect(generateAccessToken).toHaveBeenCalledWith(mockDecoded.data);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Authorization', `Bearer ${mockNewAccessToken}`);
      expect(mockRequest.user).toEqual(mockDecoded);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('deve retornar 401 quando access token expira e refresh token é inválido', () => {
      const mockAccessToken = 'expired.access.token';
      const mockRefreshToken = 'invalid.refresh.token';
      
      mockRequest.headers = {
        authorization: `Bearer ${mockAccessToken}`
      };
      mockRequest.cookies = {
        refreshToken: mockRefreshToken
      };

      (verifyAccessToken as jest.Mock).mockImplementation(() => {
        throw new Error('Token expirado');
      });
      
      (verifyRefreshToken as jest.Mock).mockImplementation(() => {
        throw new Error('Refresh token inválido');
      });

      authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(verifyAccessToken).toHaveBeenCalledWith(mockAccessToken);
      expect(verifyRefreshToken).toHaveBeenCalledWith(mockRefreshToken);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Não autorizado. Tokens inválidos ou ausentes.'
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('deve retornar 401 quando não há tokens', () => {

      authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Não autorizado. Tokens inválidos ou ausentes.'
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('deve lidar com refresh token quando decoded é string', () => {

      const mockRefreshToken = 'valid.refresh.token';
      const mockNewAccessToken = 'new.access.token';
      const mockDecodedString = 'user123';
      
      mockRequest.cookies = {
        refreshToken: mockRefreshToken
      };

      (verifyAccessToken as jest.Mock).mockImplementation(() => {
        throw new Error('Token expirado');
      });
      
      (verifyRefreshToken as jest.Mock).mockReturnValue(mockDecodedString);
      (generateAccessToken as jest.Mock).mockReturnValue(mockNewAccessToken);

      authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(verifyRefreshToken).toHaveBeenCalledWith(mockRefreshToken);
      expect(generateAccessToken).toHaveBeenCalledWith(mockDecodedString);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Authorization', `Bearer ${mockNewAccessToken}`);
      expect(mockRequest.user).toEqual(mockDecodedString);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('deve extrair token corretamente do header Authorization', () => {
      const mockAccessToken = 'valid.token';
      const mockDecoded = { data: 123 };
      
      mockRequest.headers = {
        authorization: `Bearer ${mockAccessToken}`
      };

      (verifyAccessToken as jest.Mock).mockReturnValue(mockDecoded);

      authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(verifyAccessToken).toHaveBeenCalledWith(mockAccessToken);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('deve lidar com header Authorization mal formatado', () => {
      mockRequest.headers = {
        authorization: 'MalformedHeader'
      };

      authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('Cenários de erro', () => {
    it('deve lidar com erro inesperado na verificação do access token', () => {
      const mockAccessToken = 'valid.token';
      
      mockRequest.headers = {
        authorization: `Bearer ${mockAccessToken}`
      };

      (verifyAccessToken as jest.Mock).mockImplementation(() => {
        throw new Error('Erro inesperado');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(consoleSpy).toHaveBeenCalledWith('Erro ao verificar token de acesso:', expect.any(Error));
      consoleSpy.mockRestore();
    });

    it('deve lidar com erro inesperado na verificação do refresh token', () => {
      const mockRefreshToken = 'valid.refresh.token';
      
      mockRequest.cookies = {
        refreshToken: mockRefreshToken
      };

      (verifyAccessToken as jest.Mock).mockImplementation(() => {
        throw new Error('Token expirado');
      });
      
      (verifyRefreshToken as jest.Mock).mockImplementation(() => {
        throw new Error('Erro inesperado no refresh');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      authenticateToken(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(consoleSpy).toHaveBeenCalledWith('Erro ao verificar token de refresh:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});