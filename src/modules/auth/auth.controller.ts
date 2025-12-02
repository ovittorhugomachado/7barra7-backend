import type { Request, Response } from 'express';
import { handleControllerError } from '../../utils/error-handler';
import { loginService, logouService } from './auth.service';

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const { accessToken7barra7, refreshToken7barra7 } = await loginService(email, password);

    res.cookie('refreshToken', refreshToken7barra7, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Login efetuado com sucesso',
      accessToken: accessToken7barra7,
    });
    return;
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const logoutController = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      logouService(refreshToken);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });

    res.status(200).json({ success: true, message: 'Logout realizado com sucesso' });
    return;
  } catch (error) {
    handleControllerError(res, error);
  }
};
