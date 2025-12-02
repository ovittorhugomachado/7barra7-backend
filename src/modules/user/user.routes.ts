import { Router } from 'express';
import { createUserController, getUserByIdController, updateUserController } from './user.controller';
import { authenticateToken } from '../../middleware/authenticate-token';

const router = Router();

router.post('/create-user', createUserController);

router.get('/user-data/:id', authenticateToken, getUserByIdController);

router.put('/update-user/me', authenticateToken, updateUserController);

export default router;
