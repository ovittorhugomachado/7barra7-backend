import { Router } from 'express';
import { createUserController } from './user.controller';

const router = Router()

router.post('/create-user', createUserController)

export default router;