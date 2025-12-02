import { Router } from 'express';
import {
  createUserController,
  deleteUserController,
  getUserByIdController,
  updateUserController,
} from './user.controller';
import { authenticateToken } from '../../middleware/authenticate-token';

const router = Router();

router.post('/create-user', createUserController);

router.get('/user-data/me', authenticateToken, getUserByIdController);

router.put('/update-user/me', authenticateToken, updateUserController);

router.delete('/delete-user/me', authenticateToken, deleteUserController);

export default router;
