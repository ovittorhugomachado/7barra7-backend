import { Router } from 'express';
import { authenticateToken } from '../../middleware/authenticate-token';
import { loginController, testAuthenticateJwtController } from './tests.controller';

const router = Router();

router.post('/login', loginController);

router.get('/user-data', authenticateToken, testAuthenticateJwtController);

export default router;
