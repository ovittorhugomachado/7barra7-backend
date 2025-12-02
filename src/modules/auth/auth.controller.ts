import type { Request, Response } from 'express';
import { handleControllerError } from '../../utils/error-handler';
import { loginService } from './auth.service';

export const loginController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const { accessToken7barra7, refreshAccessToken7barra7 } = await loginService(email, password);

        res.cookie("refreshToken", refreshAccessToken7barra7, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: 'Login efetuado com sucesso',
            accessToken: accessToken7barra7,
        });
        return;
    } catch (error) {
        handleControllerError(res, error);
    }
}