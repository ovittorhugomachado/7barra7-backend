/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../lib/prisma/prisma";
import type { Request, Response } from "express";
import { handleControllerError, NotFoundError, ValidationError } from "./error-handler";

export const VALID_NOTIFICATION_TAGS = [
    "PROMOTION",
    "AWARD",
    "UPDATE",
    "ATTENTION",
] as const;

export type NotificationTag = typeof VALID_NOTIFICATION_TAGS[number];

export function validateRequiredFields(body: any, fields: string[]) {
    for (const field of fields) {
        if (!body[field]) {
            throw new ValidationError(`O campo '${field}' é obrigatório.`);
        }
    }
}

export const sendNotificationService = async (data: {
    userId: number;
    tag: NotificationTag;
    title: string;
    text: string;
}) => {
    const { userId, tag, title, text } = data;

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new NotFoundError("Usuário não encontrado");
    }

    if (!VALID_NOTIFICATION_TAGS.includes(tag)) {
        throw new ValidationError(`O tipo de notificação '${tag}' não é válido.`);
    }

    return prisma.notification.create({
        data: { userId, tag, title, text },
    });
};

export const sendNotificationFunction = async (data: {
    userId: number;
    tag: NotificationTag;
    title: string;
    text: string;
}): Promise<{ message: string; notification: any }> => {
    const { userId, tag, title, text } = data;

    // Valida os campos obrigatórios
    if (!userId || !tag || !title || !text) {
        throw new ValidationError("Todos os campos obrigatórios devem ser preenchidos.");
    }

    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new NotFoundError("Usuário não encontrado");
    }

    // Valida a tag da notificação
    if (!VALID_NOTIFICATION_TAGS.includes(tag)) {
        throw new ValidationError(`O tipo de notificação '${tag}' não é válido.`);
    }

    // Cria a notificação
    const notification = await prisma.notification.create({
        data: { userId, tag, title, text },
    });

    return {
        message: "Notificação enviada com sucesso",
        notification,
    };
};

export const sendNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        validateRequiredFields(req.body, ["userId", "tag", "title", "text"]);

        const userId = Number(req.body.userId);
        if (isNaN(userId)) {
            throw new ValidationError("O campo userId deve ser um número válido.");
        }

        const notification = await sendNotificationService({
            userId,
            tag: req.body.tag,
            title: req.body.title,
            text: req.body.text,
        });

        res.status(201).json({
            message: "Notificação enviada com sucesso",
            notification,
        });
    } catch (error) {
        handleControllerError(res, error);
    }
};
