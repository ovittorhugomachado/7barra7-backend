import type { Request, Response } from 'express';
import { handleControllerError } from '../../utils/error-handler';
import { createUserService } from './user.service';
import { signUpFieldsErrorChecker } from '../../utils/field-error-checker';

export const createUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationError = signUpFieldsErrorChecker(req.body);
    if (validationError) {
      res.status(422).json({ error: validationError });
      return;
    }

    await createUserService(req.body);

    res.status(201).json({ message: 'Usuário criado com sucesso' });
    return;
  } catch (error) {
    handleControllerError(res, error);
  }
};

// export const getUserByIdController = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const userId = Number(req.params.id);
//     const user = await getUserByIdService(userId);

//     res.status(200).json(user);

//     return;
//   } catch (error) {
//     handleControllerError(res, error);
//   }
// };
