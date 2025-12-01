import type { UserData } from "../types/user-data";

export const signUpFieldsErrorChecker = (body: UserData): string | null => {
    
    const requiredFields = ['name', 'email', 'phone', 'password'];

    for (const field of requiredFields) {
        if (!body[field as keyof UserData]) {
            return 'Campos obrigatórios';
        }
    }

    return null;
};

export const loginFieldsErrorChecker = (body: UserData): string | null => {

    const { email, password } = body;

    if (!email || !password) {
        return 'Campos obrigatórios';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return 'Email inválido';
    }

    if (password.length < 6) {
        return 'Senha muito curta';
    }

    return null;
};