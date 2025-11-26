import { Request, Response, NextFunction } from "express";
import { generateAccessToken, verifyRefreshToken, verifyAccessToken } from "../lib/jwt";

interface AuthResult {
    accessToken: string | null;
    refreshToken: string | null;
    decoded: string | null;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authResult: AuthResult = {
        accessToken: req.headers["authorization"]?.split(" ")[1] || null,
        refreshToken: req.cookies?.refreshToken || null,
        decoded: null,
    };

    if (authResult.accessToken) {
        try {
            const decoded = verifyAccessToken(authResult.accessToken);
            req.user = decoded;
            return next();
        } catch (err) {
            console.error("Erro ao verificar token de acesso:", err);
            console.log("Access token expirado ou inválido. Tentando refresh...");
        }
    }

    if (authResult.refreshToken) {
        try {
            const decoded = verifyRefreshToken(authResult.refreshToken);
            const newAccessToken = generateAccessToken(
                typeof decoded === "string" ? decoded : decoded.data
            );

            res.setHeader("Authorization", `Bearer ${newAccessToken}`); 
            req.user = decoded;
            return next(); 
        } catch (err) {
            console.error("Erro ao verificar token de refresh:", err);
            console.log("Refresh token inválido ou expirado.");
        }
    }

    return res.status(401).json({ message: "Não autorizado. Tokens inválidos ou ausentes." });
};